import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lnypszuvtjaaghrtmnbp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxueXBzenV2dGphYWdocnRtbmJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzODU1MjAsImV4cCI6MjA2Mzk2MTUyMH0.ekVP1t1piWcJUezLGi3djg8pilNywPD_7Li6-CHEszc';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface LeaderboardEntry {
  id: string;
  player_name: string;
  credits: number;
  duiktcoins: number;
  created_at: string;
} 