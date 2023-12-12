const Chat = require('../models/chatModel');
const { Op } = require('sequelize');

exports.postChat = async (req, res, next) => {
    try {
        const chat = req.body.message;
        const name = req.body.name;
        const userId = req.body.userId;
        const groupId = req.body.groupId;
        const message = await Chat.create({ message: chat, name: name, userId: userId, groupId: groupId });
        res.status(201).json({ message: message.message });
    } catch (err) {
        console.log('Error in postChat', err);
    }
};

exports.groupChat = async (req, res, next) => {
    try {
        const lastMsgId = parseFloat(req.query.lastmsgid) || 0;
        const groupid = req.params.id;
        const newChat = await Chat.findAll({ where: { groupId: groupid, id: { [Op.gt]: lastMsgId } } });

        const nChat = newChat.map((chat) => ({
            id: chat.id,
            message: chat.message,
            name: chat.name,
            groupId: chat.groupId,
        }));

        res.status(200).json({
            allMessage: nChat,
        });
    } catch (err) {
        console.log('Error While Getting Chat!', err);
    }
};
