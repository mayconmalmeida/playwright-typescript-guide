// Dados inteiramente fictícios para a loja pública de demonstração.
export const checkoutCustomer = {
  firstName: 'Pessoa',
  lastName: 'Ficticia',
  postalCode: '00000-000',
} as const;

export const checkoutMessages = {
  firstNameRequired: 'Error: First Name is required',
  lastNameRequired: 'Error: Last Name is required',
  postalCodeRequired: 'Error: Postal Code is required',
  completeHeader: 'Thank you for your order!',
  completeText: 'Your order has been dispatched, and will arrive just as fast as the pony can get there!',
} as const;
