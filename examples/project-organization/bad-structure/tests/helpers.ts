// ❌ Problema: "helpers" genéricos e sem relação entre si, jogados em um
// único arquivo. É preciso abrir e ler tudo para saber o que cada função faz.

import { Locator, Page } from '@playwright/test';

export function loginHelper(page: Page, user: string) {
  return page.locator('#user').fill(user);
}

export function formatCurrency(value: number) {
  return `R$ ${value.toFixed(2)}`;
}

export function clickAndWait(locator: Locator) {
  return locator.click();
}
