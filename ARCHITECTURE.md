# ARCHITECTURE

Este arquivo explica a organização do projeto e o propósito de cada pasta.

## Estrutura do projeto

### `examples/`
Contém exemplos práticos de código que ilustram conceitos com Playwright e TypeScript. Cada arquivo foca em um único conceito e é independente.

### `docs/`
Documentação técnica e passo a passo da série. Cada capítulo tem seu próprio arquivo de documentação.

### `assets/`
Recursos de mídia, como imagens, capturas de tela e ícones. Usado para dar suporte à documentação e aos exemplos.

### `tests/`
Testes reais do Playwright que verificam o comportamento do projeto. Esta pasta segue a configuração do Playwright no repositório.

### `pages/`
Páginas e objetos de página que podem ser usados para organizar seletores e ações em fluxos de teste.

### `fixtures/`
Elementos de configuração reutilizáveis para testes, como dados de entrada, mocks ou contexto compartilhado.

### `selectors/`
Seletores customizados e coleções de localizadores que ajudam a manter os testes legíveis e fáceis de manter.

### `utils/`
Funções auxiliares e helpers que são usados em exemplos e testes para evitar duplicação.

## Por que essa organização?

- Separação de responsabilidades facilita a navegação.
- Documentação e código são mantidos em espaços distintos.
- Exemplos práticos ficam separados dos testes reais.
- Estrutura preparada para escalar com novos capítulos e recursos.

## Como usar

- Abra `SERIES.md` para entender o conteúdo da série.
- Abra `ROADMAP.md` para ver o planejamento de versões futuras.
- Abra `ARCHITECTURE.md` para compreender a organização do repositório.
