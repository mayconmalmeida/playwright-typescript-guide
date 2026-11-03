# Capítulo 10 — Homologação final e release readiness

**Sprint:** 10.7 · **Data:** 03/11/2026 (America/Fortaleza)

**Resultado:** PASS · **Prontidão técnica:** READY, aguardando revisão

**Publicação:** não realizada. A Sprint 10.8 não foi iniciada.

## Baseline e escopo

- Repositório: `mayconmalmeida/playwright-typescript-guide`.
- Branch: `feat/playwright-chapter-10-final-project`.
- Baseline auditado: `e4ac35edcf21f45ffcaa71a700f5807850c0c091`.
- Preflight: branch e HEAD conferidos; working tree inicialmente limpa; `git diff --check` aprovado.
- `origin/main`, consultada por fetch: `a879b085244a99256ade62bf776b7522891dbb44`. É ancestral do baseline e coincide com o merge-base; não há mudanças concorrentes de main a reconciliar nesse momento. Nenhum merge foi executado.

A revisão abrangeu integralmente os arquivos versionados de `examples/final-project/`, o [workflow dedicado](../.github/workflows/chapter-10-final-project.yml), os manifests npm, `.gitignore`, o [rascunho didático](./10-projeto-final-saucedemo.md), o [README operacional](../examples/final-project/README.md) e a integração com os capítulos 1 a 9. A evidência remota foi consultada no GitHub e confrontada com os logs da tentativa aprovada; YAML e contratos locais, isoladamente, não foram tratados como homologação Linux.

As únicas alterações desta sprint são este relatório e correções dos avisos desatualizados de homologação pendente nos dois documentos do Capítulo 10. Código, configuração, dependências, 41 testes, índices públicos e capítulos anteriores foram preservados.

## Auditoria da arquitetura

| Aspecto | Resultado e evidência |
|---|---|
| Responsabilidades | PASS. Seis Pages encapsulam telas e ações; três componentes reutilizam cabeçalho, menu e item de produto; testes mantêm assertions de negócio. |
| Fixtures tipadas | PASS. `test.fixture.ts` e `checkout.fixture.ts` compõem dependências com escopo de teste. As assertions nas fixtures verificam apenas pré-condições de navegação. Finish permanece explícito no cenário. |
| Isolamento | PASS. Contexto novo por teste; login e preparação via UI; sem `storageState`, sessão/carrinho compartilhados, dependência entre testes ou execução serial. |
| Dependências | PASS. Grafo dos imports locais dos 35 arquivos TypeScript inspecionado sem ciclos; auxiliares CommonJS de CI também revisados. |
| Locators | PASS. Roles/nomes acessíveis e `data-test`; produtos limitados pelo nome exato dentro do item. Sem índices posicionais frágeis para selecionar produtos. |
| Assertions | PASS. Identidade, listas completas, quantidade, botões, badge, navegação, mensagens e relações financeiras verificadas; detalhes fixos de dois produtos fornecem expectativas independentes. |
| Ambiente e erros | PASS. URL normalizada para origem, HTTPS ou HTTP em loopback; senha resolvida sob demanda; erros não reproduzem entrada sensível. |
| Sincronização | PASS. Auto-waiting e assertions de locators; `domcontentloaded` evita dependência observada de fontes externas. Readiness tem tentativas limitadas e diagnóstico próprio. |
| TypeScript e didática | PASS. `strict`, `noEmit`, verificação de itens não usados e separação de dados; composição pequena, sem BasePage ou hierarquias desnecessárias. |

Timeouts permaneceram em 30 s por teste, 15 s para navegação, 10 s por ação e 5 s por assertion. Readiness consulta a aplicação sem autenticar: até três GETs de 10 s, com intervalo de 3 s. Essas tentativas de disponibilidade não repetem testes funcionais e não aprovam uma aplicação indisponível.

## Matriz de cobertura funcional

