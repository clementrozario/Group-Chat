const User = require('../models/userModel');
const Group = require('../models/groupModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signupUser = async (req, res, next) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const phone = req.body.phone;
        const password = req.body.password;

        const existingUser = await User.findOne({ where: { email: email } });

        if (existingUser) {
            return res.json({ message: "User Already Exists!" });
        }

        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Error hashing password" });
            }

            try {
                const user = await User.create({
                    name: name,
                    email: email,
                    phone: phone,
                    password: hash
                });

                const group = await Group.findByPk(1);
                await user.addGroup(group);

                return res.status(201).json({ message: "User Signup Successful!" });
            } catch (err) {
                console.log(err);
                return res.status(500).json({ success: false, message: "Error creating user" });
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

exports.loginUser = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            return res.json({ success: false, message: "User Not Found" });
        }

        bcrypt.compare(password, user.password, (err, response) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Something went wrong" });
            }

            if (response) {
                const token = generateToken(user.id, user.name);
                return res.status(200).json({ success: true, message: "Login Successful", userId: user.id, token: token });
            } else {
                return res.json({ success: false, message: "Password is incorrect" });
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
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
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
