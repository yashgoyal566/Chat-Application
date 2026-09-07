const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the muddy reply box with a modern, glass-like UI
const oldReplyRegex = /\{\/\* Reply Box \(WhatsApp Style\) \*\/\}\s*\{msg\.replyTo && \([\s\S]*?<\/div>\s*\)\}/m;

const newReplyBlock = `{/* Reply Box (Modern Glass Style) */}
                            {msg.replyTo && (
                              <div 
                                onClick={() => scrollToMessage(msg.replyTo._id)}
                                className={\`mb-2 flex self-stretch flex-col justify-center cursor-pointer rounded-lg border-l-[3px] pl-2.5 pr-3 py-1.5 transition-all hover:opacity-80 active:scale-[0.98] \${
                                  isMe 
                                    ? 'border-white/60 bg-white/15' 
                                    : 'border-[#007AFF]/60 bg-[#007AFF]/[0.08] dark:bg-white/10'
                                }\`}
                              >
                                <span className={\`text-[12px] font-semibold tracking-tight \${isMe ? 'text-white' : 'text-[#007AFF] dark:text-[#53bdeb]'}\`}>
                                  {(msg.replyTo.sender._id || msg.replyTo.sender) === authUser._id ? 'You' : (msg.replyTo.sender?.fullName || 'Unknown')}
                                </span>
                                {msg.replyTo.content && (
                                  <span className={\`truncate text-[13px] leading-snug mt-0.5 \${isMe ? 'text-white/90' : 'text-zinc-700 dark:text-zinc-300'}\`}>
                                    {msg.replyTo.content}
                                  </span>
                                )}
                              </div>
                            )}`;

content = content.replace(oldReplyRegex, newReplyBlock);
fs.writeFileSync(file, content);
