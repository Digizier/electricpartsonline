import { Product, OrderItem } from '@/types';
import { formatCurrency } from './utils';

const DEFAULT_PHONE = '923218888872';

export function cleanPhone(phone?: string): string {
  if (!phone) return DEFAULT_PHONE;
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '92' + cleaned.substring(1);
  }
  return cleaned.length >= 10 ? cleaned : DEFAULT_PHONE;
}

export function buildProductWhatsAppLink(
  product: Product,
  quantity: number = 1,
  whatsappNumber: string = DEFAULT_PHONE
): string {
  const phone = cleanPhone(whatsappNumber);
  const total = formatCurrency(product.price * quantity);
  const singlePrice = formatCurrency(product.price);

  const message = `Hello Usman Traders / ElectricPartsOnline.com!
I want to order this commercial replacement part:

📦 Product: ${product.name}
🔢 Part Number: ${product.part_number}
🏷️ Unit Price: ${singlePrice}
📊 Quantity: ${quantity}
💰 Total: ${total}
🔗 Product Link: https://electricpartsonline.com/product/?slug=${product.slug}

Please confirm stock availability and dispatch details. Thank you!`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function buildCartWhatsAppLink(
  items: OrderItem[],
  total: number,
  customerName?: string,
  customerAddress?: string,
  whatsappNumber: string = DEFAULT_PHONE
): string {
  const phone = cleanPhone(whatsappNumber);

  const itemsList = items
    .map(
      (item) =>
        `• ${item.quantity}x ${item.name} (Part #: ${item.part_number}) - ${formatCurrency(item.subtotal)}`
    )
    .join('\n');

  const message = `Hello Usman Traders / ElectricPartsOnline.com!
I would like to place an order:

${itemsList}

💰 Grand Total: ${formatCurrency(total)}
👤 Customer Name: ${customerName || 'Not specified'}
📍 Delivery Address: ${customerAddress || 'Please contact for delivery details'}

Please process my order and share payment/dispatch confirmation!`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function buildInquiryWhatsAppLink(
  modelNumber: string,
  equipmentBrand?: string,
  productName?: string,
  whatsappNumber: string = DEFAULT_PHONE
): string {
  const phone = cleanPhone(whatsappNumber);

  const message = `Hello Usman Traders / ElectricPartsOnline.com!
I need technical help finding the correct replacement part:

🔍 Equipment Brand: ${equipmentBrand || 'Commercial Equipment'}
⚙️ Model Number: ${modelNumber}
${productName ? `📌 Inquiring regarding part: ${productName}` : ''}

Please let me know if this part is compatible or suggest the correct OEM replacement. Thank you!`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
