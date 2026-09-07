const fs = require('fs');
const file = 'src/components/chat/ContactInfo.jsx';
let content = fs.readFileSync(file, 'utf8');

// Add the extraction of messages
content = content.replace(
  /const \{ onlineUsers \} = useSocketStore\(\);/,
  "const { onlineUsers } = useSocketStore();\n  const { messages } = useChatStore();\n  const recentMessages = (messages || []).slice(-3);"
);

// Add the rendering of recent messages
const newConversationBlock = `
{/* Conversation */}
      <div className="flex flex-col p-6 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-[15px] font-semibold text-zinc-800 dark:text-zinc-200">Recent Conversations</h4>
        </div>
        
        <div className="flex flex-col gap-3">
          {recentMessages.length === 0 ? (
            <p className="text-[13px] text-zinc-400 italic">No recent messages.</p>
          ) : (
            recentMessages.map((msg, index) => {
              const isMe = (msg.sender._id || msg.sender) !== user._id;
              
              // Strip HTML for a clean preview, just like the sidebar does
              const previewText = (msg.content || '').replace(/<[^>]*>?/gm, '').trim();

              return (
                <div key={msg._id || index} className="flex flex-col gap-1 rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800/50">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-zinc-700 dark:text-zinc-300">
                      {isMe ? 'You' : user.fullName}
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                    </span>
                  </div>
                  <span className="text-[13px] text-zinc-600 dark:text-zinc-400 truncate">
                    {previewText || 'Attachment...'}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
`;

// Replace the user's placeholder block
content = content.replace(
  /\{\/\* Conversation \*\/\}[\s\S]*?<\/div>\s*<\/div>/,
  newConversationBlock
);

fs.writeFileSync(file, content);
console.log('Injected recent messages into ContactInfo.jsx');
