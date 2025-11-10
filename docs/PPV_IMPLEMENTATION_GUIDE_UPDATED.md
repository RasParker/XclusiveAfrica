# Pay Per View (PPV) Implementation Guide - Supabase Edition

## Overview
This guide provides a step-by-step approach to implementing Pay Per View functionality on the Pénc platform using **Supabase PostgreSQL** and **Drizzle ORM**.

## Current Architecture
✅ **Database**: Supabase PostgreSQL  
✅ **ORM**: Drizzle ORM with `postgres-js`  
✅ **Storage**: `DatabaseStorage` class implementing `IStorage`  
✅ **Media**: Cloudinary for file uploads  

## Implementation Decisions
Based on our planning discussion:

✅ **Payment Model**: Monthly payout system (same as subscriptions)  
✅ **Pricing**: Creators set custom PPV price per content piece  
✅ **Access Duration**: Permanent access after purchase  
✅ **Dual Model**: Both Subscription AND PPV available simultaneously  
✅ **Platform Fee**: Same structure as subscriptions (10-15%)  

---

## Phase 1: Database Schema Changes

### Step 1.1: Create PPV Purchases Table
Add a new table to track individual content purchases.

**File**: `shared/schema.ts`

Add this **after the `payment_transactions` table**:

```typescript
// PPV Purchases table
export const ppv_purchases = pgTable("ppv_purchases", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id),
  post_id: integer("post_id").notNull().references(() => posts.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("GHS"),
  transaction_id: text("transaction_id"), // Paystack transaction reference
  payment_method: text("payment_method"), // card, mobile_money
  status: text("status").notNull().default("completed"), // completed, refunded
  purchased_at: timestamp("purchased_at").notNull().defaultNow(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

// Zod schemas for PPV purchases
export const insertPPVPurchaseSchema = createInsertSchema(ppv_purchases).omit({
  id: true,
  created_at: true,
  purchased_at: true,
});
export type InsertPPVPurchase = z.infer<typeof insertPPVPurchaseSchema>;
export type PPVPurchase = typeof ppv_purchases.$inferSelect;
```

### Step 1.2: Add PPV Fields to Posts Table
Update the existing `posts` table definition.

**File**: `shared/schema.ts`

Find the `posts` table and add these new fields **after the `tier` field**:

```typescript
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  creator_id: integer('creator_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  content: text('content'),
  media_type: text('media_type').notNull().default('text'),
  media_urls: text("media_urls").array().notNull().default([]),
  tier: text('tier').notNull().default('public'),
  
  // ===== NEW PPV FIELDS =====
  is_ppv_enabled: boolean('is_ppv_enabled').notNull().default(false),
  ppv_price: decimal('ppv_price', { precision: 10, scale: 2 }),
  ppv_currency: text('ppv_currency').default('GHS'),
  ppv_sales_count: integer('ppv_sales_count').notNull().default(0),
  // ==========================
  
  status: text('status').notNull().default('published'),
  scheduled_for: timestamp('scheduled_for'),
  likes_count: integer('likes_count').notNull().default(0),
  comments_count: integer('comments_count').notNull().default(0),
  views_count: integer('views_count').notNull().default(0),
  duration: integer('duration'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});
```

### Step 1.3: Update Creator Payouts Table
Modify the existing `creator_payouts` table to track PPV revenue separately.

**File**: `shared/schema.ts`

Find the `creator_payouts` table and update it:

```typescript
export const creator_payouts = pgTable("creator_payouts", {
  id: serial("id").primaryKey(),
  creator_id: integer("creator_id").notNull().references(() => users.id),
  period_start: timestamp("period_start").notNull(),
  period_end: timestamp("period_end").notNull(),
  
  // ===== UPDATED: Separate revenue tracking =====
  subscription_revenue: decimal("subscription_revenue", { precision: 10, scale: 2 }).notNull().default("0.00"),
  ppv_revenue: decimal("ppv_revenue", { precision: 10, scale: 2 }).notNull().default("0.00"),
  total_revenue: decimal("total_revenue", { precision: 10, scale: 2 }).notNull(),
  // ==============================================
  
  platform_fee: decimal("platform_fee", { precision: 10, scale: 2 }).notNull(),
  payout_amount: decimal("payout_amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("GHS"),
  status: text("status").notNull().default("pending"),
  payment_method: text("payment_method"),
  payment_details: jsonb("payment_details"),
  processed_at: timestamp("processed_at"),
  notes: text("notes"),
  created_at: timestamp("created_at").notNull().defaultNow(),
});
```

