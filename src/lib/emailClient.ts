import { Order, OrderStatus } from '@/types';

/**
 * Triggers automated email notifications when a new order is placed:
 * 1. Admin Alert to usmanmalik9866@gmail.com
 * 2. Customer Confirmation to order.customer_email (if provided)
 *
 * Runs asynchronously and never blocks or throws errors that interrupt the user.
 */
export async function triggerNewOrderEmails(order: Order): Promise<void> {
  try {
    let res = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'new_order',
        order,
      }),
    });

    if (res.status === 404 || res.status === 405) {
      // Retry with trailing slash in case routing requires it
      res = await fetch('/api/send-email/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'new_order',
          order,
        }),
      });
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.warn('triggerNewOrderEmails response:', res.status, err);
    } else {
      console.log('Order notification emails dispatched successfully for order:', order.order_number);
    }
  } catch (e) {
    console.warn('triggerNewOrderEmails non-fatal error:', e);
  }
}

/**
 * Triggers status update notification email to the customer when
 * admin updates order status in /admin/orders.
 */
export async function triggerOrderStatusEmail(order: Order, newStatus: OrderStatus): Promise<boolean> {
  if (!order || !order.customer_email || !order.customer_email.includes('@')) {
    return false;
  }

  try {
    let res = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'order_status',
        order,
        newStatus,
      }),
    });

    if (res.status === 404 || res.status === 405) {
      res = await fetch('/api/send-email/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'order_status',
          order,
          newStatus,
        }),
      });
    }

    if (res.ok) {
      console.log(`Status update email sent to ${order.customer_email} for order ${order.order_number}`);
      return true;
    }
  } catch (e) {
    console.warn('triggerOrderStatusEmail error:', e);
  }
  return false;
}
