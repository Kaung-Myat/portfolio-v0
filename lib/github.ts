import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  created_at: string;
};

export async function getGitHubRepos(username: string): Promise<GitHubRepo[]> {
  try {
    const { data } = await octokit.repos.listForUser({
      username,
      type: 'all',
      sort: 'updated',
      per_page: 100,
    });

    return data.map((repo) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      html_url: repo.html_url,
      homepage: repo.homepage || null,
      stargazers_count: repo.stargazers_count || 0,
      language: repo.language || null,
      topics: repo.topics || [],
      updated_at: repo.updated_at || '',
      created_at: repo.created_at || '',
    }));
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    return [];
  }
}

export function getGitHubContributionGraphUrl(username: string): string {
  return `https://ghchart.rshah.org/${username}`;
}
