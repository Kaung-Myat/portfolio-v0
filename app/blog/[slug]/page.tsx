import { getAllPosts, getPostBySlug } from '@/lib/blog';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BlogViewTracker } from '@/components/blog-view-tracker';
import { BlogReactions } from '@/components/blog-reactions';
import { Eye } from 'lucide-react';
import type { Metadata } from 'next';

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const [viewsResult, reactionsResult] = await Promise.all([
    supabase
      .from('blog_views')
      .select('view_count')
      .eq('post_slug', params.slug)
      .maybeSingle(),
    supabase
      .from('blog_reactions')
      .select('like_count, love_count, celebrate_count')
      .eq('post_slug', params.slug)
      .maybeSingle(),
  ]);

  const viewCount = viewsResult.data?.view_count || 0;
  const reactions = reactionsResult.data || {
    like_count: 0,
    love_count: 0,
    celebrate_count: 0,
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    keywords: post.tags.join(', '),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <header className="space-y-4 mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <time dateTime={post.date}>{format(new Date(post.date), 'MMMM d, yyyy')}</time>
              <span>•</span>
              <span>By {post.author}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{viewCount} views</span>
              </div>
            </div>
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </header>

          <Separator className="my-8" />

          <div className="relative prose prose-neutral dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-a:text-primary prose-code:text-primary prose-pre:bg-muted prose-img:rounded-lg">
            <BlogViewTracker slug={params.slug} />
            <MDXRemote source={post.content} />
          </div>

          <Separator className="my-8" />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">What did you think of this post?</h3>
            <BlogReactions
              slug={params.slug}
              initialLikes={reactions.like_count}
              initialLoves={reactions.love_count}
              initialCelebrates={reactions.celebrate_count}
            />
          </div>
        </div>
      </article>
    </>
  );
}
