declare module 'moment-jalaali' {
  import { Moment, MomentFormatSpecification, MomentInput } from 'moment';

  interface JMoment extends Moment {
    jYear(): number;
    jYear(year: number): JMoment;
    jMonth(): number;
    jMonth(month: number): JMoment;
    jDate(): number;
    jDate(date: number): JMoment;
    jDay(): number;
    jDayOfYear(): number;
    jWeek(): number;
    jWeekYear(): number;
    
    // متدهای startOf و endOf برای تاریخ‌های جلالی
    startOf(unit: 'jYear' | 'jMonth' | 'jWeek' | 'jDay' | string): JMoment;
    endOf(unit: 'jYear' | 'jMonth' | 'jWeek' | 'jDay' | string): JMoment;
    
    // متدهای add و subtract
    add(amount: number, unit: 'jYear' | 'jMonth' | 'jWeek' | 'jDay' | string): JMoment;
    subtract(amount: number, unit: 'jYear' | 'jMonth' | 'jWeek' | 'jDay' | string): JMoment;
    
    // فرمت‌های جلالی
    format(format?: string): string;
    jFormat(format?: string): string;
    
    // clone method
    clone(): JMoment;
    
    // سایر متدها
    isSame(date: JMoment | Moment, unit?: string): boolean;
    isSameOrBefore(date: JMoment | Moment, unit?: string): boolean;
    isSameOrAfter(date: JMoment | Moment, unit?: string): boolean;
    isBefore(date: JMoment | Moment, unit?: string): boolean;
    isAfter(date: JMoment | Moment, unit?: string): boolean;
    
    // متدهای کمکی جلالی
    jDaysInMonth(): number;
    jIsLeapYear(): boolean;
  }

  interface MomentJalaali {
    (): JMoment;
    (date: MomentInput): JMoment;
    (date: MomentInput, format: MomentFormatSpecification): JMoment;
    (date: MomentInput, format: MomentFormatSpecification, locale: string): JMoment;
    (date: MomentInput, format: MomentFormatSpecification, strict: boolean): JMoment;
    (date: MomentInput, format: MomentFormatSpecification, locale: string, strict: boolean): JMoment;
    
    loadPersian(options?: any): void;
    unix(timestamp: number): JMoment;
    utc(): JMoment;
    utc(date: MomentInput): JMoment;
    
    // متدهای استاتیک جلالی
    jIsLeapYear(year: number): boolean;
    jDaysInMonth(year: number, month: number): number;
  }

  const moment: MomentJalaali;
  export = moment;
}
