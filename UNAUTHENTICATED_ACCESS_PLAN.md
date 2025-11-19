# Unauthenticated Access Implementation Plan

## Overview
This document outlines the plan to implement unauthenticated browsing capabilities on the Xclusive Creator Platform, similar to YouTube's approach where visitors can browse public content without signing in, while personalized and interactive features require authentication.

**Date Created**: November 19, 2025  
**Status**: Pending Implementation

---

## Goals

1. **Improve User Acquisition**: Allow potential users to explore the platform and discover creators before committing to sign up
2. **Showcase Content**: Enable the "showcase approach" for locked content to drive conversions
3. **Maintain Security**: Ensure sensitive operations and personalized features remain protected
4. **Optimize SEO**: Make public content discoverable by search engines

---

## Page Access Matrix

### ✅ Pages Accessible WITHOUT Login (Public Access)

| Page | Route | Current Status | Implementation Priority |
|------|-------|----------------|------------------------|
| **Explore** | `/explore` | May require auth | HIGH |
| **Creator Profile** | `/creator/:id` | Unknown | HIGH |
| **Individual Post/Video** | `/video/:id` | Partially public | MEDIUM |
| **Landing/Home** | `/` | Needs creation | LOW |
| **Category Browse** | `/category/:name` | Future feature | LOW |

**Behavior for Unauthenticated Users**:
- Can browse and view content previews
- See locked content with "Unlock to View" overlays
- Click on "Subscribe", "Like", "Comment" shows "Sign in to continue" modal
- Can see creator information, tier pricing, and subscription benefits

### 🔒 Pages That REQUIRE Login (Protected)

| Page | Route | Reason |
|------|-------|--------|
| **Feed** | `/feed` | Personalized content from followed creators |
| **Fan Dashboard** | `/fan/dashboard` | Personal statistics and recommendations |
| **Manage Subscriptions** | `/fan/subscriptions` | User's active subscriptions |
| **Purchase History** | `/fan/purchases` | User's PPV purchase records |
| **Messages** | `/messages` | Private conversations |
| **Fan Settings** | `/fan/settings` | Account management |
| **Creator Dashboard** | `/creator/dashboard` | Creator analytics and tools |
| **All Creator Tools** | `/creator/*` | Content management, earnings, etc. |
| **Admin Panel** | `/admin/*` | Platform administration |

---

## Technical Implementation

### Phase 1: Backend API Updates

#### 1.1 Update Route Middleware

**Routes to Change from `authenticateToken` to `optionalAuth`:**

```typescript
// server/routes/posts.ts
// ✅ Allow unauthenticated users to browse posts
router.get('/', optionalAuth, async (req, res) => { /* ... */ });
router.get('/:id', optionalAuth, async (req, res) => { /* ... */ });

// server/routes/creators.ts  
// ✅ Allow viewing creator profiles and tiers
router.get('/:id', optionalAuth, async (req, res) => { /* ... */ });
router.get('/:creatorId/tiers', optionalAuth, async (req, res) => { /* ... */ });
router.get('/:id/posts', optionalAuth, async (req, res) => { /* ... */ });

// server/routes/categories.ts (if exists)
// ✅ Allow browsing by category
router.get('/', optionalAuth, async (req, res) => { /* ... */ });
router.get('/:id/creators', optionalAuth, async (req, res) => { /* ... */ });
```

**Routes to KEEP as `authenticateToken`:**
- All POST, PUT, PATCH, DELETE endpoints (mutations)
- `/api/subscriptions/*` (subscription management)
- `/api/payment/*` (payment operations)
- `/api/messages/*` (messaging)
- `/api/creator/*` (creator tools)
- `/api/admin/*` (admin operations)

#### 1.2 Update Backend Logic

**Content Access Control**:
```typescript
// Pseudo-code for posts endpoint
router.get('/:id', optionalAuth, async (req, res) => {
  const post = await storage.getPost(postId);
  const userId = req.user?.id; // May be undefined if not authenticated
  
  // Check if user has access (subscription or PPV purchase)
  const hasAccess = userId ? await checkUserAccess(userId, post) : false;
  
  if (!hasAccess && (post.is_subscriber_only || post.is_ppv_enabled)) {
    // Redact sensitive content but show preview
    return res.json({
      ...post,
      content: null, // Redact full content
      media_urls: [post.media_urls[0]], // Only thumbnail
      description: post.description?.substring(0, 150) + '...', // Preview only
      is_locked: true,
      unlock_options: {
        can_subscribe: true,
        can_purchase_ppv: post.is_ppv_enabled,
        ppv_price: post.ppv_price
      }
    });
  }
  
  // Full access
  return res.json(post);
});
```

