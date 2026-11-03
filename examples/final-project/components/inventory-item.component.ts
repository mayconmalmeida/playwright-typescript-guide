import type { Locator } from '@playwright/test';

// Catálogo e carrinho compartilham os mesmos data-test para os dados do produto.
export class InventoryItemComponent {
  readonly name: Locator;
  readonly description: Locator;
  readonly price: Locator;
  readonly addButton: Locator;
  readonly removeButton: Locator;
  readonly quantity: Locator;

  constructor(readonly root: Locator) {
    this.name = root.getByTestId('inventory-item-name');
    this.description = root.getByTestId('inventory-item-desc');
    this.price = root.getByTestId('inventory-item-price');
    this.addButton = root.getByRole('button', { name: 'Add to cart', exact: true });
    this.removeButton = root.getByRole('button', { name: 'Remove', exact: true });
    this.quantity = root.getByTestId('item-quantity');
  }

  async add(): Promise<void> {
    await this.addButton.click();
  }

  async remove(): Promise<void> {
    await this.removeButton.click();
  }
}
