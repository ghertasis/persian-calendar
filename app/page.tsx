'use client';

import React from 'react';
import MainCalendar from '../components/Calendar/MainCalendar';
import { generateSampleEvents } from '../lib/calendar/sample-events';

export default function Home() {
  const sampleEvents = generateSampleEvents();

  const handleEventClick = (eventId: string) => {
    console.log('Event clicked:', eventId);
    // اینجا modal یا صفحه جزئیات رویداد باز می‌شه
  };

  const handleCreateEvent = () => {
    console.log('Create new event');
    // اینجا modal ایجاد رویداد باز می‌شه
  };

  const handleDayClick = (day: any) => {
    console.log('Day clicked:', day);
    // اینجا می‌تونی یک modal برای اون روز باز کنی
  };

  return (
    <div className="h-screen">
      <MainCalendar
        events={sampleEvents}
        onEventClick={handleEventClick}
        onCreateEvent={handleCreateEvent}
        onDayClick={handleDayClick}
      />
    </div>
  );
}
