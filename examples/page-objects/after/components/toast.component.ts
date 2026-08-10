import type { Locator, Page } from '@playwright/test';

// Toasts aparecem em diferentes páginas; por isso são modelados como Component.
export class ToastComponent {
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.successMessage = page.getByRole('status');
    this.errorMessage = page.locator('#error-toast');
  }
}
