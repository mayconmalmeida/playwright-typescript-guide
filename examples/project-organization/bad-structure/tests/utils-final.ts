// ❌ Problema: outro caso de duplicação. Já existe "helpers.ts", mas em algum
// momento alguém criou "utils-final.ts" para resolver algo rápido, sem revisar
// se já havia um lugar para essa função.

import { Locator } from '@playwright/test';

export function waitAndClick(locator: Locator) {
  return locator.click();
}
