import moment from 'moment-jalaali';

moment.loadPersian({ dialect: 'persian-modern' });

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

export function getCurrentPersianDate() {
  const now = moment();
  return {
    year: now.jYear(),
    month: now.jMonth() + 1, // moment uses 0-based months
    day: now.jDate(),
    weekDay: now.day() === 6 ? 0 : now.day() + 1 // Convert Sunday=0 to Saturday=0
  };
}

export function isPersianLeapYear(year: number): boolean {
  return moment.jIsLeapYear(year);
}

export function getPersianDaysInMonth(year: number, month: number): number {
  return moment.jDaysInMonth(year, month - 1); // moment uses 0-based months
}

export function persianToGregorian(year: number, month: number, day: number): Date {
  return moment(`${year}/${month}/${day}`, 'jYYYY/jM/jD').toDate();
}

export function gregorianToPersian(date: Date) {
  const m = moment(date);
  return {
    year: m.jYear(),
    month: m.jMonth() + 1,
    day: m.jDate(),
    weekDay: m.day() === 6 ? 0 : m.day() + 1
  };
}

export function getFirstDayOfPersianMonth(year: number, month: number): number {
  const firstDay = moment(`${year}/${month}/1`, 'jYYYY/jM/jD');
  return firstDay.day() === 6 ? 0 : firstDay.day() + 1; // Convert to Saturday=0
}

export function formatPersianDate(date: PersianDate, includeWeekday = false): string {
  const monthName = PERSIAN_MONTHS[date.month - 1];
  const weekdayName = includeWeekday ? PERSIAN_WEEKDAYS[date.weekDay] + ' ' : '';
  return `${weekdayName}${date.day} ${monthName} ${date.year}`;
}
