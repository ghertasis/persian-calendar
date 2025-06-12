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
  monthName: string;  // اضافه شد
  weeks: CalendarWeek[];
  totalDays: number;
  events: CalendarEvent[]; // اضافه شد
}

// ثوابت فارسی
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

// تابع دریافت تاریخ فارسی فعلی
export function getCurrentPersianDate(): PersianDate {
  try {
    const now = moment();
    return {
      year: now.jYear(),
      month: now.jMonth() + 1,
      day: now.jDate(),
      weekDay: now.day()
    };
  } catch (error) {
    console.error('Error getting current Persian date:', error);
    // Fallback to a default date
    return {
      year: 1403,
      month: 1,
      day: 1,
      weekDay: 0
    };
  }
}

// چک کردن سال کبیسه
export function isPersianLeapYear(year: number): boolean {
  try {
    return moment.jIsLeapYear(year);
  } catch (error) {
    console.error('Error checking leap year:', error);
    return false;
  }
}

// تعداد روزهای ماه فارسی
export function getPersianDaysInMonth(year: number, month: number): number {
  try {
    return moment().jYear(year).jMonth(month - 1).jDaysInMonth();
  } catch (error) {
    console.error('Error getting Persian days in month:', error);
    // Fallback values
    if (month <= 6) return 31;
    if (month <= 11) return 30;
    return isPersianLeapYear(year) ? 30 : 29;
  }
}

// تبدیل تاریخ فارسی به میلادی
export function persianToGregorian(year: number, month: number, day: number): Date {
  try {
    return moment().jYear(year).jMonth(month - 1).jDate(day).toDate();
  } catch (error) {
    console.error('Error converting Persian to Gregorian:', error);
    return new Date(); // Fallback to current date
  }
}

// تبدیل تاریخ میلادی به فارسی
export function gregorianToPersian(date: Date): PersianDate {
  try {
    const m = moment(date);
    return {
      year: m.jYear(),
      month: m.jMonth() + 1,
      day: m.jDate(),
      weekDay: m.day()
    };
  } catch (error) {
    console.error('Error converting Gregorian to Persian:', error);
    return getCurrentPersianDate(); // Fallback to current date
  }
}

// دریافت اولین روز ماه (روز هفته)
export function getFirstDayOfPersianMonth(year: number, month: number): number {
  try {
    const firstDay = moment().jYear(year).jMonth(month - 1).jDate(1);
    return firstDay.day();
  } catch (error) {
    console.error('Error getting first day of Persian month:', error);
    return 0; // Fallback to Sunday
  }
}

// فرمت کردن تاریخ فارسی
export function formatPersianDate(date: PersianDate, includeWeekday = false): string {
  try {
    const monthName = PERSIAN_MONTHS[date.month - 1] || 'نامشخص';
    const weekdayName = includeWeekday ? (PERSIAN_WEEKDAYS[date.weekDay] || 'نامشخص') + ' ' : '';
    return `${weekdayName}${date.day} ${monthName} ${date.year}`;
  } catch (error) {
    console.error('Error formatting Persian date:', error);
    return 'تاریخ نامشخص';
  }
}

// تابع کمکی برای validation تاریخ فارسی
export function isValidPersianDate(year: number, month: number, day: number): boolean {
  try {
    if (year < 1 || month < 1 || month > 12 || day < 1) {
      return false;
    }
    
    const daysInMonth = getPersianDaysInMonth(year, month);
    return day <= daysInMonth;
  } catch (error) {
    console.error('Error validating Persian date:', error);
    return false;
  }
}

// تابع کمکی برای محاسبه فاصله بین دو تاریخ فارسی
export function getPersianDateDifference(date1: PersianDate, date2: PersianDate): number {
  try {
    const gregorian1 = persianToGregorian(date1.year, date1.month, date1.day);
    const gregorian2 = persianToGregorian(date2.year, date2.month, date2.day);
    
    const timeDiff = gregorian2.getTime() - gregorian1.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  } catch (error) {
    console.error('Error calculating Persian date difference:', error);
    return 0;
  }
}

// تابع کمکی برای چک کردن اینکه آیا دو تاریخ فارسی یکسان هستند
export function isSamePersianDate(date1: PersianDate, date2: PersianDate): boolean {
  return date1.year === date2.year && 
         date1.month === date2.month && 
         date1.day === date2.day;
}

// تابع کمکی برای دریافت نام ماه فارسی
export function getPersianMonthName(month: number): string {
  if (month >= 1 && month <= 12) {
    return PERSIAN_MONTHS[month - 1];
  }
  return 'نامشخص';
}

// تابع کمکی برای دریافت نام روز هفته فارسی
export function getPersianWeekDayName(weekDay: number): string {
  if (weekDay >= 0 && weekDay <= 6) {
    return PERSIAN_WEEKDAYS[weekDay];
  }
  return 'نامشخص';
}

// تابع کمکی برای چک کردن تعطیلی (پنج‌شنبه و جمعه)
export function isPersianWeekend(weekDay: number): boolean {
  return weekDay === 4 || weekDay === 5; // Thursday (4) and Friday (5)
}

// تابع کمکی برای اضافه کردن روز به تاریخ فارسی
export function addDaysToPersianDate(date: PersianDate, days: number): PersianDate {
  try {
    const gregorianDate = persianToGregorian(date.year, date.month, date.day);
    gregorianDate.setDate(gregorianDate.getDate() + days);
    return gregorianToPersian(gregorianDate);
  } catch (error) {
    console.error('Error adding days to Persian date:', error);
    return date; // Return original date as fallback
  }
}

// Debug helper function
export function debugPersianDate(date: PersianDate, label?: string): void {
  const prefix = label ? `[${label}] ` : '';
  console.log(`${prefix}Persian Date:`, {
    formatted: formatPersianDate(date, true),
    raw: date,
    gregorian: persianToGregorian(date.year, date.month, date.day),
    isWeekend: isPersianWeekend(date.weekDay),
    monthName: getPersianMonthName(date.month),
    weekDayName: getPersianWeekDayName(date.weekDay)
  });
}
