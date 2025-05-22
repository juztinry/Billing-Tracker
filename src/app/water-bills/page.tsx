'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/utils/AuthContext';
import { useTheme } from '@/utils/ThemeContext';
import WaterBillsTable from '@/components/WaterBillsTable';
import ProtectedRoute from '@/components/ProtectedRoute';
import PageContainer from '@/components/PageContainer';

export default function WaterBills() {
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
      <PageContainer className={darkMode
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
        : 'bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50'
      }>
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
                  ? 'bg-blue-600/10 blur-3xl'
                  : 'bg-cyan-400/20 blur-3xl'
                }
              `}></div>
              <div className={`
                absolute top-1/3 right-1/3 w-96 h-96 rounded-full animate-float-delay animate-pulse-slow
                ${darkMode
                  ? 'bg-cyan-600/10 blur-3xl'
                  : 'bg-blue-400/20 blur-3xl'
                }
              `}></div>
            </div>
          </div>
          <WaterBillsTable />
        </div>
      </PageContainer>
    </ProtectedRoute>
  );
}