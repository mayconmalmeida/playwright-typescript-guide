# Engenharia de Automação com Playwright

## Capítulo 8 — Rodando Playwright no GitHub Actions: do teste local a um pipeline de CI confiável

**Status:** ✅ Publicado

**Nível:** Intermediário

**Pré-requisitos:** Capítulos 1 a 7, repositório no GitHub e noções básicas de YAML

**Objetivo:** transformar uma suíte que funciona localmente em um pipeline reproduzível, observável e investigável.

---

## O último “funciona na minha máquina”

Nos capítulos anteriores, estruturamos o projeto, escolhemos locators, separamos responsabilidades com Page Objects e organizamos contexto com Fixtures. Agora `npx playwright test` funciona localmente.

Isso ainda depende da máquina, das dependências e browsers instalados, das variáveis configuradas e de alguém lembrar de executar o comando. CI remove essa dependência pessoal: cada mudança é validada por um processo repetível em um ambiente novo.

O objetivo não é apenas deixar um ícone verde. É produzir uma resposta confiável e, quando houver falha, evidência suficiente para encontrar a causa.

## O que CI significa para nossa automação

```text
Pull Request / push
        ↓
GitHub Actions
        ↓
Runner Linux efêmero
        ↓
npm ci
        ↓
Playwright + browsers
        ↓
testes
        ↓
resultado + report + trace
        ↓
diagnóstico
```

Um runner hospedado nasce para o job e é descartado depois. Ele não herda `node_modules`, browsers ou o `.env` da sua máquina. Essa limpeza é uma vantagem: dependências ocultas deixam de passar despercebidas.

## Estrutura de um workflow

Um workflow operacional fica em `.github/workflows/playwright.yml`. `name` o identifica; `on` define os eventos; `jobs` reúne unidades de execução; `runs-on` escolhe o runner; e `steps` descreve ações e comandos em ordem.

```yaml
name: Playwright Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
```

O arquivo copiável está em [`examples/ci/workflows/minimal.yml`](../examples/ci/workflows/minimal.yml). Ele fica fora de `.github/workflows`, logo não cria execuções neste repositório.

## Por que `npm ci`?

`npm install` resolve dependências e pode atualizar o lockfile, algo útil ao desenvolver. `npm ci` exige um `package-lock.json` compatível, remove uma instalação anterior e instala exatamente o grafo registrado.

No runner limpo, essa rigidez favorece reprodutibilidade: revisão e CI usam as mesmas versões. `npm install` não é errado; `npm ci` normalmente expressa melhor a intenção de consumir um lockfile sem modificá-lo.

## Dependências npm não são browsers

```bash
npm ci
npx playwright install --with-deps
```

O primeiro comando instala pacotes Node. O segundo baixa os browsers compatíveis com a versão do Playwright e, no Linux, instala bibliotecas de sistema. Desde Playwright 1.38, instalar o pacote não baixa browsers automaticamente. Portanto, `npm ci` passar não prova que Chromium, Firefox ou WebKit conseguem iniciar.

Se o job executa somente Chromium, pode instalar apenas ele com `npx playwright install --with-deps chromium`. Faça isso por requisito explícito, não silenciosamente quando a configuração declara três projetos.

## Executando os testes

```bash
npx playwright test
npx playwright test --project=chromium
npx playwright test --grep "checkout"
npx playwright test --workers=1
```

O comando padrão executa a suíte. `--project` seleciona uma configuração, `--grep` filtra títulos e `--workers` controla concorrência. Use recortes para uma necessidade real, não como substituto para organizar a suíte.

## Variables e secrets

Configuração comum e não sensível, como uma URL pública, pode ser uma Actions Variable. Credenciais e tokens pertencem a Actions Secrets:

```yaml
env:
  BASE_URL: ${{ vars.BASE_URL }}
  TEST_USER_EMAIL: ${{ secrets.TEST_USER_EMAIL }}
  TEST_USER_PASSWORD: ${{ secrets.TEST_USER_PASSWORD }}
```

Configure-os em **Settings → Secrets and variables → Actions**, no escopo adequado. Nunca coloque valores reais no YAML, código, screenshots ou report. No Playwright, uma variável pode entrar em `use: { baseURL: process.env.BASE_URL }`.

Para segredo obrigatório, falhe com mensagem clara no setup em vez de usar credencial padrão. Secrets normalmente não chegam a workflows de pull requests originados em forks; uma suíte pública não deve presumir esse acesso. Não troque `pull_request` por `pull_request_target` apenas para obter secrets: executar código não confiável nesse contexto privilegiado pode comprometer o repositório. Projetos que aceitam contribuições externas devem consultar a documentação de segurança do GitHub e separar testes sem secrets dos fluxos privilegiados.

