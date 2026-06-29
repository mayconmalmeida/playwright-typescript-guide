# Capítulo 02 — Entendendo a Estrutura do Projeto

Neste capítulo, vamos analisar detalhadamente a estrutura de um projeto Playwright com TypeScript.

## Como o Playwright organiza um projeto

Quando inicializamos um projeto Playwright, ele cria uma estrutura organizada que facilita a manutenção e a escalabilidade dos testes.

## O papel de cada pasta

### `tests/`
Esta é a pasta principal onde ficarão todos os nossos testes. O Playwright automaticamente detecta e executa arquivos com a extensão `.spec.ts` ou `.test.ts`.

### `docs/`
Pasta criada manualmente para armazenar a documentação do projeto, como este guia que você está lendo.

### `assets/`
Pasta para armazenar recursos de mídia como imagens, screenshots e gifs que serão usados na documentação.

### `.github/workflows/`
Contém os workflows do GitHub Actions para integração contínua, executando os testes automaticamente a cada push ou pull request.

## O papel de cada arquivo

### `playwright.config.ts`
Arquivo de configuração global do Playwright. Aqui definimos:
- Browsers a serem usados (Chromium, Firefox, WebKit)
- Configurações de paralelismo
- Retries (tentativas em caso de falha)
- Reporters (formato do relatório de testes)
- Configurações de trace

### `package.json`
Arquivo de configuração do npm, onde definimos:
- Dependências do projeto
- Scripts úteis (como `npm test`)
- Metadados do projeto

### `package-lock.json`
Arquivo gerado automaticamente para garantir que todas as pessoas e ambientes instalem as mesmas versões exatas das dependências.

### `.gitignore`
Especifica quais arquivos e pastas devem ser ignorados pelo Git (como `node_modules/`, `playwright-report/`, `test-results/`).

### `LICENSE`
Arquivo de licença do projeto (MIT).

## Como essa estrutura evoluirá ao longo da série

Nas próximas partes, adicionaremos novas pastas para organizar melhor o código:

- **`pages/`**: Para os Page Objects
- **`fixtures/`**: Para as fixtures customizadas
- **`utils/`**: Para funções utilitárias
- **`data/`**: Para dados de teste
- **`selectors/`**: Para centralizar os seletores
- **`examples/`**: Para exemplos práticos

Isso nos manterá organizados à medida que o projeto cresce!
