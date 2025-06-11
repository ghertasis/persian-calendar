'use client'

import { useState, useEffect } from 'react'
import moment from 'moment-jalaali'

const PersianCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  // گرفتن تاریخ شمسی امروز
  const getTodayPersian = () => {
    const today = moment()
    return {
      year: today.jYear(),
      month: today.jMonth(), // 0-based index
      day: today.jDate()
    }
  }

  const [currentMonth, setCurrentMonth] = useState(() => getTodayPersian().year)
  const [currentMonthIndex, setCurrentMonthIndex] = useState(() => getTodayPersian().month)

  const persianMonths = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ]

  const persianWeekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']

  // تابع برای گرفتن تعداد روزهای ماه - روش صحیح
  const getDaysInMonth = (year: number, month: number) => {
    // روش صحیح: ساخت آخرین روز ماه و گرفتن روز آن
    const lastDayOfMonth = moment().jYear(year).jMonth(month + 1).jDate(0)
    return lastDayOfMonth.jDate()
  }

  // تابع برای محاسبه روز شروع ماه
  const getFirstDayOfMonth = (year: number, month: number) => {
    // ساخت تاریخ اول ماه با moment-jalaali
    const firstDay = moment().jYear(year).jMonth(month).jDate(1)
    
    // گرفتن روز هفته از تاریخ میلادی
    const dayOfWeek = firstDay.day() // 0=یکشنبه, 1=دوشنبه, ..., 6=شنبه
    
    // تبدیل به نظام تقویم فارسی (0=شنبه, 1=یکشنبه, ...)
    return (dayOfWeek + 1) % 7
  }

  // تولید روزهای ماه
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentMonthIndex)
    const firstDay = getFirstDayOfMonth(currentMonth, currentMonthIndex)
    const days = []
    
    // روزهای خالی اول ماه
    for (let i = 0; i < firstDay; i++) {
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
    setSelectedDay(null)
  }

  const prevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonth(currentMonth - 1)
      setCurrentMonthIndex(11)
    } else {
      setCurrentMonthIndex(currentMonthIndex - 1)
    }
    setSelectedDay(null)
  }

  // برگشت به ماه جاری
  const goToToday = () => {
    const today = getTodayPersian()
    setCurrentMonth(today.year)
    setCurrentMonthIndex(today.month)
    setSelectedDay(today.day)
  }

  // بررسی اینکه آیا روز انتخاب شده امروز است
  const isToday = (day: number | null): boolean => {
    if (!day) return false
    const today = getTodayPersian()
    return (
      day === today.day &&
      currentMonthIndex === today.month &&
      currentMonth === today.year
    )
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
            cursor: 'pointer',
            padding: '5px 10px',
            borderRadius: '5px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          ◀
        </button>
        
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>
            {persianMonths[currentMonthIndex]} {currentMonth}
          </h3>
          <button 
            onClick={goToToday}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              fontSize: '12px',
              cursor: 'pointer',
              padding: '3px 8px',
              borderRadius: '10px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
          >
            امروز
          </button>
        </div>
        
        <button 
          onClick={nextMonth}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '5px 10px',
            borderRadius: '5px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
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
                ? (selectedDay === day ? '#4CAF50' 
                   : isToday(day) ? '#FF9800'
                   : '#f5f5f5')
                : 'transparent',
              color: day
                ? (selectedDay === day || isToday(day) ? 'white' : '#333')
                : 'transparent',
              border: day ? '1px solid #ddd' : 'none',
              fontSize: '14px',
              fontWeight: isToday(day) ? 'bold' : 'normal',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (day && selectedDay !== day && !isToday(day)) {
                e.currentTarget.style.backgroundColor = '#E8F5E8'
              }
            }}
            onMouseLeave={(e) => {
              if (day && selectedDay !== day && !isToday(day)) {
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

      {/* تاریخ امروز با moment-jalaali */}
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
        🕐 امروز: {moment().format('jYYYY/jMM/jDD')} - {moment().format('dddd')}
      </div>

      {/* Debug info */}
      <div style={{
        marginTop: '10px',
        padding: '8px',
        backgroundColor: '#f0f0f0',
        borderRadius: '5px',
        fontSize: '12px',
        color: '#666'
      }}>
        🔍 Debug: ماه جاری: {persianMonths[currentMonthIndex]} {currentMonth} | 
        اول ماه: روز {getFirstDayOfMonth(currentMonth, currentMonthIndex)} 
        ({persianWeekDays[getFirstDayOfMonth(currentMonth, currentMonthIndex)]}) |
        تعداد روز: {getDaysInMonth(currentMonth, currentMonthIndex)}
      </div>
    </div>
  )
}

export default PersianCalendar
