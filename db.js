const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000
});

// Unified connection function that server.js expects
async function connect() {
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

// Test connection immediately when module loads
connect().then(isConnected => {
  if (!isConnected) {
    console.error('Falha na conexão inicial com o banco de dados');
    // Don't exit here - let server.js handle it
  }
});

module.exports = {
  pool,
  connect,  // The function that server.js expects
  testConnection: connect  // Alias if you need it elsewhere
};