const User = require('../models/userModel');
const Group = require('../models/groupModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Group_users = require('../models/groupUsers');

exports.signupUser = async (req, res, next) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const phone = req.body.phone;
        const password = req.body.password;
        const existingUser = await User.findOne({ where: { email: email } });
        if (existingUser) {
            res.json({ message: "User Already Exist!" });
        } else {
            bcrypt.hash(password, 10, async (err, hash) => {
                const user = await User.create({
                    name: name,
                    email: email,
                    phone: phone,
                    password: hash
                });
                const group = await Group.findByPk(1);
                await user.addGroup(group);
                res.status(201).json({ message: "User Signup Successfully!" });
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.loginUser = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findOne({ where: { email: email } });
        
        if (user) {
            bcrypt.compare(password, user.password, (err, response) => {
                if (err) {
                    res.status(500).json({ success: false, message: "Something went wrong" });
                }
                if (response === true) {
                    res.status(200).json({
                        success: true,
                        message: "Login Successfully",
                        userId: user.id,
                        token: generateToken(user.id, user.name)
                    });
                } else {
                    res.json({ success: false, message: "Password is incorrect" });
                }
            });
        } else {
            res.json({ success: false, message: "User Not Exist" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const generateToken = (id, name) => {
    return jwt.sign({ userId: id, name: name }, 'secret');
};

exports.showParticipants = async (req, res, next) => {
    try {
        const groupid = req.params.id;
        const group = await Group.findByPk(groupid);
        const usersInGroup = await group.getUsers();
        const users = await User.findAll();
        const usersNotInGroup = users.filter(user => !usersInGroup.some(userInGrp => userInGrp.id === user.id));
        const mappedUser = usersNotInGroup.map(user => ({
            id: user.id,
            name: user.name
        }));
        res.json({ users: mappedUser });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getParticipants = async (req, res, next) => {
    try {
        const groupid = req.params.id;
        const group = await Group.findByPk(groupid);
        const usersByAlldata = await group.getUsers();
        const usersByAdminData = await Group_users.findAll({ where: { GroupId: groupid } });
        const userTable = usersByAlldata.map(user => ({
            userId: user.id,
            name: user.name
        }));
        const adminTable = usersByAdminData.map(data => ({
            userId: data.userId,
            isAdmin: data.admin
        }));
        const adminMap = new Map(adminTable.map(adminUser => [adminUser.userId, adminUser.isAdmin]));
        userTable.forEach(user => {
            user.isAdmin = adminMap.get(user.userId) ? 1 : 0;
        });
        res.json({ users: userTable });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getUserData = async (req, res, next) => {
    try {
        const userid = req.params.id;
        const groupid = parseFloat(req.query.groupid);
        const user = await Group_users.findAll({ where: { userId: userid, groupId: groupid } });
        res.json({ user: user });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
