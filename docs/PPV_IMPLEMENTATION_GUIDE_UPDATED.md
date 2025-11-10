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

## Phase 5: Frontend - PPV Payment Modal Component

### Step 5.1: Create PPV Payment Modal

**File**: `client/src/components/payment/PPVPaymentModal.tsx`

```typescript
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Lock, Check, CreditCard, Smartphone } from 'lucide-react';

interface PPVPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: {
    id: number;
    title: string;
    ppv_price: string;
    ppv_currency: string;
    creator_display_name?: string;
    media_urls: string[];
  };
  userId: number;
  onSuccess: () => void;
}

export function PPVPaymentModal({ isOpen, onClose, post, userId, onSuccess }: PPVPaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'mobile_money'>('card');
  const { toast } = useToast();

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Initialize PPV payment
      const response = await fetch('/api/payment/initialize-ppv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fan_id: userId,
          post_id: post.id,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Payment initialization failed');
      }

      // Redirect to Paystack payment page
      if (result.data.authorization_url) {
        window.location.href = result.data.authorization_url;
      }
    } catch (error: any) {
      console.error('PPV payment error:', error);
      toast({
        title: 'Payment Failed',
        description: error.message || 'Failed to process payment',
        variant: 'destructive',
      });
      setIsProcessing(false);
    }
  };

  const thumbnail = post.media_urls?.[0] || null;
  const price = parseFloat(post.ppv_price);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" data-testid="modal-ppv-payment">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            Unlock This Content
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Content Preview */}
          {thumbnail && (
            <div className="relative w-full h-40 rounded-md overflow-hidden bg-muted">
              <img
                src={thumbnail}
                alt={post.title}
                className="w-full h-full object-cover blur-sm"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Lock className="w-8 h-8 text-white" />
              </div>
            </div>
          )}

          {/* Content Details */}
          <div className="space-y-1">
            <h3 className="font-semibold text-lg" data-testid="text-ppv-title">{post.title}</h3>
            {post.creator_display_name && (
              <p className="text-sm text-muted-foreground">
                by {post.creator_display_name}
              </p>
            )}
          </div>

          {/* Price Details */}
          <div className="bg-muted rounded-md p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-lg" data-testid="text-ppv-price">
                {post.ppv_currency} {price.toFixed(2)}
              </span>
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>One-time payment</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>Permanent access</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>Watch anytime</span>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Payment Method</label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={selectedMethod === 'card' ? 'default' : 'outline'}
                onClick={() => setSelectedMethod('card')}
                className="h-auto py-3"
                data-testid="button-payment-card"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Card
              </Button>
              <Button
                variant={selectedMethod === 'mobile_money' ? 'default' : 'outline'}
                onClick={() => setSelectedMethod('mobile_money')}
                className="h-auto py-3"
                data-testid="button-payment-mobile"
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Mobile Money
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isProcessing}
              data-testid="button-ppv-cancel"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex-1"
              data-testid="button-ppv-pay"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ${post.ppv_currency} ${price.toFixed(2)}`
              )}
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Already have access? Try refreshing the page
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

**Testing Checklist Phase 5:**
- [ ] PPV payment modal displays correctly
- [ ] Shows content preview with blur
- [ ] Displays price and benefits clearly
- [ ] Payment method selection works
- [ ] Payment initialization triggers correctly

---

## Phase 6: Frontend - Update Locked Content Overlay

### Step 6.1: Update LockedContentOverlay Component

**File**: `client/src/components/content/LockedContentOverlay.tsx`

Update the component props and implementation:

