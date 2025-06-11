// app/page.tsx
'use client'

import SimpleCalendar from '../components/SimpleCalendar'

export default function Home() {
  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center', color: '#2c3e50' }}>
        تقویم فارسی هیبرید
      </h1>
      
      <SimpleCalendar />
      
      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <p style={{ color: '#666' }}>
          ✅ تقویم ساده با موفقیت بارگذاری شد!
        </p>
      </div>
    </div>
  )
}
