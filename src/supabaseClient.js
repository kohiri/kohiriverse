import { createClient as createSupabaseClient } from './utils/supabase/client'

// Initialize the client once and export it
const clientInstance = createSupabaseClient()

// Ensure we don't crash if keys are still missing
export const supabase = (clientInstance.supabaseUrl && clientInstance.supabaseKey) 
  ? clientInstance 
  : null
