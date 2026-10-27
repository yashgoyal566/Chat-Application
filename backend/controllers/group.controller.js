import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

export const createGroup = async (req, res) => {
  try {
    const { name, users } = req.body;
    
    if (!name || !users || users.length < 2) {
      return res.status(400).json({ success: false, message: 'Please fill all fields and select at least 2 users' });
    }

    const participants = [...users, req.user._id];

    const groupChat = await Conversation.create({
      groupName: name,
      isGroup: true,
      participants,
      groupAdmin: req.user._id,
    });

    const fullGroupChat = await Conversation.findById(groupChat._id).populate('participants', '-password').populate('lastMessage');
    res.status(201).json({ success: true, data: fullGroupChat });
  } catch (error) {
    console.error('Error in createGroup:', error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    const conversations = await Conversation.find({ participants: userId })
      .populate('participants', '-password')
      .populate('lastMessage')
      .sort({ updatedAt: -1 })
      .lean();

    const conversationsWithUnread = await Promise.all(
      conversations.map(async (convo) => {
        const unreadCount = await Message.countDocuments({
          conversation: convo._id,
          sender: { $ne: userId },
          readBy: { $ne: userId },
        });
        return {
          ...convo,
          unreadCount,
        };
      })
    );

    res.status(200).json({ success: true, data: conversationsWithUnread });
  } catch (error) {
    console.error('Error in getConversations:', error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
