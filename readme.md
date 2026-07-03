# Playwright TypeScript Guide

<p align="center">
  <img src="https://playwright.dev/img/playwright-logo.svg" alt="Playwright Logo" width="200">
</p>

<p align="center">
  Um guia completo, didático e profissional para automatização de testes com Playwright e TypeScript.
</p>

<p align="center">
  <a href="https://github.com/mayconmalmeida/playwright-typescript-guide/actions">
    <img src="https://github.com/mayconmalmeida/playwright-typescript-guide/actions/workflows/playwright.yml/badge.svg" alt="Playwright Tests">
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT">
  </a>
  <a href="https://playwright.dev/">
    <img src="https://img.shields.io/badge/Playwright-45ba4b?style=flat&logo=Playwright&logoColor=white" alt="Playwright">
  </a>
  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white" alt="TypeScript">
  </a>
</p>

## 📚 Sobre o Projeto

Este repositório serve como material complementar de uma série de artigos do blog sobre automação de testes com Playwright e TypeScript. O objetivo é ensinar do zero até boas práticas reais de mercado, com exemplos práticos e organizados.

## 🎯 Objetivos da Série

Esta série ensina **muito mais do que apenas Playwright**! Você aprenderá:
- Arquitetura de projetos de automação
- Organização de código
- Boas práticas de mercado
- Engenharia de automação profissional

## � Quem deve estudar?

- Desenvolvedores que querem começar com automação
- QAs que querem aprender Playwright com TypeScript
- Profissionais que querem melhorar suas habilidades
- Quem quer aprender boas práticas reais de mercado

## 🧠 O que você aprenderá?

1. Criar projetos Playwright do zero
2. Estruturar projetos profissionalmente
3. Escrever testes escaláveis
4. Utilizar padrões como Page Objects
5. Trabalhar com Fixtures
6. Boas práticas e otimizações

## 🗺️ Roadmap

- ✅ Parte 1 - Criando o primeiro projeto
- ✅ Parte 2 - Entendendo a estrutura do projeto
- 🚧 Parte 3 - Escrevendo nossos primeiros testes
- ⬜ Parte 4 - Page Objects
- ⬜ Parte 5 - Fixtures
- ⬜ Parte 6 - Boas práticas e otimizações

## 🔗 Links para os Artigos

*(Em breve, os links serão adicionados)*

## 📚 Links para Documentação Oficial

- [Playwright](https://playwright.dev/)
- [TypeScript](https://www.typescriptlang.org/)

## �🚀 Primeiros Passos

### Pré-requisitos

- Node.js (versão LTS recomendada)
- npm ou yarn

### Instalação

1. Clone o repositório:

```bash
git clone https://github.com/mayconmalmeida/playwright-typescript-guide.git
cd playwright-typescript-guide
```

2. Instale as dependências:

```bash
npm install
```

3. Instale os browsers do Playwright:

```bash
npx playwright install --with-deps
```

## 📖 Documentação

Confira a documentação passo a passo na pasta `docs/`:

- [01 - Criando o Primeiro Projeto](./docs/01-criando-primeiro-projeto.md)
- [02 - Entendendo a Estrutura do Projeto](./docs/02-entendendo-a-estrutura.md)
- [03 - Escrevendo o Primeiro Teste](./docs/03-escrevendo-primeiro-teste.md)

## 📁 Estrutura do Projeto

```
playwright-typescript-guide/
├── .github/
│   └── workflows/
│       └── playwright.yml    # Workflow do GitHub Actions para CI
├── assets/                   # Arquivos de mídia (imagens, screenshots, gifs)
├── docs/                     # Documentação do projeto
├── examples/                 # Exemplos práticos de código
├── tests/                    # Pasta principal dos testes
│   └── example.spec.ts       # Exemplo de teste padrão do Playwright
├── notes/                    # Anotações e planejamento
├── .gitignore                # Arquivos e pastas ignorados pelo Git
├── LICENSE                   # Licença do projeto
├── package.json              # Dependências e scripts do projeto
├── package-lock.json         # Controle de versões exatas das dependências
├── playwright.config.ts      # Arquivo de configuração do Playwright
└── readme.md                 # Este arquivo
```

### Arquivos e Pastas Principais

- **`tests/`**: Pasta onde ficam todos os testes.
- **`examples/`**: Pasta com exemplos práticos e didáticos de código.
- **`playwright.config.ts`**: Arquivo de configuração global do Playwright, onde definimos browsers, reporters, retries, etc.
- **`package.json`**: Arquivo de configuração do npm, contendo dependências e scripts.
- **`package-lock.json`**: Arquivo gerado automaticamente para travar as versões exatas das dependências.
- **`.github/workflows/`**: Workflows do GitHub Actions para integração contínua.
- **`playwright-report/`**: Pasta gerada automaticamente com o relatório HTML dos testes (ignorada pelo Git).
- **`test-results/`**: Pasta com artefatos dos testes (screenshots, traces, etc.) (ignorada pelo Git).
- **`node_modules/`**: Pasta com todas as dependências instaladas (ignorada pelo Git).

## 🛠️ Scripts Disponíveis

| Script          | Descrição                                      |
|-----------------|------------------------------------------------|
| `npm test`      | Executa todos os testes                        |
| `npm run test:ui` | Abre a interface gráfica para executar testes |
| `npm run test:headed` | Executa os testes com o navegador visível |
| `npm run test:report` | Abre o relatório HTML dos testes |

## 🤝 Contribuição

Contribuições são sempre bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

<p align="center">
  Feito com ❤️ por <a href="https://github.com/mayconmalmeida">Maycon Almeida</a>
</p>
