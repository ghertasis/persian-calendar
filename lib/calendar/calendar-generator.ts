import { 
  CalendarMonth, 
  CalendarWeek, 
  CalendarDay, 
  CalendarEvent, 
  PersianDate,
  getPersianDaysInMonth,
  getFirstDayOfPersianMonth,
  persianToGregorian,
  gregorianToPersian,
  getCurrentPersianDate,
  isPersianWeekend,
  isSamePersianDate,
  PERSIAN_MONTHS
} from './persian-utils';

export class CalendarGenerator {
  static generateMonth(year: number, month: number, events: CalendarEvent[] = []): CalendarMonth {
    console.log('🔧 CalendarGenerator: Generating month', { year, month, eventsCount: events.length });
    
    try {
      const weeks: CalendarWeek[] = [];
      const daysInMonth = getPersianDaysInMonth(year, month);
      const firstDayOfWeek = getFirstDayOfPersianMonth(year, month);
      const today = getCurrentPersianDate();
      
      console.log('📊 Month info:', { 
        daysInMonth, 
        firstDayOfWeek, 
        today,
        monthName: PERSIAN_MONTHS[month - 1]
      });

      let currentWeek: CalendarDay[] = [];
      let dayCounter = 1;

      // اضافه کردن روزهای ماه قبل (اگر نیاز باشه)
      const prevMonth = month === 1 ? 12 : month - 1;
      const prevYear = month === 1 ? year - 1 : year;
      const daysInPrevMonth = getPersianDaysInMonth(prevYear, prevMonth);

      // پر کردن روزهای خالی اول هفته با روزهای ماه قبل
      for (let i = firstDayOfWeek; i > 0; i--) {
        const dayNum = daysInPrevMonth - i + 1;
        const persianDate: PersianDate = {
          year: prevYear,
          month: prevMonth,
          day: dayNum,
          weekDay: firstDayOfWeek - i
        };

        const gregorianDate = persianToGregorian(prevYear, prevMonth, dayNum);
        const dayEvents = this.getEventsForDay(events, persianDate);

        currentWeek.push({
          persianDate,
          gregorianDate,
          events: dayEvents,
          isCurrentMonth: false,
          isToday: isSamePersianDate(persianDate, today),
          isWeekend: isPersianWeekend(persianDate.weekDay)
        });
      }

      // اضافه کردن روزهای ماه فعلی
      for (let day = 1; day <= daysInMonth; day++) {
        const weekDay = (firstDayOfWeek + day - 1) % 7;
        const persianDate: PersianDate = {
          year,
          month,
          day,
          weekDay
        };

        const gregorianDate = persianToGregorian(year, month, day);
        const dayEvents = this.getEventsForDay(events, persianDate);

        currentWeek.push({
          persianDate,
          gregorianDate,
          events: dayEvents,
          isCurrentMonth: true,
          isToday: isSamePersianDate(persianDate, today),
          isWeekend: isPersianWeekend(weekDay)
        });

        // اگر هفته کامل شد، اضافه کن به weeks
        if (currentWeek.length === 7) {
          weeks.push({ days: [...currentWeek] });
          currentWeek = [];
          dayCounter++;
        }
      }

      // اضافه کردن روزهای ماه بعد (اگر نیاز باشه)
      if (currentWeek.length > 0) {
        const nextMonth = month === 12 ? 1 : month + 1;
        const nextYear = month === 12 ? year + 1 : year;
        let nextMonthDay = 1;

        while (currentWeek.length < 7) {
          const weekDay = (currentWeek.length + (firstDayOfWeek + daysInMonth - 1)) % 7;
          const persianDate: PersianDate = {
            year: nextYear,
            month: nextMonth,
            day: nextMonthDay,
            weekDay
          };

          const gregorianDate = persianToGregorian(nextYear, nextMonth, nextMonthDay);
          const dayEvents = this.getEventsForDay(events, persianDate);

          currentWeek.push({
            persianDate,
            gregorianDate,
            events: dayEvents,
            isCurrentMonth: false,
            isToday: isSamePersianDate(persianDate, today),
            isWeekend: isPersianWeekend(weekDay)
          });

          nextMonthDay++;
        }

        weeks.push({ days: [...currentWeek] });
      }

      const result: CalendarMonth = {
        year,
        month,
        monthName: PERSIAN_MONTHS[month - 1], // اضافه شد
        weeks,
        totalDays: daysInMonth,
        events // اضافه شد
      };

      console.log('✅ CalendarGenerator: Generated successfully', {
        year: result.year,
        month: result.month,
        monthName: result.monthName,
        weeksCount: result.weeks.length,
        totalDays: result.totalDays,
        eventsCount: result.events.length
      });

      return result;

    } catch (error) {
      console.error('❌ CalendarGenerator: Error generating month', error);
      throw new Error(`خطا در تولید تقویم برای ${PERSIAN_MONTHS[month - 1]} ${year}: ${error instanceof Error ? error.message : 'خطای نامشخص'}`);
    }
  }

  private static getEventsForDay(events: CalendarEvent[], persianDate: PersianDate): CalendarEvent[] {
    if (!events || events.length === 0) {
      return [];
    }

    try {
      return events.filter(event => {
        if (!event.startTime) return false;
        
        const eventPersianDate = gregorianToPersian(event.startTime);
        return isSamePersianDate(eventPersianDate, persianDate);
      });
    } catch (error) {
      console.error('Error filtering events for day:', error);
      return [];
    }
  }
}
