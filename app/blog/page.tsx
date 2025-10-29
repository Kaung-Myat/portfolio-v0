import { getAllPosts } from '@/lib/blog';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Technical articles, tutorials, and insights about web development, software engineering, and modern technologies by Kaung Mrat Thu.',
  openGraph: {
    title: 'Blog - Kaung Mrat Thu',
    description:
      'Technical articles, tutorials, and insights about web development and software engineering.',
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Kaung Mrat Thu Blog',
    description:
      'Technical articles and insights about web development and software engineering.',
    url: 'https://kaungmratthu.com/blog',
    author: {
      '@type': 'Person',
      name: 'Kaung Mrat Thu',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Blog</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Technical articles, tutorials, and insights about web development and software
              engineering.
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No blog posts yet. Check back soon!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        <CardTitle className="text-2xl">{post.title}</CardTitle>
                        <time
                          dateTime={post.date}
                          className="text-sm text-muted-foreground whitespace-nowrap"
                        >
                          {format(new Date(post.date), 'MMMM d, yyyy')}
                        </time>
                      </div>
                      <CardDescription className="text-base">{post.description}</CardDescription>
                    </CardHeader>
                    {post.tags.length > 0 && (
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
