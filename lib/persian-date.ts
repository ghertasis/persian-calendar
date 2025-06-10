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
}

export const PERSIAN_MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
]

export const PERSIAN_WEEKDAYS = [
  'شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'
]

export const PERSIAN_WEEKDAYS_SHORT = [
  'ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'
]

// Convert Gregorian date to Persian
export function gregorianToPersian(date: Date): PersianDate {
  const m = moment(date)
  const year = m.jYear()
  const month = m.jMonth() + 1 // moment uses 0-based months
  const day = m.jDate()
  const weekDay = m.day() === 6 ? 0 : m.day() + 1 // Convert to Persian week (Saturday = 0)
  
  return {
    year,
    month,
    day,
    weekDay,
    weekDayName: PERSIAN_WEEKDAYS[weekDay],
    monthName: PERSIAN_MONTHS[month - 1]
  }
}

// Convert Persian date to Gregorian
export function persianToGregorian(year: number, month: number, day: number): Date {
  return moment.from(`${year}/${month}/${day}`, 'fa', 'YYYY/M/D').toDate()
}

// Get today's Persian date
export function getTodayPersian(): PersianDate {
  return gregorianToPersian(new Date())
}

// Get all days for a Persian month
export function getPersianMonthDays(year: number, month: number): PersianDate[] {
  const days: PersianDate[] = []
  const daysInMonth = moment.jDaysInMonth(year, month - 1)
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = persianToGregorian(year, month, day)
    days.push(gregorianToPersian(date))
  }
  
  return days
}

// Get calendar month data (including previous/next month filler days)
export function getPersianCalendarMonth(year: number, month: number) {
  const monthDays = getPersianMonthDays(year, month)
  const firstDay = monthDays[0]
  const lastDay = monthDays[monthDays.length - 1]
  
  const calendar: (PersianDate | null)[] = []
  
  // Add empty cells for days before the first day of month
  for (let i = 0; i < firstDay.weekDay; i++) {
    calendar.push(null)
  }
  
  // Add all days of the month
  calendar.push(...monthDays)
  
  // Add empty cells to complete the last week
  while (calendar.length % 7 !== 0) {
    calendar.push(null)
  }
  
  return {
    days: calendar,
    monthName: PERSIAN_MONTHS[month - 1],
    year,
    month
  }
}

// Format Persian date string
export function formatPersianDate(date: PersianDate, format: 'short' | 'long' | 'full' = 'long'): string {
  const { year, month, day, weekDayName, monthName } = date
  
  switch (format) {
    case 'short':
      return `${year}/${month}/${day}`
    case 'long':
      return `${day} ${monthName} ${year}`
    case 'full':
      return `${weekDayName}، ${day} ${monthName} ${year}`
    default:
      return `${day} ${monthName} ${year}`
  }
}

// Check if two Persian dates are the same
export function isSamePersianDate(date1: PersianDate, date2: PersianDate): boolean {
  return date1.year === date2.year && 
         date1.month === date2.month && 
         date1.day === date2.day
}

// Parse Persian date string (YYYY/MM/DD format)
export function parsePersianDate(dateString: string): PersianDate | null {
  const match = dateString.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/)
  if (!match) return null
  
  const year = parseInt(match[1])
  const month = parseInt(match[2])
  const day = parseInt(match[3])
  
  try {
    const gregorianDate = persianToGregorian(year, month, day)
    return gregorianToPersian(gregorianDate)
  } catch {
    return null
  }
}

// Convert numbers to Persian digits
export function toPersianDigits(num: number | string): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
  return num.toString().replace(/\d/g, (digit) => persianDigits[parseInt(digit)])
}
