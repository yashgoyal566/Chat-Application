const fs = require('fs');
const file = 'frontend/src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove the bottom row I added earlier and restore the standard Timestamp
const bottomRowRegex = /\{\/\* Bottom Row: Actions & Timestamp \*\/\}\s*<div className=\{`flex items-center gap-3 mt-1 self-end \$\{isMe \? 'text-white\/80' : 'text-\[#8E8E93\]'\}`\}>[\s\S]*?<\/span>\s*<\/div>/m;
const cleanTimestamp = `
                            {/* Individual Timestamp */}
                            <span className={\`text-[10px] font-medium leading-none self-end \${isMe ? 'text-white/70' : 'text-[#8E8E93]'}\`}>
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                            </span>`;
content = content.replace(bottomRowRegex, cleanTimestamp);

// 2. Add the floating menu with both buttons right below the bubble container opening tag
const bubbleContainerRegex = /<div\s*className=\{`relative flex flex-col w-fit max-w-full rounded-\[25px\] px-\[16px\] py-\[10px\] text-\[15px\] leading-\[1\.3\] \$\{[\s\S]*?\$\{[\s\S]*?\}`\}\s*>/m;

// Find the bubble container opening tag to insert the floating menu right after it
const match = content.match(bubbleContainerRegex);
if (match) {
  const floatingMenu = `
                            {/* Floating Hover Actions */}
                            <div className={isMe ? 'reaction-outgoing flex items-center gap-2' : 'reaction-incoming flex items-center gap-2'}>
                              <button
                                type="button"
                                onClick={() => togglePinMessage(msg._id)}
                                aria-label="Pin message"
                                className="hover:opacity-80 transition-opacity"
                              >
                                <Pin size={17} className={msg.isPinned ? "fill-current" : ""} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setReplyingTo(msg)}
                                aria-label="Reply to message"
                                className="hover:opacity-80 transition-opacity"
                              >
                                <Reply size={17} />
                              </button>
                            </div>
`;
  content = content.replace(match[0], match[0] + floatingMenu);
}

fs.writeFileSync(file, content);
console.log('Restored the floating hover menu and added the pin button to it!');
