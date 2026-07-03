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

## 🚀 Primeiros Passos

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
