'use client';

import { ReactNode } from 'react';
import { useTheme } from '@/utils/ThemeContext';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export default function PageContainer({ children, className = '' }: PageContainerProps) {
  const { darkMode } = useTheme();

  return (
    <div className={`
      min-h-screen ${className}
      ${darkMode
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }
    `}>
      {children}
    </div>
  );
}
