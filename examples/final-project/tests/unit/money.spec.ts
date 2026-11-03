import { expect, test } from '@playwright/test';
import { parseUsdCents } from '../../utils/money';

// Sem navegador ou credenciais: valida o contrato usado nas comparações de preços.
test('USD converte preços completos para centavos inteiros', () => {
  for (const [input, expected] of [['$0.00', 0], ['$0.01', 1], ['$9.99', 999], ['$29.99', 2999], [' $49.99 ', 4999]] as const) {
    expect(parseUsdCents(input)).toBe(expected);
  }
});

test('USD rejeita formatos inválidos e valores sem precisão segura', () => {
  for (const input of ['', '9.99', '$9.9', '$9.999', '$9,99', '$-1.00', '$NaN', '$1.00USD', '$1,000.00', '$9007199254740991.00']) {
    expect(() => parseUsdCents(input), input).toThrow();
  }
});
