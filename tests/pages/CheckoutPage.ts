import { expect, Page } from '@playwright/test';

type Customer = {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
};

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  async fillCustomer(customer: Customer) {
    await this.page.getByLabel(/first name/i).fill(customer.firstName);
    await this.page.getByLabel(/last name/i).fill(customer.lastName);
    await this.page.getByLabel(/email/i).fill(customer.email);
    await this.page.getByLabel(/address/i).fill(customer.address);
    await this.page.getByLabel(/city/i).fill(customer.city);
    await this.page.getByLabel(/postal code|zip/i).fill(customer.postalCode);
  }

  async placeOrder() {
    await this.page.getByRole('button', { name: /place order|complete order/i }).click();
  }

  async expectOrderConfirmation() {
    await expect(
      this.page.getByRole('heading', { name: /order confirmation|thank you/i })
    ).toBeVisible({ timeout: 15_000 });
  }
}
