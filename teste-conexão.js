// teste-conexao.js
const API_URL = 'http://192.168.2.6:8000/products/';

console.log("---------------------------------------------------");
console.log(`📡 TENTANDO CONECTAR EM: ${API_URL}`);
console.log("---------------------------------------------------");

fetch(API_URL)
    .then(res => {
        console.log(`✅ CONEXÃO BEM SUCEDIDA!`);
        console.log(`Status: ${res.status}`);
        return res.json();
    })
    .then(data => {
        console.log(`📦 DADOS RECEBIDOS:`);
        if(data.products) {
            console.log(`   -> Total de produtos: ${data.products.length}`);
            console.log(`   -> Primeiro produto: ${data.products[0].basename}`);
        } else {
            console.log(data);
        }
    })
    .catch(err => {
        console.log(`❌ FALHA NA CONEXÃO:`);
        console.log(`   -> Erro: ${err.cause ? err.cause.code : err.message}`);
        
        if (err.cause && err.cause.code === 'ETIMEDOUT') {
            console.log("\n⚠️ DIAGNÓSTICO: O Node não conseguiu chegar no IP.");
            console.log("   -> Verifique se o Firewall do Windows na máquina Python está bloqueando a porta 8000.");
            console.log("   -> Verifique se o IP 192.168.2.6 ainda é o mesmo.");
        }
        if (err.cause && err.cause.code === 'ECONNREFUSED') {
            console.log("\n⚠️ DIAGNÓSTICO: O IP existe, mas nada está rodando na porta 8000.");
            console.log("   -> Verifique se o script Python está rodando.");
        }
    });