import { google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`

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

// Get authorization URL
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

// Exchange code for tokens
export async function getGoogleTokens(code: string) {
  const oauth2Client = createGoogleAuth()
  const { tokens } = await oauth2Client.getAccessToken(code)
  return tokens
}

// Create authenticated calendar client
export function createCalendarClient(accessToken: string, refreshToken?: string): any {
  const oauth2Client = createGoogleAuth()
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken
  })
  
  return google.calendar({ version: 'v3', auth: oauth2Client })
}

// Get user's calendars
export async function getUserCalendars(accessToken: string, refreshToken?: string): Promise<GoogleCalendar[]> {
  try {
    const calendar = createCalendarClient(accessToken, refreshToken)
    const response = await calendar.calendarList.list()
    
    return response.data.items?.map((cal: any) => ({
      id: cal.id,
      summary: cal.summary,
      primary: cal.primary,
      backgroundColor: cal.backgroundColor
    })) || []
  } catch (error) {
    console.error('Error fetching calendars:', error)
    throw new Error('Failed to fetch calendars')
  }
}

// Get events from Google Calendar
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
      orderBy: 'startTime',
      maxResults: 250
    })
    
    return response.data.items?.map((event: any) => ({
      id: event.id,
      summary: event.summary || 'بدون عنوان',
      description: event.description,
      start: event.start,
      end: event.end,
      colorId: event.colorId
    })) || []
  } catch (error) {
    console.error('Error fetching events:', error)
    throw new Error('Failed to fetch events')
  }
}

// Create event in Google Calendar
export async function createGoogleEvent(
  accessToken: string,
  calendarId: string,
  eventData: {
    summary: string
    description?: string
    start: Date
    end: Date
    isAllDay?: boolean
  },
  refreshToken?: string
): Promise<string> {
  try {
    const calendar = createCalendarClient(accessToken, refreshToken)
    
    const event = {
      summary: eventData.summary,
      description: eventData.description,
      start: eventData.isAllDay ? 
        { date: eventData.start.toISOString().split('T')[0] } :
        { dateTime: eventData.start.toISOString() },
      end: eventData.isAllDay ?
        { date: eventData.end.toISOString().split('T')[0] } :
        { dateTime: eventData.end.toISOString() }
    }
    
    const response = await calendar.events.insert({
      calendarId,
      resource: event
    })
    
    return response.data.id!
  } catch (error) {
    console.error('Error creating event:', error)
    throw new Error('Failed to create event')
  }
}

// Update event in Google Calendar
export async function updateGoogleEvent(
  accessToken: string,
  calendarId: string,
  eventId: string,
  eventData: {
    summary: string
    description?: string
    start: Date
    end: Date
    isAllDay?: boolean
  },
  refreshToken?: string
): Promise<void> {
  try {
    const calendar = createCalendarClient(accessToken, refreshToken)
    
    const event = {
      summary: eventData.summary,
      description: eventData.description,
      start: eventData.isAllDay ? 
        { date: eventData.start.toISOString().split('T')[0] } :
        { dateTime: eventData.start.toISOString() },
      end: eventData.isAllDay ?
        { date: eventData.end.toISOString().split('T')[0] } :
        { dateTime: eventData.end.toISOString() }
    }
    
    await calendar.events.update({
      calendarId,
      eventId,
      resource: event
    })
  } catch (error) {
    console.error('Error updating event:', error)
    throw new Error('Failed to update event')
  }
}

// Delete event from Google Calendar
export async function deleteGoogleEvent(
  accessToken: string,
  calendarId: string,
  eventId: string,
  refreshToken?: string
): Promise<void> {
  try {
    const calendar = createCalendarClient(accessToken, refreshToken)
    
    await calendar.events.delete({
      calendarId,
      eventId
    })
  } catch (error) {
    console.error('Error deleting event:', error)
    throw new Error('Failed to delete event')
  }
}

// Refresh access token
export async function refreshGoogleToken(refreshToken: string) {
  try {
    const oauth2Client = createGoogleAuth()
    oauth2Client.setCredentials({ refresh_token: refreshToken })
    
    const { credentials } = await oauth2Client.refreshAccessToken()
    return credentials
  } catch (error) {
    console.error('Error refreshing token:', error)
    throw new Error('Failed to refresh token')
  }
}
