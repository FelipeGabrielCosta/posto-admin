const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Adicione esta função para testar a conexão
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('Conexão com PostgreSQL estabelecida com sucesso!');
    client.release();
    return true;
  } catch (err) {
    console.error('Erro ao conectar ao PostgreSQL:', err);
    return false;
  }
};

module.exports = {
  pool,
  connect: testConnection
};