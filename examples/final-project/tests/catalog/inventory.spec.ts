import { expect, test } from '../../fixtures/test.fixture';
import { InventoryPage } from '../../pages/inventory.page';
import { catalogNames, products } from '../../test-data/products';
import { routes } from '../../test-data/routes';

test('CAT-01 catálogo apresenta os produtos esperados', { tag: '@smoke' }, async ({ authenticatedPage: page, header }) => {
  const inventory = new InventoryPage(page);

  await expect(page).toHaveURL(routes.inventory);
  await expect(header.title).toHaveText('Products');
  await expect(inventory.names).toHaveText([...catalogNames]);
  for (const name of catalogNames) {
    await expect(inventory.product(name).addButton).toBeVisible();
  }
  await expect(inventory.badge).toHaveCount(0);
});

test('CAT-02 produtos exibem nome, descrição e preço reais', { tag: '@regression' }, async ({ authenticatedPage: page }) => {
  const inventory = new InventoryPage(page);

  for (const product of Object.values(products)) {
    const item = inventory.product(product.name);
    await expect(item.name).toHaveText(product.name);
    await expect(item.description).toHaveText(product.description);
    await expect(item.price).toHaveText(product.price);
  }
});
