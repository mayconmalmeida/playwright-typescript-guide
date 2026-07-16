// ❌ Problema: dados de domínios diferentes (login, carteira) misturados
// em um único arquivo, sem nenhuma separação por contexto.

export const testData = {
  validUser: { email: 'usuario@teste.com', password: '123456' },
  invalidUser: { email: 'errado@teste.com', password: 'errada' },
  walletStartingBalance: 100,
};
