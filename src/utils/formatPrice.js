/**
 * Format numeric value to Indian Rupee (INR) currency representation
 * @param {number|string} amount
 * @returns {string} Formatted price with Rupee symbol, e.g., "₹450"
 */
export function formatPrice(amount) {
  const numericAmount = Number(amount);
  if (isNaN(numericAmount)) {
    return '₹0';
  }

  // Format using Indian numbering system (lakhs, crores)
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: numericAmount % 1 !== 0 ? 2 : 0,
  }).format(numericAmount);

  return `₹${formatted}`;
}

/**
 * Calculate discount percentage
 * @param {number} originalPrice 
 * @param {number} sellingPrice 
 * @returns {number} Integer percentage discount, e.g. 15
 */
export function calculateDiscount(originalPrice, sellingPrice) {
  if (!originalPrice || !sellingPrice || originalPrice <= sellingPrice) return 0;
  return Math.round(((originalPrice - sellingPrice) / originalPrice) * 100);
}

