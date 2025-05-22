const bcrypt = require('bcryptjs');
const { pool } = require('../db');

const createUsuario = async (req, res) => {
  const { nome, email, senha, tipo } = req.body;

  try {
    // Verifica se o email já existe
    const emailCheck = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Criptografa a senha
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    // Insere o novo usuário
    const result = await pool.query(
      'INSERT INTO usuarios (nome, email, senha_hash, tipo) VALUES ($1, $2, $3, $4) RETURNING id, nome, email, tipo',
      [nome, email, senhaHash, tipo]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
};

const getUsuarios = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nome, email, tipo FROM usuarios ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
};

module.exports = {
  createUsuario,
  getUsuarios
};