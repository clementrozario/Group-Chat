const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Group = sequelize.define('group', {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    groupname: Sequelize.STRING,
})

module.exports = Group;