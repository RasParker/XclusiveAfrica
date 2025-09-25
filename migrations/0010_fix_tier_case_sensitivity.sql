
-- Fix tier case sensitivity in existing posts
UPDATE posts 
SET tier = 'Starter Pump' 
WHERE LOWER(tier) = 'starter pump';

UPDATE posts 
SET tier = 'Power Gains' 
WHERE LOWER(tier) = 'power gains';

UPDATE posts 
SET tier = 'Elite Beast Mode' 
WHERE LOWER(tier) = 'elite beast mode';

UPDATE posts 
SET tier = 'The VIP Elite' 
WHERE LOWER(tier) = 'the vip elite';

UPDATE posts 
SET tier = 'Supporter' 
WHERE LOWER(tier) = 'supporter';

UPDATE posts 
SET tier = 'Fan' 
WHERE LOWER(tier) = 'fan';

UPDATE posts 
SET tier = 'Premium' 
WHERE LOWER(tier) = 'premium';

UPDATE posts 
SET tier = 'Superfan' 
WHERE LOWER(tier) = 'superfan';
