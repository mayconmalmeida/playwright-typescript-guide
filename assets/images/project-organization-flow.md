# Diagrama — Fluxo de Organização do Projeto

> Diagrama textual de apoio ao [Capítulo 5](../../docs/05-organizando-projeto-playwright.md). Será utilizado futuramente como base para gerar um infográfico.

```
Projeto
  ↓
Tests
  ↓
Pages
  ↓
Locators
  ↓
Aplicação

Data
  ↓
Tests

Utils
  ↓
Pages
```

## Explicação curta

- **Tests → Pages → Locators → Aplicação**: o teste chama o Page Object, que usa locators para interagir com a aplicação real. Cada camada só conhece a camada logo abaixo dela.
- **Data → Tests**: os dados de teste alimentam os testes diretamente, sem passar pelas outras camadas.
- **Utils → Pages**: funções utilitárias dão suporte aos Page Objects (formatação, esperas, etc.), em vez de serem chamadas direto pelos testes.

Esse fluxo é o que torna possível trocar um locator ou reorganizar uma pasta sem precisar reescrever o teste em si.
