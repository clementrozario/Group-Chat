const express = require('express');

const adminController = require('../controllers/adminController')

const authenticate = require('../middleware/authMiddleware')

const router = express.Router();

router.get('/search/:id', adminController.userToAddGroup);

// router.get('/get-participants/:id', authenticate.authenticate, userController.getParticipants)

// router.get('/get-user-data/:id', userController.getUserData);

module.exports = router;