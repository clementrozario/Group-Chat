const User = require('../models/userModel');
const Group = require('../models/groupModel');
const Group_users = require('../models/groupUsers');

exports.createGroup = async (req, res, next) => {
    try {
        let groupName = req.body.groupName;
        const newGroup = await Group.create({ groupname: groupName });
        await req.user.addGroups(newGroup);

        const adminGroup = await Group_users.create({
            admin: true,
            userId: req.user.id,
            groupId: newGroup.id
        });

        res.status(201).json({
            message: "Group Created Successfully",
            group: newGroup
        });
    } catch (err) {
        console.log("Error in creating a new group", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

exports.deleteGroup = async (req, res, next) => {
    let groupId = req.params.id;
    await Group.destroy({ where: { id: groupId } });
    res.status(200).json({ message: 'Group Deleted Successfully' });
}

exports.showGroup = async (req, res, next) => {
    try {
        const groupsForUser = await req.user.getGroups();
        res.status(200).json({
            groups: groupsForUser,
        });
    } catch (err) {
        console.log('Error while retrieving user groups', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.getGroup = async (req, res, next) => {
    try {
        const id = req.params.id;
        const group = await Group.findByPk(id);
        const usersInGroup = await group.getUsers();
        const users = usersInGroup.map(user => ({
            id: user.dataValues.id,
            name: user.dataValues.name,
        }));

        res.status(200).json({
            message: "Group user find Successfully",
            users: users,
            group: group
        });
    } catch (err) {
        console.log('Error while retrieving group information', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.addParticipants = async (req, res, next) => {
    const users = req.body;
    const groupId = req.params.id;
    const group = await Group.findByPk(groupId);

    try {
        users.forEach(async id => {
            const user = await User.findByPk(id);
            await user.addGroup(group);
        });

        res.status(201).json({ success: true, message: "User added to the group" });
    } catch (err) {
        console.log('Error while adding participants to the group', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.makeAdmin = async (req, res, next) => {
    const adminData = req.body;

    try {
        await Group_users.update({ admin: true }, { where: { userId: adminData.userId, groupId: adminData.groupId } });
        res.status(201).json({ success: true, message: "User is now group admin" });
    } catch (err) {
        console.log('Error while making user admin', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.removeAdmin = async (req, res, next) => {
    const adminData = req.body;

    try {
        await Group_users.update({ admin: false }, { where: { userId: adminData.userId, groupId: adminData.groupId } });
        res.status(201).json({ success: true, message: "User is now not an Admin" });
    } catch (err) {
        console.log('Error while removing user admin status', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.removeFromGroup = async (req, res, next) => {
    const userData = req.body;

    try {
        const group = await Group.findByPk(userData.groupId);
        const user = await User.findByPk(userData.userId);
        await user.removeGroup(group);

        res.status(201).json({ success: true, message: "User is removed from the group" });
    } catch (err) {
        console.log('Error while removing user from the group', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
