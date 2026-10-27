import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { axiosInstance, useAuthStore } from './useAuthStore';
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

  // unread message counts: { "userIdOrGroupId": number }
  unreadCounts: {},

  // Increment badge when message arrives from inactive chat
  incrementUnread: (id) => {
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [id]: (state.unreadCounts[id] || 0) + 1
      }
    }));
  },

  // Clear unread badge locally and sync with backend
  clearUnread: async (id) => {
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [id]: 0
      }
    }));
    try {
      await axiosInstance.put(`/messages/read/${id}`);
    } catch (err) {
      console.error("Error marking messages as read:", err);
    }
  },

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const authUser = useAuthStore.getState().authUser;
      const [usersRes, convosRes] = await Promise.all([
        axiosInstance.get('/users'),
        axiosInstance.get('/groups/conversations')
      ]);

      const users = usersRes.data.data || [];
      const conversations = convosRes.data.data || [];

      // Build initial unread counts from MongoDB conversations
      const initialUnreads = {};
      conversations.forEach((c) => {
        if (c.unreadCount && c.unreadCount > 0) {
          if (c.isGroup) {
            initialUnreads[c._id] = c.unreadCount;
          } else {
            const otherUser = c.participants?.find((p) => (p._id || p)?.toString() !== authUser?._id?.toString());
            if (otherUser) {
              const otherId = otherUser._id || otherUser;
              initialUnreads[otherId] = c.unreadCount;
            }
          }
        }
      });

      set({ 
        users, 
        conversations, 
        unreadCounts: initialUnreads,
        isUsersLoading: false 
      });
    } catch (error) {
      toast.error('Failed to get data');
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (targetId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${targetId}`);
      set({ messages: res.data.data });
      // Opening the chat also clears the unread count in store
      set((state) => ({
        unreadCounts: {
          ...state.unreadCounts,
          [targetId]: 0
        }
      }));
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

    socket.off("receive_message");
    socket.off("message_updated");

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
      const senderId = typeof newMessage.sender === 'object' ? newMessage.sender?._id : newMessage.sender;
      const isFromUser = !selectedUser?.isGroup && senderId === selectedUser?._id;
      const isForActiveChat = isForGroup || isFromUser;

      if (isForActiveChat) {
        set((state) => ({ messages: [...state.messages, newMessage] }));
        const targetId = isForGroup ? newMessage.conversation : senderId;
        if (targetId) {
          axiosInstance.put(`/messages/read/${targetId}`).catch(() => {});
        }
      } else {
        const badgeId = newMessage.conversationType === 'group' ? newMessage.conversation : senderId;
        if (badgeId) incrementUnread(badgeId);
      }
      
      set((state) => {
        let found = false;
        const updatedConvos = state.conversations.map(c => {
          if (c._id === newMessage.conversation) {
            found = true;
            return { ...c, lastMessage: newMessage };
          }
          return c;
        });
        if (!found) {
          get().getUsers();
        }
        return { conversations: updatedConvos };
      });
    });
  },

  stopListeningToMessages: () => {
    const socket = useSocketStore.getState().socket;
    if (!socket) return;
    socket.off("receive_message");
    socket.off("message_updated");
  },

  setSelectedUser: (user) => set({ selectedUser: user, replyingTo: null }),
  setReplyingTo: (message) => set({ replyingTo: message }),
  
  togglePinMessage: async (messageId) => {
    try {
      const res = await axiosInstance.put(`/messages/${messageId}/pin`);
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
