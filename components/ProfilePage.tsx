


import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BackArrowIcon } from './icons';

interface AuthFormProps {
}

const AuthForm: React.FC<AuthFormProps> = () => {
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('login');
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup, resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setInfo('');
    setLoading(true);

    const email = emailRef.current?.value;

    if (!email) {
      setError('Please enter your email.');
      setLoading(false);
      return;
    }

    if (mode === 'reset') {
      try {
        await resetPassword(email);
        setMessage('Password reset link sent! Check your email.');
      } catch (err: any) {
        setError('Failed to send reset email. Make sure the email is correct.');
      }
      setLoading(false);
      return;
    }

    const password = passwordRef.current?.value;

    if (!password) {
      setError('Please enter your password.');
      setLoading(false);
      return;
    }

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await signup(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate');
    }

    setLoading(false);
  };
  
  const handleForgotEmail = () => {
    setError('');
    setMessage('');
    setInfo("We can't look up your email for security reasons. Please try any email addresses you may have used to sign up. If you're still unable to access your account, you can create a new one.");
  };

  const resetMessages = () => {
    setError('');
    setMessage('');
    setInfo('');
  };

  if (mode === 'reset') {
    return (
      <div className="relative w-full max-w-md p-6 mx-auto bg-white dark:bg-zinc-900 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">Reset Your Password</h2>
        {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">{error}</p>}
        {message && <p className="bg-green-100 text-green-700 p-3 rounded mb-4 text-center">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              ref={emailRef}
              className="shadow appearance-none border dark:border-zinc-700 rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-zinc-800 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
              id="email"
              type="email"
              placeholder="email@example.com"
              required
            />
          </div>
          <div className="mb-4">
            <button
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400"
              type="submit"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </div>
        </form>
        <div className="text-center">
          <button onClick={() => { setMode('login'); resetMessages(); }} className="text-sm text-green-600 hover:underline">
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md p-6 mx-auto bg-white dark:bg-zinc-900 rounded-lg shadow-md">
      <div className="flex border-b dark:border-zinc-700 mb-6">
        <button
          onClick={() => { setMode('login'); resetMessages(); }}
          className={`flex-1 py-2 text-center font-semibold ${mode === 'login' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 dark:text-zinc-400'}`}
        >
          Login
        </button>
        <button
          onClick={() => { setMode('signup'); resetMessages(); }}
          className={`flex-1 py-2 text-center font-semibold ${mode === 'signup' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 dark:text-zinc-400'}`}
        >
          Sign Up
        </button>
      </div>
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">{mode === 'login' ? 'Welcome Back!' : 'Create Account'}</h2>
      {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">{error}</p>}
      {info && <p className="bg-blue-100 text-blue-700 p-3 rounded mb-4 text-center">{info}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            ref={emailRef}
            className="shadow appearance-none border dark:border-zinc-700 rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-zinc-800 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
            id="email"
            type="email"
            placeholder="email@example.com"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            ref={passwordRef}
            className="shadow appearance-none border dark:border-zinc-700 rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-zinc-800 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
            id="password"
            type="password"
            placeholder="******************"
            required
          />
          {mode === 'login' && (
            <div className="flex justify-between items-center text-xs">
              <button
                type="button"
                onClick={handleForgotEmail}
                className="text-green-600 hover:underline focus:outline-none"
              >
                Forgot Email?
              </button>
              <button
                type="button"
                onClick={() => { setMode('reset'); resetMessages(); }}
                className="text-green-600 hover:underline focus:outline-none"
              >
                Forgot Password?
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <button
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400"
            type="submit"
          >
            {loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Sign Up')}
          </button>
        </div>
      </form>
    </div>
  );
};

interface ProfilePageProps {
  setActivePage: (page: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ setActivePage }) => {
  const { currentUser, logout } = useAuth();

  if (currentUser) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">My Account</h1>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Welcome back, <span className="font-semibold">{currentUser.email}</span>!
        </p>
        <button
          onClick={logout}
          className="mt-8 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="py-8">
      <AuthForm />
    </div>
  );
};

export default ProfilePage;