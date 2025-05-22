'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/utils/AuthContext';
import { useTheme } from '@/utils/ThemeContext';
import RegisterForm from '@/components/RegisterForm';

export default function Register() {
  const { user } = useAuth();
  const router = useRouter();
  const { darkMode } = useTheme();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <div className={`
      min-h-screen flex items-center justify-center
      ${darkMode
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
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
          </div>
        </div>

        <RegisterForm />
      </div>
    </div>
  );
}