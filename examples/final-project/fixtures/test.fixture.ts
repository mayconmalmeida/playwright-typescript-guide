import { test as base, expect, type Page } from '@playwright/test';
import { HeaderComponent } from '../components/header.component';
import { SideMenuComponent } from '../components/side-menu.component';
import { resolveCredentials, type Credentials } from '../config/environment';
import { LoginPage } from '../pages/login.page';
import { routes } from '../test-data/routes';

type TestFixtures = {
  loginPage: LoginPage;
  header: HeaderComponent;
  sideMenu: SideMenuComponent;
  credentials: Credentials;
  authenticatedPage: Page;
};

export const test = base.extend<TestFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  header: async ({ page }, use) => {
    await use(new HeaderComponent(page));
  },

  sideMenu: async ({ page }, use) => {
    await use(new SideMenuComponent(page));
  },

  // Fixtures são preguiçosas: a senha só é exigida pelos testes que pedem credentials.
  // Cenários negativos (campos vazios, credenciais inválidas) rodam sem SAUCEDEMO_PASSWORD.
  credentials: async ({}, use) => {
    await use(resolveCredentials());
  },

  // Cada teste recebe um contexto novo do Playwright: nada é compartilhado entre testes.
  authenticatedPage: async ({ page, loginPage, header, credentials }, use) => {
    await loginPage.goto();
    await loginPage.login(credentials.username, credentials.password);

    // Pré-condição, não cenário: se o login falhar, o teste para aqui com a causa clara,
    // em vez de falhar adiante em um passo que nada tem a ver com autenticação.
    await expect(page, 'login da fixture authenticatedPage não concluído').toHaveURL(routes.inventory);
    await expect(header.title).toHaveText('Products');

    await use(page);
  },
});

export { expect } from '@playwright/test';
