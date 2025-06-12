'use client';

import React from 'react';
import { CalendarEvent } from '../../lib/calendar/persian-utils';

interface EventBlockProps {
  event: CalendarEvent;
  onClick: (eventId: string) => void;
  showDate?: boolean;
}

const EventBlock: React.FC<EventBlockProps> = ({ 
  event, 
  onClick, 
  showDate = false 
}) => {
  const handleClick = () => {
    onClick(event.id);
  };

  // Date object رو به string تبدیل می‌کنیم
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('fa-IR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('fa-IR');
  };

  return (
    <div 
      className="p-2 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
      onClick={handleClick}
    >
      <div className="flex items-start gap-2">
        <div 
          className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
          style={{ backgroundColor: event.color || '#4285f4' }}
        />
        
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate">
            {event.title}
          </div>
          
          {!event.isAllDay && (
            <div className="text-xs text-gray-600 mb-1">
              {formatTime(event.startTime)}
              {event.endTime && ` - ${formatTime(event.endTime)}`}
            </div>
          )}
          
          {showDate && (
            <div className="text-xs text-gray-500">
              {formatDate(event.startTime)}
            </div>
          )}
          
          {event.location && (
            <div className="text-xs text-gray-500 truncate">
              📍 {event.location}
            </div>
          )}
          
          {event.description && (
            <div className="text-xs text-gray-600 mt-1 line-clamp-2">
              {event.description}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventBlock;
