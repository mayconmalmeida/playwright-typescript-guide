# Engenharia de Automação com Playwright

## Capítulo 10 — Projeto final: automação E2E da SauceDemo

**Status:** 🚧 Rascunho para revisão — homologação Windows e Linux conferida na Sprint 10.7, não publicado

**Tempo de leitura:** 20 min

**Nível:** Intermediário

**Pré-requisitos:** Capítulos 1 a 9, Node.js 22 ou superior e acesso à internet

**Objetivo:** executar e compreender uma suíte isolada que conecta autenticação, catálogo, carrinho e checkout usando TypeScript, Page Objects e fixtures.

---

## Introdução

Nos capítulos anteriores, construímos testes, escolhemos locators, organizamos Page Objects e usamos fixtures para preparar contexto. Agora vamos reunir essas decisões em um fluxo completo de compra de demonstração:

**Login → Catálogo → Carrinho → Checkout → Confirmação**

O código fica em [`examples/final-project/`](../examples/final-project/). A aplicação é a [SauceDemo](https://www.saucedemo.com/), uma loja pública de demonstração. O projeto usa sua interface real; Finish simula a conclusão de um pedido, sem pagamento ou entrega reais.

O código dos capítulos 8 e 9 ensina CI/CD com exemplos próprios. Na Sprint 10.6, o projeto final recebeu um workflow independente para validar a suíte no Ubuntu. A Sprint 10.7 conferiu uma execução real aprovada no GitHub Actions e repetiu a homologação local; o [relatório final](./10-final-homologation.md) distingue essas evidências. Este capítulo continua como rascunho, sem publicação ou deploy.

## O que estamos construindo e por quê?

Um teste E2E verifica um comportamento atravessando as telas necessárias. Neste projeto, uma conclusão de pedido começa com login, seleciona produtos, abre o carrinho, preenche os dados do cliente e confirma a compra. Além do caminho principal, precisamos verificar rejeições, cancelamentos, ordenação e preservação do estado durante a navegação.

Um único teste enorme dificultaria descobrir onde ocorreu uma regressão. Dividimos a cobertura por comportamento e repetimos a preparação necessária em um contexto novo para cada teste. Assim, uma falha na conclusão não depende de um teste anterior ter deixado produtos no carrinho.

Há **41 testes**: 12 de autenticação, 12 de catálogo/carrinho, 11 de checkout e 6 unitários. A parametrização representa casos concretos, como cada campo obrigatório vazio ou cada rota protegida. O [README operacional](../examples/final-project/README.md#cenários-implementados) mapeia os IDs para seus arquivos.

## Preparando o ambiente

Na raiz do repositório, instale as dependências do lockfile e o Chromium:

```bash
npm ci
npx playwright install chromium
```

A senha de demonstração aparece na página de login da SauceDemo. Copie-a para uma variável da sessão, sem colocá-la no código.

PowerShell:

```powershell
$env:SAUCEDEMO_PASSWORD = "<senha exibida na tela de login>"
```

Bash:

```bash
export SAUCEDEMO_PASSWORD='<senha exibida na tela de login>'
```

Por padrão, usamos `https://www.saucedemo.com/` e o username público `standard_user`. `SAUCEDEMO_BASE_URL` e `SAUCEDEMO_USERNAME` permitem alterar esses valores. A URL usa HTTPS; HTTP é aceito apenas em loopback para uma cópia local. O projeto utiliza apenas a origem da URL. `.env.example` documenta as variáveis, mas não há carregamento automático de `.env`.

A senha é resolvida por uma fixture somente quando necessária. Listagem e typecheck funcionam sem ela; testes que precisam autenticar falham claramente se ela estiver ausente. Não existe aprovação por falta de credencial.

```bash
npm run typecheck:final
npm run test:final:list
npm run test:final:smoke
npm run test:final
```

O smoke executa 7 cenários essenciais. A suíte completa inclui smoke, 28 casos marcados como regressão e 6 unitários. Para investigar um grupo:

```bash
npm run test:final -- --grep @regression
npm run test:final -- --grep CHECK-
npm run test:final -- --grep AUTH-06
npm run test:final -- tests/unit
```

Os unitários não abrem navegador nem usam a senha do ambiente. Contudo, a configuração compartilhada executa o readiness global também para esse filtro, exigindo acesso à aplicação. `--list` não executa o readiness.

## Como a arquitetura funciona

```text
examples/final-project/
├── config/             URL, credenciais e reporter do Quality Gate
├── ci/                 contratos do gate e sanitização de evidências
├── pages/              uma classe por tela
├── components/         cabeçalho, menu e item de produto
├── fixtures/           dependências e preparação via UI
├── test-data/          rotas, produtos, mensagens e cliente fictício
├── utils/              conversão monetária
├── tests/              auth, catalog, cart, checkout e unit
├── readiness.ts        verificação de disponibilidade
├── playwright.config.ts
└── tsconfig.json       TypeScript strict
```

| Conceito aprendido | Aplicação no projeto |
|--------------------|----------------------|
| Locators | Papel/nome acessível e `getByTestId`, configurado para `data-test` |
| Page Object Model | Ações e locators centralizados por tela |
| Componentes | Item de produto reutilizado em catálogo, carrinho e resumo |
| Fixtures tipadas | Preparação por dependência, com escopo de teste |
| Assertions | Resultados de negócio visíveis nos cenários |
| Isolamento | Contexto novo, sem sessão ou carrinho compartilhados |

Os seis Page Objects são `LoginPage`, `InventoryPage`, `CartPage`, `CheckoutInformationPage`, `CheckoutOverviewPage` e `CheckoutCompletePage`. Um Page Object sabe interagir com sua tela; o teste decide qual resultado comprova o cenário. `HeaderComponent` e `SideMenuComponent` encapsulam controles comuns. `InventoryItemComponent` recebe um locator limitado a um produto, sem depender da posição na lista.

Por exemplo, a seleção de produto em [`InventoryPage`](../examples/final-project/pages/inventory.page.ts) usa o nome exato dentro dos itens do catálogo:

```ts
product(name: string): InventoryItemComponent {
  return new InventoryItemComponent(this.items.filter({
    has: this.page.getByText(name, { exact: true }),
  }));
}
```

Essa composição evita repetir todos os locators de produto em cada tela. Não precisamos de uma hierarquia de classes para compartilhar uma interação tão localizada.

## Fixtures: preparação explícita por dependência

[`test.fixture.ts`](../examples/final-project/fixtures/test.fixture.ts) oferece `loginPage`, `header`, `sideMenu`, `credentials` e `authenticatedPage`. A última abre o login, autentica pela interface e verifica catálogo/URL como pré-condições. O restante do cenário fica no teste.

[`checkout.fixture.ts`](../examples/final-project/fixtures/checkout.fixture.ts) estende essas fixtures:

```text
authenticatedPage
    └── checkoutInformation: adiciona dois produtos, abre carrinho e checkout
            └── checkoutOverview: preenche cliente fictício e avança ao resumo
```

Solicitar `checkoutOverview` executa as dependências necessárias para aquele teste. Solicitar apenas `loginPage` não autentica ninguém. Os testes negativos de login não precisam resolver a senha válida.

As fixtures verificam se a preparação chegou à etapa esperada. Assertions sobre totais, mensagens de confirmação e carrinho vazio permanecem nos testes. Finish é uma ação explícita do cenário, e não uma operação escondida na fixture.

## Percorrendo o fluxo completo

| Etapa | O que verificamos | Exemplos |
|-------|-------------------|----------|
| Login | Sucesso, sessão após reload, bloqueio, campos obrigatórios, logout e acesso sem sessão às cinco rotas protegidas | AUTH-01 a AUTH-07 |
| Catálogo | Seis produtos, detalhes de dois itens e ordenação completa por nome/preço | CAT-01 a CAT-04 |
| Carrinho | Inclusão, remoção, badge, quantidades, identidade e persistência na navegação | CART-01 a CART-06 |
| Checkout: informações | Campos obrigatórios, dados fictícios válidos e cancelamento | CHECK-01 a CHECK-04 |
| Checkout: resumo | Produtos, preços, quantidades, subtotal, taxa exibida e total | CHECK-05 e CHECK-06 |
| Confirmação | Mensagem de conclusão, badge ausente e retorno ao catálogo com carrinho vazio | CHECK-07 e CHECK-08 |

O teste abaixo mostra a etapa final, em um trecho de [`completion.spec.ts`](../examples/final-project/tests/checkout/completion.spec.ts). Seus imports e dados estão no arquivo completo:

```ts
test('CHECK-07 finalizar pedido de demonstração exibe confirmação', { tag: '@smoke' }, async ({ checkoutOverview, page, header }) => {
  await checkoutOverview.finish();

  await expect(page).toHaveURL(routes.checkoutComplete);
  await expect(header.title).toHaveText('Checkout: Complete!');
  const complete = new CheckoutCompletePage(page);
  await expect(complete.confirmation).toHaveText(checkoutMessages.completeHeader);
  await expect(complete.message).toHaveText(checkoutMessages.completeText);
  await expect(header.cartBadge).toHaveCount(0);
});
```

Embora a fixture entregue o resumo, o contexto percorreu login, catálogo, carrinho e informações pela interface. CHECK-08 faz sua própria preparação e verifica Back Home e carrinho vazio após concluir outro pedido de demonstração.

## Dinheiro, dados e qualidade das assertions

Comparar somente a presença de um preço não detectaria um valor errado. Os testes confrontam identidade, preço e quantidade dos produtos. As ordenações comparam listas completas; a ordenação numérica preserva todos os nomes, inclusive os itens com preços iguais.

[`money.ts`](../examples/final-project/utils/money.ts) converte USD para centavos inteiros: `$29.99` resulta em `2999` e `$9.99`, em `999`. O subtotal dos dois produtos é `3998`. A conversão rejeita formato inesperado e valores fora da precisão segura, em vez de arredondar silenciosamente.

No CHECK-06, depois de conferir os itens, o resultado segue estas relações:

```ts
const { subtotal, tax, total } = await checkoutOverview.totalsInCents();
expect(subtotal, 'subtotal deve somar os preços exibidos dos itens').toBe(itemSubtotal);
expect(total, 'total deve somar subtotal e taxa exibidos, em centavos').toBe(subtotal + tax);
```

`itemSubtotal` é a soma dos preços exibidos dos itens, cuja quantidade é verificada como 1. Não presumimos uma alíquota fixa. Os unitários monetários protegem o parser; os de configuração verificam URL, protocolo, credenciais sob demanda e mensagens de erro sem exposição da entrada.

Os arquivos em `test-data/` guardam os dados públicos esperados e um cliente inteiramente fictício. Alterar uma expectativa para fazer o teste passar exige primeiro confirmar a mudança real no site.

## Isolamento e sincronização

Cada teste usa um contexto de navegador novo. Cookies e `localStorage` não passam entre cenários, e o carrinho é preparado novamente quando necessário. Não usamos `storageState`, `describe.serial`, ordem de execução ou “Reset App State” para compartilhar preparação.

O runner usa Chromium, quatro workers locais e dois quando `CI` está definido. Os testes têm timeout de 30 s, navegação de 15 s, ações de 10 s e assertions de 5 s. Retries estão em zero. Assertions de locators e auto-waiting aguardam as condições de interface; não há `waitForTimeout` nos cenários.

`LoginPage.goto()` aguarda `domcontentloaded`: uma execução anterior demonstrou que fontes externas podiam manter `load` pendente com o formulário já disponível. Depois disso, os locators aguardam os campos para interagir. A escolha resolve uma dependência externa observada, sem aumentar o timeout.

## Diagnóstico e segurança

Antes dos testes, [`readiness.ts`](../examples/final-project/readiness.ts) consulta a origem configurada e procura o marcador HTML da SauceDemo. São até três tentativas de GET para falhas transitórias, com timeout de 10 s e intervalo de 3 s. HTTP 4xx ou conteúdo inesperado interrompem a preparação como configuração/bloqueio. As tentativas de disponibilidade não repetem os cenários funcionais.

Se o readiness falhar, nenhum teste funcional executou: investigue conexão, URL ou aplicação externa. Se um cenário falhar, comece pelo primeiro erro e abra o relatório:

```bash
npm run test:final:report
```

O relatório fica em `examples/final-project/playwright-report/`. Localmente, screenshot e trace são retidos em falhas em `examples/final-project/test-results/`. No CI, traces ficam desativados para proteger credenciais. O terminal local informa o caminho do trace; abra-o com:

```bash
npx playwright show-trace "<caminho-do-trace.zip>"
npm run test:final -- --grep CHECK-07 --headed
```

Uma nova execução substitui os artefatos anteriores. Examine ação, locator, DOM e rede antes de mudar o teste. Não use retries para esconder falhas intermitentes.

Traces podem conter senha e todos os dados digitados nos formulários, além de snapshots da tela. Use somente os dados fictícios do projeto e revise evidências antes de compartilhá-las. `.env`, relatórios e resultados estão ignorados pelo Git. Não versionamos a senha, cookies ou sessão autenticada, e as mensagens de erro de configuração não reproduzem a URL recebida.

## Validando no GitHub Actions

O workflow [`chapter-10-final-project.yml`](../.github/workflows/chapter-10-final-project.yml) usa Ubuntu 24.04 e Node.js 22.23.4 fixado. Faz checkout com token somente de leitura, usa cache npm pelo lockfile, executa `npm ci` e instala Chromium com as dependências Linux. Preserva os workflows dos capítulos anteriores e não realiza deploy.

É acionado por push na branch `feat/playwright-chapter-10-final-project` e por PRs que alterem o projeto final, este rascunho, o próprio workflow ou os manifests npm. O filtro evita executar a suíte em qualquer alteração do repositório. Como checks filtrados podem ficar pendentes, exigir esse check globalmente requer uma política compatível com os caminhos. `workflow_dispatch` está declarado, mas a execução manual pela interface depende de o arquivo existir na branch padrão; enquanto estiver apenas nesta branch, o push dispara o job.

### Credencial e aprovação explícita

Cadastre manualmente **Settings → Secrets and variables → Actions → New repository secret**, com o nome `SAUCEDEMO_PASSWORD` e a senha de demonstração como valor. Nunca inclua o valor no YAML ou em logs. Nenhum secret é criado automaticamente. Se estiver ausente, a validação falha antes de checkout, instalação e testes; isso não representa suíte aprovada. Forks e Dependabot não recebem credenciais e são rejeitados antes de executar código do PR. Uma execução em branch confiável exige revisão prévia. Não usamos `pull_request_target`.

Após a instalação, o job executa typecheck, contratos de segurança e do gate, listagem, smoke de **7 testes** e suíte completa de **41 testes**. São dois workers e zero retries. O reporter recebe `SAUCEDEMO_EXPECTED_TESTS` apenas nos passos correspondentes e exige exatamente um resultado aprovado por teste. Falha, skip, fixme, falha esperada, flaky, retries habilitados ou contagem incorreta fazem o job falhar. Os contratos sintéticos verificam esses caminhos de rejeição sem alterar os 41 testes existentes.

Um smoke falho interrompe a sequência antes da regressão. Readiness indisponível continua sendo um diagnóstico separado de falha funcional, com tentativas limitadas; não existe bypass nem aprovação por ausência de resultados. O [README operacional](../examples/final-project/README.md#github-actions-e-quality-gate) mostra como reproduzir o gate localmente.

### Evidências e interpretação

Na execução do Actions, abra o job e leia o primeiro passo que falhou: configuração do secret, instalação, typecheck, disponibilidade externa, assertion ou regra do gate. Cancelamentos também não comprovam aprovação.

Em falhas após a listagem, somente uma pasta preparada para upload é enviada como `chapter-10-failure-<run_id>-<attempt>`, com retenção de **3 dias**. Traces são desativados no CI por decisão de proteção das credenciais. A fixture oculta o bloco de senha pública da página; o input mantém sua máscara de password. O preparador remove a credencial configurada do texto e do ZIP embutido no HTML, inclusive suas formas escapada em JSON e codificada em URL. Arquivos inesperados, symlinks e falhas na sanitização bloqueiam o upload. Os contratos cobrem o processamento; o uso das bibliotecas ZIP internas do Playwright exige revisão quando a dependência for atualizada.

Baixe o ZIP em **Artifacts**, extraia e abra `playwright-report/index.html` preservando a pasta `data`; confira também `screenshots/`. Pessoas com acesso ao repositório podem acessar esses arquivos conforme as permissões do GitHub. Não há publicação em páginas públicas nem comentários automáticos com traces. Use dados fictícios e revise evidências; a sanitização da senha não remove qualquer dado pessoal possível. Falhas antes dos testes podem não gerar anexos.

A [tentativa 2 da execução 41646779044](https://github.com/mayconmalmeida/playwright-typescript-guide/actions/runs/41646779044/attempts/2) foi aprovada em 03/11/2026, após configuração manual do secret, para o commit `e4ac35edcf21f45ffcaa71a700f5807850c0c091`. Os logs conferidos na Sprint 10.7 mostram Ubuntu 24.04, Node.js 22.23.4, instalação do Chromium, typecheck e contratos aprovados, smoke 7/7 e suíte 41/41, sem retries ou testes funcionais ignorados. A homologação Linux desse baseline está concluída. O [relatório de homologação](./10-final-homologation.md) registra também os resultados Windows e as limitações; não há necessidade de reexecutar o workflow apenas para repetir essa evidência.

## Quando utilizar e quais são os limites?

Este projeto serve para aprender composição de testes e demonstrar um fluxo E2E de interface. É útil quando queremos comprovar que várias telas funcionam juntas, incluindo estados intermediários e resultados visíveis.

A SauceDemo pertence a terceiros; disponibilidade e mudanças no site escapam ao controle do repositório. A suíte usa os usuários padrão e bloqueado nos cenários pertinentes, deixando usuários com defeitos intencionais fora da validação determinística. Não há API pública coberta nem pagamento real. A cobertura atual é Chromium, sem auditoria formal de acessibilidade ou matriz de outros navegadores.

O carrinho vazio tem Checkout habilitado na aplicação observada, e a suíte não inventa uma regra de bloqueio. Os campos do checkout são obrigatórios, mas não presumimos validação de formato postal. A quantidade observada é 1 por produto. Estes limites estão detalhados no README.

Não use uma demonstração pública para validar regras reais de frete, tributação, segurança ou operação financeira de uma loja. Para um produto próprio, escolha seu ambiente controlado e complemente E2E com testes das camadas adequadas.

## Boas práticas e erros comuns

- Identifique produtos pelo nome exato e valide listas completas; selecionar o primeiro item pode esconder mudança de ordem.
- Prepare estado por teste; depender de um carrinho criado antes provoca resultados diferentes conforme a ordem.
- Mantenha a regra de negócio nas assertions; uma Page que só “faz tudo” dificulta entender o cenário.
- Diferencie aplicação indisponível de falha funcional; aumentar retries não resolve a causa.
- Preserve mensagens úteis sem copiar entrada potencialmente sensível para os logs.
- Corrija código ou amplie cobertura por um problema demonstrável, preservando a leitura do exemplo.

## Resumo

O projeto conecta os conceitos dos capítulos anteriores em 35 testes de interface e 6 unitários. As Pages concentram interações, os componentes reutilizam elementos e as fixtures preparam contexto independente. Os cenários verificam o resultado do fluxo, enquanto typecheck, relatório e trace apoiam sua manutenção.

## Desafio da aula

1. Execute typecheck, listagem, smoke e suíte completa com a configuração documentada.
2. Abra CHECK-06 e explique de onde vêm `itemSubtotal`, `subtotal`, `tax` e `total`.
3. Desenhe as dependências de `checkoutOverview` e identifique quais ações são preparação e quais pertencem ao cenário CHECK-07.
4. Execute AUTH-06 e confira por que há cinco casos parametrizados sem precisar de senha válida.
5. Explique como investigaria um timeout de navegação e quais dados revisaria antes de compartilhar um trace.

## Próximos passos

A Sprint 10.7 concluiu a auditoria técnica e registrou a recomendação no [relatório de homologação](./10-final-homologation.md), que aguarda revisão. A Sprint 10.8 exige nova autorização para os ajustes de publicação listados nesse relatório. Este arquivo permanece um rascunho e não altera o status editorial dos capítulos publicados.

⬅ [Capítulo 9 — Playwright em CI/CD e Deploy](./09-playwright-cicd-deploy.md)

📁 [Código e instruções do projeto final](../examples/final-project/README.md)