### Step 1.4: Push Schema Changes to Supabase

Run the following command to sync your schema with Supabase:

```bash
npm run db:push
```

If you encounter any issues, use:
```bash
npm run db:push --force
```

**Verification**: Check your Supabase dashboard to confirm:
- [ ] `ppv_purchases` table exists
- [ ] `posts` table has new PPV fields
- [ ] `creator_payouts` has updated revenue fields

---

## Phase 2: Backend - Storage Layer (DatabaseStorage)

### Step 2.1: Add PPV Types to Storage Imports

**File**: `server/storage.ts`

Add to the imports at the top of the file:

```typescript
import {
  // ... existing imports ...
  ppv_purchases,  // ADD THIS
  type PPVPurchase,  // ADD THIS
  type InsertPPVPurchase,  // ADD THIS
} from "@shared/schema";
```

### Step 2.2: Update IStorage Interface

**File**: `server/storage.ts`

Add these methods to the `IStorage` interface (around line 74):

```typescript
export interface IStorage {
  // ... existing methods ...
  
  // ===== PPV Purchase methods =====
  createPPVPurchase(purchase: InsertPPVPurchase): Promise<PPVPurchase>;
  getUserPPVPurchase(userId: number, postId: number): Promise<PPVPurchase | undefined>;
  getUserPPVPurchases(userId: number): Promise<any[]>;
  getPostPPVPurchases(postId: number): Promise<PPVPurchase[]>;
  getCreatorPPVRevenue(creatorId: number, startDate: Date, endDate: Date): Promise<number>;
  getUserPPVPurchaseCount(userId: number): Promise<number>;
  
  // Post PPV methods
  updatePostPPVSettings(postId: number, settings: { is_ppv_enabled: boolean; ppv_price?: string; ppv_currency?: string }): Promise<Post | undefined>;
  incrementPPVSalesCount(postId: number): Promise<void>;
  // ================================
}
```

### Step 2.3: Implement PPV Methods in DatabaseStorage

**File**: `server/storage.ts`

Add these methods to the `DatabaseStorage` class (add near the end of the class, before the closing brace):

