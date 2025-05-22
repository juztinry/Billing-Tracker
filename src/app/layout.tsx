import './globals.css';
import { AuthProvider } from '@/utils/AuthContext';
import { ThemeProvider } from '@/utils/ThemeContext';
import { ReactNode } from 'react';
import { Montserrat, Poppins } from 'next/font/google';
import Script from 'next/script';
import FixedHeader from '@/components/FixedHeader';

// Configure the fonts
const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata = {
  title: 'Billing Tracker',
  description: 'Track your bills and expenses',
  icons: {
    icon: '/react-icon.svg',
    shortcut: '/react-icon.svg',
    apple: '/react-icon.svg',
  }
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${montserrat.variable} ${poppins.variable}`}>
      <head>
        <link rel="icon" href="/react-icon.svg" />
      </head>
      <body className="min-h-screen font-poppins" suppressHydrationWarning={true}>
        <ThemeProvider>
          <AuthProvider>
            <FixedHeader>
              {children}
            </FixedHeader>
          </AuthProvider>
        </ThemeProvider>

        {/* Script to remove Grammarly attributes that cause hydration warnings */}
        <Script id="remove-grammarly-attrs" strategy="afterInteractive">
          {`
            if (typeof window !== 'undefined') {
              const removeGrammarlyAttributes = () => {
                const body = document.body;
                if (body.hasAttribute('data-new-gr-c-s-check-loaded')) {
                  body.removeAttribute('data-new-gr-c-s-check-loaded');
                }
                if (body.hasAttribute('data-gr-ext-installed')) {
                  body.removeAttribute('data-gr-ext-installed');
                }
              };

              // Run once immediately
              removeGrammarlyAttributes();

              // Also run on any subsequent changes
              const observer = new MutationObserver(removeGrammarlyAttributes);
              observer.observe(document.body, { attributes: true });
            }
          `}
        </Script>

        {/* Script to fix Next.js auto-scroll behavior issues */}
        <Script id="fix-scroll-behavior" strategy="afterInteractive">
          {`
            if (typeof window !== 'undefined') {
              // Override Next.js's auto-scroll behavior
              const fixScrollBehavior = () => {
                // Set scroll behavior to auto for the html element
                document.documentElement.style.scrollBehavior = 'auto';

                // Prevent the shouldSkipElement function from causing issues with sticky/fixed elements
                // This is a workaround for Next.js internal router issues
                window.__NEXT_SCROLL_RESTORATION = {
                  manual: true,
                  onRouteChange: () => {
                    // Do nothing, effectively disabling the automatic scroll
                    return;
                  }
                };
              };

              // Apply fix immediately
              fixScrollBehavior();

              // Also apply after any navigation
              if (window.next && window.next.router) {
                window.next.router.events.on('routeChangeComplete', fixScrollBehavior);
              }
            }
          `}
        </Script>
      </body>
    </html>
  );
}