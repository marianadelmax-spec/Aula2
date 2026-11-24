const { DataTypes } = require('sequelize');
const db = require('../db/conn.js');

const Venda = db.define('Venda', {
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    formaPagamento: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cliente: {
        type: DataTypes.STRING,
        allowNull: true
    },
    carrinhoId: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
});

module.exports = Venda;
