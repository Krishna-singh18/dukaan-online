import { storeConfig } from '../data/storeConfig';
import { formatPrice } from './formatPrice';

/**
 * Normalize Indian WhatsApp number to international E.164 format without +
 * E.g., '9876543210' -> '919876543210', '919876543210' -> '919876543210'
 */
function getNormalizedWhatsAppNumber(num = storeConfig.whatsappNumber) {
  const clean = String(num || '').replace(/\D/g, '');
  if (clean.length === 10) {
    return `91${clean}`;
  }
  return clean;
}

/**
 * Generate a WhatsApp Click-to-Chat URL for order placement
 * Formats the order as an authentic supermarket / Kirana POS monospace receipt.
 * 
 * @param {Object} orderData
 * @param {string} orderData.orderId - Unique order reference ID
 * @param {Array} orderData.items - List of cart items
 * @param {number} orderData.subtotal
 * @param {number} orderData.deliveryFee
 * @param {number} orderData.total
 * @param {Object} orderData.customer - Customer details
 * @param {string} orderData.orderType - 'delivery' | 'pickup'
 * @param {string} orderData.orderNote - Optional notes
 * @returns {string} WhatsApp URL
 */
export function generateWhatsAppOrderUrl({
  orderId = '',
  items = [],
  subtotal = 0,
  deliveryFee = 0,
  total = 0,
  customer = {},
  orderType = 'delivery',
  orderNote = '',
  whatsappNumber,
  storeName: customStoreName
}) {
  const number = getNormalizedWhatsAppNumber(whatsappNumber || storeConfig.whatsappNumber);
  const storeName = customStoreName || storeConfig.name;

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  const orderTypeStr = orderType === 'pickup' ? 'Store Pickup' : 'Home Delivery';
  const displayId = orderId ? `#${orderId}` : `#ORD-${Math.floor(100000 + Math.random() * 900000)}`;

  // Construct Monospace Supermarket POS Receipt (32-character fixed width)
  let receipt = '```\n';
  receipt += '================================\n';
  receipt += '       OFFICIAL ORDER SLIP      \n';
  receipt += '================================\n';
  receipt += `Order ID : ${displayId}\n`;
  receipt += `Date     : ${dateStr}, ${timeStr}\n`;
  receipt += `Mode     : ${orderTypeStr}\n`;
  receipt += '--------------------------------\n';
  receipt += 'CUSTOMER DETAILS:\n';
  receipt += `Name     : ${customer.name || 'Customer'}\n`;
  receipt += `Phone    : ${customer.phone || 'Not provided'}\n`;

  if (orderType === 'delivery') {
    receipt += `Address  : ${customer.address || 'Not provided'}\n`;
    if (customer.landmark && customer.landmark.trim()) {
      receipt += `Landmark : ${customer.landmark.trim()}\n`;
    }
  }

  if (orderNote && orderNote.trim()) {
    receipt += `Note     : ${orderNote.trim()}\n`;
  }

  receipt += '--------------------------------\n';
  receipt += 'ITEMS ORDERED:\n';
  receipt += '--------------------------------\n';

  items.forEach((item, index) => {
    const itemTotal = (item.price || 0) * (item.quantity || 1);
    const unitText = item.unit ? ` (${item.unit})` : '';
    receipt += `${index + 1}. ${item.name}${unitText}\n`;
    
    const qtyPrice = `   ${item.quantity} x ₹${item.price}`;
    const totalFormatted = `₹${itemTotal}`;
    const spacesNeeded = Math.max(2, 32 - qtyPrice.length - totalFormatted.length);
    receipt += `${qtyPrice}${' '.repeat(spacesNeeded)}${totalFormatted}\n`;
  });

  receipt += '--------------------------------\n';
  const subTotalStr = `₹${subtotal}`;
  const subPad = Math.max(2, 32 - 'Subtotal:'.length - subTotalStr.length);
  receipt += `Subtotal:${' '.repeat(subPad)}${subTotalStr}\n`;

  if (orderType === 'delivery') {
    const feeStr = deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`;
    const feePad = Math.max(2, 32 - 'Delivery Fee:'.length - feeStr.length);
    receipt += `Delivery Fee:${' '.repeat(feePad)}${feeStr}\n`;
  }

  receipt += '--------------------------------\n';
  const grandTotalStr = `₹${total}`;
  const grandPad = Math.max(2, 32 - 'TOTAL PAYABLE:'.length - grandTotalStr.length);
  receipt += `TOTAL PAYABLE:${' '.repeat(grandPad)}${grandTotalStr}\n`;
  receipt += '================================\n';
  receipt += 'Payment  : Cash / UPI on Delivery\n';
  receipt += '================================\n';
  receipt += '```';

  let message = `*NEW ORDER RECEIPT*\n`;
  message += `*${storeName.toUpperCase()}*\n\n`;
  message += receipt + '\n\n';
  message += `_Namaste! Please confirm my order and share estimated delivery time. Thank you!_`;

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/**
 * Generate a simple inquiry WhatsApp URL
 * @param {string} customMessage Optional custom message
 * @returns {string} WhatsApp URL
 */
export function generateWhatsAppInquiryUrl(customMessage = '', customNumber = '', customStoreName = '') {
  const number = getNormalizedWhatsAppNumber(customNumber || storeConfig.whatsappNumber);
  const sName = customStoreName || storeConfig.name;
  const defaultMsg = `Namaste ${sName}! I would like to inquire about grocery delivery and available products.`;
  const text = customMessage || defaultMsg;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

