const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = 3000;

// 1. LOG DE TODAS AS REQUISIÇÕES (Para debug)
app.use((req, res, next) => {
    console.log(`[Request] ${req.method} ${req.url}`);
    next();
});

// 2. ARQUIVOS ESTÁTICOS (CSS, JS, Imagens)
app.use(express.static('public'));

// 3. PROXY DA API (Tem que vir ANTES da rota coringa)
app.use('/api', createProxyMiddleware({
    target: 'http://192.168.2.6:8000',
    changeOrigin: true,
    pathRewrite: { '^/api': '' },
    onProxyReq: (proxyReq, req, res) => {
        console.log(`[Proxy 🚀] Enviando para Python: ${req.url}`);
    },
    onProxyRes: (proxyRes, req, res) => {
        console.log(`[Proxy ✅] Retorno do Python: ${proxyRes.statusCode}`);
    },
    onError: (err, req, res) => {
        console.error('[Proxy ❌] Erro:', err.message);
        res.status(500).send('Erro Proxy');
    }
}));

// 4. ROTA CORINGA (SPA) - Só roda se nada acima resolveu
// Usamos regex para evitar conflito com Express novo
app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log('Teste o proxy aqui: http://localhost:3000/api/products/');
});