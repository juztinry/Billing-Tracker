'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/utils/AuthContext';
import { useTheme } from '@/utils/ThemeContext';
import LoginForm from '@/components/LoginForm';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { darkMode } = useTheme();

  useEffect(() => {
    // Only redirect to dashboard if user is logged in
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  // If user is logged in, show a blank page while redirecting
  if (user) {
    return <div></div>;
  }

  // Otherwise, render the login form directly (even if still loading)
  return (
    <div className={`
      min-h-screen flex items-center justify-center
      ${darkMode
        ? 'bg-gradient-to-br from-gray-900 via-gray-900 to-black'
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }
    `}>
      <div className="relative w-full max-w-md p-4">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`
            absolute -inset-[10px] opacity-30
            ${darkMode ? 'opacity-20' : 'opacity-40'}
          `}>
            <div className={`
              absolute top-1/4 left-1/4 w-96 h-96 rounded-full animate-float animate-pulse-slow
              ${darkMode
                ? 'bg-purple-600/20 blur-3xl'
                : 'bg-blue-400/20 blur-3xl'
              }
            `}></div>
            <div className={`
              absolute top-1/3 right-1/3 w-96 h-96 rounded-full animate-float-delay animate-pulse-slow
              ${darkMode
                ? 'bg-blue-600/20 blur-3xl'
                : 'bg-purple-400/20 blur-3xl'
              }
            `}></div>
            <div className={`
              absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full animate-float animate-pulse-slow
              ${darkMode
                ? 'bg-indigo-600/20 blur-3xl'
                : 'bg-indigo-400/20 blur-3xl'
              }
            `}></div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <LoginForm />
        )}
      </div>
    </div>
  );
}