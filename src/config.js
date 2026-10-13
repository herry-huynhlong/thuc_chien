function configFromEnv(env = process.env) {
  const port = Number(env.PORT || 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be between 1 and 65535');
  }
  return {
    port,
    databaseUrl: env.DATABASE_URL,
    ssl: env.DB_SSL === 'true',
    nodeEnv: env.NODE_ENV || 'development'
  };
}
module.exports = { configFromEnv };
