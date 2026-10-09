# CI/CD com Playwright

Exemplo do [Capítulo 9](../../docs/09-playwright-cicd-deploy.md): smoke tests usados como critério de liberação antes do merge, contra um preview implantado e depois do deploy em produção.

```text
examples/cicd/
├── app/
│   └── server.js            # aplicação de demonstração, sem dependências
├── tests/
│   ├── smoke.example.ts     # smoke somente de leitura (@smoke)
│   └── feedback.example.ts  # cria dados (@write): excluído em produção
├── workflows/
│   ├── pull-request-gate.yml
│   ├── preview-validation.yml
│   └── production-smoke.yml
├── environment.ts           # resolve local | preview | production
├── readiness.ts             # global setup: aguarda o health check
├── playwright.config.ts
├── .env.example
└── README.md
```

## Por que uma aplicação local?

A aplicação de demonstração roda com `node`, sem conta em plataforma de deploy e sem rede externa. Os testes ficam determinísticos e qualquer pessoa consegue reproduzir o gate, inclusive a falha. Os workflows de preview e produção mostram como apontar a mesma suíte para uma URL real.

## Executar

Na raiz do repositório:

```bash
npm ci
npx playwright install chromium

# local: o Playwright sobe app/server.js em http://127.0.0.1:4317
npx playwright test --config=examples/cicd/playwright.config.ts

# regressão simulada: o gate deve terminar com exit code 1
DEMO_FAILURE=courses-500 npx playwright test --config=examples/cicd/playwright.config.ts

# quais testes rodariam em produção (sem executar nada)
PLAYWRIGHT_TARGET_ENV=production PLAYWRIGHT_BASE_URL=https://exemplo.com \
  npx playwright test --config=examples/cicd/playwright.config.ts --list

# relatório HTML da última execução
npx playwright show-report examples/cicd/playwright-report
```

No PowerShell, defina variáveis com `$env:DEMO_FAILURE = 'courses-500'` e remova com `Remove-Item Env:DEMO_FAILURE`.

## Ambientes

| `PLAYWRIGHT_TARGET_ENV` | `PLAYWRIGHT_BASE_URL` | Comportamento |
|---|---|---|
| ausente ou `local` | ausente | sobe a aplicação de demonstração |
| ausente ou `local` | `localhost`/`127.0.0.1` | usa o servidor informado |
| ausente ou `local` | URL remota | **erro**: declare o ambiente |
| `preview` | `https://...` obrigatória | todos os testes |
| `production` | `https://...` obrigatória | exclui testes `@write` |

## Workflows

Os YAMLs ficam fora de `.github/workflows/` e não executam neste repositório. Para usá-los, copie para `.github/workflows/` e ajuste `PLAYWRIGHT_CONFIG` e os nomes de ambiente da sua plataforma. Bloqueio de merge e de deploy depende de configuração no GitHub: veja a seção de quality gates do capítulo.
