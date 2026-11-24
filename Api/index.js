require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;
const conn = require('./db/conn.js');
const cors = require('cors');

// models (precisam ser carregados antes do sync para criar as tabelas)
require('./model/Produto.js');
require('./model/Carrinho.js');
require('./model/ItemCarrinho.js');
require('./model/Venda.js');
require('./model/ItemVenda.js');

app.use(express.json());
app.use(cors({ credentials: true, origin: '*' }));

// imagens dos produtos ficam acessíveis em http://localhost:<porta>/images/<arquivo>
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

const produtoRoutes = require('./router/ProdutoRoutes.js');
const carrinhoRoutes = require('./router/CarrinhoRoutes.js');
const vendaRoutes = require('./router/VendaRoutes.js');

app.use('/produto', produtoRoutes);
app.use('/carrinho', carrinhoRoutes);
app.use('/venda', vendaRoutes);

// erros de upload (tipo de arquivo inválido, tamanho etc.)
app.use((err, req, res, next) => {
    res.status(422).json({ message: err.message });
});

conn
    .sync({ alter: true })
    .then(() => {
        app.listen(port, () => console.log(`API rodando em http://localhost:${port}`));
    })
    .catch((err) => console.log(err));
