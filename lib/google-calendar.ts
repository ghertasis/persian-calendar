import { GoogleAuth, OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'

// Environment variables
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`

// Types
export interface GoogleEvent {
  id: string
  summary: string
  description?: string
  start: {
    dateTime?: string
    date?: string
  }
  end: {
    dateTime?: string
    date?: string
  }
  colorId?: string
}

export interface GoogleCalendar {
  id: string
  summary: string
  primary?: boolean
  backgroundColor?: string
}

// Create OAuth2 client
export function createGoogleAuth(): OAuth2Client {
  return new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    REDIRECT_URI
  )
}

// Generate Google authorization URL
export function getGoogleAuthUrl(): string {
  const oauth2Client = createGoogleAuth()
  
  const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ]

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent'
  })
}

// Exchange authorization code for tokens
export async function getGoogleTokens(code: string) {
  const oauth2Client = createGoogleAuth()
  
  try {
    const { tokens } = await oauth2Client.getToken(code)
    return tokens
  } catch (error) {
    console.error('Error getting Google tokens:', error)
    throw error
  }
}

// Create authenticated calendar client
export function createCalendarClient(accessToken: string, refreshToken?: string) {
  const oauth2Client = createGoogleAuth()
  
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken
  })
  
  return google.calendar({ version: 'v3', auth: oauth2Client })
}

// Get user's Google Calendars
export async function getUserCalendars(accessToken: string, refreshToken?: string): Promise<GoogleCalendar[]> {
  try {
    const calendar = createCalendarClient(accessToken, refreshToken)
    
    const response = await calendar.calendarList.list()
    
    return response.data.items?.map(item => ({
      id: item.id!,
      summary: item.summary!,
      primary: item.primary,
      backgroundColor: item.backgroundColor
    })) || []
  } catch (error) {
    console.error('Error fetching Google calendars:', error)
    throw error
  }
}

// Get Google Calendar events
export async function getGoogleEvents(
  accessToken: string,
  calendarId: string,
  startDate: Date,
  endDate: Date,
  refreshToken?: string
): Promise<GoogleEvent[]> {
  try {
    const calendar = createCalendarClient(accessToken, refreshToken)
    
    const response = await calendar.events.list({
      calendarId,
      timeMin: startDate.toISOString(),
      timeMax: endDate.toISOString(),
      singleEvents: true,
      orderBy: 'startTime'
    })
    
    return response.data.items?.map(item => ({
      id: item.id!,
      summary: item.summary || 'Untitled Event',
      description: item.description,
      start: {
        dateTime: item.start?.dateTime,
        date: item.start?.date
      },
      end: {
        dateTime: item.end?.dateTime,
        date: item.end?.date
      },
      colorId: item.colorId
    })) || []
  } catch (error) {
    console.error('Error fetching Google events:', error)
    throw error
  }
}

// Create Google Calendar event
export async function createGoogleEvent(
  accessToken: string,
  calendarId: string,
  eventData: any,
  refreshToken?: string
) {
  try {
    const calendar = createCalendarClient(accessToken, refreshToken)
    
    const response = await calendar.events.insert({
      calendarId,
      requestBody: eventData
    })
    
    return response.data
  } catch (error) {
    console.error('Error creating Google event:', error)
    throw error
  }
}

// Update Google Calendar event
export async function updateGoogleEvent(
  accessToken: string,
  calendarId: string,
  eventId: string,
  eventData: any,
  refreshToken?: string
) {
  try {
    const calendar = createCalendarClient(accessToken, refreshToken)
    
    const response = await calendar.events.update({
      calendarId,
      eventId,
      requestBody: eventData
    })
    
    return response.data
  } catch (error) {
    console.error('Error updating Google event:', error)
    throw error
  }
}

// Delete Google Calendar event
export async function deleteGoogleEvent(
  accessToken: string,
  calendarId: string,
  eventId: string,
  refreshToken?: string
) {
  try {
    const calendar = createCalendarClient(accessToken, refreshToken)
    
    await calendar.events.delete({
      calendarId,
      eventId
    })
    
    return true
  } catch (error) {
    console.error('Error deleting Google event:', error)
    throw error
  }
}

// Refresh Google access token
export async function refreshGoogleToken(refreshToken: string) {
  try {
    const oauth2Client = createGoogleAuth()
    oauth2Client.setCredentials({
      refresh_token: refreshToken
    })
    
    const { credentials } = await oauth2Client.refreshAccessToken()
    return credentials
  } catch (error) {
    console.error('Error refreshing Google token:', error)
    throw error
  }
}
