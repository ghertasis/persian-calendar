export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          google_refresh_token: string | null
          google_access_token: string | null
          default_calendar_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          google_refresh_token?: string | null
          google_access_token?: string | null
          default_calendar_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          google_refresh_token?: string | null
          google_access_token?: string | null
          default_calendar_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          start_date: string
          end_date: string
          shamsi_date: string | null
          is_all_day: boolean
          color: string
          google_event_id: string | null
          calendar_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          start_date: string
          end_date: string
          shamsi_date?: string | null
          is_all_day?: boolean
          color?: string
          google_event_id?: string | null
          calendar_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          start_date?: string
          end_date?: string
          shamsi_date?: string | null
          is_all_day?: boolean
          color?: string
          google_event_id?: string | null
          calendar_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      holidays: {
        Row: {
          id: string
          title: string
          shamsi_date: string
          gregorian_date: string
          is_official: boolean
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          shamsi_date: string
          gregorian_date: string
          is_official?: boolean
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          shamsi_date?: string
          gregorian_date?: string
          is_official?: boolean
          description?: string | null
          created_at?: string
        }
      }
    }
  }
}

// Helper types
export type User = Database['public']['Tables']['users']['Row']
export type Event = Database['public']['Tables']['events']['Row']
export type Holiday = Database['public']['Tables']['holidays']['Row']
