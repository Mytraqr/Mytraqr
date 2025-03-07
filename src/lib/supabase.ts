import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://flptqlgautsaupxfejph.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZscHRxbGdhdXRzYXVweGZlanBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzODIwMDUsImV4cCI6MjA1Njk1ODAwNX0.qeRZbd4-aRLfXW4Ap4vqLNhYXm8YJkJDk6SEQkqFh8o'

export const supabase = createClient(supabaseUrl, supabaseKey) 