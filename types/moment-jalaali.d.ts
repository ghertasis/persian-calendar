declare module 'moment-jalaali' {
  import { Moment, MomentInput, unitOfTime } from 'moment'

  interface MomentJalaali extends Moment {
    jYear(): number
    jYear(year: number): MomentJalaali
    jMonth(): number
    jMonth(month: number): MomentJalaali
    jDate(): number
    jDate(date: number): MomentJalaali
    jDayOfYear(): number
    jDayOfYear(dayOfYear: number): MomentJalaali
    jWeek(): number
    jWeek(week: number): MomentJalaali
    jWeekYear(): number
    jWeekYear(weekYear: number): MomentJalaali
    jISOWeek(): number
    jISOWeek(isoWeek: number): MomentJalaali
    jISOWeekYear(): number
    jISOWeekYear(isoWeekYear: number): MomentJalaali
    clone(): MomentJalaali
    format(format?: string): string
    jFormat(format?: string): string
    startOf(unitOfTime: unitOfTime.StartOf): MomentJalaali
    endOf(unitOfTime: unitOfTime.StartOf): MomentJalaali
    add(amount?: MomentInput, unit?: unitOfTime.DurationConstructor): MomentJalaali
    subtract(amount?: MomentInput, unit?: unitOfTime.DurationConstructor): MomentJalaali
    toDate(): Date
    valueOf(): number
    unix(): number
    diff(b: MomentInput, unitOfTime?: unitOfTime.Diff, precise?: boolean): number
    isBefore(inp?: MomentInput, granularity?: unitOfTime.StartOf): boolean
    isAfter(inp?: MomentInput, granularity?: unitOfTime.StartOf): boolean
    isSame(inp?: MomentInput, granularity?: unitOfTime.StartOf): boolean
    isSameOrBefore(inp?: MomentInput, granularity?: unitOfTime.StartOf): boolean
    isSameOrAfter(inp?: MomentInput, granularity?: unitOfTime.StartOf): boolean
    isBetween(a: MomentInput, b: MomentInput, granularity?: unitOfTime.StartOf, inclusivity?: string): boolean
    isValid(): boolean
  }

  interface MomentJalaaliStatic {
    (): MomentJalaali
    (inp?: MomentInput): MomentJalaali
    (inp?: MomentInput, format?: string, strict?: boolean): MomentJalaali
    (inp?: MomentInput, format?: string, language?: string, strict?: boolean): MomentJalaali
    (inp?: MomentInput, formats?: string[], strict?: boolean): MomentJalaali
    (inp?: MomentInput, formats?: string[], language?: string, strict?: boolean): MomentJalaali
    
    utc(): MomentJalaali
    utc(inp?: MomentInput): MomentJalaali
    utc(inp?: MomentInput, format?: string, strict?: boolean): MomentJalaali
    utc(inp?: MomentInput, format?: string, language?: string, strict?: boolean): MomentJalaali
    utc(inp?: MomentInput, formats?: string[], strict?: boolean): MomentJalaali
    utc(inp?: MomentInput, formats?: string[], language?: string, strict?: boolean): MomentJalaali
    
    unix(timestamp: number): MomentJalaali
    invalid(flags?: any): MomentJalaali
    isMoment(m: any): m is MomentJalaali
    isDate(m: any): m is Date
    isDuration(d: any): boolean
    
    // Jalaali specific methods
    loadPersian(config?: { 
      dialect?: 'persian-modern' | 'persian-default'
      usePersianDigits?: boolean 
    }): void
    jIsLeapYear(year: number): boolean
    jDaysInMonth(year: number, month: number): number
    jConvert: {
      j_to_g(jy: number, jm: number, jd: number): { gy: number, gm: number, gd: number }
      g_to_j(gy: number, gm: number, gd: number): { jy: number, jm: number, jd: number }
    }
  }

  const moment: MomentJalaaliStatic
  export = moment
}
