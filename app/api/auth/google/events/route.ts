import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { getGoogleEvents } from '@/lib/google-calendar'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('start')
    const endDate = searchParams.get('end')
    
    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Start and end dates are required' },
        { status: 400 }
      )
    }
    
    const supabase = createServerClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get user data
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single()
    
    // Get local events
    const { data: localEvents } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', session.user.id)
      .gte('start_date', startDate)
      .lte('end_date', endDate)
    
    let googleEvents: any[] = []
    
    // Get Google events if connected
    if (user?.google_access_token && user?.default_calendar_id) {
      try {
        googleEvents = await getGoogleEvents(
          user.google_access_token,
          user.default_calendar_id,
          new Date(startDate),
          new Date(endDate),
          user.google_refresh_token
        )
      } catch (error) {
        console.error('Error fetching Google events:', error)
      }
    }
    
    // Combine and format events
    const allEvents = [
      ...(localEvents || []).map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        start: event.start_date,
        end: event.end_date,
        shamsiDate: event.shamsi_date,
        isAllDay: event.is_all_day,
        color: event.color,
        source: 'local'
      })),
      ...googleEvents.map(event => ({
        id: `google_${event.id}`,
        title: event.summary,
        description: event.description,
        start: event.start.dateTime || event.start.date,
        end: event.end.dateTime || event.end.date,
        isAllDay: !event.start.dateTime,
        color: event.colorId ? `#${event.colorId}` : '#3B82F6',
        source: 'google'
      }))
    ]
    
    return NextResponse.json({ events: allEvents })
    
  } catch (error) {
    console.error('Events API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, start, end, isAllDay, color, shamsiDate } = body
    
    const supabase = createServerClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Create local event
    const { data: event, error } = await supabase
      .from('events')
      .insert({
        user_id: session.user.id,
        title,
        description,
        start_date: start,
        end_date: end,
        is_all_day: isAllDay,
        color: color || '#3B82F6',
        shamsi_date: shamsiDate
      })
      .select()
      .single()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    return NextResponse.json({ event })
    
  } catch (error) {
    console.error('Create event error:', error)
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
}
