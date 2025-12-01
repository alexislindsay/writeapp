import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface SavedRecipe {
  id: string;
  created_at: string;
  user_id?: string;
  title: string;
  source: string;
  url: string;
  ingredients: { text: string; checked: boolean }[];
  instructions: string[];
  prep_time?: string;
  cook_time?: string;
  servings?: string;
  notes?: string;
}
