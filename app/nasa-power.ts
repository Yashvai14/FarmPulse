// pages/api/nasa-power.ts
import type { NextApiRequest, NextApiResponse } from 'next';

function formatDateYYYYMMDD(d: Date) {
  const y = d.getUTCFullYear();
  const m = `${d.getUTCMonth() + 1}`.padStart(2, '0');
  const day = `${d.getUTCDate()}`.padStart(2, '0');
  return `${y}${m}${day}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const lat = req.query.lat as string | undefined;
  const lon = req.query.lon as string | undefined;
  if (!lat || !lon) return res.status(400).json({ error: 'Missing lat or lon' });

  try {
    const now = new Date();
    const end = formatDateYYYYMMDD(now);
    const startDate = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000); // last 7 days
    const start = formatDateYYYYMMDD(startDate);

    const params = [
      'SOIL_MOISTURE',
      'T2M', // near-surface air temperature
      'PRECTOT', // precipitation
    ].join(',');

    const url = `https://power.larc.nasa.gov/api/temporal/daily/point?start=${start}&end=${end}&latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}&parameters=${params}&format=JSON`;

    const r = await fetch(url);
    const text = await r.text();
    if (!r.ok) {
      return res.status(502).json({ error: `NASA POWER returned ${r.status}`, body: text.slice(0, 2000) });
    }
    const contentType = r.headers.get('content-type') ?? '';
    if (!contentType.includes('application/json')) {
      return res.status(502).json({ error: 'NASA POWER returned non-JSON body', body: text.slice(0, 2000) });
    }
    const json = JSON.parse(text);
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json(json);
  } catch (err: unknown) {
    console.error('nasa-power proxy error', err);
    return res.status(500).json({ error: String((err as Error)?.message ?? err) });
  }
}
