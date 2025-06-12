export interface PersianDate {
  year: number;
  month: number;
  day: number;
  weekDay: number; // 0 = شنبه، 1 = یکشنبه، ...، 6 = جمعه
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: PersianDate;
  endDate?: PersianDate;
  startTime?: string; // "14:30"
  endTime?: string;
  color: string; // "#4285f4", "#db4437", etc.
  isAllDay: boolean;
  location?: string;
  source: 'google' | 'local';
}

export interface CalendarDay {
  date: PersianDate;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
  gregorianDate: Date;
}

export interface CalendarWeek {
  days: CalendarDay[];
}

export interface CalendarMonth {
  year: number;
  month: number;
  weeks: CalendarWeek[];
  monthName: string;
}
