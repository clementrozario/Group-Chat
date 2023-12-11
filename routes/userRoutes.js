const express = require('express');

const userController = require('../controllers/userController')

const authenticate = require('../middleware/authMiddleware')

const router = express.Router();

router.post('/signup', userController.signupUser)

router.post('/login', userController.loginUser);

router.get('/show-participants/:id', userController.showParticipants)

module.exports = router;

