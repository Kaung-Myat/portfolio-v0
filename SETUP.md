# Portfolio & Blog Setup Guide for Kaung Mrat Thu

This guide explains how to configure and deploy your SEO-optimized portfolio and blog website.

## Prerequisites

- Node.js 18+ installed
- A GitHub account
- Your project deployed (Vercel recommended)

## 1. GitHub Configuration

### Get Your GitHub Username

Replace `'yourusername'` in `/app/page.tsx` with your actual GitHub username:

```typescript
const GITHUB_USERNAME = 'your-actual-username';
```

### Optional: GitHub Personal Access Token

For higher API rate limits and private repo access, create a token:

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `public_repo` scope
3. Add to your `.env` file:

```env
GITHUB_TOKEN=your_github_token_here
```

## 2. Update Personal Information

### Update Links in Footer

Edit `/components/footer.tsx`:

```typescript
<Link href="https://github.com/your-actual-username" ...>
<Link href="https://linkedin.com/in/your-linkedin-username" ...>
<Link href="mailto:your.email@example.com" ...>
```

### Update Social Links in Homepage

Edit `/app/page.tsx` in the JSON-LD section:

```typescript
sameAs: [
  'https://github.com/your-actual-username',
  'https://linkedin.com/in/your-linkedin-username',
  'https://twitter.com/your-twitter-handle',
],
```

### Update Twitter Handle

Edit `/app/layout.tsx`:

```typescript
twitter: {
  card: 'summary_large_image',
  title: 'Kaung Mrat Thu - Full-Stack Developer & Software Engineer',
  description: '...',
  creator: '@your-actual-twitter-handle',
},
```

### Update Domain Name

Replace `kaungmratthu.com` with your actual domain in:
- `/app/layout.tsx` (line 11)
- `/app/page.tsx` (JSON-LD url)
- `/app/sitemap.ts` (all URLs)
- `/app/robots.ts` (sitemap URL)

## 3. Supabase Configuration

Your Supabase database is already configured with:
- `blog_views` table for tracking post views
- `blog_reactions` table for like/love/celebrate reactions
- Row Level Security (RLS) enabled
- PostgreSQL functions for incrementing counts

No additional setup needed for Supabase!

## 4. Creating Blog Posts

### File Location

All blog posts go in `/content/blog/` directory.

### File Format

Create `.mdx` or `.md` files with frontmatter:

```mdx
---
title: "Your Blog Post Title"
date: "2024-03-15"
description: "A brief description of your post for SEO"
author: "Kaung Mrat Thu"
tags: ["tag1", "tag2", "tag3"]
---

# Your Blog Post Title

Your content here...

## Headings work great

- Lists are supported
- Code blocks too

\`\`\`typescript
const example = "TypeScript code";
\`\`\`
```

### Automatic Features

When you add a new blog post:
- It appears automatically on `/blog`
- It gets its own page at `/blog/your-post-slug`
- View tracking activates when users scroll to 50% of the post
- Reaction buttons appear at the bottom
- Sitemap updates automatically
- SEO metadata is generated automatically

## 5. GitHub Integration Features

### Automatic Project Updates

The homepage automatically:
- Fetches your public GitHub repositories every hour (ISR with 3600s revalidation)
- Displays repo name, description, topics, language, and stars
- Updates when you create new repos (after revalidation period)

### Contribution Graph

The GitHub contribution graph displays automatically using the ghchart.rshah.org service.

## 6. SEO Strategy for "Kaung Mrat Thu"

### On-Page SEO (Already Implemented)

1. **Homepage Optimization**
   - Title: "Kaung Mrat Thu - Full-Stack Developer & Software Engineer"
   - Your name appears multiple times naturally
   - Semantic HTML with proper heading hierarchy

2. **Structured Data (JSON-LD)**
   - Person schema on homepage
   - Article schema on blog posts
   - Helps Google understand your identity

3. **Meta Tags**
   - Open Graph for social sharing
   - Twitter Cards
   - Comprehensive keywords

