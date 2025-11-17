
import { db } from './db';
import { posts } from '../shared/schema';
import { like } from 'drizzle-orm';

async function deleteCorruptedPost() {
  try {
    // Find the post with the corrupted title
    const corruptedPosts = await db
      .select()
      .from(posts)
      .where(like(posts.title, '%Why You Need More Sunlight | Jack Kruse%'));

    if (corruptedPosts.length === 0) {
      console.log('No corrupted post found');
      return;
    }

    console.log(`Found ${corruptedPosts.length} corrupted post(s):`, corruptedPosts);

    // Delete the corrupted posts
    for (const post of corruptedPosts) {
      await db.delete(posts).where(like(posts.title, '%Why You Need More Sunlight | Jack Kruse%'));
      console.log(`Deleted post ID: ${post.id}, Title: ${post.title}`);
    }

    console.log('Corrupted post(s) deleted successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error deleting corrupted post:', error);
    process.exit(1);
  }
}

deleteCorruptedPost();