| Grupo | Casos existentes | Assertions e dados relevantes | Isolamento e limites |
|---|---|---|---|
| Autenticação — 12 | AUTH-01 a AUTH-07; AUTH-03 tem dois campos e AUTH-06 cinco rotas | Login válido, reload da sessão, credencial inválida, usuário bloqueado, obrigatoriedade, fechar erro, logout e redirecionamento sem sessão. Mensagens observadas e usernames públicos; senha via ambiente. | Contexto independente; cenários negativos não exigem a senha válida. Não cobre todos os usuários com defeitos intencionais. |
| Catálogo — 6 | CAT-01, CAT-02, CAT-03 em duas direções e CAT-04 em duas direções | Seis nomes completos; descrição/preço de dois itens; listas inteiras ordenadas por nome e preço numérico, preservando identidade inclusive com preços iguais. | Login próprio e ordenação preparada por caso. Navegação ao carrinho coberta na jornada; página individual de detalhe não é um cenário desta suíte. |
| Carrinho — 6 | CART-01 a CART-06 | Inclusão, remoção nas duas telas, ausência de duplicação, identidade, preço, quantidade 1, badge, persistência durante navegação e estado inicialmente vazio. | Produtos preparados por teste. Não valida persistência entre contextos ou reinícios; Checkout habilitado no vazio é comportamento observado, sem inventar bloqueio. |
| Checkout — 11 | CHECK-01 a CHECK-08; CHECK-02 tem três campos e CHECK-04 dois cancelamentos | Entrada no formulário, cada campo obrigatório isolado, cliente fictício, avanço/cancelamentos, dois produtos no resumo, subtotal/taxa/total, confirmação e Back Home com carrinho vazio. | Fixtures percorrem a UI em cada teste; conclusão não prepara outro cenário. Sem pagamento real, logística, formato postal presumido ou edição de quantidade. |
| Unitários — 6 | Dois testes USD e quatro ENV | Parsing monetário estrito e entradas inválidas; URL/origem/protocolo, erros sem entrada e credenciais sob demanda com dados sintéticos. | Sem navegador ou senha real. O global setup ainda consulta a aplicação quando esses testes são executados com o config compartilhado. |

As assertions financeiras usam centavos inteiros. CHECK-05 compara preços conhecidos dos produtos e subtotal esperado; CHECK-06 verifica quantidade 1, soma os preços exibidos, confronta essa soma com o subtotal e compara `subtotal + tax` com `total`. A taxa é a exibida pela aplicação, sem assumir uma alíquota. Os unitários rejeitam formatos e valores fora da precisão segura.

## Inventário e identidade dos 41 testes

`npm run test:final:list` descobriu **41 testes em 14 arquivos**: 12 auth + 6 catálogo + 6 carrinho + 11 checkout + 6 unitários. As tags separam **7 smoke**, **28 regression** e **6 unitários** sem essas tags.

O inventário JSON confirmou **41 IDs internos do runner distintos e 41 títulos completos distintos**. AUTH-03, AUTH-06, CAT-03, CAT-04 e CHECK-02 são IDs de famílias parametrizadas; o parâmetro no título identifica cada caso. CHECK-04 identifica os dois cancelamentos de etapas distintas, também com títulos distintos. ENV e USD identificam os grupos unitários por títulos próprios. Portanto, os prefixos didáticos não são 41 identificadores individuais; essa convenção explica as repetições sem duplicação indevida. Não foram renumerados testes nem alterada a contagem.

A leitura do código e a busca nos testes não encontraram `test.only`, `test.skip`, `test.fixme`, falha esperada, `describe.serial`, `waitForTimeout` ou sleeps artificiais. Retries permanecem em zero; preparação e estado não dependem de ordem. As execuções com quatro workers reforçam essa revisão, sem constituir prova de estabilidade para toda condição futura.

## Resultados locais

Ambiente: Windows, Node.js **24.16.0**, npm **11.13.0**, dependências instaladas conforme lockfile (Playwright **1.61.1**, TypeScript **7.0.2**), Chromium e quatro workers para a suíte final. Não houve aumento de timeout nem alteração de expectativa.

