const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// Find the start of the message map
const startIndex = content.indexOf('{messages.map((msg, index) => {');
// Find the end of the message map block
const endIndex = content.indexOf('</AnimatePresence>', startIndex);

if (startIndex !== -1 && endIndex !== -1) {
  const newMapBlock = `{messages.map((msg, index) => {
                const isMe = (msg.sender._id || msg.sender) === authUser._id;
                const isHighlighted = highlightedMsgId === msg._id;
                
                return (
                  <motion.div
                    key={msg._id || index}
                    id={\`msg-\${msg._id}\`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={\`group flex w-full mb-1 \${isMe ? 'justify-end' : 'justify-start'}\`}
                  >
                    {/* Action Menu (Reply) */}
                    {isMe && (
                      <button 
                        onClick={() => setReplyingTo(msg)}
                        className="mr-2 hidden h-8 w-8 items-center justify-center self-center rounded-full text-zinc-400 hover:bg-zinc-100 group-hover:flex dark:hover:bg-zinc-800"
                      >
                        <Reply size={14} />
                      </button>
                    )}
                    
                    <div className={\`flex items-end max-w-[75%] \${isMe ? 'flex-row-reverse' : 'flex-row'}\`}>
                      
                      {/* Avatar (Only for incoming) */}
                      {!isMe && (
                        <div className="flex-shrink-0 mr-2 h-7 w-7 rounded-full overflow-hidden bg-zinc-300">
                          {msg.sender?.profilePicture ? (
                            <img src={msg.sender.profilePicture} alt="Avatar" className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-zinc-500 uppercase">
                              {msg.sender?.fullName?.charAt(0) || '?'}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Bubble Container */}
                      <div className="flex flex-col">
                        
                        {/* Name (Only for incoming) */}
                        {!isMe && (
                          <span className="text-[11px] text-[#8E8E93] ml-3 mb-1">
                            {msg.sender?.fullName || 'User'}
                          </span>
                        )}

                        {/* Actual Bubble */}
                        <div
                          className={\`relative flex flex-col rounded-3xl px-[16px] py-[10px] text-[15px] leading-[1.3] \${
                            isHighlighted ? 'ring-2 ring-brand-primary ring-offset-2' : ''
                          } \${
                            isMe
                              ? 'bg-[#007AFF] text-white rounded-br-[4px]'
                              : 'bg-[#E5E5EA] text-black rounded-bl-[4px] dark:bg-[#262628] dark:text-white'
                          }\`}
                        >
                          {/* Reply Box (Subtle inset) */}
                          {msg.replyTo && (
                            <div 
                              onClick={() => scrollToMessage(msg.replyTo._id)}
                              className={\`mb-2 flex flex-col justify-center cursor-pointer rounded-xl px-3 py-1.5 transition-opacity hover:opacity-90 \${
                                isMe 
                                  ? 'bg-black/20' 
                                  : 'bg-black/5 dark:bg-white/10'
                              }\`}
                            >
                              <span className={\`text-[12px] font-bold \${isMe ? 'text-white' : 'text-black dark:text-white'}\`}>
                                {(msg.replyTo.sender._id || msg.replyTo.sender) === authUser._id ? 'You' : (msg.replyTo.sender?.fullName || 'Unknown')}
                              </span>
                              {msg.replyTo.content && (
                                <span className={\`truncate text-[12px] \${isMe ? 'text-white/90' : 'text-zinc-600 dark:text-zinc-300'}\`}>
                                  {msg.replyTo.content}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Message Content */}
                          {msg.content && <span>{msg.content}</span>}
                        </div>
                      </div>
                    </div>

                    {/* Action Menu (Reply) */}
                    {!isMe && (
                      <button 
                        onClick={() => setReplyingTo(msg)}
                        className="ml-2 hidden h-8 w-8 items-center justify-center self-center rounded-full text-zinc-400 hover:bg-zinc-100 group-hover:flex dark:hover:bg-zinc-800"
                      >
                        <Reply size={14} />
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ) : (`;

  content = content.slice(0, startIndex) + newMapBlock + content.slice(endIndex + 18);
  // wait, AnimatePresence is gone if I slice it out?
  // Let's use a safer regex replacement to just replace the map block itself!
}
fs.writeFileSync('temp.txt', 'done');
