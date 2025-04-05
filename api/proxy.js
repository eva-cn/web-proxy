import fetch from 'node-fetch';
import https from 'https';

const agent = new https.Agent({
  rejectUnauthorized: false, // ⚠️ Ne jamais utiliser en production !
});

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url || !url.startsWith('https://www.chicjeune.com/')) {
    return res.status(400).json({ error: 'Invalid or missing image URL' });
  }

  try {
    const response = await fetch(url, { agent });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch image' });
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = Buffer.from(await response.arrayBuffer());

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', buffer.length);
    res.setHeader('Content-Disposition', 'inline');

    res.status(200).send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Proxy error' });
  }
}
