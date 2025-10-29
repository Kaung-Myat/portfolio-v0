import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type BlogView = {
  post_slug: string;
  view_count: number;
  created_at: string;
  updated_at: string;
};

export type BlogReaction = {
  post_slug: string;
  like_count: number;
  love_count: number;
  celebrate_count: number;
  created_at: string;
  updated_at: string;
};
