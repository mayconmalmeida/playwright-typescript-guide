import type { Locator, Page } from '@playwright/test';

export class DashboardPage {
  readonly heading: Locator;
  readonly welcomeMessage: Locator;
  readonly profileHeading: Locator;
  readonly profileEmail: Locator;
  private readonly profileButton: Locator;

  constructor(page: Page) {
    this.heading = page.getByRole('heading', { name: 'Dashboard' });
    this.welcomeMessage = page.locator('#welcome');
    this.profileButton = page.getByRole('button', { name: 'Perfil' });
    this.profileHeading = page.getByRole('heading', { name: 'Meu perfil' });
    this.profileEmail = page.locator('#profile-email');
  }

  async openProfile(): Promise<void> {
    await this.profileButton.click();
  }
}

