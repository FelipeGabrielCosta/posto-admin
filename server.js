require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const authRoutes = require('./routes/authRoutes');
const combustivelRoutes = require('./routes/combustivelRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Enhanced configuration logging
console.log('🔄 Iniciando servidor com configuração:');
console.log('🔹 Porta:', PORT);
console.log('🔹 Banco de dados:', 
  process.env.DATABASE_URL?.replace(/\/\/.*?:.*?@/, '//*****:*****@'));

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/combustivel', combustivelRoutes);
app.use('/usuarios', usuariosRoutes);

// Enhanced health check
app.get('/health', async (req, res) => {
  try {
    const dbOk = await db.connect();
    res.status(200).json({ 
      status: 'UP',
      database: dbOk ? 'CONNECTED' : 'DISCONNECTED',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (err) {
    res.status(500).json({ 
      status: 'DOWN',
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Server initialization with better error handling
async function startServer() {
  try {
    const isConnected = await db.connect();
    if (!isConnected) {
      throw new Error('❌ Não foi possível conectar ao banco de dados');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log('📊 Monitoramento disponível em /health');
    });
  } catch (err) {
    console.error('💥 Falha na inicialização:', err.message);
    console.error('🛑 Encerrando processo...');
    process.exit(1);
  }
}

// Start the server
startServer();

// Enhanced error handling
process.on('unhandledRejection', (err) => {
  console.error('⚠️ Erro não tratado:', err);
});

process.on('uncaughtException', (err) => {
  console.error('⚠️ Exceção não capturada:', err);
  process.exit(1);
});