```typescript
// ==================== PPV PURCHASE METHODS ====================

async createPPVPurchase(purchase: InsertPPVPurchase): Promise<PPVPurchase> {
  const [newPurchase] = await db
    .insert(ppv_purchases)
    .values(purchase)
    .returning();
  return newPurchase;
}

async getUserPPVPurchase(userId: number, postId: number): Promise<PPVPurchase | undefined> {
  const [purchase] = await db
    .select()
    .from(ppv_purchases)
    .where(
      and(
        eq(ppv_purchases.user_id, userId),
        eq(ppv_purchases.post_id, postId),
        eq(ppv_purchases.status, 'completed')
      )
    );
  return purchase || undefined;
}

async getUserPPVPurchases(userId: number): Promise<any[]> {
  const purchases = await db
    .select({
      id: ppv_purchases.id,
      post_id: ppv_purchases.post_id,
      amount: ppv_purchases.amount,
      currency: ppv_purchases.currency,
      purchased_at: ppv_purchases.purchased_at,
      payment_method: ppv_purchases.payment_method,
      transaction_id: ppv_purchases.transaction_id,
      post: {
        id: posts.id,
        title: posts.title,
        media_urls: posts.media_urls,
        media_type: posts.media_type,
      },
    })
    .from(ppv_purchases)
    .leftJoin(posts, eq(ppv_purchases.post_id, posts.id))
    .where(
      and(
        eq(ppv_purchases.user_id, userId),
        eq(ppv_purchases.status, 'completed')
      )
    )
    .orderBy(desc(ppv_purchases.purchased_at));
  
  return purchases;
}

async getPostPPVPurchases(postId: number): Promise<PPVPurchase[]> {
  const purchases = await db
    .select()
    .from(ppv_purchases)
    .where(
      and(
        eq(ppv_purchases.post_id, postId),
        eq(ppv_purchases.status, 'completed')
      )
    );
  return purchases;
}

async getCreatorPPVRevenue(creatorId: number, startDate: Date, endDate: Date): Promise<number> {
  // Get all posts by this creator
  const creatorPosts = await db
    .select({ id: posts.id })
    .from(posts)
    .where(eq(posts.creator_id, creatorId));
  
  const postIds = creatorPosts.map(p => p.id);
  
  if (postIds.length === 0) return 0;
  
  // Sum up PPV purchases for these posts in the date range
  const result = await db
    .select({
      total: sql<string>`COALESCE(SUM(${ppv_purchases.amount}), 0)`,
    })
    .from(ppv_purchases)
    .where(
      and(
        sql`${ppv_purchases.post_id} IN (${sql.join(postIds.map(id => sql`${id}`), sql`, `)})`,
        eq(ppv_purchases.status, 'completed'),
        gte(ppv_purchases.purchased_at, startDate),
        lte(ppv_purchases.purchased_at, endDate)
      )
    );
  
  return parseFloat(result[0]?.total || '0');
}

async getUserPPVPurchaseCount(userId: number): Promise<number> {
  const result = await db
    .select({
      count: sql<number>`COUNT(*)`,
    })
    .from(ppv_purchases)
    .where(
      and(
        eq(ppv_purchases.user_id, userId),
        eq(ppv_purchases.status, 'completed')
      )
    );
  
  return Number(result[0]?.count || 0);
}

async updatePostPPVSettings(postId: number, settings: { is_ppv_enabled: boolean; ppv_price?: string; ppv_currency?: string }): Promise<Post | undefined> {
  const [updated] = await db
    .update(posts)
    .set({
      is_ppv_enabled: settings.is_ppv_enabled,
      ppv_price: settings.ppv_price || null,
      ppv_currency: settings.ppv_currency || 'GHS',
      updated_at: new Date(),
    })
    .where(eq(posts.id, postId))
    .returning();
  
  return updated || undefined;
}

async incrementPPVSalesCount(postId: number): Promise<void> {
  await db
    .update(posts)
    .set({
      ppv_sales_count: sql`${posts.ppv_sales_count} + 1`,
    })
    .where(eq(posts.id, postId));
}

// ============================================================
```

**Testing Checklist Phase 2:**
- [ ] No TypeScript compilation errors
- [ ] Server starts successfully
- [ ] All imports resolve correctly

---

## Phase 3: Backend - Payment Routes

### Step 3.1: Create PPV Payment Initialization Endpoint

**File**: `server/routes/payment.ts`

Add this route **after the existing `/initialize` route**:

```typescript
// Initialize PPV payment
router.post('/initialize-ppv', async (req, res) => {
  try {
    const { fan_id, post_id } = req.body;

    // Validate required fields
    if (!fan_id || !post_id) {
      return res.status(400).json({
        success: false,
        message: 'Fan ID and Post ID are required'
      });
    }

    // Get fan details
    const fan = await storage.getUser(fan_id);
    if (!fan) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get post details
    const post = await storage.getPost(post_id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    // Verify PPV is enabled for this content
    if (!post.is_ppv_enabled || !post.ppv_price) {
      return res.status(400).json({
        success: false,
        message: 'Pay Per View is not available for this content'
      });
    }

    // Check if user already purchased this content
    const existingPurchase = await storage.getUserPPVPurchase(fan_id, post_id);
    if (existingPurchase) {
      return res.status(400).json({
        success: false,
        message: 'You already have access to this content',
        already_purchased: true
      });
    }

    // Check if user is creator (creators don't need to purchase their own content)
    if (post.creator_id === fan_id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot purchase your own content'
      });
    }

    // Initialize Paystack payment
    const paymentData = await paymentService.initializePayment({
      email: fan.email,
      amount: parseFloat(post.ppv_price),
      currency: post.ppv_currency || 'GHS',
      metadata: {
        fan_id,
        post_id,
        payment_type: 'ppv',
        creator_id: post.creator_id,
        content_title: post.title
      }
    });

    console.log('✅ PPV payment initialized:', {
      fan_id,
      post_id,
      amount: post.ppv_price,
      reference: paymentData.reference
    });

    res.json({
      success: true,
      data: paymentData
    });
  } catch (error: any) {
    console.error('❌ PPV payment initialization error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to initialize payment'
    });
  }
});
```

