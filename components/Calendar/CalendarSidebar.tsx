'use client';

import React from 'react';
import { CalendarEvent, PersianDate } from '../../lib/calendar/persian-utils'; // ✅ مسیر تغییر کرد
import { formatPersianDate, getCurrentPersianDate } from '../../lib/calendar/persian-utils';
import EventBlock from './EventBlock';

interface CalendarSidebarProps {
  selectedDate?: PersianDate;
  todayEvents: CalendarEvent[];
  upcomingEvents: CalendarEvent[];
  onEventClick: (eventId: string) => void;
  onCreateEvent: () => void;
}

const CalendarSidebar: React.FC<CalendarSidebarProps> = ({
  selectedDate,
  todayEvents,
  upcomingEvents,
  onEventClick,
  onCreateEvent
}) => {
  const today = getCurrentPersianDate();
  const displayDate = selectedDate || today;

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Mini Calendar Placeholder */}
      <div className="p-4 border-b border-gray-200">
        <div className="bg-gray-100 rounded-lg p-4 text-center">
          <div className="text-sm text-gray-600 mb-2">
            {formatPersianDate(displayDate, true)}
          </div>
          <div className="text-xs text-gray-500">
            مینی کلندر (بعداً اضافه می‌شود)
          </div>
        </div>
      </div>

      {/* Create Event Button */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={onCreateEvent}
          className="w-full bg-blue-600 text-white rounded-lg py-3 px-4 font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <span className="text-lg">+</span>
          رویداد جدید
        </button>
      </div>

      {/* Today's Events */}
      {todayEvents.length > 0 && (
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            رویدادهای امروز ({todayEvents.length})
          </h3>
          <div className="space-y-2">
            {todayEvents.map(event => (
              <EventBlock
                key={event.id}
                event={event}
                onClick={onEventClick}
              />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Events */}
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
            رویدادهای آینده
          </h3>
          
          {upcomingEvents.length > 0 ? (
            <div className="space-y-2">
              {upcomingEvents.map(event => (
                <EventBlock
                  key={event.id}
                  event={event}
                  onClick={onEventClick}
                  showDate={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📅</div
              <p className="text-sm">رویداد آینده‌ای وجود ندارد</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 text-center">
        <div className="text-xs text-gray-500">
          تقویم شمسی هوشمند v1.0
        </div>
      </div>
    </div>
  );
};

export default CalendarSidebar;
