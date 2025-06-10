import { NextRequest, NextResponse } from 'next/server'
import { getGoogleTokens } from '@/lib/google-calendar'
import { createServerClient } from '@/lib/supabase'
import { google } from 'googleapis'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    
    if (error) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}?error=access_denied`)
    }
    
    if (!code) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}?error=no_code`)
    }
    
    // Exchange code for tokens
    const tokens = await getGoogleTokens(code)
    
    if (!tokens.access_token) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}?error=no_token`)
    }
    
    // Get user info from Google
    const oauth2Client = new google.auth.OAuth2()
    oauth2Client.setCredentials(tokens)
    
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client })
    const userInfo = await oauth2.userinfo.get()
    
    // Save to Supabase
    const supabase = createServerClient()
    
    // Get current user session
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}?error=not_authenticated`)
    }
    
    // Update user with Google tokens
    const { error: updateError } = await supabase
      .from('users')
      .upsert({
        id: session.user.id,
        email: userInfo.data.email!,
        name: userInfo.data.name,
        google_access_token: tokens.access_token,
        google_refresh_token: tokens.refresh_token,
      })
    
    if (updateError) {
      console.error('Database update error:', updateError)
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}?error=db_error`)
    }
    
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}?success=google_connected`)
    
  } catch (error) {
    console.error('Google callback error:', error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}?error=callback_failed`)
  }
}