## O pipeline precisa deixar evidência

`Tests failed` informa o resultado, mas não explica a falha:

- **HTML report:** testes, passos, duração e anexos;
- **trace:** timeline, DOM, rede, console e ações;
- **screenshots:** estado visual pontual;
- **videos:** sequência visual, com maior custo;
- **logs:** mensagens do runner, aplicação e teste;
- **artifacts:** arquivos preservados fora do runner efêmero.

Evidência também pode conter dados sensíveis. Use contas de teste, evite registrar tokens e escolha retenção proporcional à investigação.

## Upload de artifacts

```yaml
- name: Upload Playwright report
  if: ${{ !cancelled() }}
  uses: actions/upload-artifact@v7
  with:
    name: playwright-report
    path: playwright-report/
    if-no-files-found: ignore
    retention-days: 14
```

`if: always()` tenta executar também após cancelamento. `if: failure()` economiza armazenamento, mas perde reports verdes. `if: ${{ !cancelled() }}` preserva sucesso ou falha sem prolongar uma execução cancelada. `if-no-files-found` explicita o caso em que a suíte nem chegou a criar o report.

## Trace no CI

```ts
use: { trace: 'on-first-retry' }
```

- `on` grava toda execução e custa mais tempo e espaço;
- `retain-on-failure` grava e descarta traces dos testes aprovados;
- `on-first-retry` grava a primeira repetição, equilibrando diagnóstico e custo quando há retries.

Abra um trace com `npx playwright show-trace caminho/trace.zip`. Ele não é apenas vídeo: permite inspecionar ações, snapshots, rede e console.

## Retries: resiliência não é correção

```ts
retries: process.env.CI ? 2 : 0,
```

Retries ajudam a coletar outra execução e absorver falhas transitórias enquanto o time investiga. **Retry não corrige teste flaky.** Um teste que só passa na repetição continua instável. O valor `2` é apenas um exemplo, não uma recomendação universal: a quantidade deve refletir o custo da suíte e a política de investigação do projeto. Use retries como resiliência controlada, não para converter vermelho em verde; corrija sincronização, isolamento, dados ou dependências.

## Workers: mais não é automaticamente melhor

```ts
workers: process.env.CI ? 1 : undefined,
```

Um worker em CI é um ponto inicial conservador, não uma regra universal. Ele prioriza previsibilidade e segue a recomendação inicial do Playwright. O valor pode evoluir conforme o isolamento dos testes, a infraestrutura, o volume e a duração da suíte e a capacidade do runner. Aumentá-lo usa mais CPU e memória e pode amplificar disputas por contas, banco, APIs e dados; paralelize depois de medir esses fatores.

## Timeout: diagnostique antes de aumentar

CI pode ser mais lento por CPU, rede, cold start ou concorrência. Antes de ajustar, identifique a ação lenta, valide o locator, examine rede e dependências externas, procure disputa de dados e confirme que o ambiente iniciou. Só aumente o timeout quando o comportamento esperado realmente exige mais tempo.

## Cache: acelerar sem esconder a instalação

```yaml
- uses: actions/setup-node@v7
  with:
    node-version: 22
    cache: npm
```

O cache reutiliza dados do npm com chave derivada do lockfile. Ele não restaura `node_modules` e não substitui `npm ci`. Evite cache customizado de browsers sem medição e invalidação compatível com a versão do Playwright.

## Passa localmente, falha no CI

| Sinal | Hipóteses a verificar |
|---|---|
| Configuração ausente | Variable ou secret não criado; secret indisponível em fork |
| Data/hora diferente | timezone, locale ou relógio usado como dado |
| Layout diferente | headless, viewport, fontes ou animações |
| Falha intermitente | race condition, sincronização ou serviço externo |
| Falha em paralelo | conta, banco, API ou arquivo compartilhado |
| Só falha em um browser | comportamento específico do engine |
| Arquivo não encontrado | arquivo não commitado, `.gitignore` ou caminho relativo |
| Só falha no Linux | case sensitivity, separador de caminho ou permissão |

Método de diagnóstico:

1. leia a primeira falha relevante;
2. identifique teste, projeto e tentativa;
3. consulte o HTML report;
4. abra o trace e correlacione ação, DOM, rede e console;
5. compare Node, browser, variáveis, timezone, locale e concorrência;
6. reproduza com a mesma configuração quando possível;
7. encontre e corrija a causa, não o sintoma;
8. execute novamente e confirme a explicação.

