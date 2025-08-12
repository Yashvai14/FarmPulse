import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          phone?: string
          location?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          phone?: string
          location?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          phone?: string
          location?: string
          updated_at?: string
        }
      }
      crop_suggestions: {
        Row: {
          id: string
          user_id: string
          location: string
          soil_type: string
          month: string
          water_source: string
          experience: string
          budget: string
          crop_type: string
          suggestions: any
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          location: string
          soil_type: string
          month: string
          water_source: string
          experience: string
          budget: string
          crop_type: string
          suggestions: any
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          location?: string
          soil_type?: string
          month?: string
          water_source?: string
          experience?: string
          budget?: string
          crop_type?: string
          suggestions?: any
        }
      }
    }
  }
}