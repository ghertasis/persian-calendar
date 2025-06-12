import { CalendarEvent } from '../../types/calendar';
import { getCurrentPersianDate } from './persian-utils';

export function generateSampleEvents(): CalendarEvent[] {
  const today = getCurrentPersianDate();
  
  return [
    {
      id: '1',
      title: 'جلسه تیم توسعه',
      description: 'بررسی پیشرفت پروژه و برنامه‌ریزی هفته آینده',
      startDate: today,
      startTime: '09:00',
      endTime: '10:30',
      color: '#4285f4',
      isAllDay: false,
      location: 'اتاق جلسات A',
      source: 'local'
    },
    {
      id: '2',
      title: 'ارائه پروژه',
      startDate: { ...today, day: today.day + 1 },
      startTime: '14:00',
      endTime: '15:30',
      color: '#db4437',
      isAllDay: false,
      location: 'سالن کنفرانس',
      source: 'local'
    },
    {
      id: '3',
      title: 'تعطیلات عید نوروز',
      startDate: { year: 1404, month: 1, day: 1, weekDay: 0 },
      endDate: { year: 1404, month: 1, day: 13, weekDay: 5 },
      color: '#0f9d58',
      isAllDay: true,
      source: 'local'
    },
    {
      id: '4',
      title: 'دندانپزشک',
      startDate: { ...today, day: today.day + 3 },
      startTime: '16:00',
      endTime: '17:00',
      color: '#f4b400',
      isAllDay: false,
      location: 'کلینیک دکتر احمدی',
      source: 'google'
    },
    {
      id: '5',
      title: 'جشن تولد',
      startDate: { ...today, day: today.day + 5 },
      startTime: '19:00',
      color: '#ff6d01',
      isAllDay: false,
      source: 'local'
    }
  ];
}
