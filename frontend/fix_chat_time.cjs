const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

const oldContentRegex = /\{\/\* Message Content \*\/\}\s*\{msg\.content && <span>\{msg\.content\}<\/span>\}/m;

const newContentBlock = `{/* Message Content */}
                            {msg.content && <span className="mb-0.5">{msg.content}</span>}
                            
                            {/* Individual Timestamp */}
                            <span className={\`text-[10px] font-medium leading-none self-end \${isMe ? 'text-white/70' : 'text-[#8E8E93]'}\`}>
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                            </span>`;

content = content.replace(oldContentRegex, newContentBlock);

fs.writeFileSync(file, content);
console.log('Done');
