import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BackArrowIcon } from './icons';

interface AuthFormProps {
}

const VerifyEmailNotice: React.FC = () => {
    const { currentUser, resendVerificationEmail, logout } = useAuth();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        // FIX: Replaced Node.js specific `NodeJS.Timeout` with `ReturnType<typeof setTimeout>` for browser compatibility.
        let timer: ReturnType<typeof setTimeout>;
        if (cooldown > 0) {
            timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [cooldown]);

    const handleResend = async () => {
        if (cooldown > 0) return;
        setMessage('');
        setError('');
        try {
            await resendVerificationEmail();
            setMessage('A new verification email has been sent.');
            setCooldown(60); // 60 second cooldown
        } catch (err) {
            setError('Failed to resend email. Please try again later.');
        }
    };

    return (
        <div className="w-full max-w-md p-6 mx-auto bg-white dark:bg-zinc-900 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Verify Your Email</h2>
            {message && <p className="bg-green-100 text-green-700 p-3 rounded mb-4">{message}</p>}
            {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>}
            <p className="text-gray-600 dark:text-gray-400 mb-6">
                A verification link has been sent to <span className="font-semibold">{currentUser?.email}</span>. Please check your inbox and spam folder.
            </p>
            <div className="space-y-4">
                <button
                    onClick={handleResend}
                    disabled={cooldown > 0}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400"
                >
                    {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Verification Email'}
                </button>
                <button
                    onClick={logout}
                    className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                >
                    Logout
                </button>
            </div>
            <p className="text-xs text-gray-500 mt-4">
                Already verified? Try refreshing the page.
            </p>
        </div>
    );
};


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
        // After signup, the user is created and an email is sent.
        // onAuthStateChanged fires, setting currentUser, and ProfilePage will then show the verification notice.
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
  const { currentUser, logout, isAdmin, deleteAccount } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (currentUser && currentUser.emailVerified && isAdmin) {
      // Redirect admins to the admin panel
      const redirectTimeout = setTimeout(() => {
        window.location.href = '/admin.html';
      }, 1500);

      return () => clearTimeout(redirectTimeout);
    }
  }, [currentUser, isAdmin]);

  const handleDeleteAccount = async () => {
    setDeleteError('');
    setIsDeleting(true);
    try {
        await deleteAccount();
        // After successful deletion, the onAuthStateChanged listener in AuthContext will set currentUser to null,
        // which will re-render this page to show the login form.
        setShowDeleteConfirm(false);
    } catch (error: any) {
        // Handle re-authentication error
        if (error.code === 'auth/requires-recent-login') {
            setDeleteError('This is a sensitive action. Please log out and log back in before trying again.');
        } else {
            setDeleteError(error.message || 'Failed to delete account.');
        }
    } finally {
        setIsDeleting(false);
    }
  };

  // Handle unverified users
  if (currentUser && !currentUser.emailVerified) {
    return (
      <div className="py-8">
        <VerifyEmailNotice />
      </div>
    );
  }

  if (currentUser) {
    if (isAdmin) {
      return (
        <div className="flex flex-col items-center justify-center h-full py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Admin Account</h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Welcome, Admin <span className="font-semibold">{currentUser.email}</span>!
          </p>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Redirecting you to the admin panel...</p>
        </div>
      );
    }
    return (
      <>
        <div className="flex flex-col items-center justify-center h-full py-16 text-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">My Account</h1>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
            Welcome back, <span className="font-semibold">{currentUser.email}</span>!
            </p>
            <button
            onClick={logout}
            className="mt-8 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
            Logout
            </button>
            <button
                onClick={() => {
                    setShowDeleteConfirm(true);
                    setDeleteError(''); // Reset error on modal open
                }}
                className="mt-4 text-sm text-red-500 hover:underline"
            >
                Delete Account
            </button>
        </div>
        {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-xl max-w-sm w-full text-left">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Delete Your Account?</h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        This action is permanent and cannot be undone. All your data, including your wishlist, will be permanently removed.
                    </p>
                    {deleteError && (
                        <div className="mt-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-md relative" role="alert">
                            <span className="block sm:inline">{deleteError}</span>
                        </div>
                    )}
                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                        onClick={() => setShowDeleteConfirm(false)}
                        disabled={isDeleting}
                        className="px-4 py-2 bg-gray-200 dark:bg-zinc-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-zinc-600 disabled:opacity-50"
                        >
                        Cancel
                        </button>
                        <button
                        onClick={handleDeleteAccount}
                        disabled={isDeleting}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed flex items-center"
                        >
                        {isDeleting ? 'Deleting...' : 'Yes, Delete Account'}
                        </button>
                    </div>
                </div>
            </div>
        )}
      </>
    );
  }

  return (
    <div className="py-8">
      <AuthForm />
    </div>
  );
};

export default ProfilePage;