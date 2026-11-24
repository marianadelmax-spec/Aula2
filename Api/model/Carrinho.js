const { DataTypes } = require('sequelize');
const db = require('../db/conn.js');

const Carrinho = db.define('Carrinho', {
    status: {
        type: DataTypes.STRING, // 'aberto' ou 'finalizado'
        allowNull: false,
        defaultValue: 'aberto'
    }
});

module.exports = Carrinho;
