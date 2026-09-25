import { NextResponse } from 'next/server';
import { Order, OrderStatus } from '@/types';
import {
  buildAdminOrderEmailHtml,
  buildAdminOrderEmailText,
  buildCustomerConfirmationEmailHtml,
  buildCustomerConfirmationEmailText,
  buildCustomerStatusUpdateEmailHtml,
  buildCustomerStatusUpdateEmailText,
} from '@/lib/emailTemplates';

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const RESEND_FROM = process.env.RESEND_FROM_EMAIL || 'ElectricPartsOnline <orders@noreply.electricpartsonline.com>';
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || 'usmanmalik9866@gmail.com';

async function sendViaResend(payload: {
  from: string;
  to: string[];
  reply_to?: string;
  subject: string;
  html: string;
  text: string;
}) {
  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY is not defined in environment variables');
    return { skipped: true, reason: 'Missing RESEND_API_KEY' };
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    console.error('Resend API error:', data);
    throw new Error(data.message || 'Resend API call failed');
  }
  return data;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, order, newStatus } = body as {
      type: 'new_order' | 'order_status';
      order: Order;
      newStatus?: OrderStatus;
    };

    if (!order) {
      return NextResponse.json({ error: 'Order details missing' }, { status: 400 });
    }

    const results: { admin?: any; customer?: any } = {};

    if (type === 'new_order') {
      // 1. Send Admin Alert to usmanmalik9866@gmail.com
      try {
        const adminSubject = `🚨 New Order #${order.order_number} Received - PKR ${Number(order.total_amount || 0).toLocaleString()} - ${order.customer_name}`;
        results.admin = await sendViaResend({
          from: RESEND_FROM,
          to: [ADMIN_EMAIL],
          reply_to: order.customer_email || undefined,
          subject: adminSubject,
          html: buildAdminOrderEmailHtml(order),
          text: buildAdminOrderEmailText(order),
        });
      } catch (err: any) {
        console.error('Failed to send admin order email:', err);
        results.admin = { error: err.message };
      }

      // 2. Send Customer Receipt if email provided
      if (order.customer_email && order.customer_email.includes('@')) {
        try {
          const customerSubject = `✅ Order Confirmation #${order.order_number} - ElectricPartsOnline`;
          results.customer = await sendViaResend({
            from: RESEND_FROM,
            to: [order.customer_email.trim()],
            reply_to: ADMIN_EMAIL,
            subject: customerSubject,
            html: buildCustomerConfirmationEmailHtml(order),
            text: buildCustomerConfirmationEmailText(order),
          });
        } catch (err: any) {
          console.error('Failed to send customer confirmation email:', err);
          results.customer = { error: err.message };
        }
      }

      return NextResponse.json({ success: true, results });
    }

    if (type === 'order_status') {
      if (!newStatus) {
        return NextResponse.json({ error: 'New status missing' }, { status: 400 });
      }

      // Send status update to customer
      if (order.customer_email && order.customer_email.includes('@')) {
        const statusSubject = `📦 Order #${order.order_number} Status Update: ${newStatus.toUpperCase()} - ElectricPartsOnline`;
        results.customer = await sendViaResend({
          from: RESEND_FROM,
          to: [order.customer_email.trim()],
          reply_to: ADMIN_EMAIL,
          subject: statusSubject,
          html: buildCustomerStatusUpdateEmailHtml(order, newStatus),
          text: buildCustomerStatusUpdateEmailText(order, newStatus),
        });
        return NextResponse.json({ success: true, results });
      } else {
        return NextResponse.json({ success: true, message: 'Customer has no email recorded, skipped email.' });
      }
    }

    return NextResponse.json({ error: 'Unknown email notification type' }, { status: 400 });
  } catch (error: any) {
    console.error('send-email route handler error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
