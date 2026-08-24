import { expect, test } from '../fixtures/test.fixture';

test('opens the authenticated user profile', async ({ authenticatedUser }) => {
  const { dashboardPage, user } = authenticatedUser;

  await dashboardPage.openProfile();

  await expect(dashboardPage.profileHeading).toHaveText('Meu perfil');
  await expect(dashboardPage.profileEmail).toHaveText(user.email);
});

