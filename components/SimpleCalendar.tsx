// components/SimpleCalendar.tsx
'use client'

import React, { useState } from 'react'

export default function SimpleCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  
  // نام‌های ماه‌های فارسی
  const persianMonths = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ]
  
  // نام‌های روزهای هفته
  const weekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']
  
  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '20px auto', 
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontFamily: 'Tahoma, Arial, sans-serif'
    }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>
        تقویم ساده
      </h2>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(7, 1fr)', 
        gap: '5px',
        textAlign: 'center',
        marginTop: '20px'
      }}>
        {weekDays.map(day => (
          <div key={day} style={{ 
            padding: '10px', 
            fontWeight: 'bold',
            backgroundColor: '#f5f5f5'
          }}>
            {day}
          </div>
        ))}
        
        {/* نمایش روزها (فعلاً ساده) */}
        {Array.from({length: 30}, (_, i) => (
          <div key={i} style={{ 
            padding: '10px', 
            border: '1px solid #eee',
            cursor: 'pointer',
            backgroundColor: '#fff'
          }}>
            {i + 1}
          </div>
        ))}
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p>تاریخ میلادی: {currentDate.toLocaleDateString('fa-IR')}</p>
      </div>
    </div>
  )
}
