'use client'

import { useState, useEffect } from 'react'
import moment from 'moment-jalaali'

// تنظیم moment برای فارسی
moment.loadPersian({ usePersianDigits: true, dialect: 'persian-modern' })

interface CalendarDay {
  date: moment.Moment
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
}

export default function PersianCalendar() {
  const [currentDate, setCurrentDate] = useState(moment())
  const [selectedDate, setSelectedDate] = useState<moment.Moment | null>(null)
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([])

  // نام ماه‌های فارسی
  const persianMonths = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ]

  // نام روزهای هفته
  const weekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']

  // تولید روزهای تقویم
  useEffect(() => {
    generateCalendarDays()
  }, [currentDate])

  const generateCalendarDays = () => {
    const startOfMonth = currentDate.clone().startOf('jMonth')
    const endOfMonth = currentDate.clone().endOf('jMonth')
    
    // پیدا کردن اولین شنبه قبل از شروع ماه
    const startCalendar = startOfMonth.clone()
    while (startCalendar.day() !== 6) { // 6 = شنبه در moment
      startCalendar.subtract(1, 'day')
    }

    // پیدا کردن آخرین جمعه بعد از پایان ماه
    const endCalendar = endOfMonth.clone()
    while (endCalendar.day() !== 5) { // 5 = جمعه در moment
      endCalendar.add(1, 'day')
    }

    const days: CalendarDay[] = []
    const current = startCalendar.clone()
    const today = moment()

    while (current.isSameOrBefore(endCalendar)) {
      days.push({
        date: current.clone(),
        isCurrentMonth: current.jMonth() === currentDate.jMonth(),
        isToday: current.isSame(today, 'day'),
        isSelected: selectedDate ? current.isSame(selectedDate, 'day') : false
      })
      current.add(1, 'day')
    }

    setCalendarDays(days)
  }

  const goToPreviousMonth = () => {
    setCurrentDate(prev => prev.clone().subtract(1, 'jMonth'))
  }

  const goToNextMonth = () => {
    setCurrentDate(prev => prev.clone().add(1, 'jMonth'))
  }

  const goToToday = () => {
    setCurrentDate(moment())
    setSelectedDate(moment())
  }

  const handleDayClick = (day: CalendarDay) => {
    setSelectedDate(day.date)
  }

  return (
    <div className="persian-calendar">
      {/* هدر تقویم */}
      <div className="calendar-header">
        <button onClick={goToPreviousMonth} className="nav-button">
          ←
        </button>
        
        <div className="month-year">
          <h2>{persianMonths[currentDate.jMonth()]} {currentDate.jYear()}</h2>
          <p className="gregorian-date">
            {currentDate.format('MMMM YYYY')}
          </p>
        </div>
        
        <button onClick={goToNextMonth} className="nav-button">
          →
        </button>
      </div>

      {/* دکمه برو به امروز */}
      <div className="today-button-container">
        <button onClick={goToToday} className="today-button">
          برو به امروز
        </button>
      </div>

      {/* روزهای هفته */}
      <div className="weekdays">
        {weekDays.map((day, index) => (
          <div key={index} className="weekday">
            {day}
          </div>
        ))}
      </div>

      {/* روزهای ماه */}
      <div className="calendar-grid">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`calendar-day ${
              !day.isCurrentMonth ? 'other-month' : ''
            } ${day.isToday ? 'today' : ''} ${
              day.isSelected ? 'selected' : ''
            }`}
            onClick={() => handleDayClick(day)}
          >
            <span className="persian-date">
              {day.date.format('jD')}
            </span>
            <span className="gregorian-date">
              {day.date.format('D')}
            </span>
          </div>
        ))}
      </div>

      {/* اطلاعات روز انتخاب شده */}
      {selectedDate && (
        <div className="selected-date-info">
          <h3>تاریخ انتخاب شده:</h3>
          <p className="persian">
            {selectedDate.format('dddd، jD jMMMM jYYYY')}
          </p>
          <p className="gregorian">
            {selectedDate.format('dddd, MMMM D, YYYY')}
          </p>
        </div>
      )}

      <style jsx>{`
        .persian-calendar {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Tahoma', sans-serif;
          direction: rtl;
        }

        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding: 0 10px;
        }

        .nav-button {
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 8px;
          width: 40px;
          height: 40px;
          cursor: pointer;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s;
        }

        .nav-button:hover {
          background: #1d4ed8;
        }

        .month-year {
          text-align: center;
        }

        .month-year h2 {
          font-size: 24px;
          margin: 0;
          color: #1f2937;
        }

        .month-year .gregorian-date {
          font-size: 14px;
          color: #6b7280;
          margin: 5px 0 0 0;
        }

        .today-button-container {
          text-align: center;
          margin-bottom: 20px;
        }

        .today-button {
          background: #059669;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 8px 16px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s;
        }

        .today-button:hover {
          background: #047857;
        }

        .weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 1px;
          margin-bottom: 10px;
        }

        .weekday {
          background: #f3f4f6;
          padding: 12px;
          text-align: center;
          font-weight: bold;
          color: #374151;
          border-radius: 4px;
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 1px;
          background: #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
        }

        .calendar-day {
          background: white;
          min-height: 80px;
          padding: 8px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .calendar-day:hover {
          background: #f3f4f6;
        }

        .calendar-day.other-month {
          background: #f9fafb;
          color: #9ca3af;
        }

        .calendar-day.today {
          background: #dbeafe;
          border: 2px solid #2563eb;
        }

        .calendar-day.selected {
          background: #2563eb;
          color: white;
        }

        .persian-date {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 4px;
        }

        .gregorian-date {
          font-size: 12px;
          opacity: 0.7;
        }

        .selected-date-info {
          margin-top: 30px;
          padding: 20px;
          background: #f8fafc;
          border-radius: 8px;
          text-align: center;
        }

        .selected-date-info h3 {
          margin: 0 0 10px 0;
          color: #1f2937;
        }

        .selected-date-info .persian {
          font-size: 18px;
          font-weight: bold;
          color: #2563eb;
          margin: 5px 0;
        }

        .selected-date-info .gregorian {
          font-size: 14px;
          color: #6b7280;
          margin: 5px 0;
        }

        @media (max-width: 768px) {
          .persian-calendar {
            padding: 10px;
          }
          
          .calendar-day {
            min-height: 60px;
            padding: 4px;
          }
          
          .persian-date {
            font-size: 16px;
          }
          
          .month-year h2 {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  )
}
