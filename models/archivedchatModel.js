const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const AchivedChat = sequelize.define('achivedchat', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    message: Sequelize.STRING,
    name: Sequelize.STRING,
    userId: Sequelize.STRING,
    groupId:Sequelize.STRING
})

module.exports = AchivedChat;