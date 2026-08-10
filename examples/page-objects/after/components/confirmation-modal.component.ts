import type { Locator, Page } from '@playwright/test';

// O modal é uma parte reutilizável da interface e não possui navegação própria.
export class ConfirmationModalComponent {
  private readonly confirmButton: Locator;
  private readonly cancelButton: Locator;
  private readonly closeButton: Locator;

  constructor(page: Page) {
    const modal = page.getByRole('dialog');
    this.confirmButton = modal.getByRole('button', { name: 'Confirmar' });
    this.cancelButton = modal.getByRole('button', { name: 'Cancelar' });
    this.closeButton = modal.getByRole('button', { name: 'Fechar' });
  }

  async confirm(): Promise<void> {
    await this.confirmButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  async close(): Promise<void> {
    await this.closeButton.click();
  }
}
