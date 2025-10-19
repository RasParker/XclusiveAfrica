import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

console.log('Using Supabase PostgreSQL database');

// Important: Disable prepare for Supabase Transaction pooling mode
export const client = postgres(process.env.DATABASE_URL, { 
  prepare: false,
  max: 5, // Connection pool size
  idle_timeout: 30, // 30 seconds
  connect_timeout: 10, // 10 seconds
});

// Export as pool for backward compatibility with existing code
export const pool = client;

export const db = drizzle(client, { schema });

// Add graceful shutdown handler for database client
process.on('SIGINT', async () => {
  console.log('Closing database connection...');
  await client.end();
  console.log('Database connection closed');
});

process.on('SIGTERM', async () => {
  console.log('Closing database connection...');
  await client.end();
  console.log('Database connection closed');
});

console.log('Database setup completed successfully');
