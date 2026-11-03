# Capítulo 10 — Revisão editorial e de release

## Situação da entrega

A Sprint 10.7 está aprovada. A Sprint 10.8 prepara o artigo e a navegação da série para revisão em PR draft, da branch `feat/playwright-chapter-10-final-project` para `main`. Implementação e homologação estão concluídas. A publicação no repositório depende de revisão e merge autorizado; a publicação externa no blog permanece pendente.

O [artigo do Capítulo 10](./10-projeto-final-saucedemo.md) apresenta uma jornada de aprendizagem completa. O [projeto final](../examples/final-project/) e seu [README operacional](../examples/final-project/README.md) permitem executar o fluxo Login → Catálogo → Carrinho → Checkout → Confirmação na SauceDemo. Finish conclui um pedido de demonstração, sem pagamento ou entrega reais.

## Escopo entregue

- Seis Page Objects, três componentes e fixtures tipadas com preparação pela interface e contexto independente por teste.
- 41 testes: 12 de autenticação, 6 de catálogo, 6 de carrinho, 11 de checkout e 6 unitários. Os 7 smoke integram esse total.
- Validação de sessão, campos obrigatórios, rotas protegidas, ordenação, inclusão/remoção, persistência, cancelamentos, resumo financeiro em centavos e confirmação.
- Workflow Linux dedicado com typecheck, contratos, inventário e gates exatos de 7 e 41 aprovações, sem retries ou resultados ignorados.
- Diagnóstico de disponibilidade separado de falha funcional, traces desativados no CI e preparação de HTML/screenshots sanitizados somente em falhas.

Esta sprint altera somente documentação. Código, testes, dependências e workflows permanecem no baseline homologado.

## Baselines e commits

| Referência | Commit | Entrega |
|------------|--------|---------|
| `origin/main` consultada em 03/11/2026 | `a879b085244a99256ade62bf776b7522891dbb44` | Ancestral da branch; sem avanço em relação à homologação |
| Sprint 10.1 | `0515957` | Estrutura isolada do projeto |
| Sprint 10.2 | `d5bdd48` | Autenticação |
| Sprint 10.3 | `1de0e13` | Catálogo e carrinho |
| Sprint 10.4 | `25fcdb6` | Checkout E2E |
| Sprint 10.5 | `d565089` | Robustez e documentação operacional |
| Sprint 10.6 | `e4ac35edcf21f45ffcaa71a700f5807850c0c091` | GitHub Actions e Quality Gate |
| Sprint 10.7 aprovada | `159c0d2968dafa6135bf16b4d63fce78d49f5001` | Relatório final de homologação; baseline da Sprint 10.8 |

O commit editorial desta sprint deve aparecer no PR com a mensagem `docs: prepare Chapter 10 publication and series navigation`. A revisão deve conferir seu SHA nos checks, sem atribuir a ele uma execução anterior.

## Evidências de validação

O [relatório de homologação](./10-final-homologation.md) contém a auditoria técnica detalhada, as execuções consecutivas e a avaliação de riscos da Sprint 10.7. Esta revisão registra apenas as evidências necessárias para a entrega editorial.

| Validação local da Sprint 10.8, em 03/11/2026 | Resultado |
|----------------------------------------------------------|-----------|
| `npm run typecheck:final` | PASS |
| `npm run test:final:list` | 41 testes em 14 arquivos |
| `npm run test:final:smoke`, gate esperado 7 | 7/7; 7,1 s |
| `npm run test:final`, gate esperado 41 | 41/41; 18,0 s |
| Regressão anterior: raiz, capítulo 8, capítulo 9 local e exemplos legados | 31/31: 6 + 1 + 8 + 16 |

Os testes foram executados no Windows com retries zero. A regressão da raiz usa Chromium, Firefox e WebKit; isso não amplia a cobertura do projeto final, que usa Chromium. O capítulo 9 foi executado contra seu servidor local, com versão esperada explícita.

### GitHub Actions

