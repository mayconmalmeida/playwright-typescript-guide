// ✅ Função utilitária isolada e com propósito único — fácil de localizar e testar.

export function formatCurrency(value: number): string {
  return `R$ ${value.toFixed(2)}`;
}
