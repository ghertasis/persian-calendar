// hooks/useGoogleEvents.ts
import { useState, useEffect } from 'react';

interface GoogleEvent {
  id: string;
  summary: string;
  start: {
    date?: string;
    dateTime?: string;
  };
  end: {
    date?: string; 
    dateTime?: string;
  };
  description?: string;
  location?: string;
}

interface UseGoogleEventsReturn {
  events: GoogleEvent[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useGoogleEvents = (month?: number, year?: number): UseGoogleEventsReturn => {
  const [events, setEvents] = useState<GoogleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // محاسبه بازه زمانی برای ماه مورد نظر
      const timeMin = year && month !== undefined 
        ? new Date(year, month, 1).toISOString()
        : new Date().toISOString();
        
      const timeMax = year && month !== undefined
        ? new Date(year, month + 1, 0).toISOString()
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

      const response = await fetch(`/api/calendars?timeMin=${timeMin}&timeMax=${timeMax}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      
      const data = await response.json();
      setEvents(data.events || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در دریافت رویدادها');
      console.error('Error fetching Google events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [month, year]);

  return {
    events,
    loading,
    error,
    refetch: fetchEvents
  };
};

// کمکی برای گروه‌بندی رویدادها بر اساس تاریخ
export const groupEventsByDate = (events: GoogleEvent[]) => {
  const grouped: { [date: string]: GoogleEvent[] } = {};
  
  events.forEach(event => {
    const eventDate = event.start.date || event.start.dateTime?.split('T')[0];
    if (eventDate) {
      if (!grouped[eventDate]) {
        grouped[eventDate] = [];
      }
      grouped[eventDate].push(event);
    }
  });
  
  return grouped;
};
