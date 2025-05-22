const { pool } = require('../db');

const getCombustiveis = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM combustiveis ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar combustíveis' });
  }
};

const updateCombustivel = async (req, res) => {
  const { id } = req.params;
  const { preco, tempo_exibicao } = req.body;

  try {
    const result = await pool.query(
      'UPDATE combustiveis SET preco = $1, tempo_exibicao = $2 WHERE id = $3 RETURNING *',
      [preco, tempo_exibicao, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Combustível não encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar combustível' });
  }
};

module.exports = {
  getCombustiveis,
  updateCombustivel
};