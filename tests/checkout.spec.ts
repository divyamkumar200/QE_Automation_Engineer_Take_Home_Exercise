import { test, expect } from './fixtures/test';
import data from './data/checkout-data.json';
import { calculateDiscount, calculateTotal } from './utils/money';



for (const scenario of data) {

  let tagText = '';

  for (const tag of scenario.tags) {
    tagText = tagText + `@${tag} `;
  }

  test(`${tagText} ${scenario.id}`, async ({
    productPage,
    cartPage,
    checkoutPage
  }) => {
    await productPage.open();
    await productPage.addProductToCart(scenario.product);
    await productPage.openCart();

    await cartPage.expectProduct(scenario.product);

    const unitPrice = await cartPage.getUnitPrice(scenario.product);
    await cartPage.changeQuantity(scenario.product, scenario.quantity);

    const subtotal = await cartPage.getSubtotal();
    expect(subtotal).toBeCloseTo(unitPrice * scenario.quantity, 2);

    if (scenario.updatedQuantity) {
      await cartPage.changeQuantity(
        scenario.product,
        scenario.updatedQuantity
      );

      const updatedSubtotal = await cartPage.getSubtotal();
      expect(updatedSubtotal).toBeCloseTo(
        unitPrice * scenario.updatedQuantity,
        2
      );
      return;
    }

    if (scenario.coupon) {
      await cartPage.applyCoupon(scenario.coupon);
    }

    if (scenario.expectedCouponError) {
      await cartPage.expectCouponError(scenario.expectedCouponError);
      expect(await cartPage.getDiscount()).toBe(0);
      expect(await cartPage.getTotal()).toBeCloseTo(subtotal, 2);
      return;
    }

    const expectedDiscount = calculateDiscount(
      subtotal,
      scenario.expectedDiscountPercent ?? 0
    );

    const expectedTotal = calculateTotal(
      subtotal,
      scenario.expectedDiscountPercent ?? 0
    );

    expect(await cartPage.getDiscount()).toBeCloseTo(expectedDiscount, 2);
    expect(await cartPage.getTotal()).toBeCloseTo(expectedTotal, 2);

    await cartPage.checkout();
    await checkoutPage.fillCustomer(scenario.customer);
    await checkoutPage.placeOrder();
    await checkoutPage.expectOrderConfirmation();
  });
}
