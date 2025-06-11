// types/moment-jalaali.d.ts
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
    
    startOf(unit: 'jYear' | 'jMonth' | 'jWeek' | 'jDay' | string): JMoment;
    endOf(unit: 'jYear' | 'jMonth' | 'jWeek' | 'jDay' | string): JMoment;
    
    add(amount: number, unit: 'jYear' | 'jMonth' | 'jWeek' | 'jDay' | string): JMoment;
    subtract(amount: number, unit: 'jYear' | 'jMonth' | 'jWeek' | 'jDay' | string): JMoment;
    
    format(format?: string): string;
    jFormat(format?: string): string;
    
    clone(): JMoment;
    
    jDaysInMonth(): number;
    jIsLeapYear(): boolean;
  }

  interface MomentJalaali {
    (): JMoment;
    (date: MomentInput): JMoment;
    (date: MomentInput, format: MomentFormatSpecification): JMoment;
    
    loadPersian(options?: any): void;
    unix(timestamp: number): JMoment;
    utc(): JMoment;
    utc(date: MomentInput): JMoment;
    
    jIsLeapYear(year: number): boolean;
    jDaysInMonth(year: number, month: number): number;
  }

  const moment: MomentJalaali;
  export = moment;
}
