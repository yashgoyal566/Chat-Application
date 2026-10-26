const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/chat/ChatWindow.jsx', 'utf8');

// The hover menu Pin button currently looks like:
/*
                                <button
                                  type="button"
                                  onClick={() => togglePinMessage(msg._id)}
                                  aria-label="Pin message"
                                  className={`p-1.5 rounded-full transition-all ${isMe ? 'hover:bg-black/10' : 'hover:bg-white/20 hover:scale-110'}`}
                                >
                                  <Pin size={17} className={msg.isPinned ? "fill-current" : ""} />
                                </button>
*/

// Add e.stopPropagation() and explicit color change when pinned
content = content.replace(
  /onClick=\{\(\) => togglePinMessage\(msg\._id\)\}/,
  `onClick={(e) => { e.stopPropagation(); togglePinMessage(msg._id); }}`
);

content = content.replace(
  /<Pin size=\{17\} className=\{msg\.isPinned \? "fill-current" : ""\} \/>/,
  `<Pin size={17} className={msg.isPinned ? "fill-current text-yellow-400 dark:text-yellow-500" : ""} />`
);

fs.writeFileSync('frontend/src/components/chat/ChatWindow.jsx', content);
console.log('Fixed Pin button in hover menu!');
