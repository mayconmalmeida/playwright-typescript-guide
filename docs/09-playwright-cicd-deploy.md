# Engenharia de Automação com Playwright

## Capítulo 9 — CI/CD com Playwright: validando aplicações antes e depois do deploy

**Status:** 🛠️ Implementado no repositório · artigo pendente de publicação

**Nível:** Intermediário/Avançado

**Pré-requisitos:** Capítulos 1 a 8, em especial o [Capítulo 8 — GitHub Actions](./08-playwright-github-actions-ci.md)

**Objetivo:** sair de uma pipeline que *executa* testes para uma estratégia de entrega que *usa* testes automatizados como critério de liberação.

**Exemplos:** [`examples/cicd/`](../examples/cicd/)

---

## O problema: o pipeline verde que não decide nada

No Capítulo 8, a suíte passou a rodar em cada pull request, com report, trace e artifacts. Isso responde "os testes passaram?". Não responde:

- o merge pode acontecer se eles falharem?
- o preview que a plataforma publicou está funcionando?
- o deploy em produção realmente serve a versão nova?
- quem é avisado quando produção quebra logo após o deploy?

Um workflow vermelho que ninguém é obrigado a respeitar é informação, não controle. Este capítulo trata do passo seguinte: transformar o resultado dos testes em **critério de liberação**, sabendo exatamente o que o repositório controla e o que depende de configuração externa.

## CI e CD

| | CI — Integração Contínua | CD — Entrega/Deploy Contínuo |
|---|---|---|
| Pergunta | "Esta mudança pode entrar?" | "Esta versão pode chegar ao usuário? Chegou bem?" |
| Alvo | código do PR em um runner | ambiente implantado (preview, staging, produção) |
| Momento | antes do merge | antes e depois do deploy |
| Falha significa | não integrar | não promover, ou investigar e reverter |

Os testes podem ser os mesmos. O que muda é **contra o quê** rodam e **o que acontece** com o resultado.

## Arquitetura do exemplo

```text
Pull Request
    │
    ▼
Preview efêmero no runner (pull-request-gate.yml)      Preview na plataforma (preview-validation.yml)
    │                                                       │
    ▼                                                       ▼
Smoke tests ─────────────────────────────────────────── Smoke tests
    │
    ▼
Quality Gate (job) ──► required status check ──► proteção da branch
    │
    ├── falhou ──► merge bloqueado (se o check for obrigatório)
    │
    └── passou ──► merge ──► deploy pela plataforma
                                   │
                                   ▼
                     Smoke pós-deploy (production-smoke.yml)
                                   │
                                   ▼
                     Report + trace + resumo de investigação
```

| Arquivo | Responsabilidade |
|---|---|
| [`app/server.js`](../examples/cicd/app/server.js) | aplicação de demonstração (Node puro) |
| [`environment.ts`](../examples/cicd/environment.ts) | resolve `local`, `preview` ou `production` e recusa combinações perigosas |
| [`readiness.ts`](../examples/cicd/readiness.ts) | global setup: espera o health check antes dos testes |
| [`playwright.config.ts`](../examples/cicd/playwright.config.ts) | gate sem retries, evidências e filtro de produção |
| [`tests/smoke.example.ts`](../examples/cicd/tests/smoke.example.ts) | smoke somente de leitura |
| [`tests/feedback.example.ts`](../examples/cicd/tests/feedback.example.ts) | teste que cria dados (`@write`) |
| [`workflows/`](../examples/cicd/workflows/) | gate de PR, validação de preview, smoke de produção |

### Por que uma aplicação de demonstração local?

Testar o blog, um sistema real ou um site de terceiros tornaria o exemplo não determinístico e poderia gerar tráfego indevido. A aplicação em [`app/server.js`](../examples/cicd/app/server.js) não tem dependências, roda com `node` e oferece exatamente o que um smoke precisa: páginas, navegação, um formulário e um health check em `/api/health`. Ela também aceita `DEMO_FAILURE` para simular regressões e provar que o gate falha. Nenhuma conta Vercel é necessária.

