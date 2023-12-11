const User  = require('../models/userModel');
const Group = require('../models/groupModel');

exports.createGroup = async (req, res, next) => {
    let groupName = req.body.groupName;
    const group = await Group.create({groupname: groupName})
    await req.user.addGroups(group)
    res.status(201).json({message: "Group Created Successfully", group: group})
}

exports.showGroup = async (req,res, next) =>{
    const groupsForUser = await req.user.getGroups();
    res.status(200).json({
        groups : groupsForUser,
    })
}

exports.getGroup = async (req,res, next) =>{
    const id = req.params.id;
    const group = await Group.findByPk(id);
    const usersInGroup = await group.getUsers();

    const users = usersInGroup.map(user => ({
        id: user.dataValues.id,
        name: user.dataValues.name,
    }));

    res.status(200).json({
        message: "Group user find Successfully",
        users : users,
        group: group
    })
}

exports.addParticipants = async (req, res, next) => {
    const users = req.body;
    const groupId = req.params.id;
    const group = await Group.findByPk(groupId);
    users.forEach(async id => {
        const user = await User.findByPk(id)
        await user.addGroup(group);
    });
    res.status(201).json({success: true, message: "User added to the group"});
}