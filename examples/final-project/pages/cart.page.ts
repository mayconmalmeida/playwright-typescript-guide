import type { Locator, Page } from '@playwright/test';
import { HeaderComponent } from '../components/header.component';
import { InventoryItemComponent } from '../components/inventory-item.component';

export class CartPage {
  readonly list: Locator;
  readonly items: Locator;
  readonly names: Locator;
  readonly badge: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;

  constructor(private readonly page: Page) {
    this.list = page.getByTestId('cart-list');
    this.items = this.list.getByTestId('inventory-item');
    this.names = this.items.getByTestId('inventory-item-name');
    this.badge = new HeaderComponent(page).cartBadge;
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping', exact: true });
    this.checkoutButton = page.getByRole('button', { name: 'Checkout', exact: true });
  }

  product(name: string): InventoryItemComponent {
    return new InventoryItemComponent(this.items.filter({
      has: this.page.getByText(name, { exact: true }),
    }));
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
