'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CalendarMonth, CalendarDay, CalendarEvent, PersianDate, CalendarWeek } from '../../lib/calendar/persian-utils';
import { CalendarGenerator } from '../../lib/calendar/calendar-generator';
import { getCurrentPersianDate, gregorianToPersian } from '../../lib/calendar/persian-utils';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import CalendarSidebar from './CalendarSidebar';

interface MainCalendarProps {
  events?: CalendarEvent[];
  onEventClick?: (eventId: string) => void;
  onCreateEvent?: () => void;
  onDayClick?: (day: CalendarDay) => void;
}

const MainCalendar: React.FC<MainCalendarProps> = ({
  events = [],
  onEventClick = () => {},
  onCreateEvent = () => {},
  onDayClick = () => {}
}) => {
  const today = getCurrentPersianDate();
  const [currentYear, setCurrentYear] = useState(today.year);
  const [currentMonth, setCurrentMonth] = useState(today.month);
  const [selectedDate, setSelectedDate] = useState<PersianDate | undefined>();
  const [calendarData, setCalendarData] = useState<CalendarMonth | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Generate calendar data
  useEffect(() => {
    console.log('🔄 Generating calendar for:', currentYear, currentMonth);
    console.log('📅 Today:', today);
    console.log('🎯 Events:', events);
    
    try {
      const data = CalendarGenerator.generateMonth(currentYear, currentMonth, events);
      console.log('✅ Generated calendar data:', data);
      setCalendarData(data);
      setError(null);
    } catch (error) {
      console.error('❌ Error generating calendar:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    }
  }, [currentYear, currentMonth, events, today]);

  const handlePrevMonth = useCallback(() => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  }, [currentMonth]);

  const handleNextMonth = useCallback(() => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  }, [currentMonth]);

  const handleToday = useCallback(() => {
    const today = getCurrentPersianDate();
    setCurrentYear(today.year);
    setCurrentMonth(today.month);
    setSelectedDate(today);
  }, []);

  const handleDayClick = useCallback((day: CalendarDay) => {
    setSelectedDate(day.persianDate);
    onDayClick(day);
  }, [onDayClick]);

  // Get today's events
  const todayEvents = events.filter(event => {
    const eventPersianDate = gregorianToPersian(event.startTime);
    return eventPersianDate.year === today.year &&
           eventPersianDate.month === today.month &&
           eventPersianDate.day === today.day;
  });

  // Get upcoming events (next 7 days)
  const upcomingEvents = events.filter(event => {
    const now = new Date();
    const weekFromNow = new Date();
    weekFromNow.setDate(now.getDate() + 7);
    
    return event.startTime > now && event.startTime <= weekFromNow;
  }).slice(0, 10);

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">❌ خطا در بارگذاری تقویم</div>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  if (!calendarData) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری تقویم...</p>
          <p className="text-sm text-gray-500 mt-2">
            سال: {currentYear} - ماه: {currentMonth}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <CalendarHeader
        year={currentYear}
        month={currentMonth}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
        onCreateEvent={onCreateEvent}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <CalendarGrid
          month={calendarData}
          onDayClick={handleDayClick}
          onEventClick={onEventClick}
        />
        
        <CalendarSidebar
          selectedDate={selectedDate}
          todayEvents={todayEvents}
          upcomingEvents={upcomingEvents}
          onEventClick={onEventClick}
          onCreateEvent={onCreateEvent}
        />
      </div>
    </div>
  );
};

export default MainCalendar;
