# Capítulo 4 — Dominando Locators

Este capítulo apresenta os locators mais usados no Playwright e como escolher cada um com base em estabilidade e semântica.

## Por que isso importa?

Boa parte da manutenção de testes está relacionada a localizadores frágeis. Um locator bem escolhido reduz falsos positivos e torna a automação mais confiável.

## Locators principais

### getByRole()
Use quando o elemento possui um papel semântico claro, como `button`, `link`, `textbox`, `heading` e `checkbox`.
- Recomendado: ✅
- Quando usar: botões, links, campos de formulário, componentes acessíveis.
- Evitar quando: o elemento não define role ou quando o page não é semântico.

### getByLabel()
Use para campos de formulários associados a uma `<label>`.
- Recomendado: ✅
- Quando usar: inputs com label visível e claro.
- Evitar quando: campos sem label ou label não confiável.

### getByPlaceholder()
Use quando não há label e o placeholder é estável.
- Recomendado: ⚠️
- Quando usar: protótipos, campos de formulário com placeholder descritivo.
- Evitar quando: placeholders falsos ou frequentemente alterados.

### getByText()
Use para encontrar texto visível em botões, links e mensagens.
- Recomendado: ⚠️
- Quando usar: textos únicos e curtos.
- Evitar quando: textos duplicados ou conteúdo muito longo.

### getByTestId()
Use como último recurso, quando seletores mais semânticos não estão disponíveis.
- Recomendado: ⚠️
- Quando usar: componentes complexos e testes de integração onde o HTML não expõe semântica.
- Evitar quando: há alternativas acessíveis ou baseadas em texto.

### locator()
Use para seletores CSS mais poderosos e composições complexas.
- Recomendado: ✅
- Quando usar: seletores por classes, atributos ou estruturas específicas.
- Evitar quando: um locator semântico já resolve o caso.

### CSS
Use quando precisar de precisão e controle sobre a árvore DOM.
- Recomendado: ⚠️
- Quando usar: elementos sem labels ou roles, quando classes são estáveis.
- Evitar quando: classes dinâmicas ou estruturas frágeis.

### XPath
Use apenas como último recurso.
- Recomendado: ❌
- Quando usar: HTML legado ou árvores complexas sem seletores confiáveis.
- Evitar quando: qualquer alternativa CSS ou getBy disponível.

## Tabela comparativa

| Locator | Recomendado | Quando usar | Evitar quando |
|---------|-------------|-------------|---------------|
| getByRole | ✅ | Botões, links, inputs e componentes acessíveis | Elementos sem role ou markup semântico |
| getByLabel | ✅ | Campos de formulário com label associado | Inputs sem label ou labels não descritivos |
| getByPlaceholder | ⚠️ | Campos com placeholder estável | Placeholders voláteis ou traduzidos |
| getByText | ⚠️ | Texto visível único em botões, links ou mensagens | Textos duplicados ou longos |
| getByTestId | ⚠️ | Quando não há alternativa semântica | Substituir locators acessíveis |
| locator | ✅ | Seletores CSS complexos ou combinações específicas | Quando getByRole / getByLabel são suficientes |
| CSS | ⚠️ | Seletores de classe, atributo e estrutura | Estruturas DOM instáveis |
| XPath | ❌ | HTML legado ou casos extremos | Código novo sempre que possível |

## Boas práticas

- Prefira locators semânticos antes de usar CSS ou XPath.
- Escolha locators que sobrevivam a alterações de layout.
- Evite usar texto completo quando ele pode mudar com a tradução.
- Use `data-testid` somente quando outras opções não são práticas.
- Comente seletores complexos para facilitar a manutenção.
