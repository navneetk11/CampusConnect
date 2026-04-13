import Message from '../models/message.js';
import mongoose from 'mongoose';

// GET /api/messages/:groupId
// Returns last 50 messages for a group (oldest to newest)
// Protected: user must be authenticated via JWT middleware

const getMessages = async (req, res) => {
  const { groupId } = req.params;

  // Validate groupId is a real MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(groupId)) {
    return res.status(400).json({ error: 'Invalid groupId' });
  }

  try {
    const messages = await Message.find({ groupId })
      .sort({ createdAt: 1 })   // oldest first so chat reads top to bottom
      .limit(50)                // cap at 50 messages for initial load
      .lean();                  // plain JS objects, faster than full Mongoose docs

    return res.status(200).json(messages);
  } catch (err) {
    console.error('getMessages error:', err);
    return res.status(500).json({ error: 'Server error fetching messages' });
  }
};


// POST /api/messages
// Saves a new message to the database
// Body: { groupId, content }
// Protected: senderId and senderName come from the JWT token (req.user)

const postMessage = async (req, res) => {
  const { groupId, content, fileId, type } = req.body;
  const senderId   = req.user.id;        // set by authMiddleware from JWT
  const senderName = req.user.username;  // set by authMiddleware from JWT

  // Validate groupId
  if (!groupId || !mongoose.Types.ObjectId.isValid(groupId)) {
    return res.status(400).json({ error: 'Valid groupId is required' });
  }

  // Validate content
  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Message content cannot be empty' });
  }

  if (content.trim().length > 2000) {
    return res.status(400).json({ error: 'Message cannot exceed 2000 characters' });
  }

  try {
    const message = await Message.create({
      groupId,
      senderId,
      senderName,
      content: content.trim(),
      type: type || 'text',
      fileUrl: fileId || null,
    });

    return res.status(201).json(message);
  } catch (err) {
    console.error('postMessage error:', err);
    return res.status(500).json({ error: 'Server error sending message' });
  }
};


// DELETE /api/messages/:messageId
// Lets a user delete their own message only
// Protected: only the original sender can delete

const deleteMessage = async (req, res) => {
  const { messageId } = req.params;
  const requestingUserId = req.user.id; // set by authMiddleware

  if (!mongoose.Types.ObjectId.isValid(messageId)) {
    return res.status(400).json({ error: 'Invalid messageId' });
  }

  try {
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Only the sender can delete their own message
    if (message.senderId.toString() !== requestingUserId) {
      return res.status(403).json({ error: 'Not authorized to delete this message' });
    }

    await message.deleteOne();
    return res.status(200).json({ message: 'Message deleted successfully' });
  } catch (err) {
    console.error('deleteMessage error:', err);
    return res.status(500).json({ error: 'Server error deleting message' });
  }
};

export { getMessages, postMessage, deleteMessage };