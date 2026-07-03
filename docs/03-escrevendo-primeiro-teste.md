# Capítulo 03 — Escrevendo o Primeiro Teste

Neste capítulo, vamos aprender a escrever nosso primeiro teste real com Playwright!

## Conceitos importantes

### Teste simples
Um teste básico com Playwright geralmente segue esta estrutura:
1. Abrir o navegador
2. Acessar uma página
3. Encontrar elementos (locators)
4. Realizar ações (clicar, digitar, etc.)
5. Verificar se o resultado é o esperado (assertions)

### Locators
Os locators são a forma que Playwright utiliza para encontrar elementos na página. Exemplos comuns:
- Por texto: `page.getByText()`
- Por placeholder: `page.getByPlaceholder()`
- Por role: `page.getByRole()`
- Por ID ou classe: `page.locator()`

### Assertions
As assertions são usadas para verificar se algo está como esperado. Playwright oferece várias assertions:
- `expect(locator).toBeVisible()`
- `expect(locator).toHaveText()`
- `expect(page).toHaveTitle()`

## Primeiro exemplo prático

Veja o arquivo `examples/first-test.spec.ts` para um exemplo completo com comentários explicativos!

## Dicas importantes

1. Sempre use locators específicos em vez de CSS selectors complexos
2. Utilize as assertions próprias do Playwright para testes mais estáveis
3. Execute os testes no modo UI para entender melhor o que está acontecendo