| Validação | Resultado |
|---|---|
| `npm run typecheck:final` | PASS |
| `npm run test:final:list` | 41 testes / 14 arquivos |
| `npm run test:final:smoke` | 7/7, 4,9 s |
| `npm run test:final` — execução inicial | 41/41, 14,3 s |
| Suíte completa — consecutiva 1 | 41/41, 13,7 s |
| Suíte completa — consecutiva 2 | 41/41, 12,7 s |
| Suíte completa — consecutiva 3 | 41/41, 12,3 s |

Smoke e quatro execuções completas usaram `SAUCEDEMO_EXPECTED_TESTS` com 7 ou 41, respectivamente: o reporter aprovou contagem exata, um resultado por teste, nenhum retry configurado e runner aprovado. **Zero skipped, retries e flaky observado em todas essas execuções.** Readiness respondeu HTTP 200 na primeira tentativa de cada rodada.

Validações adicionais:

- `node examples/final-project/ci/verify-quality-gate.cjs`: 11 contratos aprovados. O caso válido retorna zero; skip, fixme, runtime skip, falha esperada, falha, contagem incorreta/inválida, suíte vazia, retries habilitados e flaky retornam erro conforme esperado.
- `node --test examples/final-project/ci/prepare-artifacts.test.cjs`: 4/4 aprovados, sem skips.
- `actionlint` 1.7.12, com `-shellcheck=`, no workflow dedicado: PASS. Essa validação não inclui ShellCheck; os passos bash também foram revisados e executados no run Linux aprovado.
- Falha controlada em configuração temporária ignorada, fora dos 41 testes: verificação de máscara do input e ocultação do bloco de senha pública, relatório real sanitizado com dois JSONs válidos no ZIP embutido, PNG presente e nenhum trace no pacote permitido. O runner falha intencionalmente; o verificador de segurança termina aprovado. Nenhuma evidência bruta foi enviada.

## Regressão dos capítulos anteriores

**31/31 aprovados**, com dois workers e zero retries/skips:

| Comando / escopo | Resultado |
|---|---|
| `npx playwright test --workers=2 --retries=0 --reporter=list` — raiz, Chromium/Firefox/WebKit | 6/6, 13,1 s |
| `npx playwright test --config=examples/ci/playwright.config.ts --workers=2 --retries=0 --reporter=list` — capítulo 8 | 1/1, 2,2 s |
| `npx playwright test --config=examples/cicd/playwright.config.ts --workers=2 --retries=0 --reporter=list` — capítulo 9 | 8/8, 2,9 s |
| Configuração temporária para exemplos executáveis de primeiro teste, locators, Page Objects e fixtures | 16/16, 8,3 s |

No capítulo 9 foram definidos `PLAYWRIGHT_TARGET_ENV=local`, `APP_VERSION=sprint-10.7-regression` e `PLAYWRIGHT_EXPECTED_VERSION=sprint-10.7-regression`, removendo override de `PLAYWRIGHT_BASE_URL`; assim, o caso de versão executou sem skip. O servidor local foi iniciado pelo config existente.

O último grupo usou `npx playwright test --config=playwright-report/sprint-10.5-legacy.config.cjs`. Esse config local, ignorado pelo Git, aponta `testDir` para `examples` e seleciona `**/first-test.spec.ts`, `**/locators/*.spec.ts`, `**/page-objects/**/*.example.ts` e `**/fixtures/**/*.example.ts`, com Chromium, `fullyParallel`, dois workers e zero retries. A contagem não inclui trechos conceituais de organização de projeto que pressupõem uma aplicação inexistente; não se afirma que todo snippet da série seja um teste executável.

## Evidência real Linux e auditoria do CI

