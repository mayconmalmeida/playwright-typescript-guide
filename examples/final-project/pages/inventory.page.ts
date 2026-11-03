import type { Locator, Page } from '@playwright/test';
import { HeaderComponent } from '../components/header.component';
import { InventoryItemComponent } from '../components/inventory-item.component';
import { parseUsdCents } from '../utils/money';

export type InventorySort = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage {
  readonly items: Locator;
  readonly names: Locator;
  readonly badge: Locator;
  private readonly header: HeaderComponent;
  private readonly sortSelect: Locator;

  constructor(private readonly page: Page) {
    this.items = page.getByTestId('inventory-list').getByTestId('inventory-item');
    this.names = this.items.getByTestId('inventory-item-name');
    this.header = new HeaderComponent(page);
    this.badge = this.header.cartBadge;
    this.sortSelect = page.getByTestId('product-sort-container');
  }

  product(name: string): InventoryItemComponent {
    return new InventoryItemComponent(this.items.filter({
      has: this.page.getByText(name, { exact: true }),
    }));
  }

  async pricesInCents(): Promise<number[]> {
    return (await this.items.getByTestId('inventory-item-price').allTextContents()).map(parseUsdCents);
  }

  async sortBy(value: InventorySort): Promise<void> {
    await this.sortSelect.selectOption(value);
  }

  async openCart(): Promise<void> {
    await this.header.openCart();
  }
}
