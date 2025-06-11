'use client'

import { useState, useEffect } from 'react'

const PersianCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(1403) // سال جاری
  const [currentMonthIndex, setCurrentMonthIndex] = useState(8) // ماه جاری (آذر = 8)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  const persianMonths = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ]

  const persianWeekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']

  // تابع برای گرفتن تعداد روزهای ماه
  const getDaysInMonth = (year: number, month: number) => {
    if (month <= 6) return 31
    if (month <= 11) return 30
    // بهمن: بررسی سال کبیسه
    return isLeapYear(year) ? 30 : 29
  }

  // بررسی سال کبیسه (ساده)
  const isLeapYear = (year: number) => {
    return ((year + 2346) % 128 <= 29)
  }

  // تولید روزهای ماه
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentMonthIndex)
    const days = []
    
    // روزهای خالی اول ماه (فرضی: هر ماه از شنبه شروع میشه)
    const startDay = 0 // شنبه
    for (let i = 0; i < startDay; i++) {
      days.push(null)
    }

    // روزهای ماه
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const nextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonth(currentMonth + 1)
      setCurrentMonthIndex(0)
    } else {
      setCurrentMonthIndex(currentMonthIndex + 1)
    }
  }

  const prevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonth(currentMonth - 1)
      setCurrentMonthIndex(11)
    } else {
      setCurrentMonthIndex(currentMonthIndex - 1)
    }
  }

  const calendarDays = generateCalendarDays()

  return (
    <div style={{
      border: '2px solid #2196F3',
      borderRadius: '15px',
      padding: '20px',
      backgroundColor: '#fff',
      maxWidth: '500px',
      margin: '0 auto',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    }}>
      {/* هدر تقویم */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        backgroundColor: '#1976D2',
        color: 'white',
        padding: '15px',
        borderRadius: '10px'
      }}>
        <button 
          onClick={prevMonth}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '20px',
            cursor: 'pointer'
          }}
        >
          ◀
        </button>
        
        <h3 style={{ margin: 0, fontSize: '18px' }}>
          {persianMonths[currentMonthIndex]} {currentMonth}
        </h3>
        
        <button 
          onClick={nextMonth}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '20px',
            cursor: 'pointer'
          }}
        >
          ▶
        </button>
      </div>

      {/* روزهای هفته */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '5px',
        marginBottom: '10px'
      }}>
        {persianWeekDays.map((day, index) => (
          <div
            key={index}
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
              padding: '10px',
              backgroundColor: '#E3F2FD',
              borderRadius: '5px',
              color: '#1976D2'
            }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* روزهای ماه */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '5px'
      }}>
        {calendarDays.map((day, index) => (
          <div
            key={index}
            onClick={() => day && setSelectedDay(day)}
            style={{
              textAlign: 'center',
              padding: '12px',
              borderRadius: '8px',
              cursor: day ? 'pointer' : 'default',
              backgroundColor: day 
                ? (selectedDay === day ? '#4CAF50' : '#f5f5f5')
                : 'transparent',
              color: day
                ? (selectedDay === day ? 'white' : '#333')
                : 'transparent',
              border: day ? '1px solid #ddd' : 'none',
              fontSize: '14px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (day && selectedDay !== day) {
                e.currentTarget.style.backgroundColor = '#E8F5E8'
              }
            }}
            onMouseLeave={(e) => {
              if (day && selectedDay !== day) {
                e.currentTarget.style.backgroundColor = '#f5f5f5'
              }
            }}
          >
            {day || ''}
          </div>
        ))}
      </div>

      {/* اطلاعات روز انتخاب شده */}
      {selectedDay && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#E8F5E8',
          borderRadius: '10px',
          textAlign: 'center',
          border: '2px solid #4CAF50'
        }}>
          <strong>📅 روز انتخاب شده:</strong>
          <br />
          {selectedDay} {persianMonths[currentMonthIndex]} {currentMonth}
        </div>
      )}

      {/* تاریخ امروز */}
      <div style={{
        marginTop: '15px',
        padding: '10px',
        backgroundColor: '#FFF3E0',
        borderRadius: '8px',
        textAlign: 'center',
        fontSize: '14px',
        color: '#E65100',
        border: '1px solid #FFB74D'
      }}>
        🕐 امروز: {new Date().toLocaleDateString('fa-IR')}
      </div>
    </div>
  )
}

export default PersianCalendar