Execução oficial: [41646779044, tentativa 2](https://github.com/mayconmalmeida/playwright-typescript-guide/actions/runs/41646779044/attempts/2). Job **125956272909 — Chapter 10 Quality Gate**. Evento `push`; commit **`e4ac35edcf21f45ffcaa71a700f5807850c0c091`**; conclusão **success**; atualização final registrada às **13:47:59 UTC de 03/11/2026**.

Os metadados e logs conferidos mostram Ubuntu **24.04**, Node.js **22.23.4**, `npm ci`, instalação do Chromium **149.0.7827.55 / revisão 1228**, typecheck e contratos aprovados, inventário de 41 testes, **smoke 7/7 em 4,8 s** e **suíte completa 41/41 em 12,8 s**. Ambos os gates registram contagem exata e retries desativados. Não houve teste funcional ignorado. O passo de rejeição de PR não confiável foi corretamente ignorado por ser push; preparação/upload foram ignorados por não haver falha. Não há artefatos nessa tentativa aprovada, conforme a política do workflow.

O run existente é suficiente para homologar o baseline; **não foi solicitado rerun nem dispatch**. O push documental autorizado pode acionar automaticamente o workflow pelos filtros já existentes; isso não substitui nem altera a evidência acima.

| Controle do workflow | Auditoria |
|---|---|
| Triggers e filtros | Push na branch indicada; PR por caminhos do projeto final, rascunho, workflow e manifests; dispatch declarado. Botão manual depende de presença na branch padrão. |
| Permissões | `contents: read`, checkout sem persistir credenciais, sem `pull_request_target`. |
| PR não confiável | Forks e Dependabot rejeitados antes de checkout/secret. Branches internas continuam dependendo de revisão de código confiável. |
| Secret | Nome remoto `SAUCEDEMO_PASSWORD` confirmado presente, sem consultar seu valor. Ausência causa falha antes de instalação. Nenhum secret foi alterado nesta auditoria. |
| Execução | Ubuntu/Node fixados, lockfile, Chromium com dependências Linux, typecheck, contratos, listagem, smoke e suíte; timeout do job 15 min, concorrência com cancelamento. |
| Aprovação | Contagem exata e apenas resultados aprovados na primeira tentativa; sem `continue-on-error`; smoke falho impede regressão. Cancelamento não aprova. |
| Evidências de falha | Só diretório preparado/sanitizado, após listagem bem-sucedida; retenção de três dias, nenhum upload em sucesso e nenhum trace no CI. |

## Auditoria de segurança

**PASS dentro do escopo revisado; nenhuma vulnerabilidade real identificada.**

- Senha real não encontrada nos arquivos versionados. Busca por padrões de tokens, chaves privadas e URLs com credenciais encontrou somente a URL deliberadamente sintética de `tests/unit/environment.spec.ts`; leitura confirmou que testa remoção de credenciais e não é uma exposição.
- Não há `.env`, relatórios, traces, cookies ou sessões autenticadas versionados. `git check-ignore` confirmou proteção dos caminhos de `.env`, HTML e resultados do projeto final, além dos relatórios temporários da auditoria.
- Credenciais são fornecidas por ambiente e resolvidas sob demanda; não são incorporadas em assertions de erro. URL usa apenas origem e valida protocolos; testes sintéticos verificam erros sem reprodução da entrada. Checkout usa cliente fictício.
- Logs funcionais locais e trechos remotos examinados registram contagens, cenários e disponibilidade, sem valor de senha. A cópia local de diagnóstico remoto foi redigida antes de armazenamento e permaneceu ignorada; token de acesso não foi gravado ou impresso.
- Traces **desativados no CI**, conforme autorização prévia de proteção das credenciais. Screenshots mantêm input mascarado e bloco público `.login_password` oculto pela fixture. A verificação controlada confirmou essas condições na página real.
- O preparador sanitiza texto e ZIP embutido no HTML nas formas literal, JSON e URL da credencial; bloqueia formatos inesperados, symlinks e falhas na sanitização. Só HTML/anexos permitidos e screenshots entram na pasta de upload; diretórios brutos não são enviados. Os contratos e a falha controlada foram aprovados.
- `npm audit --json` consultado nesta data: **0 critical, 0 high, 0 moderate, 0 low, 0 info**. Lockfile preservado e nenhuma dependência adicionada/atualizada. Ausência de advisory conhecido não comprova ausência de vulnerabilidades desconhecidas.

Relatórios e traces **locais brutos podem conter valores digitados**, mesmo em evidências ignoradas pelo Git. Não são material pronto para compartilhar. A sanitização cobre a credencial configurada, não qualquer dado pessoal ou segredo arbitrário; PNG não recebe redação textual. A proteção depende da máscara/ocultação e do uso dos dados fictícios. Revisão manual continua necessária antes de compartilhar evidências.

## Auditoria editorial, links e integração

**PASS.** Os dois documentos foram revisados quanto a português brasileiro, comandos reais, exemplos TypeScript, correspondência com Pages/fixtures, finanças, CI, segurança, diagnóstico e limites. As três amostras TypeScript do rascunho correspondem ao código existente ou a trechos explicitamente contextualizados. Os comandos principais foram executados na raiz conforme documentado.

A comparação editorial dos capítulos 1 a 9 confirmou a continuidade: metadados de objetivo/nível/pré-requisitos, explicação do problema, exemplos ligados ao código, boas práticas e desafios. Os capítulos mais recentes usam esse formato com variações legítimas; não foi necessária uma reestruturação estilística. O Capítulo 10 aplica locators do 4, organização do 5, Pages/componentes do 6, fixtures do 7 e CI/gate do 8 e 9, distinguindo validação de deploy.

Foram corrigidas as afirmações de secret ausente/Linux pendente, substituindo-as pela tentativa aprovada, baseline e resultados verificados. O rascunho e o README agora apontam para este relatório, sem afirmar publicação.

A verificação de caminhos e âncoras Markdown abrangeu os documentos versionados, índices e exemplos, mais este relatório. **Nenhum link interno essencial quebrado** no Capítulo 10 ou na integração da série. O único destino inexistente detectado é `./0X-slug.md` no [template de capítulo](../templates/chapter-template.md), um placeholder intencional para substituição futura; não é um link de navegação publicado. A checagem é de caminhos/âncoras locais, sem prometer disponibilidade futura de URLs externas.

`README.md` e `SERIES.md` continuam com Capítulo 10 “Em breve”; `ROADMAP.md` mantém o planejamento; capítulo 9 ainda apresenta o próximo capítulo sem link publicado. O retorno do rascunho ao capítulo 9 e os links de código existem. Essas escolhas são consistentes com a publicação ainda não autorizada.

## Achados classificados

| ID | Severidade | Achado | Tratamento e impacto |
|---|---|---|---|
| DOC-01 | LOW | README operacional e rascunho ainda afirmavam homologação Linux pendente, apesar da tentativa aprovada. | **Resolvido** nesta sprint com atualização factual e link da tentativa; removida a inconsistência documental. |
| TRACE-01 | INFORMATIONAL | Prefixos de cenário representam famílias; não são todos únicos por caso. | Explicado neste relatório: 41 IDs do runner/títulos completos únicos, parâmetros e duas etapas de CHECK-04 distintos. Sem duplicação indevida nem divergência de contagem. |
| CI-01 | LOW | Actions referenciadas por tags de versão principal, sem pin de SHA imutável. | Melhoria opcional de cadeia de suprimentos para manutenção futura; não é advisory ou exposição identificada. Sem alterar workflow nesta auditoria. |
| LINKS-01 | INFORMATIONAL | Template inclui destino `0X-slug.md` inexistente. | Placeholder intencional, fora da navegação essencial; substituir ao criar novo capítulo. |
| EDIT-01 | INFORMATIONAL | Capítulo 5 ainda anuncia o 6 como “em breve”, embora o índice já o apresente publicado. | Inconsistência editorial anterior e não bloqueante para o 10; registrar para manutenção futura, sem alterar capítulos anteriores nesta sprint. |

**CRITICAL: 0 · HIGH: 0 · MEDIUM: 0.** LOW: um resolvido e uma melhoria opcional. Não há bloqueio aberto de teste, CI, credencial exposta, link essencial, correção técnica do Capítulo 10 ou isolamento.

## Limitações e riscos residuais

- Serviço público de terceiros: mudanças de conteúdo/layout, rede, fontes ou disponibilidade podem quebrar execuções futuras. Readiness separa indisponibilidade de regressão e não substitui investigação.
- Chromium é a cobertura do projeto final. A regressão da raiz em três browsers não homologa o checkout da SauceDemo em Firefox/WebKit. Não houve auditoria formal de acessibilidade, desempenho, API, segurança da aplicação ou testes de pagamento real.
- Três rodadas consecutivas sem falhas são evidência observada, não garantia estatística de ausência de flakiness.
- Dados fixos de produtos/mensagens exigem conferir mudanças reais antes de atualizar expectativas. Quantidade 1, obrigatoriedade dos campos e regras observadas não equivalem às regras de uma loja real.
- Sanitização usa bibliotecas ZIP internas da versão travada do Playwright; atualização exige rever formato, contratos e evidência de falha. Mudança de DOM pode afetar a ocultação do bloco de senha. Retenção curta não dispensa revisão de conteúdo.
- Filtros de caminhos podem deixar checks obrigatórios pendentes se uma política global incompatível for configurada. Política de branch, permissões e publicação externa não foram alteradas.
- Prontidão e ausência de conflito referem-se ao baseline e ao estado de main consultado; mudanças posteriores exigem nova avaliação proporcional.

## Matriz de release readiness

| Critério | Resultado | Evidência |
|---|---|---|
| Arquitetura | PASS | Revisão integral; responsabilidades, locators, fixtures tipadas e imports sem ciclos |
| Testes funcionais | PASS | 35 E2E dentro dos 41 aprovados em quatro execuções completas |
| Testes unitários | PASS | 6 unitários incluídos em cada execução completa |
| Isolamento | PASS | Contextos/fixtures por teste, revisão estática e execuções paralelas sem dependência observada |
| Segurança | PASS | Nenhum segredo versionado identificado; audit zero; contratos e evidência controlada sanitizada |
| Documentação | PASS | Correspondência com código; avisos pendentes corrigidos; nenhum link essencial quebrado |
| GitHub Actions | PASS | Tentativa 2 oficial concluída com success e gates exatos |
| Linux | PASS | Mesmo baseline, Ubuntu 24.04, Node 22.23.4, Chromium, 7/7 e 41/41 |
| Regressão | PASS | 31/31 exemplos anteriores executáveis, zero skips/retries |
| Publicação | READY | Recomendação técnica favorável; execução editorial depende de revisão e autorização da Sprint 10.8 |

**Recomendação:** aprovar a Sprint 10.7 para revisão e considerar o Capítulo 10 tecnicamente pronto para a etapa de publicação. Esta recomendação não publica conteúdo nem autoriza iniciar a Sprint 10.8. Nenhum PR, merge, deploy, tag, release ou alteração externa de configuração foi realizado.

## Checklist proposto para a Sprint 10.8

Itens preparados para decisão futura; **nenhum foi executado nesta sprint**:

- [ ] Obter revisão deste relatório e autorização explícita para iniciar a Sprint 10.8.
- [ ] Confirmar baseline final e estado atualizado de main; revalidar somente o que mudanças posteriores exigirem.
- [ ] Revisar a versão editorial final, tempo de leitura, status e referências do Capítulo 10.
- [ ] Definir e validar o destino real do artigo no blog antes de inserir URLs públicas.
- [ ] Atualizar as entradas do Capítulo 10 em `README.md` e `SERIES.md`, com links de artigo, documentação e exemplos.
- [ ] Ajustar o status de conclusão do roadmap conforme a publicação efetivamente aprovada.
- [ ] Acrescentar navegação do capítulo 9 ao 10 e conferir o retorno ao 9; preservar os capítulos anteriores salvo ajustes de navegação autorizados.
- [ ] Remover os avisos de rascunho apenas quando o estado editorial justificar; não confundir implementação, homologação e publicação.
- [ ] Rever links/âncoras e executar validações proporcionais às alterações finais.
- [ ] Submeter PR, merge, publicação, tag ou release somente se cada ação estiver autorizada no escopo futuro.

Até essa revisão, manter o capítulo não publicado e aguardar a decisão do responsável.
