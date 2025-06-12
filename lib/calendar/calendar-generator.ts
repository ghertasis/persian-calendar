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

export class CalendarGenerator {
  static generateMonth(year: number, month: number, events: CalendarEvent[] = []): CalendarMonth {
    const daysInMonth = getPersianDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfPersianMonth(year, month);
    const today = getCurrentPersianDate();
    
    const weeks: CalendarWeek[] = [];
    let currentWeek: CalendarDay[] = [];
    
    // اضافه کردن روزهای خالی اول ماه
    for (let i = 0; i < firstDayOfMonth; i++) {
      const prevMonthDate = this.getPreviousMonthDate(year, month, firstDayOfMonth - i);
      currentWeek.unshift(this.createCalendarDay(
        prevMonthDate,
        events,
        false, // isCurrentMonth
        this.isToday(prevMonthDate, today)
      ));
    }
    
    // اضافه کردن روزهای ماه جاری
    for (let day = 1; day <= daysInMonth; day++) {
      const persianDate: PersianDate = {
        year,
        month,
        day,
        weekDay: (firstDayOfMonth + day - 1) % 7
      };
      
      currentWeek.push(this.createCalendarDay(
        persianDate,
        events,
        true, // isCurrentMonth
        this.isToday(persianDate, today)
      ));
      
      // اگر هفته کامل شد، به لیست هفته‌ها اضافه کن
      if (currentWeek.length === 7) {
        weeks.push({ days: [...currentWeek] });
        currentWeek = [];
      }
    }
    
    // اضافه کردن روزهای ماه بعد برای تکمیل آخرین هفته
    if (currentWeek.length > 0) {
      const remainingDays = 7 - currentWeek.length;
      for (let i = 1; i <= remainingDays; i++) {
        const nextMonthDate = this.getNextMonthDate(year, month, i);
        currentWeek.push(this.createCalendarDay(
          nextMonthDate,
          events,
          false, // isCurrentMonth
          this.isToday(nextMonthDate, today)
        ));
      }
      weeks.push({ days: currentWeek });
    }
    
    return {
      year,
      month,
      weeks,
      totalDays: daysInMonth
    };
  }
  
  private static createCalendarDay(
    persianDate: PersianDate, 
    events: CalendarEvent[], 
    isCurrentMonth: boolean,
    isToday: boolean
  ): CalendarDay {
    const gregorianDate = persianToGregorian(persianDate.year, persianDate.month, persianDate.day);
    
    // فیلتر کردن رویدادهای مربوط به این روز
    const dayEvents = events.filter(event => {
      const eventPersianDate = gregorianToPersian(event.startTime);
      return eventPersianDate.year === persianDate.year &&
             eventPersianDate.month === persianDate.month &&
             eventPersianDate.day === persianDate.day;
    });
    
    return {
      persianDate,
      gregorianDate,
      events: dayEvents,
      isCurrentMonth,
      isToday,
      isWeekend: persianDate.weekDay === 5 // جمعه
    };
  }
  
  private static isToday(persianDate: PersianDate, today: PersianDate): boolean {
    return persianDate.year === today.year &&
           persianDate.month === today.month &&
           persianDate.day === today.day;
  }
  
  private static getPreviousMonthDate(year: number, month: number, daysBack: number): PersianDate {
    let prevMonth = month - 1;
    let prevYear = year;
    
    if (prevMonth < 1) {
      prevMonth = 12;
      prevYear--;
    }
    
    const daysInPrevMonth = getPersianDaysInMonth(prevYear, prevMonth);
    const day = daysInPrevMonth - daysBack + 1;
    
    return {
      year: prevYear,
      month: prevMonth,
      day,
      weekDay: 0 // محاسبه دقیق weekDay در صورت نیاز
    };
  }
  
  private static getNextMonthDate(year: number, month: number, day: number): PersianDate {
    let nextMonth = month + 1;
    let nextYear = year;
    
    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear++;
    }
    
    return {
      year: nextYear,
      month: nextMonth,
      day,
      weekDay: 0 // محاسبه دقیق weekDay در صورت نیاز
    };
  }
  
  static getMonthEvents(year: number, month: number, allEvents: CalendarEvent[]): CalendarEvent[] {
    return allEvents.filter(event => {
      const eventPersianDate = gregorianToPersian(event.startTime);
      return eventPersianDate.year === year && eventPersianDate.