A [execução 41649392014](https://github.com/mayconmalmeida/playwright-typescript-guide/actions/runs/41649392014), correspondente ao baseline aprovado `159c0d2968dafa6135bf16b4d63fce78d49f5001`, foi conferida como `completed / success` nesta sprint. A [tentativa 2 da execução 41646779044](https://github.com/mayconmalmeida/playwright-typescript-guide/actions/runs/41646779044/attempts/2) documenta a homologação do baseline funcional no Ubuntu 24.04, Node.js 22.23.4 e Chromium, com smoke 7/7 e suíte 41/41.

Essas execuções comprovam os respectivos baselines. Após o push e a abertura do PR draft, é obrigatório conferir o **Chapter 10 Quality Gate** correspondente ao commit editorial final. O resultado dessa nova execução deve constar no relatório de encerramento e nos checks do PR; este documento, preparado antes do commit, não antecipa sua aprovação. Falha ou pendência exige diagnóstico explícito antes de qualquer decisão de integração.

## Navegação e revisão editorial

| Arquivo | Ajuste |
|---------|--------|
| `readme.md` na raiz | Entrada do capítulo com artigo local, projeto e README operacional; links para homologação e revisão de release |
| `SERIES.md` | Capítulo implementado e homologado; integração à `main` e blog pendentes |
| `ROADMAP.md` | Estados separados para implementação, homologação, revisão editorial, merge e blog |
| `docs/09-playwright-cicd-deploy.md` | Link relativo para o capítulo seguinte e indicação de publicação pendente |
| `docs/10-projeto-final-saucedemo.md` | Status editorial, aprovação da homologação, próximos passos e links de revisão; retorno ao capítulo 9 preservado |
| `examples/final-project/README.md` | Status e tabela de sprints alinhados à revisão editorial |
| `docs/10-release-review.md` | Evidências resumidas, limites e checklists desta entrega |

O arquivo de entrada da raiz é versionado como `readme.md`; sua grafia foi preservada. Título, objetivo, pré-requisitos, instalação, execução, arquitetura, fixtures, autenticação, catálogo, carrinho, checkout, assertions financeiras, CI, segurança e diagnóstico foram conferidos com o código. Capítulos 1 a 8 não foram alterados.

Foram conferidos 156 links relativos em 42 arquivos Markdown, incluindo destinos, âncoras e capitalização para Linux. Os links da entrega estão válidos. A única referência inexistente é o placeholder já conhecido `./0X-slug.md` em `templates/chapter-template.md`, fora desta entrega.

Os sete documentos da sprint passaram pelo markdownlint-cli2, com regras de espaçamento, listas, blocos de código, links, imagens e consistência de colunas de tabelas. Foram acrescentadas linhas em branco antes das listas existentes do roadmap. `git diff --check` passou. A varredura do conteúdo destinado ao commit não encontrou a credencial configurada, tokens ou chaves privadas; os exemplos de URL com credenciais em testes unitários são dados sintéticos conhecidos. Relatórios, traces e arquivos de ambiente permanecem ignorados.

## Limitações conhecidas e riscos residuais

- A SauceDemo é externa: indisponibilidade, mudanças de DOM, produtos ou mensagens podem afetar o gate sem mudança local.
- Cobertura do projeto final restrita ao Chromium; não inclui API, pagamento real, auditoria formal de acessibilidade, desempenho ou segurança da aplicação.
- As regras financeiras conferem itens e soma da taxa exibida; não validam uma legislação tributária. Dados do cliente são fictícios.
- Traces locais podem conter credenciais e exigem revisão manual antes de compartilhar. A sanitização do CI protege a credencial configurada, sem garantir remoção de todo dado pessoal possível.
- A sanitização usa bibliotecas ZIP internas do Playwright travado no lockfile; atualizar a dependência exige rever os contratos. Actions usam tags de versão principal, risco baixo já registrado na homologação.
- Filtros de caminhos devem ser considerados ao definir checks obrigatórios. Nenhuma política de proteção é alterada nesta sprint.
- A avaliação de conflitos e os resultados de CI valem para os SHAs consultados; novo avanço da `main` ou alteração do PR exige nova conferência proporcional.

Não há bloqueio crítico, alto ou médio identificado na homologação aprovada. Os riscos residuais permanecem sujeitos à revisão do responsável.

## Checklist de Pull Request

- [x] Sprint 10.7 aprovada e baseline local confirmado com árvore inicialmente limpa.
- [x] `origin/main` atualizada por fetch e confirmada como ancestral da branch.
- [x] Artigo e navegação preparados, sem anúncio de publicação no blog.
- [x] Typecheck, inventário, smoke, suíte completa e regressão anterior executados sem retries.
- [x] Conferir links, Markdown, diff e varredura de segredos do conteúdo final antes do commit.
- [ ] Fazer commit editorial e push normal somente na branch de trabalho.
- [ ] Confirmar árvore limpa e ausência de PR duplicado; criar ou manter PR em **draft**, com base `main`.
- [ ] Conferir os checks aplicáveis e o Quality Gate no commit final; registrar URL e resultado no encerramento da sprint.
- [ ] Revisar o diff completo da branch, incluindo implementação e CI das sprints anteriores.

Os itens em aberto acima são verificações de entrega posteriores à preparação deste documento, a confirmar no PR e no relatório final. Não representam autorização de merge.

## Checklist de merge

- [ ] Obter revisão do PR e autorização explícita do responsável para integrar à `main`.
- [ ] Conferir head/base atuais, ausência de conflitos e CI aprovado para a versão efetivamente revisada.
- [ ] Resolver comentários e confirmar que nenhuma alteração posterior invalidou a homologação.
- [ ] Revisar política de credenciais, artefatos e checks sem contornar proteção de branch.
- [ ] Somente após autorização, executar a estratégia de merge acordada e verificar o conteúdo na `main`.
- [ ] Atualizar o status de publicação no repositório após comprovar o merge. Manter blog pendente até publicação externa verificada.

## Publicação externa no blog

A publicação está pendente. Não há URL do artigo do Capítulo 10 confirmada nesta entrega. Uma etapa futura autorizada deverá adaptar o conteúdo à plataforma, conferir exemplos e links, publicar e verificar o destino real antes de atualizar os índices. PR, merge no repositório e publicação no blog são etapas distintas. Nenhum deploy, tag ou release integra esta sprint.

## Plano de reversão editorial

Antes do merge, registrar os problemas na revisão e corrigi-los por um novo commit na mesma branch, ou encerrar o PR se a integração for cancelada. Preservar o histórico, sem reset, rebase ou force push.

Se, após um merge autorizado, for necessário retirar a navegação ou corrigir o status editorial, preparar um PR de correção/reversão limitado aos arquivos desta Sprint 10.8, comparando-os com `159c0d2968dafa6135bf16b4d63fce78d49f5001`. Reverter somente o commit editorial quando ele estiver preservado separadamente e isso for apropriado à estratégia de merge. Em merge com squash, recuperar apenas os trechos editoriais; não reverter inadvertidamente todo o projeto final. Validar links, Markdown e diff e obter autorização antes da integração. Eventual conteúdo no blog exigirá tratamento separado, conforme sua publicação efetiva.
