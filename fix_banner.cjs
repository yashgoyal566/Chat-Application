const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/chat/ChatWindow.jsx', 'utf8');

const bannerCode = `
      {/* Pinned Messages Banner */}
      {messages.some(m => m.isPinned) && (
        <div className="bg-zinc-50 border-b border-zinc-200 px-6 py-2 shadow-sm relative z-10 dark:bg-zinc-800/60 dark:border-zinc-700">
          <div className="flex items-start gap-3">
            <div className="mt-1 text-yellow-500">
              <Pin size={16} className="fill-current" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1 dark:text-zinc-400">Pinned Messages</div>
              <div className="flex flex-col gap-1 max-h-[80px] overflow-y-auto pr-2 custom-scrollbar">
                {messages.filter(m => m.isPinned).map(pinnedMsg => (
                  <div 
                    key={pinnedMsg._id} 
                    onClick={() => {
                      const el = document.getElementById(\`msg-\${pinnedMsg._id}\`);
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        el.classList.add('bg-zinc-100', 'dark:bg-zinc-700/50', 'transition-colors', 'duration-500');
                        setTimeout(() => el.classList.remove('bg-zinc-100', 'dark:bg-zinc-700/50'), 2000);
                      }
                    }}
                    className="text-[13px] text-zinc-700 dark:text-zinc-300 truncate cursor-pointer hover:underline"
                  >
                    <span className="font-semibold">{pinnedMsg.sender?.fullName || 'User'}:</span> {getPreviewText(pinnedMsg.content)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-[140px] ">`;

content = content.replace(
  /\{\/\* Messages \*\/\}\s*<div className="flex-1 overflow-y-auto px-6 pt-6 pb-\[140px\] ">/,
  bannerCode
);

fs.writeFileSync('frontend/src/components/chat/ChatWindow.jsx', content);
console.log('Restored Pinned Messages Banner!');
