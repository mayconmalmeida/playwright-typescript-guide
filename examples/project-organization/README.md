# Project Organization

Exemplo complementar do [Capítulo 5 — Organizando um projeto Playwright para crescer sem virar bagunça](../../docs/05-organizando-projeto-playwright.md).

## Por que organização importa

Um projeto de testes começa pequeno e fácil de navegar. O problema aparece quando ele cresce: sem uma estrutura clara, cada novo teste aumenta o esforço para encontrar o que já existe, entender o que pertence a cada funcionalidade e evitar duplicação. Organização não é sobre estética — é sobre o tempo que o time gasta para manter e evoluir a suíte de testes.

Este exemplo compara duas estruturas para o mesmo conjunto de funcionalidades (login, carteira, usuários):

- [`bad-structure/`](./bad-structure/) — tudo misturado, só para fins didáticos.
- [`good-structure/`](./good-structure/) — organizado por domínio, pronto para crescer.

## Estrutura ruim ↓ Estrutura organizada

| Problema | Estrutura ruim | Estrutura organizada |
|-----------|----------------|----------------------|
| Navegação | Difícil | Simples |
| Dados | Misturados | Separados |
| Seletores | Espalhados | Organizados |
| Crescimento | Alto retrabalho | Escalável |
| Leitura | Confusa | Clara |

## Para saber mais

Leia o capítulo completo em [`docs/05-organizando-projeto-playwright.md`](../../docs/05-organizando-projeto-playwright.md).