### Phase 2: Frontend Route Protection

#### 2.1 Create Route Guard Component

**File**: `client/src/components/auth/ProtectedRoute.tsx`

```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean; // Default true
  redirectTo?: string; // Default '/login'
}

export function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { data: user, isLoading } = useQuery({ queryKey: ['/api/auth/me'] });
  const [location, setLocation] = useLocation();
  
  if (isLoading) return <LoadingSpinner />;
  
  if (requireAuth && !user) {
    // Save intended destination
    sessionStorage.setItem('redirectAfterLogin', location);
    setLocation(redirectTo);
    return null;
  }
  
  return <>{children}</>;
}
```

#### 2.2 Update App.tsx Routes

```typescript
// Public routes (no auth required)
<Route path="/" component={Home} />
<Route path="/explore" component={Explore} />
<Route path="/creator/:id" component={CreatorProfile} />
<Route path="/video/:id" component={VideoWatch} />

// Protected routes
<Route path="/feed">
  <ProtectedRoute>
    <FeedPage />
  </ProtectedRoute>
</Route>

<Route path="/fan/dashboard">
  <ProtectedRoute>
    <FanDashboard />
  </ProtectedRoute>
</Route>

// ... repeat for other protected routes
```

#### 2.3 Update Navigation/Sidebar

**Current Behavior**: Sidebar shows all navigation items  
**New Behavior**: 
- Show public items to all users (Explore, Categories)
- Show personalized items only when authenticated (Feed, Subscriptions, Dashboard)
- Show "Sign In" button for unauthenticated users

```typescript
// client/src/components/app-sidebar.tsx
const { data: user } = useQuery({ queryKey: ['/api/auth/me'] });

const publicItems = [
  { title: "Explore", url: "/explore", icon: Compass },
  { title: "Categories", url: "/categories", icon: Grid },
];

const authenticatedItems = user ? [
  { title: "Feed", url: "/feed", icon: Home },
  { title: "Subscriptions", url: "/fan/subscriptions", icon: Users },
  { title: "Messages", url: "/messages", icon: MessageCircle },
  { title: "Dashboard", url: "/fan/dashboard", icon: LayoutDashboard },
] : [];
```

### Phase 3: Interactive Element Guards

#### 3.1 Create SignInPrompt Component

**File**: `client/src/components/auth/SignInPrompt.tsx`

```typescript
interface SignInPromptProps {
  action: string; // "subscribe", "like", "comment", "purchase"
  trigger: React.ReactNode;
}

export function SignInPrompt({ action, trigger }: SignInPromptProps) {
  const { data: user } = useQuery({ queryKey: ['/api/auth/me'] });
  const [showDialog, setShowDialog] = useState(false);
  const [, setLocation] = useLocation();
  
  const handleClick = () => {
    if (!user) {
      setShowDialog(true);
    }
    // If authenticated, trigger normal action
  };
  
  return (
    <>
      <div onClick={handleClick}>{trigger}</div>
      
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign in to continue</AlertDialogTitle>
            <AlertDialogDescription>
              You need to sign in to {action} on this platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
              setLocation('/login');
            }}>
              Sign In
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
```

#### 3.2 Wrap Interactive Elements

**Usage Example**:
```typescript
// Before
<Button onClick={handleLike}>
  <Heart /> Like
</Button>

// After
<SignInPrompt action="like this post" trigger={
  <Button onClick={user ? handleLike : undefined}>
    <Heart /> Like
  </Button>
} />
```

**Elements to Wrap**:
- Like buttons
- Comment forms
- Subscribe buttons
- Share buttons (optional)
- Follow buttons

### Phase 4: User Experience Enhancements

#### 4.1 Landing Page Creation

**File**: `client/src/pages/Home.tsx`

**Content**:
- Hero section showcasing platform benefits
- Featured creators carousel
- Trending content preview
- Clear CTA: "Start Exploring" → `/explore` or "Sign Up" → `/signup`

#### 4.2 Enhanced Locked Content Display

**Current**: `LockedContentOverlay` component exists  
**Enhancement**: Make sure it shows:
- Clear pricing information
- "Sign in to subscribe" vs "Subscribe now" based on auth status
- Preview of what's locked (thumbnail, title, description preview)

#### 4.3 SEO Optimization

**Add to public pages**:
```typescript
// Meta tags for SEO
<Helmet>
  <title>{creator.display_name} - Xclusive Creator Platform</title>
  <meta name="description" content={creator.bio?.substring(0, 160)} />
  <meta property="og:title" content={creator.display_name} />
  <meta property="og:description" content={creator.bio} />
  <meta property="og:image" content={creator.profile_picture_url} />
</Helmet>
```

