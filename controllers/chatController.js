const Chat = require('../models/chatModel');

exports.postChat = async (req, res, next) => {
    try {
        const chat = req.body.message;
        const userId = req.body.userId;
        const message = await Chat.create({ message: chat, userId: userId });
        res.status(201).json({ message: message.message });
    } catch (err) {
        console.log("Error in postChat", err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.getChat = async (req, res, next) => {
    try {
        const allChat = await Chat.findAll({ where: { userId: req.user.id } });
        res.status(200).json({ allMessage: allChat });
    } catch (err) {
        console.log('Error While Getting Chat!', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};