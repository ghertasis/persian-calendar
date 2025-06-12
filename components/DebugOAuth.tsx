// 🔍 مرحله 1: چک کردن وضعیت فعلی
// این کد رو در components/DebugOAuth.tsx قرار بده

'use client';

import React, { useState } from 'react';

const DebugOAuth: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // تست مسیرهای مختلف API
  const testEndpoint = async (endpoint: string, description: string) => {
    try {
      console.log(`🔍 Testing ${endpoint}...`);
      const response = await fetch(endpoint);
      const data = await response.text();
      
      return {
        endpoint,
        description,
        status: response.status,
        ok: response.ok,
        data: data.substring(0, 200) + (data.length > 200 ? '...' : ''),
        headers: Object.fromEntries(response.headers.entries())
      };
    } catch (error) {
      return {
        endpoint,
        description,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  const runDebugTests = async () => {
    setLoading(true);
    const results = [];

    // تست مسیرهای مختلف
    const endpoints = [
      { url: '/api/auth/session', desc: 'Session Check' },
      { url: '/api/calendars', desc: 'Calendar API' },
      { url: '/auth/google/callback', desc: 'Google Callback' },
      { url: '/api/auth/[...nextauth]', desc: 'NextAuth Route' }
    ];

    for (const { url, desc } of endpoints) {
      const result = await testEndpoint(url, desc);
      results.push(result);
    }

    // اطلاعات browser
    const browserInfo = {
      userAgent: navigator.userAgent,
      currentURL: window.location.href,
      localStorage: {
        length: localStorage.length,
        keys: Object.keys(localStorage)
      },
      cookies: document.cookie || 'No cookies'
    };

    setDebugInfo({ apiTests: results, browserInfo });
    setLoading(false);
  };

  const testDirectGoogleAuth = () => {
    // تست مستقیم Google OAuth
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'NOT_SET';
    const redirectUri = encodeURIComponent(window.location.origin + '/auth/google/callback');
    const scope = encodeURIComponent('openid profile email https://www.googleapis.com/auth/calendar.readonly');
    
    const googleAuthUrl = `https://accounts.google.com/oauth/authorize?` +
      `client_id=${clientId}&` +
      `redirect_uri=${redirectUri}&` +
      `scope=${scope}&` +
      `response_type=code&` +
      `access_type=offline&` +
      `prompt=consent`;

    console.log('🌐 Google Auth URL:', googleAuthUrl);
    window.location.href = googleAuthUrl;
  };

  return (
    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 mb-6" dir="rtl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        🔧 تست و عیب‌یابی OAuth
      </h2>

      <div className="space-y-4">
        {/* دکمه‌های تست */}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={runDebugTests}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? '🔄 در حال تست...' : '🔍 تست API ها'}
          </button>

          <button
            onClick={testDirectGoogleAuth}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            🌐 تست مستقیم Google
          </button>

          <button
            onClick={() => {
              console.log('🗑️ Clearing localStorage...');
              localStorage.clear();
              alert('LocalStorage پاک شد!');
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            🗑️ پاک کردن Cache
          </button>
        </div>

        {/* نمایش نتایج */}
        {debugInfo && (
          <div className="bg-white p-4 rounded border">
            <h3 className="font-bold mb-3">📋 نتایج تست:</h3>
            
            {/* اطلاعات مرورگر */}
            <div className="mb-4">
              <h4 className="font-semibold text-blue-700">🌐 اطلاعات مرورگر:</h4>
              <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                {JSON.stringify(debugInfo.browserInfo, null, 2)}
              </pre>
            </div>

            {/* نتایج API */}
            <div>
              <h4 className="font-semibold text-green-700">🔌 تست API ها:</h4>
              {debugInfo.apiTests.map((test: any, index: number) => (
                <div key={index} className="mt-2 p-2 border-l-4 border-gray-300">
                  <div className="font-medium">
                    {test.description} - {test.endpoint}
                  </div>
                  <div className={`text-sm ${test.ok ? 'text-green-600' : 'text-red-600'}`}>
                    Status: {test.status || 'ERROR'}
                    {test.error && ` | Error: ${test.error}`}
                  </div>
                  {test.data && (
                    <details className="mt-1">
                      <summary className="cursor-pointer text-xs text-gray-600">
                        📄 مشاهده پاسخ
                      </summary>
                      <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto max-h-32">
                        {test.data}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* راهنمای عیب‌یابی */}
        <div className="bg-blue-50 p-4 rounded">
          <h4 className="font-semibold text-blue-800 mb-2">💡 نکات عیب‌یابی:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• اگر "تست مستقیم Google" کار کرد → مشکل در کد OAuth handler هست</li>
            <li>• اگر API ها 404 میدن → مسیرها اشتباه تعریف شدن</li>
            <li>• اگر Console پر از خطاست → مشکل JavaScript داریم</li>
            <li>• اگر cookie ها خالیه → session management کار نمیکنه</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DebugOAuth;
