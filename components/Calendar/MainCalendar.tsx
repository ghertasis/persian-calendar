'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CalendarMonth, CalendarDay, CalendarEvent, PersianDate } from '../../types/calendar';
import { generateCalendarMonth } from '../../lib/calendar/calendar-generator';
import { getCurrentPersianDate } from '../../lib/calendar/persian-utils';
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

  // Generate calendar data
  useEffect(() => {
    const data = generateCalendarMonth(currentYear, currentMonth);
    
    // Add events to calendar days
    data.weeks.forEach(week => {
      week.days.forEach(day => {
        day.events = events.filter(event => 
          event.startDate.year === day.date.year &&
          event.startDate.month === day.date.month &&
          event.startDate.day === day.date.day
        );
      });
    });
    
    setCalendarData(data);
  }, [currentYear, currentMonth, events]);

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
    setSelectedDate(day.date);
    onDayClick(day);
  }, [onDayClick]);

  // Get today's events
  const todayEvents = events.filter(event => 
    event.startDate.year === today.year &&
    event.startDate.month === today.month &&
    event.startDate.day === today.day
  );

  // Get upcoming events (next 7 days)
  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(
      event.startDate.year + '-' + 
      event.startDate.month.toString().padStart(2, '0') + '-' + 
      event.startDate.day.toString().padStart(2, '0')
    );
    const now = new Date();
    const weekFromNow = new Date();
    weekFromNow.setDate(now.getDate() + 7);
    
    return eventDate > now && eventDate <= weekFromNow;
  }).slice(0, 10); // محدود به 10 رویداد

  if (!calendarData) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری تقویم...</p>
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
          calendarData={calendarData}
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
