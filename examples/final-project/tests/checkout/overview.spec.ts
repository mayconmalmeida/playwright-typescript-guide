import { expect, test } from '../../fixtures/checkout.fixture';
import { products } from '../../test-data/products';
import { parseUsdCents } from '../../utils/money';

test('CHECK-05 resumo apresenta identidade, quantidade e preço dos produtos', { tag: '@regression' }, async ({ checkoutOverview }) => {
  await expect(checkoutOverview.names).toHaveText(Object.values(products).map(product => product.name));
  for (const product of Object.values(products)) {
    const item = checkoutOverview.product(product.name);
    await expect(item.root).toHaveCount(1);
    await expect(item.name).toHaveText(product.name);
    await expect(item.quantity).toHaveText('1');
    await expect(item.price).toHaveText(product.price);
  }
  const expectedSubtotal = Object.values(products).reduce((sum, product) => sum + parseUsdCents(product.price), 0);
  expect((await checkoutOverview.totalsInCents()).subtotal).toBe(expectedSubtotal);
});

test('CHECK-06 subtotal mais taxa exibida corresponde ao total', { tag: '@smoke' }, async ({ checkoutOverview }) => {
  await expect(checkoutOverview.names).toHaveText(Object.values(products).map(product => product.name));
  await expect(checkoutOverview.subtotal).toBeVisible();
  await expect(checkoutOverview.tax).toBeVisible();
  await expect(checkoutOverview.total).toBeVisible();

  let itemSubtotal = 0;
  for (const product of Object.values(products)) {
    const item = checkoutOverview.product(product.name);
    await expect(item.quantity).toHaveText('1');
    await expect(item.price).toHaveText(product.price);
    itemSubtotal += parseUsdCents(await item.price.innerText());
  }
  const { subtotal, tax, total } = await checkoutOverview.totalsInCents();
  expect(subtotal, 'subtotal deve somar os preços exibidos dos itens').toBe(itemSubtotal);
  expect(total, 'total deve somar subtotal e taxa exibidos, em centavos').toBe(subtotal + tax);
});
