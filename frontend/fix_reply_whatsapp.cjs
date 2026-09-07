const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

const oldReplyBlock = /\{\/\* Reply Box \(Subtle inset\) \*\/\}\s*\{msg\.replyTo && \([\s\S]*?<\/div>\s*\)\}/m;

const newReplyBlock = `{/* Reply Box (WhatsApp Style) */}
                            {msg.replyTo && (
                              <div 
                                onClick={() => scrollToMessage(msg.replyTo._id)}
                                className={\`mb-1.5 flex self-stretch flex-col items-start justify-center cursor-pointer rounded-l-none rounded-r-lg border-l-[4px] pl-2 pr-3 py-1 text-left transition-opacity hover:opacity-90 \${
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

content = content.replace(oldReplyBlock, newReplyBlock);

fs.writeFileSync(file, content);
