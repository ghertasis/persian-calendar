'use client';

import React, { useState, useEffect } from 'react';
import moment from 'moment-jalaali';

moment.loadPersian();

interface GoogleEvent {
  id: string;
  summary: string;
  start: {
    date?: string;
    dateTime?: string;
  };
  end: {
    date?: string; 
    dateTime?: string;
  };
  description?: string;
  location?: string;
}

// Hook for fetching Google Calendar events
const useGoogleEvents = (month?: number, year?: number) => {
  const [events, setEvents] = useState<GoogleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // محاسبه بازه زمانی برای ماه مورد نظر
      const timeMin = year && month !== undefined 
        ? new Date(year, month, 1).toISOString()
        : new Date().toISOString();
        
      const timeMax = year && month !== undefined
        ? new Date(year, month + 1, 0).toISOString()
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

      const response = await fetch(`/api/calendars?timeMin=${timeMin}&timeMax=${timeMax}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      
      const data = await response.json();
      setEvents(data.events || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در دریافت رویدادها');
      console.error('Error fetching Google events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [month, year]);

  return {
    events,
    loading,
    error,
    refetch: fetchEvents
  };
};

// گروه‌بندی رویدادها بر اساس تاریخ
const groupEventsByDate = (events: GoogleEvent[]) => {
  const grouped: { [date: string]: GoogleEvent[] } = {};
  
  events.forEach(event => {
    const eventDate = event.start.date || event.start.dateTime?.split('T')[0];
    if (eventDate) {
      if (!grouped[eventDate]) {
        grouped[eventDate] = [];
      }
      grouped[eventDate].push(event);
    }
  });
  
  return grouped;
};

const PersianCalendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState<number>(moment().jMonth());
  const [currentYear, setCurrentYear] = useState<number>(moment().jYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);

  // دریافت رویدادها از Google
  const { events, loading, error } = useGoogleEvents(currentMonth, currentYear);
  const groupedEvents = groupEventsByDate(events);

  const persianMonthNames = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ];

  const persianWeekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

  const getDaysInMonth = (year: number, month: number): number => {
    return moment().jYear(year).jMonth(month + 1).jDate(0).jDate();
  };

  const getFirstDayOfMonth = (year: number, month: number): number => {
    const firstDay = moment().jYear(year).jMonth(month).jDate(1);
    return firstDay.day();
  };

  const isToday = (day: number | null): boolean => {
    if (day === null) return false;
    const today = moment();
    return (
      day === today.jDate() &&
      currentMonth === today.jMonth() &&
      currentYear === today.jYear()
    );
  };

  // تبدیل تاریخ شمسی به میلادی برای چک کردن رویدادها
  const getGregorianDate = (day: number): string => {
    const persianDate = moment().jYear(currentYear).jMonth(currentMonth).jDate(day);
    return persianDate.format('YYYY-MM-DD');
  };

  // گرفتن رویدادهای یک روز خاص
  const getDayEvents = (day: number): GoogleEvent[] => {
    const gregorianDate = getGregorianDate(day);
    return groupedEvents[gregorianDate] || [];
  };

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const goToToday = () => {
    const today = moment();
    setCurrentMonth(today.jMonth());
    setCurrentYear(today.jYear());
  };

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    const dayEvents = getDayEvents(day);
    if (dayEvents.length > 0) {
      setShowEventModal(true);
    }
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const startDay = (firstDay + 1) % 7;

    const days: (number | null)[] = [];
    
    // روزهای خالی ابتدای ماه
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    
    // روزهای ماه
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days.map((day, index) => {
      const dayEvents = day ? getDayEvents(day) : [];
      const hasEvents = dayEvents.length > 0;
      
      return (
        <div
          key={index}
          className={`
            h-20 border border-gray-200 flex flex-col items-center justify-center
            relative cursor-pointer transition-colors duration-200
            ${day === null ? 'text-gray-300' : 'text-gray-800 hover:bg-blue-50'}
            ${isToday(day) ? 'bg-blue-500 text-white font-bold' : ''}
            ${selectedDay === day ? 'ring-2 ring-blue-400' : ''}
          `}
          onClick={() => day && handleDayClick(day)}
        >
          {day && (
            <>
              <span className="text-lg">{day}</span>
              {hasEvents && (
                <div className="flex gap-1 mt-1">
                  {dayEvents.slice(0, 3).map((_, eventIndex) => (
                    <div
                      key={eventIndex}
                      className="w-2 h-2 bg-green-500 rounded-full"
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <span className="text-xs text-gray-600">+{dayEvents.length - 3}</span>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      );
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg" dir="rtl">
      {/* هدر */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPreviousMonth}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          ماه قبل
        </button>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {persianMonthNames[currentMonth]} {currentYear}
          </h2>
          <button
            onClick={goToToday}
            className="mt-2 px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            برو به امروز
          </button>
        </div>
        
        <button
          onClick={goToNextMonth}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          ماه بعد
        </button>
      </div>

      {/* نمایش وضعیت رویدادها */}
      {loading && (
        <div className="text-center text-blue-600 mb-4">
          🔄 د حال بارگذاری رویدادها...
        </div>
      )}
      
      {error && (
        <div className="text-center text-red-600 mb-4 bg-red-50 p-3 rounded">
          ❌ خطا: {error}
        </div>
      )}

      {!loading && events.length > 0 && (
        <div className="text-center text-green-600 mb-4">
          ✅ {events.length} رویداد یافت شد
        </div>
      )}

      {/* روزهای هفته */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {persianWeekDays.map((day, index) => (
          <div
            key={index}
            className="h-12 flex items-center justify-center font-bold text-gray-600 bg-gray-100"
          >
            {day}
          </div>
        ))}
      </div>

      {/* روزهای تقویم */}
      <div className="grid grid-cols-7 gap-1">
        {renderCalendarDays()}
      </div>

      {/* مودال رویدادها */}
      {showEventModal && selectedDay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                رویدادهای {selectedDay} {persianMonthNames[currentMonth]}
              </h3>
              <button
                onClick={() => setShowEventModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-3">
              {getDayEvents(selectedDay).map((event) => (
                <div key={event.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-800">{event.summary}</h4>
                  {event.start.dateTime && (
                    <p className="text-sm text-gray-600">
                      � {new Date(event.start.dateTime).toLocaleTimeString('fa-IR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  )}
                  {event.location && (
                    <p className="text-sm text-gray-600">📍 {eventlocation}</p>
                  )}
                  {event.description && (
                    <p className="text-sm text-gray-700 mt-1">{event.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersianCalendar;
