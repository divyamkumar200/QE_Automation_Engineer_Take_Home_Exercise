import { expect, Page } from '@playwright/test';

export class CartPage {
  constructor(private readonly page: Page) {}

  private row(product: string) {
    return this.page.getByRole('row', { name: new RegExp(product, 'i') });
  }

  async expectProduct(product: string) {
    await expect(this.row(product)).toBeVisible();
  }

  async getUnitPrice(product: string): Promise<number> {
    const value = await this.row(product)
      .getByTestId('unit-price')
      .innerText();
    return this.parseMoney(value);
  }

  async getSubtotal(): Promise<number> {
    const value = await this.page.getByTestId('subtotal').innerText();
    return this.parseMoney(value);
  }

  async getTotal(): Promise<number> {
    const value = await this.page.getByTestId('total').innerText();
    return this.parseMoney(value);
  }

  async getDiscount(): Promise<number> {
    const value = await this.page.getByTestId('discount').innerText();
    return this.parseMoney(value);
  }

  async changeQuantity(product: string, quantity: number) {
    const input = this.row(product).getByRole('spinbutton');
    await input.fill(String(quantity));
    await input.press('Enter');
    await expect(input).toHaveValue(String(quantity));
  }

  async applyCoupon(coupon: string) {
    const couponInput = this.page.getByRole('textbox', { name: /coupon/i });
    await couponInput.fill(coupon);
    await this.page.getByRole('button', { name: /apply coupon/i }).click();
  }

  async expectCouponError(message: string) {
    await expect(this.page.getByRole('alert')).toContainText(message);
  }

  async checkout() {
    await this.page.getByRole('button', { name: /checkout/i }).click();
  }

  private parseMoney(value: string): number {
    const normalized = value.replace(/[^0-9.-]+/g, '');
    const amount = Number(normalized);
    if (Number.isNaN(amount)) {
      throw new Error(`Unable to parse money value: "${value}"`);
    }
    return amount;
  }
}
