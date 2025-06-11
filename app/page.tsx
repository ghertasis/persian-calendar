// app/page.tsx
'use client'

import { useState } from 'react'
import SimpleCalendar from '../components/SimpleCalendar'
import PersianCalendar from '../components/PersianCalendar'

export default function Home() {
  const [showPersianCalendar, setShowPersianCalendar] = useState(false)

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      <h1 style={{ 
        textAlign: 'center', 
        color: '#2c3e50',
        marginBottom: '30px',
        fontSize: '28px'
      }}>
        🗓️ تقویم فارسی هیبرید
      </h1>
      
      {/* دکمه‌های تغییر نوع تقویم */}
      <div style={{
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        <button
          onClick={() => setShowPersianCalendar(false)}
          style={{
            background: !showPersianCalendar ? '#3498db' : '#ecf0f1',
            color: !showPersianCalendar ? 'white' : '#2c3e50',
            border: 'none',
            borderRadius: '6px',
            padding: '12px 24px',
            margin: '0 10px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          تقویم ساده
        </button>
        
        <button
          onClick={() => setShowPersianCalendar(true)}
          style={{
            background: showPersianCalendar ? '#3498db' : '#ecf0f1',
            color: showPersianCalendar ? 'white' : '#2c3e50',
            border: 'none',
            borderRadius: '6px',
            padding: '12px 24px',
            margin: '0 10px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          تقویم فارسی کامل
        </button>
      </div>
      
      {/* نمایش تقویم انتخابی */}
      {showPersianCalendar ? <PersianCalendar /> : <SimpleCalendar />}
      
      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <p style={{ color: '#666', fontSize: '14px' }}>
          ✅ {showPersianCalendar ? 'تقویم فارسی کامل' : 'تقویم ساده'} با موفقیت بارگذاری شد!
        </p>
      </div>
    </div>
  )
}
