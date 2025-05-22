require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const authRoutes = require('./routes/authRoutes');
const combustivelRoutes = require('./routes/combustivelRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Log de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rotas
app.use('/auth', authRoutes);
app.use('/combustivel', combustivelRoutes);
app.use('/usuarios', usuariosRoutes);

// Health check endpoint melhorado
app.get('/health', async (req, res) => {
  try {
    const dbOk = await db.connect();
    res.status(200).json({ 
      status: 'UP',
      database: dbOk ? 'CONNECTED' : 'DISCONNECTED',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ 
      status: 'DOWN',
      error: err.message 
    });
  }
});

// Conexão com o banco e inicialização do servidor
db.connect()
  .then((isConnected) => {
    if (!isConnected) {
      throw new Error('Não foi possível conectar ao banco de dados');
    }
    
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
      console.log(`Banco de dados: ${process.env.DATABASE_URL.split('@')[1]}`);
    });
  })
  .catch(err => {
    console.error('Falha na inicialização:', err);
    process.exit(1);
  });