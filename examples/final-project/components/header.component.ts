import type { Locator, Page } from '@playwright/test';

// Cabeçalho exibido em todas as páginas autenticadas.
// Nesta etapa, só o título da página é necessário; carrinho entra quando houver testes que o usem.
export class HeaderComponent {
  readonly title: Locator;

  constructor(page: Page) {
    this.title = page.getByTestId('title');
  }
}
