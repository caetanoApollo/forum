const express = require('express');
const app = express();
const pool = require('./db'); 
const PORT = process.env.PORT || 3001;
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Bem-vindo à API do Fórum!');
});

app.get('/test-db', async(req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS solution');
    res.json({ message: 'Conexão com DB bem-sucedida!', solution: rows[0].solution });
  } catch(error) {
    console.error('Erro na rota /test-db:', error);
    res.status(500).json({ message: 'Erro ao conectar ao banco de dados', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
});