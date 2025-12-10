
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fvmiegxwvqzuxjcdhmhe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2bWllZ3h3dnF6dXhqY2RobWhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNzA4NzAsImV4cCI6MjA4MDk0Njg3MH0.1Hu4bP6Pll_hB-xQMQpILQ6NypazU1imwPNh2hxNIQI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    // We try to fetch the server time or just make a lightweight call
    // Since we might not have tables, we can check health simply by ensuring the client initialized
    // A robust check involves a query, but without guaranteed tables, we'll try a harmless one.
    // If we can't select from a table, checking auth session is a decent proxy for network reachability.
    
    const { error } = await supabase.from('random_table_check').select('*').limit(1);
    
    // If the error is "relation does not exist", we still connected successfully to the DB engine.
    // If the error is network related, it will be different.
    if (error && error.code === 'PGRST204') { // undefined_table
       return true; // We reached the server!
    }
    if (error && error.message.includes('FetchError')) {
        return false;
    }
    
    return true; 
  } catch (e) {
    console.error("Supabase connection check failed", e);
    return false;
  }
};
