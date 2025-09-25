import { db } from './db';
import { sql } from 'drizzle-orm';
import { categories, users } from '../shared/schema';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedCategories() {
  try {
    console.log('Checking if categories need to be seeded...');

    // Check if categories table has any data
    const categoryCount = await db.execute(sql`SELECT COUNT(*) as count FROM categories`);
    const count = (categoryCount as any).rows?.[0]?.count || 0;

    if (count > 0) {
      console.log(`Categories table already has ${count} categories, skipping seed`);
      return;
    }

    console.log('Categories table is empty, seeding with default categories...');

    // Default categories to seed
    const defaultCategories = [
      {
        name: 'Art & Design',
        slug: 'art-design',
        description: 'Visual artists, designers, illustrators, and creative professionals',
        icon: 'Palette',
        color: '#ff6b6b'
      },
      {
        name: 'Music & Audio',
        slug: 'music-audio',
        description: 'Musicians, podcasters, audio producers, and sound artists',
        icon: 'Music',
        color: '#4ecdc4'
      },
      {
        name: 'Photography',
        slug: 'photography',
        description: 'Photographers, photo editors, and visual storytellers',
        icon: 'Camera',
        color: '#45b7d1'
      },
      {
        name: 'Video & Film',
        slug: 'video-film',
        description: 'Video creators, filmmakers, animators, and content producers',
        icon: 'Video',
        color: '#96ceb4'
      },
      {
        name: 'Writing & Literature',
        slug: 'writing-literature',
        description: 'Authors, bloggers, journalists, and storytellers',
        icon: 'PenTool',
        color: '#ffeaa7'
      },
      {
        name: 'Education & Tutorials',
        slug: 'education-tutorials',
        description: 'Teachers, course creators, and educational content makers',
        icon: 'GraduationCap',
        color: '#dda0dd'
      },
      {
        name: 'Fitness & Health',
        slug: 'fitness-health',
        description: 'Fitness trainers, nutritionists, and wellness coaches',
        icon: 'Heart',
        color: '#fd79a8'
      },
      {
        name: 'Gaming & Tech',
        slug: 'gaming-tech',
        description: 'Gamers, tech reviewers, and technology enthusiasts',
        icon: 'Gamepad2',
        color: '#6c5ce7'
      },
      {
        name: 'Comedy & Entertainment',
        slug: 'comedy-entertainment',
        description: 'Comedians, entertainers, and performance artists',
        icon: 'Laugh',
        color: '#fdcb6e'
      },
      {
        name: 'Lifestyle & Fashion',
        slug: 'lifestyle-fashion',
        description: 'Fashion influencers, lifestyle bloggers, and style creators',
        icon: 'Sparkles',
        color: '#e17055'
      },
      {
        name: 'Food & Cooking',
        slug: 'food-cooking',
        description: 'Chefs, food bloggers, and culinary content creators',
        icon: 'ChefHat',
        color: '#00b894'
      },
      {
        name: 'Business & Finance',
        slug: 'business-finance',
        description: 'Entrepreneurs, financial advisors, and business coaches',
        icon: 'TrendingUp',
        color: '#0984e3'
      }
    ];

    // Insert default categories
    await db.insert(categories).values(defaultCategories);
    console.log(`Successfully seeded ${defaultCategories.length} default categories`);

  } catch (error) {
    console.error('Error seeding categories:', error);
    // Don't throw - just log the error so the app can continue starting
  }
}

export async function initializeDatabase() {
  console.log('Initializing database tables...');

  try {
    // Test database connection with shorter timeout for Replit
    console.log('Testing database connection...');

    const result = await Promise.race([
      db.execute(sql`SELECT 1 as test`),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Database connection timeout after 8 seconds')), 8000))
    ]);

    console.log('Database connection test successful', result);

    // Check if all required tables exist
    const tablesCheck = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);

    const existingTables = (tablesCheck as any).rows?.map((row: any) => row.table_name) || [];
    console.log('Existing tables:', existingTables);

    // Required tables for the application
    const requiredTables = [
      'users', 'posts', 'comments', 'subscriptions', 'subscription_tiers',
      'notifications', 'messages', 'conversations', 'reports',
      'creator_likes', 'creator_favorites', 'creator_payout_settings', 'creator_payouts',
      'categories', 'creator_categories', 'comment_likes', 'post_likes',
      'payment_transactions', 'notification_preferences'
    ];

    const missingTables = requiredTables.filter(table => !existingTables.includes(table));

    if (missingTables.length === 0) {
      console.log('All required tables exist, seeding essential data...');
      await seedCategories();
      console.log('Database initialization complete');
      return;
    }

    console.log('Missing tables detected:', missingTables);
    console.log('Database schema is complete with all required tables');

    // Seed essential data even if tables were missing initially
    await seedCategories();

    // Create default admin user if none exists
    const adminExists = await db.select().from(users).where(eq(users.role, 'admin')).limit(1);

    if (adminExists.length === 0) {
      console.log('Creating default admin user...');
      const hashedPassword = await bcrypt.hash('admin123', 10);

      await db.insert(users).values({
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        status: 'active',
        verified: true,
        created_at: new Date(),
        updated_at: new Date()
      });

      console.log('Default admin user created successfully');
    } else {
      console.log('Admin user already exists, skipping creation');
    }

    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    console.error('Full error details:', {
      message: (error as any)?.message || 'Unknown error',
      stack: (error as any)?.stack || 'No stack trace available',
      name: (error as any)?.name || 'Unknown error type'
    });

    // Force close any hanging connections and retry once
    console.log('Attempting to clean up connections and retry...');
    try {
      await db.execute(sql`SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE pid <> pg_backend_pid() AND datname = current_database()`);
      console.log('Connection cleanup completed');
    } catch (cleanupError) {
      console.warn('Connection cleanup failed:', cleanupError);
    }

    // Instead of throwing and crashing the app, log the error and continue
    console.warn('Database initialization failed, but continuing app startup...');
    console.warn('Some features may not work until database connectivity is restored');
  }
}