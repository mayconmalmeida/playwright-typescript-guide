# SERIES

## Apresentação da série

O Playwright TypeScript Guide é uma série didática que ensina automação de testes com Playwright e TypeScript. Cada capítulo traz um conceito específico, exemplos práticos e material de apoio para acelerar o aprendizado.

## Objetivo

A série foi criada para mostrar como construir automações profissionais com foco em estabilidade, boas práticas e organização de projeto.

## Como estudar

1. Leia o capítulo correspondente.
2. Explore o código de exemplo associado.
3. Execute o exemplo localmente.
4. Aplique o mesmo padrão em um projeto real.

## Capítulos

| Capítulo | Tema | Status | Artigo | Código |
|----------|------|--------|--------|--------|
| 1 | Criando seu primeiro projeto | ✅ | Publicado | [`./examples/first-test.spec.ts`](./examples/first-test.spec.ts) |
| 2 | Entendendo a estrutura | ✅ | Publicado | [`./docs/02-entendendo-a-estrutura.md`](./docs/02-entendendo-a-estrutura.md) |
| 3 | Escrevendo seu primeiro teste | ✅ | Publicado | [`./examples/first-test.spec.ts`](./examples/first-test.spec.ts) |
| 4 | Dominando Locators | ✅ | Publicado | [`./docs/04-dominando-locators.md`](./docs/04-dominando-locators.md) |
| 5 | Organizando um projeto Playwright | ✅ | Publicado | [`./examples/project-organization/`](./examples/project-organization/) |
| 6 | Construindo Page Objects | ✅ Publicado | [✅ Ler capítulo](https://mayconmalicheskidealmeida.vercel.app/artigos/page-object-model-playwright-typescript) | [Documentação](./docs/06-construindo-page-objects.md) · [Exemplos](./examples/page-objects/) |
| 7 | Trabalhando com Fixtures | ✅ Publicado | [✅ Ler capítulo](https://mayconmalicheskidealmeida.vercel.app/artigos/fixtures-playwright-typescript) | [Documentação](./docs/07-trabalhando-com-fixtures.md) · [Exemplos](./examples/fixtures/) |
| 8 | GitHub Actions | ✅ Publicado | [✅ Ler capítulo](https://mayconmalicheskidealmeida.vercel.app/artigos/playwright-github-actions-ci) | [Documentação](./docs/08-playwright-github-actions-ci.md) · [Exemplos](./examples/ci/) |
| 9 | CI/CD e validação de deploy | ✅ Publicado | [✅ Ler capítulo](https://mayconmalicheskidealmeida.vercel.app/artigos/playwright-cicd-deploy) | [Documentação](./docs/09-playwright-cicd-deploy.md) · [Exemplos](./examples/cicd/) |
| 10 | Projeto final SauceDemo | ✅ Implementado e homologado | Blog pendente · [Artigo no repositório](./docs/10-projeto-final-saucedemo.md) | [Projeto final](./examples/final-project/) · [README operacional](./examples/final-project/README.md) |

O Capítulo 10 conclui a jornada iniciada nos capítulos anteriores: autenticação, catálogo, carrinho e checkout de demonstração. A [homologação Windows e Linux](./docs/10-final-homologation.md) está concluída; a publicação na `main` aguarda revisão e merge. A [revisão de release](./docs/10-release-review.md) reúne as evidências e pendências editoriais. O artigo externo no blog ainda não foi publicado.

---

### Capítulo 5 — Organizando um projeto Playwright para crescer sem virar bagunça

**Resumo:** como distribuir responsabilidades entre pastas (`tests/`, `pages/`, `data/`, `fixtures/`, `selectors/`, `utils/`) para que o projeto continue navegável conforme o número de testes cresce.

**Objetivo:** entender a diferença entre organizar por tipo técnico e organizar por domínio, e por que a combinação dos dois é a estrutura recomendada.

- Documentação: [`docs/05-organizando-projeto-playwright.md`](./docs/05-organizando-projeto-playwright.md)
- Exemplos: [`examples/project-organization/`](./examples/project-organization/)

---

## Recursos

- Documentação: `docs/`
- Exemplos: `examples/`
- Arquivos principais: `README.md`, `SERIES.md`, `ROADMAP.md`, `ARCHITECTURE.md`
