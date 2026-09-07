import { useEffect, useRef } from 'react';
import { useAuthStore } from '../context/useAuthStore';
import { Link } from 'react-router-dom';
import { MessageSquare, Mail, Lock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const emailOrUsernameRef = useRef();
  const passwordRef = useRef();
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailOrUsername = emailOrUsernameRef.current.value;
    const password = passwordRef.current.value;
    console.log('Email or Username:', emailOrUsername);
    console.log('Password:', password);
    if (!emailOrUsername || !password) return toast.error('All fields are required');
    const res = await login({ emailOrUsername, password });
    if (!res.success) toast.error(res.message);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
            <MessageSquare size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Welcome back</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Email or Username</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-zinc-400" />
              <input
                type="text"
                ref={emailOrUsernameRef}
                className="w-full rounded-xl border border-zinc-300 bg-transparent py-2.5 pl-10 pr-4 text-zinc-900 placeholder-zinc-400 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary dark:border-zinc-700 dark:text-zinc-50"
                placeholder="john@example.com"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-zinc-400" />
              <input
                type="password"
                ref={passwordRef}
                className="w-full rounded-xl border border-zinc-300 bg-transparent py-2.5 pl-10 pr-4 text-zinc-900 placeholder-zinc-400 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary dark:border-zinc-700 dark:text-zinc-50"
                placeholder="        "
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoggingIn}
            className="flex w-full items-center justify-center rounded-xl bg-brand-primary py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover disabled:opacity-50"
          >
            {isLoggingIn ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign In'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-brand-primary hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