## Configuração por ambiente

Toda a seleção de ambiente passa por duas variáveis:

```bash
PLAYWRIGHT_TARGET_ENV=local|preview|production
PLAYWRIGHT_BASE_URL=https://...
```

A regra está em [`environment.ts`](../examples/cicd/environment.ts): **só `local` tem URL padrão**.

```ts
if (!rawUrl) {
  throw new Error(
    `PLAYWRIGHT_TARGET_ENV="${targetEnv}" exige PLAYWRIGHT_BASE_URL. ` +
      'Não existe URL padrão para ambientes remotos.',
  );
}
```

E o caso inverso também é bloqueado: uma URL remota sem ambiente declarado.

```ts
if (!LOOPBACK_HOSTS.includes(parseUrl(rawUrl).hostname)) {
  throw new Error(
    `PLAYWRIGHT_BASE_URL aponta para "${rawUrl}", mas PLAYWRIGHT_TARGET_ENV é "local". ` +
      'Declare explicitamente PLAYWRIGHT_TARGET_ENV=preview ou production.',
  );
}
```

Sem essa trava, alguém poderia exportar a URL de produção "só para conferir" e executar testes que criam dados. Ambientes remotos também exigem `https`.

### Configuração não é credencial

| Tipo | Exemplo | Onde fica |
|---|---|---|
| Configuração | URL pública, nome do ambiente, timeout | `.env.example`, Actions **Variables** |
| Credencial | token, senha, chave de bypass | Actions **Secrets**, nunca no repositório |

O exemplo não usa credenciais. [`.env.example`](../examples/cicd/.env.example) documenta as variáveis e pode ser commitado; um `.env` real não (ele está no `.gitignore`).

### Testes destrutivos não chegam à produção

Testes que criam ou alteram dados recebem a tag `@write`:

```ts
test('formulário de contato aceita uma mensagem', { tag: ['@smoke', '@write'] }, async ({ page }) => {
```

O config os exclui em produção. A exclusão não depende de alguém lembrar de um `--grep`:

```ts
grepInvert: target.env === 'production' ? /@write/ : undefined,
```

Confirme sem executar nada:

```bash
PLAYWRIGHT_TARGET_ENV=production PLAYWRIGHT_BASE_URL=https://exemplo.com \
  npx playwright test --config=examples/cicd/playwright.config.ts --list
```

Em `production`, a listagem mostra 7 testes em 1 arquivo; em `preview`, 8 testes em 2 arquivos.

## Smoke tests

Smoke test responde "a versão publicada está de pé e o caminho crítico funciona?". Ele é pequeno, rápido, somente de leitura e independente de dados que mudam. Não substitui a suíte de regressão.

[`smoke.example.ts`](../examples/cicd/tests/smoke.example.ts) cobre:

| Cenário | Como |
|---|---|
| aplicação acessível | `GET /api/health` responde 200 com `status: ok` |
| rotas críticas sem erro HTTP | `/`, `/cursos`, `/contato` respondem 200 |
| página principal e elemento essencial | heading `Catálogo de Cursos` e link `Ver cursos` visíveis |
| sem erros nos recursos da própria aplicação | respostas `>= 400` da mesma origem são coletadas e devem ser zero |
| navegação crítica | clicar em `Ver cursos` leva a `/cursos` com itens no catálogo |
| versão implantada | opcional: health check informa a versão esperada |

As mensagens de falha dizem o que quebrou:

```ts
expect(response.status(), `GET ${route} retornou ${response.status()}`).toBe(200);
```

A verificação de versão pega um problema silencioso comum: o deploy "terminou", mas o domínio ainda serve o build anterior (cache, alias não promovido, deploy em outro projeto).

```ts
test.skip(!expected, 'PLAYWRIGHT_EXPECTED_VERSION não definida: verificação de versão desativada.');
// ...
expect(version, 'o ambiente ainda serve outra versão').toBe(expected);
```

