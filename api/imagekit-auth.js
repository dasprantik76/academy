// Vercel Serverless Function: /api/imagekit-auth.js
// Issues short-lived ImageKit client-upload signatures after validating the
// academy registration code. IMAGEKIT_PRIVATE_KEY never leaves this function.

import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { getDatabase } from './lib/mongodb.js';

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_FILE_BYTES = 2 * 1024 * 1024;

function setCorsHeaders(req, res) {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');
}

function codesMatch(activeCode, submittedCode) {
  const expected = Buffer.from(String(activeCode || '').trim());
  const supplied = Buffer.from(String(submittedCode || '').trim());
  return expected.length === supplied.length && timingSafeEqual(expected, supplied);
}

async function resolveOwnerEmail(db, queryEmail, querySlug) {
  let email = (queryEmail || '').toLowerCase().trim();
  let slug = (querySlug || '').toLowerCase().trim();

  if (!email && slug && slug.includes('@')) {
    email = slug;
    slug = '';
  }
  if (email && !email.includes('@')) {
    if (!slug) slug = email;
    email = '';
  }

  if (email) {
    if (email === 'digantacomputercentre@gmail.com') return 'rcavirup@gmail.com';
    const profile = await db.collection('profile').findOne(
      { $or: [{ ownerEmail: email }, { coOwnerEmails: email }, { coOwnerEmail: email }] },
      { projection: { _id: 0, ownerEmail: 1 } }
    );
    if (profile && profile.ownerEmail) return profile.ownerEmail;
    return email;
  }

  if (slug === 'prantik' || slug === 'diganta' || slug === 'rcavirup' || slug === 'digantacomputercentre') {
    return 'rcavirup@gmail.com';
  }
  if (slug === 'poulami') {
    return 'poulami.13thmay@gmail.com';
  }

  const profile = await db.collection('profile').findOne(
    { slug },
    { projection: { _id: 0, ownerEmail: 1 } }
  );
  return profile?.ownerEmail || 'rcavirup@gmail.com';
}

async function peekNextStudentId(db, ownerEmail) {
  const profile = await db.collection('profile').findOne(
    { ownerEmail },
    { projection: { studentIdPrefix: 1, slug: 1, academyName: 1 } }
  );

  let prefix = profile?.studentIdPrefix;
  if (!prefix) {
    if (ownerEmail === 'rcavirup@gmail.com' || ownerEmail === 'digantacomputercentre@gmail.com') {
      prefix = 'DCC/SMP/';
    } else if (profile?.slug) {
      prefix = `${profile.slug.toUpperCase().slice(0, 4)}/`;
    } else {
      prefix = 'STU/';
    }
  }
  if (!prefix.endsWith('/')) prefix += '/';

  const defaultStartSeq = (ownerEmail === 'rcavirup@gmail.com' || ownerEmail === 'digantacomputercentre@gmail.com') ? 2009 : 1000;
  const counter = await db.collection('counters').findOne({ _id: `student-id:${ownerEmail}` });
  const currentSeq = counter?.sequence ? Math.max(counter.sequence, defaultStartSeq) : defaultStartSeq;
  const nextSeq = currentSeq + 1;
  return `${prefix}${String(nextSeq).padStart(5, '0')}`;
}

function formatStudentPhotoFileName(studentId, date = new Date()) {
  const safeId = String(studentId || 'STUDENT').replace(/[^a-zA-Z0-9_-]+/g, '_');
  const d = date instanceof Date && !isNaN(date) ? date : new Date(date || Date.now());
  const pad = (n) => String(n).padStart(2, '0');
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const min = pad(d.getMinutes());
  const ss = pad(d.getSeconds());
  return `${safeId}_${yyyy}${mm}${dd}_${hh}${min}${ss}.jpg`;
}

