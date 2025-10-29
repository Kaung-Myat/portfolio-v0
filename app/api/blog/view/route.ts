import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { slug } = await request.json();

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const { error } = await supabase.rpc('increment_view_count', { slug });

    if (error) {
      console.error('Error incrementing view count:', error);
      return NextResponse.json({ error: 'Failed to increment view count' }, { status: 500 });
    }

    const { data, error: fetchError } = await supabase
      .from('blog_views')
      .select('view_count')
      .eq('post_slug', slug)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching view count:', fetchError);
    }

    return NextResponse.json({ view_count: data?.view_count || 1 });
  } catch (error) {
    console.error('Error in view API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
