// pages/api/soil-proxy.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const lat = req.query.lat as string | undefined;
  const lon = req.query.lon as string | undefined;
  if (!lat || !lon) return res.status(400).json({ error: 'Missing lat or lon' });

  // SoilGrids (correct base) — we request properties and depths
  // Note: Some SoilGrids installations use rest.soilgrids.org ; ISRIC sometimes provides multiple domains.
  const url = `https://rest.soilgrids.org/soilgrids/v2.0/properties/query?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&property=clay&property=sand&property=silt&property=soc&property=phh2o&depth=0-5cm&depth=5-15cm&depth=15-30cm&value=mean`;

  try {
    const r = await fetch(url, { headers: { Accept: 'application/json' } });
    const text = await r.text();

    // If response is not JSON, surface the HTML/text for debugging
    const contentType = r.headers.get('content-type') ?? '';
    if (!r.ok) {
      return res.status(502).json({ error: `SoilGrids returned status ${r.status}`, body: text.slice(0, 2000) });
    }
    if (!contentType.includes('application/json')) {
      return res.status(502).json({ error: 'SoilGrids returned non-JSON body', body: text.slice(0, 2000) });
    }

    const json = JSON.parse(text);
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json(json);
  } catch (err) {
    console.error('soil-proxy error', err);
    return res.status(500).json({ error: String((err as Error)?.message ?? err) });
  }
}