Ela só funciona se a aplicação expõe a versão no health check. Na demonstração, `APP_VERSION` cumpre esse papel.

### Esperar o ambiente sem `sleep`

[`readiness.ts`](../examples/cicd/readiness.ts) é o `globalSetup`. Antes de qualquer teste, ele consulta o health check até responder 2xx ou até `PLAYWRIGHT_READY_TIMEOUT_MS`. É uma espera **por condição, com prazo**, não um `sleep` fixo:

- responde 2xx: os testes começam;
- não responde (ECONNREFUSED, ENOTFOUND, timeout): tenta de novo até o prazo;
- responde 4xx: falha imediatamente, porque esperar não corrige 401, 403 ou 404;
- estoura o prazo: falha com a última observação e **nenhum teste funcional é executado**.

Assim, "o preview ainda não subiu" nunca aparece como "o botão sumiu".

No modo `local`, o `webServer` do Playwright sobe a aplicação:

```ts
webServer: target.startLocalServer
  ? {
      command: 'node app/server.js',
      env: { PORT: new URL(target.baseURL).port },
      url: `${target.baseURL}/api/health`,
      // Reaproveitar um servidor já aberto na porta pode testar outra aplicação
      // sem aviso. No gate, preferimos falhar com "porta em uso".
      reuseExistingServer: false,
      timeout: 30_000,
    }
  : undefined,
```

`reuseExistingServer: false` vem de um problema real encontrado ao construir este exemplo. A primeira versão usava a porta 4173, padrão do `vite preview`, com `reuseExistingServer: !CI`. Outra aplicação local já ocupava a porta e também tinha um `/api/health` respondendo 200. O readiness passou, o Playwright reaproveitou o servidor errado e os testes falharam com 404 e headings ausentes, sintomas que pareciam regressão. Em um gate, um servidor desconhecido na porta deve gerar erro de ambiente, não um resultado de teste.

## Pipeline de preview

Existem duas formas de ter um "preview" para testar, e o exemplo cobre ambas.

### 1. Preview efêmero no runner — [`pull-request-gate.yml`](../examples/cicd/workflows/pull-request-gate.yml)

O próprio runner sobe a aplicação a partir do código do PR e executa os smoke tests. Vantagens: não depende de plataforma, não precisa de secrets e é seguro para PRs de forks. Limitação: testa o build no runner, não o artefato que a plataforma vai servir.

```yaml
on:
  pull_request:
    branches: [main]

permissions:
  contents: read
```

```yaml
- name: Run smoke tests
  run: npx playwright test --config="$PLAYWRIGHT_CONFIG"
  env:
    PLAYWRIGHT_TARGET_ENV: local
```

### 2. Preview implantado pela plataforma — [`preview-validation.yml`](../examples/cicd/workflows/preview-validation.yml)

Plataformas como a Vercel publicam um preview por PR e, pela integração com GitHub, registram um **deployment** no repositório. Quando o deployment muda de estado, o GitHub emite o evento `deployment_status`, que traz a URL publicada:

```yaml
on:
  deployment_status:
  workflow_dispatch:
    inputs:
      preview_url:
        description: URL https do preview já implantado
        required: true
        type: string
```

```yaml
if: >-
  github.event_name == 'workflow_dispatch' ||
  (github.event.deployment_status.state == 'success' &&
   startsWith(github.event.deployment.environment, 'preview'))
```

Pontos importantes:

- **Nem todo PR tem preview.** O workflow só reage quando a plataforma informa um deployment `success`. Sem esse evento, nada roda. A URL nunca é inventada.
- **Sem fallback para produção.** Se o evento não trouxer `environment_url`, o primeiro passo falha. O config também recusa `preview` sem URL.
- **Nomes de ambiente variam.** Na Vercel, o nome típico começa com `Preview`. Confira os nomes na aba *Deployments* do seu repositório antes de copiar a condição (`startsWith` no GitHub Actions ignora maiúsculas e minúsculas).
- **Verifique se sua plataforma cria deployments no GitHub.** Se não criar, use o disparo manual com a URL ou a forma de integração documentada pela plataforma.
- **Dados do evento entram por `env`**, nunca interpolados dentro do script de `run`. Isso evita injeção de comandos.