```typescript
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

interface LockedContentOverlayProps {
  thumbnail?: string | null | undefined;
  tier: string;
  isVideo?: boolean;
  onUnlockClick: (e: React.MouseEvent) => void;
  onPPVUnlockClick?: (e: React.MouseEvent) => void; // NEW: PPV unlock handler
  className?: string;
  showButton?: boolean;
  ppvEnabled?: boolean; // NEW: Whether PPV is enabled for this content
  ppvPrice?: string; // NEW: PPV price
  ppvCurrency?: string; // NEW: PPV currency
}

export const LockedContentOverlay: React.FC<LockedContentOverlayProps> = ({
  thumbnail,
  tier,
  isVideo = false,
  onUnlockClick,
  onPPVUnlockClick,
  className = '',
  showButton = true,
  ppvEnabled = false,
  ppvPrice,
  ppvCurrency = 'GHS'
}) => {
  const { user } = useAuth();

  return (
    <div className={`w-full h-full relative overflow-hidden group ${className}`}>
      {/* Blurred content preview */}
      <div className="absolute inset-0">
        {thumbnail ? (
          <img 
            src={
              isVideo && thumbnail.includes('cloudinary.com/')
                ? thumbnail.replace('/upload/', '/upload/so_0,w_800,h_800,c_fill,f_jpg/').replace('.mp4', '.jpg')
                : thumbnail.startsWith('/uploads/') || thumbnail.startsWith('http')
                  ? thumbnail
                  : `/uploads/${thumbnail}`
            }
            alt="Locked content preview"
            className="w-full h-full object-cover blur-md scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800" />
        )}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60 backdrop-blur-xl group-hover:backdrop-blur-2xl transition-all duration-500" />

      {/* Lock icon and CTA */}
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-16 h-16 mx-auto bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 animate-pulse">
            <svg className="w-8 h-8 text-accent drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-background/20 text-white border border-white/20 backdrop-blur-sm">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="capitalize">{tier} Tier</span>
            </div>
            
            <p className="text-white/90 text-sm max-w-xs mx-auto">
              {user 
                ? ppvEnabled 
                  ? 'Subscribe for unlimited access or unlock just this content'
                  : 'Subscribe to unlock this exclusive content'
                : 'Sign in to unlock this content'
              }
            </p>
          </div>

          {showButton && (
            <div className="space-y-3">
              {/* Dual Buttons: Subscribe OR PPV */}
              {ppvEnabled && ppvPrice && user ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Subscribe Button */}
                  <Button 
                    size="default"
                    variant="default"
                    onClick={onUnlockClick}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 backdrop-blur-sm border border-primary/20 font-semibold"
                    data-testid="button-subscribe-unlock"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Subscribe
                  </Button>

                  {/* PPV Unlock Button */}
                  <Button 
                    size="default"
                    variant="outline"
                    onClick={onPPVUnlockClick}
                    className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm font-semibold"
                    data-testid="button-ppv-unlock"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {ppvCurrency} {parseFloat(ppvPrice).toFixed(2)}
                  </Button>
                </div>
              ) : (
                // Single Subscribe/Login Button
                <Button 
                  size="default"
                  onClick={onUnlockClick}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 backdrop-blur-sm border border-primary/20"
                  data-testid="button-unlock"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  {user ? 'Unlock Full Access' : 'Login to Unlock'}
                </Button>
              )}

              {ppvEnabled && ppvPrice && user && (
                <p className="text-xs text-white/60 px-2">
                  Subscribe for unlimited access to all {tier} tier content
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
```

**Testing Checklist Phase 6:**
- [ ] Locked overlay shows dual buttons when PPV enabled
- [ ] Subscribe button works as before
- [ ] PPV unlock button displays correct price
- [ ] Layout responsive on mobile (stacks vertically)
- [ ] Non-PPV content shows single button as before

---

## Phase 7: Frontend - Update VideoWatch Page

### Step 7.1: Integrate PPV into VideoWatch Component

**File**: `client/src/pages/VideoWatch.tsx`

Add these imports and modifications:

```typescript
// Add these imports at the top
import { PPVPaymentModal } from '@/components/payment/PPVPaymentModal';

// Add these state variables in the VideoWatch component
const [ppvPaymentModalOpen, setPPVPaymentModalOpen] = useState(false);
const [hasPPVAccess, setHasPPVAccess] = useState(false);

// Add PPV access check in useEffect (add after subscription check)
useEffect(() => {
  const checkPPVAccess = async () => {
    if (!user || !post || !post.is_ppv_enabled) return;

    try {
      const response = await fetch(`/api/payment/ppv-access/${user.id}/${post.id}`);
      if (response.ok) {
        const data = await response.json();
        setHasPPVAccess(data.has_access);
      }
    } catch (error) {
      console.error('Error checking PPV access:', error);
    }
  };

  checkPPVAccess();
}, [user, post]);

// Update the hasAccess logic (modify existing useEffect)
useEffect(() => {
  if (!post || !user) {
    setHasAccess(false);
    return;
  }

  const postTier = post.tier?.toLowerCase() || 'public';

  // Own post - always has access
  if (user && post.creator_id === user.id) {
    setHasAccess(true);
    return;
  }

  // Public content WITHOUT PPV - everyone has access
  if (postTier === 'public' && !post.is_ppv_enabled) {
    setHasAccess(true);
    return;
  }

  // Check PPV access
  if (post.is_ppv_enabled && hasPPVAccess) {
    setHasAccess(true);
    return;
  }

  // Not logged in - no access to premium content
  if (!user) {
    setHasAccess(false);
    return;
  }

  // No active subscription - no access to premium content
  if (!userSubscription || userSubscription.status !== 'active') {
    setHasAccess(false);
    return;
  }

  // Check tier hierarchy (existing logic)
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

  const userTierLevel = tierHierarchy[userSubscription.tier_name?.toLowerCase()] || 0;
  const postTierLevel = tierHierarchy[postTier] || 999;

  const access = userTierLevel >= postTierLevel;
  setHasAccess(access);
}, [post, user, userSubscription, hasPPVAccess]);

// Add PPV unlock handler
const handlePPVUnlock = (e: React.MouseEvent) => {
  e.stopPropagation();
  
  if (!user) {
    toast({
      title: "Login Required",
      description: "Please log in to unlock content",
      variant: "destructive"
    });
    return;
  }

  setPPVPaymentModalOpen(true);
};

// Add PPV success handler
const handlePPVSuccess = () => {
  setPPVPaymentModalOpen(false);
  setHasPPVAccess(true);
  toast({
    title: "Content Unlocked!",
    description: "You now have permanent access to this content",
  });
  // Reload to show unlocked content
  window.location.reload();
};

// Update the LockedContentOverlay in JSX (find the existing one and update it)
{!hasAccess && post && (
  <LockedContentOverlay
    thumbnail={post.media_urls?.[0]}
    tier={post.tier}
    isVideo={true}
    onUnlockClick={handleSubscribeClick}
    onPPVUnlockClick={handlePPVUnlock}
    ppvEnabled={post.is_ppv_enabled}
    ppvPrice={post.ppv_price}
    ppvCurrency={post.ppv_currency || 'GHS'}
  />
)}

// Add PPV Payment Modal before the closing tag of the component
{post && user && (
  <PPVPaymentModal
    isOpen={ppvPaymentModalOpen}
    onClose={() => setPPVPaymentModalOpen(false)}
    post={post}
    userId={user.id}
    onSuccess={handlePPVSuccess}
  />
)}
```

