/**
 * Format a number as a USD currency string.
 */
export function formatMoney(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Calculate tax amount.
 */
export function calculateTax(subtotal: number, taxRate: number): number {
  return subtotal * taxRate;
}

/**
 * Calculate total with tax.
 */
export function calculateTotal(subtotal: number, taxRate: number): number {
  return subtotal + calculateTax(subtotal, taxRate);
}

/**
 * Apply a percentage discount.
 */
export function applyPercentageDiscount(amount: number, percentage: number): number {
  return amount * (1 - percentage / 100);
}

/**
 * Apply a fixed discount, ensuring result is non-negative.
 */
export function applyFixedDiscount(amount: number, fixedAmount: number): number {
  return Math.max(0, amount - fixedAmount);
}
