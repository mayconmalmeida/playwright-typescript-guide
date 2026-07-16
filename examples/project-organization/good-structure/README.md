# Good Structure

Estrutura recomendada: **domínio primeiro, tipo depois**.

```
good-structure/
├── tests/
│   ├── auth/
│   ├── wallet/
│   └── users/
├── pages/
├── data/
├── fixtures/
├── utils/
└── selectors/
```

- `tests/` é dividida por domínio (`auth/`, `wallet/`, `users/`) — cada um cresce de forma independente.
- `pages/`, `data/`, `fixtures/`, `selectors/` e `utils/` continuam separadas por tipo, mas cada arquivo dentro delas carrega o nome do domínio a que pertence (`auth.data.ts`, `auth.selectors.ts`, `login.page.ts`).

Este exemplo é intencionalmente simples: os arquivos mostram **onde** cada coisa deve morar, não uma implementação completa de Page Objects ou Fixtures — esses assuntos têm capítulos próprios.

Leia o capítulo completo em [`docs/05-organizando-projeto-playwright.md`](../../../docs/05-organizando-projeto-playwright.md).
