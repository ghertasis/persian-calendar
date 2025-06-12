'use client';

import React from 'react';
import { CalendarEvent } from '../../types/calendar';

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
  return (
    <div
      className="p-3 rounded-lg border-l-4 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
      style={{ borderLeftColor: event.color }}
      onClick={() => onClick(event.id)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 text-sm mb-1">
            {event.title}
          </h4>
          
          {!event.isAllDay && (
            <div className="text-xs text-gray-600 mb-1">
              {event.startTime}
              {event.endTime && ` - ${event.endTime}`}
            </div>
          )}
          
          {event.location && (
            <div className="text-xs text-gray-500 flex items-center gap-1">
              📍 {event.location}
            </div>
          )}
          
          {showDate && (
            <div className="text-xs text-gray-500 mt-1">
              {event.startDate.day} {/* Add month name if needed */}
            </div>
          )}
        </div>
        
        <div
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: event.color }}
        ></div>
      </div>
    </div>
  );
};

export default EventBlock;
