const express = require('express');

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

app.use(express.static('public'));

app.get('/', (req, res) => {
    console.log('Requisição recebida na raiz');
});

app.listen(PORT, HOST,() => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});