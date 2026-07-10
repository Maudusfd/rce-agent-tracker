import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'POST') return res.status(405).end();

  const { key, value } = req.body || {};
  if (!['agents', 'users', 'history'].includes(key)) {
    return res.status(400).json({ error: 'Invalid key' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    const v = JSON.stringify(value);
    await sql`
      INSERT INTO store (key, value)
      VALUES (${key}, ${v}::jsonb)
      ON CONFLICT (key)
      DO UPDATE SET value = ${v}::jsonb, updated_at = NOW()
    `;
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
