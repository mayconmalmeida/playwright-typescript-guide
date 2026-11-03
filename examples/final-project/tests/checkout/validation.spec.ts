import { expect, test } from '../../fixtures/checkout.fixture';
import { checkoutCustomer, checkoutMessages } from '../../test-data/checkout';
import { routes } from '../../test-data/routes';

const requiredFields = [
  { field: 'firstName', message: checkoutMessages.firstNameRequired },
  { field: 'lastName', message: checkoutMessages.lastNameRequired },
  { field: 'postalCode', message: checkoutMessages.postalCodeRequired },
] as const;

for (const { field, message } of requiredFields) {
  test(`CHECK-02 ${field} obrigatório`, { tag: '@regression' }, async ({ checkoutInformation, page }) => {
    // Somente o campo sob teste fica vazio, sem depender da ordem de validação.
    await checkoutInformation.fill({ ...checkoutCustomer, [field]: '' });
    await checkoutInformation.continue();

    await expect(checkoutInformation.errorMessage).toHaveText(message);
    await expect(page).toHaveURL(routes.checkoutInformation);
    await expect(checkoutInformation[field]).toHaveValue('');
  });
}
