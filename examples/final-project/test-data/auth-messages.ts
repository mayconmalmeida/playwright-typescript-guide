// Textos exibidos pela SauceDemo, centralizados para que uma mudança na aplicação
// seja corrigida em um único lugar.
export const authMessages = {
  usernameRequired: 'Epic sadface: Username is required',
  passwordRequired: 'Epic sadface: Password is required',
  invalidCredentials: 'Epic sadface: Username and password do not match any user in this service',
  lockedOut: 'Epic sadface: Sorry, this user has been locked out.',
  protectedRoute: (path: string) => `Epic sadface: You can only access '${path}' when you are logged in.`,
} as const;
