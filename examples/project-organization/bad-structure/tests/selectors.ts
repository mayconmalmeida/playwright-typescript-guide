// ❌ Problema: um único arquivo de "seletores" para o projeto inteiro.
// Conforme novas telas são adicionadas, essa lista só cresce e mistura
// domínios diferentes (login, carteira, etc.) sem nenhum contexto.

export const selectors = {
  loginUser: '#user',
  loginPass: '#pass',
  loginButton: 'button.btn-login',
  walletBalance: '.wallet-balance',
  // ... e a lista continua crescendo, sem relação entre os itens.
};