“Coloque retry”, “aumente o timeout” e “rode de novo” não são diagnósticos.

## Workflow recomendado

O ponto de partida profissional permanece pequeno: triggers de push e pull request, permissão somente de leitura do conteúdo, checkout, Node 22, cache npm, `npm ci`, browsers, testes e upload do report. `permissions: contents: read` aplica menor privilégio ao `GITHUB_TOKEN`; este job não precisa escrever no repositório. Veja o YAML completo em [`examples/ci/workflows/recommended.yml`](../examples/ci/workflows/recommended.yml).

O exemplo inclui `BASE_URL` como Variable e usuário/senha como Secrets para demonstrar a fronteira. Remova tudo que a aplicação não usa. Configuração sem consumidor cria ruído.

## Configuração Playwright para CI

[`examples/ci/playwright.config.ts`](../examples/ci/playwright.config.ts) demonstra:

```ts
export default defineConfig({
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
});
```

`forbidOnly` impede que um `test.only` limite silenciosamente a suíte. `list` mantém feedback nos logs e o HTML cria o artifact. Execute o exemplo isolado com:

```bash
npx playwright test --config=examples/ci/playwright.config.ts
```

## O que eu não colocaria nesse pipeline ainda

- matrix de browsers sem requisito;
- dezenas de jobs para uma suíte pequena;
- sharding antes de a duração justificá-lo;
- cache customizado de browsers sem medição;
- notificações duplicadas;
- retry excessivo para esconder instabilidade;
- lógica de negócio no YAML;
- etapas duplicadas ou dependências sem uso.

Primeiro faça o pipeline ser **reproduzível, observável e investigável**. Depois otimize com dados.

## Checklist

- [ ] O workflow executa em pull request?
- [ ] As dependências são instaladas com `npm ci`?
- [ ] Browsers e dependências Linux são instalados?
- [ ] Secrets permanecem fora do código e logs?
- [ ] O HTML report fica disponível?
- [ ] O trace fica disponível quando necessário?
- [ ] Artifacts possuem condição e retenção conscientes?
- [ ] Retries são controlados e investigados?
- [ ] O paralelismo respeita isolamento e recursos?
- [ ] Falhas podem ser investigadas após o runner ser descartado?
- [ ] O pipeline é reproduzível a partir do lockfile?

## Desafio prático

1. Copie o workflow recomendado para um repositório de exercício.
2. Abra uma pull request e confirme o gatilho.
3. Configure `BASE_URL` como Variable.
4. Configure credenciais fictícias de teste como Secrets.
5. Execute Playwright e gere o HTML report.
6. Provoque uma falha intencional.
7. Baixe o artifact e abra report e trace.
8. Identifique e corrija a causa.
9. Confirme que o pipeline ficou verde pela correção.

O aprendizado principal não é “o GitHub Actions ficou verde”. É “sei investigar quando ele fica vermelho”.

## Referências técnicas

- [Playwright — Continuous Integration](https://playwright.dev/docs/ci)
- [Playwright — Trace Viewer](https://playwright.dev/docs/trace-viewer-intro)
- [GitHub Actions — documentação](https://docs.github.com/actions)
- [`actions/checkout`](https://github.com/actions/checkout)
- [`actions/setup-node`](https://github.com/actions/setup-node)
- [`actions/upload-artifact`](https://github.com/actions/upload-artifact)
- [GitHub Actions — variables](https://docs.github.com/actions/how-tos/write-workflows/choose-what-workflows-do/use-variables)
- [GitHub Actions — secrets](https://docs.github.com/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets)

Versões consultadas em setembro de 2026: `checkout@v7`, `setup-node@v7` e `upload-artifact@v7`. São os majors atuais dos repositórios oficiais das Actions; o snippet de CI do Playwright ainda mostra majors anteriores. O guia mantém a estrutura recomendada pelo Playwright e adota as versões atuais diretamente das Actions, sem afirmar que os números coincidem. Confira releases oficiais e compatibilidade do runner antes de copiar para outro projeto.

## Artigo no blog

Leia também o artigo editorial: [Rodando Playwright no GitHub Actions: do teste local a um pipeline de CI confiável](https://mayconmalicheskidealmeida.vercel.app/artigos/playwright-github-actions-ci).

## Capítulo anterior

⬅ [Capítulo 7 — Trabalhando com Fixtures](./07-trabalhando-com-fixtures.md)

## Próximo capítulo

➡ [Capítulo 9 — CI/CD com Playwright: validando aplicações antes e depois do deploy](./09-playwright-cicd-deploy.md)
