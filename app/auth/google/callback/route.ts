import { NextRequest, NextResponse } from 'next/server'
import { getGoogleTokens } from '@/lib/google-calendar'
import { supabase } from '@/lib/supabase'
import { OAuth2Client } from 'google-auth-library'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(new URL('/?error=access_denied', request.url))
  }

  if (!code) {
    return NextResponse.redirect(new URL('/?error=no_code', request.url))
  }

  try {
    // Exchange code for tokens
    const tokens = await getGoogleTokens(code)
    
    // Get user info from Google
    const oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    )
    
    oauth2Client.setCredentials(tokens)
    
    // Fetch user info
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`
      }
    })
    
    const userInfo = await response.json()

    // Get current user session
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      return NextResponse.redirect(new URL('/?error=no_session', request.url))
    }

    // Update user with Google tokens
    const { error: updateError } = await supabase
      .from('users')
      .upsert({
        id: session.user.id,
        email: userInfo.email || session.user.email || '',
        name: userInfo.name || '',
        google_access_token: tokens.access_token,
        google_refresh_token: tokens.refresh_token,
        updated_at: new Date().toISOString()
      })

    if (updateError) {
      console.error('Error updating user:', updateError)
      return NextResponse.redirect(new URL('/?error=update_failed', request.url))
    }

    return NextResponse.redirect(new URL('/?success=google_connected', request.url))
  } catch (error) {
    console.error('Google auth callback error:', error)
    return NextResponse.redirect(new URL('/?error=auth_failed', request.url))
  }
}
