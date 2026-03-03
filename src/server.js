const express = require('express');
const path = require('path');
const router = require('./router');

const app = express();

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());

app.use('/', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
