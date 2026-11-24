const { DataTypes } = require('sequelize');
const db = require('../db/conn.js');
const Venda = require('./Venda.js');
const Produto = require('./Produto.js');

// guarda nome e preço do produto no momento da venda (histórico não muda se o produto for editado)
const ItemVenda = db.define('ItemVenda', {
    nomeProduto: {
        type: DataTypes.STRING,
        allowNull: false
    },
    precoUnitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
});

Venda.hasMany(ItemVenda, { as: 'itens', foreignKey: 'vendaId', onDelete: 'CASCADE' });
ItemVenda.belongsTo(Venda, { foreignKey: 'vendaId' });

Produto.hasMany(ItemVenda, { foreignKey: 'produtoId', onDelete: 'SET NULL' });
ItemVenda.belongsTo(Produto, { as: 'produto', foreignKey: 'produtoId' });

module.exports = ItemVenda;
