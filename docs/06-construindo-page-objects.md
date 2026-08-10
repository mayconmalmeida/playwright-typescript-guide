# Engenharia de Automação com Playwright

## Capítulo 6 — Construindo Page Objects

**Tempo de leitura:** 10 min  
**Nível:** Intermediário  
**Pré-requisitos:** Capítulos 1 a 5 e conhecimentos básicos de locators  
**Objetivo:** separar intenção, interação e estado em testes Playwright legíveis e sustentáveis.

---

## Objetivo

Esta referência mostra como refatorar um login acoplado para Page Objects e Components pequenos, sem esconder as assertions que explicam o resultado esperado.

## O problema

Quando HTML de apoio, locators, ações, dados e assertions ficam no teste, mudanças da interface exigem correções espalhadas. O teste deixa de comunicar comportamento e passa a narrar implementação.

## O que é Page Object

Page Object é uma abstração de uma tela. Ele concentra locators e ações específicas. O teste chama operações como `login()` e continua responsável por afirmar o resultado.

## Quando utilizar

- quando locators e fluxos aparecem em mais de um teste;
- quando detalhes da interface escondem a intenção;
- quando mudanças exigem manutenção espalhada;
- quando há operações claras, como entrar ou solicitar logout.

## Quando NÃO utilizar

- em um cenário curto, único e já legível;
- para abstrações antecipadas sem repetição concreta;
- para esconder o Playwright atrás de métodos genéricos;
- quando a classe só transfere chamadas sem melhorar a intenção.

## Page vs Component

Uma Page representa uma tela completa, como login ou dashboard. Um Component representa uma região reutilizável, como navbar, toast ou modal. Essa separação evita Pages gigantes.

## Política de assertions

Page Objects executam ações, expõem locators e encapsulam a interface. Components expõem estado ou locators. As assertions principais pertencem ao teste:

```ts
await loginPage.login(email, password);
await expect(dashboardPage.heading).toHaveText('Dashboard');
```

Evite `validateEverything()`: o método esconde o comportamento esperado e torna falhas menos claras.

## Estrutura utilizada no exemplo

```text
examples/page-objects/
├── before/login.example.ts
└── after/
    ├── pages/login.page.ts
    ├── pages/dashboard.page.ts
    ├── components/navbar.component.ts
    ├── components/toast.component.ts
    ├── components/confirmation-modal.component.ts
    └── tests/login.example.ts
```

Os `.example.ts` ficam fora de `testDir`: são compilados, mas não entram na suíte principal. O cenário usa `page.setContent()` e não depende de internet.

## Boas práticas

- prefira métodos que expressem intenção, como `login()`;
- mantenha Pages pequenas e focadas;
- extraia regiões reutilizáveis para Components;
- receba dados pelos métodos;
- exponha locators relevantes para assertions no teste;
- use locators acessíveis e nunca `waitForTimeout`.

## Erros comuns

- criar métodos genéricos como `clickButton()`;
- colocar assertions dentro de Pages;
- criar classe base complexa sem necessidade;
- reunir a aplicação em um God Object;
- fixar dados nas abstrações;
- abstrair um teste simples até prejudicar a leitura.

## Checklist

- [ ] O teste comunica o que está sendo validado?
- [ ] A Page comunica como interagir com a tela?
- [ ] Components representam regiões reutilizáveis?
- [ ] As assertions principais estão no teste?
- [ ] Classes têm responsabilidades pequenas?
- [ ] Não há dados fixos nem esperas arbitrárias nas abstrações?

## Desafio

Crie um cenário de logout: inicie a saída pelo `DashboardPage`, confirme pelo `ConfirmationModalComponent` e valide no teste que o login voltou. Depois implemente o cancelamento.

## Próximo capítulo

➡ Capítulo 7 — Trabalhando com Fixtures (em breve)
