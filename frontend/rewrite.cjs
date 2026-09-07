const fs = require('fs');
const file = 'src/context/useChatStore.js';
let content = fs.readFileSync(file, 'utf8');

// I will just replace the entire listenToMessages function.
const newListenToMessages = `  listenToMessages: () => {
    const socket = useSocketStore.getState().socket;
    if (!socket) return;

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
        return { conversations: updatedConvos };
      });
    });
  },`;

content = content.replace(
  /listenToMessages: \(\) => \{[\s\S]*?stopListeningToMessages: \(\) => \{/g,
  newListenToMessages + '\n\n  stopListeningToMessages: () => {'
);

fs.writeFileSync(file, content);
console.log('Successfully replaced listenToMessages!');
