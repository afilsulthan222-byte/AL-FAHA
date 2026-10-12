import { Order, EmailNotification } from '@/types';
import { db } from './db';

export function generateOrderConfirmationEmail(order: Order): string {
  const itemsHtml = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 16px; border-bottom: 1px solid #2A2518; color: #FDFBF7;">
        <strong style="color: #D4AF37; font-family: 'Cinzel', serif;">${item.productName}</strong><br/>
        <span style="font-size: 13px; color: #B3A894;">Size: ${item.size} | Color: ${item.color} | Qty: ${item.quantity}</span>
      </td>
      <td style="padding: 16px; border-bottom: 1px solid #2A2518; text-align: right; color: #D4AF37; font-weight: bold;">
        ₹${item.total.toLocaleString('en-IN')}
      </td>
    </tr>
  `
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>AL FAHA Royal Order Confirmation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0A0A0A; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #EAE4D9;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0A0A0A; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #121212; border: 1px solid #332B1A; border-radius: 8px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.8);">
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 40px 30px 20px 30px; background: linear-gradient(180deg, #1C1914 0%, #121212 100%); border-bottom: 1px solid #332B1A;">
              <div style="color: #D4AF37; font-size: 28px; letter-spacing: 6px; font-weight: bold; text-transform: uppercase;">AL FAHA</div>
              <div style="color: #A69265; font-size: 12px; letter-spacing: 4px; margin-top: 4px;">HAUTE COUTURE ARABIA</div>
            </td>
          </tr>

          <!-- Welcome message -->
          <tr>
            <td style="padding: 35px 35px 15px 35px;">
              <h2 style="color: #FDFBF7; font-size: 22px; margin-top: 0; font-weight: normal; letter-spacing: 1px;">
                Honored Patron <span style="color: #D4AF37;">${order.customerName}</span>,
              </h2>
              <p style="color: #B5AD9F; line-height: 1.7; font-size: 15px;">
                We are privileged to confirm receipt of your bespoke couture acquisition. Your order has been registered under reference <strong style="color: #D4AF37;">${order.orderNumber}</strong>.
              </p>
              <div style="background-color: #191612; border-left: 3px solid #D4AF37; padding: 14px 18px; margin: 20px 0; font-size: 14px; color: #D5C8B2;">
                <strong>Payment Method:</strong> ${order.paymentMethod === 'cod' ? 'Cash / UPI on Royal Delivery' : 'Verified via Razorpay Secured'}<br/>
                <strong>Status:</strong> ${order.paymentStatus === 'paid' ? 'Payment Verified' : 'Awaiting Doorstep Settlement'}<br/>
                <strong>Estimated Delivery:</strong> ${order.estimatedDelivery || '3-5 Business Days with White Glove Courier'}
              </div>
            </td>
          </tr>

          <!-- Items Table -->
          <tr>
            <td style="padding: 10px 35px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                <thead>
                  <tr style="border-bottom: 2px solid #38301E;">
                    <th align="left" style="padding: 10px 16px; color: #8A7B5E; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">Atelier Pieces</th>
                    <th align="right" style="padding: 10px 16px; color: #8A7B5E; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
                <tfoot>
                  <tr>
                    <td style="padding: 12px 16px 4px 16px; text-align: right; color: #A69265; font-size: 14px;">Subtotal:</td>
                    <td style="padding: 12px 16px 4px 16px; text-align: right; color: #EAE4D9; font-size: 14px;">₹${order.subtotal.toLocaleString('en-IN')}</td>
                  </tr>
                  ${order.discount > 0 ? `
                  <tr>
                    <td style="padding: 4px 16px; text-align: right; color: #4ADE80; font-size: 14px;">Royal Privilege Discount:</td>
                    <td style="padding: 4px 16px; text-align: right; color: #4ADE80; font-size: 14px;">-₹${order.discount.toLocaleString('en-IN')}</td>
                  </tr>` : ''}
                  <tr>
                    <td style="padding: 4px 16px; text-align: right; color: #A69265; font-size: 14px;">White Glove Shipping:</td>
                    <td style="padding: 4px 16px; text-align: right; color: #EAE4D9; font-size: 14px;">${order.shippingFee === 0 ? 'COMPLIMENTARY' : `₹${order.shippingFee}`}</td>
                  </tr>
                  <tr>
                    <td style="padding: 16px 16px; text-align: right; color: #D4AF37; font-size: 18px; font-weight: bold; border-top: 1px solid #38301E;">Grand Total:</td>
                    <td style="padding: 16px 16px; text-align: right; color: #D4AF37; font-size: 20px; font-weight: bold; border-top: 1px solid #38301E;">₹${order.total.toLocaleString('en-IN')}</td>
                  </tr>
                </tfoot>
              </table>
            </td>
          </tr>

          <!-- Shipping Destination -->
          <tr>
            <td style="padding: 20px 35px 35px 35px;">
              <h4 style="color: #D4AF37; font-size: 14px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px;">Delivery Residence</h4>
              <p style="color: #A69E8F; font-size: 14px; line-height: 1.6; margin: 0;">
                ${order.shippingAddress.fullName}<br/>
                ${order.shippingAddress.addressLine1}${order.shippingAddress.addressLine2 ? ', ' + order.shippingAddress.addressLine2 : ''}<br/>
                ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}<br/>
                Contact: ${order.shippingAddress.phone}
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 30px; background-color: #0E0D0B; border-top: 1px solid #292316; color: #736956; font-size: 12px; line-height: 1.6;">
              AL FAHA Atelier &bull; Dubai &bull; Mumbai &bull; London<br/>
              Concierge: concierge@alfaha.com | +91 90000 11111<br/>
              &copy; 2026 AL FAHA Couture. All Royal Rights Reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export function generateOrderDispatchedEmail(order: Order): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>AL FAHA: Order Dispatched</title></head>
<body style="margin: 0; padding: 0; background-color: #0A0A0A; font-family: sans-serif; color: #EAE4D9;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding: 40px 10px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #121212; border: 1px solid #332B1A; border-radius: 8px; padding: 30px;">
          <tr>
            <td align="center">
              <h1 style="color: #D4AF37; letter-spacing: 4px; margin: 0;">AL FAHA</h1>
              <p style="color: #A69265; font-size: 12px; letter-spacing: 3px;">ROYAL DISPATCH ALERT</p>
              <div style="height: 1px; background-color: #38301E; margin: 20px 0;"></div>
              <h3 style="color: #FDFBF7;">Your Couture Creation is En Route</h3>
              <p style="color: #B5AD9F; line-height: 1.6; font-size: 15px;">
                Dear ${order.customerName}, your garments for order <strong style="color: #D4AF37;">${order.orderNumber}</strong> have passed final atelier quality inspection and have been released to our white glove royal courier.
              </p>
              <div style="background-color: #181510; border: 1px solid #38301E; border-radius: 6px; padding: 20px; margin: 24px 0; text-align: left;">
                <p style="margin: 0 0 8px 0; color: #8A7B5E; font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase;">Carrier</p>
                <p style="margin: 0 0 16px 0; color: #FDFBF7; font-size: 16px; font-weight: bold;">${order.courierName || 'Royal Express Courier'}</p>
                <p style="margin: 0 0 8px 0; color: #8A7B5E; font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase;">Consignment Tracking Number</p>
                <p style="margin: 0; color: #D4AF37; font-size: 18px; font-weight: bold; letter-spacing: 1px;">${order.trackingNumber || 'ROYAL-EXPRESS-9921'}</p>
              </div>
              <p style="color: #736956; font-size: 13px;">
                Track your package anytime at: <a href="http://localhost:3000/track" style="color: #D4AF37; text-decoration: underline;">alfaha.com/track</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export function sendOrderEmail(order: Order, type: 'order_confirmed' | 'order_dispatched'): EmailNotification {
  const isConfirmed = type === 'order_confirmed';
  const subject = isConfirmed 
    ? `AL FAHA &bull; Order Confirmed #${order.orderNumber}`
    : `AL FAHA &bull; Order Dispatched #${order.orderNumber} (Tracking: ${order.trackingNumber || 'Available'})`;

  const html = isConfirmed 
    ? generateOrderConfirmationEmail(order) 
    : generateOrderDispatchedEmail(order);

  const notification = db.addEmailNotification({
    recipientEmail: order.customerEmail,
    recipientName: order.customerName,
    subject,
    type,
    orderNumber: order.orderNumber,
    htmlPreview: html
  });

  return notification;
}
