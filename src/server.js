require('dotenv').config();
const { configFromEnv } = require('./config');
const { createPool } = require('./db');
const { createApp } = require('./app');

const config = configFromEnv();
const pool = createPool(config);
const server = createApp(pool).listen(config.port, '0.0.0.0', () => {
  console.log(`Saigon Bistro listening on port ${config.port}`);
});
async function shutdown() {
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
