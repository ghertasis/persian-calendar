'use client';

import React from 'react';
import { CalendarDay as CalendarDayType } from '../../types/calendar';
import { PERSIAN_WEEKDAYS_SHORT } from '../../lib/calendar/persian-utils';

interface CalendarDayProps {
  day: CalendarDayType;
  onClick: (day: CalendarDayType) => void;
  onEventClick?: (eventId: string) => void;
}

const CalendarDay: React.FC<CalendarDayProps> = ({ 
  day, 
  onClick, 
  onEventClick 
}) => {
  const { date, isCurrentMonth, isToday, events } = day;

  return (
    <div
      className={`
        min-h-[120px] border-l border-b border-gray-200 bg-white cursor-pointer
        hover:bg-gray-50 transition-colors relative
        ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''}
        ${isToday ? 'bg-blue-50 border-blue-200' : ''}
      `}
      onClick={() => onClick(day)}
    >
      {/* Day Number */}
      <div className="p-2">
        <span
          className={`
            inline-flex items-center justify-center w-8 h-8 text-sm font-medium rounded-full
            ${isToday 
              ? 'bg-blue-600 text-white' 
              : isCurrentMonth 
                ? 'text-gray-900 hover:bg-gray-100' 
                : 'text-gray-400'
            }
          `}
        >
          {date.day}
        </span>
      </div>

      {/* Events */}
      <div className="px-2 pb-2 space-y-1">
        {events.slice(0, 3).map((event, index) => (
          <div
            key={event.id}
            className={`
              text-xs p-1 rounded text-white cursor-pointer
              hover:opacity-80 transition-opacity truncate
            `}
            style={{ backgroundColor: event.color }}
            onClick={(e) => {
              e.stopPropagation();
              onEventClick?.(event.id);
            }}
          >
            {event.isAllDay ? (
              <span>{event.title}</span>
            ) : (
              <span>
                {event.startTime} {event.title}
              </span>
            )}
          </div>
        ))}

        {/* More events indicator */}
        {events.length > 3 && (
          <div className="text-xs text-gray-500 px-1">
            +{events.length - 3} بیشتر
          </div>
        )}
      </div>

      {/* Today indicator dot */}
      {isToday && (
        <div className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full"></div>
      )}
    </div>
  );
};

export default CalendarDay;