**Testing Checklist Phase 7:**
- [ ] PPV modal opens when clicking PPV unlock button
- [ ] Payment flow completes successfully
- [ ] After payment, content becomes accessible
- [ ] Page reload shows unlocked content
- [ ] Non-PPV videos work as before

---

## Phase 8: Frontend - Creator Content Upload

### Step 8.1: Add PPV Settings to Upload Form

**File**: `client/src/pages/creator/CreatePost.tsx` (or wherever post creation happens)

Add PPV settings to your upload form:

```typescript
// Add to form state
const [ppvEnabled, setPPVEnabled] = useState(false);
const [ppvPrice, setPPVPrice] = useState('');

// Add to form schema validation (if using Zod)
const uploadSchema = z.object({
  // ... existing fields ...
  is_ppv_enabled: z.boolean().default(false),
  ppv_price: z.string().optional(),
  ppv_currency: z.string().default('GHS'),
});

// Add to form JSX (after tier selection)
<div className="space-y-4">
  <div className="flex items-center justify-between">
    <div className="space-y-0.5">
      <label className="text-sm font-medium">Pay Per View</label>
      <p className="text-sm text-muted-foreground">
        Allow fans to unlock this content without subscribing
      </p>
    </div>
    <Switch
      checked={ppvEnabled}
      onCheckedChange={setPPVEnabled}
      data-testid="switch-ppv-enable"
    />
  </div>

  {ppvEnabled && (
    <div className="space-y-2 pl-4 border-l-2 border-primary">
      <label className="text-sm font-medium">PPV Price (GHS)</label>
      <Input
        type="number"
        min="2"
        step="0.50"
        value={ppvPrice}
        onChange={(e) => setPPVPrice(e.target.value)}
        placeholder="5.00"
        data-testid="input-ppv-price"
      />
      <p className="text-xs text-muted-foreground">
        Minimum: GHS 2.00 • Recommended: GHS 5-10
      </p>
    </div>
  )}
</div>

// Add to form submission
const handleSubmit = async (data) => {
  const formData = {
    ...data,
    is_ppv_enabled: ppvEnabled,
    ppv_price: ppvEnabled ? ppvPrice : null,
    ppv_currency: 'GHS',
  };

  // ... rest of submission logic
};
```

**Testing Checklist Phase 8:**
- [ ] PPV toggle appears in upload form
- [ ] Price input shows when PPV enabled
- [ ] Minimum price validation works
- [ ] Posts save with PPV settings
- [ ] PPV settings persist on edit

---

## Phase 9: Frontend - Feed Indicators

### Step 9.1: Add PPV Badge to Video Cards

**File**: `client/src/components/content/VideoCard.tsx` (or your video/content card component)

Add this badge to video thumbnails:

```typescript
// Add PPV badge to video card thumbnail
{post.is_ppv_enabled && post.ppv_price && (
  <div className="absolute top-2 right-2 z-10">
    <div className="flex items-center gap-1 bg-primary/90 backdrop-blur-sm text-primary-foreground px-2 py-1 rounded-md text-xs font-semibold shadow-lg">
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
      </svg>
      {post.ppv_currency} {parseFloat(post.ppv_price).toFixed(0)}
    </div>
  </div>
)}
```

