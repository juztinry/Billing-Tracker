'use client';

import { useState } from 'react';
import { useAuth } from '@/utils/AuthContext';
import { useTheme } from '@/utils/ThemeContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import PageContainer from '@/components/PageContainer';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { darkMode } = useTheme();
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not logged in
  if (!loading && !user) {
    router.push('/login');
    return null;
  }

  // Handle password form changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle password update submission
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: '', type: '' });

    // Validate passwords match
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ text: 'New passwords do not match', type: 'error' });
      setIsSubmitting(false);
      return;
    }

    try {
      // First, reauthenticate with current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: passwordForm.currentPassword
      });

      if (signInError) {
        setMessage({ text: 'Current password is incorrect', type: 'error' });
        setIsSubmitting(false);
        return;
      }

      // Then update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });

      if (updateError) {
        setMessage({ text: `Error: ${updateError.message}`, type: 'error' });
      } else {
        setMessage({ text: 'Password updated successfully', type: 'success' });
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      setMessage({ text: 'An unexpected error occurred', type: 'error' });
    }

    setIsSubmitting(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <PageContainer className={`
        ${darkMode
          ? 'bg-gradient-to-br from-gray-900 via-gray-900 to-black'
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
        }
      `}>
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`
            absolute -inset-[10px] opacity-30
            ${darkMode ? 'opacity-10' : 'opacity-30'}
          `}>
            <div className={`
              absolute top-1/4 left-1/4 w-96 h-96 rounded-full animate-float animate-pulse-slow
              ${darkMode
                ? 'bg-indigo-600/10 blur-3xl'
                : 'bg-indigo-400/20 blur-3xl'
              }
            `}></div>
            <div className={`
              absolute top-1/3 right-1/3 w-96 h-96 rounded-full animate-float-delay animate-pulse-slow
              ${darkMode
                ? 'bg-purple-600/10 blur-3xl'
                : 'bg-purple-400/20 blur-3xl'
              }
            `}></div>
          </div>
        </div>

        <main className="container mx-auto px-4 py-8 relative z-10">
          <div className="relative group max-w-2xl mx-auto p-8 rounded-xl shadow-xl animate-fade-in overflow-hidden">
            {/* Animated background gradient */}
            <div className={`
              absolute inset-0
              ${darkMode
                ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-black animate-gradient-shift'
                : 'bg-gradient-to-br from-white via-indigo-50 to-purple-50 animate-gradient-shift'
              }
            `}></div>

            {/* Animated border effect */}
            <div className={`
              absolute -inset-0.5 rounded-xl opacity-70 blur-sm transition-all duration-300 group-hover:opacity-100
              ${darkMode
                ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-gradient-shift'
                : 'bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient-shift'
              }
            `}></div>

            {/* Content container */}
            <div className="relative z-10">
              <h1 className={`
                text-3xl font-extrabold mb-6 relative inline-block
                ${darkMode
                  ? 'text-white'
                  : 'text-indigo-700'
                }
              `}>
                <span className="relative z-10 drop-shadow-md">User Profile</span>
                <span className={`
                  absolute -bottom-1 left-0 w-full h-1 transform transition-transform duration-300
                  ${darkMode
                    ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-pulse-slow'
                    : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-pulse-slow'
                  }
                `}></span>
              </h1>

              <div className="mb-8">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative group p-5 rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.02]">
                    {/* Animated background */}
                    <div className={`
                      absolute inset-0 transition-all duration-500
                      ${darkMode
                        ? 'bg-gradient-to-br from-gray-700 to-gray-800 animate-gradient-shift'
                        : 'bg-gradient-to-br from-white to-indigo-50 animate-gradient-shift'
                      }
                    `}></div>

                    {/* Animated border */}
                    <div className={`
                      absolute -inset-0.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm
                      ${darkMode
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 animate-gradient-shift'
                        : 'bg-gradient-to-r from-indigo-300 to-purple-300 animate-gradient-shift'
                      }
                    `}></div>

                    {/* Content */}
                    <div className="relative z-10">
                      <h2 className={`
                        text-xl font-bold mb-2
                        ${darkMode
                          ? 'text-indigo-300 drop-shadow-md'
                          : 'text-indigo-700 drop-shadow-sm'
                        }
                      `}>
                        Full Name:
                      </h2>
                      <p className={`
                        text-lg font-semibold transition-all duration-300
                        ${darkMode ? 'text-white drop-shadow-md' : 'text-gray-900'}
                      `}>
                        {user?.user_metadata?.full_name || 'Not provided'}
                      </p>
                    </div>
                  </div>

                  <div className="relative group p-5 rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.02]">
                    {/* Animated background */}
                    <div className={`
                      absolute inset-0 transition-all duration-500
                      ${darkMode
                        ? 'bg-gradient-to-br from-gray-700 to-gray-800 animate-gradient-shift'
                        : 'bg-gradient-to-br from-white to-purple-50 animate-gradient-shift'
                      }
                    `}></div>

                    {/* Animated border */}
                    <div className={`
                      absolute -inset-0.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm
                      ${darkMode
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 animate-gradient-shift'
                        : 'bg-gradient-to-r from-purple-300 to-indigo-300 animate-gradient-shift'
                      }
                    `}></div>

                    {/* Content */}
                    <div className="relative z-10">
                      <h2 className={`
                        text-xl font-bold mb-2
                        ${darkMode
                          ? 'text-purple-300 drop-shadow-md'
                          : 'text-purple-700 drop-shadow-sm'
                        }
                      `}>
                        Email Address:
                      </h2>
                      <p className={`
                        text-lg font-semibold transition-all duration-300
                        ${darkMode ? 'text-white drop-shadow-md' : 'text-gray-900'}
                      `}>
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`
                border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}
                pt-6 mt-8 relative
              `}>
                {/* Animated border line */}
                <div className={`
                  absolute -top-px left-0 right-0 h-px
                  ${darkMode
                    ? 'bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-gradient-shift'
                    : 'bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-gradient-shift'
                  }
                `}></div>

                <h2 className={`
                  text-2xl font-bold mb-4 relative inline-block
                  ${darkMode
                    ? 'text-white'
                    : 'text-indigo-700'
                  }
                `}>
                  <span className="relative drop-shadow-md">Change Password</span>
                  <span className={`
                    absolute -bottom-1 left-0 w-full h-1 transform transition-transform duration-300
                    ${darkMode
                      ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-pulse-slow'
                      : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-pulse-slow'
                    }
                  `}></span>
                </h2>

                {message.text && (
                  <div className={`
                    mb-4 p-4 rounded-lg
                    ${message.type === 'error'
                      ? darkMode ? 'bg-red-900/30 border border-red-800 text-red-400' : 'bg-red-100 border border-red-300 text-red-700'
                      : darkMode ? 'bg-green-900/30 border border-green-800 text-green-400' : 'bg-green-100 border border-green-300 text-green-700'
                    }
                  `}>
                    {message.text}
                  </div>
                )}

                <form onSubmit={handleUpdatePassword} className="space-y-5">
                  <div className="group">
                    <label
                      htmlFor="currentPassword"
                      className={`
                        block text-base font-semibold mb-2 transition-colors duration-300
                        ${darkMode
                          ? 'text-gray-200 group-focus-within:text-purple-300 drop-shadow-sm'
                          : 'text-gray-800 group-focus-within:text-indigo-700 drop-shadow-sm'
                        }
                      `}
                    >
                      Current Password:
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        className={`
                          w-full px-4 py-3 rounded-lg text-base
                          transition-all duration-300
                          focus:outline-none border-2
                          ${darkMode
                            ? 'bg-gray-800 border-gray-600 text-white focus:border-purple-500 shadow-inner'
                            : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-500 shadow-sm'
                          }
                        `}
                      />
                      <div className={`
                        absolute bottom-0 left-0 h-0.5 w-0 group-focus-within:w-full transition-all duration-500
                        ${darkMode
                          ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-gradient-shift'
                          : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-gradient-shift'
                        }
                      `}></div>
                    </div>
                  </div>

                  <div className="group">
                    <label
                      htmlFor="newPassword"
                      className={`
                        block text-base font-semibold mb-2 transition-colors duration-300
                        ${darkMode
                          ? 'text-gray-200 group-focus-within:text-purple-300 drop-shadow-sm'
                          : 'text-gray-800 group-focus-within:text-indigo-700 drop-shadow-sm'
                        }
                      `}
                    >
                      New Password:
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        required
                        minLength={6}
                        className={`
                          w-full px-4 py-3 rounded-lg text-base
                          transition-all duration-300
                          focus:outline-none border-2
                          ${darkMode
                            ? 'bg-gray-800 border-gray-600 text-white focus:border-purple-500 shadow-inner'
                            : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-500 shadow-sm'
                          }
                        `}
                      />
                      <div className={`
                        absolute bottom-0 left-0 h-0.5 w-0 group-focus-within:w-full transition-all duration-500
                        ${darkMode
                          ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-gradient-shift'
                          : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-gradient-shift'
                        }
                      `}></div>
                    </div>
                  </div>

                  <div className="group">
                    <label
                      htmlFor="confirmPassword"
                      className={`
                        block text-base font-semibold mb-2 transition-colors duration-300
                        ${darkMode
                          ? 'text-gray-200 group-focus-within:text-purple-300 drop-shadow-sm'
                          : 'text-gray-800 group-focus-within:text-indigo-700 drop-shadow-sm'
                        }
                      `}
                    >
                      Confirm New Password:
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        minLength={6}
                        className={`
                          w-full px-4 py-3 rounded-lg text-base
                          transition-all duration-300
                          focus:outline-none border-2
                          ${darkMode
                            ? 'bg-gray-800 border-gray-600 text-white focus:border-purple-500 shadow-inner'
                            : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-500 shadow-sm'
                          }
                        `}
                      />
                      <div className={`
                        absolute bottom-0 left-0 h-0.5 w-0 group-focus-within:w-full transition-all duration-500
                        ${darkMode
                          ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-gradient-shift'
                          : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-gradient-shift'
                        }
                      `}></div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`
                      relative overflow-hidden w-full py-4 px-6 rounded-lg font-bold text-lg text-white
                      transition-all duration-300 transform hover:translate-y-[-2px] group
                      ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl'}
                      border-2 border-white/10
                    `}
                  >
                    {/* Background gradient with animation */}
                    <div className={`
                      absolute inset-0 transition-all duration-500
                      bg-gradient-to-r animate-gradient-shift
                      ${darkMode
                        ? 'from-indigo-600 via-purple-600 to-indigo-600'
                        : 'from-indigo-500 via-purple-500 to-indigo-600'
                      }
                    `}></div>

                    {/* Hover effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-white"></div>

                    {/* Animated border */}
                    <span className="absolute bottom-0 left-0 w-full h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 bg-white/30"></span>

                    {/* Content */}
                    <span className="relative z-10 flex items-center justify-center drop-shadow-md">
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Updating...
                        </span>
                      ) : 'UPDATE PASSWORD'}
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </PageContainer>
    </div>
  );
}