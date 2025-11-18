# Xclusive Creator Platform

## Overview
The Xclusive Creator Platform is a full-stack application designed to empower content creators to monetize their content through subscriptions and fan interactions. It offers comprehensive tools for creators to manage their content, define subscription tiers, track earnings, and engage with their audience. For fans, the platform provides access to exclusive content, subscription management, and direct messaging with creators. The platform aims to be a leading solution for content monetization, fostering direct creator-fan relationships and providing a robust ecosystem for digital content.

## User Preferences
- Development workflow: Use `npm run dev` for development with hot reload
- Database management: Use `npm run db:push` for schema changes
- Code style: TypeScript with proper type definitions throughout

## System Architecture
The platform utilizes a modern full-stack architecture. The frontend is built with **React and TypeScript**, leveraging **Vite** for a fast development experience and **Tailwind CSS** with **shadcn/ui** for a responsive and consistent user interface. **TanStack Query (React Query)** manages state and data fetching. The backend is an **Express.js** application also written in **TypeScript**. Data persistence is handled by **Supabase PostgreSQL** and managed with **Drizzle ORM** and the `postgres-js` client. Authentication is managed via a **custom JWT-based system**. File uploads are handled by **Multer**, and **Stripe** is integrated for payment processing. Real-time features such as notifications and messaging are supported by **WebSockets**. The system supports a multi-role structure (Admin, Creator, Fan) with distinct permissions and provides features like content management, tiered subscriptions, real-time messaging, and an analytics dashboard for creators. The design ensures a consistent user experience with a focus on mobile responsiveness and a "showcase approach" for locked content to encourage conversions. Critical security measures are implemented, including complete content redaction for unauthorized users on the backend.

## Important Code Patterns

### Video Media URLs Handling
**CRITICAL**: When working with video posts, the `media_urls` array may contain BOTH thumbnails and video files. Always use the correct helper function to extract the actual video URL.

**Structure**: 
- `media_urls[0]` = Thumbnail image (e.g., `.jpg`)
- `media_urls[1]` = Actual video file (e.g., `.mp4`)

**Correct Pattern** (see `VideoWatch.tsx` and `ManageContent.tsx`):
```typescript
const getVideoUrl = (): string | null => {
  if (!post?.media_urls) return null;
  
  const mediaUrls = Array.isArray(post.media_urls) 
    ? post.media_urls 
    : [post.media_urls];
  
  // Find the first URL with video extension
  const videoUrl = mediaUrls.find((url: string) => {
    return url && url.match(/\.(mp4|mov|webm|avi)(\?|$)/i);
  });
  
  if (videoUrl) {
    return videoUrl.startsWith('http') ? videoUrl : `/uploads/${videoUrl}`;
  }
  
  // Fallback to last item (convention: video is usually last)
  const lastUrl = mediaUrls[mediaUrls.length - 1];
  return lastUrl?.startsWith('http') ? lastUrl : `/uploads/${lastUrl}`;
};
```

**When to use**:
- ✅ Use `getVideoUrl()` or similar logic for `<video src={...}>` elements
- ✅ Use `media_urls[0]` for thumbnail/poster images
- ❌ NEVER use `media_urls[0]` directly for video `src` attribute
- ❌ NEVER assume `media_urls` has only one item

**Reference implementations**:
- `client/src/pages/VideoWatch.tsx` (lines 458-480)
- `client/src/pages/creator/ManageContent.tsx` (lines 239-260)

## External Dependencies
- **Supabase PostgreSQL**: Managed cloud database for data storage.
- **Stripe**: Payment gateway for subscription processing and tips.
- **Multer**: Node.js middleware for handling `multipart/form-data`, primarily for file uploads.
- **Vite**: Frontend build tool.
- **Tailwind CSS**: Utility-first CSS framework.
- **shadcn/ui**: Component library for React.
- **TanStack Query (React Query)**: Data fetching and state management library.
- **Drizzle ORM**: TypeScript ORM for database interactions.
- **postgres-js**: PostgreSQL client for Node.js.