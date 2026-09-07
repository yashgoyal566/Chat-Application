const fs = require('fs');
const file = 'src/components/chat/ChatSidebar.jsx';
let content = fs.readFileSync(file, 'utf8');

// Update useChatStore imports
content = content.replace(
  /const \{ users, getUsers, selectedUser, setSelectedUser, isUsersLoading, conversations \} = useChatStore\(\);/,
  'const { users, getUsers, selectedUser, setSelectedUser, isUsersLoading, conversations, drafts } = useChatStore();'
);

// Update rendering of the last message to check for drafts first
const oldPreview = /\{item\.lastMessage \?\s*\(\s*typeof item\.lastMessage === 'string' \? 'Sent a message' : \(item\.lastMessage\.image \? '.. Photo' : item\.lastMessage\.content\?\.replace\(\/<\[\^>\]\*\>\?\/gm, ''\)\)\s*\) : \(\s*item\.isGroup \? 'Group Chat' : 'Start a conversation'\s*\)\}/m;

const newPreview = `{(() => {
                      const rawDraft = drafts[item._id] || '';
                      const cleanDraft = rawDraft.replace(/<[^>]*>?/gm, '').trim();
                      if (cleanDraft) {
                        return <span className="text-[#00A884] font-medium tracking-tight">Draft: <span className="text-[#8E8E93] font-normal">{cleanDraft}</span></span>;
                      }
                      return item.lastMessage ? (
                        typeof item.lastMessage === 'string' ? 'Sent a message' : (item.lastMessage.image ? '📷 Photo' : item.lastMessage.content?.replace(/<[^>]*>?/gm, ''))
                      ) : (
                        item.isGroup ? 'Group Chat' : 'Start a conversation'
                      );
                    })()}`;

content = content.replace(oldPreview, newPreview);

fs.writeFileSync(file, content);
console.log('Added drafts to sidebar!');
