const fs = require('fs');
const file = 'src/context/useChatStore.js';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove the rogue newMessage block if it exists
content = content.replace(
  /socket\.on\("newMessage", \(\) => \{[\s\S]*?\}\);\s*/g,
  ''
);
// Also try another regex if the arguments varied
content = content.replace(
  /socket\.on\("newMessage", \(newMessage\) => \{[\s\S]*?\}\);\s*/g,
  ''
);

// 2. Replace the receive_message block
const newReceiveMessage = `    socket.on("receive_message", (newMessage) => {
      const { selectedUser, incrementUnread } = get();
      
      const isForGroup = selectedUser?.isGroup && newMessage.conversation === selectedUser?._id;
      const isFromUser = !selectedUser?.isGroup && newMessage.sender?._id === selectedUser?._id;
      const isForActiveChat = isForGroup || isFromUser;

      if (isForActiveChat) {
        set((state) => ({ messages: [...state.messages, newMessage] }));
      } else {
        const badgeId = newMessage.conversationType === 'group' ? newMessage.conversation : newMessage.sender?._id;
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
    });`;

content = content.replace(
  /socket\.on\("receive_message", \(newMessage\) => \{[\s\S]*?\}\);/m,
  newReceiveMessage
);

fs.writeFileSync(file, content);
console.log('Fixed useChatStore.js');
