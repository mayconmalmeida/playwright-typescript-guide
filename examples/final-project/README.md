# Projeto Final — Automação E2E da SauceDemo

> 🚧 **Em construção.** Implementados até agora: a fundação técnica (Sprint 10.1) e os testes de autenticação (Sprint 10.2). Catálogo, carrinho e checkout ainda não têm testes, e o workflow de CI do projeto final ainda não existe.

Projeto final do Capítulo 10 da série **Engenharia de Automação com Playwright**: uma suíte E2E que reúne locators, Page Objects, Fixtures e CI dos capítulos anteriores em um projeto único, reproduzível e adequado para portfólio.

## Aplicação-alvo

[SauceDemo](https://www.saucedemo.com/) (Swag Labs) é uma loja de demonstração mantida pela Sauce Labs para prática de automação: login, catálogo com ordenação, carrinho e checkout em três etapas.

Características observadas que orientam o projeto:

- Todo o estado é mantido no navegador (carrinho em `localStorage`). Não há API pública da aplicação, por isso o projeto não inclui testes de API.
- Os elementos expõem o atributo `data-test`. O config define `testIdAttribute: 'data-test'`, então `getByTestId` usa esse atributo.
- Usuários e senha de demonstração são públicos e exibidos na própria tela de login.

## Stack

- [Playwright Test](https://playwright.dev/) com TypeScript, usando as dependências da raiz do repositório (sem `package.json` próprio)
- TypeScript em modo `strict`, verificado com `tsc` (configuração própria em [`tsconfig.json`](./tsconfig.json))
- Node.js 22 ou superior
- Chromium como navegador inicial

## Arquitetura

```text
examples/final-project/
├── config/
│   └── environment.ts      # ✅ URL base e credenciais lidas do ambiente
├── readiness.ts            # ✅ global setup: a SauceDemo está respondendo?
├── playwright.config.ts    # ✅ configuração isolada do projeto final
├── tsconfig.json           # ✅ TypeScript strict, restrito a esta pasta
├── .env.example            # ✅ variáveis documentadas, sem valores secretos
├── pages/
│   └── login.page.ts       # ✅ demais páginas nas Sprints 10.3–10.4
├── components/
│   ├── header.component.ts     # ✅ título da página
│   └── side-menu.component.ts  # ✅ menu lateral e logout
├── fixtures/
│   └── test.fixture.ts     # ✅ pages, componentes, credenciais e authenticatedPage
├── test-data/
│   ├── users.ts            # ✅ usernames públicos e credenciais inválidas (sem senha)
│   ├── auth-messages.ts    # ✅ mensagens de erro da tela de login
│   └── routes.ts           # ✅ caminhos da aplicação
├── utils/                  # ⬜ conversão de preços para centavos
└── tests/
    ├── auth/               # ✅ AUTH-01 a AUTH-07
    └── ...                 # ⬜ catalog/, cart/, checkout/, quality/
```

✅ implementado · ⬜ previsto nas próximas sprints

A configuração não depende do `playwright.config.ts` da raiz nem dos exemplos dos capítulos anteriores. Relatórios e evidências ficam em `examples/final-project/playwright-report/` e `examples/final-project/test-results/`, ambos ignorados pelo Git.

## Pré-requisitos e instalação

Na raiz do repositório:

```bash
npm ci
npx playwright install chromium
```

## Credenciais

| Variável | Obrigatória | Padrão |
|----------|-------------|--------|
| `SAUCEDEMO_BASE_URL` | Não | `https://www.saucedemo.com/` (https obrigatório; http apenas em localhost) |
| `SAUCEDEMO_USERNAME` | Não | `standard_user` |
| `SAUCEDEMO_PASSWORD` | Para executar testes | — |

A senha é pública e aparece na tela de login da SauceDemo, mas **não é versionada**: copie-a de lá e exporte a variável. O Playwright não carrega arquivos `.env` automaticamente, e este projeto não usa `dotenv`.

**Windows PowerShell** (vale para a sessão atual do terminal):

```powershell
$env:SAUCEDEMO_PASSWORD = "<senha exibida na tela de login>"
```

**Linux, macOS ou Git Bash:**

```bash
export SAUCEDEMO_PASSWORD='<senha exibida na tela de login>'
```

A senha só é exigida pelos testes que fazem login com um usuário válido (AUTH-01, AUTH-02 e AUTH-05). Sem ela, esses testes **falham** com a mensagem `SAUCEDEMO_PASSWORD não definida`: não são pulados nem aprovados. O type-check, a listagem (`--list`), o readiness check e os cenários negativos funcionam sem a senha.

> Traces do Playwright registram os valores digitados em campos. Um trace de falha do login conterá a senha de demonstração; não compartilhe traces de projetos que usem credenciais reais.

## Comandos

Executados na raiz do repositório:

| Comando | O que faz |
|---------|-----------|
| `npm run typecheck:final` | Type-check em modo strict do projeto final |
| `npm run test:final:list` | Lista os testes sem executá-los |
| `npm run test:final` | Executa a suíte completa (readiness antes dos testes) |
| `npm run test:final:smoke` | Executa somente os testes marcados com `@smoke` |
| `npm run test:final:report` | Abre o último relatório HTML |

Para executar um único cenário, filtre pelo ID: `npm run test:final -- --grep AUTH-05`.

## Cenários implementados

| ID | Cenário | Tag | Arquivo | Precisa da senha |
|----|---------|-----|---------|------------------|
| AUTH-01 | Login válido leva ao catálogo e a sessão sobrevive a um reload | `@smoke` | [`login.spec.ts`](./tests/auth/login.spec.ts) | Sim |
| AUTH-02 | Usuário bloqueado não consegue entrar | `@regression` | [`login.spec.ts`](./tests/auth/login.spec.ts) | Sim |
| AUTH-03 | Campos obrigatórios: username e password (parametrizado, 2 casos) | `@regression` | [`validation.spec.ts`](./tests/auth/validation.spec.ts) | Não |
| AUTH-04 | Credenciais inválidas são rejeitadas | `@regression` | [`login.spec.ts`](./tests/auth/login.spec.ts) | Não |
| AUTH-05 | Logout encerra a sessão e bloqueia a rota protegida | `@smoke` | [`logout.spec.ts`](./tests/auth/logout.spec.ts) | Sim |
| AUTH-06 | Rotas protegidas sem sessão redirecionam ao login (parametrizado, 3 rotas) | `@regression` | [`protected-routes.spec.ts`](./tests/auth/protected-routes.spec.ts) | Não |
| AUTH-07 | Mensagem de erro pode ser fechada | `@regression` | [`validation.spec.ts`](./tests/auth/validation.spec.ts) | Não |

São 7 cenários e 10 testes depois da parametrização. O login acontece pela interface em cada teste que precisa dele (fixture `authenticatedPage`), sem `storageState`.

## Readiness check

[`readiness.ts`](./readiness.ts) roda como `globalSetup` antes de qualquer teste e faz um único `GET` somente de leitura na URL configurada. Não faz login, não usa credenciais e não altera estado. São até 3 tentativas com timeout de 10 s cada.

| Situação | Comportamento |
|----------|---------------|
| HTTP 200 com o marcador `<title>Swag Labs</title>` | Testes executam |
| Falha de DNS, conexão recusada, timeout ou HTTP 5xx | Repete até 3 vezes; depois falha como **indisponibilidade da aplicação externa** |
| HTTP 4xx ou HTTP 200 com outro conteúdo | Falha na hora, como **problema de configuração ou bloqueio** |

Quando o readiness falha, nenhum teste funcional é executado. Assim, uma SauceDemo fora do ar não aparece no relatório como regressão. Comandos estruturais como `--list` não executam o readiness.

## Estratégia de isolamento

- Cada teste recebe um contexto de navegador novo (padrão do Playwright). Cookies e `localStorage`, onde fica o carrinho, não passam de um teste para outro.
- Nenhum teste depende da ordem de execução ou do resultado de outro teste.
- O recurso "Reset App State" da SauceDemo não é usado para isolamento: ele limpa o carrinho, mas deixa botões "Remove" visíveis até a página ser recarregada.
- Paralelismo limitado (`workers`: 2 no CI e 4 localmente), por se tratar de um serviço público de terceiros.
- Sem `waitForTimeout`: sincronização por auto-waiting e assertions web-first.

## Limitações da aplicação externa

- A SauceDemo é mantida por terceiros: indisponibilidade, mudanças de layout, textos ou atributos `data-test` podem quebrar a suíte sem mudança neste repositório.
- Não há API pública; o projeto cobre apenas a interface.
- Usuários com defeitos intencionais (`problem_user`, `error_user`, `performance_glitch_user`, `visual_user`) ficam fora da suíte determinística.

## Próximas sprints

| Sprint | Escopo |
|--------|--------|
| 10.2 | Autenticação: `LoginPage`, componentes de header e menu, fixtures e cenários de login |
| 10.3 | Catálogo e carrinho: listagem, ordenação, detalhes, inclusão e remoção |
| 10.4 | Checkout: formulário, validações, resumo de valores e confirmação |
| 10.5 | Qualidade: verificações de acessibilidade, revisão de seletores e estabilidade |
| 10.6 | CI/CD: workflow dedicado, smoke, regressão e Quality Gate |
| 10.7 | Homologação: execuções reproduzíveis e evidências |
| 10.8 | Documentação e publicação do Capítulo 10 |
