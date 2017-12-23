const Sequelize = require('sequelize');
const sequelize = require('../config').sequelize;
const argon2 = require('argon2');

const User = sequelize.define('user', {
    email : Sequelize.STRING,
    password : Sequelize.STRING
});
User.hash = plaintext => {
    return argon2.hash(plaintext, {type : argon2.argon2id});
};

User.validate = async (email, password) => {
    let result = await User.findOne({
        where : {
            email : email,
        }
    });

    if(!result.password) return false;
    return await argon2.verify(result.password, password);

};


User.sync();

module.exports = User;