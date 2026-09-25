import {
  buildAdminOrderEmailHtml,
  buildAdminOrderEmailText,
  buildCustomerConfirmationEmailHtml,
  buildCustomerConfirmationEmailText,
  buildCustomerStatusUpdateEmailHtml,
  buildCustomerStatusUpdateEmailText,
} from './lib/emailTemplates';

export interface Env {
  ASSETS: { fetch: typeof fetch };
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
  ADMIN_NOTIFICATION_EMAIL?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // 1. API Route: /api/send-email
    if (url.pathname === '/api/send-email' || url.pathname === '/api/send-email/') {
      // CORS Preflight
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        });
      }

      if (request.method === 'POST') {
        try {
          const body: any = await request.json();
          const { type, order, newStatus } = body;
          const apiKey = env.RESEND_API_KEY || '';
          const fromEmail = env.RESEND_FROM_EMAIL || 'ElectricPartsOnline <orders@noreply.electricpartsonline.com>';
          const adminEmail = env.ADMIN_NOTIFICATION_EMAIL || 'usmanmalik9866@gmail.com';

          if (!order) {
            return new Response(JSON.stringify({ error: 'Order details missing' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            });
          }

          if (!apiKey) {
            console.warn('RESEND_API_KEY is not defined in Cloudflare environment');
            return new Response(JSON.stringify({ error: 'RESEND_API_KEY missing in environment variables' }), {
              status: 500,
              headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            });
          }

          const results: any = {};

          if (type === 'new_order') {
            // 1. Admin Email
            const adminSubject = `🚨 New Order #${order.order_number} Received - PKR ${Number(order.total_amount || 0).toLocaleString()} - ${order.customer_name}`;
            const adminRes = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                from: fromEmail,
                to: [adminEmail],
                reply_to: order.customer_email || undefined,
                subject: adminSubject,
                html: buildAdminOrderEmailHtml(order),
                text: buildAdminOrderEmailText(order),
              }),
            });
            results.admin = await adminRes.json();

            // 2. Customer Confirmation Email
            if (order.customer_email && order.customer_email.includes('@')) {
              const custSubject = `✅ Order Confirmation #${order.order_number} - ElectricPartsOnline`;
              const custRes = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${apiKey}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  from: fromEmail,
                  to: [order.customer_email.trim()],
                  reply_to: adminEmail,
                  subject: custSubject,
                  html: buildCustomerConfirmationEmailHtml(order),
                  text: buildCustomerConfirmationEmailText(order),
                }),
              });
              results.customer = await custRes.json();
            }

            return new Response(JSON.stringify({ success: true, results }), {
              status: 200,
              headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            });
          }

          if (type === 'order_status') {
            if (order.customer_email && order.customer_email.includes('@')) {
              const statusTitle = String(newStatus || 'Updated').toUpperCase();
              const statusRes = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${apiKey}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  from: fromEmail,
                  to: [order.customer_email.trim()],
                  reply_to: adminEmail,
                  subject: `📦 Order #${order.order_number} Status Update: ${statusTitle} - ElectricPartsOnline`,
                  html: buildCustomerStatusUpdateEmailHtml(order, newStatus),
                  text: buildCustomerStatusUpdateEmailText(order, newStatus),
                }),
              });
              results.customer = await statusRes.json();
            }

            return new Response(JSON.stringify({ success: true, results }), {
              status: 200,
              headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            });
          }

          return new Response(JSON.stringify({ error: 'Unknown type' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          });
        } catch (e: any) {
          return new Response(JSON.stringify({ error: e.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          });
        }
      }

      return new Response('Method Not Allowed', {
        status: 405,
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    }

    // 2. Delegate all other requests to static assets in ./out
    return env.ASSETS.fetch(request);
  },
};
