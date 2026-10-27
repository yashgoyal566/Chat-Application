import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import { getReceiverSocketId, io } from '../sockets/socket.js';
import cloudinary from '../config/cloudinary.js';

export const sendMessage = async (req, res) => {
  try {
    const { content, image, replyTo } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl = '';
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    let conversation = await Conversation.findById(receiverId);

    if (!conversation) {
      conversation = await Conversation.findOne({
        isGroup: false,
        participants: { $all: [senderId, receiverId] },
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [senderId, receiverId],
        });
      }
    }

    // Validate replyTo
    if (replyTo) {
      const originalMessage = await Message.findById(replyTo);
      if (!originalMessage || originalMessage.conversation.toString() !== conversation._id.toString()) {
        return res.status(400).json({ success: false, message: 'Invalid reply target' });
      }
    }

    let newMessage = new Message({
      sender: senderId,
      conversation: conversation._id,
      content,
      image: imageUrl,
      replyTo: replyTo || null,
      readBy: [senderId], // Sender has already read their own message
    });

    if (newMessage) {
      conversation.lastMessage = newMessage._id;
      await Promise.all([conversation.save(), newMessage.save()]);
    }

    // Populate replyTo for realtime
    newMessage = await newMessage.populate([
      { path: 'sender', select: 'fullName username profilePicture' },
      { 
        path: 'replyTo', 
        select: 'sender content image', 
        populate: { path: 'sender', select: 'fullName username' } 
      }
    ]);

    const messagePayload = {
      ...newMessage.toObject(),
      conversationType: conversation.isGroup ? 'group' : 'direct',
    };

    const targetSocketIds = new Set();
    
    if (conversation.participants && conversation.participants.length > 0) {
      conversation.participants.forEach(participantId => {
        const pIdStr = (participantId._id || participantId).toString();
        if (pIdStr !== senderId.toString()) {
          const socketId = getReceiverSocketId(pIdStr);
          if (socketId) targetSocketIds.add(socketId);
        }
      });
    }

    if (!conversation.isGroup && receiverId && receiverId.toString() !== senderId.toString()) {
      const directSocketId = getReceiverSocketId(receiverId.toString());
      if (directSocketId) targetSocketIds.add(directSocketId);
    }

    targetSocketIds.forEach(socketId => {
      io.to(socketId).emit('receive_message', messagePayload);
    });

    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    console.error('Error in sendMessage:', error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: targetId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findById(targetId);

    if (!conversation) {
      conversation = await Conversation.findOne({
        isGroup: false,
        participants: { $all: [senderId, targetId] },
      });
    }

    if (!conversation) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Automatically mark unread messages as read by the user opening the chat
    await Message.updateMany(
      { conversation: conversation._id, readBy: { $ne: senderId } },
      { $addToSet: { readBy: senderId } }
    );

    const messages = await Message.find({ conversation: conversation._id })
      .sort({ createdAt: 1 })
      .populate('sender', 'fullName username profilePicture')
      .populate({
        path: 'replyTo',
        select: 'sender content image',
        populate: { path: 'sender', select: 'fullName username' }
      });

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error('Error in getMessages:', error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const markMessagesAsRead = async (req, res) => {
  try {
    const { id: targetId } = req.params;
    const userId = req.user._id;

    let conversation = await Conversation.findById(targetId);
    if (!conversation) {
      conversation = await Conversation.findOne({
        isGroup: false,
        participants: { $all: [userId, targetId] },
      });
    }

    if (conversation) {
      await Message.updateMany(
        { conversation: conversation._id, readBy: { $ne: userId } },
        { $addToSet: { readBy: userId } }
      );
    }

    res.status(200).json({ success: true, message: 'Messages marked as read' });
  } catch (error) {
    console.error('Error in markMessagesAsRead:', error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const togglePinMessage = async (req, res) => {
  try {
    console.log("=> TOGGLE PIN API HIT for message:", req.params.id);
    const { id } = req.params;
    const message = await Message.findById(id);
    
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    const newValue = !message.isPinned;
    // Force the update in DB bypassing schema strict mode in case nodemon didn't restart
    const updatedMessage = await Message.findByIdAndUpdate(
      id,
      { $set: { isPinned: newValue } },
      { new: true, strict: false }
    );
    message.isPinned = newValue;
    console.log("=> MESSAGE SAVED:", updatedMessage.isPinned);

    // Find the conversation to get the participants
    const conversation = await Conversation.findById(message.conversation);
    if (conversation) {
      conversation.participants.forEach((participantId) => {
        const socketId = getReceiverSocketId(participantId.toString());
        if (socketId) {
          console.log("=> EMITTING TO SOCKET:", socketId);
          io.to(socketId).emit("message_updated", {
            messageId: message._id,
            changes: { isPinned: message.isPinned }
          });
        }
      });
    }

    res.status(200).json({ success: true, data: message });
  } catch (error) {
    console.error("=> ERROR TOGGLING PIN:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
