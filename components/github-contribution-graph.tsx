'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Skeleton } from './ui/skeleton';

type GitHubContributionGraphProps = {
  username: string;
};

export function GitHubContributionGraph({ username }: GitHubContributionGraphProps) {
  const [loading, setLoading] = useState(true);
  const graphUrl = `https://ghchart.rshah.org/${username}`;

  return (
    <div className="w-full overflow-x-auto">
      {loading && (
        <Skeleton className="h-32 w-full" />
      )}
      <img
        src={graphUrl}
        alt={`${username}'s GitHub contribution graph`}
        className="w-full h-auto"
        onLoad={() => setLoading(false)}
        style={{ display: loading ? 'none' : 'block' }}
      />
    </div>
  );
}
