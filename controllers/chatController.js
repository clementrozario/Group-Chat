const Chat = require('../models/chatModel');
const User = require('../models/userModel');
const Group = require('../models/groupModel');
const { Op } = require("sequelize");

exports.postChat = async (req, res, next) => {
    try {
        const chat = req.body.message;
        const name = req.body.name;
        const userId = req.body.userId;
        const message1 = await Chat.create({ message: chat, name: name, userId: userId });
        res.status(201).json({ message: message1.message });

        const groupId = req.body.groupId;
        const message2 = await Chat.create({ message: chat, name: name, userId: userId, groupId: groupId });
        res.status(201).json({ message: message2.message });
    } catch (err) {
        console.log("Error in postChat", err);
    }
}

exports.getChat = async (req, res, next) => {
    try {
        // Your getChat logic goes here
    } catch (err) {
        console.log('Error While Getting Chat!', err);
    }
}

exports.groupChat = async (req, res, next) => {
    try {
        lastMsgId = parseFloat(req.query.lastmsgid);
        const groupid = req.params.id;
        const chat = await Chat.findAll({ where: { groupId: groupid } });
        const newChat = await Chat.findAll({ where: { id: { [Op.gt]: lastMsgId } } });
        const nChat = newChat.map(chat => ({
            id: chat.dataValues.id,
            message: chat.dataValues.message,
            name: chat.dataValues.name,
        }));

        res.status(200).json({ allMessage: nChat, groupId: chat.dataValues.groupId });
    } catch (err) {
        console.log('Error While Getting Group Chat!', err);
    }
}
