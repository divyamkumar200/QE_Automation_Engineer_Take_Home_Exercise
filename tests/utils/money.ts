export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculateDiscount(
  subtotal: number,
  discountPercent: number
): number {
  return roundMoney(subtotal * (discountPercent / 100));
}

export function calculateTotal(
  subtotal: number,
  discountPercent: number
): number {
  return roundMoney(subtotal - calculateDiscount(subtotal, discountPercent));
}
