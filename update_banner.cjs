const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/chat/ChatWindow.jsx', 'utf8');

// 1. Add currentPinIndex state
if (!content.includes('currentPinIndex')) {
  content = content.replace(
    /const \[isInputFocused, setIsInputFocused\] = useState\(false\);/,
    `const [isInputFocused, setIsInputFocused] = useState(false);\n  const [currentPinIndex, setCurrentPinIndex] = useState(0);`
  );
}

// 2. Replace the old Banner code with Telegram-style banner
const newBanner = `
      {/* Pinned Messages Banner - Telegram Style */}
      {(() => {
        const pinnedMessages = messages.filter(m => m.isPinned);
        if (pinnedMessages.length === 0) return null;
        
        // Ensure index is valid if messages are unpinned
        const safeIndex = currentPinIndex >= pinnedMessages.length ? 0 : currentPinIndex;
        const currentPinnedMsg = pinnedMessages[safeIndex];
        
        const handleBannerClick = () => {
          if (!currentPinnedMsg) return;
          
          // Scroll and highlight
          const el = document.getElementById(\`msg-\${currentPinnedMsg._id}\`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('bg-zinc-100', 'dark:bg-zinc-700/50', 'transition-colors', 'duration-500');
            setTimeout(() => el.classList.remove('bg-zinc-100', 'dark:bg-zinc-700/50'), 2000);
          }
          
          // Cycle to next pinned message
          if (pinnedMessages.length > 1) {
            setCurrentPinIndex((prev) => (prev + 1) % pinnedMessages.length);
          }
        };

        return (
          <div 
            onClick={handleBannerClick}
            className="bg-zinc-50 border-b border-zinc-200 px-6 py-2 shadow-sm relative z-10 dark:bg-zinc-800/60 dark:border-zinc-700 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="text-yellow-500">
                <Pin size={18} className="fill-current" />
              </div>
              <div className="flex-1 overflow-hidden border-l-2 border-yellow-500 pl-3">
                <div className="text-[13px] font-semibold text-zinc-800 dark:text-zinc-200 flex justify-between items-center">
                  <span>Pinned Message</span>
                  {pinnedMessages.length > 1 && (
                    <span className="text-[11px] font-normal text-zinc-500 bg-zinc-200 dark:bg-zinc-700 px-1.5 py-0.5 rounded-md">
                      {safeIndex + 1} / {pinnedMessages.length}
                    </span>
                  )}
                </div>
                <div className="text-[13px] text-zinc-600 dark:text-zinc-400 truncate">
                  {getPreviewText(currentPinnedMsg.content)}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Messages */}`;

// Replace the old banner code block
const oldBannerRegex = /\{\/\* Pinned Messages Banner \*\/\}[\s\S]*?\{\/\* Messages \*\/\}/;
content = content.replace(oldBannerRegex, newBanner);

fs.writeFileSync('frontend/src/components/chat/ChatWindow.jsx', content);
console.log('Updated to Telegram-style Pinned Banner!');
