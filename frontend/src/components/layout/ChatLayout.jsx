import { useAuthStore } from '../../context/useAuthStore';
import { LogOut, Settings, User as UserIcon, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import ChatSidebar from '../chat/ChatSidebar';
import ChatWindow from '../chat/ChatWindow';
import { useChatStore } from '../../context/useChatStore';
import { useSocketStore } from '../../context/useSocketStore';
import { useEffect } from 'react';

export default function ChatLayout() {
  const { logout } = useAuthStore();
  const { selectedUser, listenToMessages, stopListeningToMessages } = useChatStore();
  const { socket } = useSocketStore();

  useEffect(() => {
    listenToMessages();
    return () => stopListeningToMessages();
  }, [listenToMessages, stopListeningToMessages, socket]);

  return (
    <div className="flex h-screen h-[100dvh] max-h-[100dvh] w-full overflow-hidden bg-zinc-50 dark:bg-zinc-950 fixed inset-0">
      {/* Sidebar Navigation (Desktop / Tablet only) */}
      <nav className="hidden md:flex flex-col items-center justify-between border-r border-zinc-200 bg-white py-4 dark:border-zinc-800 dark:bg-zinc-900 shrink-0 w-16">
        <div className="flex flex-col gap-4">
          <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
            <MessageSquare size={20} />
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <Link to="/profile" className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800">
            <UserIcon size={20} />
          </Link>
          
          <button onClick={logout} className="flex h-10 w-10 items-center justify-center rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
            <LogOut size={20} className='cursor-pointer'/>
          </button>
        </div>
      </nav> 

      {/* Chat List (Left Pane) */}
      <aside className={`flex flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shrink-0 flex-1 md:flex-none md:w-[320px] lg:w-[380px] h-full overflow-hidden ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
        <ChatSidebar />
      </aside>

      {/* Main Chat Area */}
      <main className={`flex flex-col flex-1 bg-zinc-50 dark:bg-zinc-950 min-w-0 h-full overflow-hidden ${!selectedUser ? 'hidden md:flex' : 'flex'}`}>
        {!selectedUser ? (
          <div className="flex h-full flex-col items-center justify-center text-center px-4">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800">
              <MessageSquare size={32} className="text-zinc-400 dark:text-zinc-500" />
            </div>
            <h3 className="text-lg font-medium tracking-tight text-zinc-900 dark:text-zinc-100">Welcome to Chat</h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Select a conversation from the sidebar to start messaging.</p>
          </div>
        ) : (
          <ChatWindow />
        )}
      </main>
    </div>
  );
}
