'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '@/utils/AuthContext';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/utils/ThemeContext';
// Icons
import { FaEnvelope, FaLock, FaSignInAlt, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function LoginForm() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { signIn } = useAuth();
  const router = useRouter();
  const { darkMode } = useTheme();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await signIn({ email, password });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Please check your email and confirm your account before logging in.');
        }
        throw error;
      }

      router.push('/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`
      w-full max-w-md overflow-hidden rounded-xl shadow-2xl
      transition-all duration-300 transform hover:scale-[1.01]
      animate-fade-in
      ${darkMode
        ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-black border border-gray-700'
        : 'bg-gradient-to-br from-white via-purple-50 to-blue-50 border border-gray-100'
      }
    `}>
      <div className="p-8">
        <h2 className={`
          text-2xl font-bold mb-6 text-center
          ${darkMode ? 'text-white' : 'text-gray-800'}
          bg-clip-text text-transparent bg-gradient-to-r
          ${darkMode
            ? 'from-blue-400 via-purple-400 to-pink-400'
            : 'from-blue-600 via-purple-600 to-indigo-600'
          }
        `}>
          LOGIN
        </h2>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4 shadow-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} htmlFor="email">
              Email
            </label>
            <div className="relative">
              <div className={`
                absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none
                ${darkMode ? 'text-gray-400' : 'text-gray-500'}
              `}>
                <FaEnvelope />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`
                  w-full pl-10 pr-4 py-3 rounded-lg
                  transition-all duration-200
                  focus:ring-2 focus:ring-opacity-50 outline-none
                  ${darkMode
                    ? 'bg-gray-800 border-gray-700 text-white focus:ring-purple-500 focus:border-purple-500'
                    : 'bg-white border border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm'
                  }
                `}
                required
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} htmlFor="password">
              Password
            </label>
            <div className="relative">
              <div className={`
                absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none
                ${darkMode ? 'text-gray-400' : 'text-gray-500'}
              `}>
                <FaLock />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`
                  w-full pl-10 pr-10 py-3 rounded-lg
                  transition-all duration-200
                  focus:ring-2 focus:ring-opacity-50 outline-none
                  ${darkMode
                    ? 'bg-gray-800 border-gray-700 text-white focus:ring-purple-500 focus:border-purple-500'
                    : 'bg-white border border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm'
                  }
                `}
                required
              />
              <button
                type="button"
                className={`
                  absolute inset-y-0 right-0 flex items-center pr-3
                  ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}
                `}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`
                w-full py-3 px-4 rounded-lg font-medium text-white
                transition-all duration-300 transform hover:translate-y-[-2px]
                ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg'}
                bg-gradient-to-r
                ${darkMode
                  ? 'from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500'
                  : 'from-blue-500 via-indigo-500 to-purple-600 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-700'
                }
              `}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <FaSignInAlt className="mr-2" />
                  Login
                </span>
              )}
            </button>
          </div>

          {/* Registration link removed as requested */}
          <div className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {/* Don't have an account? Register here */}
          </div>
        </form>
      </div>
    </div>
  );
}