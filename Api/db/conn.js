require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME || 'loja',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || 'root',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: process.env.DB_DIALECT || 'mariadb',
        storage: process.env.DB_STORAGE,
        logging: false,
    }
);

sequelize
    .authenticate()
    .then(() => console.log('Conexão com o banco de dados realizada com sucesso!'))
    .catch((err) => console.log('Erro ao conectar com o banco de dados: ' + err));

module.exports = sequelize;
