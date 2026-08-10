import { expect, test } from '@playwright/test';
import { DashboardPage } from '../pages/dashboard.page';
import { LoginPage } from '../pages/login.page';

test('should log in successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  await loginPage.goto();
  await loginPage.login('qa@example.com', 'valid-password');

  await expect(dashboardPage.heading).toHaveText('Dashboard');
});
