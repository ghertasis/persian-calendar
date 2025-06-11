'use client'

import { useState, useEffect } from 'react'
import PersianCalendar from '../components/PersianCalendar'

export default function Home() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1500)
  }, [])

  if (loading) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '50px',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h1>🗓️ تقویم فارسی هیبرید</h1>
        <div style={{ 
          margin: '20px 0',
          fontSize: '18px'
        }}>
          در حال بارگذاری تقویم...
        </div>
        <div style={{ 
          width: '50px',
          height: '50px',
          border: '3px solid #f3f3f3',
          borderTop: '3px solid #2563eb',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <div style={{
          background: 'linear-gradient(90deg, #2563eb, #1d4ed8)',
          color: 'white',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h1 style={{ margin: 0, fontSize: '28px' }}>
            🗓️ تقویم فارسی هیبرید
          </h1>
          <p style={{ margin: '10px 0 0 0', opacity: 0.9 }}>
            تقویم هجری شمسی با قابلیت اتصال به Google Calendar
          </p>
        </div>
        
        <PersianCalendar />
      </div>
    </div>
  )
}
