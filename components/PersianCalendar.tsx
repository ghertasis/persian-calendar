'use client'

import { useState, useEffect } from 'react'

const PersianCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  // گرفتن تاریخ شمسی امروز
  const getTodayPersian = () => {
    const today = new Date()
    const persianDate = today.toLocaleDateString('fa-IR-u-nu-latn').split('/')
    return {
      year: parseInt(persianDate[0]),
      month: parseInt(persianDate[1]) - 1, // 0-based index
      day: parseInt(persianDate[2])
    }
  }

  const [currentMonth, setCurrentMonth] = useState(() => getTodayPersian().year)
  const [currentMonthIndex, setCurrentMonthIndex] = useState(() => getTodayPersian().month)

  const persianMonths = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ]

  const persianWeekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']

  // تابع برای گرفتن تعداد روزهای ماه
  const getDaysInMonth = (year: number, month: number) => {
    if (month <= 5) return 31 // فروردین تا شهریور
    if (month <= 10) return 30 // مهر تا بهمن
    // اسفند: بررسی سال کبیسه
    return isLeapYear(year) ? 30 : 29
  }

  // بررسی سال کبیسه فارسی
  const isLeapYear = (year: number) => {
    const breaks = [
      -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210,
      1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178
    ]
    
    const gy = year + 1595
    let leap = -14
    let jp = breaks[0]
    
    let jump = 0
    for (let j = 1; j <= 19; j++) {
      const jm = breaks[j]
      jump = jm - jp
      if (year < jm) break
      leap += Math.floor(jump / 33) * 8 + Math.floor(((jump % 33) / 4))
      jp = jm
    }
    
    let n = year - jp
    if (n < jump) {
      leap += Math.floor(n / 33) * 8 + Math.floor(((n % 33) + 3) / 4)
      if ((jump % 33) === 4 && (jump - n) === 4) leap++
      const leapAdj = ((jump % 33) === 1 || (jump % 33) === 2) ? 1 : 0
      if ((jump % 33) === leapAdj && (jump - n) === leapAdj) leap++
    }
    
    return (leap + 4) % 33 < 5
  }

  // تابع برای محاسبه روز شروع ماه
  const getFirstDayOfMonth = (year: number, month: number) => {
    // تبدیل تاریخ شمسی به میلادی
    const persianToGregorian = (jy: number, jm: number, jd: number) => {
      let gy, gm, gd
      let jy0 = jy - 979
      let jp = 0
      
      const breaks = [
        -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210,
        1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178
      ]
      
      for (let j = 1; j <= 19; j++) {
        const jm0 = breaks[j]
        if (jy < jm0) break
        jp = breaks[j]
      }
      
      let n = jy0 - jp
      let leap = Math.floor(n / 33) * 8 + Math.floor(((n % 33) + 3) / 4)
      
      if ((jp % 33) === 4 && (n - jp) === 4) leap++
      
      const sal_a = ((jp % 33) === 1 || (jp % 33) === 2) ? 1 : 0
      if ((jp % 33) === sal_a && (n - jp) === sal_a) leap++
      
      jp = jp + 1029983
      gy = 1600 + 33 * Math.floor((jp + leap) / 12053)
      jp = (jp + leap) % 12053
      
      gy += 4 * Math.floor(jp / 1461)
      jp = jp % 1461
      
      if (jp > 365) {
        gy += Math.floor((jp - 1) / 365)
        jp = (jp - 1) % 365
      }
      
      let jd0 = jd
      if (jm < 6) jd0 += (jm - 1) * 31
      else jd0 += (jm - 6) * 30 + 186
      
      const gd0 = jp + jd0
      
      // تبدیل روز سال به ماه و روز
      const sal_a2 = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365]
      let i
      for (i = 0; i < 13; i++) {
        if (gd0 <= sal_a2[i]) break
      }
      
      gm = i
      gd = gd0 - sal_a2[i - 1]
      
      return new Date(gy, gm - 1, gd)
    }
    
    const firstDayGregorian = persianToGregorian(year, month + 1, 1)
    const dayOfWeek = firstDayGregorian.getDay()
    
    // تبدیل: یکشنبه=0 -> شنبه=0
    return dayOfWeek === 6 ? 0 : dayOfWeek + 1
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
