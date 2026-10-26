const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/chat/ChatWindow.jsx', 'utf8');

const targetStr = `<span>Pinned Message</span>`;
const replaceStr = `<div className="flex-1 flex justify-between items-center w-full">
                    <span>Pinned Message</span>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePinMessage(currentPinnedMsg._id);
                      }}
                      className="ml-auto text-zinc-400 hover:text-red-500 p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition-all"
                      title="Unpin Message"
                    >
                      <X size={16} />
                    </button>
                  </div>`;

content = content.replace(targetStr, replaceStr);
fs.writeFileSync('frontend/src/components/chat/ChatWindow.jsx', content);
console.log('Added Unpin X button to the top banner!');
