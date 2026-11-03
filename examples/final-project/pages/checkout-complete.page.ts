import type { Locator, Page } from '@playwright/test';

export class CheckoutCompletePage {
  readonly confirmation: Locator;
  readonly message: Locator;
  private readonly backHomeButton: Locator;

  constructor(page: Page) {
    this.confirmation = page.getByTestId('complete-header');
    this.message = page.getByTestId('complete-text');
    this.backHomeButton = page.getByRole('button', { name: 'Back Home', exact: true });
  }

  async backHome(): Promise<void> {
    await this.backHomeButton.click();
  }
}
