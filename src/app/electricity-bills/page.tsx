'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/utils/AuthContext';
import { useTheme } from '@/utils/ThemeContext';
import ElectricityBillsTable from '@/components/ElectricityBillsTable';
import ProtectedRoute from '@/components/ProtectedRoute';
import PageContainer from '@/components/PageContainer';

export default function ElectricityBills() {
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
      <PageContainer className={`
        ${darkMode
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 animate-gradient-shift'
          : 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 animate-gradient-shift'
        }
      `}>
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
                  ? 'bg-amber-600/10 blur-3xl'
                  : 'bg-amber-400/20 blur-3xl'
                }
              `}></div>
              <div className={`
                absolute top-1/3 right-1/3 w-96 h-96 rounded-full animate-float-delay animate-pulse-slow
                ${darkMode
                  ? 'bg-yellow-600/10 blur-3xl'
                  : 'bg-yellow-400/20 blur-3xl'
                }
              `}></div>
              <div className={`
                absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full animate-float animate-pulse-slow
                ${darkMode
                  ? 'bg-orange-600/10 blur-3xl'
                  : 'bg-orange-400/20 blur-3xl'
                }
              `}></div>

              {/* Lightning bolt decorative elements */}
              <div className="absolute top-1/2 left-1/5 w-20 h-40 opacity-20">
                <svg className="w-full h-full animate-pulse-slow text-yellow-500" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <div className="absolute bottom-1/3 right-1/5 w-16 h-32 opacity-20 rotate-12">
                <svg className="w-full h-full animate-pulse-slow text-amber-500" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
            </div>
          </div>
          <ElectricityBillsTable />
        </div>
      </PageContainer>
    </ProtectedRoute>
  );
}