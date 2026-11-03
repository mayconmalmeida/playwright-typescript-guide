// Nomes dos seis produtos para validar a identidade completa do catálogo.
export const catalogNames = [
  'Sauce Labs Backpack',
  'Sauce Labs Bike Light',
  'Sauce Labs Bolt T-Shirt',
  'Sauce Labs Fleece Jacket',
  'Sauce Labs Onesie',
  'Test.allTheThings() T-Shirt (Red)',
] as const;

// Apenas dois produtos precisam de dados completos nos cenários desta sprint.
// Valores observados na interface da SauceDemo em 03/11/2026.
export const products = {
  backpack: {
    name: 'Sauce Labs Backpack',
    description: 'carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.',
    price: '$29.99',
  },
  bikeLight: {
    name: 'Sauce Labs Bike Light',
    description: "A red light isn't the desired state in testing but it sure helps when riding your bike at night. Water-resistant with 3 lighting modes, 1 AAA battery included.",
    price: '$9.99',
  },
} as const;
