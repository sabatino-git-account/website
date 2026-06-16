import { app } from '@azure/functions';
import nodemailer from 'nodemailer';
import { verifyRecaptcha } from '../lib/recaptcha.js';
import { getClientIp, isRateLimited } from '../lib/rateLimit.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\(\d{3}\) \d{3}-\d{4}$/;

function getAllowedOrigins() {
  const raw = process.env.ALLOWED_ORIGIN || 'https://www.sabatino-ins.com';
  return raw.split(',').map((origin) => origin.trim()).filter(Boolean);
}

function corsHeaders(request) {
  const origin = request.headers.get('origin');
  const allowed = getAllowedOrigins();

  if (origin && allowed.includes(origin)) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      Vary: 'Origin',
    };
  }

  return {};
}

function jsonResponse(request, status, body) {
  return {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(request),
    },
    body: JSON.stringify(body),
  };
}

function sanitizeHeaderValue(value) {
  return String(value).replace(/[\r\n]/g, ' ').trim().slice(0, 120);
}

function validatePayload(data) {
  if (!data || typeof data !== 'object') {
    return 'Invalid request body.';
  }

  if (data._gotcha) {
    return 'Invalid submission.';
  }

  const name = String(data.name || '').trim();
  const email = String(data.email || '').trim();
  const message = String(data.message || '').trim();
  const company = String(data.company || '').trim();
  const phone = String(data.phone || '').trim();
  const interest = String(data.interest || '').trim();

  if (!name || name.length > 120) return 'Name is required.';
  if (!email || !EMAIL_PATTERN.test(email) || email.length > 254) return 'Valid email is required.';
  if (!message || message.length > 5000) return 'Message is required.';
  if (company.length > 200) return 'Company name is too long.';
  if (phone && !PHONE_PATTERN.test(phone)) return 'Please enter a valid phone number.';
  if (interest.length > 120) return 'Interest value is too long.';
  if (!data.smsConsent) return 'SMS consent is required.';

  return null;
}

function buildEmailBody(data) {
  const lines = [
    'New website inquiry',
    '',
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || 'Not provided'}`,
    `Company: ${data.company || 'Not provided'}`,
    `Interest: ${data.interest || 'Not specified'}`,
    `SMS consent: ${data.smsConsent ? 'Yes' : 'No'}`,
    '',
    'Message:',
    data.message,
  ];

  return lines.join('\n');
}

async function sendEmail(data) {
  const host = process.env.SMTP_HOST || 'mail.smtp2go.com';
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const mailTo = process.env.MAIL_TO || 'info@sabatino-ins.com';
  const mailFrom = process.env.MAIL_FROM || user;

  if (!user || !pass) {
    throw new Error('SMTP credentials are not configured.');
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  const safeName = sanitizeHeaderValue(data.name);
  const safeInterest = sanitizeHeaderValue(data.interest || 'General');
  const subject = `Website inquiry: ${safeInterest} — ${safeName}`;

  await transporter.sendMail({
    from: mailFrom,
    to: mailTo,
    replyTo: data.email,
    subject,
    text: buildEmailBody(data),
  });
}

app.http('contact', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'contact',
  handler: async (request, context) => {
    if (request.method === 'OPTIONS') {
      return {
        status: 204,
        headers: corsHeaders(request),
      };
    }

    try {
      const clientIp = getClientIp(request);
      if (isRateLimited(clientIp)) {
        return jsonResponse(request, 429, {
          error: 'Too many requests. Please wait a few minutes and try again.',
        });
      }

      const data = await request.json();
      const validationError = validatePayload(data);

      if (validationError) {
        return jsonResponse(request, 400, { error: validationError });
      }

      const allowedOrigins = getAllowedOrigins();
      const captchaValid = await verifyRecaptcha(data.captchaToken, allowedOrigins);
      if (!captchaValid) {
        return jsonResponse(request, 400, { error: 'CAPTCHA verification failed. Please try again.' });
      }

      const payload = {
        name: String(data.name).trim(),
        email: String(data.email).trim(),
        phone: String(data.phone || '').trim(),
        company: String(data.company || '').trim(),
        interest: String(data.interest || '').trim(),
        message: String(data.message).trim(),
        smsConsent: Boolean(data.smsConsent),
      };

      await sendEmail(payload);

      return jsonResponse(request, 200, { ok: true });
    } catch (error) {
      context.error('Contact form failed:', error);
      return jsonResponse(request, 500, {
        error: 'Unable to send your message right now. Please call us or email info@sabatino-ins.com.',
      });
    }
  },
});
