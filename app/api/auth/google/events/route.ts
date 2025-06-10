import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getGoogleEvents } from '@/lib/google-calendar'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const startDate = searchParams.get('start')
  const endDate = searchParams.get('end')

  try {
    // Get current user session
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch local events from Supabase
    let query = supabase
      .from('events')
      .select('*')
      .eq('user_id', session.user.id)

    if (startDate && endDate) {
      query = query
        .gte('start', startDate)
        .lte('end', endDate)
    }

    const { data: localEvents, error: localError } = await query

    if (localError) {
      console.error('Error fetching local events:', localError)
      return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
    }

    // Get user's Google tokens
    const { data: userData } = await supabase
      .from('users')
      .select('google_access_token, google_refresh_token')
      .eq('id', session.user.id)
      .single()

    let googleEvents: any[] = []

    // Fetch Google events if tokens exist
    if (userData?.google_access_token && startDate && endDate) {
      try {
        googleEvents = await getGoogleEvents(
          userData.google_access_token,
          userData.google_refresh_token,
          startDate,
          endDate
        )
      } catch (error) {
        console.error('Error fetching Google events:', error)
        // Continue without Google events
      }
    }

    // Combine and format events
    const allEvents = [
      ...localEvents.map(event => ({
        ...event,
        source: 'local'
      })),
      ...googleEvents.map(event => ({
        ...event,
        source: 'google'
      }))
    ]

    return NextResponse.json({ events: allEvents })
  } catch (error) {
    console.error('Error in events API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: event, error } = await supabase
      .from('events')
      .insert({
        ...body,
        user_id: session.user.id
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating event:', error)
      return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
    }

    return NextResponse.json({ event })
  } catch (error) {
    console.error('Error in POST events API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
