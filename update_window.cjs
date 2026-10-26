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
content = content.replace(
  /const \{ messages, isMessagesLoading, selectedUser, sendImageMessage, sendMessage, replyingTo, setReplyingTo \} = useChatStore\(\);/,
  "const { messages, isMessagesLoading, selectedUser, sendImageMessage, sendMessage, replyingTo, setReplyingTo, togglePinMessage } = useChatStore();"
);

// 3. Add Banner at the top of the messages list
if (!content.includes('pinnedMessages.length > 0')) {
  const bannerCode = `
      {/* Pinned Messages Banner */}
      {messages.filter(m => m.isPinned).length > 0 && (
        <div className="w-full bg-brand-primary/10 border-b border-brand-primary/20 px-4 py-2 flex flex-col gap-1 z-10 sticky top-0 backdrop-blur-md">
          <div className="flex items-center gap-2 text-brand-primary text-[12px] font-bold uppercase tracking-wider">
            <Pin size={14} /> Pinned Messages ({messages.filter(m => m.isPinned).length})
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

// 4. Add Pin button next to Reply button
if (!content.includes('onClick={() => togglePinMessage(msg._id)}')) {
  const pinButton = `
                            <button
                              type="button"
                              onClick={() => togglePinMessage(msg._id)}
                              className={isMe ? 'reaction-outgoing mr-8' : 'reaction-incoming ml-8'}
                              aria-label="Pin message"
                              style={{ transform: isMe ? 'translateX(-100%)' : 'translateX(100%)' }}
                            >
                              <Pin size={17} aria-hidden="true" className={msg.isPinned ? "fill-current" : ""} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setReplyingTo(msg)}`;

  content = content.replace(
    /<button\s*type="button"\s*onClick=\{\(\) => setReplyingTo\(msg\)\}/m,
    pinButton
  );
}

// 5. Add visual marker inside bubble
if (!content.includes('msg.isPinned &&')) {
  const markerCode = `
                            {msg.isPinned && (
                              <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">
                                <Pin size={10} className="fill-current" /> Pinned
                              </div>
                            )}
                            
                            {/* Reply Box (Modern Glass Style) */}`;
                            
  content = content.replace(
    /\{\/\* Reply Box \(Modern Glass Style\) \*\/\}/m,
    markerCode
  );
}

fs.writeFileSync(file, content);
console.log('Updated ChatWindow.jsx');