#### Segurança com pull requests externos

O job de preview executa o código do commit implantado. Por isso:

- `permissions: contents: read` e `persist-credentials: false`;
- **nenhum secret** no workflow. Se você adicionar um, código de um PR passa a ter acesso a ele;
- configure a plataforma para **exigir autorização antes de implantar PRs de forks**;
- não troque `pull_request` por `pull_request_target` para obter secrets (veja o Capítulo 8).

Se os previews forem protegidos por autenticação da plataforma (Deployment Protection, por exemplo), o readiness falha com `HTTP 401/403 — acesso negado`. Liberar o acesso exige um token de bypass, que é um secret, e isso reabre a questão acima. Restrinja esse uso a branches confiáveis.

## Quality gates

"O teste falhou" e "o deploy foi bloqueado" são eventos diferentes, ligados por uma cadeia que pode se romper em qualquer elo:

| Elo | O que é | Onde vive | Implementado aqui? |
|---|---|---|---|
| Teste falhou | um `expect` não foi satisfeito | código do teste | ✅ |
| Job falhou | `npx playwright test` terminou com exit code ≠ 0 | runner | ✅ |
| Check falhou | o job aparece vermelho no commit/PR | GitHub Checks | ✅ ao copiar o workflow |
| Check obrigatório | a regra da branch exige aquele check | **Settings do repositório** | ❌ configuração externa |
| Merge bloqueado | o GitHub impede o merge enquanto o check obrigatório não passa | **proteção de branch / ruleset** | ❌ configuração externa |
| Deploy bloqueado | a plataforma ou o workflow não promove a versão | **plataforma de deploy / environment** | ❌ configuração externa |

Copiar um YAML para `.github/workflows/` não bloqueia nada sozinho. Sem a regra da branch, um PR com check vermelho continua mesclável.

### O job `Quality Gate`

[`pull-request-gate.yml`](../examples/cicd/workflows/pull-request-gate.yml) termina com um job agregador:

```yaml
quality-gate:
  name: Quality Gate
  needs: [smoke]
  if: ${{ always() }}
  runs-on: ubuntu-latest
  timeout-minutes: 5
  steps:
    - name: Evaluate required jobs
      env:
        SMOKE_RESULT: ${{ needs.smoke.result }}
      run: |
        echo "smoke: $SMOKE_RESULT"
        if [ "$SMOKE_RESULT" != "success" ]; then
          echo "::error title=Quality Gate::Smoke tests terminaram como '$SMOKE_RESULT'. Consulte os artifacts pr-smoke-report e pr-smoke-test-results."
          exit 1
        fi
        echo "Quality Gate aprovado."
```

Por que não marcar `smoke` diretamente como obrigatório?

1. **Um nome estável.** Quando o pipeline ganhar jobs (lint, unit, e2e), o check obrigatório continua sendo `Quality Gate`; só a lista em `needs` muda.
2. **`if: always()` é essencial.** Sem ele, quando `smoke` falha, o job dependente é *skipped*. A documentação do GitHub diz que um job pulado reporta **sucesso** e não impede o merge, mesmo como required check: required checks aceitam os estados `successful`, `skipped` e `neutral`. O gate avalia `needs.smoke.result` explicitamente e trata `failure`, `cancelled` e `skipped` como reprovação.

### Configurando o bloqueio de merge (externo)

Em **Settings → Rules → Rulesets** (ou **Settings → Branches → Branch protection rules**) para `main`:

1. ative **Require a pull request before merging**;
2. ative **Require status checks to pass** e adicione `Quality Gate`. Para o check aparecer na busca, execute o workflow ao menos uma vez antes. Use nomes de job únicos entre todos os workflows, ou o check obrigatório fica ambíguo;
3. considere **Require branches to be up to date before merging**, para que o gate tenha validado o código que será integrado;
4. decida se administradores podem contornar a regra.

