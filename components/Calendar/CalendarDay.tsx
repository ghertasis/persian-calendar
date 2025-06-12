import React from 'react';
import { CalendarDay as CalendarDayType } from '../../lib/calendar/persian-utils';
import { PERSIAN_WEEKDAYS_SHORT } from '../../lib/calendar/persian-utils';

interface CalendarDayProps {
  day: CalendarDayType;
  onDayClick?: (day: CalendarDayType) => void;
  onEventClick?: (event: any) => void;
}

export const CalendarDay: React.FC<CalendarDayProps> = ({
  day,
  onDayClick,
  onEventClick
}) => {
  const { persianDate, isCurrentMonth, isToday, events, isWeekend } = day;

  return (
    <div
      className={`
        min-h-[100px] p-2 border border-gray-200 cursor-pointer
        ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
        ${isToday ? 'bg-blue-50 border-blue-300' : ''}
        ${isWeekend ? 'bg-red-50' : ''}
        hover:bg-gray-100 transition-colors
      `}
      onClick={() => onDayClick?.(day)}
    >
      <div className={`
        text-sm font-medium
        ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
        ${isToday ? 'text-blue-600 font-bold' : ''}
        ${isWeekend ? 'text-red-600' : ''}
      `}>
        {persianDate.day}
      </div>
      
      {events && events.length > 0 && (
        <div className="mt-1 space-y-1">
          {events.slice(0, 3).map((event, index) => (
            <div
              key={index}
              className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded truncate"
              onClick={(e) => {
                e.stopPropagation();
                onEventClick?.(event);
              }}
            >
              {event.title}
            </div>
          ))}
          {events.length > 3 && (
            <div className="text-xs text-gray-500">
              +{events.length - 3} مورد دیگر
            </div>
          )}
        </div>
      )}
    </div>
  );
};
