const User = require('../models/userModel');
const Group = require('../models/groupModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Group_users = require('../models/groupUsers');

exports.signupUser = async (req, res, next) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const phone = req.body.phone;
        const password = req.body.password;
        const existingUser = await User.findOne({ where: { email: email } })
        if (existingUser) {
            res.json({ message: "User Already Exist!" })
        } else {
            bcrypt.hash(password, 10, async (err, hash) => {
                const user = await User.create({
                    name: name,
                    email: email,
                    phone: phone,
                    password: hash
                })
                const group = await Group.findByPk(1);
                await user.addGroup(group);
                res.status(201).json({ message: "User Signup Successfully!" })
            })
        }
    } catch { err => console.log(err) }
}

exports.loginUser = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        await User.findAll({ where: { email: email } })
            .then(async user => {
                if (user.length > 0) {
                    // const groups = await user[0].getGroups();
                    bcrypt.compare(password, user[0].password, (err, response) => {
                        if (err) {
                            res.status(500).json({ success: false, message: "Something went wrong" })
                        }
                        if (response === true) {
                            res.status(200).json({
                                success: true,
                                message: "login Successfully",
                                userId: user[0].id,
                                token: generateToken(user[0].id, user[0].name)
                            })
                        } else {
                            return res.json({ success: false, message: "Password is incorrect" });
                        }
                    })
                } else {
                    return res.json({ success: false, message: "User Not Exist" });
                }
            }).catch(err => console.log(err))

    } catch { err => console.log(err) }
}

const generateToken = (id, name) => {
    return jwt.sign({ userId: id, name: name }, 'secret');
}

exports.showParticipants = async (req, res, next) => {
    const groupid = req.params.id
    const group = await Group.findByPk(groupid);
    const usersInGroup = await group.getUsers();
    const users = await User.findAll();
    const usersNotInGroup = users.filter(user => {
        return !usersInGroup.some(userInGrp => userInGrp.id === user.id)
    })
    const mappedUser = usersNotInGroup.map(user => ({
        id: user.id,
        name: user.name
    }))
    console.log(mappedUser)
    res.json({ users: mappedUser });
}

exports.getParticipants = async (req, res, next) => {
    const groupid = req.params.id;
    const userId = req.user.id;
    const group = await Group.findByPk(groupid);
    const usersByAlldata = await group.getUsers();
    const usersByAdminData = await Group_users.findAll({ where: { GroupId: groupid } })

    const userTable = usersByAlldata.map(user => ({
        userId: user.id,
        name: user.name
    }))

    const adminTable = usersByAdminData.map(data => ({
        userId: data.userId,
        isAdmin: data.admin
    }))

    const adminMap = new Map(adminTable.map(adminUser => [adminUser.userId, adminUser.isAdmin]));

    userTable.forEach(user => {
        user.isAdmin = adminMap.get(user.userId) ? true : false;
    });

    const admins = await Group_users.findAll({ where: { GroupId: groupid, admin: true } });

    const isAdmin = admins.find(admin => admin.userId === req.user.id) ? true : false;
   
    res.json({ users: userTable , admin: isAdmin});
}

exports.getUserData = async (req, res, next) =>{
    const userid = req.params.id;
    const groupid = req.query.groupid;
    const user = await Group_users.findAll({where: {userId: userid, groupId: groupid }})
    res.json({ user: user });
}