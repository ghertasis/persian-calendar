import { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`

export interface GoogleEvent {
  id: string
  title: string
  description?: string
  start: string
  end: string
  allDay?: boolean
}

export interface GoogleCalendar {
  id: string
  summary: string
  primary?: boolean | null  // اضافه کردن null
  backgroundColor?: string | null  // اضافه کردن این فیلد
}

export function createGoogleAuth(): OAuth2Client {
  return new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URI)
}

export function getGoogleAuthUrl(): string {
  const oauth2Client = createGoogleAuth()
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ],
    prompt: 'consent'
  })
}

export async function getGoogleTokens(code: string) {
  const oauth2Client = createGoogleAuth()
  const { tokens } = await oauth2Client.getToken(code)
  return tokens
}

export function createCalendarClient(accessToken: string, refreshToken?: string) {
  const oauth2Client = createGoogleAuth()
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken
  })
  return google.calendar({ version: 'v3', auth: oauth2Client })
}

export async function getUserCalendars(accessToken: string, refreshToken?: string): Promise<GoogleCalendar[]> {
  try {
    const calendar = createCalendarClient(accessToken, refreshToken)
    const response = await calendar.calendarList.list()
    
    return response.data.items?.map(item => ({
      id: item.id!,
      summary: item.summary!,
      primary: item.primary ?? false,  // تبدیل null به false
      backgroundColor: item.backgroundColor || null
    })) || []
  } catch (error) {
    console.error('Error fetching user calendars:', error)
    return []
  }
}

export async function getGoogleEvents(
  accessToken: string,
  refreshToken: string | undefined,
  startDate: string,
  endDate: string,
  calendarId: string = 'primary'
): Promise<GoogleEvent[]> {
  try {
    const calendar = createCalendarClient(accessToken, refreshToken)
    
    const response = await calendar.events.list({
      calendarId,
      timeMin: startDate,
      timeMax: endDate,
      singleEvents: true,
      orderBy: 'startTime'
    })

    return response.data.items?.map(event => ({
      id: event.id!,
      title: event.summary || 'No Title',
      description: event.description,
      start: event.start?.dateTime || event.start?.date!,
      end: event.end?.dateTime || event.end?.date!,
      allDay: !event.start?.dateTime
    })) || []
  } catch (error) {
    console.error('Error fetching Google events:', error)
    return []
  }
}

export async function createGoogleEvent(
  accessToken: string,
  refreshToken: string | undefined,
  event: Omit<GoogleEvent, 'id'>,
  calendarId: string = 'primary'
): Promise<GoogleEvent> {
  const calendar = createCalendarClient(accessToken, refreshToken)
  
  const response = await calendar.events.insert({
    calendarId,
    requestBody: {
      summary: event.title,
      description: event.description,
      start: event.allDay ? { date: event.start.split('T')[0] } : { dateTime: event.start },
      end: event.allDay ? { date: event.end.split('T')[0] } : { dateTime: event.end }
    }
  })

  return {
    id: response.data.id!,
    title: response.data.summary!,
    description: response.data.description,
    start: response.data.start?.dateTime || response.data.start?.date!,
    end: response.data.end?.dateTime || response.data.end?.date!,
    allDay: !response.data.start?.dateTime
  }
}

export async function updateGoogleEvent(
  accessToken: string,
  refreshToken: string | undefined,
  eventId: string,
  event: Partial<Omit<GoogleEvent, 'id'>>,
  calendarId: string = 'primary'
): Promise<GoogleEvent> {
  const calendar = createCalendarClient(accessToken, refreshToken)
  
  const response = await calendar.events.update({
    calendarId,
    eventId,
    requestBody: {
      summary: event.title,
      description: event.description,
      start: event.allDay && event.start ? { date: event.start.split('T')[0] } : event.start ? { dateTime: event.start } : undefined,
      end: event.allDay && event.end ? { date: event.end.split('T')[0] } : event.end ? { dateTime: event.end } : undefined
    }
  })

  return {
    id: response.data.id!,
    title: response.data.summary!,
    description: response.data.description,
    start: response.data.start?.dateTime || response.data.start?.date!,
    end: response.data.end?.dateTime || response.data.end?.date!,
    allDay: !response.data.start?.dateTime
  }
}

export async function deleteGoogleEvent(
  accessToken: string,
  refreshToken: string | undefined,
  eventId: string,
  calendarId: string = 'primary'
): Promise<void> {
  const calendar = createCalendarClient(accessToken, refreshToken)
  await calendar.events.delete({ calendarId, eventId })
}

export async function refreshGoogleToken(refreshToken: string) {
  const oauth2Client = createGoogleAuth()
  oauth2Client.setCredentials({ refresh_token: refreshToken })
  
  const { credentials } = await oauth2Client.refreshAccessToken()
  return credentials
}