export default async function handler(req, res) {
  setCorsHeaders(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ success: false, error: 'Method not allowed.' });
  }

  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;
  if (!privateKey || !publicKey || !urlEndpoint) {
    return res.status(503).json({
      success: false,
      code: 'IMAGEKIT_NOT_CONFIGURED',
      error: 'Student photo uploads are not configured.'
    });
  }
  if (!process.env.MONGODB_URI) {
    return res.status(503).json({ success: false, error: 'Registration database is not configured.' });
  }

  const isAdmin = Boolean(req.body?.isAdmin);
  const academySlug = String(req.body?.academySlug || req.body?.ownerEmail || '').toLowerCase().trim();
  const authCode = String(req.body?.authCode || '').trim();
  const courseId = String(req.body?.courseId || '').trim();
  const fileType = String(req.body?.fileType || '').toLowerCase().trim();
  const fileSize = Number(req.body?.fileSize);
  if (!academySlug) {
    return res.status(400).json({ success: false, code: 'ACADEMY_REQUIRED', error: 'Academy identifier is required.' });
  }
  if (!ALLOWED_TYPES.has(fileType) || !Number.isFinite(fileSize) || fileSize <= 0 || fileSize > MAX_FILE_BYTES) {
    return res.status(400).json({
      success: false,
      code: 'INVALID_PHOTO',
      error: 'Choose a JPG, JPEG, PNG or WebP passport photo that is 2 MB or smaller.'
    });
  }

  try {
    const db = await getDatabase();
    const ownerEmail = await resolveOwnerEmail(db, req.body?.ownerEmail, req.body?.academySlug || academySlug);
    if (!ownerEmail) {
      return res.status(404).json({ success: false, code: 'ACADEMY_NOT_FOUND', error: 'Academy not found.' });
    }

    if (!isAdmin) {
      const profileDoc = await db.collection('profile').findOne({ ownerEmail }, { projection: { _id: 0, authCodeRequired: 1 } });
      const isAuthCodeRequired = profileDoc?.authCodeRequired !== false;

      if (isAuthCodeRequired && !/^\d{6}$/.test(authCode)) {
        return res.status(400).json({ success: false, code: 'INVALID_CODE', error: 'Authentication code must be exactly 6 digits.' });
      }

      const [activeToken, course] = await Promise.all([
        isAuthCodeRequired ? db.collection('auth_token').findOne({ ownerEmail }, { projection: { _id: 0, code: 1, expiresAt: 1 } }) : null,
        db.collection('courses').findOne({ id: courseId, ownerEmail }, { projection: { _id: 1 } })
      ]);
      if (isAuthCodeRequired) {
        if (!activeToken?.code) {
          return res.status(403).json({ success: false, code: 'NO_ACTIVE_CODE', error: 'No active authentication code is available.' });
        }
        if (!activeToken.expiresAt || Date.now() > Number(activeToken.expiresAt)) {
          return res.status(403).json({ success: false, code: 'EXPIRED_CODE', error: 'The authentication code has expired.' });
        }
        if (!codesMatch(activeToken.code, authCode)) {
          return res.status(403).json({ success: false, code: 'WRONG_CODE', error: 'The authentication code is incorrect.' });
        }
      }
      if (!course) {
        return res.status(400).json({ success: false, code: 'INVALID_COURSE', error: 'The selected course is unavailable.' });
      }
    }

    const studentIdToUse = String(req.body?.studentId || '').trim() || await peekNextStudentId(db, ownerEmail);
    const suggestedFileName = formatStudentPhotoFileName(studentIdToUse, new Date());

    const token = randomUUID();
    const expire = Math.floor(Date.now() / 1000) + 5 * 60;
    const signature = createHmac('sha1', privateKey).update(`${token}${expire}`).digest('hex');
    return res.status(200).json({
      success: true,
      token,
      expire,
      signature,
      publicKey,
      urlEndpoint,
      studentId: studentIdToUse,
      suggestedFileName
    });
  } catch (error) {
    console.error('[ImageKit Auth Error]:', error);
    return res.status(500).json({ success: false, error: 'Could not authorize the photo upload.' });
  }
}
