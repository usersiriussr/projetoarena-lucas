const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;
const DB_PATH = path.join(__dirname, 'projetoarena.db');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const db = new sqlite3.Database(DB_PATH);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS nomes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      data TEXT NOT NULL
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      senha TEXT NOT NULL
    )
  `);
  db.run('INSERT OR IGNORE INTO usuarios (nome, senha) VALUES (?, ?)', ['admin', '123456']);
});

async function lerNomes() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM nomes ORDER BY data DESC', (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async function inserirNome(nome) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO nomes (nome, data) VALUES (?, ?)',
      [nome, new Date().toISOString()],
      function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
}

async function validarUsuario(nome, senha) {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM usuarios WHERE nome = ? AND senha = ?',
      [nome, senha],
      (err, row) => {
        if (err) reject(err);
        else resolve(!!row);
      }
    );
  });
}

app.get('/ping', (req, res) => {
  res.send('Servidor está de pé! 🏆');
});

app.post('/login', async (req, res) => {
  const { nome, senha } = req.body;
  try {
    const valido = await validarUsuario(nome, senha);
    res.json({ sucesso: valido });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.post('/enviar-nome', async (req, res) => {
  const { nome } = req.body;
  try {
    await inserirNome(nome);
    res.json({
      mensagem: `Nome "${nome}" salvo no banco!`,
      total: await lerNomes().then(rows => rows.length)
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.get('/nomes', async (req, res) => {
  try {
    const dados = await lerNomes();
    res.json({ dados });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
