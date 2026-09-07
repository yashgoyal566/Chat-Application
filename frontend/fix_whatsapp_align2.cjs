const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// I will locate the start of `{msg.replyTo && (` and replace everything up to the closing `</div>`

const startIndex = content.indexOf('{msg.replyTo && (');
if (startIndex !== -1) {
  // Find the exact closing div for the reply box
  // It's right before `{/* Message Content */}` or `{msg.image`
  const endIndex = content.indexOf('{msg.content && (<p>{msg.content}</p>)}', startIndex);
  
  if (endIndex !== -1) {
    const newReplyBlock = `{msg.replyTo && (
                        <div 
                          onClick={() => scrollToMessage(msg.replyTo._id)}
                          className={\`mb-1.5 flex flex-col justify-center cursor-pointer rounded-lg border-l-[4px] pl-2.5 pr-4 py-1.5 transition-opacity hover:opacity-90 \${
                            isMe 
                              ? 'border-[#53bdeb] bg-black/20' 
                              : 'border-[#027EB5] bg-black/5 dark:bg-white/10'
                          }\`}
                        >
                          <span className={\`text-[13px] font-bold leading-none \${isMe ? 'text-[#53bdeb]' : 'text-[#027EB5]'}\`}>
                            {(msg.replyTo.sender._id || msg.replyTo.sender) === authUser._id ? 'You' : (msg.replyTo.sender?.fullName || 'Unknown')}
                          </span>
                          {msg.replyTo.content && (
                            <span className={\`truncate text-[13px] mt-1 leading-none \${isMe ? 'text-white/90' : 'text-zinc-600 dark:text-zinc-300'}\`}>
                              {msg.replyTo.content}
                            </span>
                          )}
                        </div>
                      )}
                      `;
                      
    content = content.slice(0, startIndex) + newReplyBlock + content.slice(endIndex);
    fs.writeFileSync(file, content);
  }
}
