import { CalendarEvent } from './persian-utils';

export function generateSampleEvents(): CalendarEvent[] {
  const now = new Date();
  
  // Helper function to create dates
  const createDate = (daysFromNow: number, hour: number = 9, minute: number = 0): Date => {
    const date = new Date();
    date.setDate(now.getDate() + daysFromNow);
    date.setHours(hour, minute, 0, 0);
    return date;
  };

  return [
    {
      id: '1',
      title: 'جلسه تیم توسعه',
      description: 'بررسی پیشرفت پروژه و برنامه‌ریزی هفته آینده',
      startTime: createDate(0, 9, 0),    // امروز ساعت 9:00
      endTime: createDate(0, 10, 30),    // امروز ساعت 10:30
      color: '#4285f4',
      isAllDay: false,
      location: 'اتاق جلسات A',
      source: 'local'
    },
    {
      id: '2',
      title: 'ارائه پروژه',
      description: 'ارائه نتایج پروژه به مدیریت',
      startTime: createDate(1, 14, 0),   // فردا ساعت 14:00
      endTime: createDate(1, 15, 30),    // فردا ساعت 15:30
      color: '#db4437',
      isAllDay: false,
      location: 'سالن کنفرانس',
      source: 'local'
    },
    {
      id: '3',
      title: 'تعطیلات آخر هفته',
      startTime: createDate(5, 0, 0),    // 5 روز بعد
      endTime: createDate(7, 23, 59),    // 7 روز بعد
      color: '#0f9d58',
      isAllDay: true,
      source: 'local'
    },
    {
      id: '4',
      title: 'دندانپزشک',
      description: 'ویزیت دندانپزشک',
      startTime: createDate(3, 16, 0),   // 3 روز بعد ساعت 16:00
      endTime: createDate(3, 17, 0),     // 3 روز بعد ساعت 17:00
      color: '#f4b400',
      isAllDay: false,
      location: 'کلینیک دکتر احمدی',
      source: 'google'
    },
    {
      id: '5',
      title: 'جشن تولد',
      description: 'جشن تولد دوست',
      startTime: createDate(5, 19, 0),   // 5 روز بعد ساعت 19:00
      endTime: createDate(5, 22, 0),     // 5 روز بعد ساعت 22:00
      color: '#ff6d01',
      isAllDay: false,
      source: 'local'
    },
    {
      id: '6',
      title: 'ورزش صبحگاهی',
      description: 'دویدن در پارک',
      startTime: createDate(1, 6, 30),   // فردا ساعت 6:30
      endTime: createDate(1, 7, 30),     // فردا ساعت 7:30
      color: '#9c27b0',
      isAllDay: false,
      location: 'پارک شهر',
      source: 'local'
    }
  ];
}
