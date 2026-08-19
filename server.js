import express from 'express';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dataHandler from './api/data.js';
import saveHandler from './api/save.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());

app.get('/api/data', async (req, res) => {
  try {
    await dataHandler(req, res);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/save', async (req, res) => {
  try {
    await saveHandler(req, res);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('*', (req, res) => {
  res.send(readFileSync(join(__dirname, 'dashboard.html'), 'utf8'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
