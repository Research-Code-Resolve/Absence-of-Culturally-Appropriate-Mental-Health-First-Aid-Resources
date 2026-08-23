import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qrozgsydrcgicfpovhgg.supabase.co';
const supabaseAnonKey = 'sb_publishable_iDpHJAI0-I9czoVE3Us0Xg_BruWzrSS';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);