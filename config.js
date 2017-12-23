const DB_NAME = 'pocketbilldb';
const DB_USER = 'pocketbill';
const DB_PASS = 'qwerty';
const DB_DIALECT = 'postgres';
const TOKEN_SECRET = 'Rc_$cw29_?+VnF[2xyu9N*C_e~^xR`';

const Sequelize = require('sequelize');
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: 'localhost',
    dialect: DB_DIALECT,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    operatorsAliases: false
});

module.exports.sequelize = sequelize;
module.exports.TOKEN_SECRET = TOKEN_SECRET;
