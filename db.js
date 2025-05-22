const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 5000, // 5 segundos de timeout
  idleTimeoutMillis: 30000
});

// Função de teste de conexão melhorada
async function testConnection() {
  let client;
  try {
    client = await pool.connect();
    const res = await client.query('SELECT NOW()');
    console.log('✅ Conexão com PostgreSQL bem-sucedida:', res.rows[0]);
    return true;
  } catch (err) {
    console.error('❌ Falha na conexão com PostgreSQL:', err.message);
    console.log('🔗 String de conexão:', 
      process.env.DATABASE_URL?.replace(/\/\/.*?:.*?@/, '//*****:*****@'));
    return false;
  } finally {
    if (client) client.release();
  }
}

// Testa a conexão imediatamente
testConnection().then(isConnected => {
  if (!isConnected) process.exit(1);
});

module.exports = {
  pool,
  testConnection
};