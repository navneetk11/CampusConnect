import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: [true, 'groupId is required'],
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'senderId is required'],
    },
    senderName: {
      type: String,
      required: [true, 'senderName is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
    // type is 'text' for now
    
    type: {
      type: String,
      enum: ['text', 'file'],
      default: 'text',
    },
    
    fileUrl: {
      type: mongoose.Schema.Types.ObjectId,
      ref: File,
      default: null,
    },
  },
  {
    timestamps: true, // auto adds createdAt and updatedAt
  }
);

// Index so fetching messages by group is fast
messageSchema.index({ groupId: 1, createdAt: 1 });

const Message = mongoose.model('Message', messageSchema);

export default Message;
