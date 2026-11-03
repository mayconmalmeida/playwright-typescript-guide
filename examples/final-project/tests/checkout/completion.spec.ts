import { expect, test } from '../../fixtures/checkout.fixture';
import { CartPage } from '../../pages/cart.page';
import { CheckoutCompletePage } from '../../pages/checkout-complete.page';
import { InventoryPage } from '../../pages/inventory.page';
import { checkoutMessages } from '../../test-data/checkout';
import { catalogNames, products } from '../../test-data/products';
import { routes } from '../../test-data/routes';

test('CHECK-07 finalizar pedido de demonstração exibe confirmação', { tag: '@smoke' }, async ({ checkoutOverview, page, header }) => {
  await checkoutOverview.finish();

  await expect(page).toHaveURL(routes.checkoutComplete);
  await expect(header.title).toHaveText('Checkout: Complete!');
  const complete = new CheckoutCompletePage(page);
  await expect(complete.confirmation).toHaveText(checkoutMessages.completeHeader);
  await expect(complete.message).toHaveText(checkoutMessages.completeText);
  await expect(header.cartBadge).toHaveCount(0);
});

test('CHECK-08 Back Home retorna ao catálogo após conclusão', { tag: '@regression' }, async ({ checkoutOverview, page, header }) => {
  await checkoutOverview.finish();
  const complete = new CheckoutCompletePage(page);
  await expect(complete.confirmation).toHaveText(checkoutMessages.completeHeader);

  await complete.backHome();

  await expect(page).toHaveURL(routes.inventory);
  await expect(header.title).toHaveText('Products');
  const inventory = new InventoryPage(page);
  await expect(inventory.names).toHaveText([...catalogNames]);
  await expect(inventory.badge).toHaveCount(0);
  for (const product of Object.values(products)) {
    await expect(inventory.product(product.name).addButton).toBeVisible();
  }
  await inventory.openCart();
  await expect(new CartPage(page).items).toHaveCount(0);
});
