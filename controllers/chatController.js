const Chat = require('../models/chatModel');
const User = require('../models/userModel');
const { Op } = require("sequelize");

exports.postChat = async (req, res, next) => {
    try {
        const chat = req.body.message;
        const name = req.body.name;
        const userId = req.body.userId;

        // Ensure you are creating the chat with the correct field names
        const newChat = await Chat.create({ message: chat, name: name, userId: userId });

        res.status(201).json({ message: newChat.message });
    } catch (err) {
        console.error("Error in postChat", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getChat = async (req, res, next) => {
    try {
        const lastMsgId = parseFloat(req.query.lastmsgid) || 0;

        // Use the Op.gt operator to get messages with IDs greater than lastMsgId
        const newChat = await Chat.findAll({ where: { id: { [Op.gt]: lastMsgId } } });
        
        // Map the data to include only necessary fields
        const formattedChat = newChat.map(chat => ({
            id: chat.id,
            message: chat.message,
            name: chat.name,
        }));

        res.status(200).json({ allMessage: formattedChat });
    } catch (err) {
        console.error('Error While Getting Chat!', err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
