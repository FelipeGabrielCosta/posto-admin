const express = require('express');
const { authenticate } = require('../middleware/auth');
const { getCombustiveis, updateCombustivel } = require('../controllers/combustivelController');

const router = express.Router();

// Pública
router.get('/', getCombustiveis);

// Protegida
router.put('/:id', authenticate, updateCombustivel);

module.exports = router;