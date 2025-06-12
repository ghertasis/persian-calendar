'use client';

import React from 'react';
import { CalendarMonth, CalendarDay as CalendarDayType } from '../../types/calendar';
import { PERSIAN_WEEKDAYS } from '../../lib/calendar/persian-utils';
import CalendarDay from './CalendarDay';

interface CalendarGridProps {
  calendarData: CalendarMonth;
  onDayClick: (day: CalendarDayType) => void;
  onEventClick?: (eventId: string) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  calendarData,
  onDayClick,
  onEventClick
}) => {
  return (
    <div className="flex-1 bg-white">
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {PERSIAN_WEEKDAYS.map((weekday, index) => (
          <div
            key={weekday}
            className={`
              p-4 text-center text-sm font-semibold text-gray-700 border-l border-gray-200
              ${index === 6 ? 'text-red-600' : ''} // جمعه قرمز
            `}
          >
            {weekday}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {calendarData.weeks.map((week, weekIndex) =>
          week.days.map((day, dayIndex) => (
            <CalendarDay
              key={`${day.date.year}-${day.date.month}-${day.date.day}`}
              day={day}
              onClick={onDayClick}
              onEventClick={onEventClick}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CalendarGrid;
