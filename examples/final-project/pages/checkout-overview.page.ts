import type { Locator, Page } from '@playwright/test';
import { InventoryItemComponent } from '../components/inventory-item.component';
import { parseUsdCents } from '../utils/money';

export class CheckoutOverviewPage {
  readonly items: Locator;
  readonly names: Locator;
  readonly subtotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  private readonly finishButton: Locator;
  private readonly cancelButton: Locator;

  constructor(private readonly page: Page) {
    this.items = page.getByTestId('cart-list').getByTestId('inventory-item');
    this.names = this.items.getByTestId('inventory-item-name');
    this.subtotal = page.getByTestId('subtotal-label');
    this.tax = page.getByTestId('tax-label');
    this.total = page.getByTestId('total-label');
    this.finishButton = page.getByRole('button', { name: 'Finish', exact: true });
    this.cancelButton = page.getByRole('button', { name: 'Cancel', exact: true });
  }

  product(name: string): InventoryItemComponent {
    return new InventoryItemComponent(this.items.filter({ has: this.page.getByText(name, { exact: true }) }));
  }

  async totalsInCents(): Promise<{ subtotal: number; tax: number; total: number }> {
    // Remove somente o rótulo observado; money.ts rejeita qualquer valor malformado.
    return {
      subtotal: parseUsdCents((await this.subtotal.innerText()).replace(/^Item total: /, '')),
      tax: parseUsdCents((await this.tax.innerText()).replace(/^Tax: /, '')),
      total: parseUsdCents((await this.total.innerText()).replace(/^Total: /, '')),
    };
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }
}
