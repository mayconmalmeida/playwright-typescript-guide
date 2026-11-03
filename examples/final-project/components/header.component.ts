import type { Locator, Page } from '@playwright/test';

// Cabeçalho exibido em todas as páginas autenticadas.
export class HeaderComponent {
  readonly title: Locator;
  readonly cartBadge: Locator;
  private readonly cartLink: Locator;

  constructor(page: Page) {
    this.title = page.getByTestId('title');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.cartLink = page.getByTestId('shopping-cart-link');
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}
