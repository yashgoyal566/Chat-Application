import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { axiosInstance } from './useAuthStore';
import toast from 'react-hot-toast';
import { useSocketStore } from './useSocketStore';

export const useChatStore = create(persist((set, get) => ({
  messages: [],
  users: [],
  conversations: [],
  selectedUser: null,
  drafts: {},
  replyingTo: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  // for unread message counts
   unreadCounts: {}, // Format will be { "userId1": 2, "userId2": 5 }
  // Call this when a message arrives from someone you aren't currently chatting with
  incrementUnread: (userId) => {
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [userId]: (state.unreadCounts[userId] || 0) + 1
      }
    }));
  },
  // Call this when you click on a user's chat to mark them as read
  clearUnread: (userId) => {
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [userId]: 0
      }
    }));
  },



  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const [usersRes, convosRes] = await Promise.all([
        axiosInstance.get('/users'),
        axiosInstance.get('/groups/conversations')
      ]);
      set({ users: usersRes.data.data, conversations: convosRes.data.data });
    } catch (error) {
      toast.error('Failed to get data');
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (targetId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${targetId}`);
      set({ messages: res.data.data });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to get messages');
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (data) => {
    const { selectedUser, messages, replyingTo } = get();
    try {
      const payload = { ...data, replyTo: replyingTo?._id || null };
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, payload);
      
        const updatedMsg = res.data.data;
        set((state) => {
          const updatedConvos = state.conversations.map(c => {
            if (c._id === updatedMsg.conversation) {
              return { ...c, lastMessage: updatedMsg };
            }
            return c;
          });
       
          return { messages: [...state.messages, updatedMsg], replyingTo: null, conversations: updatedConvos };
        });
      return true;

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
      return false;
    }
  },

  createGroup: async (name, selectedUsers) => {
    try {
      const res = await axiosInstance.post('/groups', { name, users: selectedUsers });
      set({ conversations: [res.data.data, ...get().conversations] });
      toast.success('Group created!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create group');
    }
  },

    listenToMessages: () => {
    const socket = useSocketStore.getState().socket;
    if (!socket) return;

        socket.on("message_updated", (updatedData) => {
      set((state) => ({
        messages: state.messages.map((msg) => 
          msg._id === updatedData.messageId 
            ? { ...msg, ...updatedData.changes } 
            : msg
        )
      }));
    });

    socket.on("receive_message", (newMessage) => {
      const { selectedUser, incrementUnread } = get();
      
      const isForGroup = selectedUser?.isGroup && newMessage.conversation === selectedUser?._id;
      // Handle the case where sender is just an ID string or an object with _id
      const senderId = typeof newMessage.sender === 'object' ? newMessage.sender?._id : newMessage.sender;
      const isFromUser = !selectedUser?.isGroup && senderId === selectedUser?._id;
      const isForActiveChat = isForGroup || isFromUser;

      if (isForActiveChat) {
        set((state) => ({ messages: [...state.messages, newMessage] }));
      } else {
        const badgeId = newMessage.conversationType === 'group' ? newMessage.conversation : senderId;
        if (badgeId) incrementUnread(badgeId);
      }
      
      set((state) => {
        const updatedConvos = state.conversations.map(c => {
          if (c._id === newMessage.conversation) {
            return { ...c, lastMessage: newMessage };
          }
          return c;
        });
        return { conversations: updatedConvos};
      });
    });
  },

  stopListeningToMessages: () => {
    const socket = useSocketStore.getState().socket;
    if (!socket) return;
    socket.off("receive_message");
  },

  
  setSelectedUser: (user) => set({ selectedUser: user, replyingTo: null }),
  setReplyingTo: (message) => set({ replyingTo: message }),
  
  togglePinMessage: async (messageId) => {
    try {
      const res = await axiosInstance.put(`/messages/${messageId}/pin`);
      
      // Safety check
      const pinnedState = res?.data?.data?.isPinned || false;
      
      set((state) => ({
        messages: state.messages.map((msg) => 
          msg._id === messageId ? { ...msg, isPinned: pinnedState } : msg
        )
      }));
      
      if (pinnedState) {
        toast.success("Message Pinned Successfully!");
      } else {
        toast.success("Message Unpinned Successfully!");
      }
    } catch (error) {
      console.error("Pin API Error:", error);
      const errMsg = error?.response?.data?.message || error.message || "Unknown error";
      toast.error(`Failed: ${errMsg}`);
    }
  },
  setDraft: (userId, text) => set((state) => {
    const drafts = { ...state.drafts };
    if (text) {
      drafts[userId] = text;
    } else {
      delete drafts[userId];
    }
    return { drafts };
  }),
}), { name: 'chat-storage', partialize: (state) => ({ drafts: state.drafts }) }));
