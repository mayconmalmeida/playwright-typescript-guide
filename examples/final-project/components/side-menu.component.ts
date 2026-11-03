import type { Locator, Page } from '@playwright/test';

// Menu lateral aberto pelo botão "hambúrguer" do cabeçalho.
// O menu entra com animação: o click() do Playwright espera o botão de logout ficar visível
// e estável antes de clicar, então nenhuma espera manual é necessária.
export class SideMenuComponent {
  private readonly openButton: Locator;

  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.openButton = page.getByRole('button', { name: 'Open Menu' });
    // Os itens do menu são <a role="button">: o papel acessível é button, não link.
    this.logoutButton = page.getByRole('navigation').getByRole('button', { name: 'Logout' });
  }

  async open(): Promise<void> {
    await this.openButton.click();
  }

  // Requer o menu aberto: chame open() antes, como faria quem usa a aplicação.
  async logout(): Promise<void> {
    await this.logoutButton.click();
  }
}
