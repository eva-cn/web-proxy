import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url || !url.startsWith('https://www.chicjeune.com/')) {
    return res.status(400).json({ error: 'Invalid or missing image URL' });
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch image' });
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', response.headers.get('content-type') || 'image/jpeg');
    res.setHeader('Content-Disposition', 'inline');

    response.body.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Proxy error' });
  }
}
