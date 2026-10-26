import React from 'react';
﻿import { useEffect, useState, useRef } from 'react';
import { useChatStore } from '../../context/useChatStore';
import { useAuthStore } from '../../context/useAuthStore';
import { useSocketStore } from '../../context/useSocketStore';
import { Send, Loader2, X, Reply, Bold, Italic, Underline, Smile, Paperclip, Mic, ArrowUp, Pin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import ContactInfo from './ContactInfo';
import toast from 'react-hot-toast';


const parseFormattedText = (text) => {
  if (!text) return null;
  const parts = text.split(/(<\/?b>|<\/?i>|<\/?u>)/g);
  let isBold = false;
  let isItalic = false;
  let isUnderline = false;
  
  return parts.map((part, index) => {
    if (part === '<b>') { isBold = true; return null; }
    if (part === '</b>') { isBold = false; return null; }
    if (part === '<i>') { isItalic = true; return null; }
    if (part === '</i>') { isItalic = false; return null; }
    if (part === '<u>') { isUnderline = true; return null; }
    if (part === '</u>') { isUnderline = false; return null; }
    
    if (!part) return null;
    
    let className = "";
    if (isBold) className += "font-bold ";
    if (isItalic) className += "italic ";
    if (isUnderline) className += "underline ";
    
    if (className) {
      return <span key={index} className={className}>{part}</span>;
    }
    return <span key={index}>{part}</span>;
  });
};

const getPreviewText = (html) => {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
};

export default function ChatWindow() {
  const { messages, getMessages, sendMessage, selectedUser, isMessagesLoading, listenToMessages, stopListeningToMessages, replyingTo, setReplyingTo, togglePinMessage, drafts = {}, setDraft } = useChatStore();
  const { socket } = useSocketStore();
  const { authUser } = useAuthStore();
  const { onlineUsers } = useSocketStore();
  
  const [content, setContent] = useState((drafts || {})[selectedUser._id] || '');
  
  useEffect(() => {
    const userId = selectedUser._id;
    const draftText = useChatStore.getState().drafts?.[userId] || '';
    setContent(draftText);
    if (messageInputRef.current && messageInputRef.current.innerHTML !== draftText) {
      messageInputRef.current.innerHTML = draftText;
    }
    // Save only when leaving this conversation, not while the user is typing.
    return () => {
      const currentDraft = messageInputRef.current?.innerHTML || '';
      const hasText = currentDraft.replace(/<[^>]*>?/gm, '').trim();
      useChatStore.getState().setDraft(userId, hasText ? currentDraft : '');
    };
  }, [selectedUser._id]);

  useEffect(() => {
    const userId = selectedUser._id;
    const saveDraftBeforeUnload = () => {
      const currentDraft = messageInputRef.current?.innerHTML || '';
      const hasText = currentDraft.replace(/<[^>]*>?/gm, '').trim();
      useChatStore.getState().setDraft(userId, hasText ? currentDraft : '');
    };

    window.addEventListener('pagehide', saveDraftBeforeUnload);
    return () => window.removeEventListener('pagehide', saveDraftBeforeUnload);
  }, [selectedUser._id]);
  
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showProfilePane, setShowProfilePane] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [currentPinIndex, setCurrentPinIndex] = useState(0);
  const [highlightedMsgId, setHighlightedMsgId] = useState(null);
  const messagesEndRef = useRef(null);

  const prevMessagesLengthRef = useRef(0);
  
  const messageInputRef = useRef(null);


    // Fetch history when user changes
  useEffect(() => {
    getMessages(selectedUser._id);
  }, [selectedUser._id, getMessages]);

  // Global listener is now in ChatLayout.jsx to fix the unread bug!

  useEffect(() => {
    setContent(localStorage.getItem(`draft_${selectedUser._id}`) || '');
  }, [selectedUser._id]);

  useEffect(() => {
    if (messages.length !== prevMessagesLengthRef.current) {
      const isNewMessage = messages.length === prevMessagesLengthRef.current + 1;
      messagesEndRef.current?.scrollIntoView({ behavior: isNewMessage ? 'smooth' : 'auto' });
      prevMessagesLengthRef.current = messages.length;
    }
  }, [messages.length]);

  useEffect(() => {
    if (replyingTo && messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }, [replyingTo]);

  useEffect(() => {
    if (!socket) return;
    const handleTyping = (data) => {
      if (data.senderId === selectedUser._id) setIsTyping(true);
    };
    const handleStopTyping = (data) => {
      if (data.senderId === selectedUser._id) setIsTyping(false);
    };

    socket.on('typing', handleTyping);
    socket.on('stop_typing', handleStopTyping);

    return () => {
      socket.off('typing', handleTyping);
      socket.off('stop_typing', handleStopTyping);
    };
  }, [socket, selectedUser]);

  let typingTimeout = null;
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };
  
  const handleInputChange = (e) => {
    const text = e.currentTarget.innerHTML;
    setContent(text);
    if (!socket) return;
    
    socket.emit('typing', { receiverId: selectedUser._id });
    if (typingTimeout) clearTimeout(typingTimeout);
    
    typingTimeout = setTimeout(() => {
      socket.emit('stop_typing', { receiverId: selectedUser._id });
    }, 2000);
  };

  
  const executeCommand = (command) => {
    document.execCommand(command, false, null);
    if (messageInputRef.current) {
      messageInputRef.current.focus();
      setContent(messageInputRef.current.innerHTML);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const htmlContent = messageInputRef.current ? messageInputRef.current.innerHTML : content;
    const strippedContent = getPreviewText(htmlContent).trim();
    if (!strippedContent) return;
    if (isSending) return;
    
    const recipientId = selectedUser._id;
    setIsSending(true);

    // A submitted message is no longer a draft, so remove it immediately.
    setContent('');
    if (messageInputRef.current) messageInputRef.current.innerHTML = '';
    setDraft(recipientId, '');

    const wasSent = await sendMessage({ content: htmlContent });
    setIsSending(false);

    // Preserve the text only when the request did not reach the server.
    if (!wasSent) {
      setContent(htmlContent);
      if (messageInputRef.current) messageInputRef.current.innerHTML = htmlContent;
      setDraft(recipientId, htmlContent);
      return;
    }

    socket?.emit('stop_typing', { receiverId: selectedUser._id });
    if (replyingTo) setReplyingTo(null);
  };

  const scrollToMessage = (msgId) => {
    const el = document.getElementById(`msg-${msgId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedMsgId(msgId);
      setTimeout(() => setHighlightedMsgId(null), 2000);
    } else {
      toast.error('Original message not found');
    }
  };


  const isOnline = selectedUser.isGroup ? false : onlineUsers.includes(selectedUser._id);

  return (
    <div className="flex h-full w-full overflow-hidden">
      <div 
        className="relative flex flex-1 h-full flex-col dark:bg-zinc-900"
      style={{
        backgroundImage: "url('/chat-bg.png')",
        backgroundRepeat: 'repeat',
        backgroundSize: '400px',
        backgroundColor: '#F2F2F7'
      }}
    >
      {/* Header */}
      <header onClick={() => setShowProfilePane(!showProfilePane)} className="flex shrink-0 items-center gap-3 border-b border-zinc-200 bg-white/80 px-6 py-4 backdrop-blur-md dark:border-zinc-800/60 dark:bg-zinc-950/80 cursor-pointer hover:bg-white/90 transition-colors">
        <div className="relative h-10 w-10 shrink-0 rounded-full bg-zinc-200 dark:bg-zinc-700">
          {selectedUser.isGroup ? (
            <div className="flex h-full w-full items-center justify-center font-medium text-zinc-500">G</div>
          ) : selectedUser.profilePicture ? (
             <img src={selectedUser.profilePicture} alt="" className="h-full w-full rounded-full object-cover" />
          ) : (
             <div className="flex h-full w-full items-center justify-center font-medium text-zinc-500">
               {selectedUser.fullName.charAt(0).toUpperCase()}
             </div>
          )}
          {isOnline && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-zinc-900"></span>
          )}
        </div>
        <div>
          <h2 className="font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">{selectedUser.fullName}</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {selectedUser.isGroup ? 'Group Chat' : isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
      </header>

      {/* Messages */}
            {/* Wrapper for Banner and Messages to prevent layout shift */}
      <div className="flex-1 relative flex flex-col overflow-hidden">
        
        {/* Pinned Messages Banner - Telegram/WhatsApp Style */}
        {(() => {
          const pinnedMessages = messages.filter(m => m.isPinned);
          if (pinnedMessages.length === 0) return null;
          
          const safeIndex = currentPinIndex >= pinnedMessages.length ? 0 : currentPinIndex;
          const currentPinnedMsg = pinnedMessages[safeIndex];
          
          const handleBannerClick = () => {
            if (!currentPinnedMsg) return;
            
            const el = document.getElementById(`msg-${currentPinnedMsg._id}`);
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
        <div className="flex-1 overflow-y-auto px-6 pt-16 pb-[140px] ">
        {isMessagesLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
          </div>
        ) : (
          <div className="flex flex-col gap-4 ">
            {messages.map((msg, index) => {
                const isMe = (msg.sender._id || msg.sender) === authUser._id;
                const isHighlighted = highlightedMsgId === msg._id;
                
                let showDivider = false;
                let timeString = '';
                if (index === 0) {
                  showDivider = true;
                } else {
                  const prevDate = new Date(messages[index - 1].createdAt);
                  const currDate = new Date(msg.createdAt);
                  // 1 hour threshold for new timestamp header
                  if (currDate - prevDate > 3600000) {
                    showDivider = true;
                  }
                }

                if (showDivider) {
                  const date = new Date(msg.createdAt);
                  const today = new Date();
                  const yesterday = new Date(today);
                  yesterday.setDate(yesterday.getDate() - 1);
                  
                  const timeOpts = { hour: 'numeric', minute: '2-digit' };
                  if (date.toDateString() === today.toDateString()) {
                    timeString = `Today ${date.toLocaleTimeString([], timeOpts)}`;
                  } else if (date.toDateString() === yesterday.toDateString()) {
                    timeString = `Yesterday ${date.toLocaleTimeString([], timeOpts)}`;
                  } else {
                    timeString = `${date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} at ${date.toLocaleTimeString([], timeOpts)}`;
                  }
                }
                
                return (
                  <React.Fragment key={msg._id || index}>
                    {showDivider && (
                      <div className="flex justify-center my-4">
                        <span className="text-[11px] font-semibold text-[#8E8E93]">
                          {timeString}
                        </span>
                      </div>
                    )}
                    <motion.div
                      id={`msg-${msg._id}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`group flex w-full mb-3 ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      
                      
                      <div className={`flex items-end min-w-0 max-w-[75%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                        
                        {/* Avatar (Only for incoming) */}
                        {!isMe && (
                          <div className="flex-shrink-0 mr-2 h-[28px] w-[28px] rounded-full overflow-hidden bg-zinc-300 ">
                            {msg.sender?.profilePicture ? (
                              <img src={msg.sender.profilePicture} alt="Avatar" className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-zinc-500 uppercase">
                                {msg.sender?.fullName?.charAt(0) || '?'}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Bubble Container */}
                        <div className={`flex flex-col min-w-0 ${isMe ? 'items-end' : 'items-start'}`}>
                          
                          {/* Name (Only for incoming) */}
                          {!isMe && (
                            <span className="text-[11px] text-[#8E8E93] ml-3 mb-1">
                              {msg.sender?.fullName || 'User'}
                            </span>
                          )}

                          {/* Actual Bubble */}
                          <div
                            className={`relative flex flex-col w-fit max-w-full rounded-[25px] px-[16px] py-[10px] text-[15px] leading-[1.3] ${
                              isHighlighted ? 'ring-2 ring-brand-primary ring-offset-2' : ''
                            } ${
                              isMe
                                ? 'bg-[#0042d5] text-white imessage-outgoing'
                                : 'bg-[#dfdfe1] text-black imessage-incoming dark:bg-[#262628] dark:text-white'
                            }`}
                          >
                            {/* Floating Hover Actions */}
                            
                            <div className={isMe ? 'reaction-outgoing flex items-center gap-1' : 'reaction-incoming flex items-center gap-1'}>
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); togglePinMessage(msg._id); }}
                                aria-label="Pin message"
                                className={`p-1.5 rounded-full transition-all ${isMe ? 'hover:bg-black/10' : 'hover:bg-white/20 hover:scale-110'}`}
                              >
                                <Pin size={17} className={msg.isPinned ? "fill-current text-yellow-400 dark:text-yellow-500" : ""} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setReplyingTo(msg)}
                                aria-label="Reply to message"
                                className={`p-1.5 rounded-full transition-all ${isMe ? 'hover:bg-black/10' : 'hover:bg-white/20 hover:scale-110'}`}
                              >
                                <Reply size={17} />
                              </button>
                            </div>

                           

                            
                            {/* Reply Box (Modern Glass Style) */}
                            {msg.replyTo && (
                              <div 
                                onClick={() => scrollToMessage(msg.replyTo._id)}
                                className={`mb-2 flex self-stretch flex-col justify-center cursor-pointer rounded-lg border-l-[3px] pl-2.5 pr-3 py-1.5 transition-all hover:opacity-80 active:scale-[0.98] ${
                                  isMe 
                                    ? 'border-white/60 bg-white/15' 
                                    : 'border-[#007AFF]/60 bg-[#007AFF]/[0.08] dark:bg-white/10'
                                }`}
                              >
                                <span className={`text-[12px] font-semibold tracking-tight ${isMe ? 'text-white' : 'text-[#007AFF] dark:text-[#53bdeb]'}`}>
                                  {(msg.replyTo.sender._id || msg.replyTo.sender) === authUser._id ? 'You' : (msg.replyTo.sender?.fullName || 'Unknown')}
                                </span>
                                {msg.replyTo.content && (
                                  <span className={`truncate text-[13px] leading-snug mt-0.5 ${isMe ? 'text-white/90' : 'text-zinc-700 dark:text-zinc-300'}`}>
                                    {getPreviewText(msg.replyTo.content)}
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Message Content */}
                            {msg.content && <span className="mb-0.5 whitespace-pre-wrap break-words [word-break:break-word] [overflow-wrap:anywhere]" dangerouslySetInnerHTML={{ __html: msg.content }} />}
                            
                            {/* Individual Timestamp */}
                            <span className={`text-[10px] font-medium leading-none self-end ${isMe ? 'text-white/70' : 'text-[#8E8E93]'}`}>
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </div>

                      
                    </motion.div>
                  </React.Fragment>
                );
              })}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm bg-white px-4 py-3 shadow-sm border border-zinc-100 dark:bg-zinc-800/80 dark:border-zinc-700/50">
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]"></span>
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]"></span>
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400"></span>
                  </div>
                </div>
              </div>
            )}
            <div className="h-[120px] shrink-0 pointer-events-none" /><div ref={messagesEndRef} />
          </div>
        )}
      </div>

      </div>

        {/* Input (Floating) */}
        <div className="absolute bottom-0 left-0 w-full p-4 pb-6 z-10">
        <AnimatePresence>
          {replyingTo && (
            <motion.div 
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: 10, height: 0 }}
              className="mb-2 flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-900/50"
            >
              <div className="flex flex-1 items-center gap-2 overflow-hidden border-l-[4px] border-[#027EB5] pl-2">
                  <div className="flex-1 overflow-hidden">
                    <p className="text-[13px] font-semibold text-[#027EB5] mb-0.5">
                      {(replyingTo.sender._id || replyingTo.sender) === authUser._id ? 'You' : (replyingTo.sender?.fullName || 'User')}
                    </p>
                    <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                      {getPreviewText(replyingTo.content)}
                    </p>
                  </div>
                </div>
              <button 
                onClick={() => setReplyingTo(null)}
                className="ml-2 rounded-full p-1 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
              >
                <X size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>


        <form
          onSubmit={handleSend}
          className="flex flex-col gap-2 rounded-[20px] border border-zinc-200 bg-white p-3 shadow-lg shadow-black/5 transition-all duration-300 focus-within:border-[#007AFF]/40 focus-within:ring-4 focus-within:ring-[#007AFF]/10 focus-within:shadow-xl focus-within:shadow-black/10 focus-within:-translate-y-1 dark:border-zinc-800 dark:bg-zinc-900 mx-auto"
        >
          {/* Top row: Text area */}
          <div
            ref={messageInputRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInputChange}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            onKeyDown={handleKeyDown}
            className="w-full resize-none bg-transparent px-1 py-1 text-[15px] outline-none dark:text-zinc-50 min-h-[40px] max-h-[120px] overflow-y-auto overflow-x-hidden break-words [word-break:break-word] empty:before:content-[attr(placeholder)] empty:before:text-zinc-400"
            placeholder="Enter to send, Shift + Enter to add new line"
          />
          
          {/* Bottom row: Toolbars */}
          <div className="flex items-center justify-between px-1">
            {/* Formatting Tools (Left) */}
            {((getPreviewText(content).trim()) || isInputFocused) ? (
              <div className="flex items-center gap-4 text-zinc-400 animate-in fade-in zoom-in duration-200">
                <button type="button" onMouseDown={(e) => { e.preventDefault(); executeCommand('bold'); }} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"><Bold size={18} strokeWidth={2.5} /></button>
                <button type="button" onMouseDown={(e) => { e.preventDefault(); executeCommand('italic'); }} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"><Italic size={18} strokeWidth={2.5} /></button>
                <button type="button" onMouseDown={(e) => { e.preventDefault(); executeCommand('underline'); }} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"><Underline size={18} strokeWidth={2.5} /></button>
              </div>
            ) : <div />}
            
            {/* Attachment Tools (Right) */}
            <div className="flex items-center gap-4 text-zinc-400">
              
              
              {/* Actual Send Button (Only show if there's text, otherwise hidden to match screenshot) */}
              {getPreviewText(content).trim() && (
                <button
                  type="submit"
                  disabled={isSending}
                  className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#0042d5] text-white transition-transform active:scale-95 disabled:opacity-50"
                >
                  <ArrowUp size={16} className="cursor-pointer"strokeWidth={2.5} />
                </button>
              )}
            </div>
          </div>
</form>
      </div>
      </div>
      {showProfilePane && (
        <ContactInfo user={selectedUser} onClose={() => setShowProfilePane(false)
          
        }onReplyClick={scrollToMessage}  />
      )}

      
    </div>

    
  );
}
