'use client';

import { useEffect, useRef, useState } from 'react';

type BlogViewTrackerProps = {
  slug: string;
};

export function BlogViewTracker({ slug }: BlogViewTrackerProps) {
  const [hasTracked, setHasTracked] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sessionKey = `blog-view-${slug}`;
    const hasViewedInSession = sessionStorage.getItem(sessionKey);

    if (hasViewedInSession || hasTracked) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTracked) {
            setHasTracked(true);
            sessionStorage.setItem(sessionKey, 'true');

            fetch('/api/blog/view', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ slug }),
            }).catch((error) => {
              console.error('Failed to track view:', error);
            });

            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [slug, hasTracked]);

  return <div ref={contentRef} className="absolute top-1/2 left-0 w-full h-1" />;
}
