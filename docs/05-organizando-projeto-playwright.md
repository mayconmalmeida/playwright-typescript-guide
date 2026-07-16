# Engenharia de Automação com Playwright

## Capítulo 5 — Organizando um projeto Playwright para crescer sem virar bagunça

**Tempo de leitura:** 15-20 min
**Nível:** Intermediário
**Pré-requisitos:** Capítulos 1 a 4
**Objetivo:** Entender como organizar pastas e arquivos de um projeto Playwright para que ele continue navegável e fácil de manter conforme o número de testes cresce.

---

## Objetivo

Todo projeto de automação começa pequeno: alguns testes, um arquivo de configuração, pronto. O problema aparece depois, quando dezenas (ou centenas) de testes chegam e ninguém consegue mais responder rápido a perguntas simples como "onde fica o teste de login?" ou "esse seletor já existe em algum lugar?".

Este capítulo não ensina Page Objects nem Fixtures em profundidade — cada um tem seu próprio capítulo. Aqui o foco é um nível acima: como distribuir responsabilidades entre pastas para que a estrutura do projeto continue fazendo sentido daqui a seis meses.

---

## Responsabilidade de cada pasta

Cada pasta do projeto deve responder a uma única pergunta. Quando uma pasta começa a responder duas ou três perguntas ao mesmo tempo, é sinal de que ela precisa ser dividida.

| Pasta | Pergunta que ela responde |
|---|---|
| `tests/` | "O que estamos verificando?" |
| `pages/` | "Como interagimos com a tela?" |
| `fixtures/` | "O que precisa existir antes do teste rodar?" |
| `data/` | "Quais valores o teste usa?" |
| `selectors/` | "Como encontramos este elemento?" |
| `utils/` | "Como resolvemos algo que se repete em vários testes?" |

Veja também [`ARCHITECTURE.md`](../ARCHITECTURE.md) para a visão geral de todo o repositório.

---

## Organização por tipo

A forma mais comum de começar é organizar por **tipo técnico**: todos os testes juntos, todos os seletores juntos, todos os dados juntos.

```
tests/
selectors/
data/
utils/
```

- ✅ Simples de entender no início.
- ✅ Fácil de explicar para quem está começando.
- ❌ Conforme o número de funcionalidades cresce, cada pasta vira uma lista enorme e sem relação direta entre os arquivos.
- ❌ Para mexer em uma única funcionalidade, é preciso abrir arquivos em várias pastas diferentes.

---

## Organização por domínio

A alternativa é organizar por **domínio de negócio**: agrupar tudo que pertence à mesma funcionalidade, independente do tipo de arquivo.

```
tests/
  auth/
  wallet/
  users/
```

- ✅ Tudo que pertence a "autenticação" fica próximo.
- ✅ Escala melhor conforme o produto cresce (novos domínios = novas pastas, sem afetar as existentes).
- ❌ Exige mais disciplina para decidir a que domínio um arquivo pertence.
- ❌ Pode gerar duplicação se os domínios não forem bem definidos.

Na prática, a maioria dos projetos profissionais combina os dois: **domínio primeiro, tipo depois** — como mostrado na próxima seção.

---

## Estrutura recomendada

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
├── selectors/
└── README.md
```

O domínio (`auth`, `wallet`, `users`) organiza os testes; as demais pastas (`pages/`, `data/`, `fixtures/`, `utils/`, `selectors/`) continuam separadas por tipo, mas cada arquivo dentro delas é nomeado de acordo com o domínio a que pertence (ex: `auth.selectors.ts`, `wallet.data.ts`).

Veja o exemplo completo em [`examples/project-organization/`](../examples/project-organization/).

---

## Erros comuns

- **Arquivos "-final", "-v2", "-novo"**: sinal de que algo foi duplicado em vez de atualizado.
- **Um único arquivo de seletores para o projeto inteiro**: vira uma lista gigante sem contexto.
- **Dados de domínios diferentes no mesmo arquivo**: dificulta saber o que pertence a cada funcionalidade.
- **Testes e helpers misturados na mesma pasta**: quebra a separação entre "o que é verificado" e "como é resolvido".
- **Nenhuma convenção de nomes**: cada pessoa do time organiza do seu jeito, e a estrutura vira um mosaico.

---

## Checklist

- [ ] Cada pasta responde a uma única pergunta.
- [ ] Nenhum arquivo tem sufixo como `-final`, `-v2` ou `-novo`.
- [ ] Seletores estão agrupados por domínio, não em um arquivo único.
- [ ] Dados de teste estão separados por domínio.
- [ ] É possível encontrar um teste específico em menos de 10 segundos navegando pelas pastas.

---

## Exemplo prático

Compare as duas estruturas completas em [`examples/project-organization/`](../examples/project-organization/):

- [`bad-structure/`](../examples/project-organization/bad-structure/) — tudo misturado, para fins didáticos.
- [`good-structure/`](../examples/project-organization/good-structure/) — organização por domínio, pronta para crescer.

---

## Resumo

- Cada pasta deve ter uma responsabilidade única e clara.
- Organizar apenas por tipo técnico não escala; organizar apenas por domínio exige disciplina.
- A combinação **domínio primeiro, tipo depois** é a estrutura recomendada para projetos que crescem.
- Arquivos duplicados (`-final`, `-v2`) são o sintoma mais comum de uma estrutura em decadência.

---

## Desafio da Aula

Pegue um projeto Playwright que você já tenha (ou o `bad-structure/` deste repositório) e reorganize-o seguindo o modelo de `good-structure/`. Depois, responda: quanto tempo levaria para um novo integrante do time encontrar o teste de login antes e depois da reorganização?

---

## Próximo Capítulo

➡ Capítulo 6 — Construindo Page Objects *(em breve)*
