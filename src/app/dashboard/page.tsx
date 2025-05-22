'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/utils/AuthContext';
import { useTheme } from '@/utils/ThemeContext';
import Dashboard from '@/components/Dashboard';
import ProtectedRoute from '@/components/ProtectedRoute';
import PageContainer from '@/components/PageContainer';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { darkMode } = useTheme();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  return (
    <ProtectedRoute>
      <PageContainer>
        <div className="relative">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className={`
              absolute -inset-[10px] opacity-30
              ${darkMode ? 'opacity-10' : 'opacity-30'}
            `}>
              <div className={`
                absolute top-1/4 left-1/4 w-96 h-96 rounded-full animate-float animate-pulse-slow
                ${darkMode
                  ? 'bg-purple-600/10 blur-3xl'
                  : 'bg-blue-400/20 blur-3xl'
                }
              `}></div>
              <div className={`
                absolute top-1/3 right-1/3 w-96 h-96 rounded-full animate-float-delay animate-pulse-slow
                ${darkMode
                  ? 'bg-blue-600/10 blur-3xl'
                  : 'bg-purple-400/20 blur-3xl'
                }
              `}></div>
            </div>
          </div>
          <Dashboard />
        </div>
      </PageContainer>
    </ProtectedRoute>
  );
}