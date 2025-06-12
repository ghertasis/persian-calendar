'use client';

import React from 'react';

const PERSIAN_MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

interface CalendarHeaderProps {
  year: number;
  month: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onCreateEvent?: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  year,
  month,
  onPrevMonth,
  onNextMonth,
  onToday,
  onCreateEvent
}) => {
  const monthName = PERSIAN_MONTHS[month - 1];

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">📅</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">تقویم</h1>
        </div>
        
        <button
          onClick={onToday}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          امروز
        </button>
        
        <div className="flex items-center">
          <button
            onClick={onPrevMonth}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md text-xl"
          >
            ‹
          </button>
          <button
            onClick={onNextMonth}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md text-xl"
          >
            ›
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-900">
          {monthName} {year}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
          ⚙️
        </button>
        
        {onCreateEvent && (
          <button
            onClick={onCreateEvent}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <span className="text-lg">+</span>
            ایجاد
          </button>
        )}
      </div>
    </div>
  );
};

export default CalendarHeader;
