/**
 * emailUtils.js — EmberGas Brevo Email Service
 * Uses Brevo REST API v3 for OTP and transactional emails.
 * Env vars: BREVO_API_KEY, BREVO_FROM_EMAIL, BREVO_FROM_NAME, APP_URL
 * 
 * Brevo REST API delivers directly to any inbox without
 * requiring SMTP sender domain verification.
 */

// ─── Brevo REST API v3 sender helper ─────────────────────────────────────────
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

// ─── Dynamic Base URL Resolver ───────────────────────────────────────────────
export const getBaseUrl = (customUrl) => {
  if (customUrl && typeof customUrl === 'string' && customUrl.startsWith('http')) {
    if (!customUrl.includes('localhost') && !customUrl.includes('127.0.0.1')) {
      return customUrl.replace(/\/+$/, '');
    }
  }
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/+$/, '');
  if (process.env.FRONTEND_URL) return process.env.FRONTEND_URL.replace(/\/+$/, '');
  if (process.env.CLIENT_URL) return process.env.CLIENT_URL.replace(/\/+$/, '');
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/\/+$/, '')}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL.replace(/\/+$/, '')}`;
  return 'https://ember-gas.vercel.app';
};

// ─── 1. OTP Verification Email (via Brevo REST API v3) ───────────────────────
export const sendOtpEmail = async (email, name, otpCode) => {
  const year = new Date().getFullYear();

  const payload = {
    sender: {
      name: process.env.BREVO_FROM_NAME || 'EmberGas',
      email: process.env.BREVO_FROM_EMAIL || 'davince625@gmail.com',
    },
    to: [{ email, name: name || 'Valued Customer' }],
    subject: `${otpCode} — Your EmberGas Verification Code`,
    textContent: `Hello ${name}, your 6-digit EmberGas verification code is: ${otpCode}. It expires in 10 minutes.`,
    htmlContent: `
      <div style="font-family:Arial,sans-serif;background:#0D1117;padding:40px 0;">
        <div style="max-width:520px;margin:0 auto;background:#161B22;border-radius:20px;padding:32px;border:1px solid #30363D;">
          <h1 style="margin:0 0 4px;font-size:22px;font-weight:800;color:#fff;">🔥 <span style="color:#10B981;">EmberGas</span></h1>
          <p style="margin:0 0 28px;font-size:12px;color:#8B949E;">Your trusted LPG delivery platform</p>
          <h2 style="color:#F0F6FC;font-size:18px;margin:0 0 12px;">Verify Your Account</h2>
          <p style="font-size:14px;color:#8B949E;line-height:1.6;margin:0 0 24px;">
            Hello <strong style="color:#F0F6FC;">${name}</strong>, use the code below to verify your EmberGas account.
            Valid for <strong style="color:#10B981;">10 minutes</strong>.
          </p>
          <div style="background:#0D1117;border:2px dashed #059669;border-radius:14px;padding:20px;text-align:center;margin-bottom:24px;">
            <span style="font-size:38px;font-weight:900;letter-spacing:10px;color:#10B981;font-family:'Courier New',monospace;">${otpCode}</span>
          </div>
          <p style="font-size:11px;color:#6E7681;margin:0;">If you didn't request this, you can safely ignore this email.</p>
          <hr style="border:none;border-top:1px solid #30363D;margin:24px 0;">
          <p style="font-size:11px;color:#6E7681;margin:0;">© ${year} EmberGas Nigeria Ltd. All rights reserved.</p>
        </div>
      </div>
    `
  };

  const response = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errBody = await response.json();
    throw new Error(`Brevo API error ${response.status}: ${JSON.stringify(errBody)}`);
  }

  const result = await response.json();
  console.log(`[BREVO] OTP email delivered to ${email} — messageId: ${result.messageId}`);
  return result;
};

// ─── 2. Order Confirmation Email (via Brevo REST API v3) ──────────────────────
export const sendOrderConfirmationEmail = async (email, order, customOrigin) => {
  const year = new Date().getFullYear();
  const baseUrl = getBaseUrl(customOrigin);
  const trackUrl = `${baseUrl}/track.html`;

  const payload = {
    sender: {
      name: process.env.BREVO_FROM_NAME || 'EmberGas',
      email: process.env.BREVO_FROM_EMAIL || 'davince625@gmail.com',
    },
    to: [{ email, name: order.customerName || 'Valued Customer' }],
    subject: `Order Confirmed: ${order.orderNumber} — EmberGas`,
    textContent: `Your order ${order.orderNumber} for ${order.cylinderSize} has been confirmed by ${order.sellerName}. Total: NGN ${order.totalAmount}.`,
    htmlContent: `
      <div style="font-family:Arial,sans-serif;background:#0D1117;padding:40px 0;">
        <div style="max-width:520px;margin:0 auto;background:#161B22;border-radius:20px;padding:32px;border:1px solid #30363D;">
          <h1 style="margin:0 0 4px;font-size:22px;font-weight:800;color:#fff;">🔥 <span style="color:#10B981;">EmberGas</span></h1>
          <p style="margin:0 0 28px;font-size:12px;color:#8B949E;">Order Confirmation</p>
          <h2 style="color:#10B981;font-size:18px;margin:0 0 8px;">Your order is confirmed!</h2>
          <p style="color:#8B949E;font-size:14px;margin:0 0 20px;">
            Order <strong style="color:#F0F6FC;">${order.orderNumber}</strong> has been received and is being prepared.
          </p>
          <div style="background:#0D1117;border-radius:12px;padding:18px;margin-bottom:20px;border:1px solid #30363D;">
            <table style="width:100%;border-collapse:collapse;font-size:14px;color:#C9D1D9;">
              <tr><td style="padding:6px 0;color:#8B949E;">Vendor</td><td style="text-align:right;font-weight:700;color:#F0F6FC;">${order.sellerName || 'EmberGas Partner'}</td></tr>
              <tr><td style="padding:6px 0;color:#8B949E;">Cylinder</td><td style="text-align:right;font-weight:700;color:#F0F6FC;">${order.cylinderSize} x ${order.quantity || 1}</td></tr>
              <tr><td style="padding:6px 0;color:#8B949E;">Address</td><td style="text-align:right;font-weight:700;color:#F0F6FC;">${order.deliveryAddress || 'N/A'}</td></tr>
              <tr><td style="padding:6px 0;color:#8B949E;">ETA</td><td style="text-align:right;font-weight:700;color:#10B981;">30 - 45 mins</td></tr>
              <tr style="border-top:1px solid #30363D;">
                <td style="padding:10px 0 4px;font-size:16px;font-weight:800;color:#fff;">Total Paid</td>
                <td style="text-align:right;font-size:16px;font-weight:900;color:#10B981;">NGN ${Number(order.totalAmount || 0).toLocaleString()}</td>
              </tr>
            </table>
          </div>
          <div style="text-align:center;margin:20px 0;">
            <a href="${trackUrl}" style="display:inline-block;background:#10B981;color:#fff;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:800;font-size:14px;">
              Track Order Live →
            </a>
          </div>
          <hr style="border:none;border-top:1px solid #30363D;margin:24px 0;">
          <p style="font-size:11px;color:#6E7681;margin:0;text-align:center;">© ${year} EmberGas Nigeria Ltd. • Nigeria's #1 LPG Marketplace</p>
        </div>
      </div>
    `
  };

  try {
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return response.ok;
  } catch (err) {
    console.error('Order Confirmation Email Error:', err.message);
    return false;
  }
};

// ─── 3. Universal Brevo Transactional Email Helper ────────────────────────────
export const sendNotificationEmail = async (toEmail, toName, subject, title, bodyContentHtml, customActionUrl, customActionLabel) => {
  const year = new Date().getFullYear();
  const baseUrl = getBaseUrl(customActionUrl);

  const targetUrl = (customActionUrl && typeof customActionUrl === 'string' && customActionUrl.startsWith('http') && !customActionUrl.includes('localhost') && !customActionUrl.includes('127.0.0.1'))
    ? customActionUrl
    : `${baseUrl}/dashboard.html`;

  const buttonText = customActionLabel || 'Open EmberGas Dashboard →';

  const payload = {
    sender: {
      name: process.env.BREVO_FROM_NAME || 'EmberGas Marketplace',
      email: process.env.BREVO_FROM_EMAIL || 'davince625@gmail.com',
    },
    to: [{ email: toEmail, name: toName || 'EmberGas User' }],
    subject: subject,
    textContent: `${title}: Check your EmberGas portal for full details at ${targetUrl}`,
    htmlContent: `
      <div style="font-family:'Segoe UI',Helvetica,Arial,sans-serif;background:#0D1117;padding:40px 15px;color:#C9D1D9;">
        <div style="max-width:560px;margin:0 auto;background:#161B22;border-radius:20px;padding:32px;border:1px solid #30363D;box-shadow:0 10px 30px rgba(0,0,0,0.5);">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;border-bottom:1px solid #30363D;padding-bottom:16px;">
            <h1 style="margin:0;font-size:22px;font-weight:900;color:#fff;">🔥 <span style="color:#10B981;">EmberGas</span></h1>
            <span style="background:rgba(16,185,129,0.15);color:#10B981;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:800;letter-spacing:0.5px;">LIVE NOTIFICATION</span>
          </div>
          
          <h2 style="color:#F0F6FC;font-size:19px;margin:0 0 12px;font-weight:800;">${title}</h2>
          
          <div style="font-size:14px;color:#8B949E;line-height:1.6;margin-bottom:24px;">
            ${bodyContentHtml}
          </div>

          <div style="background:#0D1117;border-radius:14px;padding:18px;border:1px solid #30363D;margin-bottom:24px;text-align:center;">
            <p style="font-size:12px;color:#8B949E;margin:0 0 12px;font-weight:700;">QUICK ACTIONS</p>
            <a href="${targetUrl}" style="display:inline-block;background:#10B981;color:#fff;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:800;font-size:14px;box-shadow:0 4px 14px rgba(16,185,129,0.35);">
              ${buttonText}
            </a>
          </div>

          <hr style="border:none;border-top:1px solid #30363D;margin:24px 0;">
          <p style="font-size:11px;color:#6E7681;margin:0;text-align:center;">© ${year} EmberGas Nigeria Ltd. • Nigeria's #1 LPG Marketplace</p>
        </div>
      </div>
    `
  };

  try {
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errBody = await response.json();
      console.error(`Brevo Notification Email Error ${response.status}:`, errBody);
      return false;
    }

    const result = await response.json();
    console.log(`[BREVO EMAIL SENT] To: ${toEmail} | Subject: "${subject}" | MessageId: ${result.messageId} | Link: ${targetUrl}`);
    return result;
  } catch (err) {
    console.error('Failed to send Brevo notification email:', err.message);
    return false;
  }
};

