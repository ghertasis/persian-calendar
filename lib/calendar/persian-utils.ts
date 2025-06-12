import moment from 'moment-jalaali';

// همه type ها رو اینجا تعریف می‌کنیم
export interface PersianDate {
  year: number;
  month: number;
  day: number;
  weekDay: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  color?: string;
  location?: string;
  isAllDay?: boolean;
  source?: 'google' | 'local';
}

export interface CalendarDay {
  persianDate: PersianDate;
  gregorianDate: Date;
  events: CalendarEvent[];
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend?: boolean;
}

export interface CalendarWeek {
  days: CalendarDay[];
}

export interface CalendarMonth {
  year: number;
  month: number;
  weeks: CalendarWeek[];
  totalDays: number;
}

export const PERSIAN_MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

export const PERSIAN_WEEKDAYS = [
  'شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'
];

export const PERSIAN_WEEKDAYS_SHORT = [
  'ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'
];

export function getCurrentPersianDate(): PersianDate {
  const now = moment();
  return {
    year: now.jYear(),
    month: now.jMonth() + 1,
    day: now.jDate(),
    weekDay: now.day()
  };
}

export function isPersianLeapYear(year: number): boolean {
  return moment.jIsLeapYear(year);
}

export function getPersianDaysInMonth(year: number, month: number): number {
  return moment().jYear(year).jMonth(month - 1).jDaysInMonth();
}

export function persianToGregorian(year: number, month: number, day: number): Date {
  return moment().jYear(year).jMonth(month - 1).jDate(day).toDate();
}

export function gregorianToPersian(date: Date): PersianDate {
  const m = moment(date);
  return {
    year: m.jYear(),
    month: m.jMonth() + 1,
    day: m.jDate(),
    weekDay: m.day()
  };
}

export function getFirstDayOfPersianMonth(year: number, month: number): number {
  const firstDay = moment().jYear(year).jMonth(month - 1).jDate(1);
  return firstDay.day();
}

export function formatPersianDate(date: PersianDate, includeWeekday = false): string {
  const monthName = PERSIAN_MONTHS[date.month - 1];
  const weekdayName = includeWeekday ? PERSIAN_WEEKDAYS[date.weekDay] + ' ' : '';
  return `${weekdayName}${date.day} ${monthName} ${date.year}`;
}
