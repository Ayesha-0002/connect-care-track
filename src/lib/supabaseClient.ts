import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vgblzguqbdiyufpdbaf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnYmx6Z3VxYmRpdXl1ZnBkYmFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NjE1MzksImV4cCI6MjA4ODUzNzUzOX0.QeluMXHZawrXhDMbQaCfcHCmmetphyd13LqonzK3k4k';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
