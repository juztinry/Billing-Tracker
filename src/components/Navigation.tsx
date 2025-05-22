'use client';

import Link from 'next/link';
import { useAuth } from '@/utils/AuthContext';
import { useTheme } from '@/utils/ThemeContext';
import { useRouter } from 'next/navigation';
import ClientDateTime from './ClientDateTime';

export default function Navigation() {
  const { user, signOut } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const router = useRouter();

  // Get user's full name from user metadata, fallback to email if not available
  const fullName = user?.user_metadata?.full_name || user?.email;

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 text-white shadow-lg relative top-0 left-0 right-0 overflow-hidden z-50">
      <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent"></div>
      <div className="container mx-auto px-0 py-3 flex justify-between items-center relative z-10">
        {/* Left: Logo */}
        <div className="flex items-center pl-2">
          <Link
            href="/"
            className="group relative"
          >
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-300 to-pink-400 animate-gradient-x whitespace-nowrap">
              Bill Consumption Tracker
            </span>
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
        </div>



        {user && (
          <>
            {/* Center: Navigation Links */}
            <div className="flex-1 flex justify-center items-center space-x-6">
              <Link
                href="/dashboard"
                className="relative group px-3 py-1.5 overflow-hidden rounded-md"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                <span className="relative text-sm font-medium text-blue-300 group-hover:text-white transition-colors duration-300">Dashboard</span>
              </Link>
              <Link
                href="/electricity-bills"
                className="relative group px-3 py-1.5 overflow-hidden rounded-md"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-amber-600/20 to-yellow-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-400 to-yellow-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                <span className="relative text-sm font-medium text-blue-300 group-hover:text-white transition-colors duration-300">ElectricityBills</span>
              </Link>
              <Link
                href="/water-bills"
                className="relative group px-3 py-1.5 overflow-hidden rounded-md"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-cyan-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                <span className="relative text-sm font-medium text-blue-300 group-hover:text-white transition-colors duration-300">WaterBills</span>
              </Link>
              <Link
                href="/profile"
                className="relative group px-3 py-1.5 overflow-hidden rounded-md"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                <span className="relative text-sm font-medium text-blue-300 group-hover:text-white transition-colors duration-300">UserProfile</span>
              </Link>
            </div>

            {/* Right: User Info, Dark Mode Toggle, and Logout */}
            <div className="flex-1 flex justify-end items-center space-x-4">
              {/* Date and Time Display */}
              <ClientDateTime />

              <button
                onClick={toggleDarkMode}
                className={`
                  relative overflow-hidden p-3 rounded-full focus:outline-none
                  transition-all duration-300 transform hover:scale-110
                  shadow-lg group
                  ${darkMode
                    ? 'bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300 text-gray-900'
                    : 'bg-gradient-to-r from-indigo-600 via-purple-700 to-indigo-600 text-white'
                  }
                  animate-gradient-x
                `}
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                <span className="absolute inset-0 overflow-hidden rounded-full">
                  <span className={`
                    absolute inset-0 transform scale-0 rounded-full transition-transform duration-500 ease-out
                    group-hover:scale-[2.5] group-hover:opacity-50
                    ${darkMode
                      ? 'bg-yellow-400 opacity-0'
                      : 'bg-purple-500 opacity-0'
                    }
                  `}></span>
                </span>
                <span className="relative z-10 flex items-center justify-center">
                  {darkMode ? (
                    <svg className="w-6 h-6 animate-spin-slow" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fillRule="evenodd" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 animate-pulse-slow" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  )}
                </span>
                <span className={`
                  absolute -bottom-1 left-0 right-0 h-1
                  ${darkMode
                    ? 'bg-gradient-to-r from-yellow-500/50 via-amber-400/50 to-yellow-500/50'
                    : 'bg-gradient-to-r from-indigo-500/50 via-purple-400/50 to-indigo-500/50'
                  }
                  animate-pulse-slow
                `}></span>
              </button>
              <div className="relative overflow-hidden px-5 py-2 rounded-lg shadow-lg group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/80 via-purple-600/80 to-indigo-600/80 animate-gradient-x"></div>
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-indigo-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                  </svg>
                  <span className="bg-clip-text text-transparent whitespace-nowrap font-bold tracking-wide uppercase bg-gradient-to-r from-white via-indigo-200 to-white animate-gradient-x">
                    {fullName}
                  </span>
                </span>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-pulse-slow"></div>
              </div>
              <button
                onClick={handleSignOut}
                className="relative overflow-hidden px-5 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-rose-600 via-red-600 to-rose-600 animate-gradient-x"></div>
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-500 to-red-500 rounded-lg opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center whitespace-nowrap">
                  <svg className="w-4 h-4 mr-2 group-hover:animate-bounce-subtle" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"></path>
                  </svg>
                  <span className="group-hover:animate-pulse-slow">Logout</span>
                </span>
                <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-rose-300 to-red-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-white"></div>
              </button>
            </div>
          </>
        )}

        {!user && (
          <>
            {/* Center for non-authenticated users */}
            <div className="flex-1 flex justify-center">
              {/* Empty center section for non-authenticated users */}
            </div>

            {/* Right: Dark Mode Toggle, Login/Register */}
            <div className="flex justify-end items-center space-x-4">
              {/* Date and Time Display */}
              <ClientDateTime />

              <button
                onClick={toggleDarkMode}
                className={`
                  relative overflow-hidden p-3 rounded-full focus:outline-none
                  transition-all duration-300 transform hover:scale-110
                  shadow-lg group
                  ${darkMode
                    ? 'bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300 text-gray-900'
                    : 'bg-gradient-to-r from-indigo-600 via-purple-700 to-indigo-600 text-white'
                  }
                  animate-gradient-x
                `}
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                <span className="absolute inset-0 overflow-hidden rounded-full">
                  <span className={`
                    absolute inset-0 transform scale-0 rounded-full transition-transform duration-500 ease-out
                    group-hover:scale-[2.5] group-hover:opacity-50
                    ${darkMode
                      ? 'bg-yellow-400 opacity-0'
                      : 'bg-purple-500 opacity-0'
                    }
                  `}></span>
                </span>
                <span className="relative z-10 flex items-center justify-center">
                  {darkMode ? (
                    <svg className="w-6 h-6 animate-spin-slow" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fillRule="evenodd" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 animate-pulse-slow" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  )}
                </span>
                <span className={`
                  absolute -bottom-1 left-0 right-0 h-1
                  ${darkMode
                    ? 'bg-gradient-to-r from-yellow-500/50 via-amber-400/50 to-yellow-500/50'
                    : 'bg-gradient-to-r from-indigo-500/50 via-purple-400/50 to-indigo-500/50'
                  }
                  animate-pulse-slow
                `}></span>
              </button>
              <Link
                href="/login"
                className="relative overflow-hidden px-5 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-gradient-x"></div>
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center whitespace-nowrap">
                  <svg className="w-4 h-4 mr-2 group-hover:animate-bounce-subtle" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"></path>
                  </svg>
                  <span className="group-hover:animate-pulse-slow">Login</span>
                </span>
                <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-300 to-purple-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-white"></div>
              </Link>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}