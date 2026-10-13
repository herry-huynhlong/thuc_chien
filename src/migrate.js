require('dotenv').config();
const fs = require('node:fs/promises');
const path = require('node:path');
const { createPool } = require('./db');
const { configFromEnv } = require('./config');
(async () => {
  const pool = createPool(configFromEnv());
  try {
    const sql = await fs.readFile(path.join(__dirname, '..', 'db', 'schema.sql'), 'utf8');
    await pool.query(sql);
    console.log('Database schema is ready');
  } finally { await pool.end(); }
})().catch(err => { console.error('Migration failed:', err.message); process.exitCode = 1; });
