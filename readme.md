# Engenharia de Automação com Playwright

### Aprenda a construir automações profissionais utilizando Playwright e TypeScript.

<p align="center">
  <img src="https://playwright.dev/img/playwright-logo.svg" alt="Playwright Logo" width="200">
</p>

<p align="center">
  Projeto Open Source desenvolvido em conjunto com uma série completa de artigos técnicos.
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

---

## 🌟 O que você aprenderá ao final da série

✅ Criar projetos Playwright  
✅ Escrever testes automatizados  
✅ Trabalhar com Locators  
✅ Construir Page Objects  
✅ Utilizar Fixtures  
✅ Organizar projetos profissionais  
✅ Integrar GitHub Actions  
✅ Aplicar Engenharia de Automação  
✅ Construir uma suíte escalável  

---

## 📚 Série de Capítulos

| Capítulo | Tema | Status |
|----------|------|--------|
| 1 | Criando seu primeiro projeto | ✅ |
| 2 | Entendendo a estrutura | ✅ |
| 3 | Escrevendo seu primeiro teste | ✅ |
| 4 | Dominando Locators | 🚧 |
| 5 | Construindo Page Objects | ⬜ |
| 6 | Trabalhando com Fixtures | ⬜ |
| 7 | Organização profissional | ⬜ |
| 8 | GitHub Actions | ⬜ |
| 9 | Engenharia de Automação | ⬜ |
| 10 | Projeto Final | ⬜ |

---

## � Artigos publicados

### Capítulo 1 — Criando seu primeiro projeto
*(em breve)*

### Capítulo 2 — Entendendo a estrutura do projeto
*(em breve)*

### Capítulo 3 — Escrevendo seu primeiro teste automatizado
*(em breve)*

---

## 🗺️ Roadmap

✅ Capítulo 1 — Criando seu primeiro projeto  
✅ Capítulo 2 — Entendendo a estrutura do projeto  
✅ Capítulo 3 — Escrevendo seu primeiro teste automatizado  
🚧 Capítulo 4 — Dominando Locators  
⬜ Capítulo 5 — Construindo Page Objects  
⬜ Capítulo 6 — Trabalhando com Fixtures  
⬜ Capítulo 7 — Organizando projetos profissionais  
⬜ Capítulo 8 — GitHub Actions  
⬜ Capítulo 9 — Engenharia de Automação  
⬜ Capítulo 10 — Projeto Final  

---

> Este capítulo aborda boas práticas para criação de locators robustos e estáveis.


## 🎓 Como estudar esta série

1. **Ler o capítulo** no blog  
2. **Clonar o projeto** e explorar o código  
3. **Executar os exemplos** práticos  
4. **Fazer o desafio** da aula  
5. **Prosseguir para o próximo capítulo**  

---

## 🤔 O que é o Playwright TypeScript Guide?

Este projeto acompanha uma série completa sobre **Engenharia de Automação**.

### 📂 GitHub contém:
- Exemplos práticos de código  
- Documentação detalhada  
- Implementação real  

### 📖 Blog contém:
- Conceitos teóricos  
- Arquitetura e design  
- Explicações profundas  
- Boas práticas de engenharia  

Ambos evoluem juntos para proporcionar uma experiência de aprendizado completa!

---

## � Público-alvo

- Desenvolvedores que querem começar com automação  
- QAs que querem aprender Playwright com TypeScript  
- Profissionais que querem melhorar suas habilidades  
- Quem quer aprender boas práticas reais de mercado  

---

## 📚 Links para Documentação Oficial

- [Playwright](https://playwright.dev/)  
- [TypeScript](https://www.typescriptlang.org/)  

---

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

---

## 📖 Documentação

Confira a documentação passo a passo na pasta `docs/`:

- [Capítulo 1 — Criando seu primeiro projeto](./docs/01-criando-primeiro-projeto.md)  
- [Capítulo 2 — Entendendo a estrutura do projeto](./docs/02-entendendo-a-estrutura.md)  
- [Capítulo 3 — Escrevendo seu primeiro teste](./docs/03-escrevendo-primeiro-teste.md)  
- [Capítulo 4 — Dominando Locators](./docs/04-dominando-locators.md)  

---

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

---

## 🛠️ Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm test` | Executa todos os testes |
| `npm run test:ui` | Abre a interface gráfica para executar testes |
| `npm run test:headed` | Executa os testes com o navegador visível |
| `npm run test:report` | Abre o relatório HTML dos testes |

---

## 🤝 Contribuição

Contribuições são sempre bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

---

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

<p align="center">
  Feito com ❤️ por <a href="https://github.com/mayconmalmeida">Maycon Almeida</a>
</p>
