const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// The old reply block inside the bubble
const oldReplyRegex = /<div \s*onClick=\{\(\) => scrollToMessage\(msg\.replyTo\._id\)\}\s*className=\{`mb-1\.5 mt-0\.5 cursor-pointer rounded-lg border-l-\[4px\] p-2 text-\[13px\] leading-tight transition-opacity hover:opacity-90 \$\{\s*isMe \s*\? 'border-\[#90CAF9\] bg-black\/10 text-white\/90' \s*: 'border-\[#027EB5\] bg-black\/5 dark:bg-white\/10 text-zinc-600 dark:text-zinc-300'\s*\}`\}\s*>\s*<p className=\{`font-semibold mb-0\.5 \$\{isMe \? 'text-\[#90CAF9\]' : 'text-\[#027EB5\]'\}`\}>\{msg\.replyTo\.sender\?\.fullName \|\| 'Unknown'\}<\/p>\s*\{msg\.replyTo\.content && \(\s*<p className=\{`truncate text-xs \$\{isMe \? 'text-white\/80' : 'text-zinc-500 dark:text-zinc-400'\}`\}>\{msg\.replyTo\.content\}<\/p>\s*\)\}\s*<\/div>/m;

const newReplyBlock = `<div 
                          onClick={() => scrollToMessage(msg.replyTo._id)}
                          className={\`mb-1.5 flex flex-col justify-center cursor-pointer rounded-lg border-l-[5px] pl-2.5 pr-4 py-1.5 transition-opacity hover:opacity-90 \${
                            isMe 
                              ? 'border-[#53bdeb] bg-black/20' 
                              : 'border-[#027EB5] bg-black/5 dark:bg-white/10'
                          }\`}
                        >
                          <span className={\`text-[13px] font-bold leading-tight \${isMe ? 'text-[#53bdeb]' : 'text-[#027EB5]'}\`}>
                            {(msg.replyTo.sender._id || msg.replyTo.sender) === authUser._id ? 'You' : (msg.replyTo.sender?.fullName || 'Unknown')}
                          </span>
                          {msg.replyTo.content && (
                            <span className={\`truncate text-[13px] leading-tight mt-0.5 \${isMe ? 'text-white/90' : 'text-zinc-600 dark:text-zinc-300'}\`}>
                              {msg.replyTo.content}
                            </span>
                          )}
                        </div>`;

content = content.replace(oldReplyBlockRegex, newReplyBlock);

fs.writeFileSync(file, content);
