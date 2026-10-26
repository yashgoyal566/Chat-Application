const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/chat/ChatWindow.jsx', 'utf8');

// 1. Ensure currentPinIndex state exists
if (!content.includes('currentPinIndex')) {
  content = content.replace(
    /const \[isInputFocused, setIsInputFocused\] = useState\(false\);/,
    `const [isInputFocused, setIsInputFocused] = useState(false);\n  const [currentPinIndex, setCurrentPinIndex] = useState(0);`
  );
}

// 2. Add the banner and wrapper
const newBannerAndWrapper = `      {/* Wrapper for Banner and Messages to prevent layout shift */}
      <div className="flex-1 relative flex flex-col overflow-hidden">
        
        {/* Pinned Messages Banner - Telegram/WhatsApp Style */}
        {(() => {
          const pinnedMessages = messages.filter(m => m.isPinned);
          if (pinnedMessages.length === 0) return null;
          
          const safeIndex = currentPinIndex >= pinnedMessages.length ? 0 : currentPinIndex;
          const currentPinnedMsg = pinnedMessages[safeIndex];
          
          const handleBannerClick = () => {
            if (!currentPinnedMsg) return;
            
            const el = document.getElementById(\`msg-\${currentPinnedMsg._id}\`);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              
              // WhatsApp style: subtle translucent black/white highlight
              el.classList.add('bg-black/10', 'dark:bg-white/10', 'transition-colors', 'duration-1000');
              setTimeout(() => {
                el.classList.remove('bg-black/10', 'dark:bg-white/10');
              }, 1500);
            }
            
            if (pinnedMessages.length > 1) {
              setCurrentPinIndex((prev) => (prev + 1) % pinnedMessages.length);
            }
          };

          return (
            <div 
              onClick={handleBannerClick}
              className="absolute top-0 left-0 right-0 z-20 bg-zinc-50/95 backdrop-blur-sm border-b border-zinc-200 px-6 py-2 shadow-sm dark:bg-zinc-800/80 dark:border-zinc-700 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="text-yellow-500">
                  <Pin size={18} className="fill-current" />
                </div>
                <div className="flex-1 overflow-hidden border-l-2 border-yellow-500 pl-3">
                  <div className="flex-1 flex justify-between items-center w-full">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-zinc-800 dark:text-zinc-200">Pinned Message</span>
                      {pinnedMessages.length > 1 && (
                        <span className="text-[11px] font-normal text-zinc-500 bg-zinc-200 dark:bg-zinc-700 px-1.5 py-0.5 rounded-md">
                          {safeIndex + 1} / {pinnedMessages.length}
                        </span>
                      )}
                    </div>
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
                  </div>
                  <div className="text-[13px] text-zinc-600 dark:text-zinc-400 truncate">
                    {getPreviewText(currentPinnedMsg.content)}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Messages Container (pt-16 ensures top messages aren't hidden by absolute banner) */}
        <div className="flex-1 overflow-y-auto px-6 pt-16 pb-[140px] ">`;

content = content.replace(
  /<div className="flex-1 overflow-y-auto px-6 pt-6 pb-\[140px\] ">/,
  newBannerAndWrapper
);

// 3. Close the wrapper right before Input (Floating)
content = content.replace(
  /\{\/\* Input \(Floating\) \*\/\}/,
  `</div>\n\n        {/* Input (Floating) */}`
);

// 4. Add e.stopPropagation() and yellow color to the message pin button
content = content.replace(
  /onClick=\{\(\) => togglePinMessage\(msg\._id\)\}/,
  `onClick={(e) => { e.stopPropagation(); togglePinMessage(msg._id); }}`
);
content = content.replace(
  /<Pin size=\{17\} className=\{msg\.isPinned \? "fill-current" : ""\} \/>/,
  `<Pin size={17} className={msg.isPinned ? "fill-current text-yellow-400 dark:text-yellow-500" : ""} />`
);

fs.writeFileSync('frontend/src/components/chat/ChatWindow.jsx', content);
console.log('Fully rebuilt banner with layout shift fix!');
