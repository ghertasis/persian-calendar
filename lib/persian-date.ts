import moment from 'moment-jalaali'

// Load Persian calendar
moment.loadPersian({ dialect: 'persian-modern' })

export interface PersianDate {
  year: number
  month: number
  day: number
  weekDay: number
  weekDayName: string
  monthName: string
  formatted: string
}

export function getCurrentPersianDate(): PersianDate {
  const now = moment()
  
  return {
    year: now.jYear(),
    month: now.jMonth() + 1, // jMonth() returns 0-11, we want 1-12
    day: now.jDate(),
    weekDay: now.day(),
    weekDayName: getPersianWeekDayName(now.day()),
    monthName: getPersianMonthName(now.jMonth() + 1),
    formatted: now.jFormat('jYYYY/jMM/jDD')
  }
}

export function createPersianDate(year: number, month: number, day: number): PersianDate {
  const date = moment([year, month - 1, day], 'jYYYY/jMM/jDD')
  
  return {
    year: date.jYear(),
    month: date.jMonth() + 1,
    day: date.jDate(),
    weekDay: date.day(),
    weekDayName: getPersianWeekDayName(date.day()),
    monthName: getPersianMonthName(date.jMonth() + 1),
    formatted: date.jFormat('jYYYY/jMM/jDD')
  }
}

export function formatPersianDate(date: Date | string): string {
  const momentDate = moment(date)
  return momentDate.jFormat('jYYYY/jMM/jDD')
}

export function getPersianMonthName(month: number): string {
  const months = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر',
    'مرداد', 'شهریور', 'مهر', 'آبان',
    'آذر', 'دی', 'بهمن', 'اسفند'
  ]
  return months[month - 1] || ''
}

export function getPersianWeekDayName(weekDay: number): string {
  const weekDays = [
    'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه',
    'پنج‌شنبه', 'جمعه', 'شنبه'
  ]
  return weekDays[weekDay] || ''
}

export function isLeapYear(year: number): boolean {
  return moment.jIsLeapYear(year)
}

export function getDaysInMonth(year: number, month: number): number {
  return moment.jDaysInMonth(year, month - 1)
}

export function convertGregorianToPersian(gregorianDate: Date): PersianDate {
  const momentDate = moment(gregorianDate)
  return {
    year: momentDate.jYear(),
    month: momentDate.jMonth() + 1,
    day: momentDate.jDate(),
    weekDay: momentDate.day(),
    weekDayName: getPersianWeekDayName(momentDate.day()),
    monthName: getPersianMonthName(momentDate.jMonth() + 1),
    formatted: momentDate.jFormat('jYYYY/jMM/jDD')
  }
}

export function convertPersianToGregorian(year: number, month: number, day: number): Date {
  const momentDate = moment([year, month - 1, day], 'jYYYY/jMM/jDD')
  return momentDate.toDate()
}
