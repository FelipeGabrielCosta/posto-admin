const express = require('express');
const { authenticate, authorizeMaster } = require('../middleware/auth');
const { createUsuario, getUsuarios } = require('../controllers/usuariosController');

const router = express.Router();

// Protegida - apenas mestre
router.post('/', authenticate, authorizeMaster, createUsuario);
router.get('/', authenticate, authorizeMaster, getUsuarios);

module.exports = router;