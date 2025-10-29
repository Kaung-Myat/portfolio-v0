import { getGitHubRepos } from '@/lib/github';
import { GitHubContributionGraph } from '@/components/github-contribution-graph';
import { GitHubRepos } from '@/components/github-repos';

const GITHUB_USERNAME = 'Kaung-Myat';

export const revalidate = 3600;

export default async function Home() {
  const repos = await getGitHubRepos(GITHUB_USERNAME);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Kaung Mrat Thu',
    url: 'https://kaungmratthu.com',
    jobTitle: 'Full-Stack Developer',
    description:
      'Full-stack developer and software engineer specializing in modern web technologies.',
    sameAs: [
      'https://github.com/yourusername',
      'https://linkedin.com/in/yourusername',
      'https://twitter.com/yourtwitterhandle',
    ],
    knowsAbout: [
      'JavaScript',
      'TypeScript',
      'React',
      'Next.js',
      'Node.js',
      'Web Development',
      'Software Engineering',
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        <section className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Kaung Mrat Thu
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Full-Stack Developer & Software Engineer
          </p>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
            Passionate about building modern web applications with cutting-edge technologies.
            Specializing in React, Next.js, TypeScript, and Node.js.
          </p>
        </section>

        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold">GitHub Activity</h2>
            <p className="text-muted-foreground">
              My contribution graph and open-source activity
            </p>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-4xl">
              <GitHubContributionGraph username={GITHUB_USERNAME} />
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold">Projects</h2>
            <p className="text-muted-foreground">
              Automatically updated from my GitHub repositories
            </p>
          </div>
          <GitHubRepos repos={repos} />
        </section>
      </div>
    </>
  );
}