Este capítulo **não** altera configurações reais deste repositório. Faça isso no seu repositório de exercício.

**Cuidado com o preview como check obrigatório.** `Smoke tests (preview)` só existe quando a plataforma implanta um preview. Se for obrigatório e um PR não tiver preview, o check fica pendente para sempre e o merge trava. Torne-o obrigatório somente se todo PR tiver preview garantido.

### Bloqueando o deploy

Se a plataforma implanta automaticamente a cada push em `main` (comum na Vercel), o workflow **não** controla esse deploy. Há três caminhos reais:

1. **Bloquear o merge** com required checks. O que não entra em `main` não é implantado. É o controle que este exemplo habilita.
2. **Condicionar a promoção na plataforma.** Algumas plataformas permitem aguardar checks do GitHub antes de promover para produção. Consulte a documentação da sua.
3. **Fazer o deploy pelo GitHub Actions**, encadeando jobs com `needs` e protegendo o job de deploy com um *environment*:

```yaml
# Esboço: não incluído como arquivo porque depende do comando de deploy da sua plataforma.
jobs:
  smoke:
    # ... mesmo job do pull-request-gate.yml
  deploy:
    needs: [smoke]          # não começa se smoke falhar
    environment: production # regras de proteção do environment se aplicam aqui
    runs-on: ubuntu-latest
    steps:
      - run: echo "comando de deploy da sua plataforma"
  production-smoke:
    needs: [deploy]
    # ... mesmo job do production-smoke.yml
```

Em **Settings → Environments → production** é possível exigir revisores, aguardar um tempo e limitar quais branches e tags implantam. No plano Free, environments só podem ser configurados em repositórios públicos; repositórios privados exigem planos pagos, e a disponibilidade de cada regra varia por plano.

## Validação pós-deploy

[`production-smoke.yml`](../examples/cicd/workflows/production-smoke.yml) roda **depois** que a plataforma concluiu o deploy de produção, por `deployment_status`, ou manualmente por `workflow_dispatch`.

```yaml
env:
  PRODUCTION_URL: ${{ vars.PRODUCTION_URL }}
  EXPECTED_VERSION: ${{ github.event.deployment.sha || inputs.expected_version }}
```

```yaml
- name: Run read-only smoke tests
  run: npx playwright test --config="$PLAYWRIGHT_CONFIG"
  env:
    PLAYWRIGHT_TARGET_ENV: production
    PLAYWRIGHT_BASE_URL: ${{ env.PRODUCTION_URL }}
    PLAYWRIGHT_EXPECTED_VERSION: ${{ vars.HEALTH_EXPOSES_VERSION == 'true' && env.EXPECTED_VERSION || '' }}
    PLAYWRIGHT_READY_TIMEOUT_MS: '120000'
```

Decisões:

- **URL do domínio público, não do evento.** Em plataformas como a Vercel, a `environment_url` de um deployment pode ser a URL única daquele build, não o domínio que o usuário acessa. O smoke pós-deploy valida o que o usuário vê, então a URL vem da variable `PRODUCTION_URL`. Se ela não existir, o job falha.
- **Somente leitura.** `PLAYWRIGHT_TARGET_ENV=production` exclui `@write` pelo config.
- **Evento confiável.** `deployment_status` de produção vem da plataforma após o deploy de `main`; `workflow_dispatch` exige permissão de escrita no repositório.
- **Sem cancelamento entre execuções.** Cada deploy merece seu resultado.

### Pós-deploy não é gate

Quando este workflow falha, **o deploy já aconteceu**. Ele detecta, não previne. Por isso o job escreve um resumo de investigação em `$GITHUB_STEP_SUMMARY` em vez de reverter algo:

```text
O deploy já está no ar. Este workflow não faz rollback.
1. Leia o log: falha em [readiness] indica ambiente indisponível, não regressão.
2. Baixe production-smoke-report e production-smoke-test-results e abra o trace.
3. Confirme o impacto para usuários antes de decidir.
4. Se confirmado, faça rollback pela plataforma de deploy e registre a decisão.
```

