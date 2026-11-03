import { expect, test } from '../../fixtures/checkout.fixture';
import { CartPage } from '../../pages/cart.page';
import { CheckoutInformationPage } from '../../pages/checkout-information.page';
import { InventoryPage } from '../../pages/inventory.page';
import { checkoutCustomer } from '../../test-data/checkout';
import { products } from '../../test-data/products';
import { routes } from '../../test-data/routes';

test('CHECK-01 iniciar checkout com produto no carrinho', { tag: '@smoke' }, async ({ authenticatedPage: page, header }) => {
  const inventory = new InventoryPage(page);
  await inventory.product(products.backpack.name).add();
  await inventory.openCart();
  const cart = new CartPage(page);
  await expect(cart.names).toHaveText([products.backpack.name]);

  await cart.checkout();

  await expect(page).toHaveURL(routes.checkoutInformation);
  await expect(header.title).toHaveText('Checkout: Your Information');
  const information = new CheckoutInformationPage(page);
  await expect(information.firstName).toBeVisible();
  await expect(information.lastName).toBeVisible();
  await expect(information.postalCode).toBeVisible();
});

test('CHECK-03 informações fictícias válidas avançam para o resumo', { tag: '@regression' }, async ({ checkoutInformation, page, header }) => {
  await checkoutInformation.fill(checkoutCustomer);
  await checkoutInformation.continue();

  await expect(page).toHaveURL(routes.checkoutOverview);
  await expect(header.title).toHaveText('Checkout: Overview');
});

test('CHECK-04 cancelar informações retorna ao carrinho com os produtos', { tag: '@regression' }, async ({ checkoutInformation, page, header }) => {
  await checkoutInformation.fill(checkoutCustomer);
  await checkoutInformation.cancel();

  await expect(page).toHaveURL(routes.cart);
  await expect(header.title).toHaveText('Your Cart');
  const cart = new CartPage(page);
  await expect(cart.names).toHaveText(Object.values(products).map(product => product.name));
  await expect(cart.badge).toHaveText('2');
});

test('CHECK-04 cancelar resumo retorna ao catálogo com os produtos', { tag: '@regression' }, async ({ checkoutOverview, page, header }) => {
  await checkoutOverview.cancel();

  await expect(page).toHaveURL(routes.inventory);
  await expect(header.title).toHaveText('Products');
  const inventory = new InventoryPage(page);
  await expect(inventory.badge).toHaveText('2');
  for (const product of Object.values(products)) {
    await expect(inventory.product(product.name).removeButton).toBeVisible();
  }
});