**Testing Checklist Phase 9:**
- [ ] PPV badge appears on enabled content
- [ ] Price displays correctly
- [ ] Badge visible but not intrusive
- [ ] Works on all content card types

---

## Phase 10: Frontend - Purchase History Page

### Step 10.1: Create Purchase History Page

**File**: `client/src/pages/fan/PurchaseHistory.tsx` (new file)

```typescript
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { Play } from 'lucide-react';
import { Link } from 'wouter';

export default function PurchaseHistory() {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      if (!user) return;

      try {
        const response = await fetch(`/api/payment/ppv-purchases/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setPurchases(data.purchases || []);
        }
      } catch (error) {
        console.error('Error fetching purchases:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [user]);

  if (loading) {
    return <div className="p-8">Loading your purchases...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="heading-purchase-history">My Unlocked Content</h1>
        <p className="text-muted-foreground">Content you've purchased with permanent access</p>
      </div>

      {purchases.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">You haven't purchased any content yet</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {purchases.map((purchase: any) => (
            <Card key={purchase.id} className="p-4" data-testid={`card-purchase-${purchase.id}`}>
              <div className="flex gap-4">
                {purchase.post?.media_urls?.[0] && (
                  <img
                    src={purchase.post.media_urls[0]}
                    alt={purchase.post.title}
                    className="w-32 h-20 object-cover rounded-md"
                  />
                )}
                <div className="flex-1 space-y-1">
                  <h3 className="font-semibold">{purchase.post?.title || 'Untitled'}</h3>
                  <p className="text-sm text-muted-foreground">
                    Purchased {formatDistanceToNow(new Date(purchase.purchased_at), { addSuffix: true })} • 
                    {' '}{purchase.currency} {parseFloat(purchase.amount).toFixed(2)}
                  </p>
                </div>
                <Link href={`/video/${purchase.post_id}`}>
                  <Button data-testid={`button-watch-${purchase.post_id}`}>
                    <Play className="w-4 h-4 mr-2" />
                    Watch
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Step 10.2: Add Purchase History Route

**File**: `client/src/App.tsx`

```typescript
import PurchaseHistory from '@/pages/fan/PurchaseHistory';

// Add to routes
<Route path="/purchases" component={PurchaseHistory} />
```

**Testing Checklist Phase 10:**
- [ ] Purchase history page shows all PPV purchases
- [ ] Links to purchased content work
- [ ] Empty state shows when no purchases
- [ ] Purchase dates and prices display correctly

---

## Phase 11: Backend - Update Monthly Payouts

### Step 11.1: Update Payout Calculation to Include PPV

**File**: `server/services/payoutService.ts` (or wherever payout logic exists)

```typescript
// Update the monthly payout calculation function
async function calculateCreatorPayout(creatorId: number, startDate: Date, endDate: Date) {
  // Get subscription revenue (existing)
  const subscriptionRevenue = await storage.getCreatorSubscriptionRevenue(creatorId, startDate, endDate);
  
  // Get PPV revenue (NEW)
  const ppvRevenue = await storage.getCreatorPPVRevenue(creatorId, startDate, endDate);
  
  // Calculate total revenue
  const totalRevenue = subscriptionRevenue + ppvRevenue;
  
  // Platform fee (10%)
  const platformFee = totalRevenue * 0.10;
  
  // Payout amount
  const payoutAmount = totalRevenue - platformFee;
  
  return {
    subscription_revenue: subscriptionRevenue.toFixed(2),
    ppv_revenue: ppvRevenue.toFixed(2),
    total_revenue: totalRevenue.toFixed(2),
    platform_fee: platformFee.toFixed(2),
    payout_amount: payoutAmount.toFixed(2),
  };
}
```

### Step 11.2: Update Creator Dashboard Analytics

Show PPV revenue breakdown in creator dashboard:

```typescript
// In creator dashboard component
<Card>
  <CardHeader>
    <CardTitle>Revenue This Month</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <div>
      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold">GHS {totalRevenue.toFixed(2)}</span>
      </div>
      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subscriptions</span>
          <span className="font-medium">GHS {subscriptionRevenue.toFixed(2)} ({Math.round(subscriptionRevenue/totalRevenue*100)}%)</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Pay Per View</span>
          <span className="font-medium">GHS {ppvRevenue.toFixed(2)} ({Math.round(ppvRevenue/totalRevenue*100)}%)</span>
        </div>
      </div>
    </div>
  </CardContent>
</Card>
```

**Testing Checklist Phase 11:**
- [ ] PPV revenue included in monthly payouts
- [ ] Revenue breakdown shows subscriptions vs PPV
- [ ] Platform fee calculated on combined revenue
- [ ] Creator dashboard displays PPV metrics

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
