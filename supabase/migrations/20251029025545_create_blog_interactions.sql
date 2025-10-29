/*
  # Blog Interactions Schema

  ## Overview
  This migration creates the tables needed for blog post interactions:
  tracking views and reactions for each blog post.

  ## New Tables

  ### `blog_views`
  Tracks the number of views for each blog post.
  - `post_slug` (text, primary key): URL slug of the blog post
  - `view_count` (integer): Total number of views
  - `created_at` (timestamptz): When the record was created
  - `updated_at` (timestamptz): When the record was last updated

  ### `blog_reactions`
  Tracks different types of reactions for each blog post.
  - `post_slug` (text, primary key): URL slug of the blog post
  - `like_count` (integer): Number of 👍 reactions
  - `love_count` (integer): Number of ❤️ reactions
  - `celebrate_count` (integer): Number of 🎉 reactions
  - `created_at` (timestamptz): When the record was created
  - `updated_at` (timestamptz): When the record was last updated

  ## Security
  - Enable RLS on both tables
  - Allow anonymous users to read all records (public data)
  - No direct insert/update allowed (will use Edge Functions for incrementing)
*/

-- Create blog_views table
CREATE TABLE IF NOT EXISTS blog_views (
  post_slug text PRIMARY KEY,
  view_count integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create blog_reactions table
CREATE TABLE IF NOT EXISTS blog_reactions (
  post_slug text PRIMARY KEY,
  like_count integer DEFAULT 0 NOT NULL,
  love_count integer DEFAULT 0 NOT NULL,
  celebrate_count integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE blog_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_reactions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read view counts and reactions (public data)
CREATE POLICY "Anyone can read blog views"
  ON blog_views FOR SELECT
  USING (true);

CREATE POLICY "Anyone can read blog reactions"
  ON blog_reactions FOR SELECT
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_views_post_slug ON blog_views(post_slug);
CREATE INDEX IF NOT EXISTS idx_blog_reactions_post_slug ON blog_reactions(post_slug);

-- Create function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(slug text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO blog_views (post_slug, view_count, updated_at)
  VALUES (slug, 1, now())
  ON CONFLICT (post_slug)
  DO UPDATE SET
    view_count = blog_views.view_count + 1,
    updated_at = now();
END;
$$;

-- Create function to increment reaction count
CREATE OR REPLACE FUNCTION increment_reaction_count(slug text, reaction_type text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF reaction_type = 'like' THEN
    INSERT INTO blog_reactions (post_slug, like_count, updated_at)
    VALUES (slug, 1, now())
    ON CONFLICT (post_slug)
    DO UPDATE SET
      like_count = blog_reactions.like_count + 1,
      updated_at = now();
  ELSIF reaction_type = 'love' THEN
    INSERT INTO blog_reactions (post_slug, love_count, updated_at)
    VALUES (slug, 1, now())
    ON CONFLICT (post_slug)
    DO UPDATE SET
      love_count = blog_reactions.love_count + 1,
      updated_at = now();
  ELSIF reaction_type = 'celebrate' THEN
    INSERT INTO blog_reactions (post_slug, celebrate_count, updated_at)
    VALUES (slug, 1, now())
    ON CONFLICT (post_slug)
    DO UPDATE SET
      celebrate_count = blog_reactions.celebrate_count + 1,
      updated_at = now();
  END IF;
END;
$$;