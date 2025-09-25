
-- Add views_count and duration columns to posts table
ALTER TABLE posts ADD COLUMN views_count INTEGER DEFAULT 0;
ALTER TABLE posts ADD COLUMN duration INTEGER; -- duration in seconds

-- Update existing posts to have 0 views
UPDATE posts SET views_count = 0 WHERE views_count IS NULL;
