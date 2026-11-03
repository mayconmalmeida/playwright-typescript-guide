import { expect, test } from '../../fixtures/test.fixture';
import { CartPage } from '../../pages/cart.page';
import { InventoryPage } from '../../pages/inventory.page';
import { products } from '../../test-data/products';
import { routes } from '../../test-data/routes';

test('CART-01 adicionar um produto atualiza botão, badge e carrinho', { tag: '@smoke' }, async ({ authenticatedPage: page }) => {
  const inventory = new InventoryPage(page);
  const item = inventory.product(products.backpack.name);
  await item.add();

  await expect(item.removeButton).toBeVisible();
  await expect(item.addButton).toHaveCount(0);
  await expect(inventory.badge).toHaveText('1');
  await inventory.openCart();

  const cart = new CartPage(page);
  await expect(page).toHaveURL(routes.cart);
  await expect(cart.names).toHaveText([products.backpack.name]);
  await expect(cart.product(products.backpack.name).price).toHaveText(products.backpack.price);
  await expect(cart.product(products.backpack.name).quantity).toHaveText('1');
});

test('CART-02 adicionar produtos diferentes não duplica itens', { tag: '@regression' }, async ({ authenticatedPage: page }) => {
  const inventory = new InventoryPage(page);
  for (const product of Object.values(products)) {
    await inventory.product(product.name).add();
  }
  await expect(inventory.badge).toHaveText('2');
  await inventory.openCart();

  const cart = new CartPage(page);
  await expect(cart.names).toHaveText(Object.values(products).map(product => product.name));
  await expect(cart.badge).toHaveText('2');
  for (const product of Object.values(products)) {
    const item = cart.product(product.name);
    await expect(item.root).toHaveCount(1);
    await expect(item.quantity).toHaveText('1');
    await expect(item.price).toHaveText(product.price);
  }
});

test('CART-03 remover no catálogo atualiza botão e badge', { tag: '@regression' }, async ({ authenticatedPage: page }) => {
  const inventory = new InventoryPage(page);
  const item = inventory.product(products.backpack.name);
  await item.add();
  await expect(inventory.badge).toHaveText('1');
  await expect(item.removeButton).toBeVisible();

  await item.remove();

  await expect(item.addButton).toBeVisible();
  await expect(item.removeButton).toHaveCount(0);
  await expect(inventory.badge).toHaveCount(0);
  await inventory.openCart();
  await expect(new CartPage(page).items).toHaveCount(0);
});

test('CART-04 remover no carrinho preserva o outro produto', { tag: '@regression' }, async ({ authenticatedPage: page }) => {
  const inventory = new InventoryPage(page);
  for (const product of Object.values(products)) {
    await inventory.product(product.name).add();
  }
  await inventory.openCart();
  const cart = new CartPage(page);
  await expect(cart.names).toHaveText([products.backpack.name, products.bikeLight.name]);

  await cart.product(products.backpack.name).remove();

  await expect(cart.product(products.backpack.name).root).toHaveCount(0);
  await expect(cart.names).toHaveText([products.bikeLight.name]);
  await expect(cart.product(products.bikeLight.name).quantity).toHaveText('1');
  await expect(cart.badge).toHaveText('1');
  await cart.continueShopping();
  await expect(inventory.product(products.backpack.name).addButton).toBeVisible();
  await expect(inventory.product(products.bikeLight.name).removeButton).toBeVisible();
});
