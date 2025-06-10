import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getUserCalendars } from '@/lib/google-calendar'

export async function GET(request: NextRequest) {
  try {
    // Get current user session
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's Google tokens
    const { data: userData } = await supabase
      .from('users')
      .select('google_access_token, google_refresh_token')
      .eq('id', session.user.id)
      .single()

    if (!userData?.google_access_token) {
      return NextResponse.json({ calendars: [] })
    }

    const calendars = await getUserCalendars(
      userData.google_access_token,
      userData.google_refresh_token
    )

    return NextResponse.json({ calendars })
  } catch (error) {
    console.error('Error fetching calendars:', error)
    return NextResponse.json({ error: 'Failed to fetch calendars' }, { status: 500 })
  }
}
