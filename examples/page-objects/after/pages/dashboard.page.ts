import type { Locator, Page } from '@playwright/test';
import { NavbarComponent } from '../components/navbar.component';

export class DashboardPage {
  readonly heading: Locator;
  private readonly navbar: NavbarComponent;

  constructor(page: Page) {
    this.heading = page.getByRole('heading', { name: 'Dashboard' });
    this.navbar = new NavbarComponent(page);
  }

  async openProfile(): Promise<void> {
    await this.navbar.openProfile();
  }

  async requestLogout(): Promise<void> {
    await this.navbar.logout();
  }
}
