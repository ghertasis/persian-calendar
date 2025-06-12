'use client';

import React, { useState, useEffect } from 'react';

interface User {
  email: string;
  name: string;
  picture?: string;
}

const GoogleAuth: React.FC<{ onAuthChange: (isAuthenticated: boolean, user?: User) => void }> = ({ onAuthChange }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);

  // چک کردن وضعیت login کاربر
  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        const sessionData = await response.json();
        if (sessionData.user) {
          setUser(sessionData.user);
          onAuthChange(true, sessionData.user);
        } else {
          setUser(null);
          onAuthChange(false);
        }
      } else {
        setUser(null);
        onAuthChange(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
      onAuthChange(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // شروع فرآیند login
  const handleLogin = async () => {
    setLoginLoading(true);
    try {
      // هدایت به صفحه Google OAuth
      window.location.href = '/auth/google/callback';
    } catch (error) {
      console.error('Error during login:', error);
      setLoginLoading(false);
    }
  };

  // خروج از حساب
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      onAuthChange(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-gray-600">🔄 در حال بررسی وضعیت ورود...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center p-6 bg-blue-50 rounded-lg border-2 border-blue-200 mb-6" dir="rtl">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            🔐 ورود به Google Calendar
          </h3>
          <p className="text-gray-600">
            برای مشاهده رویدادها، ابتدا با حساب Google خود وارد شوید
          </p>
        </div>
        
        <button
          onClick={handleLogin}
          disabled={loginLoading}
          className={`
            inline-flex items-center gap-3 px-6 py-3 rounded-lg font-semibold text-white
            transition-colors duration-200
            ${loginLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
            }
          `}
        >
          {loginLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              در حال ورود...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              ورود با Google
            </>
          )}
        </button>
        
        <div className="mt-4 text-sm text-gray-500">
          <div className="flex items-center justify-center gap-2">
            <span>🔒</span>
            <span>اطلاعات شما محفوظ است</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {user.picture && (
            <img
              src={user.picture}
              alt={user.name}
              className="w-10 h-10 rounded-full"
            />
          )}
          <div>
            <div className="font-semibold text-gray-800">
              ✅ خوش آمدید، {user.name}
            </div>
            <div className="text-sm text-gray-600">{user.email}</div>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          خروج
        </button>
      </div>
    </div>
  );
};

export default GoogleAuth;
