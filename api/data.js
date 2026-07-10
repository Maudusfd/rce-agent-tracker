import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).end();
  try {
    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql`SELECT key, value FROM store WHERE key IN ('agents','users','history')`;
    const result = {};
    rows.forEach(r => { result[r.key] = r.value; });
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
