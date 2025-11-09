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
- **2025-11-09: Implemented consistent locked content UI across Feed and VideoWatch pages**
  - **Goal**: Ensure locked content displays with consistent visual design across the platform
  - **Changes Made**:
    - **Created LockedContentOverlay Component**: Reusable component matching Feed page design with blurred thumbnail background, frosted glass gradient overlay (from-black/50 via-black/40 to-black/60), backdrop-blur-xl, animated lock icon with pulse effect, tier badge, and shimmer CTA button
    - **Updated VideoWatch Video Player**: Conditionally renders LockedContentOverlay when `hasAccess = false` on both mobile and desktop views
    - **Updated "Up Next" Section**: Video cards display locked overlay for inaccessible content, showing tier badge and encouraging upgrades
    - **Fixed Access Logic for Logged-Out Users**: Updated `fetchNextVideos` to properly handle public content when `has_access` field is missing (falls back to tier-based inference: public tier = accessible)
  - **Design Pattern**: Uses "showcase approach" - users see premium content exists with locked overlay to drive conversions, rather than hiding it completely
  - **Access Control**: When logged in, uses personalized feed endpoint's `has_access` flag; when logged out, infers access from tier (public = true, others = false)
  - **Architect Review**: Approved - consistent UI implementation, correct access control for both authenticated and guest flows, no security issues
  - **Testing**: Verified public videos show unlocked for logged-out users, premium videos show locked overlay with correct tier badges and unlock CTAs

- **2025-11-09: Fixed VideoWatch page access control with complete content gating**
  - **Issue**: Users could access VIP Elite tier videos without proper subscription - video player, comments, and interactions were exposed
  - **Root Cause**: VideoWatch page calculated `hasAccess` correctly but didn't use it to gate video player, comments, or interactions
  - **Complete Fix Implemented**:
    - **Video Player**: Conditionally renders locked overlay (blurred thumbnail, lock icon, tier badge, "Subscribe to Unlock" CTA) when `hasAccess = false`
    - **Interactive Controls**: Like, comment, share buttons disabled when `hasAccess = false`
    - **Comments Gating**: Mobile comments container shows locked state; mobile Sheet and desktop CommentSection only render when `hasAccess = true` (prevents unauthorized API calls)
    - **Subscription Modal Integration**: "Subscribe to Unlock" button opens SubscriptionTierModal instead of navigating to profile, complete flow: Subscribe → Tier selection → Payment modal → Checkout
  - **Tier Hierarchy**: Uses same 3-level system as feed endpoint (Level 1: Supporter/Starter Pump, Level 2: Fan/Premium/Power Gains, Level 3: Superfan/Elite Beast Mode/VIP Elite)
  - **Result**: Premium content fully protected - video, comments, and interactions completely inaccessible without proper subscription tier
  - **Architect Review**: Approved - complete access control implementation with no security issues, all engagement gated end-to-end
  - **Testing**: VIP Elite post correctly shows locked state for Power Gains subscriber; no unauthorized API calls

- **2025-11-09: Implemented tier hierarchy access control for subscription-based content**
  - **Issue**: Users with higher-tier subscriptions (e.g., "Power Gains" level 2) couldn't access content from lower tiers (e.g., "Starter Pump" level 1)
  - **Root Cause**: Feed API endpoint used exact tier name matching instead of hierarchical level comparison
  - **Fix Implemented**:
    - Added `tier_hierarchy` CTE in feed endpoint SQL query that maps tier names to numeric levels (1-3)
    - **Level 1**: 'supporter', 'starter pump'
    - **Level 2**: 'fan', 'premium', 'power gains'
    - **Level 3**: 'superfan', 'elite beast mode', 'the vip elite'
    - Changed access check from exact match (`posts.tier = user_subscriptions.tier_name`) to level comparison (`user_subscriptions.tier_level >= post_tier.tier_level`)
    - Used LOWER() to normalize tier names for case-insensitive matching
    - Set unknown tiers to level 999 to prevent accidental access
  - **Result**: Users with higher-tier subscriptions now automatically unlock all content at their tier and below
  - **Architect Review**: Approved - tier hierarchy logic correctly implements level-based access control
  - **Future Improvements**: Consider centralizing tier hierarchy in a database table or configuration file for easier maintenance

- **2025-10-19: Fixed critical security vulnerability in feed endpoint with complete content redaction**
  - **Security Issue**: Feed endpoint was exposing premium content (text and media URLs) to unauthorized users
  - **Root Cause**: Backend returned full content/media_urls regardless of access level, relying only on frontend to hide it
  - **Complete Fix Implemented**:
    - **Followed Creators**: Public posts return full content; locked posts return placeholder text ("Exclusive content for subscribers") and NULL media_urls
    - **Subscribed Creators**: Tier-matched posts return full content; tier-mismatched posts return placeholder text ("Exclusive content for higher-tier subscribers") and NULL media_urls
    - Backend adds `has_access` boolean flag to every post indicating true access level
    - Frontend uses `has_access` flag and falls back to placeholder images when media_urls is NULL
  - **Conversion Strategy**: Feed now shows ALL posts from followed/subscribed creators (including locked) to drive FOMO and subscription conversions
  - **Visual Improvements**: Reduced blur from blur-xl to blur-md for better content teasing; changed CTA button text from black to white for readability
  - **Security Status**: Architect-reviewed and approved - no data leakage, premium content fully protected
  - **Next Steps**: Consider implementing tier hierarchy (Premium access includes Starter content) and automated API-level regression tests

- **2025-10-11: Implemented smart fan redirects based on subscription status**
  - Login flow now checks if fans have active subscriptions:
    - Fans with active subscriptions → redirected to `/fan/feed`
    - Fans with no subscriptions → redirected to `/explore` page
  - New fan signups always redirect to `/explore` (no subscriptions yet)
  - Successful payment completion redirects to `/fan/feed` (now has subscription)
  - Failed/cancelled payments and unauthorized access redirect to `/explore`
  - Uses `/api/subscriptions/fan/:fanId` endpoint to check subscription status
  - Error handling defaults to `/explore` to ensure users aren't stuck
  - Improved user experience by showing relevant content based on subscription state

- **2025-10-11: Fixed notifications page functionality**
  - Fixed delete button not working - added stopPropagation to prevent Collapsible component from capturing click events
  - Fixed "View Details" button navigation - corrected invalid action_url routes:
    - Changed `/creator/posts/${postId}` to `/creator/manage-content` for likes and comments
    - Changed `/fan/posts/${postId}` to `/fan/feed` for new posts
    - Changed `/fan/payment-methods` to `/fan/payment` for payment failures
    - Changed `/creator/payouts` to `/creator/earnings` for payout completions
  - All notification action URLs now correctly route to existing pages
  - Added proper data-testid attributes for testing

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