### Step 3.2: Update Payment Verification to Handle PPV

**File**: `server/routes/payment.ts`

Find the existing `/verify/:reference` route and update it to handle PPV payments:

```typescript
// Update the existing /verify/:reference route
router.get('/verify/:reference', async (req, res) => {
  try {
    const { reference } = req.params;

    // Verify payment with Paystack
    const verification = await paymentService.verifyPayment(reference);

    if (!verification.success || verification.data.status !== 'success') {
      return res.json({
        success: false,
        message: 'Payment verification failed'
      });
    }

    const metadata = verification.data.metadata;
    
    // ===== CHECK IF THIS IS A PPV PAYMENT =====
    if (metadata.payment_type === 'ppv') {
      console.log('🎬 Processing PPV purchase:', metadata);

      // Create PPV purchase record
      const ppvPurchase = await storage.createPPVPurchase({
        user_id: metadata.fan_id,
        post_id: metadata.post_id,
        amount: verification.data.amount.toString(),
        currency: verification.data.currency,
        transaction_id: reference,
        payment_method: verification.data.channel,
        status: 'completed',
      });

      // Increment PPV sales count
      await storage.incrementPPVSalesCount(metadata.post_id);

      console.log('✅ PPV purchase completed:', ppvPurchase);

      return res.json({
        success: true,
        message: 'Content unlocked successfully!',
        data: {
          purchase: ppvPurchase,
          payment_type: 'ppv'
        }
      });
    }
    // =========================================

    // Otherwise, handle as subscription payment (existing logic)
    const result = await paymentService.processSuccessfulPayment(verification.data);

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: result
    });
  } catch (error: any) {
    console.error('❌ Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Payment verification failed'
    });
  }
});
```

### Step 3.3: Create PPV Access Check Endpoint

**File**: `server/routes/payment.ts`

Add this new route:

```typescript
// Check if user has PPV access to content
router.get('/ppv-access/:userId/:postId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const postId = parseInt(req.params.postId);

    if (isNaN(userId) || isNaN(postId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user or post ID'
      });
    }

    const purchase = await storage.getUserPPVPurchase(userId, postId);

    res.json({
      success: true,
      has_access: !!purchase,
      purchase: purchase || null
    });
  } catch (error: any) {
    console.error('❌ PPV access check error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get all PPV purchases for a user
router.get('/ppv-purchases/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }

    const purchases = await storage.getUserPPVPurchases(userId);

    res.json({
      success: true,
      purchases
    });
  } catch (error: any) {
    console.error('❌ Error fetching PPV purchases:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
```

**Testing Checklist Phase 3:**
- [ ] POST `/api/payment/initialize-ppv` works
- [ ] Payment verification handles PPV type
- [ ] GET `/api/payment/ppv-access/:userId/:postId` returns access status
- [ ] GET `/api/payment/ppv-purchases/:userId` returns purchase list
- [ ] Duplicate purchase prevention works

---

## Phase 4: Backend - Update Content Access Logic

### Step 4.1: Update Posts Endpoint to Include PPV Access Check

**File**: `server/routes/posts.ts`

Find the `GET /api/posts/:id` route and update it:

```typescript
router.get('/:id', async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const userId = req.query.userId ? parseInt(req.query.userId as string) : null;

    if (isNaN(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }

    const post = await storage.getPost(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Get creator info
    const creator = await storage.getUser(post.creator_id);

    // Increment view count
    await storage.incrementPostViews(postId);

    // ===== CHECK ACCESS =====
    let hasAccess = false;
    let accessReason = '';

    // 1. Owner always has access
    if (userId && post.creator_id === userId) {
      hasAccess = true;
      accessReason = 'owner';
    }
    // 2. Public content WITHOUT PPV
    else if (post.tier === 'public' && !post.is_ppv_enabled) {
      hasAccess = true;
      accessReason = 'public';
    }
    // 3. Check PPV purchase
    else if (userId && post.is_ppv_enabled) {
      const ppvPurchase = await storage.getUserPPVPurchase(userId, postId);
      if (ppvPurchase) {
        hasAccess = true;
        accessReason = 'ppv_purchase';
      }
    }
    
    // 4. Check subscription (existing logic)
    if (!hasAccess && userId && post.tier !== 'public') {
      const subscription = await storage.getUserSubscriptionToCreator(userId, post.creator_id);
      if (subscription && subscription.status === 'active') {
        // Tier hierarchy check
        const tierHierarchy: Record<string, number> = {
          'supporter': 1,
          'starter pump': 1,
          'fan': 2,
          'premium': 2,
          'power gains': 2,
          'superfan': 3,
          'elite beast mode': 3,
          'the vip elite': 3
        };

        const userTierLevel = tierHierarchy[subscription.tier_name?.toLowerCase()] || 0;
        const postTierLevel = tierHierarchy[post.tier.toLowerCase()] || 999;

        if (userTierLevel >= postTierLevel) {
          hasAccess = true;
          accessReason = 'subscription';
        }
      }
    }
    // ========================

    // Return post with access info
    const responsePost = {
      ...post,
      creator: creator ? {
        id: creator.id,
        username: creator.username,
        display_name: creator.display_name,
        avatar: creator.avatar
      } : null,
      has_access: hasAccess,
      access_reason: accessReason,
      // Hide media if no access
      media_urls: hasAccess ? post.media_urls : [],
    };

    res.json(responsePost);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});
```

**Testing Checklist Phase 4:**
- [ ] Post endpoint returns `has_access` and `access_reason`
- [ ] PPV purchases grant access
- [ ] Subscriptions still grant access
- [ ] Owners always have access
- [ ] Media URLs hidden when no access

---

## Phase 5-11: Frontend Implementation

The frontend implementation (Phases 5-11) remains the same as in the original guide:

- **Phase 5**: PPV Payment Modal Component
- **Phase 6**: Update Locked Content Overlay
- **Phase 7**: Update VideoWatch Page
- **Phase 8**: Creator Content Upload Form
- **Phase 9**: Feed Indicators (PPV Badges)
- **Phase 10**: Purchase History Page
- **Phase 11**: Creator Analytics & Payouts

**Reference**: See the original `PPV_IMPLEMENTATION_GUIDE.md` for detailed frontend code (Phases 5-11). The frontend code remains unchanged.

---

## Key Differences from Original Guide

### ✅ What Changed:
1. **Storage Layer**: Uses `DatabaseStorage` with Drizzle ORM queries instead of MemStorage
2. **Database Access**: Direct Drizzle queries (`db.select()`, `db.insert()`)
3. **Schema Push**: Uses `npm run db:push` for Supabase
4. **Import Structure**: Uses actual schema imports from `@shared/schema`

### ✅ What Stayed the Same:
- Payment flow and Paystack integration
- Frontend components and UI
- Access control logic
- Creator analytics

---

## Quick Start Checklist

### Backend (Do This First):
- [ ] **Phase 1**: Update schema, run `npm run db:push`
- [ ] **Phase 2**: Add PPV methods to DatabaseStorage
- [ ] **Phase 3**: Add payment routes
- [ ] **Phase 4**: Update posts access logic

### Frontend (Do This Second):
- [ ] **Phase 5**: Create PPV Payment Modal
- [ ] **Phase 6**: Update Locked Content Overlay
- [ ] **Phase 7**: Integrate into VideoWatch
- [ ] **Phase 8**: Add to Upload Form
- [ ] **Phase 9**: Add Feed Badges
- [ ] **Phase 10**: Create Purchase History
- [ ] **Phase 11**: Update Analytics

---

## Support & Troubleshooting

### Supabase-Specific Issues:

**Issue**: Schema push fails  
**Fix**: Check Supabase connection, ensure `DATABASE_URL` is set

**Issue**: Drizzle queries not working  
**Fix**: Verify imports from `@shared/schema`, check TypeScript types

**Issue**: Cloudinary uploads fail  
**Fix**: Verify `CLOUDINARY_URL` environment variable

---

## Summary

This updated guide is tailored for your **Supabase + Drizzle ORM** architecture. All code examples use the actual `DatabaseStorage` implementation with proper Drizzle queries.

Build incrementally, test thoroughly, and iterate based on feedback! 🚀