## Evidências e diagnóstico

[`playwright.config.ts`](../examples/cicd/playwright.config.ts):

```ts
retries: 0,
// ...
reporter: [
  ['list'],
  ...(isCI ? [['github'] as const] : []),
  ['html', { outputFolder: 'playwright-report', open: 'never' }],
],
use: {
  baseURL: target.baseURL,
  navigationTimeout: 15_000,
  trace: 'retain-on-failure',
  screenshot: 'only-on-failure',
},
```

- **`retries: 0`.** No Capítulo 8, retries coletavam evidência de instabilidade. Em um gate de liberação, um teste que só passa na segunda tentativa é sinal de problema. Se o ambiente demora a subir, quem espera é o readiness, não o retry.
- **`trace: 'retain-on-failure'`.** Sem retries, `on-first-retry` nunca gravaria nada.
- **Reporter `github`** publica no run um resumo da execução como anotação, com os testes que falharam.
- **Artifacts:** o HTML report sobe sempre que a execução não foi cancelada; `test-results/` (traces e screenshots) sobe em falha.
- **`outputDir: './test-results'` explícito.** O `outputFolder` do HTML report é relativo ao arquivo de config, mas o `outputDir` padrão é relativo ao `package.json`, que aqui é a raiz do repositório. Sem a linha explícita, traces e screenshots iriam para `./test-results` e o upload de `examples/cicd/test-results/` não encontraria nada. O erro só apareceria no dia em que alguém precisasse do trace.
- **Exit code:** `npx playwright test` termina com código diferente de zero quando algum teste falha. É isso que faz o job e o check falharem.

### Lendo a falha

| Sintoma no log | Categoria | Próximo passo |
|---|---|---|
| `PLAYWRIGHT_TARGET_ENV="production" exige PLAYWRIGHT_BASE_URL` | erro de configuração | revisar variables/inputs do workflow |
| `PLAYWRIGHT_BASE_URL aponta para "...", mas PLAYWRIGHT_TARGET_ENV é "local"` | erro de configuração | declarar o ambiente explicitamente |
| `[readiness] ... sem resposta (ECONNREFUSED)` | aplicação indisponível | o servidor está de pé? porta correta? |
| `[readiness] ... sem resposta (ENOTFOUND)` | erro de configuração/DNS | URL digitada errada ou preview removido |
| `[readiness] ... não ficou pronto` após o prazo | preview ainda não preparado | ver logs de build da plataforma; ajustar o prazo só com evidência |
| `[readiness] ... HTTP 401/403` | ambiente protegido | Deployment Protection ou autenticação |
| `[readiness] ... HTTP 404` | erro de configuração | URL base ou `PLAYWRIGHT_HEALTH_PATH` |
| `Timed out waiting 30000ms from config.webServer` | problema de ambiente local | a aplicação não subiu ou o health não responde 2xx |
| `http://127.0.0.1:4317/api/health is already used` | problema de ambiente | outro processo usa a porta |
| `GET /cursos retornou 500` | falha real de funcionalidade | abrir report e trace; checar logs do servidor |
| `Test timeout ... waiting for getByRole(...)` | elemento ausente ou página errada | abrir o screenshot: é a página esperada? |
| `o ambiente ainda serve outra versão` | deploy incompleto | alias/promoção/cache na plataforma |

Para reproduzir localmente uma execução de CI que falhou:

```bash
npx playwright show-report examples/cicd/playwright-report
npx playwright show-trace caminho/para/trace.zip
```

## Estratégias de rollback

O exemplo **não** implementa rollback automático. Ele entrega o sinal; a decisão continua humana. Estratégias comuns:

| Estratégia | Como funciona | Cuidados |
|---|---|---|
| Re-promover o deploy anterior | a plataforma volta o domínio para um build anterior | rápido; não desfaz migrações de banco |
| `git revert` + novo deploy | reverte o commit e passa pelo pipeline completo | mais lento, mas rastreável e validado pelo gate |
| Feature flag | desliga a funcionalidade sem novo deploy | exige a flag existir antes do incidente |
| Canary / blue-green | expõe a versão a uma fração do tráfego antes da troca | exige infraestrutura de roteamento |

