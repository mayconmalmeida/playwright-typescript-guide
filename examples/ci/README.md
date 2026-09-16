# CI com GitHub Actions

Este exemplo reúne arquivos pequenos e coerentes para levar uma suíte Playwright a um runner limpo sem ativar outro workflow neste repositório.

```text
examples/ci/
├── workflows/
│   ├── minimal.yml
│   └── recommended.yml
├── tests/
│   └── health.example.ts
├── playwright.config.ts
└── README.md
```

- `minimal.yml` mostra checkout, Node, instalação e teste.
- `recommended.yml` acrescenta nomes, limite do job, variables, secrets e artifact.
- `playwright.config.ts` aplica decisões conservadoras para CI.
- `health.example.ts` é determinístico, não usa rede nem credenciais.

Os YAMLs ficam deliberadamente fora de `.github/workflows/`: são exemplos copiáveis, não workflows ativos. Adapte triggers, variáveis e browsers ao projeto de destino.

Para executar apenas este exemplo:

```bash
npx playwright test --config=examples/ci/playwright.config.ts
```

Nenhum segredo real é necessário. Leia o [Capítulo 8](../../docs/08-playwright-github-actions-ci.md) antes de copiar o workflow recomendado.
