# Projeto Final — Automação E2E da SauceDemo

> 🚧 **Em construção.** Implementados: fundação técnica (Sprint 10.1), autenticação (Sprint 10.2), catálogo e carrinho (Sprint 10.3) e checkout E2E (Sprint 10.4). O workflow de CI do projeto final ainda não foi implementado.

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
│   ├── cart.page.ts        # ✅ itens, quantidades, remoção e início do checkout
│   ├── checkout-information.page.ts # ✅ formulário e cancelamento
│   ├── checkout-overview.page.ts    # ✅ itens, valores, cancelamento e Finish
│   └── checkout-complete.page.ts    # ✅ confirmação e Back Home
├── components/
│   ├── header.component.ts     # ✅ título, link e badge do carrinho
│   ├── inventory-item.component.ts # ✅ dados e botões compartilhados pelas duas telas
│   └── side-menu.component.ts  # ✅ menu lateral e logout
├── fixtures/
│   ├── test.fixture.ts     # ✅ pages, componentes, credenciais e authenticatedPage
│   └── checkout.fixture.ts # ✅ preparação independente das etapas via UI
├── test-data/
│   ├── users.ts            # ✅ usernames públicos e credenciais inválidas (sem senha)
│   ├── auth-messages.ts    # ✅ mensagens de erro da tela de login
│   ├── products.ts         # ✅ seis nomes e detalhes de dois produtos observados
│   ├── checkout.ts         # ✅ cliente fictício e mensagens observadas
│   └── routes.ts           # ✅ caminhos da aplicação
├── utils/
│   └── money.ts            # ✅ parsing estrito de USD para centavos inteiros
└── tests/
    ├── auth/               # ✅ AUTH-01 a AUTH-07
    ├── catalog/            # ✅ inventory.spec.ts e sorting.spec.ts
    ├── cart/               # ✅ add-remove.spec.ts e persistence.spec.ts
    ├── checkout/           # ✅ information, validation, overview e completion.spec.ts
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

A senha é exigida por AUTH-01, AUTH-02, AUTH-05 e todos os testes de catálogo, carrinho e checkout. Sem ela, esses testes **falham** com a mensagem `SAUCEDEMO_PASSWORD não definida`: não são pulados nem aprovados. O type-check, a listagem (`--list`), o readiness check, os testes de parsing monetário e os cenários negativos de autenticação funcionam sem a senha.

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
Para executar apenas checkout: `npm run test:final -- --grep CHECK-`.
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
| CHECK-01 | Iniciar checkout com produto no carrinho | `@smoke` | [`information.spec.ts`](./tests/checkout/information.spec.ts) | Sim |
| CHECK-02 | First Name, Last Name e Postal Code obrigatórios (3 casos) | `@regression` | [`validation.spec.ts`](./tests/checkout/validation.spec.ts) | Sim |
| CHECK-03 | Dados fictícios válidos avançam ao resumo | `@regression` | [`information.spec.ts`](./tests/checkout/information.spec.ts) | Sim |
| CHECK-04 | Cancelar informações volta ao carrinho; cancelar resumo volta ao catálogo (2 casos) | `@regression` | [`information.spec.ts`](./tests/checkout/information.spec.ts) | Sim |
| CHECK-05 | Resumo preserva nomes, quantidades e preços de dois produtos | `@regression` | [`overview.spec.ts`](./tests/checkout/overview.spec.ts) | Sim |
| CHECK-06 | Soma dos itens = subtotal; subtotal + taxa exibida = total | `@smoke` | [`overview.spec.ts`](./tests/checkout/overview.spec.ts) | Sim |
| CHECK-07 | Finish conclui pedido de demonstração e exibe confirmação real | `@smoke` | [`completion.spec.ts`](./tests/checkout/completion.spec.ts) | Sim |
| CHECK-08 | Back Home retorna ao catálogo com carrinho vazio | `@regression` | [`completion.spec.ts`](./tests/checkout/completion.spec.ts) | Sim |

Total: **35 testes** — 10 de autenticação, 12 E2E de catálogo/carrinho, 11 E2E novos de checkout e 2 testes unitários de parsing em [`money.spec.ts`](./tests/unit/money.spec.ts). Smoke: **7 testes** (AUTH-01, AUTH-05, CAT-01, CART-01, CHECK-01, CHECK-06, CHECK-07).

O login acontece pela interface em cada teste E2E que precisa dele (fixture `authenticatedPage`), sem `storageState`. Os Page Objects encapsulam locators e interações; as assertions de negócio permanecem nos testes. O componente de produto reduz a duplicação entre catálogo e carrinho. Os preços são convertidos para centavos inteiros com validação de formato e precisão, incluindo casos inválidos nos testes unitários.

O checkout reutiliza esse componente no resumo. CHECK-06 soma os preços exibidos dos itens e compara subtotal + taxa exibida com o total, sempre em centavos inteiros; não pressupõe alíquota fixa. CHECK-05 também confronta os preços com os dados dos produtos. As fixtures de checkout preparam as etapas pela interface em cada teste e verificam apenas a navegação necessária como pré-condição. A conclusão do pedido fica explícita nos testes CHECK-07 e CHECK-08.

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
- Checkout usa somente dados pessoais fictícios. Cada teste adiciona seus próprios produtos; cancelamentos e conclusões não preparam testes posteriores.
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
- Checkout validado em 03/11/2026 com dois produtos, quantidade 1 por item e dados fictícios. A aplicação exige os três campos, mas a suíte não presume regras de formato postal que não foram observadas. Finish simula um pedido; não há pagamento real ou validação logística.
- Cobertura desta sprint restrita ao Chromium. Persistência validada na navegação dentro do mesmo contexto; não há compartilhamento de sessão entre testes.
- Durante a validação, AUTH-04 atingiu o timeout de navegação apesar de o formulário já estar renderizado; o trace mostrou fontes externas pendentes. `LoginPage.goto()` aguarda `domcontentloaded`, e os locators aguardam os campos para interagir. Os testes AUTH-01 a AUTH-07 foram preservados, sem aumentar timeouts ou habilitar retries.

## Próximas sprints

| Sprint | Escopo |
|--------|--------|
| 10.5 | Qualidade: verificações de acessibilidade, revisão de seletores e estabilidade |
| 10.6 | CI/CD: workflow dedicado, smoke, regressão e Quality Gate |
| 10.7 | Homologação: execuções reproduzíveis e evidências |
| 10.8 | Documentação e publicação do Capítulo 10 |
