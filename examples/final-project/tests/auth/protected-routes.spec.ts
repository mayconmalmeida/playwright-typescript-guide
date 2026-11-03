import { expect, test } from '../../fixtures/test.fixture';
import { authMessages } from '../../test-data/auth-messages';
import { routes } from '../../test-data/routes';

const protectedRoutes = [
  routes.inventory,
  routes.cart,
  routes.checkoutInformation,
  routes.checkoutOverview,
  routes.checkoutComplete,
];

test.describe('rotas protegidas sem sessão', () => {
  for (const route of protectedRoutes) {
    test(`AUTH-06 ${route} redireciona para o login`, { tag: '@regression' }, async ({ page, loginPage }) => {
      await page.goto(route);

      await expect(page).toHaveURL(routes.login);
      await expect(loginPage.errorMessage).toHaveText(authMessages.protectedRoute(route));
    });
  }
});
