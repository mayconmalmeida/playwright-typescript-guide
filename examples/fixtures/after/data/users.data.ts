export type TestUser = {
  name: string;
  email: string;
  password: string;
};

export const users = {
  qa: {
    name: 'Pessoa QA',
    email: 'qa@example.com',
    password: 'valid-password',
  },
} as const satisfies Record<string, TestUser>;

