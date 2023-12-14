const User  = require('../models/userModel');
const Group = require('../models/groupModel');
const Group_users = require('../models/groupUsers');
const uuid = require('uuid');

exports.createGroup = async (req, res, next) => {
    try{
    let groupName = req.body.groupName;
    const id = uuid.v4();
    const group = await Group.create({ id, groupname: groupName });
    const userGroup = await Group_users.create({admin: true, userId: req.user.id,groupId: group.id })
    // await req.user.addGroups(group)
    res.status(201).json({message: "Group Created Successfully", group: group})
    }catch(err){
        console.log("Error in creating a new group", err)
    }
}

exports.deleteGroup = async (req, res, next) =>{
    let groupId = req.params.id
    await Group.destroy({where: {id: groupId}})
    res.status(200).json({message: 'Group Deleted Successfully'})
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

exports.makeAdmin = async (req, res, next) => {
    const adminData = req.body;

    await Group_users.update({admin:true}, {where: {userId: adminData.userId, groupId: adminData.groupId }})
    res.status(201).json({success: true, message: "User is now group admin"});
}

exports.removeAdmin = async (req, res, next) => {
    const adminData = req.body;
    console.log(adminData.groupId)
    await Group_users.update({admin:false}, {where: {userId: adminData.userId, groupId: adminData.groupId }})
    res.status(201).json({success: true, message: "User is now not a Admin"});
}
exports.removeFromGroup = async (req, res, next) => {
    const userData = req.body;

    const group = await Group.findByPk(userData.groupId);
    const user = await User.findByPk(userData.userId);
    await user.removeGroup(group);
    // await Group_users.update({admin:false}, {where: {userId: adminData.userId, groupId: adminData.groupId }})
    res.status(201).json({success: true, message: "User is removed from group"});
}