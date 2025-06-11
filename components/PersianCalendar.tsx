'use client'

import { useState } from 'react'

const PersianCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  
  // تاریخ فارسی ساده
  const persianDate = new Date().toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })

  return (
    <div style={{
      border: '2px solid #4CAF50',
      borderRadius: '10px',
      padding: '20px',
      backgroundColor: '#f9f9f9',
      maxWidth: '400px',
      margin: '0 auto'
    }}>
      <h2 style={{ color: '#2E7D32', marginBottom: '15px' }}>
        📅 تقویم فارسی
      </h2>
      <div style={{
        fontSize: '18px',
        color: '#1976D2',
        marginBottom: '10px'
      }}>
        {persianDate}
      </div>
      <div style={{
        fontSize: '14px',
        color: '#666',
        marginTop: '15px'
      }}>
        🚀 تقویم پیشرفته به زودی...
      </div>
    </div>
  )
}

export default PersianCalendar
