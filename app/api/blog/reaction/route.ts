import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { slug, reaction } = await request.json();

    if (!slug || !reaction) {
      return NextResponse.json(
        { error: 'Slug and reaction are required' },
        { status: 400 }
      );
    }

    if (!['like', 'love', 'celebrate'].includes(reaction)) {
      return NextResponse.json({ error: 'Invalid reaction type' }, { status: 400 });
    }

    const { error } = await supabase.rpc('increment_reaction_count', {
      slug,
      reaction_type: reaction,
    });

    if (error) {
      console.error('Error incrementing reaction count:', error);
      return NextResponse.json(
        { error: 'Failed to increment reaction count' },
        { status: 500 }
      );
    }

    const { data, error: fetchError } = await supabase
      .from('blog_reactions')
      .select('like_count, love_count, celebrate_count')
      .eq('post_slug', slug)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching reaction counts:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch reaction counts' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      data || { like_count: 0, love_count: 0, celebrate_count: 0 }
    );
  } catch (error) {
    console.error('Error in reaction API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
