import { CalendarMonth, CalendarDay, CalendarEvent, CalendarWeek, PersianDate } from './persian-utils';
import { 
  getCurrentPersianDate, 
  persianToGregorian, 
  gregorianToPersian,
  PERSIAN_MONTHS,
  getPersianDaysInMonth,
  getFirstDayOfPersianMonth
} from './persian-utils';

export class CalendarGenerator {
  static generateMonth(year: number, month: number, events: CalendarEvent[] = []): CalendarMonth {
    try {
      // Get the number of days in this Persian month
      const daysInMonth = getPersianDaysInMonth(year, month);
      
      // Get the first day of the month (0 = Sunday, 6 = Saturday)
      const firstDayOfWeek = getFirstDayOfPersianMonth(year, month);
      
      // Persian week starts on Saturday (6), so we need to adjust
      // Saturday = 0, Sunday = 1, Monday = 2, ..., Friday = 6
      const adjustedFirstDay = (firstDayOfWeek + 1) % 7;
      
      const weeks: CalendarWeek[] = [];
      let currentWeek: CalendarDay[] = [];
      
      // Add empty days at the beginning (previous month)
      if (adjustedFirstDay > 0) {
        const prevMonth = month === 1 ? 12 : month - 1;
        const prevYear = month === 1 ? year - 1 : year;
        const prevMonthDays = getPersianDaysInMonth(prevYear, prevMonth);
        
        for (let i = adjustedFirstDay - 1; i >= 0; i--) {
          const day = prevMonthDays - i;
          const persianDate: PersianDate = { 
            year: prevYear, 
            month: prevMonth, 
            day,
            weekDay: (firstDayOfWeek - adjustedFirstDay + (adjustedFirstDay - 1 - i)) % 7
          };
          
          currentWeek.push({
            persianDate,
            gregorianDate: persianToGregorian(prevYear, prevMonth, day),
            isCurrentMonth: false,
            isToday: false,
            events: []
          });
        }
      }
      
      // Add days of the current month
      const today = getCurrentPersianDate();
      
      for (let day = 1; day <= daysInMonth; day++) {
        const weekDay = (firstDayOfWeek + day - 1) % 7;
        const persianDate: PersianDate = { year, month, day, weekDay };
        const gregorianDate = persianToGregorian(year, month, day);
        
        const isToday = persianDate.year === today.year && 
                       persianDate.month === today.month && 
                       persianDate.day === today.day;
        
        // Filter events for this day
        const dayEvents = events.filter(event => {
          const eventPersianDate = gregorianToPersian(event.startTime);
          return eventPersianDate.year === persianDate.year &&
                 eventPersianDate.month === persianDate.month &&
                 eventPersianDate.day === persianDate.day;
        });
        
        const calendarDay: CalendarDay = {
          persianDate,
          gregorianDate,
          isCurrentMonth: true,
          isToday,
          events: dayEvents,
          isWeekend: weekDay === 5 || weekDay === 6 // Thursday and Friday
        };
        
        currentWeek.push(calendarDay);
        
        // If week is complete, add it to weeks
        if (currentWeek.length === 7) {
          weeks.push({ days: currentWeek });
          currentWeek = [];
        }
      }
      
      // Fill the last week if necessary (next month days)
      if (currentWeek.length > 0) {
        const nextMonth = month === 12 ? 1 : month + 1;
        const nextYear = month === 12 ? year + 1 : year;
        let nextDay = 1;
        
        while (currentWeek.length < 7) {
          const weekDay = (firstDayOfWeek + daysInMonth + nextDay - 1) % 7;
          const persianDate: PersianDate = { 
            year: nextYear, 
            month: nextMonth, 
            day: nextDay,
            weekDay
          };
          
          currentWeek.push({
            persianDate,
            gregorianDate: persianToGregorian(nextYear, nextMonth, nextDay),
            isCurrentMonth: false,
            isToday: false,
            events: []
          });
          
          nextDay++;
        }
        weeks.push({ days: currentWeek });
      }
      
      return {
        year,
        month,
        weeks,
        totalDays: daysInMonth
      };
      
    } catch (error) {
      console.error('Error in CalendarGenerator.generateMonth:', error);
      throw new Error(`Failed to generate calendar: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
