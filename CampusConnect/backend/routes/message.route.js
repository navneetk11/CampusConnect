import express from 'express';
import { getMessages, postMessage, deleteMessage } from '../controllers/message.controller.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/messages/:groupId  — load chat history for a group (last 50 messages)
router.get('/:groupId', verifyToken, getMessages);

// POST /api/messages  — send a new message to a group
router.post('/', verifyToken, postMessage);

// DELETE /api/messages/:messageId  — delete your own message
router.delete('/:messageId', verifyToken, deleteMessage);

export default router;