---

## Security Considerations

### ✅ What We're Doing Right

1. **Backend Redaction**: Content is redacted server-side, not just hidden with CSS
2. **Token-based Auth**: JWT tokens prevent unauthorized API access
3. **Role-based Access**: Admin and creator tools remain fully protected
4. **Payment Security**: All payment operations require authentication

### ⚠️ What to Watch

1. **Rate Limiting**: Consider adding rate limits to public endpoints to prevent scraping
2. **Content Metadata**: Ensure preview descriptions don't leak sensitive info
3. **Analytics**: Track unauthenticated vs authenticated user behavior
4. **CORS**: Verify CORS settings don't expose sensitive endpoints

---

## Implementation Phases & Timeline

### Phase 1: Backend (Est. 2-3 hours)
- [ ] Update route middleware (posts, creators, categories)
- [ ] Implement content redaction logic
- [ ] Add `is_locked` flag to API responses
- [ ] Test all public endpoints with and without auth

### Phase 2: Frontend Core (Est. 3-4 hours)
- [ ] Create ProtectedRoute component
- [ ] Update App.tsx routing
- [ ] Update sidebar navigation logic
- [ ] Create SignInPrompt component

### Phase 3: UI Polish (Est. 2-3 hours)
- [ ] Wrap all interactive elements
- [ ] Enhance locked content overlay
- [ ] Update Explore page for public access
- [ ] Test user flows (public → sign in → authenticated)

### Phase 4: Landing & SEO (Est. 2-3 hours)
- [ ] Create landing page
- [ ] Add meta tags to public pages
- [ ] Test SEO with Google Search Console
- [ ] Analytics setup for conversion tracking

**Total Estimated Time**: 9-13 hours

---

## Testing Checklist

### Functional Testing

- [ ] Unauthenticated user can browse Explore page
- [ ] Unauthenticated user can view creator profiles
- [ ] Unauthenticated user sees locked content overlay on restricted posts
- [ ] Clicking "Like" as unauthenticated shows sign-in prompt
- [ ] Clicking "Subscribe" as unauthenticated shows sign-in prompt
- [ ] After signing in, user is redirected back to intended page
- [ ] Authenticated users see full content they have access to
- [ ] Protected routes (Feed, Dashboard, etc.) redirect to login
- [ ] Creator and Admin routes remain fully protected

### Security Testing

- [ ] Direct API calls to posts endpoint return redacted content for locked posts
- [ ] Unauthenticated users cannot access subscription endpoints
- [ ] Unauthenticated users cannot access payment endpoints
- [ ] Attempting to bypass frontend guards fails at API level
- [ ] Rate limiting prevents excessive requests from unauthenticated users

### SEO Testing

- [ ] Public pages have proper meta tags
- [ ] OpenGraph tags work correctly
- [ ] Robots.txt allows crawling of public pages
- [ ] Sitemap includes public pages
- [ ] Google Search Console shows no crawl errors

---

## Success Metrics

### Key Performance Indicators

1. **Conversion Rate**: % of unauthenticated visitors who sign up
2. **Bounce Rate**: Should decrease as users explore before leaving
3. **Time on Site**: Should increase for unauthenticated users
4. **Sign-up Attribution**: Track which pages drive most sign-ups
5. **SEO Traffic**: Organic search traffic to creator profiles and content

### Analytics Events to Track

```typescript
// Example analytics events
analytics.track('Public Content Viewed', {
  contentId: postId,
  creatorId: creatorId,
  isAuthenticated: false
});

analytics.track('Sign In Prompt Shown', {
  action: 'subscribe',
  contentId: postId
});

analytics.track('Sign In From Prompt', {
  action: 'subscribe',
  returnPath: window.location.pathname
});
```

---

## Future Enhancements

1. **Smart Preview Generation**: Auto-generate engaging previews for locked content
2. **Guest Wishlists**: Allow unauthenticated users to "favorite" content, then show on sign-up
3. **Social Sharing**: Enable sharing of public content to drive viral growth
4. **Progressive Sign-up**: Let users browse for X minutes before requiring sign-up
5. **Personalized Recommendations**: Show "You might like" even to unauthenticated users based on browsing

---

## References

- YouTube's model: Home, Shorts, individual videos are public; History, Subscriptions require login
- Netflix's approach: Browse catalog publicly, watch requires sign-in
- Medium's metered paywall: Read X articles before sign-up required

---

*This plan should be reviewed and updated as implementation progresses. Any changes to the approach should be documented here.*
