import express from 'express';
import { paymentService } from '../services/paymentService';
import { storage } from '../storage';

const router = express.Router();

// Initialize payment for subscription
router.post('/initialize', async (req, res) => {
  try {
    const { fan_id, tier_id, payment_method = 'card' } = req.body;

    // Validate required fields
    if (!fan_id || !tier_id) {
      return res.status(400).json({
        success: false,
        message: 'Fan ID and Tier ID are required'
      });
    }

    // Get fan details
    const fan = await storage.getUser(fan_id);
    if (!fan) {
      return res.status(404).json({
        success: false,
        message: 'Fan not found'
      });
    }

    // Get tier details
    const tier = await storage.getSubscriptionTier(tier_id);
    if (!tier) {
      return res.status(404).json({
        success: false,
        message: 'Subscription tier not found'
      });
    }

    // Check if fan already has active subscription to this creator
    const existingSubscription = await storage.getUserSubscriptionToCreator(fan_id, tier.creator_id);
    
    // If user already has active subscription to same tier, prevent duplicate
    if (existingSubscription && existingSubscription.status === 'active' && existingSubscription.tier_id === tier_id) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active subscription to this tier'
      });
    }
    
    // If user has active subscription to different tier, this is a tier change
    const isTierChange = existingSubscription && existingSubscription.status === 'active' && existingSubscription.tier_id !== tier_id;

    let paymentAmount = parseFloat(tier.price);
    let metadata: any = {
      fan_id,
      tier_id,
      subscription_type: 'new'
    };

    // Handle tier change logic
    if (isTierChange) {
      console.log(`🔄 Processing tier change for subscription ${existingSubscription.id}`);
      
      // Calculate proration for the tier change
      const prorationResult = await storage.calculateProration(existingSubscription.id, tier_id);
      console.log('📊 Proration calculation:', prorationResult);

      // For upgrades: charge prorated difference immediately
      // For downgrades: credit will be applied, and they pay reduced amount next cycle
      if (prorationResult.isUpgrade) {
        paymentAmount = prorationResult.prorationAmount;
        metadata = {
          ...metadata,
          subscription_type: 'tier_upgrade',
          existing_subscription_id: existingSubscription.id,
          proration_amount: prorationResult.prorationAmount,
          days_remaining: prorationResult.daysRemaining
        };
      } else {
        // For downgrades, schedule the change for next billing cycle
        await storage.createPendingSubscriptionChange({
          subscription_id: existingSubscription.id,
          from_tier_id: existingSubscription.tier_id,
          to_tier_id: tier_id,
          change_type: 'downgrade',
          scheduled_date: existingSubscription.next_billing_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          proration_amount: Math.abs(prorationResult.prorationAmount).toString()
        });

        return res.json({
          success: true,
          message: 'Downgrade scheduled for next billing cycle. You will keep access to current tier until then.',
          data: {
            type: 'scheduled_downgrade',
            effective_date: existingSubscription.next_billing_date,
            credit_amount: Math.abs(prorationResult.prorationAmount)
          }
        });
      }
    }

    // Initialize payment with calculated amount and metadata
    const paymentData = await paymentService.createSubscriptionPayment(
      fan_id,
      tier_id,
      paymentAmount,
      fan.email,
      metadata
    );

    res.json({
      success: true,
      data: paymentData.data,
      message: 'Payment initialized successfully'
    });
  } catch (error: any) {
    console.error('Payment initialization error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Payment initialization failed'
    });
  }
});

// Initialize mobile money payment
router.post('/mobile-money/initialize', async (req, res) => {
  try {
    const { fan_id, tier_id, phone, provider = 'mtn' } = req.body;

    // Validate required fields
    if (!fan_id || !tier_id || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Fan ID, Tier ID, and phone number are required'
      });
    }

    // Validate provider
    const validProviders = ['mtn', 'vod', 'tgo', 'airtel'];
    if (!validProviders.includes(provider)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid mobile money provider. Use: mtn, vod, tgo, or airtel'
      });
    }

    // Get fan details
    const fan = await storage.getUser(fan_id);
    if (!fan) {
      return res.status(404).json({
        success: false,
        message: 'Fan not found'
      });
    }

    // Get tier details
    const tier = await storage.getSubscriptionTier(tier_id);
    if (!tier) {
      return res.status(404).json({
        success: false,
        message: 'Subscription tier not found'
      });
    }

    // Initialize mobile money payment
    const paymentData = await paymentService.initializeMobileMoneyPayment({
      email: fan.email,
      amount: parseFloat(tier.price),
      phone,
      provider: provider as 'mtn' | 'vod' | 'tgo' | 'airtel'
    });

    res.json({
      success: true,
      data: paymentData.data,
      message: 'Mobile money payment initialized successfully'
    });
  } catch (error: any) {
    console.error('Mobile money payment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Mobile money payment initialization failed'
    });
  }
});

// Verify payment
router.post('/verify/:reference', async (req, res) => {
  try {
    const { reference } = req.params;

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: 'Payment reference is required'
      });
    }

    console.log('🔍 Verifying payment with reference:', reference);
    const verificationResult = await paymentService.verifyPayment(reference);
    console.log('✅ Payment verification result:', verificationResult.data.status);

    if (verificationResult.data.status === 'success') {
      console.log('💳 Processing successful payment...');
      // Process successful payment
      await paymentService.processSuccessfulPayment(verificationResult.data);
      console.log('✅ Payment processing completed successfully');
    }

    res.json({
      success: true,
      data: verificationResult.data,
      message: 'Payment verified successfully'
    });
  } catch (error: any) {
    console.error('❌ Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Payment verification failed'
    });
  }
});

