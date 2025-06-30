const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');

// All routes are protected
router.use(auth);

// Message routes
router.post('/send', messageController.sendMessage);
router.get('/conversations', messageController.getConversations);
router.get('/conversation/:userId', messageController.getConversation);
router.patch('/read/:senderId', messageController.markAsRead);

module.exports = router; 