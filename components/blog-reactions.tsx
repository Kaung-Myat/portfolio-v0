'use client';

import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

type ReactionType = 'like' | 'love' | 'celebrate';

type BlogReactionsProps = {
  slug: string;
  initialLikes: number;
  initialLoves: number;
  initialCelebrates: number;
};

const reactionEmojis: Record<ReactionType, string> = {
  like: '👍',
  love: '❤️',
  celebrate: '🎉',
};

export function BlogReactions({
  slug,
  initialLikes,
  initialLoves,
  initialCelebrates,
}: BlogReactionsProps) {
  const [reactions, setReactions] = useState({
    like: initialLikes,
    love: initialLoves,
    celebrate: initialCelebrates,
  });
  const [userReactions, setUserReactions] = useState<Set<ReactionType>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(`blog-reactions-${slug}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUserReactions(new Set(parsed));
      } catch (e) {
        console.error('Failed to parse stored reactions:', e);
      }
    }
  }, [slug]);

  const handleReaction = async (type: ReactionType) => {
    if (userReactions.has(type) || isSubmitting) {
      return;
    }

    setReactions((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
    }));

    const newUserReactions = new Set(userReactions);
    newUserReactions.add(type);
    setUserReactions(newUserReactions);

    localStorage.setItem(
      `blog-reactions-${slug}`,
      JSON.stringify(Array.from(newUserReactions))
    );

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/blog/reaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug, reaction: type }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit reaction');
      }

      const data = await response.json();
      setReactions({
        like: data.like_count,
        love: data.love_count,
        celebrate: data.celebrate_count,
      });
    } catch (error) {
      console.error('Failed to submit reaction:', error);
      setReactions((prev) => ({
        ...prev,
        [type]: prev[type] - 1,
      }));
      const revertedReactions = new Set(userReactions);
      revertedReactions.delete(type);
      setUserReactions(revertedReactions);
      localStorage.setItem(
        `blog-reactions-${slug}`,
        JSON.stringify(Array.from(revertedReactions))
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {(Object.keys(reactionEmojis) as ReactionType[]).map((type) => {
        const hasReacted = userReactions.has(type);
        return (
          <Button
            key={type}
            variant={hasReacted ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleReaction(type)}
            disabled={hasReacted || isSubmitting}
            className={cn(
              'gap-2 transition-all',
              hasReacted && 'ring-2 ring-primary ring-offset-2'
            )}
          >
            <span className="text-base">{reactionEmojis[type]}</span>
            <span className="font-semibold">{reactions[type]}</span>
          </Button>
        );
      })}
    </div>
  );
}
