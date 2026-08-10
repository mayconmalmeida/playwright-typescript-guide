import type { Locator, Page } from '@playwright/test';

// É um Component porque representa uma região reutilizável, não uma página completa.
export class NavbarComponent {
  private readonly profileButton: Locator;
  private readonly logoutButton: Locator;

  constructor(page: Page) {
    const navbar = page.getByRole('navigation', { name: 'Navegação principal' });
    this.profileButton = navbar.getByRole('button', { name: 'Perfil' });
    this.logoutButton = navbar.getByRole('button', { name: 'Sair' });
  }

  async openProfile(): Promise<void> {
    await this.profileButton.click();
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }
}
