// Cloudflare Pages Function: /api/send-email
// Handles instant email dispatch via Resend API directly from Cloudflare Edge

const FALLBACK_KEY = typeof atob !== 'undefined'
  ? atob('cmVfSHZmNFVESmZfM1FhTkxzaTVSNFlvZUpzdzRqbjRyVjN1')
  : '';
const RESEND_FROM = 'ElectricPartsOnline <orders@noreply.electricpartsonline.com>';
const ADMIN_EMAIL = 'usmanmalik9866@gmail.com';

function formatPKR(amount: number): string {
  return `PKR ${Number(amount || 0).toLocaleString('en-PK')}`;
}

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

function formatOrderNum(num?: string): string {
  if (!num) return '#00000';
  const clean = num.replace(/^#+/, '');
  return `#${clean}`;
}

async function sendResend(apiKey: string, payload: any) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function onRequestPost(context: any) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  try {
    const { request, env } = context;
    const body = await request.json();
    const { type, order, newStatus } = body;

    const apiKey = env?.RESEND_API_KEY || FALLBACK_KEY;
    const fromEmail = env?.RESEND_FROM_EMAIL || RESEND_FROM;
    const adminEmail = env?.ADMIN_NOTIFICATION_EMAIL || ADMIN_EMAIL;

    if (!order) {
      return new Response(JSON.stringify({ error: 'Order details missing' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const results: any = {};

    if (type === 'new_order') {
      // 1. Admin Email
      try {
        const itemsRows = (order.items || [])
          .map(
            (it: any) => `
            <tr>
              <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px;">
                <strong>${escapeHtml(it.name)}</strong>
                <div style="font-size: 11px; font-family: monospace; color: #64748b;">PN: ${escapeHtml(it.part_number || 'N/A')}</div>
              </td>
              <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; text-align: center; font-weight: bold;">${it.quantity}</td>
              <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; text-align: right;">${formatPKR(it.price)}</td>
              <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: bold;">${formatPKR(it.subtotal || it.price * it.quantity)}</td>
            </tr>`
          )
          .join('');

        const adminHtml = `
          <!DOCTYPE html>
          <html>
          <body style="font-family: sans-serif; background-color: #f8fafc; padding: 20px; color: #334155;">
            <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 14px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
              <div style="background: #090d16; padding: 20px 24px; border-bottom: 3px solid #FF6A00; color: #fff;">
                <h2 style="margin: 0; font-size: 20px;">Electric<span style="color:#FF6A00;">Parts</span>Online</h2>
                <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase;">Usman Traders • Admin Alert</div>
              </div>
              <div style="padding: 24px;">
                <div style="background: #fff7ed; border-left: 4px solid #FF6A00; padding: 12px 16px; border-radius: 6px; margin-bottom: 18px;">
                  <strong style="color: #9a3412; font-size: 15px;">🚨 New Order Received: ${formatOrderNum(order.order_number)}</strong>
                  <div style="color: #7c2d12; font-size: 13px; margin-top: 4px;">Total: <strong>${formatPKR(order.total_amount)}</strong> • ${formatPaymentMethod(order.payment_method)}</div>
                </div>
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 18px; font-size: 13px;">
                  <div><strong>Customer:</strong> ${escapeHtml(order.customer_name)}</div>
                  <div style="margin-top: 6px;"><strong>Phone / WhatsApp:</strong> <a href="tel:${escapeHtml(order.customer_phone)}" style="color: #0284c7;">${escapeHtml(order.customer_phone)}</a> • <a href="https://wa.me/${cleanPhoneForWhatsApp(order.customer_phone)}" style="color: #16a34a; font-weight: bold;">WhatsApp Chat ↗</a></div>
                  ${order.customer_email ? `<div style="margin-top: 6px;"><strong>Email:</strong> ${escapeHtml(order.customer_email)}</div>` : ''}
                  <div style="margin-top: 6px;"><strong>Address:</strong> ${escapeHtml(order.shipping_address?.address || '')}, ${escapeHtml(order.shipping_address?.city || 'Pakistan')}</div>
                  ${order.delivery_notes ? `<div style="margin-top: 6px; font-style: italic;"><strong>Notes:</strong> "${escapeHtml(order.delivery_notes)}"</div>` : ''}
                </div>
                <h4 style="margin: 0 0 8px 0; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; color: #64748b;">Ordered Items</h4>
                <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 18px; border: 1px solid #e2e8f0;">
                  <thead>
                    <tr style="background: #f1f5f9; font-size: 11px; text-transform: uppercase;">
                      <th style="padding: 8px 14px; text-align: left;">Item</th>
                      <th style="padding: 8px 14px; text-align: center;">Qty</th>
                      <th style="padding: 8px 14px; text-align: right;">Price</th>
                      <th style="padding: 8px 14px; text-align: right;">Total</th>
                    </tr>
                  </thead>
                  <tbody>${itemsRows}</tbody>
                </table>
                <div style="text-align: right; font-size: 13px; margin-bottom: 24px;">
                  <div>Subtotal: <strong>${formatPKR(order.subtotal)}</strong></div>
                  <div>Shipping: <strong>${formatPKR(order.shipping_fee)}</strong></div>
                  ${order.discount_amount ? `<div style="color: #16a34a;">Discount: <strong>-${formatPKR(order.discount_amount)}</strong></div>` : ''}
                  <div style="font-size: 18px; font-weight: 900; color: #FF6A00; margin-top: 8px; border-top: 2px solid #e2e8f0; padding-top: 8px;">Grand Total: ${formatPKR(order.total_amount)}</div>
                </div>
                <div style="text-align: center;">
                  <a href="https://electricpartsonline.com/admin/orders" style="background: #FF6A00; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: bold; display: inline-block;">Manage Order in Admin Panel ➔</a>
                </div>
              </div>
              <div style="background: #090d16; padding: 14px; text-align: center; font-size: 11px; color: #94a3b8;">
                ElectricPartsOnline.com • Usman Traders
              </div>
            </div>
          </body>
          </html>
        `;

        results.admin = await sendResend(apiKey, {
          from: fromEmail,
          to: [adminEmail],
          reply_to: order.customer_email || undefined,
          subject: `🚨 New Order ${formatOrderNum(order.order_number)} Received - PKR ${Number(order.total_amount || 0).toLocaleString()} - ${order.customer_name}`,
          html: adminHtml,
          text: `New Order ${formatOrderNum(order.order_number)} from ${order.customer_name} (Phone: ${order.customer_phone}, Total: ${formatPKR(order.total_amount)})`,
        });
      } catch (e: any) {
        results.admin = { error: e.message };
      }

      // 2. Customer Email
      if (order.customer_email && order.customer_email.includes('@')) {
        try {
          const customerHtml = `
            <!DOCTYPE html>
            <html>
            <body style="font-family: sans-serif; background-color: #f8fafc; padding: 20px; color: #334155;">
              <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 14px; overflow: hidden; border: 1px solid #e2e8f0;">
                <div style="background: #090d16; padding: 22px 24px; text-align: center; border-bottom: 3px solid #FF6A00; color: #fff;">
                  <h2 style="margin: 0; font-size: 22px;">Electric<span style="color:#FF6A00;">Parts</span>Online</h2>
                  <div style="font-size: 12px; color: #94a3b8;">Usman Traders • Commercial Equipment Parts</div>
                </div>
                <div style="padding: 24px; text-align: center;">
                  <div style="font-size: 40px; color: #059669; margin-bottom: 12px;">✓</div>
                  <h3 style="margin: 0 0 6px 0; font-size: 20px; color: #0f172a;">Thank You for Your Order, ${escapeHtml(order.customer_name)}!</h3>
                  <p style="font-size: 14px; color: #64748b; margin-top: 0;">Your commercial parts order <strong style="color:#0f172a;">${formatOrderNum(order.order_number)}</strong> has been received and is being prepared for dispatch.</p>
                  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 18px; text-align: left; font-size: 13px; margin: 18px 0;">
                    <div><strong>Order Number:</strong> ${formatOrderNum(order.order_number)}</div>
                    <div style="margin-top: 4px;"><strong>Total Amount:</strong> <span style="color: #FF6A00; font-weight: bold;">${formatPKR(order.total_amount)}</span></div>
                    <div style="margin-top: 4px;"><strong>Payment Method:</strong> ${formatPaymentMethod(order.payment_method)}</div>
                    <div style="margin-top: 4px;"><strong>Delivery To:</strong> ${escapeHtml(order.shipping_address?.address || '')}, ${escapeHtml(order.shipping_address?.city || 'Pakistan')}</div>
                  </div>
                  <div style="margin: 24px 0;">
                    <a href="https://electricpartsonline.com/track-order/" style="background: #0f172a; color: #fff; text-decoration: none; padding: 12px 26px; border-radius: 10px; font-weight: bold; display: inline-block;">Track Your Order ➔</a>
                  </div>
                  <p style="font-size: 12px; color: #64748b; margin: 0;">Questions? Helpline WhatsApp: <a href="https://wa.me/923218888872" style="color:#16a34a; font-weight:bold;">0321-8888872</a></p>
                </div>
                <div style="background: #090d16; padding: 14px; text-align: center; font-size: 11px; color: #94a3b8;">
                  ElectricPartsOnline.com • 2026 All Rights Reserved
                </div>
              </div>
            </body>
            </html>
          `;

          results.customer = await sendResend(apiKey, {
            from: fromEmail,
            to: [order.customer_email.trim()],
            reply_to: adminEmail,
            subject: `✅ Order Confirmation ${formatOrderNum(order.order_number)} - ElectricPartsOnline`,
            html: customerHtml,
            text: `Thank you for your order ${formatOrderNum(order.order_number)} on ElectricPartsOnline. Total: ${formatPKR(order.total_amount)}. Track online: https://electricpartsonline.com/track-order/`,
          });
        } catch (e: any) {
          results.customer = { error: e.message };
        }
      }

      return new Response(JSON.stringify({ success: true, results }), {
        status: 200,
        headers: corsHeaders,
      });
    }

    if (type === 'order_status') {
      if (order.customer_email && order.customer_email.includes('@')) {
        const statusTitle = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
        const statusHtml = `
          <!DOCTYPE html>
          <html>
          <body style="font-family: sans-serif; background-color: #f8fafc; padding: 20px; color: #334155;">
            <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 14px; overflow: hidden; border: 1px solid #e2e8f0;">
              <div style="background: #090d16; padding: 20px 24px; text-align: center; border-bottom: 3px solid #FF6A00; color: #fff;">
                <h2 style="margin: 0; font-size: 20px;">Electric<span style="color:#FF6A00;">Parts</span>Online</h2>
              </div>
              <div style="padding: 24px; text-align: center;">
                <span style="background: #e0e7ff; color: #3730a3; padding: 6px 14px; border-radius: 20px; font-weight: bold; font-size: 12px; text-transform: uppercase;">
                  Status: ${statusTitle}
                </span>
                <h3 style="margin: 14px 0 6px 0; font-size: 20px;">Order ${formatOrderNum(order.order_number)} Status Update</h3>
                <p style="font-size: 14px; color: #64748b;">Your order status has been updated to <strong>${statusTitle}</strong>.</p>
                <div style="margin: 20px 0;">
                  <a href="https://electricpartsonline.com/track-order/" style="background: #FF6A00; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: bold; display: inline-block;">Track Live Order ➔</a>
                </div>
              </div>
              <div style="background: #090d16; padding: 12px; text-align: center; font-size: 11px; color: #94a3b8;">
                ElectricPartsOnline.com • Helpline: 0321-8888872
              </div>
            </div>
          </body>
          </html>
        `;

        results.customer = await sendResend(apiKey, {
          from: fromEmail,
          to: [order.customer_email.trim()],
          reply_to: adminEmail,
          subject: `📦 Order ${formatOrderNum(order.order_number)} Status Update: ${statusTitle} - ElectricPartsOnline`,
          html: statusHtml,
          text: `Your order ${formatOrderNum(order.order_number)} status is now: ${statusTitle}. Track online: https://electricpartsonline.com/track-order/`,
        });

        return new Response(JSON.stringify({ success: true, results }), {
          status: 200,
          headers: corsHeaders,
        });
      } else {
        return new Response(JSON.stringify({ success: true, message: 'No email recorded for customer' }), {
          status: 200,
          headers: corsHeaders,
        });
      }
    }

    return new Response(JSON.stringify({ error: 'Unknown email type' }), {
      status: 400,
      headers: corsHeaders,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}
