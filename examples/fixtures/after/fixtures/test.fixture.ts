import { test as base } from '@playwright/test';
import { users, type TestUser } from '../data/users.data';
import { DashboardPage } from '../pages/dashboard.page';
import { LoginPage } from '../pages/login.page';

type AuthenticatedUser = {
  user: TestUser;
  dashboardPage: DashboardPage;
};

type TestFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  user: TestUser;
  authenticatedUser: AuthenticatedUser;
};

export const test = base.extend<TestFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  user: async ({}, use) => {
    await use(users.qa);
  },

  authenticatedUser: async ({ page, loginPage, dashboardPage, user }, use) => {
    // Setup: prepara somente o contexto prometido pelo nome da fixture.
    await loginPage.goto();
    await loginPage.login(user.email, user.password);

    await use({ user, dashboardPage });

    // Teardown: tudo após use() executa quando o teste termina.
    await page.setContent('<!doctype html><title>Contexto encerrado</title>');
  },
});

export { expect } from '@playwright/test';

