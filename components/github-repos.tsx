import { ExternalLink, Star } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import type { GitHubRepo } from '@/lib/github';

type GitHubReposProps = {
  repos: GitHubRepo[];
};

export function GitHubRepos({ repos }: GitHubReposProps) {
  if (repos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No repositories found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {repos.map((repo) => (
        <Card key={repo.id} className="flex flex-col hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-lg line-clamp-1">
                <Link
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  {repo.name}
                </Link>
              </CardTitle>
              <Link
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
            <CardDescription className="line-clamp-2 min-h-[2.5rem]">
              {repo.description || 'No description available.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-end">
            <div className="space-y-3">
              {repo.topics.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {repo.topics.slice(0, 5).map((topic) => (
                    <Badge key={topic} variant="secondary" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                  {repo.topics.length > 5 && (
                    <Badge variant="secondary" className="text-xs">
                      +{repo.topics.length - 5}
                    </Badge>
                  )}
                </div>
              )}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                {repo.language && <span>{repo.language}</span>}
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  <span>{repo.stargazers_count}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
