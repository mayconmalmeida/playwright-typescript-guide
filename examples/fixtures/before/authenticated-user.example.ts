import { expect, test } from '@playwright/test';
import { DashboardPage } from '../after/pages/dashboard.page';
import { LoginPage } from '../after/pages/login.page';
import { users } from '../after/data/users.data';

// A duplicação de preparação abaixo é intencional para fins didáticos.
test('shows the authenticated user dashboard', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const user = users.qa;

  await loginPage.goto();
  await loginPage.login(user.email, user.password);

  await expect(dashboardPage.heading).toHaveText('Dashboard');
  await expect(dashboardPage.welcomeMessage).toHaveText(`Olá, ${user.name}`);
});

// A mesma preparação permanece explícita, porém passa a se repetir.
test('opens the authenticated user profile', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const user = users.qa;

  await loginPage.goto();
  await loginPage.login(user.email, user.password);
  await dashboardPage.openProfile();

  await expect(dashboardPage.profileHeading).toHaveText('Meu perfil');
  await expect(dashboardPage.profileEmail).toHaveText(user.email);
});

