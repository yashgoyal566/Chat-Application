const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

const oldReplyBlockRegex = /\{msg\.replyTo && \([\s\S]*?<div \s*onClick=\{\(\) => scrollToMessage\(msg\.replyTo\._id\)\}[\s\S]*?<\/div>\s*\)\}/m;

const newReplyBlock = `{msg.replyTo && (
                        <div 
                          onClick={() => scrollToMessage(msg.replyTo._id)}
                          className={\`mb-1.5 flex w-full flex-col items-start justify-center cursor-pointer rounded-l-sm rounded-r-md border-l-[4px] pl-2.5 pr-4 py-1.5 text-left transition-opacity hover:opacity-90 \${
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
                      )}`;

content = content.replace(oldReplyBlockRegex, newReplyBlock);

fs.writeFileSync(file, content);
