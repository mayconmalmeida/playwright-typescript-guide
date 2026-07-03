# Engenharia de Automação com Playwright

## Capítulo 1 — Criando seu primeiro projeto

### Objetivo
Aprender a criar um projeto Playwright do zero usando TypeScript, entender a estrutura básica e executar os primeiros testes.

### Tempo estimado
15-20 minutos

### Nível
Iniciante

### Pré-requisitos
- Node.js (versão LTS recomendada)
- npm ou yarn

---

Bem-vindo ao Playwright TypeScript Guide! Neste capítulo, vamos aprender a criar um projeto Playwright do zero usando TypeScript.

## Passo 1: Inicializando o Projeto

Crie uma pasta para o seu projeto e navegue até ela no terminal:

```bash
mkdir meu-projeto-playwright
cd meu-projeto-playwright
```

## Passo 2: Inicializando Playwright

Execute o comando para criar um novo projeto Playwright com TypeScript:

```bash
npm init playwright@latest -- --lang TypeScript --install-deps --quiet
```

Esse comando vai:
- Inicializar um projeto npm
- Instalar as dependências do Playwright
- Criar o arquivo de configuração `playwright.config.ts`
- Criar uma pasta `tests` com um exemplo de teste
- Instalar os browsers do Playwright

## Passo 3: Explorando a Estrutura do Projeto

Após a instalação, você terá a seguinte estrutura:

```
meu-projeto-playwright/
├── node_modules/
├── tests/
│   └── example.spec.ts
├── .gitignore
├── package-lock.json
├── package.json
└── playwright.config.ts
```

### Arquivos importantes:
- `package.json`: Contém as dependências e scripts do projeto
- `playwright.config.ts`: Arquivo de configuração do Playwright
- `tests/`: Pasta onde ficarão os seus testes

## Passo 4: Executando os Testes

Para executar os testes, use o comando:

```bash
npx playwright test
```

## Próximos Passos

No próximo capítulo, vamos entender a estrutura do projeto em detalhes!
