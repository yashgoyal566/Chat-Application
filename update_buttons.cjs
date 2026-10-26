const fs = require('fs');
const file = 'frontend/src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add Pin to lucide-react imports
if (!content.includes('Pin')) {
  content = content.replace(
    /import \{ (.*?) \} from 'lucide-react';/,
    "import { $1, Pin } from 'lucide-react';"
  );
}

// 2. Destructure togglePinMessage
if (!content.includes('togglePinMessage')) {
  content = content.replace(
    /const \{ messages, isMessagesLoading, selectedUser, sendImageMessage, sendMessage, replyingTo, setReplyingTo \} = useChatStore\(\);/,
    "const { messages, isMessagesLoading, selectedUser, sendImageMessage, sendMessage, replyingTo, setReplyingTo, togglePinMessage } = useChatStore();"
  );
}

// 3. Replace the old Reply button and Timestamp with a unified bottom row INSIDE the bubble
const oldReplyBtnRegex = /<button\s*type="button"\s*onClick=\{\(\) => setReplyingTo\(msg\)\}\s*className=\{isMe \? 'reaction-outgoing' : 'reaction-incoming'\}\s*aria-label="Reply to message"\s*>\s*<Reply size=\{17\} aria-hidden="true" \/>\s*<\/button>/m;

content = content.replace(oldReplyBtnRegex, '');

const oldTimestampRegex = /\{\/\* Individual Timestamp \*\/\}\s*<span className=\{`text-\[10px\] font-medium leading-none self-end \$\{isMe \? 'text-white\/70' : 'text-\[#8E8E93\]'\}`\}>\s*\{new Date\(msg\.createdAt\)\.toLocaleTimeString\(\[\], \{ hour: 'numeric', minute: '2-digit' \}\)\}\s*<\/span>/m;

const newBottomRow = `
                            {/* Bottom Row: Actions & Timestamp */}
                            <div className={\`flex items-center gap-3 mt-1 self-end \${isMe ? 'text-white/80' : 'text-[#8E8E93]'}\`}>
                              
                              {/* Pin Button */}
                              <button 
                                type="button"
                                onClick={() => togglePinMessage(msg._id)} 
                                className="hover:scale-110 transition-transform flex items-center justify-center"
                                aria-label="Pin message"
                              >
                                <Pin size={13} className={msg.isPinned ? "fill-current text-yellow-400" : ""} />
                              </button>
                              
                              {/* Reply Button */}
                              <button 
                                type="button"
                                onClick={() => setReplyingTo(msg)} 
                                className="hover:scale-110 transition-transform flex items-center justify-center"
                                aria-label="Reply to message"
                              >
                                <Reply size={13} />
                              </button>

                              {/* Timestamp */}
                              <span className="text-[10px] font-medium leading-none">
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                              </span>
                            </div>`;

content = content.replace(oldTimestampRegex, newBottomRow);


// 4. Add Banner at the top of the messages list
if (!content.includes('Pinned Messages Banner')) {
  const bannerCode = `
        {/* Pinned Messages Banner */}
        {messages.filter(m => m.isPinned).length > 0 && (
          <div className="w-full bg-brand-primary/10 border-b border-brand-primary/20 px-4 py-2 flex flex-col gap-1 z-10 sticky top-0 backdrop-blur-md">
            <div className="flex items-center gap-2 text-brand-primary text-[12px] font-bold uppercase tracking-wider">
              <Pin size={14} className="fill-current" /> Pinned Messages ({messages.filter(m => m.isPinned).length})
            </div>
            <div className="flex flex-col gap-1 max-h-[80px] overflow-y-auto">
              {messages.filter(m => m.isPinned).map(pinnedMsg => (
                <div 
                  key={pinnedMsg._id} 
                  onClick={() => scrollToMessage(pinnedMsg._id)}
                  className="text-[13px] text-zinc-700 dark:text-zinc-300 truncate cursor-pointer hover:underline"
                >
                  <span className="font-semibold">{pinnedMsg.sender?.fullName || 'User'}:</span> {getPreviewText(pinnedMsg.content)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 pt-6 pb-[140px] ">`;

  content = content.replace(
    /\{\/\* Messages \*\/\}\s*<div className="flex-1 overflow-y-auto px-6 pt-6 pb-\[140px\] ">/m,
    bannerCode
  );
}

fs.writeFileSync(file, content);
console.log('Successfully injected buttons inside the bubble!');
