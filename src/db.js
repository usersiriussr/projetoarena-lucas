const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = path.join(__dirname, '..', 'projetoarena.db');

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
      function (err) {
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

module.exports = {
  lerNomes,
  inserirNome,
  validarUsuario,
};
