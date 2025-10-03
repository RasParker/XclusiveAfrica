# Xclusive Creator Platform

## Overview
This is a full-stack creator platform application that allows content creators to monetize their content through subscriptions and fan interactions. The platform includes features for creators to manage content, tiers, earnings, and interact with fans, while fans can subscribe, access exclusive content, and message creators.

## Architecture
- **Frontend**: React with TypeScript, using Vite for development and building
- **Backend**: Express.js with TypeScript
- **Database**: Supabase PostgreSQL with Drizzle ORM and postgres-js client
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query (React Query)
- **Authentication**: Custom JWT-based authentication
- **File Uploads**: Multer for handling media uploads
- **Payment Processing**: Stripe integration
- **Real-time Features**: WebSocket support for notifications and messaging

## Project Structure
```
├── client/           # React frontend
│   ├── src/
│   │   ├── components/   # React components organized by feature
│   │   ├── pages/       # Page components
│   │   ├── lib/         # Utilities and shared functions
│   │   └── types/       # TypeScript type definitions
├── server/           # Express backend
│   ├── routes/       # API route handlers
│   ├── services/     # Business logic services
│   └── middleware/   # Express middleware
├── shared/          # Shared types and schemas
└── migrations/      # Database migration files
```

## Key Features
- **Multi-role System**: Admin, Creator, and Fan roles with different permissions
- **Content Management**: Creators can create posts with different access tiers
- **Subscription System**: Tiered subscriptions with different access levels
- **Real-time Messaging**: Direct messaging between fans and creators
- **Payment Processing**: Stripe integration for subscriptions and tips
- **Analytics Dashboard**: Revenue and engagement analytics for creators
- **Admin Panel**: User management, content moderation, and platform analytics
- **Mobile-responsive Design**: Optimized for both desktop and mobile devices

## Development Setup
The project is configured to run on Replit with:
- **Port 5000**: Single port serving both frontend and backend
- **Host Configuration**: Properly configured for Replit proxy with `allowedHosts: true`
- **Database**: Supabase PostgreSQL with auto-initialization and seeding
- **Environment**: DATABASE_URL secret managed via Replit Secrets
- **Hot Module Replacement**: Vite HMR disabled (set to `hmr: false`) to prevent WebSocket connection errors in Replit's proxy environment

## Database
- **Provider**: Supabase PostgreSQL (managed cloud database)
- **Connection**: Uses postgres-js client with `prepare: false` for Supabase transaction pooling
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: 25 tables including users, posts, subscriptions, payments, categories, etc.
- **Seeding**: Automatic seeding with 12 default content categories
- **Admin User**: Pre-configured admin account
  - Username: `admin`
  - Email: `admin@example.com`
  - Password: `admin123`

### Database Management Commands
- `npm run db:push` - Push schema changes to Supabase
- `npx drizzle-kit studio` - Open Drizzle Studio for database visualization

## Recent Changes
- **2025-10-03: Project import successfully completed and fully operational**
  - Workflow configured with webview output type on port 5000
  - Application verified working: login page, explore page, and routing functional
  - Deployment configuration set for autoscale with proper build and start commands
  - Enhanced .gitignore to exclude test files (cookies.txt, test-payment.js)
  - All services (monitoring, cron jobs, WebSocket) properly initialized
  - Frontend and backend integration verified and working
  - Vite configuration confirmed: allowedHosts: true, host: 0.0.0.0, hmr: false
  - Database connection verified with Supabase PostgreSQL
  
- **2025-10-01: Migrated to Supabase PostgreSQL database**
  - Replaced node-postgres (pg Pool) with postgres-js client for Supabase compatibility
  - Configured `prepare: false` for Supabase transaction pooling mode
  - Updated raw SQL queries to use postgres-js `.unsafe()` method
  - Fixed database initialization to handle postgres-js result format (direct arrays)
  - All 25 tables successfully migrated and verified in Supabase
  - Fixed duplicate key error in category seeding logic
  - Admin user and 12 default categories seeded successfully
  - Application tested and confirmed working with Supabase

## Deployment
- Configured for Replit autoscale deployment
- Build process: `npm run build` (builds both frontend and backend)
- Production start: `npm run start` (serves optimized production build)
- Environment variables properly configured for database connection

## User Preferences
- Development workflow: Use `npm run dev` for development with hot reload
- Database management: Use `npm run db:push` for schema changes
- Code style: TypeScript with proper type definitions throughout