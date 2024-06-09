import { createClient } from '@supabase/supabase-js'
import { Database } from './supabase'

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(
  import.meta.env.VITE_HOST,
  import.meta.env.VITE_PUBLIC_KEY
)
