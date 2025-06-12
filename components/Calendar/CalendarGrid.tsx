import React from 'react';
import { CalendarMonth, CalendarDay as CalendarDayType } from '../../lib/calendar/persian-utils';
import { PERSIAN_WEEKDAYS } from '../../lib/calendar/persian-utils';
import { CalendarDay } from './CalendarDay'; // named import به جای default

interface CalendarGridProps {
  month: CalendarMonth;
  onDayClick?: (day: CalendarDayType) => void;
  onEventClick?: (event: any) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  month,
  onDayClick,
  onEventClick
}) => {
  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header با نام روزهای هفته */}
      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-t-lg overflow-hidden">
        {PERSIAN_WEEKDAYS.map((day) => (
          <div
            key={day}
            className="bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 text-center"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grid روزها */}
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {month.days.map((day, index) => (
          <CalendarDay
            key={`${day.persianDate.year}-${day.persianDate.month}-${day.persianDate.day}-${index}`}
            day={day}
            onDayClick={onDayClick}
            onEventClick={onEventClick}
          />
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;