// Get payment config (public key for frontend)
router.get('/config', (req, res) => {
  res.json({
    success: true,
    data: {
      public_key: paymentService.getPublicKey(),
      currency: 'GHS'
    }
  });
});

// Payment callback handler (for redirects from Paystack)
router.get('/callback', async (req, res) => {
  try {
    const { reference, status } = req.query;

    if (!reference) {
      return res.status(400).send(`
        <html>
          <head><title>Payment Error</title></head>
          <body>
            <h1>Payment Error</h1>
            <p>No payment reference found</p>
            <script>setTimeout(() => window.close(), 3000);</script>
          </body>
        </html>
      `);
    }

    // Redirect to frontend payment callback page to handle the result
    const frontendCallbackUrl = `/payment-callback?reference=${reference}&status=${status || 'pending'}`;
    
    return res.redirect(frontendCallbackUrl);
  } catch (error: any) {
    console.error('Payment callback error:', error);
    // Redirect to frontend with error status
    const frontendCallbackUrl = `/payment-callback?reference=${req.query.reference || 'unknown'}&status=failed`;
    return res.redirect(frontendCallbackUrl);
  }
});

// Paystack webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['x-paystack-signature'] as string;
    const payload = req.body.toString();

    // Validate webhook signature
    if (!paymentService.validateWebhookSignature(payload, signature)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid webhook signature'
      });
    }

    const event = JSON.parse(payload);

    // Handle different webhook events
    switch (event.event) {
      case 'charge.success':
        await paymentService.processSuccessfulPayment(event.data);
        break;
      case 'charge.failed':
        console.log('Payment failed:', event.data);
        break;
      case 'subscription.create':
        console.log('Subscription created:', event.data);
        break;
      case 'subscription.disable':
        console.log('Subscription disabled:', event.data);
        break;
      default:
        console.log('Unhandled webhook event:', event.event);
    }

    res.json({ success: true });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook processing failed'
    });
  }
});

// PPV (Pay-Per-View) Payment Routes

// Initialize PPV payment for a post
router.post('/ppv/initialize', async (req, res) => {
  try {
    const { user_id, post_id, payment_method = 'card' } = req.body;

    // Validate required fields
    if (!user_id || !post_id) {
      return res.status(400).json({
        success: false,
        message: 'User ID and Post ID are required'
      });
    }

    // Get user details
    const user = await storage.getUser(user_id);
    if (!user) {
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
        message: 'Post not found'
      });
    }

    // Check if post has PPV enabled
    if (!post.is_ppv_enabled || !post.ppv_price) {
      return res.status(400).json({
        success: false,
        message: 'This post is not available for purchase'
      });
    }

    // Check if user already purchased this post
    const existingPurchase = await storage.getPPVPurchaseByUserAndPost(user_id, post_id);
    if (existingPurchase) {
      return res.status(400).json({
        success: false,
        message: 'You have already purchased access to this content'
      });
    }

    // Check if user has an active subscription to the creator (they shouldn't need to purchase PPV content)
    const activeSubscription = await storage.getUserSubscriptionToCreator(user_id, post.creator_id);
    if (activeSubscription && activeSubscription.status === 'active') {
      return res.status(400).json({
        success: false,
        message: 'You already have access to this content through your subscription'
      });
    }

    const paymentAmount = parseFloat(post.ppv_price);
    const metadata = {
      user_id,
      post_id,
      payment_type: 'ppv',
      creator_id: post.creator_id
    };

    // Initialize payment
    const paymentData = await paymentService.createPPVPayment(
      user_id,
      post_id,
      paymentAmount,
      user.email,
      metadata
    );

    res.json({
      success: true,
      data: paymentData.data,
      message: 'PPV payment initialized successfully'
    });
  } catch (error: any) {
    console.error('PPV payment initialization error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'PPV payment initialization failed'
    });
  }
});

// Check if user has access to a PPV post
router.get('/ppv/access/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const post = await storage.getPost(parseInt(postId));
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // If post doesn't have PPV enabled, access is free
    if (!post.is_ppv_enabled) {
      return res.json({
        success: true,
        data: { 
          hasAccess: true,
          accessType: 'free'
        }
      });
    }

    // Check if user owns the post
    if (post.creator_id === parseInt(userId as string)) {
      return res.json({
        success: true,
        data: { 
          hasAccess: true,
          accessType: 'owner'
        }
      });
    }

    // Check for active subscription
    const activeSubscription = await storage.getUserSubscriptionToCreator(parseInt(userId as string), post.creator_id);
    if (activeSubscription && activeSubscription.status === 'active') {
      return res.json({
        success: true,
        data: { 
          hasAccess: true,
          accessType: 'subscription'
        }
      });
    }

    // Check for PPV purchase
    const hasPurchased = await storage.hasPurchasedPost(parseInt(userId as string), parseInt(postId));
    if (hasPurchased) {
      return res.json({
        success: true,
        data: { 
          hasAccess: true,
          accessType: 'ppv_purchase'
        }
      });
    }

    // No access
    return res.json({
      success: true,
      data: { 
        hasAccess: false,
        price: post.ppv_price,
        currency: post.ppv_currency || 'GHS'
      }
    });
  } catch (error: any) {
    console.error('PPV access check error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to check PPV access'
    });
  }
});

export default router;