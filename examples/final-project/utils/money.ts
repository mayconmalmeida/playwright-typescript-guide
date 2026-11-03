// Contrato da UI: dólares não negativos, ponto decimal e exatamente dois centavos.
// Rejeita entradas parciais que parseFloat aceitaria silenciosamente.
export function parseUsdCents(value: string): number {
  const match = /^\$(\d+)\.(\d{2})$/.exec(value.trim());
  if (!match) {
    throw new Error('Preço USD inválido');
  }
  const cents = Number(match[1]) * 100 + Number(match[2]);
  if (!Number.isSafeInteger(cents)) {
    throw new Error('Preço USD fora do intervalo seguro');
  }
  return cents;
}
