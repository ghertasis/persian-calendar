'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  CalendarMonth, 
  CalendarDay, 
  CalendarEvent, 
  PersianDate, 
  CalendarWeek,
  PERSIAN_MONTHS 
} from '../../lib/calendar/persian-utils';
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
  const [isLoading, setIsLoading] = useState(false);

  // Generate calendar data
  useEffect(() => {
    console.log('🔄 Generating calendar for:', currentYear, currentMonth);
    console.log('📅 Today:', today);
    console.log('🎯 Events count:', events?.length || 0);
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = CalendarGenerator.generateMonth(currentYear, currentMonth, events);
      console.log('✅ Generated calendar data:', data);
      
      // Add the required properties to match CalendarMonth interface
      const completeCalendarData: CalendarMonth = {
        ...data,
        monthName: PERSIAN_MONTHS[currentMonth - 1],
        events: events || []
      };
      
      setCalendarData(completeCalendarData);
      setError(null);
    } catch (error) {
      console.error('❌ Error generating calendar:', error);
      const errorMessage = error instanceof Error ? error.message : 'خطای نامشخص در تولید تقویم';
      setError(errorMessage);
      setCalendarData(null);
    } finally {
      setIsLoading(false);
    }
  }, [currentYear, currentMonth, events]);

  const handlePrevMonth = useCallback(() => {
    console.log('📅 Going to previous month from:', currentMonth);
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  }, [currentMonth]);

  const handleNextMonth = useCallback(() => {
    console.log('📅 Going to next month from:', currentMonth);
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  }, [currentMonth]);

  const handleToday = useCallback(() => {
    console.log('🏠 Going to today:', today);
    setCurrentYear(today.year);
    setCurrentMonth(today.month);
    setSelectedDate(today);
  }, [today]);

  const handleDayClick = useCallback((day: CalendarDay) => {
    console.log('🖱️ Day clicked:', day.persianDate);
    setSelectedDate(day.persianDate);
    onDayClick(day);
  }, [onDayClick]);

  // Get today's events
  const todayEvents = events.filter(event => {
    try {
      const eventPersianDate = gregorianToPersian(event.startTime);
      return eventPersianDate.year === today.year &&
             eventPersianDate.month === today.month &&
             eventPersianDate.day === today.day;
    } catch (error) {
      console.error('Error filtering today events:', error);
      return false;
    }
  });

  // Get upcoming events (next 7 days)
  const upcomingEvents = events.filter(event => {
    try {
      const now = new Date();
      const weekFromNow = new Date();
      weekFromNow.setDate(now.getDate() + 7);
      
      return event.startTime > now && event.startTime <= weekFromNow;
    } catch (error) {
      console.error('Error filtering upcoming events:', error);
      return false;
    }
  }).slice(0, 10);

  // Error state
  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-red-600 mb-4">خطا در بارگذاری تقویم</h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-700 text-sm font-mono">{error}</p>
          </div>
          <div className="space-y-2 text-sm text-gray-600 mb-6">
            <p>سال: {currentYear}</p>
            <p>ماه: {currentMonth} ({PERSIAN_MONTHS[currentMonth - 1]})</p>
            <p>تعداد رویدادها: {events?.length || 0}</p>
          </div>
          <button 
            onClick={() => {
              setError(null);
              setIsLoading(true);
              setTimeout(() => window.location.reload(), 100);
            }}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading || !calendarData) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="relative mb-4">
            <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">📅</span>
            </div>
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">در حال بارگذاری تقویم...</h2>
          <div className="space-y-1 text-sm text-gray-600">
            <p>سال: {currentYear}</p>
            <p>ماه: {currentMonth} ({PERSIAN_MONTHS[currentMonth - 1]})</p>
            <p>تعداد رویدادها: {events?.length || 0}</p>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  console.log('🎨 Rendering calendar with data:', {
    year: calendarData.year,
    month: calendarData.month,
    monthName: calendarData.monthName,
    weeksCount: calendarData.weeks?.length,
    eventsCount: calendarData.events?.length,
    todayEventsCount: todayEvents.length,
    upcomingEventsCount: upcomingEvents.length
  });

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
