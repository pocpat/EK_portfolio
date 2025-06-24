import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://emhnpriaazezcpgoyayy.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

if (!supabaseKey) {
  console.error('Supabase key is missing. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);