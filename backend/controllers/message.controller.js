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

    if (conversation.isGroup) {
      conversation.participants.forEach(participantId => {
        if (participantId.toString() !== senderId.toString()) {
          const socketId = getReceiverSocketId(participantId.toString());
          if (socketId) {
            io.to(socketId).emit('receive_message', newMessage);
          }
        }
      });
    } else {
      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receive_message', newMessage);
      }
    }

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
