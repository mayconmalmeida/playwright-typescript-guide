import { expect, test } from '../../fixtures/test.fixture';
import { InventoryPage, type InventorySort } from '../../pages/inventory.page';
import { catalogNames } from '../../test-data/products';

for (const direction of ['az', 'za'] as const) {
  test(`CAT-03 ordenação completa dos nomes ${direction}`, { tag: '@regression' }, async ({ authenticatedPage: page }) => {
    const inventory = new InventoryPage(page);
    // Começar na direção oposta garante uma mudança efetiva até no caso A–Z.
    await inventory.sortBy(direction === 'az' ? 'za' : 'az');
    await inventory.sortBy(direction);

    const expected = [...catalogNames].sort();
    if (direction === 'za') expected.reverse();
    await expect(inventory.names).toHaveText(expected);
  });
}

const priceSortCases: { direction: InventorySort; factor: number }[] = [
  { direction: 'lohi', factor: 1 },
  { direction: 'hilo', factor: -1 },
];

for (const { direction, factor } of priceSortCases) {
  test(`CAT-04 ordenação completa dos preços ${direction}`, { tag: '@regression' }, async ({ authenticatedPage: page }) => {
    const inventory = new InventoryPage(page);
    await expect(inventory.names).toHaveText([...catalogNames]);
    const initialPrices = await inventory.pricesInCents();
    const expected = [...initialPrices].sort((a, b) => factor * (a - b));

    await inventory.sortBy(direction);

    await expect.poll(() => inventory.pricesInCents()).toEqual(expected);
    // A ordenação deve preservar todos os produtos, inclusive os dois de mesmo preço.
    await expect.poll(async () => (await inventory.names.allTextContents()).sort()).toEqual([...catalogNames].sort());
  });
}
