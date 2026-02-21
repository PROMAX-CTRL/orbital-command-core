import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jxvkmrliaeeifpwlcwbj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4dmttcmxpYWVlaWZwd2xjd2JqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2Njk0MzYsImV4cCI6MjA4NzI0NTQzNn0.7u0wb3zmOKCB8Y-LEWdbynvX8MCYGMG446fDN4VGI1s';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
