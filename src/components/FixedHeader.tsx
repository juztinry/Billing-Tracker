'use client';

import { ReactNode, useEffect, useState } from 'react';
import Navigation from './Navigation';
import { usePathname } from 'next/navigation';

interface FixedHeaderProps {
  children: ReactNode;
}

export default function FixedHeader({ children }: FixedHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Don't show navigation on login page or register page
  const hideNavigation = pathname === '/login' || pathname === '/register';

  // Handle scroll event to add shadow when scrolled
  useEffect(() => {
    // Only add scroll listener if navigation is shown
    if (!hideNavigation) {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 10);
      };

      // Add event listener
      window.addEventListener('scroll', handleScroll);

      // Initial check
      handleScroll();

      // Clean up
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [hideNavigation]);

  return (
    <>
      {!hideNavigation && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className={`transition-shadow duration-300 ${isScrolled ? 'shadow-lg' : ''}`}>
            <Navigation />
          </div>
        </div>
      )}
      <div className={hideNavigation ? '' : 'pt-16'}>
        {children}
      </div>
    </>
  );
}
