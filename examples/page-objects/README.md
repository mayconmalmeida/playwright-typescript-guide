# Page Objects: antes e depois

Este exemplo compara o mesmo login determinístico, executado com `page.setContent()`, antes e depois da refatoração para Page Objects e Components.

| Aspecto | Antes | Depois |
|---|---|---|
| Locators | No teste | Page Object |
| Intenção | Misturada | Clara |
| Reutilização | Baixa | Alta |
| Manutenção | Espalhada | Centralizada |
| Components | Misturados | Separados |
| Assertions | Misturadas | Visíveis no teste |

## Por que refatoramos

No `before`, preparação da tela, seletores, ações e verificações competem pela atenção. O `after` move detalhes de interação para objetos pequenos e deixa o comportamento esperado evidente.

## O que melhorou

- locators têm um único lugar para manutenção;
- ações expressam intenção;
- navbar, toast e modal podem ser reutilizados;
- assertions principais continuam visíveis no cenário.

## O que NÃO melhorou automaticamente

Page Objects não corrigem seletores frágeis, cenários mal definidos ou dados instáveis. Uma abstração ruim apenas esconde esses problemas em outra classe.

## Quando Page Object não é necessário

Um teste pequeno, isolado e sem repetição pode ser mais claro com a API do Playwright diretamente. Crie a abstração quando ela reduzir duplicação ou tornar a intenção mais legível.

## Como evitar um God Object

Não transforme uma página em uma classe com centenas de métodos. Mantenha nela somente interações próprias da tela e extraia regiões reutilizáveis para Components com responsabilidades específicas.

Compare [`before/`](./before/) e [`after/`](./after/).