Rollback automático baseado em smoke é possível, mas exige confiança alta nos testes. Um falso positivo derrubaria uma versão saudável. Comece com alerta e decisão humana.

## Homologação no GitHub Actions

Os três arquivos em [`examples/cicd/workflows/`](../examples/cicd/workflows/) são **didáticos**: ficam fora de `.github/workflows/` e não executam sozinhos. Para comprovar o gate de PR em execução real, este repositório tem um workflow **operacional**, [`.github/workflows/chapter-09-quality-gate.yml`](../.github/workflows/chapter-09-quality-gate.yml). O conteúdo é idêntico ao de `pull-request-gate.yml`; mudam só um cabeçalho de comentário e o `name` (`Chapter 09 Quality Gate`).

| Item | Situação |
|---|---|
| `pull-request-gate.yml` (via workflow operacional) | ✅ executado no GitHub Actions |
| Job `Quality Gate` | ✅ executado; aprova e reprova conforme o smoke |
| Required status check `Quality Gate` | ❌ não configurado: depende de ruleset/proteção da `main` |
| `preview-validation.yml` | ❌ não executado remotamente: exige plataforma de preview |
| `production-smoke.yml` | ❌ não executado remotamente: exige deploy real e `PRODUCTION_URL` |

Execuções registradas no PR [#1](https://github.com/mayconmalmeida/playwright-typescript-guide/pull/1):

| Cenário | Commit | Run | Smoke | Quality Gate | Artifacts |
|---|---|---|---|---|---|
| Código normal | `2b00385` | [37941729389](https://github.com/mayconmalmeida/playwright-typescript-guide/actions/runs/37941729389) | ✅ 7 passed, 1 skipped | ✅ success | `pr-smoke-report` |
| Regressão simulada (`DEMO_FAILURE=courses-500`, revertida em seguida) | `e24d5d7` | [37945003835](https://github.com/mayconmalmeida/playwright-typescript-guide/actions/runs/37945003835) | ❌ 2 failed, exit code 1 | ❌ failure | `pr-smoke-report`, `pr-smoke-test-results` |

A segunda execução comprova a cadeia até onde o repositório controla: teste falhou → passo terminou com exit code 1 → job `Smoke tests` falhou → job `Quality Gate` falhou com a anotação "Smoke tests terminaram como 'failure'" → traces e screenshots foram preservados. O próximo elo, impedir o merge, só passa a existir quando `Quality Gate` é marcado como obrigatório. Isso não foi feito neste repositório.

## Limitações reais desta implementação

- **Apenas o gate de PR foi executado no GitHub Actions** (veja a seção anterior). Os workflows de preview e produção foram validados apenas por sintaxe YAML e schema.
- **Nenhuma integração com Vercel ou outra plataforma foi testada.** A lógica de `deployment_status` segue a documentação de eventos do GitHub; nomes de ambiente e URLs variam por plataforma.
- **Proteção de branch e de environment não foram configuradas** aqui. São passos manuais descritos acima.
- **A aplicação de demonstração não tem build, banco ou autenticação.** Em uma aplicação real, o preview efêmero no runner exige o comando de build e dependências próprias.
- **O smoke não substitui regressão.** Ele cobre caminho crítico e disponibilidade.
- **Sem rollback automático e sem notificação externa.** O sinal fica no GitHub (check, anotação, step summary).
- **Validação local feita em Windows.** O runner do exemplo é Linux; diferenças de ambiente seguem o Capítulo 8.

## Checklist de adoção

- [ ] Existe um health check que responde rápido e sem autenticação?
- [ ] A suíte de smoke é curta, somente de leitura e independente de dados voláteis?
- [ ] Testes que escrevem dados estão marcados e excluídos de produção pelo config?
- [ ] Ambientes remotos exigem URL explícita, sem padrão?
- [ ] Uma URL remota sem ambiente declarado é recusada?
- [ ] O readiness distingue "ambiente não pronto" de "funcionalidade quebrada"?
- [ ] O gate roda sem retries?
- [ ] Existe um job agregador com `needs` e `if: always()`?
- [ ] O check `Quality Gate` está marcado como obrigatório na branch principal?
- [ ] O caminho do deploy respeita o resultado (merge bloqueado, promoção condicionada ou `needs` + environment)?
- [ ] Workflows que executam código de PR não recebem secrets?
- [ ] O smoke pós-deploy usa o domínio público e verifica a versão implantada?
- [ ] Existe um procedimento de rollback documentado e testado?

## Desafio prático

1. Faça um fork deste repositório e copie [`pull-request-gate.yml`](../examples/cicd/workflows/pull-request-gate.yml) para `.github/workflows/`.
2. Abra um PR e confirme que `Smoke tests` e `Quality Gate` aparecem.
3. Configure um ruleset em `main` exigindo `Quality Gate`.
4. Em outro PR, provoque uma regressão real em `app/server.js` (por exemplo, renomeie o heading da página inicial) e confirme que o merge fica bloqueado.
5. Baixe `pr-smoke-test-results`, abra o trace e identifique a causa.
6. Corrija e confirme que o gate voltou a passar pela correção.
7. **Extra:** remova `if: ${{ always() }}` do job `Quality Gate`, repita o passo 4 e observe o que acontece com o merge. Restaure em seguida.
8. **Extra:** escreva um teste `@write` e confirme com `--list` que ele não aparece em `production`.

## Executando localmente

```bash
npm ci
npx playwright install chromium

# gate local: 7 passam, 1 pulado (verificação de versão sem PLAYWRIGHT_EXPECTED_VERSION)
npx playwright test --config=examples/cicd/playwright.config.ts

# falha controlada: exit code 1
DEMO_FAILURE=courses-500 npx playwright test --config=examples/cicd/playwright.config.ts

# ambiente indisponível: falha no readiness, nenhum teste executado
PLAYWRIGHT_TARGET_ENV=preview PLAYWRIGHT_BASE_URL=https://localhost:4999 \
  PLAYWRIGHT_READY_TIMEOUT_MS=5000 npx playwright test --config=examples/cicd/playwright.config.ts

# verificação de versão
APP_VERSION=abc123 PLAYWRIGHT_EXPECTED_VERSION=abc123 \
  npx playwright test --config=examples/cicd/playwright.config.ts
```

## Referências técnicas

- [Playwright — Continuous Integration](https://playwright.dev/docs/ci)
- [Playwright — Web server](https://playwright.dev/docs/test-webserver)
- [Playwright — Global setup and teardown](https://playwright.dev/docs/test-global-setup-teardown)
- [Playwright — Annotations e tags](https://playwright.dev/docs/test-annotations)
- [GitHub Actions — evento `deployment_status`](https://docs.github.com/actions/reference/workflows-and-actions/events-that-trigger-workflows#deployment_status)
- [GitHub Actions — condições de jobs](https://docs.github.com/actions/how-tos/write-workflows/choose-when-workflows-run/control-jobs-with-conditions)
- [GitHub — protected branches e required status checks](https://docs.github.com/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub — rulesets](https://docs.github.com/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)
- [GitHub — environments para deploy](https://docs.github.com/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments)
- [GitHub — security hardening para GitHub Actions](https://docs.github.com/actions/reference/security/secure-use)

As versões das Actions (`checkout@v7`, `setup-node@v7`, `upload-artifact@v7`) seguem as adotadas no Capítulo 8. Confira releases oficiais antes de copiar para outro projeto.

## Capítulo anterior

⬅ [Capítulo 8 — Rodando Playwright no GitHub Actions](./08-playwright-github-actions-ci.md)

## Próximo capítulo

➡ Capítulo 10 — Projeto Final, conforme definido no roadmap.
