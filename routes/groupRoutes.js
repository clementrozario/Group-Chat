const express = require('express');

const router = express.Router();

const authenticate = require('../middleware/authMiddleware')

const groupController = require('../controllers/groupController');

router.post('/create-group', authenticate.authenticate, groupController.createGroup);

router.get('/show-group', authenticate.authenticate, groupController.showGroup);

router.get('/get-group/:id', authenticate.authenticate, groupController.getGroup);

router.post('/add-participants/:id', groupController.addParticipants)

router.post('/make-admin', groupController.makeAdmin)

router.post('/remove-admin', groupController.removeAdmin)

router.post('/remove-from-group', groupController.removeFromGroup)

router.delete('/delete-group/:id', groupController.deleteGroup)

module.exports = router;