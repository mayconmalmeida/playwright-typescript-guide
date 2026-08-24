import { expect, test } from '../fixtures/test.fixture';

test('shows the authenticated user dashboard', async ({ authenticatedUser }) => {
  const { dashboardPage, user } = authenticatedUser;

  await expect(dashboardPage.heading).toHaveText('Dashboard');
  await expect(dashboardPage.welcomeMessage).toHaveText(`Olá, ${user.name}`);
});

