const User = require('../models/userModel');
const Group = require('../models/groupModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Group_users = require('../models/groupUsers');
const { Op } = require("sequelize");

exports.userToAddGroup = async (req, res, next) => {
    try {
        let groupId = req.params.id;
        const searchQuery = req.query.searchQuery;

        const group = await Group.findByPk(groupId);
        const usersInGroup = await group.getUsers();

        const users = await User.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.like]: `%${searchQuery}%` } },
                    { email: { [Op.like]: `%${searchQuery}%` } },
                    { phone: { [Op.like]: `%${searchQuery}%` } },
                ],
            },
        });

        const usersNotInGroup = users.filter(user => {
            return !usersInGroup.some(userInGrp => userInGrp.id === user.id)
        })

        res.json({ users : usersNotInGroup })
    }
    catch (err) {
        return res.status(500).send({ message: 'something error' })
    }
}