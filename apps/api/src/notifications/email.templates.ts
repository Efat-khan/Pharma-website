export function orderPlacedEmail(data: {
  customerName?: string;
  orderNumber: string;
  items: { productName: string; quantity: number; total: number }[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  paymentMethod: string;
}): { subject: string; html: string } {
  const rows = data.items
    .map(
      (i) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;">${i.productName}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:center;">${i.quantity}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:right;">৳${i.total.toFixed(2)}</td>
      </tr>`,
    )
    .join('');

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:30px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:#00a651;padding:24px 32px;">
            <h1 style="margin:0;color:#ffffff;font-size:24px;">Pharmaci</h1>
            <p style="margin:4px 0 0;color:#d4f5e4;font-size:14px;">আপনার বিশ্বস্ত ফার্মেসি</p>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <h2 style="margin:0 0 8px;color:#1a1a1a;font-size:20px;">অর্ডার নিশ্চিত হয়েছে!</h2>
            <p style="margin:0 0 24px;color:#555;font-size:15px;">
              প্রিয় ${data.customerName || 'গ্রাহক'}, আপনার অর্ডার সফলভাবে গৃহীত হয়েছে।
            </p>

            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;border-radius:6px;margin-bottom:24px;">
              <tr>
                <td style="padding:16px 20px;">
                  <p style="margin:0;font-size:13px;color:#888;">অর্ডার নম্বর</p>
                  <p style="margin:4px 0 0;font-size:18px;font-weight:bold;color:#00a651;">${data.orderNumber}</p>
                </td>
                <td style="padding:16px 20px;text-align:right;">
                  <p style="margin:0;font-size:13px;color:#888;">পেমেন্ট পদ্ধতি</p>
                  <p style="margin:4px 0 0;font-size:15px;font-weight:bold;color:#1a1a1a;">${data.paymentMethod}</p>
                </td>
              </tr>
            </table>

            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8e8e8;border-radius:6px;margin-bottom:24px;">
              <thead>
                <tr style="background:#f5f5f5;">
                  <th style="padding:10px 12px;text-align:left;font-size:13px;color:#555;">পণ্য</th>
                  <th style="padding:10px 12px;text-align:center;font-size:13px;color:#555;">পরিমাণ</th>
                  <th style="padding:10px 12px;text-align:right;font-size:13px;color:#555;">মূল্য</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr>
                <td style="padding:4px 0;color:#555;font-size:14px;">সাবটোটাল</td>
                <td style="padding:4px 0;text-align:right;font-size:14px;color:#1a1a1a;">৳${data.subtotal.toFixed(2)}</td>
              </tr>
              ${data.discount > 0 ? `<tr><td style="padding:4px 0;color:#e53935;font-size:14px;">ছাড়</td><td style="padding:4px 0;text-align:right;font-size:14px;color:#e53935;">-৳${data.discount.toFixed(2)}</td></tr>` : ''}
              <tr>
                <td style="padding:4px 0;color:#555;font-size:14px;">ডেলিভারি চার্জ</td>
                <td style="padding:4px 0;text-align:right;font-size:14px;color:#1a1a1a;">${data.deliveryCharge === 0 ? '<span style="color:#00a651;">বিনামূল্যে</span>' : `৳${data.deliveryCharge.toFixed(2)}`}</td>
              </tr>
              <tr>
                <td style="padding:12px 0 4px;font-weight:bold;font-size:16px;color:#1a1a1a;border-top:2px solid #e8e8e8;">সর্বমোট</td>
                <td style="padding:12px 0 4px;text-align:right;font-weight:bold;font-size:18px;color:#00a651;border-top:2px solid #e8e8e8;">৳${data.total.toFixed(2)}</td>
              </tr>
            </table>

            <p style="margin:0;font-size:13px;color:#888;text-align:center;">
              আমাদের সাথে থাকার জন্য ধন্যবাদ। যেকোনো সমস্যায় আমাদের সাথে যোগাযোগ করুন।
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#f5f5f5;padding:16px 32px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#aaa;">© ${new Date().getFullYear()} Pharmaci. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return { subject: `অর্ডার নিশ্চিত: ${data.orderNumber}`, html };
}

export function lowStockAlertEmail(data: {
  productName: string;
  sku: string;
  stock: number;
}): { subject: string; html: string } {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:30px 0;">
    <tr><td align="center">
      <table width="500" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:#e53935;padding:20px 28px;">
            <h1 style="margin:0;color:#ffffff;font-size:20px;">⚠ Low Stock Alert — Pharmaci</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:28px;">
            <p style="margin:0 0 20px;color:#333;font-size:15px;">
              The following product is running low on stock and needs restocking:
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff8f8;border:1px solid #ffcdd2;border-radius:6px;">
              <tr>
                <td style="padding:16px 20px;">
                  <p style="margin:0 0 6px;font-size:13px;color:#888;">Product Name</p>
                  <p style="margin:0 0 14px;font-size:17px;font-weight:bold;color:#1a1a1a;">${data.productName}</p>
                  <p style="margin:0 0 4px;font-size:13px;color:#888;">SKU: <strong style="color:#1a1a1a;">${data.sku}</strong></p>
                  <p style="margin:0;font-size:13px;color:#888;">Stock Remaining: <strong style="color:#e53935;font-size:16px;">${data.stock}</strong> units</p>
                </td>
              </tr>
            </table>
            <p style="margin:20px 0 0;font-size:13px;color:#888;">
              Please restock this product as soon as possible to avoid stockouts.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return {
    subject: `[Low Stock] ${data.productName} — only ${data.stock} left`,
    html,
  };
}
