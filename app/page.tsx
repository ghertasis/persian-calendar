'use client';

import React, { useState } from 'react';
import GoogleAuth from '../components/GoogleAuth';
import PersianCalendar from '../components/PersianCalendar';
import DebugOAuth from '../components/DebugOAuth';

interface User {
  email: string;
  name: string;
  picture?: string;
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | undefined>();
  const [showDebug, setShowDebug] = useState(true); // فعلاً همیشه نمایش بده

  const handleAuthChange = (authenticated: boolean, userData?: User) => {
    setIsAuthenticated(authenticated);
    setUser(userData);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8" dir="rtl">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📅 تقویم شمسی هوشمند
          </h1>
          <p className="text-gray-600">
            تقویم فارسی با قابلیت نمایش رویدادهای Google Calendar
          </p>
        </div>

        {/* کامپوننت عیب‌یابی - فقط برای debug */}
        {showDebug && (
          <div className="mb-6">
            <DebugOAuth />
            <div className="text-center">
              <button
                onClick={() => setShowDebug(false)}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                مخفی کردن پنل debug
              </button>
            </div>
          </div>
        )}

        {/* کامپوننت احراز هویت */}
        <GoogleAuth onAuthChange={handleAuthChange} />

        {/* نمایش تقویم */}
        <PersianCalendar />

        {/* راهنمای استفاده */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6" dir="rtl">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            📖 راهنمای استفاده
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">🔧 امکانات فعلی:</h3>
              <ul className="space-y-1">
                <li>• نمایش تقویم شمسی دقیق</li>
                <li>• مشخص کردن روز جاری</li>
                <li>• ناوبری بین ماه‌ها</li>
                <li>• برگشت سریع به امروز</li>
                {isAuthenticated && (
                  <>
                    <li>• ✅ اتصال به Google Calendar</li>
                    <li>• نمایش رویدادهای شما</li>
                    <li>• جزئیات رویدادها</li>
                  </>
                )}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">🚀 ویژگی‌های آینده:</h3>
              <ul className="space-y-1">
                <li>• افزودن رویداد جدید</li>
                <li>• یادآوری‌ها</li>
                <li>• تعطیلات رسمی ایران</li>
                <li>• تم تاریک/روشن</li>
                <li>• صدور PDF</li>
                <li>• اشتراک‌گذاری رویدادها</li>
              </ul>
            </div>
          </div>
        </div>

        {/* اطلاعات وضعیت */}
        <div className="mt-6 text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
            isAuthenticated 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            <span className={isAuthenticated ? '🟢' : '🟡'}>
              {isAuthenticated 
                ? `متصل به Google Calendar (${user?.email})` 
                : 'برای مشاهده رویدادها، ابتدا وارد شوید'
              }
            </span>
          </div>
        </div>

        {/* نمایش debug info فعلی */}
        {!showDebug && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowDebug(true)}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              🔧 نمایش پنل عیب‌یابی
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
