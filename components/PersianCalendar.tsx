'use client'

import React, { useState, useEffect } from 'react'

// تایپ برای روز
interface CalendarDay {
  day: number
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
  jDate: string
}

export default function PersianCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([])
  const [momentJalaali, setMomentJalaali] = useState<any>(null)

  // نام‌های ماه‌های فارسی
  const persianMonths = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ]
  
  // نام‌های روزهای هفته
  const weekDays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه']
  const weekDaysShort = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']

  // بارگذاری moment-jalaali
  useEffect(() => {
    async function loadMomentJalaali() {
      try {
        const moment = await import('moment-jalaali')
        const momentInstance = moment.default || moment
        momentInstance.loadPersian({usePersianDigits: true, dialect: 'persian-modern'})
        setMomentJalaali(momentInstance)
      } catch (error) {
        console.error('خطا در بارگذاری moment-jalaali:', error)
      }
    }
    
    loadMomentJalaali()
  }, [])

  // تولید روزهای تقویم
  useEffect(() => {
    if (!momentJalaali) return

    try {
      const now = momentJalaali()
      const currentJDate = momentJalaali(currentDate)
      
      // اول ماه جاری
      const startOfMonth = currentJDate.clone().startOf('jMonth')
      const endOfMonth = currentJDate.clone().endOf('jMonth')
      
      // روز اول هفته (شنبه = ۶، یکشنبه = ۰)
      const startDay = startOfMonth.day()
      const adjustedStartDay = startDay === 6 ? 0 : startDay + 1
      
      const days: CalendarDay[] = []
      
      // روزهای ماه قبل
      for (let i = adjustedStartDay - 1; i >= 0; i--) {
        const prevDay = startOfMonth.clone().subtract(i + 1, 'days')
        days.push({
          day: prevDay.jDate(),
          isCurrentMonth: false,
          isToday: false,
          isSelected: false,
          jDate: prevDay.format('jYYYY/jMM/jDD')
        })
      }
      
      // روزهای ماه جاری
      const daysInMonth = currentJDate.jDaysInMonth()
      for (let day = 1; day <= daysInMonth; day++) {
        const dayDate = startOfMonth.clone().jDate(day)
        const isToday = dayDate.format('jYYYY/jMM/jDD') === now.format('jYYYY/jMM/jDD')
        
        days.push({
          day: day,
          isCurrentMonth: true,
          isToday: isToday,
          isSelected: selectedDate === dayDate.format('jYYYY/jMM/jDD'),
          jDate: dayDate.format('jYYYY/jMM/jDD')
        })
      }
      
      // روزهای ماه بعد تا تکمیل ۴۲ روز (۶ هفته)
      const remainingDays = 42 - days.length
      for (let day = 1; day <= remainingDays; day++) {
        const nextDay = endOfMonth.clone().add(day, 'days')
        days.push({
          day: nextDay.jDate(),
          isCurrentMonth: false,
          isToday: false,
          isSelected: false,
          jDate: nextDay.format('jYYYY/jMM/jDD')
        })
      }
      
      setCalendarDays(days)
    } catch (error) {
      console.error('خطا در تولید تقویم:', error)
    }
  }, [currentDate, selectedDate, momentJalaali])

  // تغییر ماه
  const changeMonth = (direction: 'prev' | 'next') => {
    if (!momentJalaali) return
    
    const newDate = momentJalaali(currentDate)
    if (direction === 'prev') {
      newDate.subtract(1, 'jMonth')
    } else {
      newDate.add(1, 'jMonth')
    }
    setCurrentDate(newDate.toDate())
  }

  // انتخاب روز
  const selectDay = (day: CalendarDay) => {
    setSelectedDate(day.jDate)
  }

  // برگشت به امروز
  const goToToday = () => {
    setCurrentDate(new Date())
    if (momentJalaali) {
      setSelectedDate(momentJalaali().format('jYYYY/jMM/jDD'))
    }
  }

  if (!momentJalaali) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ 
          display: 'inline-block',
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ marginTop: '20px', color: '#666' }}>در حال بارگذاری تقویم...</p>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  const currentJMoment = momentJalaali(currentDate)
  const currentMonth = currentJMoment.jMonth()
  const currentYear = currentJMoment.jYear()

  return (
    <div style={{ 
      maxWidth: '500px', 
      margin: '20px auto', 
      padding: '20px',
      border: '1px solid #e1e8ed',
      borderRadius: '12px',
      fontFamily: 'Tahoma, Arial, sans-serif',
      backgroundColor: '#fff',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      {/* هدر تقویم */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        padding: '10px 0'
      }}>
        <button 
          onClick={() => changeMonth('next')}
          style={{
            background: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor: 'pointer',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ←
        </button>
        
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ margin: '0', color: '#2c3e50', fontSize: '20px' }}>
            {persianMonths[currentMonth]} {currentYear}
          </h2>
        </div>
        
        <button 
          onClick={() => changeMonth('prev')}
          style={{
            background: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor: 'pointer',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          →
        </button>
      </div>

      {/* روزهای هفته */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(7, 1fr)', 
        gap: '5px',
        marginBottom: '10px'
      }}>
        {weekDaysShort.map(day => (
          <div key={day} style={{ 
            padding: '12px 8px', 
            fontWeight: 'bold',
            backgroundColor: '#f8f9fa',
            textAlign: 'center',
            fontSize: '14px',
            color: '#495057',
            borderRadius: '6px'
          }}>
            {day}
          </div>
        ))}
      </div>
      
      {/* روزهای ماه */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(7, 1fr)', 
        gap: '5px',
        marginBottom: '20px'
      }}>
        {calendarDays.map((day, index) => (
          <button
            key={index}
            onClick={() => selectDay(day)}
            style={{ 
              padding: '12px',
              border: day.isSelected ? '2px solid #3498db' : '1px solid #e9ecef',
              borderRadius: '6px',
              cursor: 'pointer',
              backgroundColor: day.isToday ? '#3498db' : 
                              day.isSelected ? '#e3f2fd' : 
                              day.isCurrentMonth ? '#fff' : '#f8f9fa',
              color: day.isToday ? '#fff' :
                     day.isCurrentMonth ? '#212529' : '#6c757d',
              fontSize: '14px',
              fontWeight: day.isToday ? 'bold' : 'normal',
              transition: 'all 0.2s ease',
              minHeight: '40px'
            }}
            onMouseEnter={(e) => {
              if (!day.isToday && !day.isSelected) {
                e.currentTarget.style.backgroundColor = '#e9ecef'
              }
            }}
            onMouseLeave={(e) => {
              if (!day.isToday && !day.isSelected) {
                e.currentTarget.style.backgroundColor = day.isCurrentMonth ? '#fff' : '#f8f9fa'
              }
            }}
          >
            {day.day}
          </button>
        ))}
      </div>

      {/* دکمه‌های کنترل */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '1px solid #e9ecef',
        paddingTop: '15px'
      }}>
        <button
          onClick={goToToday}
          style={{
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 16px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          امروز
        </button>
        
        {selectedDate && (
          <div style={{ 
            fontSize: '14px', 
            color: '#495057',
            backgroundColor: '#f8f9fa',
            padding: '8px 12px',
            borderRadius: '6px'
          }}>
            انتخاب شده: {selectedDate}
          </div>
        )}
      </div>
    </div>
  )
}
