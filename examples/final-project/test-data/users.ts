// Usernames públicos exibidos na tela de login da SauceDemo.
// A senha não fica aqui: vem exclusivamente de SAUCEDEMO_PASSWORD (veja config/environment.ts).
export const usernames = {
  standard: 'standard_user',
  lockedOut: 'locked_out_user',
} as const;

// Propositalmente inválidas: não correspondem a nenhum usuário da SauceDemo.
export const invalidCredentials = {
  username: 'invalid_user',
  password: 'invalid_password',
} as const;
