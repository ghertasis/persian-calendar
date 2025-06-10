import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Main Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Service role client for admin operations
export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Function to create client (for consistency with other files)
export function createSupabaseClient() {
  return supabase
}

export function createServerSupabaseClient() {
  return supabase
}
