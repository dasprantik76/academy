const PIN_CODE_PATTERN = /^\d{6}$/;

function setCorsHeaders(req, res) {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800');
}

export default async function handler(req, res) {
  setCorsHeaders(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, OPTIONS');
    return res.status(405).json({ success: false, error: 'Method not allowed.' });
  }

  const pinCode = String(req.query?.pincode || '').trim();
  if (!PIN_CODE_PATTERN.test(pinCode)) {
    return res.status(400).json({ success: false, error: 'A valid six-digit PIN code is required.' });
  }

  try {
    const response = await fetch(`https://api.postalpincode.in/pincode/${pinCode}`, {
      headers: { Accept: 'application/json' }
    });
    if (!response.ok) throw new Error('PIN provider request failed.');
    const payload = await response.json();
    const postOffices = Array.isArray(payload?.[0]?.PostOffice) ? payload[0].PostOffice : [];
    const areas = [...new Set(postOffices.map(item => String(item?.Name || '').trim()).filter(Boolean))];
    if (areas.length === 0) {
      return res.status(404).json({ success: false, error: 'No area was found for this PIN code.' });
    }

    return res.status(200).json({
      success: true,
      pinCode,
      areas,
      district: String(postOffices[0]?.District || '').trim(),
      state: String(postOffices[0]?.State || '').trim()
    });
  } catch (error) {
    console.error('[PIN Code Lookup Error]:', error);
    return res.status(502).json({ success: false, error: 'Area lookup is temporarily unavailable.' });
  }
}
