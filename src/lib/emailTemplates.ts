import { Order, OrderStatus } from '@/types';

/**
 * Format currency in Pakistani Rupees (PKR)
 */
function formatPKR(amount: number): string {
  return `PKR ${Number(amount || 0).toLocaleString('en-PK')}`;
}

/**
 * Map payment method to human-readable label
 */
function formatPaymentMethod(method?: string): string {
  switch (method) {
    case 'whatsapp':
      return 'Direct WhatsApp Order';
    case 'cod':
      return 'Cash on Delivery / Warehouse Pickup';
    case 'easypaisa':
      return 'EasyPaisa Mobile Account';
    case 'jazzcash':
      return 'JazzCash Mobile Account';
    case 'bank_transfer':
      return 'Direct Bank Transfer (Meezan Bank)';
    default:
      return method || 'Cash on Delivery';
  }
}

/**
 * Capitalize status string
 */
function formatStatusLabel(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

// =========================================================================
// 1. ADMIN NEW ORDER NOTIFICATION (Sent to usmanmalik9866@gmail.com)
// =========================================================================

export function buildAdminOrderEmailHtml(order: Order): string {
  const itemsRows = (order.items || [])
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #1e293b;">
        <strong style="color: #0f172a; display: block; font-size: 14px;">${escapeHtml(item.name)}</strong>
        <span style="display: inline-block; font-size: 11px; font-family: monospace; color: #64748b; background: #f1f5f9; padding: 2px 6px; rounded: 4px; margin-top: 3px;">
          PN: ${escapeHtml(item.part_number || 'N/A')}
        </span>
      </td>
      <td style="padding: 12px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #334155; text-align: center; font-weight: bold;">
        ${item.quantity}
      </td>
      <td style="padding: 12px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #334155; text-align: right;">
        ${formatPKR(item.price)}
      </td>
      <td style="padding: 12px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #0f172a; text-align: right; font-weight: bold;">
        ${formatPKR(item.subtotal || item.price * item.quantity)}
      </td>
    </tr>
  `
    )
    .join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Order #${order.order_number}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #334155;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8fafc; padding: 24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 620px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 18px rgba(0, 0, 0, 0.06); border: 1px solid #e2e8f0;">
          
          <!-- Header Bar -->
          <tr>
            <td style="background-color: #090d16; padding: 24px 30px; border-bottom: 3px solid #FF6A00;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <span style="font-size: 22px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px;">
                      Electric<span style="color: #FF6A00;">Parts</span>Online
                    </span>
                    <span style="display: block; font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; margin-top: 2px;">
                      Usman Traders • Admin Alert
                    </span>
                  </td>
                  <td align="right">
                    <span style="background-color: #FF6A00; color: #ffffff; font-size: 11px; font-weight: 800; padding: 6px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block;">
                      🚨 New Order
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Alert Banner -->
          <tr>
            <td style="padding: 24px 30px 10px 30px;">
              <div style="background-color: #fff7ed; border-left: 4px solid #FF6A00; border-radius: 8px; padding: 14px 18px; margin-bottom: 20px;">
                <p style="margin: 0; font-size: 15px; font-weight: 800; color: #9a3412;">
                  New Order Received: #${order.order_number}
                </p>
                <p style="margin: 4px 0 0 0; font-size: 13px; color: #7c2d12;">
                  Total: <strong>${formatPKR(order.total_amount)}</strong> • Payment: <strong>${formatPaymentMethod(order.payment_method)}</strong>
                </p>
              </div>
            </td>
          </tr>

          <!-- Customer Details Card -->
          <tr>
            <td style="padding: 0 30px 20px 30px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px;">
                <tr>
                  <td colspan="2" style="padding-bottom: 12px; border-bottom: 1px solid #e2e8f0;">
                    <span style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #64748b;">
                      Customer & Delivery Details
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 12px; font-size: 13px; color: #64748b; width: 140px; vertical-align: top;">Customer Name:</td>
                  <td style="padding-top: 12px; font-size: 14px; font-weight: 700; color: #0f172a;">${escapeHtml(order.customer_name)}</td>
                </tr>
                <tr>
                  <td style="padding-top: 8px; font-size: 13px; color: #64748b; vertical-align: top;">Phone / WhatsApp:</td>
                  <td style="padding-top: 8px; font-size: 14px; font-weight: 700; color: #0284c7;">
                    <a href="tel:${escapeHtml(order.customer_phone)}" style="color: #0284c7; text-decoration: none;">${escapeHtml(order.customer_phone)}</a>
                    &nbsp;•&nbsp;
                    <a href="https://wa.me/${cleanPhoneForWhatsApp(order.customer_phone)}" style="color: #16a34a; text-decoration: none; font-weight: bold;" target="_blank">Chat on WhatsApp ↗</a>
                  </td>
                </tr>
                ${
                  order.customer_email
                    ? `
                <tr>
                  <td style="padding-top: 8px; font-size: 13px; color: #64748b; vertical-align: top;">Customer Email:</td>
                  <td style="padding-top: 8px; font-size: 14px; color: #0f172a;">
                    <a href="mailto:${escapeHtml(order.customer_email)}" style="color: #ea580c; text-decoration: none; font-weight: 600;">${escapeHtml(order.customer_email)}</a>
                  </td>
                </tr>`
                    : ''
                }
                <tr>
                  <td style="padding-top: 8px; font-size: 13px; color: #64748b; vertical-align: top;">Shipping Address:</td>
                  <td style="padding-top: 8px; font-size: 13px; font-weight: 600; color: #1e293b;">
                    ${escapeHtml(order.shipping_address?.address || 'N/A')}, <strong>${escapeHtml(order.shipping_address?.city || 'Pakistan')}</strong>
                  </td>
                </tr>
                ${
                  order.delivery_notes
                    ? `
                <tr>
                  <td style="padding-top: 8px; font-size: 13px; color: #64748b; vertical-align: top;">Delivery Notes:</td>
                  <td style="padding-top: 8px; font-size: 13px; color: #475569; font-style: italic;">
                    "${escapeHtml(order.delivery_notes)}"
                  </td>
                </tr>`
                    : ''
                }
                <tr>
                  <td style="padding-top: 8px; font-size: 13px; color: #64748b; vertical-align: top;">Order Time:</td>
                  <td style="padding-top: 8px; font-size: 12px; color: #64748b;">
                    ${new Date(order.created_at || Date.now()).toLocaleString('en-PK', { timeZone: 'Asia/Karachi' })} (Pakistan Time)
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items Table -->
          <tr>
            <td style="padding: 0 30px 10px 30px;">
              <span style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #64748b; display: block; margin-bottom: 10px;">
                Ordered Parts (${order.items?.length || 0})
              </span>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse: collapse; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                <thead>
                  <tr style="background-color: #f1f5f9; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; color: #475569;">
                    <th style="padding: 10px 14px; text-align: left; font-weight: 800;">Item</th>
                    <th style="padding: 10px 14px; text-align: center; font-weight: 800;">Qty</th>
                    <th style="padding: 10px 14px; text-align: right; font-weight: 800;">Price</th>
                    <th style="padding: 10px 14px; text-align: right; font-weight: 800;">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsRows}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Totals Breakdown -->
          <tr>
            <td style="padding: 10px 30px 24px 30px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="width: 50%;"></td>
                  <td style="width: 50%;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="4" border="0" style="font-size: 13px; color: #475569;">
                      <tr>
                        <td align="left">Subtotal:</td>
                        <td align="right" style="font-weight: 600; color: #1e293b;">${formatPKR(order.subtotal)}</td>
                      </tr>
                      <tr>
                        <td align="left">Shipping Fee:</td>
                        <td align="right" style="font-weight: 600; color: #1e293b;">${formatPKR(order.shipping_fee)}</td>
                      </tr>
                      ${
                        order.discount_amount && order.discount_amount > 0
                          ? `
                      <tr>
                        <td align="left" style="color: #16a34a;">Discount (${escapeHtml(order.coupon_code || 'Promo')}):</td>
                        <td align="right" style="font-weight: 700; color: #16a34a;">-${formatPKR(order.discount_amount)}</td>
                      </tr>`
                          : ''
                      }
                      <tr style="border-top: 2px solid #e2e8f0;">
                        <td align="left" style="padding-top: 8px; font-size: 16px; font-weight: 900; color: #0f172a;">Grand Total:</td>
                        <td align="right" style="padding-top: 8px; font-size: 18px; font-weight: 900; color: #FF6A00;">
                          ${formatPKR(order.total_amount)}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Action Button -->
          <tr>
            <td align="center" style="padding: 0 30px 30px 30px;">
              <a href="https://electricpartsonline.com/admin/orders" style="background-color: #FF6A00; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 800; padding: 14px 28px; border-radius: 12px; display: inline-block; box-shadow: 0 4px 14px rgba(255, 106, 0, 0.35);" target="_blank">
                Open Order in Admin Panel ➔
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #090d16; padding: 20px 30px; text-align: center; border-top: 1px solid #1e293b;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                ElectricPartsOnline.com • Usman Traders Commercial Equipment Parts
              </p>
              <p style="margin: 4px 0 0 0; font-size: 11px; color: #64748b;">
                This automated notification was sent to <strong>usmanmalik9866@gmail.com</strong>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function buildAdminOrderEmailText(order: Order): string {
  const itemsText = (order.items || [])
    .map(
      (item) =>
        `- ${item.quantity}x ${item.name} (PN: ${item.part_number || 'N/A'}) - Price: ${formatPKR(item.price)} - Subtotal: ${formatPKR(item.subtotal || item.price * item.quantity)}`
    )
    .join('\n');

  return `
🚨 NEW ORDER RECEIVED: #${order.order_number}
==========================================

Customer Details:
- Name: ${order.customer_name}
- Phone: ${order.customer_phone}
- Email: ${order.customer_email || 'N/A'}
- Address: ${order.shipping_address?.address || ''}, ${order.shipping_address?.city || ''}
${order.delivery_notes ? `- Notes: ${order.delivery_notes}\n` : ''}

Payment & Pricing:
- Payment Method: ${formatPaymentMethod(order.payment_method)}
- Subtotal: ${formatPKR(order.subtotal)}
- Shipping Fee: ${formatPKR(order.shipping_fee)}
${order.discount_amount ? `- Discount: -${formatPKR(order.discount_amount)}\n` : ''}- Total Amount: ${formatPKR(order.total_amount)}

Items Ordered:
${itemsText}

Manage order online:
https://electricpartsonline.com/admin/orders
  `.trim();
}

// =========================================================================
// 2. CUSTOMER ORDER CONFIRMATION RECEIPT (Sent to customer's email)
// =========================================================================

export function buildCustomerConfirmationEmailHtml(order: Order): string {
  const itemsRows = (order.items || [])
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #1e293b;">
        <strong style="color: #0f172a; display: block; font-size: 14px;">${escapeHtml(item.name)}</strong>
        <span style="display: inline-block; font-size: 11px; font-family: monospace; color: #64748b; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; margin-top: 3px;">
          Part #: ${escapeHtml(item.part_number || 'N/A')}
        </span>
      </td>
      <td style="padding: 12px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #334155; text-align: center; font-weight: bold;">
        ${item.quantity}
      </td>
      <td style="padding: 12px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #334155; text-align: right;">
        ${formatPKR(item.price)}
      </td>
      <td style="padding: 12px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #0f172a; text-align: right; font-weight: bold;">
        ${formatPKR(item.subtotal || item.price * item.quantity)}
      </td>
    </tr>
  `
    )
    .join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation #${order.order_number}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #334155;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8fafc; padding: 24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 620px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 18px rgba(0, 0, 0, 0.06); border: 1px solid #e2e8f0;">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #090d16; padding: 26px 30px; text-align: center; border-bottom: 3px solid #FF6A00;">
              <span style="font-size: 24px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px;">
                Electric<span style="color: #FF6A00;">Parts</span>Online
              </span>
              <span style="display: block; font-size: 12px; color: #94a3b8; margin-top: 4px;">
                Usman Traders • Authorized Commercial Equipment Parts
              </span>
            </td>
          </tr>

          <!-- Thank You Intro -->
          <tr>
            <td style="padding: 30px 30px 10px 30px; text-align: center;">
              <div style="width: 56px; height: 56px; border-radius: 50%; background-color: #ecfdf5; color: #059669; font-size: 28px; line-height: 56px; margin: 0 auto 16px auto; font-weight: bold;">
                ✓
              </div>
              <h1 style="margin: 0; font-size: 22px; font-weight: 900; color: #0f172a;">
                Thank You for Your Order, ${escapeHtml(order.customer_name)}!
              </h1>
              <p style="margin: 8px 0 0 0; font-size: 14px; color: #64748b; line-height: 1.5;">
                We have received your commercial order <strong style="color: #0f172a;">#${order.order_number}</strong>. Our dispatch team is processing it for quick delivery.
              </p>
            </td>
          </tr>

          <!-- Summary Box -->
          <tr>
            <td style="padding: 16px 30px 20px 30px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px 20px;">
                <tr>
                  <td style="font-size: 13px; color: #64748b; padding-bottom: 6px;">Order Number:</td>
                  <td align="right" style="font-size: 14px; font-weight: 800; color: #0f172a; padding-bottom: 6px;">#${order.order_number}</td>
                </tr>
                <tr>
                  <td style="font-size: 13px; color: #64748b; padding-bottom: 6px;">Payment Method:</td>
                  <td align="right" style="font-size: 13px; font-weight: 700; color: #1e293b; padding-bottom: 6px;">${formatPaymentMethod(order.payment_method)}</td>
                </tr>
                <tr>
                  <td style="font-size: 13px; color: #64748b;">Shipping To:</td>
                  <td align="right" style="font-size: 13px; font-weight: 600; color: #1e293b;">
                    ${escapeHtml(order.shipping_address?.address || '')}, ${escapeHtml(order.shipping_address?.city || 'Pakistan')}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items Table -->
          <tr>
            <td style="padding: 0 30px 10px 30px;">
              <span style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #64748b; display: block; margin-bottom: 10px;">
                Order Summary (${order.items?.length || 0} items)
              </span>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse: collapse; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                <thead>
                  <tr style="background-color: #f1f5f9; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; color: #475569;">
                    <th style="padding: 10px 14px; text-align: left; font-weight: 800;">Item</th>
                    <th style="padding: 10px 14px; text-align: center; font-weight: 800;">Qty</th>
                    <th style="padding: 10px 14px; text-align: right; font-weight: 800;">Price</th>
                    <th style="padding: 10px 14px; text-align: right; font-weight: 800;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsRows}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Totals -->
          <tr>
            <td style="padding: 10px 30px 24px 30px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="width: 50%;"></td>
                  <td style="width: 50%;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="4" border="0" style="font-size: 13px; color: #475569;">
                      <tr>
                        <td align="left">Subtotal:</td>
                        <td align="right" style="font-weight: 600; color: #1e293b;">${formatPKR(order.subtotal)}</td>
                      </tr>
                      <tr>
                        <td align="left">Shipping:</td>
                        <td align="right" style="font-weight: 600; color: #1e293b;">${formatPKR(order.shipping_fee)}</td>
                      </tr>
                      ${
                        order.discount_amount && order.discount_amount > 0
                          ? `
                      <tr>
                        <td align="left" style="color: #16a34a;">Discount:</td>
                        <td align="right" style="font-weight: 700; color: #16a34a;">-${formatPKR(order.discount_amount)}</td>
                      </tr>`
                          : ''
                      }
                      <tr style="border-top: 2px solid #e2e8f0;">
                        <td align="left" style="padding-top: 8px; font-size: 16px; font-weight: 900; color: #0f172a;">Total:</td>
                        <td align="right" style="padding-top: 8px; font-size: 18px; font-weight: 900; color: #FF6A00;">
                          ${formatPKR(order.total_amount)}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Track Button -->
          <tr>
            <td align="center" style="padding: 0 30px 26px 30px;">
              <a href="https://electricpartsonline.com/track-order/" style="background-color: #0f172a; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 800; padding: 13px 26px; border-radius: 12px; display: inline-block;" target="_blank">
                Track Your Order Status ➔
              </a>
            </td>
          </tr>

          <!-- Need Help -->
          <tr>
            <td style="padding: 0 30px 24px 30px;">
              <div style="background-color: #f1f5f9; border-radius: 10px; padding: 14px 18px; text-align: center; font-size: 13px; color: #475569;">
                Need help or have questions? Contact us on WhatsApp: 
                <a href="https://wa.me/923218888872" style="color: #16a34a; font-weight: bold; text-decoration: none;" target="_blank">0321-8888872</a>
                or reply directly to this email.
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #090d16; padding: 20px 30px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                ElectricPartsOnline.com • 2026 All Rights Reserved
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function buildCustomerConfirmationEmailText(order: Order): string {
  const itemsText = (order.items || [])
    .map(
      (item) =>
        `- ${item.quantity}x ${item.name} (Part: ${item.part_number || 'N/A'}) - ${formatPKR(item.subtotal || item.price * item.quantity)}`
    )
    .join('\n');

  return `
Thank you for your order, ${order.customer_name}!
Order Confirmation: #${order.order_number}
==========================================

Your order has been received and logged in our system.

Order Summary:
${itemsText}

Subtotal: ${formatPKR(order.subtotal)}
Shipping: ${formatPKR(order.shipping_fee)}
${order.discount_amount ? `Discount: -${formatPKR(order.discount_amount)}\n` : ''}Total Amount: ${formatPKR(order.total_amount)}
Payment Method: ${formatPaymentMethod(order.payment_method)}

Delivery Address:
${order.shipping_address?.address || ''}, ${order.shipping_address?.city || ''}

Track your order anytime:
https://electricpartsonline.com/track-order/

Questions? WhatsApp us: 0321-8888872
ElectricPartsOnline.com
  `.trim();
}

// =========================================================================
// 3. ORDER STATUS UPDATE NOTIFICATION (Sent to customer on admin status change)
// =========================================================================

export function buildCustomerStatusUpdateEmailHtml(order: Order, newStatus: OrderStatus): string {
  const statusColorMap: Record<OrderStatus, { bg: string; text: string; title: string; desc: string }> = {
    pending: {
      bg: '#fef3c7',
      text: '#92400e',
      title: 'Order is Pending',
      desc: 'Your order has been logged and is awaiting dispatch confirmation.',
    },
    confirmed: {
      bg: '#ecfdf5',
      text: '#065f46',
      title: 'Order Confirmed! ✓',
      desc: 'Your order has been confirmed by our sales desk and forwarded to our inventory team.',
    },
    processing: {
      bg: '#e0e7ff',
      text: '#3730a3',
      title: 'Order is Processing',
      desc: 'Our technical team is currently assembling, inspecting, and packaging your parts.',
    },
    dispatched: {
      bg: '#f3e8ff',
      text: '#6b21a8',
      title: 'Order Dispatched! 📦',
      desc: 'Your commercial parts package has been handed over to our courier partner.',
    },
    shipped: {
      bg: '#f3e8ff',
      text: '#6b21a8',
      title: 'Order Has Been Shipped! 🚀',
      desc: 'Your commercial parts package is in transit with our courier partner.',
    },
    delivered: {
      bg: '#ecfdf5',
      text: '#065f46',
      title: 'Order Delivered! 🎉',
      desc: 'Your package has been successfully delivered. Thank you for choosing ElectricPartsOnline.',
    },
    cancelled: {
      bg: '#fee2e2',
      text: '#991b1b',
      title: 'Order Cancelled',
      desc: 'This order has been cancelled. If this is unexpected, please contact our support.',
    },
  };

  const currentStatusInfo = statusColorMap[newStatus] || statusColorMap.pending;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order #${order.order_number} Status Update</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #334155;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8fafc; padding: 24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 620px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 18px rgba(0, 0, 0, 0.06); border: 1px solid #e2e8f0;">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #090d16; padding: 24px 30px; text-align: center; border-bottom: 3px solid #FF6A00;">
              <span style="font-size: 22px; font-weight: 900; color: #ffffff;">
                Electric<span style="color: #FF6A00;">Parts</span>Online
              </span>
            </td>
          </tr>

          <!-- Status Highlight Banner -->
          <tr>
            <td style="padding: 30px 30px 10px 30px; text-align: center;">
              <span style="background-color: ${currentStatusInfo.bg}; color: ${currentStatusInfo.text}; font-size: 13px; font-weight: 800; padding: 6px 16px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block;">
                Status: ${formatStatusLabel(newStatus)}
              </span>
              <h1 style="margin: 16px 0 0 0; font-size: 22px; font-weight: 900; color: #0f172a;">
                ${currentStatusInfo.title}
              </h1>
              <p style="margin: 8px 0 0 0; font-size: 14px; color: #64748b; line-height: 1.5;">
                ${currentStatusInfo.desc}
              </p>
            </td>
          </tr>

          <!-- Order Snapshot -->
          <tr>
            <td style="padding: 20px 30px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px;">
                <tr>
                  <td style="font-size: 13px; color: #64748b; padding-bottom: 6px;">Order Number:</td>
                  <td align="right" style="font-size: 14px; font-weight: 800; color: #0f172a; padding-bottom: 6px;">#${order.order_number}</td>
                </tr>
                <tr>
                  <td style="font-size: 13px; color: #64748b; padding-bottom: 6px;">Recipient:</td>
                  <td align="right" style="font-size: 13px; font-weight: 700; color: #1e293b; padding-bottom: 6px;">${escapeHtml(order.customer_name)}</td>
                </tr>
                <tr>
                  <td style="font-size: 13px; color: #64748b; padding-bottom: 6px;">Total Amount:</td>
                  <td align="right" style="font-size: 14px; font-weight: 800; color: #FF6A00; padding-bottom: 6px;">${formatPKR(order.total_amount)}</td>
                </tr>
                <tr>
                  <td style="font-size: 13px; color: #64748b;">Destination:</td>
                  <td align="right" style="font-size: 13px; font-weight: 600; color: #1e293b;">
                    ${escapeHtml(order.shipping_address?.city || 'Pakistan')}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Track Button -->
          <tr>
            <td align="center" style="padding: 0 30px 30px 30px;">
              <a href="https://electricpartsonline.com/track-order/" style="background-color: #FF6A00; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 800; padding: 14px 28px; border-radius: 12px; display: inline-block; box-shadow: 0 4px 14px rgba(255, 106, 0, 0.35);" target="_blank">
                Track Live Order Status ➔
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #090d16; padding: 20px 30px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                ElectricPartsOnline.com • Helpline: 0321-8888872
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function buildCustomerStatusUpdateEmailText(order: Order, newStatus: OrderStatus): string {
  return `
Order #${order.order_number} Status Update
=========================================

Hello ${order.customer_name},

Your order status has been updated to: ${formatStatusLabel(newStatus).toUpperCase()}

Order Summary:
- Order Number: #${order.order_number}
- Total: ${formatPKR(order.total_amount)}
- Destination: ${order.shipping_address?.city || 'Pakistan'}

Track live order status:
https://electricpartsonline.com/track-order/

Questions? WhatsApp helpline: 0321-8888872
ElectricPartsOnline.com
  `.trim();
}

// =========================================================================
// Helper Utilities
// =========================================================================

function escapeHtml(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function cleanPhoneForWhatsApp(phone: string): string {
  if (!phone) return '923218888872';
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '92' + cleaned.slice(1);
  } else if (!cleaned.startsWith('92')) {
    cleaned = '92' + cleaned;
  }
  return cleaned;
}
