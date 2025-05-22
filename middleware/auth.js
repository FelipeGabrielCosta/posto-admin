const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Token inválido.' });
  }
};

const authorizeMaster = (req, res, next) => {
  if (req.user.tipo !== 'mestre') {
    return res.status(403).json({ error: 'Acesso negado. Permissão de mestre requerida.' });
  }
  next();
};

module.exports = {
  authenticate,
  authorizeMaster
};