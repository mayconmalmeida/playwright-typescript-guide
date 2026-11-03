import type { Locator, Page } from '@playwright/test';

export interface CheckoutCustomer {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export class CheckoutInformationPage {
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly errorMessage: Locator;
  private readonly continueButton: Locator;
  private readonly cancelButton: Locator;

  constructor(page: Page) {
    this.firstName = page.getByRole('textbox', { name: 'First Name', exact: true });
    this.lastName = page.getByRole('textbox', { name: 'Last Name', exact: true });
    this.postalCode = page.getByRole('textbox', { name: 'Zip/Postal Code', exact: true });
    this.errorMessage = page.getByTestId('error');
    this.continueButton = page.getByRole('button', { name: 'Continue', exact: true });
    this.cancelButton = page.getByRole('button', { name: 'Cancel', exact: true });
  }

  async fill(customer: CheckoutCustomer): Promise<void> {
    await this.firstName.fill(customer.firstName);
    await this.lastName.fill(customer.lastName);
    await this.postalCode.fill(customer.postalCode);
  }

  async continue(): Promise<void> {
    await this.continueButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }
}
