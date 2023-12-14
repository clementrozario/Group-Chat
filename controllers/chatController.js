const Chat = require('../models/chatModel');
const AchivedChat = require('../models/archivedchatModel')
const fs = require('fs');
const User = require('../models/userModel');
const Group = require('../models/groupModel');
const { Op } = require("sequelize");
const S3Services = require('../services/S3services');
const cron = require('node-cron');

// cron.schedule('59 59 23 * * *', async () => {
//     console.log('code is running in cron')
//     const currentTimestamp = new Date();
//     currentTimestamp.setHours(currentTimestamp.getHours() - 48);
//     const chat = await Chat.findAll({ where: { createdAt: { [Op.lt]: currentTimestamp } } })

//     chat.forEach(async chat => {
//         await AchivedChat.create({ message: chat.message, name: chat.name, userId: chat.userId, groupId: chat.groupId })
//     })

//     await Chat.destroy({ where: { createdAt: { [Op.lt]: currentTimestamp } } })
// console.log("cron done");
// });

exports.postChat = async (req, res, next) => {
    try {
        const chat = req.body.message;
        const name = req.body.name;
        const userId = req.body.userId;
        const groupId = req.body.groupId;
        const message = await Chat.create({ message: chat, name: name, userId: userId, groupId: groupId });
        res.status(201).json({ message: message.message })
    } catch (err) {
        console.log("Error in postChat", err);
    }
}

exports.groupChat = async (req, res, next) => {
    try {
        lastMsgId = parseFloat(req.query.lastmsgid)
        const groupid = req.params.id;
        const chat = await Chat.findAll({ where: { groupId: groupid } })
        console.log(chat);
        const newChat = await Chat.findAll({ where: { id: { [Op.gt]: lastMsgId } } });
        const nChat = newChat.map(chat => ({
            id: chat.id,
            message: chat.message,
            name: chat.name,
            groupId: chat.groupId
        }));
        res.status(200).json({
            allMessage: nChat
        })
    } catch (err) {
        console.log('Error While Getting Chat!', err);
    }
}

exports.uploadFile = async (req, res, next) => {
    const name = req.body.name;
    const userId = req.body.userId;
    const groupId = req.body.groupId;
    const file = req.file
    // const fileStream = fs.createReadStream(file.path)
    const filename = `chat${userId}/${new Date()}`
    console.log(file)
    const fileURL = await S3Services.uploadToS3(file)
    console.log(fileURL);
    const message = await Chat.create({ message: fileURL, name: name, userId: userId, groupId: groupId });
    res.status(201).json({ message: message.message })
}