4. **Technical SEO**
   - Automatic sitemap generation at `/sitemap.xml`
   - Robots.txt at `/robots.txt`
   - Mobile-responsive design
   - Fast loading with Next.js optimizations

### Off-Page SEO Recommendations

1. **Social Media Presence**
   - Keep your GitHub profile updated
   - Link to your portfolio from LinkedIn
   - Use "Kaung Mrat Thu" consistently across platforms

2. **Content Strategy**
   - Write blog posts regularly (1-2 per month minimum)
   - Use your name in author bylines
   - Create high-quality, technical content

3. **Backlinks**
   - Link to your portfolio from your GitHub profile
   - Add your site to your social media bios
   - Comment on relevant technical blogs with your name

4. **Schema Markup**
   - Already implemented JSON-LD for Person and BlogPosting
   - Google will index this structured data

### Monitoring SEO Performance

Use these tools to track your progress:
- Google Search Console (submit your sitemap)
- Google Analytics (track visitors)
- Search for "Kaung Mrat Thu" regularly to monitor rankings

## 7. Responsive Design Details

### Mobile-First Approach

All components are built mobile-first using Tailwind CSS breakpoints:
- Base styles: Mobile (< 640px)
- `sm:` Tablet (≥ 640px)
- `md:` Small laptop (≥ 768px)
- `lg:` Desktop (≥ 1024px)

### Key Responsive Features

1. **Navigation**
   - Desktop: Horizontal menu with theme toggle
   - Mobile: Hamburger menu with slide-down menu

2. **GitHub Contribution Graph**
   - Horizontally scrollable on mobile
   - Full width on desktop

3. **Project Grid**
   - 1 column on mobile
   - 2 columns on tablet (`sm:grid-cols-2`)
   - 3 columns on desktop (`lg:grid-cols-3`)

4. **Typography**
   - Heading sizes scale: `text-4xl sm:text-5xl lg:text-6xl`
   - Body text remains readable at all sizes

5. **Blog Posts**
   - Prose styles adapt to screen size
   - Code blocks scroll horizontally on mobile
   - Images are responsive with proper aspect ratios

## 8. Dark/Light Mode

Theme toggle is in the navigation bar. The theme:
- Persists across page loads (localStorage)
- Defaults to system preference
- Applies to all components (Tailwind CSS dark mode)

## 9. Blog Features Deep Dive

### View Tracking (Scroll-to-Middle Logic)

The view tracker:
1. Uses Intersection Observer API
2. Triggers when user scrolls to 50% of post
3. Only counts once per session (sessionStorage)
4. Sends POST to `/api/blog/view`
5. Updates `blog_views` table in Supabase

### Reaction System

Users can react with:
- 👍 Like
- ❤️ Love
- 🎉 Celebrate

Features:
- Optimistic UI updates
- Prevents duplicate reactions (localStorage)
- Stores reaction state per post
- Updates `blog_reactions` table via `/api/blog/reaction`

## 10. Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Vercel auto-detects Next.js
4. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL` (already in .env)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (already in .env)
   - `GITHUB_TOKEN` (optional, for higher API limits)

5. Deploy!

### Custom Domain

1. Add your domain in Vercel project settings
2. Update DNS records as instructed
3. Update all URLs in the code (see Step 2 above)

## 11. Performance Tips

- Images: Use Next.js `Image` component for automatic optimization
- Fonts: Already optimized with `next/font`
- ISR: Homepage revalidates every hour to stay fresh
- Static generation: Blog posts are pre-rendered at build time

## 12. Future Enhancements

Consider adding:
- Newsletter signup (Supabase + email service)
- Search functionality for blog posts
- Comments section (Supabase + authentication)
- Blog post series/categories
- RSS feed for blog
- More detailed analytics

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify environment variables are set
3. Check Supabase dashboard for database issues
4. Review build logs in Vercel

---

Built with Next.js 13, Tailwind CSS, Supabase, and deployed on Vercel.
