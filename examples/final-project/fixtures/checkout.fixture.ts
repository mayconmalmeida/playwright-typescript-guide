import { expect, test as base } from './test.fixture';
import { CartPage } from '../pages/cart.page';
import { CheckoutInformationPage } from '../pages/checkout-information.page';
import { CheckoutOverviewPage } from '../pages/checkout-overview.page';
import { InventoryPage } from '../pages/inventory.page';
import { checkoutCustomer } from '../test-data/checkout';
import { products } from '../test-data/products';
import { routes } from '../test-data/routes';

// Preparação por teste via UI, sem snapshots de sessão ou carrinho compartilhado.
export const test = base.extend<{
  checkoutInformation: CheckoutInformationPage;
  checkoutOverview: CheckoutOverviewPage;
}>({
  checkoutInformation: async ({ authenticatedPage: page }, use) => {
    const inventory = new InventoryPage(page);
    for (const product of Object.values(products)) {
      await inventory.product(product.name).add();
    }
    await inventory.openCart();
    await new CartPage(page).checkout();
    await expect(page, 'pré-condição: etapa de informações aberta').toHaveURL(routes.checkoutInformation);
    await use(new CheckoutInformationPage(page));
  },

  checkoutOverview: async ({ checkoutInformation, page }, use) => {
    await checkoutInformation.fill(checkoutCustomer);
    await checkoutInformation.continue();
    await expect(page, 'pré-condição: resumo aberto').toHaveURL(routes.checkoutOverview);
    await use(new CheckoutOverviewPage(page));
  },
});

export { expect } from './test.fixture';
