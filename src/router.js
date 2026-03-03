const express = require('express');
const router = express.Router();
const { lerNomes, inserirNome, validarUsuario } = require('./db');

router.get('/ping', (req, res) => {
  res.send('Servidor está de pé! 🏆');
});

router.post('/login', async (req, res) => {
  const { nome, senha } = req.body;
  try {
    const valido = await validarUsuario(nome, senha);
    res.json({ sucesso: valido });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.post('/enviar-nome', async (req, res) => {
  const { nome } = req.body;
  try {
    await inserirNome(nome);
    const total = (await lerNomes()).length;
    res.json({
      mensagem: `Nome "${nome}" salvo no banco!`,
      total,
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.get('/nomes', async (req, res) => {
  try {
    const dados = await lerNomes();
    res.json({ dados });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
