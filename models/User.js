const Sequelize = require('sequelize');
const sequelize = require('../config').sequelize;
const argon2 = require('argon2');

const User = sequelize.define('user', {
    id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true},
    email : { type: Sequelize.STRING, allowNull: false, unique : true },
    password :{ type: Sequelize.STRING, allowNull: false}
});
User.hash = async plaintext => {
    return argon2.hash(plaintext, {type : argon2.argon2id});
};

User.validate = async (email, password) => {
    let result = await User.findOne({
        where : {
            email : email,
        }
    });

    if(!result) return false;
    return await argon2.verify(result.password, password);

};


User.sync();

module.exports = User;