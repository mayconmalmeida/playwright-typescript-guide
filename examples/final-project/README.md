# Projeto Final — Automação E2E da SauceDemo

> 🚧 **Em construção.** Implementados: fundação técnica (Sprint 10.1), autenticação (Sprint 10.2), catálogo e carrinho (Sprint 10.3). Checkout e workflow de CI do projeto final ainda não foram implementados.

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
│   ├── login.page.ts
│   ├── inventory.page.ts   # ✅ produtos, ordenação e acesso ao carrinho
│   └── cart.page.ts        # ✅ itens, quantidades, remoção e volta ao catálogo
├── components/
│   ├── header.component.ts     # ✅ título, link e badge do carrinho
│   ├── inventory-item.component.ts # ✅ dados e botões compartilhados pelas duas telas
│   └── side-menu.component.ts  # ✅ menu lateral e logout
├── fixtures/
│   └── test.fixture.ts     # ✅ pages, componentes, credenciais e authenticatedPage
├── test-data/
│   ├── users.ts            # ✅ usernames públicos e credenciais inválidas (sem senha)
│   ├── auth-messages.ts    # ✅ mensagens de erro da tela de login
│   ├── products.ts         # ✅ seis nomes e detalhes de dois produtos observados
│   └── routes.ts           # ✅ caminhos da aplicação
├── utils/
│   └── money.ts            # ✅ parsing estrito de USD para centavos inteiros
└── tests/
    ├── auth/               # ✅ AUTH-01 a AUTH-07
    ├── catalog/            # ✅ inventory.spec.ts e sorting.spec.ts
    ├── cart/               # ✅ add-remove.spec.ts e persistence.spec.ts
    └── unit/               # ✅ money.spec.ts, sem navegador
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

A senha é exigida por AUTH-01, AUTH-02, AUTH-05 e todos os testes de catálogo e carrinho. Sem ela, esses testes **falham** com a mensagem `SAUCEDEMO_PASSWORD não definida`: não são pulados nem aprovados. O type-check, a listagem (`--list`), o readiness check, os testes de parsing monetário e os cenários negativos de autenticação funcionam sem a senha.

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

Para executar apenas catálogo e carrinho: `npm run test:final -- --grep 'CAT-|CART-'`.
Para validar o parsing monetário: `npm run test:final -- tests/unit` (sem navegador ou senha; o readiness global ainda consulta a aplicação).

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
| CAT-01 | Catálogo disponível com os seis produtos esperados | `@smoke` | [`inventory.spec.ts`](./tests/catalog/inventory.spec.ts) | Sim |
| CAT-02 | Nome, descrição e preço reais de dois produtos | `@regression` | [`inventory.spec.ts`](./tests/catalog/inventory.spec.ts) | Sim |
| CAT-03 | Ordenação completa A–Z e Z–A (2 casos) | `@regression` | [`sorting.spec.ts`](./tests/catalog/sorting.spec.ts) | Sim |
| CAT-04 | Ordenação numérica completa crescente e decrescente (2 casos) | `@regression` | [`sorting.spec.ts`](./tests/catalog/sorting.spec.ts) | Sim |
| CART-01 | Inclusão: botão Remove, badge e identidade no carrinho | `@smoke` | [`add-remove.spec.ts`](./tests/cart/add-remove.spec.ts) | Sim |
| CART-02 | Múltiplos produtos, badge e ausência de duplicação | `@regression` | [`add-remove.spec.ts`](./tests/cart/add-remove.spec.ts) | Sim |
| CART-03 | Remoção no catálogo atualiza botão e badge | `@regression` | [`add-remove.spec.ts`](./tests/cart/add-remove.spec.ts) | Sim |
| CART-04 | Remoção no carrinho preserva o outro produto | `@regression` | [`add-remove.spec.ts`](./tests/cart/add-remove.spec.ts) | Sim |
| CART-05 | Persistência entre catálogo, carrinho e retorno | `@regression` | [`persistence.spec.ts`](./tests/cart/persistence.spec.ts) | Sim |
| CART-06 | Carrinho inicialmente vazio e retorno ao catálogo | `@regression` | [`persistence.spec.ts`](./tests/cart/persistence.spec.ts) | Sim |

Total: **24 testes** — 10 de autenticação preservados, 12 E2E novos de catálogo/carrinho e 2 testes unitários de parsing em [`money.spec.ts`](./tests/unit/money.spec.ts). Smoke: **4 testes** (AUTH-01, AUTH-05, CAT-01, CART-01).

O login acontece pela interface em cada teste E2E que precisa dele (fixture `authenticatedPage`), sem `storageState`. Os Page Objects encapsulam locators e interações; as assertions de negócio permanecem nos testes. O componente de produto reduz a duplicação entre catálogo e carrinho. Os preços são convertidos para centavos inteiros com validação de formato e precisão, incluindo casos inválidos nos testes unitários.

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
- Sem `describe.serial`, retries ou estado persistido compartilhado. Ordenações comparam listas completas; produtos são identificados pelo nome exato, sem depender da posição.

## Limitações da aplicação externa

- A SauceDemo é mantida por terceiros: indisponibilidade, mudanças de layout, textos ou atributos `data-test` podem quebrar a suíte sem mudança neste repositório.
- Não há API pública; o projeto cobre apenas a interface.
- Usuários com defeitos intencionais (`problem_user`, `error_user`, `performance_glitch_user`, `visual_user`) ficam fora da suíte determinística.
- Reconhecimento em 03/11/2026: carrinho vazio não exibe mensagem específica; o badge desaparece e os botões Continue Shopping e Checkout continuam habilitados. CART-06 verifica esse estado sem iniciar o checkout.
- Cobertura desta sprint restrita ao Chromium. Persistência validada na navegação dentro do mesmo contexto; não há compartilhamento de sessão entre testes.
- Durante a validação, AUTH-04 atingiu o timeout de navegação apesar de o formulário já estar renderizado; o trace mostrou fontes externas pendentes. `LoginPage.goto()` aguarda `domcontentloaded`, e os locators aguardam os campos para interagir. Os testes AUTH-01 a AUTH-07 foram preservados, sem aumentar timeouts ou habilitar retries.

## Próximas sprints

| Sprint | Escopo |
|--------|--------|
| 10.4 | Checkout: formulário, validações, resumo de valores e confirmação |
| 10.5 | Qualidade: verificações de acessibilidade, revisão de seletores e estabilidade |
| 10.6 | CI/CD: workflow dedicado, smoke, regressão e Quality Gate |
| 10.7 | Homologação: execuções reproduzíveis e evidências |
| 10.8 | Documentação e publicação do Capítulo 10 |
