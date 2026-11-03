import { expect, test } from '../../fixtures/test.fixture';
import { CartPage } from '../../pages/cart.page';
import { InventoryPage } from '../../pages/inventory.page';
import { products } from '../../test-data/products';
import { routes } from '../../test-data/routes';

test('CART-05 carrinho persiste durante navegação', { tag: '@regression' }, async ({ authenticatedPage: page }) => {
  const inventory = new InventoryPage(page);
  const cart = new CartPage(page);
  const selected = Object.values(products);
  for (const product of selected) {
    await inventory.product(product.name).add();
  }
  await inventory.openCart();
  await expect(cart.names).toHaveText(selected.map(product => product.name));

  await cart.continueShopping();

  await expect(page).toHaveURL(routes.inventory);
  await expect(inventory.badge).toHaveText('2');
  for (const product of selected) {
    await expect(inventory.product(product.name).removeButton).toBeVisible();
  }
  await inventory.openCart();

  await expect(page).toHaveURL(routes.cart);
  await expect(cart.names).toHaveText(selected.map(product => product.name));
  await expect(cart.badge).toHaveText('2');
  for (const product of selected) {
    await expect(cart.product(product.name).quantity).toHaveText('1');
  }
});

test('CART-06 carrinho inicialmente vazio mantém a navegação disponível', { tag: '@regression' }, async ({ authenticatedPage: page, header }) => {
  const inventory = new InventoryPage(page);
  await inventory.openCart();
  const cart = new CartPage(page);

  await expect(page).toHaveURL(routes.cart);
  await expect(header.title).toHaveText('Your Cart');
  await expect(cart.list).toBeVisible();
  await expect(cart.items).toHaveCount(0);
  await expect(cart.badge).toHaveCount(0);
  await expect(cart.continueShoppingButton).toBeEnabled();
  // Comportamento observado: Checkout continua habilitado, sem mensagem de vazio.
  await expect(cart.checkoutButton).toBeEnabled();

  await cart.continueShopping();

  await expect(page).toHaveURL(routes.inventory);
  await expect(header.title).toHaveText('Products');
  await expect(inventory.badge).toHaveCount(0);
});
