const Sequelize = require("sequelize")

const sequelize = require("../utils/database")

const Group_users = sequelize.define("group_users", {
    admin:{
        type:Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue:false
    }
})

module.exports = Group_users