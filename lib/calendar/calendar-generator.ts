import { 
  CalendarMonth, 
  CalendarWeek, 
  CalendarDay, 
  CalendarEvent,
  PersianDate,
  getCurrentPersianDate,
  getPersianDaysInMonth,
  getFirstDayOfPersianMonth,
  persianToGregorian,
  gregorianToPersian
} from './persian-utils';

// باقی کد...
import { CalendarMonth, CalendarWeek, CalendarDay, PersianDate } from '../../types/calendar';
import { 
  getCurrentPersianDate, 
  getPersianDaysInMonth, 
  getFirstDayOfPersianMonth,
  PERSIAN_MONTHS,
  persianToGregorian,
  gregorianToPersian
} from './persian-utils';

export function generateCalendarMonth(year: number, month: number): CalendarMonth {
  const today = getCurrentPersianDate();
  const daysInMonth = getPersianDaysInMonth(year, month);
  const firstDayOfWeek = getFirstDayOfPersianMonth(year, month);
  
  const weeks: CalendarWeek[] = [];
  let currentWeek: CalendarDay[] = [];
  
  // Previous month's trailing days
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const daysInPrevMonth = getPersianDaysInMonth(prevYear, prevMonth);
  
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const date: PersianDate = {
      year: prevYear,
      month: prevMonth,
      day,
      weekDay: firstDayOfWeek - 1 - i
    };
    
    currentWeek.push({
      date,
      isCurrentMonth: false,
      isToday: false,
      events: [],
      gregorianDate: persianToGregorian(prevYear, prevMonth, day)
    });
  }
  
  // Current month's days
  for (let day = 1; day <= daysInMonth; day++) {
    const date: PersianDate = {
      year,
      month,
      day,
      weekDay: (firstDayOfWeek + day - 1) % 7
    };
    
    const isToday = today.year === year && today.month === month && today.day === day;
    
    currentWeek.push({
      date,
      isCurrentMonth: true,
      isToday,
      events: [],
      gregorianDate: persianToGregorian(year, month, day)
    });
    
    if (currentWeek.length === 7) {
      weeks.push({ days: [...currentWeek] });
      currentWeek = [];
    }
  }
  
  // Next month's leading days
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  let nextMonthDay = 1;
  
  while (currentWeek.length < 7) {
    const date: PersianDate = {
      year: nextYear,
      month: nextMonth,
      day: nextMonthDay,
      weekDay: (currentWeek.length) % 7
    };
    
    currentWeek.push({
      date,
      isCurrentMonth: false,
      isToday: false,
      events: [],
      gregorianDate: persianToGregorian(nextYear, nextMonth, nextMonthDay)
    });
    
    nextMonthDay++;
  }
  
  if (currentWeek.length > 0) {
    weeks.push({ days: currentWeek });
  }
  
  return {
    year,
    month,
    weeks,
    monthName: PERSIAN_MONTHS[month - 1]
  };
}
