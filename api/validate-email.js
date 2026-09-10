import { resolve4, resolve6, resolveMx } from 'node:dns/promises';

const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@([A-Z0-9-]+(?:\.[A-Z0-9-]+)*)\.([A-Z]{2,63})$/i;

function setCorsHeaders(req, res) {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
}

async function domainAcceptsEmail(domain) {
  try {
    const records = await resolveMx(domain);
    if (records.length > 0) return true;
  } catch {}

  try {
    const records = await resolve4(domain);
    if (records.length > 0) return true;
  } catch {}

  try {
    const records = await resolve6(domain);
    return records.length > 0;
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  setCorsHeaders(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, OPTIONS');
    return res.status(405).json({ valid: false, error: 'Method not allowed.' });
  }

  const email = String(req.query?.email || '').trim().toLowerCase();
  const match = email.length <= 254 && email.match(EMAIL_PATTERN);
  if (!match) {
    return res.status(400).json({ valid: false, error: 'Enter a valid email address, for example name@example.com.' });
  }

  const domain = match[1] + '.' + match[2];
  const valid = await domainAcceptsEmail(domain);
  if (!valid) {
    return res.status(422).json({ valid: false, error: 'This email domain does not appear to accept email.' });
  }
  return res.status(200).json({ valid: true });
}
