const { Pool } = require('pg');

function createPool(config) {
  if (!config.databaseUrl) throw new Error('DATABASE_URL is required');
  return new Pool({
    connectionString: config.databaseUrl,
    ssl: config.ssl ? { rejectUnauthorized: true } : false,
    max: 10,
    connectionTimeoutMillis: 3000,
    idleTimeoutMillis: 30000
  });
}
module.exports = { createPool };
