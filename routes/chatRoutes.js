const express = require('express');
const router = express.Router();

const authenticate = require('../middleware/authMiddleware');

const chatController = require('../controllers/chatController');

router.post('/add-chat', chatController.postChat);

router.get('/get-chat', authenticate.authenticate, chatController.getChat);
router.get('/get-group-chat/:id', authenticate.authenticate, chatController.groupChat);

module.exports = router;