import { expect, Page } from '@playwright/test';

export class ProductPage {
  constructor(private readonly page: Page) {}

  private product(name: string) {
    return this.page.getByRole('article', { name: new RegExp(name, 'i') });
  }

  async open() {
    await this.page.goto('/');
  }

  async openProduct(name: string) {
    await this.product(name).getByRole('link').first().click();
  }

  async addProductToCart(name: string) {
    const card = this.product(name);
    await expect(card).toBeVisible();
    await card.getByRole('button', { name: /add to cart/i }).click();
  }

  async openCart() {
    await this.page.getByRole('link', { name: /cart/i }).click();
  }
}
