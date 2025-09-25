var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc3) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc3 = __getOwnPropDesc(from, key)) || desc3.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  auditLogsRelations: () => auditLogsRelations,
  audit_logs: () => audit_logs,
  categories: () => categories,
  categoriesRelations: () => categoriesRelations,
  comment_likes: () => comment_likes,
  comments: () => comments,
  commentsRelations: () => commentsRelations,
  conversations: () => conversations,
  conversationsRelations: () => conversationsRelations,
  creatorCategoriesRelations: () => creatorCategoriesRelations,
  creatorFavoritesRelations: () => creatorFavoritesRelations,
  creatorLikesRelations: () => creatorLikesRelations,
  creatorPayoutSettingsRelations: () => creatorPayoutSettingsRelations,
  creatorPayoutsRelations: () => creatorPayoutsRelations,
  creator_categories: () => creator_categories,
  creator_favorites: () => creator_favorites,
  creator_likes: () => creator_likes,
  creator_payout_settings: () => creator_payout_settings,
  creator_payouts: () => creator_payouts,
  follows: () => follows,
  followsRelations: () => followsRelations,
  insertAuditLogSchema: () => insertAuditLogSchema,
  insertCategorySchema: () => insertCategorySchema,
  insertCommentSchema: () => insertCommentSchema,
  insertConversationSchema: () => insertConversationSchema,
  insertCreatorCategorySchema: () => insertCreatorCategorySchema,
  insertCreatorFavoriteSchema: () => insertCreatorFavoriteSchema,
  insertCreatorLikeSchema: () => insertCreatorLikeSchema,
  insertCreatorPayoutSettingsSchema: () => insertCreatorPayoutSettingsSchema,
  insertFollowSchema: () => insertFollowSchema,
  insertMessageSchema: () => insertMessageSchema,
  insertNotificationPreferencesSchema: () => insertNotificationPreferencesSchema,
  insertNotificationSchema: () => insertNotificationSchema,
  insertPaymentTransactionSchema: () => insertPaymentTransactionSchema,
  insertPendingSubscriptionChangeSchema: () => insertPendingSubscriptionChangeSchema,
  insertPostSchema: () => insertPostSchema,
  insertProrationCreditSchema: () => insertProrationCreditSchema,
  insertReportSchema: () => insertReportSchema,
  insertSubscriptionChangeSchema: () => insertSubscriptionChangeSchema,
  insertSubscriptionSchema: () => insertSubscriptionSchema,
  insertSubscriptionTierSchema: () => insertSubscriptionTierSchema,
  insertSystemAlertSchema: () => insertSystemAlertSchema,
  insertUserSchema: () => insertUserSchema,
  messages: () => messages,
  messagesRelations: () => messagesRelations,
  notificationPreferencesRelations: () => notificationPreferencesRelations,
  notification_preferences: () => notification_preferences,
  notifications: () => notifications,
  notificationsRelations: () => notificationsRelations,
  paymentTransactionsRelations: () => paymentTransactionsRelations,
  payment_transactions: () => payment_transactions,
  pendingSubscriptionChangesRelations: () => pendingSubscriptionChangesRelations,
  pending_subscription_changes: () => pending_subscription_changes,
  post_likes: () => post_likes,
  posts: () => posts,
  postsRelations: () => postsRelations,
  prorationCreditsRelations: () => prorationCreditsRelations,
  proration_credits: () => proration_credits,
  reports: () => reports,
  subscriptionChangesRelations: () => subscriptionChangesRelations,
  subscriptionTiersRelations: () => subscriptionTiersRelations,
  subscription_changes: () => subscription_changes,
  subscription_tiers: () => subscription_tiers,
  subscriptions: () => subscriptions,
  subscriptionsRelations: () => subscriptionsRelations,
  systemAlertsRelations: () => systemAlertsRelations,
  system_alerts: () => system_alerts,
  users: () => users,
  usersRelations: () => usersRelations
});
import { pgTable, text, serial, integer, boolean, timestamp, json, jsonb, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
var users, categories, creator_categories, posts, comments, comment_likes, post_likes, subscription_tiers, subscriptions, payment_transactions, creator_payouts, creator_payout_settings, reports, conversations, notifications, notification_preferences, messages, creator_likes, creator_favorites, follows, subscription_changes, pending_subscription_changes, proration_credits, audit_logs, system_alerts, usersRelations, postsRelations, commentsRelations, subscriptionTiersRelations, subscriptionsRelations, paymentTransactionsRelations, creatorPayoutsRelations, creatorPayoutSettingsRelations, conversationsRelations, messagesRelations, notificationsRelations, notificationPreferencesRelations, creatorLikesRelations, categoriesRelations, creatorCategoriesRelations, creatorFavoritesRelations, followsRelations, auditLogsRelations, systemAlertsRelations, subscriptionChangesRelations, pendingSubscriptionChangesRelations, prorationCreditsRelations, insertUserSchema, insertPostSchema, insertCommentSchema, insertSubscriptionTierSchema, insertSubscriptionSchema, insertPaymentTransactionSchema, insertReportSchema, insertCreatorPayoutSettingsSchema, insertConversationSchema, insertMessageSchema, insertNotificationSchema, insertNotificationPreferencesSchema, insertCategorySchema, insertCreatorCategorySchema, insertCreatorLikeSchema, insertCreatorFavoriteSchema, insertFollowSchema, insertSubscriptionChangeSchema, insertPendingSubscriptionChangeSchema, insertProrationCreditSchema, insertAuditLogSchema, insertSystemAlertSchema;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    users = pgTable("users", {
      id: serial("id").primaryKey(),
      username: text("username").notNull().unique(),
      email: text("email").notNull().unique(),
      password: text("password").notNull(),
      avatar: text("avatar"),
      role: text("role").notNull().default("fan"),
      // fan, creator, admin
      status: text("status").notNull().default("active"),
      // active, suspended
      display_name: text("display_name"),
      bio: text("bio"),
      cover_image: text("cover_image"),
      social_links: json("social_links").$type(),
      verified: boolean("verified").notNull().default(false),
      total_subscribers: integer("total_subscribers").notNull().default(0),
      total_followers: integer("total_followers").notNull().default(0),
      total_earnings: decimal("total_earnings", { precision: 10, scale: 2 }).notNull().default("0.00"),
      commission_rate: decimal("commission_rate", { precision: 5, scale: 2 }).notNull().default("0.15"),
      // 15% platform fee
      comments_enabled: boolean("comments_enabled").notNull().default(true),
      // Allow comments on posts
      auto_post_enabled: boolean("auto_post_enabled").notNull().default(false),
      // Auto-post to social media
      watermark_enabled: boolean("watermark_enabled").notNull().default(true),
      // Add watermark to images
      profile_discoverable: boolean("profile_discoverable").notNull().default(true),
      // Allow profile to appear in search results
      activity_status_visible: boolean("activity_status_visible").notNull().default(false),
      // Show when user is online
      is_online: boolean("is_online").notNull().default(false),
      // Current online status
      last_seen: timestamp("last_seen"),
      // Last activity timestamp
      primary_category_id: integer("primary_category_id").references(() => categories.id),
      created_at: timestamp("created_at").notNull().defaultNow(),
      updated_at: timestamp("updated_at").notNull().defaultNow()
    });
    categories = pgTable("categories", {
      id: serial("id").primaryKey(),
      name: text("name").notNull().unique(),
      slug: text("slug").notNull().unique(),
      description: text("description"),
      icon: text("icon").notNull(),
      // Lucide icon name
      color: text("color").notNull().default("#6366f1"),
      // Hex color for category
      is_active: boolean("is_active").notNull().default(true),
      created_at: timestamp("created_at").notNull().defaultNow(),
      updated_at: timestamp("updated_at").notNull().defaultNow()
    });
    creator_categories = pgTable("creator_categories", {
      id: serial("id").primaryKey(),
      creator_id: integer("creator_id").notNull().references(() => users.id),
      category_id: integer("category_id").notNull().references(() => categories.id),
      is_primary: boolean("is_primary").notNull().default(false),
      created_at: timestamp("created_at").notNull().defaultNow()
    });
    posts = pgTable("posts", {
      id: serial("id").primaryKey(),
      creator_id: integer("creator_id").notNull().references(() => users.id),
      title: text("title").notNull(),
      content: text("content"),
      media_type: text("media_type").notNull().default("text"),
      media_urls: text("media_urls").array().notNull().default([]),
      tier: text("tier").notNull().default("public"),
      status: text("status").notNull().default("published"),
      // published, draft, scheduled
      scheduled_for: timestamp("scheduled_for"),
      // when to publish scheduled posts
      likes_count: integer("likes_count").notNull().default(0),
      comments_count: integer("comments_count").notNull().default(0),
      views_count: integer("views_count").notNull().default(0),
      duration: integer("duration"),
      // duration in seconds
      created_at: timestamp("created_at").notNull().defaultNow(),
      updated_at: timestamp("updated_at").notNull().defaultNow()
    });
    comments = pgTable("comments", {
      id: serial("id").primaryKey(),
      post_id: integer("post_id").notNull().references(() => posts.id),
      user_id: integer("user_id").notNull().references(() => users.id),
      parent_id: integer("parent_id"),
      // for replies - self-reference added later
      content: text("content").notNull(),
      likes_count: integer("likes_count").notNull().default(0),
      created_at: timestamp("created_at").notNull().defaultNow(),
      updated_at: timestamp("updated_at").notNull().defaultNow()
    });
    comment_likes = pgTable("comment_likes", {
      id: serial("id").primaryKey(),
      comment_id: integer("comment_id").notNull().references(() => comments.id),
      user_id: integer("user_id").notNull().references(() => users.id),
      created_at: timestamp("created_at").notNull().defaultNow()
    });
    post_likes = pgTable("post_likes", {
      id: serial("id").primaryKey(),
      post_id: integer("post_id").notNull().references(() => posts.id),
      user_id: integer("user_id").notNull().references(() => users.id),
      created_at: timestamp("created_at").notNull().defaultNow()
    });
    subscription_tiers = pgTable("subscription_tiers", {
      id: serial("id").primaryKey(),
      creator_id: integer("creator_id").notNull().references(() => users.id),
      name: text("name").notNull(),
      description: text("description"),
      price: decimal("price", { precision: 10, scale: 2 }).notNull(),
      currency: text("currency").notNull().default("GHS"),
      benefits: jsonb("benefits").notNull().default(["Basic access"]),
      is_active: boolean("is_active").notNull().default(true),
      created_at: timestamp("created_at").notNull().defaultNow(),
      updated_at: timestamp("updated_at").notNull().defaultNow()
    });
    subscriptions = pgTable("subscriptions", {
      id: serial("id").primaryKey(),
      fan_id: integer("fan_id").notNull().references(() => users.id),
      creator_id: integer("creator_id").notNull().references(() => users.id),
      tier_id: integer("tier_id").notNull().references(() => subscription_tiers.id),
      status: text("status").notNull().default("active"),
      // active, paused, cancelled, expired
      started_at: timestamp("started_at").notNull().defaultNow(),
      ends_at: timestamp("ends_at"),
      auto_renew: boolean("auto_renew").notNull().default(true),
      next_billing_date: timestamp("next_billing_date"),
      previous_tier_id: integer("previous_tier_id").references(() => subscription_tiers.id),
      // For tracking tier changes
      billing_cycle_anchor: timestamp("billing_cycle_anchor"),
      // Original billing date for pro-rating
      proration_credit: decimal("proration_credit", { precision: 10, scale: 2 }).default("0.00"),
      // Credit from downgrades
      created_at: timestamp("created_at").notNull().defaultNow(),
      updated_at: timestamp("updated_at").notNull().defaultNow()
    });
    payment_transactions = pgTable("payment_transactions", {
      id: serial("id").primaryKey(),
      subscription_id: integer("subscription_id").notNull().references(() => subscriptions.id),
      amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
      currency: text("currency").notNull().default("GHS"),
      status: text("status").notNull().default("pending"),
      // pending, completed, failed, refunded
      payment_method: text("payment_method"),
      // stripe, paypal, etc.
      transaction_id: text("transaction_id"),
      // external payment processor transaction ID
      processed_at: timestamp("processed_at"),
      created_at: timestamp("created_at").notNull().defaultNow()
    });
    creator_payouts = pgTable("creator_payouts", {
      id: serial("id").primaryKey(),
      creator_id: integer("creator_id").notNull().references(() => users.id),
      amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
      currency: text("currency").notNull().default("GHS"),
      status: text("status").notNull().default("pending"),
      // pending, completed, failed
      period_start: timestamp("period_start").notNull(),
      period_end: timestamp("period_end").notNull(),
      payout_method: text("payout_method"),
      // mtn_momo, vodafone_cash, bank_transfer, etc.
      transaction_id: text("transaction_id"),
      // External payout provider transaction ID
      processed_at: timestamp("processed_at"),
      created_at: timestamp("created_at").notNull().defaultNow()
    });
    creator_payout_settings = pgTable("creator_payout_settings", {
      id: serial("id").primaryKey(),
      creator_id: integer("creator_id").notNull().unique().references(() => users.id),
      payout_method: text("payout_method").notNull(),
      // mtn_momo, vodafone_cash, bank_transfer, etc.
      // Mobile Money fields
      momo_provider: text("momo_provider"),
      // mtn, vodafone, airteltigo
      momo_phone: text("momo_phone"),
      momo_name: text("momo_name"),
      // Bank Transfer fields
      bank_name: text("bank_name"),
      account_number: text("account_number"),
      account_name: text("account_name"),
      // Other settings
      auto_withdraw_enabled: boolean("auto_withdraw_enabled").notNull().default(false),
      auto_withdraw_threshold: decimal("auto_withdraw_threshold", { precision: 10, scale: 2 }).default("500.00"),
      created_at: timestamp("created_at").notNull().defaultNow(),
      updated_at: timestamp("updated_at").notNull().defaultNow()
    });
    reports = pgTable("reports", {
      id: serial("id").primaryKey(),
      type: text("type").notNull(),
      // 'content', 'user', 'payment'
      reason: text("reason").notNull(),
      description: text("description"),
      reported_by: integer("reported_by").notNull().references(() => users.id),
      target_type: text("target_type").notNull(),
      // 'post', 'user', 'comment'
      target_id: integer("target_id").notNull(),
      target_name: text("target_name"),
      // Human readable target name
      status: text("status").notNull().default("pending"),
      // 'pending', 'under_review', 'resolved', 'dismissed'
      priority: text("priority").notNull().default("medium"),
      // 'low', 'medium', 'high'
      admin_notes: text("admin_notes"),
      resolved_by: integer("resolved_by").references(() => users.id),
      created_at: timestamp("created_at").notNull().defaultNow(),
      updated_at: timestamp("updated_at").notNull().defaultNow()
    });
    conversations = pgTable("conversations", {
      id: serial("id").primaryKey(),
      participant_1_id: integer("participant_1_id").notNull().references(() => users.id),
      participant_2_id: integer("participant_2_id").notNull().references(() => users.id),
      created_at: timestamp("created_at").notNull().defaultNow(),
      updated_at: timestamp("updated_at").notNull().defaultNow()
    });
    notifications = pgTable("notifications", {
      id: serial("id").primaryKey(),
      user_id: integer("user_id").notNull().references(() => users.id),
      type: text("type").notNull(),
      // 'new_subscriber', 'new_message', 'new_comment', 'new_post', 'payment_success', 'payment_failed', 'payout_completed', 'like'
      title: text("title").notNull(),
      message: text("message").notNull(),
      read: boolean("read").notNull().default(false),
      action_url: text("action_url"),
      // URL to navigate to when clicked
      actor_id: integer("actor_id").references(() => users.id),
      // ID of user who triggered the notification
      entity_type: text("entity_type"),
      // 'post', 'comment', 'subscription', 'message', 'payment'
      entity_id: integer("entity_id"),
      // ID of the related entity
      metadata: json("metadata").$type(),
      created_at: timestamp("created_at").notNull().defaultNow()
    });
    notification_preferences = pgTable("notification_preferences", {
      id: serial("id").primaryKey(),
      user_id: integer("user_id").notNull().unique().references(() => users.id),
      // Email notifications
      email_new_subscribers: boolean("email_new_subscribers").notNull().default(true),
      email_new_messages: boolean("email_new_messages").notNull().default(true),
      email_new_comments: boolean("email_new_comments").notNull().default(true),
      email_new_posts: boolean("email_new_posts").notNull().default(false),
      email_payments: boolean("email_payments").notNull().default(true),
      email_payouts: boolean("email_payouts").notNull().default(true),
      email_likes: boolean("email_likes").notNull().default(false),
      // In-app notifications
      app_new_subscribers: boolean("app_new_subscribers").notNull().default(true),
      app_new_messages: boolean("app_new_messages").notNull().default(true),
      app_new_comments: boolean("app_new_comments").notNull().default(true),
      app_new_posts: boolean("app_new_posts").notNull().default(true),
      app_payments: boolean("app_payments").notNull().default(true),
      app_payouts: boolean("app_payouts").notNull().default(true),
      app_likes: boolean("app_likes").notNull().default(true),
      // Push notifications (for future mobile app)
      push_enabled: boolean("push_enabled").notNull().default(false),
      push_new_messages: boolean("push_new_messages").notNull().default(false),
      push_new_subscribers: boolean("push_new_subscribers").notNull().default(false),
      created_at: timestamp("created_at").notNull().defaultNow(),
      updated_at: timestamp("updated_at").notNull().defaultNow()
    });
    messages = pgTable("messages", {
      id: serial("id").primaryKey(),
      conversation_id: integer("conversation_id").notNull().references(() => conversations.id),
      sender_id: integer("sender_id").notNull().references(() => users.id),
      recipient_id: integer("recipient_id").notNull().references(() => users.id),
      content: text("content").notNull(),
      read: boolean("read").notNull().default(false),
      created_at: timestamp("created_at").notNull().defaultNow(),
      updated_at: timestamp("updated_at").notNull().defaultNow()
    });
    creator_likes = pgTable("creator_likes", {
      id: serial("id").primaryKey(),
      fan_id: integer("fan_id").notNull().references(() => users.id),
      creator_id: integer("creator_id").notNull().references(() => users.id),
      created_at: timestamp("created_at").notNull().defaultNow()
    });
    creator_favorites = pgTable("creator_favorites", {
      id: serial("id").primaryKey(),
      fan_id: integer("fan_id").notNull().references(() => users.id),
      creator_id: integer("creator_id").notNull().references(() => users.id),
      created_at: timestamp("created_at").notNull().defaultNow()
    });
    follows = pgTable("follows", {
      id: serial("id").primaryKey(),
      follower_id: integer("follower_id").notNull().references(() => users.id),
      creator_id: integer("creator_id").notNull().references(() => users.id),
      created_at: timestamp("created_at").notNull().defaultNow()
    });
    subscription_changes = pgTable("subscription_changes", {
      id: serial("id").primaryKey(),
      subscription_id: integer("subscription_id").notNull().references(() => subscriptions.id),
      from_tier_id: integer("from_tier_id").references(() => subscription_tiers.id),
      to_tier_id: integer("to_tier_id").notNull().references(() => subscription_tiers.id),
      change_type: text("change_type").notNull(),
      // upgrade, downgrade, reactivate, pause, cancel
      proration_amount: decimal("proration_amount", { precision: 10, scale: 2 }).default("0.00"),
      effective_date: timestamp("effective_date").notNull().defaultNow(),
      billing_impact: text("billing_impact"),
      // immediate, next_cycle, prorated
      reason: text("reason"),
      // user_initiated, admin_action, system_auto
      metadata: json("metadata").$type(),
      created_at: timestamp("created_at").notNull().defaultNow()
    });
    pending_subscription_changes = pgTable("pending_subscription_changes", {
      id: serial("id").primaryKey(),
      subscription_id: integer("subscription_id").notNull().references(() => subscriptions.id),
      from_tier_id: integer("from_tier_id").notNull().references(() => subscription_tiers.id),
      to_tier_id: integer("to_tier_id").notNull().references(() => subscription_tiers.id),
      change_type: text("change_type").notNull(),
      // downgrade, upgrade, cancel
      scheduled_date: timestamp("scheduled_date").notNull(),
      // when change should take effect
      proration_amount: decimal("proration_amount", { precision: 10, scale: 2 }).default("0.00"),
      status: text("status").notNull().default("pending"),
      // pending, applied, cancelled
      created_at: timestamp("created_at").notNull().defaultNow()
    });
    proration_credits = pgTable("proration_credits", {
      id: serial("id").primaryKey(),
      subscription_id: integer("subscription_id").notNull().references(() => subscriptions.id),
      amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
      currency: text("currency").notNull().default("GHS"),
      credit_type: text("credit_type").notNull(),
      // upgrade_proration, downgrade_credit, refund
      description: text("description").notNull(),
      applied_to_payment_id: integer("applied_to_payment_id").references(() => payment_transactions.id),
      // which payment this credit was applied to
      status: text("status").notNull().default("pending"),
      // pending, applied, expired
      expires_at: timestamp("expires_at"),
      // when credit expires if not used
      created_at: timestamp("created_at").notNull().defaultNow(),
      applied_at: timestamp("applied_at")
    });
    audit_logs = pgTable("audit_logs", {
      id: serial("id").primaryKey(),
      user_id: integer("user_id").references(() => users.id),
      // null for system events
      action: text("action").notNull(),
      // create, update, delete, login, logout, etc.
      resource_type: text("resource_type").notNull(),
      // user, post, subscription, setting, etc.
      resource_id: text("resource_id"),
      // ID of the affected resource
      details: jsonb("details"),
      // JSON object with change details
      ip_address: text("ip_address"),
      user_agent: text("user_agent"),
      severity: text("severity").notNull().default("info"),
      // info, warning, error, critical
      status: text("status").notNull().default("success"),
      // success, failure, pending
      created_at: timestamp("created_at").notNull().defaultNow()
    });
    system_alerts = pgTable("system_alerts", {
      id: serial("id").primaryKey(),
      type: text("type").notNull(),
      // performance, security, error, maintenance
      severity: text("severity").notNull().default("medium"),
      // low, medium, high, critical
      title: text("title").notNull(),
      message: text("message").notNull(),
      source: text("source").notNull(),
      // api, database, authentication, etc.
      metadata: jsonb("metadata"),
      // Additional alert data
      status: text("status").notNull().default("active"),
      // active, acknowledged, resolved
      acknowledged_by: integer("acknowledged_by").references(() => users.id),
      acknowledged_at: timestamp("acknowledged_at"),
      resolved_by: integer("resolved_by").references(() => users.id),
      resolved_at: timestamp("resolved_at"),
      created_at: timestamp("created_at").notNull().defaultNow(),
      updated_at: timestamp("updated_at").notNull().defaultNow()
    });
    usersRelations = relations(users, ({ one, many }) => ({
      posts: many(posts),
      comments: many(comments),
      subscriptions: many(subscriptions),
      subscription_tiers: many(subscription_tiers),
      payment_transactions: many(payment_transactions),
      creator_payouts: many(creator_payouts),
      payout_settings: one(creator_payout_settings),
      sent_messages: many(messages, { relationName: "sentMessages" }),
      received_messages: many(messages, { relationName: "receivedMessages" }),
      notifications: many(notifications),
      notification_preferences: one(notification_preferences),
      liked_creators: many(creator_likes, { relationName: "fanLikes" }),
      creator_likes_received: many(creator_likes, { relationName: "creatorLikes" }),
      favorite_creators: many(creator_favorites, { relationName: "fanFavorites" }),
      creator_favorites_received: many(creator_favorites, { relationName: "creatorFavorites" }),
      following: many(follows, { relationName: "userFollowing" }),
      followers: many(follows, { relationName: "creatorFollowers" }),
      primary_category: one(categories, {
        fields: [users.primary_category_id],
        references: [categories.id]
      }),
      creator_categories: many(creator_categories)
    }));
    postsRelations = relations(posts, ({ one, many }) => ({
      creator: one(users, {
        fields: [posts.creator_id],
        references: [users.id]
      }),
      comments: many(comments),
      post_likes: many(post_likes)
    }));
    commentsRelations = relations(comments, ({ one, many }) => ({
      post: one(posts, {
        fields: [comments.post_id],
        references: [posts.id]
      }),
      user: one(users, {
        fields: [comments.user_id],
        references: [users.id]
      }),
      comment_likes: many(comment_likes)
    }));
    subscriptionTiersRelations = relations(subscription_tiers, ({ one, many }) => ({
      creator: one(users, {
        fields: [subscription_tiers.creator_id],
        references: [users.id]
      }),
      subscriptions: many(subscriptions)
    }));
    subscriptionsRelations = relations(subscriptions, ({ one, many }) => ({
      fan: one(users, {
        fields: [subscriptions.fan_id],
        references: [users.id]
      }),
      creator: one(users, {
        fields: [subscriptions.creator_id],
        references: [users.id]
      }),
      tier: one(subscription_tiers, {
        fields: [subscriptions.tier_id],
        references: [subscription_tiers.id]
      }),
      previous_tier: one(subscription_tiers, {
        fields: [subscriptions.previous_tier_id],
        references: [subscription_tiers.id]
      }),
      payment_transactions: many(payment_transactions),
      subscription_changes: many(subscription_changes),
      pending_changes: many(pending_subscription_changes),
      proration_credits: many(proration_credits)
    }));
    paymentTransactionsRelations = relations(payment_transactions, ({ one }) => ({
      subscription: one(subscriptions, {
        fields: [payment_transactions.subscription_id],
        references: [subscriptions.id]
      })
    }));
    creatorPayoutsRelations = relations(creator_payouts, ({ one }) => ({
      creator: one(users, {
        fields: [creator_payouts.creator_id],
        references: [users.id]
      })
    }));
    creatorPayoutSettingsRelations = relations(creator_payout_settings, ({ one }) => ({
      creator: one(users, {
        fields: [creator_payout_settings.creator_id],
        references: [users.id]
      })
    }));
    conversationsRelations = relations(conversations, ({ one, many }) => ({
      participant_1: one(users, {
        fields: [conversations.participant_1_id],
        references: [users.id]
      }),
      participant_2: one(users, {
        fields: [conversations.participant_2_id],
        references: [users.id]
      }),
      messages: many(messages)
    }));
    messagesRelations = relations(messages, ({ one }) => ({
      conversation: one(conversations, {
        fields: [messages.conversation_id],
        references: [conversations.id]
      }),
      sender: one(users, {
        fields: [messages.sender_id],
        references: [users.id]
      }),
      recipient: one(users, {
        fields: [messages.recipient_id],
        references: [users.id]
      })
    }));
    notificationsRelations = relations(notifications, ({ one }) => ({
      user: one(users, {
        fields: [notifications.user_id],
        references: [users.id]
      }),
      actor: one(users, {
        fields: [notifications.actor_id],
        references: [users.id]
      })
    }));
    notificationPreferencesRelations = relations(notification_preferences, ({ one }) => ({
      user: one(users, {
        fields: [notification_preferences.user_id],
        references: [users.id]
      })
    }));
    creatorLikesRelations = relations(creator_likes, ({ one }) => ({
      fan: one(users, {
        fields: [creator_likes.fan_id],
        references: [users.id]
      }),
      creator: one(users, {
        fields: [creator_likes.creator_id],
        references: [users.id]
      })
    }));
    categoriesRelations = relations(categories, ({ many }) => ({
      creator_categories: many(creator_categories),
      primary_users: many(users)
    }));
    creatorCategoriesRelations = relations(creator_categories, ({ one }) => ({
      creator: one(users, {
        fields: [creator_categories.creator_id],
        references: [users.id]
      }),
      category: one(categories, {
        fields: [creator_categories.category_id],
        references: [categories.id]
      })
    }));
    creatorFavoritesRelations = relations(creator_favorites, ({ one }) => ({
      fan: one(users, {
        fields: [creator_favorites.fan_id],
        references: [users.id]
      }),
      creator: one(users, {
        fields: [creator_favorites.creator_id],
        references: [users.id]
      })
    }));
    followsRelations = relations(follows, ({ one }) => ({
      follower: one(users, {
        fields: [follows.follower_id],
        references: [users.id]
      }),
      creator: one(users, {
        fields: [follows.creator_id],
        references: [users.id]
      })
    }));
    auditLogsRelations = relations(audit_logs, ({ one }) => ({
      user: one(users, {
        fields: [audit_logs.user_id],
        references: [users.id]
      })
    }));
    systemAlertsRelations = relations(system_alerts, ({ one }) => ({
      acknowledged_by_user: one(users, {
        fields: [system_alerts.acknowledged_by],
        references: [users.id]
      }),
      resolved_by_user: one(users, {
        fields: [system_alerts.resolved_by],
        references: [users.id]
      })
    }));
    subscriptionChangesRelations = relations(subscription_changes, ({ one }) => ({
      subscription: one(subscriptions, {
        fields: [subscription_changes.subscription_id],
        references: [subscriptions.id]
      }),
      from_tier: one(subscription_tiers, {
        fields: [subscription_changes.from_tier_id],
        references: [subscription_tiers.id]
      }),
      to_tier: one(subscription_tiers, {
        fields: [subscription_changes.to_tier_id],
        references: [subscription_tiers.id]
      })
    }));
    pendingSubscriptionChangesRelations = relations(pending_subscription_changes, ({ one }) => ({
      subscription: one(subscriptions, {
        fields: [pending_subscription_changes.subscription_id],
        references: [subscriptions.id]
      }),
      from_tier: one(subscription_tiers, {
        fields: [pending_subscription_changes.from_tier_id],
        references: [subscription_tiers.id]
      }),
      to_tier: one(subscription_tiers, {
        fields: [pending_subscription_changes.to_tier_id],
        references: [subscription_tiers.id]
      })
    }));
    prorationCreditsRelations = relations(proration_credits, ({ one }) => ({
      subscription: one(subscriptions, {
        fields: [proration_credits.subscription_id],
        references: [subscriptions.id]
      }),
      applied_payment: one(payment_transactions, {
        fields: [proration_credits.applied_to_payment_id],
        references: [payment_transactions.id]
      })
    }));
    insertUserSchema = createInsertSchema(users).pick({
      username: true,
      email: true,
      password: true,
      role: true,
      display_name: true,
      bio: true,
      cover_image: true,
      social_links: true,
      primary_category_id: true
    });
    insertPostSchema = createInsertSchema(posts).pick({
      creator_id: true,
      title: true,
      content: true,
      media_urls: true,
      media_type: true,
      tier: true
    });
    insertCommentSchema = createInsertSchema(comments).pick({
      post_id: true,
      user_id: true,
      parent_id: true,
      content: true
    });
    insertSubscriptionTierSchema = createInsertSchema(subscription_tiers).pick({
      creator_id: true,
      name: true,
      description: true,
      price: true,
      currency: true,
      benefits: true
    }).extend({
      price: z.union([z.string(), z.number()]).transform((val) => val.toString())
    });
    insertSubscriptionSchema = createInsertSchema(subscriptions).pick({
      fan_id: true,
      creator_id: true,
      tier_id: true,
      status: true,
      started_at: true,
      ends_at: true,
      auto_renew: true,
      next_billing_date: true
    }).extend({
      fan_id: z.number(),
      creator_id: z.number(),
      tier_id: z.number(),
      started_at: z.date().optional(),
      ends_at: z.date().optional().nullable(),
      next_billing_date: z.date().optional()
    });
    insertPaymentTransactionSchema = createInsertSchema(payment_transactions).pick({
      subscription_id: true,
      amount: true,
      currency: true,
      status: true,
      payment_method: true,
      transaction_id: true,
      processed_at: true
    });
    insertReportSchema = createInsertSchema(reports).pick({
      type: true,
      reason: true,
      description: true,
      reported_by: true,
      target_type: true,
      target_id: true,
      target_name: true,
      status: true,
      priority: true,
      admin_notes: true,
      resolved_by: true
    });
    insertCreatorPayoutSettingsSchema = createInsertSchema(creator_payout_settings).pick({
      creator_id: true,
      payout_method: true,
      momo_provider: true,
      momo_phone: true,
      momo_name: true,
      bank_name: true,
      account_number: true,
      account_name: true,
      auto_withdraw_enabled: true,
      auto_withdraw_threshold: true
    });
    insertConversationSchema = createInsertSchema(conversations).pick({
      participant_1_id: true,
      participant_2_id: true
    });
    insertMessageSchema = createInsertSchema(messages).pick({
      conversation_id: true,
      sender_id: true,
      recipient_id: true,
      content: true
    });
    insertNotificationSchema = createInsertSchema(notifications).pick({
      user_id: true,
      type: true,
      title: true,
      message: true,
      action_url: true,
      actor_id: true,
      entity_type: true,
      entity_id: true,
      metadata: true
    });
    insertNotificationPreferencesSchema = createInsertSchema(notification_preferences).pick({
      user_id: true,
      email_new_subscribers: true,
      email_new_messages: true,
      email_new_comments: true,
      email_new_posts: true,
      email_payments: true,
      email_payouts: true,
      email_likes: true,
      app_new_subscribers: true,
      app_new_messages: true,
      app_new_comments: true,
      app_new_posts: true,
      app_payments: true,
      app_payouts: true,
      app_likes: true,
      push_enabled: true,
      push_new_messages: true,
      push_new_subscribers: true
    });
    insertCategorySchema = createInsertSchema(categories).pick({
      name: true,
      slug: true,
      description: true,
      icon: true,
      color: true,
      is_active: true
    });
    insertCreatorCategorySchema = createInsertSchema(creator_categories).pick({
      creator_id: true,
      category_id: true,
      is_primary: true
    });
    insertCreatorLikeSchema = createInsertSchema(creator_likes).pick({
      fan_id: true,
      creator_id: true
    });
    insertCreatorFavoriteSchema = createInsertSchema(creator_favorites).pick({
      fan_id: true,
      creator_id: true
    });
    insertFollowSchema = createInsertSchema(follows).pick({
      follower_id: true,
      creator_id: true
    });
    insertSubscriptionChangeSchema = createInsertSchema(subscription_changes).pick({
      subscription_id: true,
      from_tier_id: true,
      to_tier_id: true,
      change_type: true,
      proration_amount: true,
      effective_date: true,
      billing_impact: true,
      reason: true,
      metadata: true
    });
    insertPendingSubscriptionChangeSchema = createInsertSchema(pending_subscription_changes).pick({
      subscription_id: true,
      from_tier_id: true,
      to_tier_id: true,
      change_type: true,
      scheduled_date: true,
      proration_amount: true,
      status: true
    });
    insertProrationCreditSchema = createInsertSchema(proration_credits).pick({
      subscription_id: true,
      amount: true,
      currency: true,
      credit_type: true,
      description: true,
      applied_to_payment_id: true,
      status: true,
      expires_at: true
    });
    insertAuditLogSchema = createInsertSchema(audit_logs).pick({
      user_id: true,
      action: true,
      resource_type: true,
      resource_id: true,
      details: true,
      ip_address: true,
      user_agent: true,
      severity: true,
      status: true
    });
    insertSystemAlertSchema = createInsertSchema(system_alerts).pick({
      type: true,
      severity: true,
      title: true,
      message: true,
      source: true,
      metadata: true,
      status: true,
      acknowledged_by: true,
      acknowledged_at: true,
      resolved_by: true,
      resolved_at: true
    });
  }
});

// server/db.ts
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
var pool, db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL must be set. Did you forget to provision a database?"
      );
    }
    console.log("Using PostgreSQL database");
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      // Reduced pool size for Replit environment stability
      min: 1,
      // Minimum connections
      idleTimeoutMillis: 3e4,
      // 30 seconds
      connectionTimeoutMillis: 1e4,
      // 10 seconds
      statement_timeout: 3e4,
      // 30 seconds
      query_timeout: 3e4,
      // 30 seconds
      allowExitOnIdle: false,
      // Keep pool alive
      keepAlive: true,
      // Enable TCP keep-alive
      keepAliveInitialDelayMillis: 5e3
      // 5 seconds
    });
    db = drizzle({ client: pool, schema: schema_exports });
    process.on("SIGINT", async () => {
      console.log("Closing database pool...");
      await pool.end();
      console.log("Database pool closed");
    });
    process.on("SIGTERM", async () => {
      console.log("Closing database pool...");
      await pool.end();
      console.log("Database pool closed");
    });
    console.log("Database setup completed successfully");
  }
});

// server/storage.ts
var storage_exports = {};
__export(storage_exports, {
  DatabaseStorage: () => DatabaseStorage,
  storage: () => storage
});
import { eq, and, sql, desc, gte, lte } from "drizzle-orm";
import bcrypt from "bcryptjs";
var DatabaseStorage, storage;
var init_storage = __esm({
  "server/storage.ts"() {
    "use strict";
    init_schema();
    init_db();
    DatabaseStorage = class {
      inMemoryGoals = /* @__PURE__ */ new Map();
      db;
      pool;
      // Added pool property
      constructor() {
        this.inMemoryGoals.set("creator_goals_1", {
          subscriberGoal: 30,
          revenueGoal: 1e3,
          postsGoal: 15,
          updated_at: /* @__PURE__ */ new Date()
        });
        this.db = db;
        this.pool = db;
      }
      async getUser(id) {
        const [user] = await db.select().from(users).where(eq(users.id, id));
        return user || void 0;
      }
      async getUserByUsername(username) {
        try {
          const [user] = await db.select().from(users).where(eq(users.username, username));
          return user || void 0;
        } catch (error) {
          console.error("Error getting user by username:", error);
          return void 0;
        }
      }
      async getUserByEmail(email) {
        try {
          const [user] = await db.select().from(users).where(eq(users.email, email));
          return user || void 0;
        } catch (error) {
          console.error("Error getting user by email:", error);
          return void 0;
        }
      }
      async getCreators() {
        return await db.select().from(users).where(
          and(
            eq(users.role, "creator"),
            eq(users.profile_discoverable, true)
          )
        );
      }
      async createUser(insertUser) {
        try {
          console.log("Creating user with data:", { ...insertUser, password: "[HIDDEN]" });
          const hashedPassword = await bcrypt.hash(insertUser.password, 10);
          const [user] = await db.insert(users).values({
            username: insertUser.username,
            email: insertUser.email,
            password: hashedPassword,
            role: insertUser.role,
            display_name: insertUser.display_name,
            bio: insertUser.bio,
            cover_image: insertUser.cover_image,
            social_links: insertUser.social_links || null,
            primary_category_id: insertUser.primary_category_id
          }).returning();
          console.log("User created successfully:", { ...user, password: "[HIDDEN]" });
          return user;
        } catch (error) {
          console.error("Error creating user:", error);
          throw new Error("Failed to create user account");
        }
      }
      async verifyPassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
      }
      async deleteUser(id) {
        try {
          await db.delete(posts).where(eq(posts.creator_id, id));
          await db.delete(comments).where(eq(comments.user_id, id));
          await db.delete(post_likes).where(eq(post_likes.user_id, id));
          await db.delete(comment_likes).where(eq(comment_likes.user_id, id));
          await db.delete(subscriptions).where(eq(subscriptions.fan_id, id));
          await db.delete(subscriptions).where(eq(subscriptions.creator_id, id));
          await db.delete(subscription_tiers).where(eq(subscription_tiers.creator_id, id));
          await db.delete(creator_favorites).where(eq(creator_favorites.fan_id, id));
          await db.delete(creator_favorites).where(eq(creator_favorites.creator_id, id));
          const result = await db.delete(users).where(eq(users.id, id));
          return (result.rowCount || 0) > 0;
        } catch (error) {
          console.error("Delete user error:", error);
          return false;
        }
      }
      async updateUser(id, updates) {
        const updateData = { ...updates, updated_at: /* @__PURE__ */ new Date() };
        if (updates.password) {
          updateData.password = await bcrypt.hash(updates.password, 10);
        }
        const [user] = await db.update(users).set(updateData).where(eq(users.id, id)).returning();
        return user || void 0;
      }
      async getPosts() {
        return await db.select().from(posts).orderBy(posts.created_at);
      }
      async getPost(id) {
        const [post] = await db.select().from(posts).where(eq(posts.id, id));
        return post || void 0;
      }
      async createPost(insertPost) {
        const [post] = await db.insert(posts).values({
          creator_id: insertPost.creator_id,
          title: insertPost.title,
          content: insertPost.content,
          media_urls: insertPost.media_urls || [],
          media_type: insertPost.media_type,
          tier: insertPost.tier
        }).returning();
        return post;
      }
      async updatePost(id, updates) {
        try {
          const [post] = await db.update(posts).set({ ...updates, updated_at: /* @__PURE__ */ new Date() }).where(eq(posts.id, id)).returning();
          return post || void 0;
        } catch (error) {
          console.error("Error updating post:", error);
          throw error;
        }
      }
      async deletePost(id) {
        try {
          const [deletedPost] = await db.delete(posts).where(eq(posts.id, id)).returning();
          return !!deletedPost;
        } catch (error) {
          console.error("Error deleting post:", error);
          throw error;
        }
      }
      async getComments(postId) {
        return await db.select().from(comments).where(eq(comments.post_id, postId)).orderBy(comments.created_at);
      }
      async getComment(id) {
        const [comment] = await db.select().from(comments).where(eq(comments.id, id));
        return comment || void 0;
      }
      async createComment(insertComment) {
        const [comment] = await db.insert(comments).values(insertComment).returning();
        await db.update(posts).set({ comments_count: sql`${posts.comments_count} + 1` }).where(eq(posts.id, insertComment.post_id));
        return comment;
      }
      async deleteComment(id) {
        const [comment] = await db.select().from(comments).where(eq(comments.id, id));
        if (!comment) return false;
        const result = await db.delete(comments).where(eq(comments.id, id));
        const success = (result.rowCount || 0) > 0;
        if (success) {
          await db.update(posts).set({ comments_count: sql`${posts.comments_count} - 1` }).where(eq(posts.id, comment.post_id));
        }
        return success;
      }
      async likePost(postId, userId) {
        try {
          await db.insert(post_likes).values({ post_id: postId, user_id: userId });
          await db.update(posts).set({ likes_count: sql`${posts.likes_count} + 1` }).where(eq(posts.id, postId));
          return true;
        } catch {
          return false;
        }
      }
      async unlikePost(postId, userId) {
        try {
          const result = await db.delete(post_likes).where(and(eq(post_likes.post_id, postId), eq(post_likes.user_id, userId)));
          if ((result.rowCount || 0) > 0) {
            await db.update(posts).set({ likes_count: sql`${posts.likes_count} - 1` }).where(eq(posts.id, postId));
            return true;
          }
          return false;
        } catch {
          return false;
        }
      }
      async isPostLiked(postId, userId) {
        const [like2] = await db.select().from(post_likes).where(and(eq(post_likes.post_id, postId), eq(post_likes.user_id, userId)));
        return !!like2;
      }
      async likeComment(commentId, userId) {
        try {
          await db.insert(comment_likes).values({ comment_id: commentId, user_id: userId });
          await db.update(comments).set({ likes_count: sql`${comments.likes_count} + 1` }).where(eq(comments.id, commentId));
          return true;
        } catch {
          return false;
        }
      }
      async unlikeComment(commentId, userId) {
        try {
          const result = await db.delete(comment_likes).where(and(eq(comment_likes.comment_id, commentId), eq(comment_likes.user_id, userId)));
          if ((result.rowCount || 0) > 0) {
            await db.update(comments).set({ likes_count: sql`${comments.likes_count} - 1` }).where(eq(comments.id, commentId));
            return true;
          }
          return false;
        } catch {
          return false;
        }
      }
      async isCommentLiked(commentId, userId) {
        const [like2] = await db.select().from(comment_likes).where(and(eq(comment_likes.comment_id, commentId), eq(comment_likes.user_id, userId)));
        return !!like2;
      }
      // Subscription system methods
      async getSubscriptionTiers(creatorId) {
        return await db.select().from(subscription_tiers).where(and(eq(subscription_tiers.creator_id, creatorId), eq(subscription_tiers.is_active, true))).orderBy(subscription_tiers.price);
      }
      async getSubscriptionTier(id) {
        const [tier] = await db.select().from(subscription_tiers).where(eq(subscription_tiers.id, id));
        return tier || void 0;
      }
      async createSubscriptionTier(tier) {
        try {
          console.log("Creating subscription tier with data:", tier);
          const [newTier] = await db.insert(subscription_tiers).values([tier]).returning();
          console.log("Subscription tier created successfully:", newTier);
          return newTier;
        } catch (error) {
          console.error("Error creating subscription tier:", error);
          throw new Error("Failed to create subscription tier");
        }
      }
      async updateSubscriptionTier(id, updates) {
        const [tier] = await db.update(subscription_tiers).set({ ...updates, updated_at: /* @__PURE__ */ new Date() }).where(eq(subscription_tiers.id, id)).returning();
        return tier || void 0;
      }
      async deleteSubscriptionTier(id) {
        const result = await db.delete(subscription_tiers).where(eq(subscription_tiers.id, id));
        return (result.rowCount || 0) > 0;
      }
      async getSubscriptions(userId) {
        return await db.select({
          id: subscriptions.id,
          status: subscriptions.status,
          current_period_end: subscriptions.ends_at,
          created_at: subscriptions.created_at,
          auto_renew: subscriptions.auto_renew,
          creator_id: subscriptions.creator_id,
          tier_id: subscriptions.tier_id,
          creator: {
            id: users.id,
            username: users.username,
            display_name: users.display_name,
            avatar: users.avatar || null,
            category: users.primary_category_id || "Uncategorized"
          },
          tier: {
            id: subscription_tiers.id,
            name: subscription_tiers.name,
            price: subscription_tiers.price,
            description: subscription_tiers.description
          },
          next_billing_date: subscriptions.ends_at
        }).from(subscriptions).innerJoin(users, eq(subscriptions.creator_id, users.id)).innerJoin(subscription_tiers, eq(subscriptions.tier_id, subscription_tiers.id)).where(eq(subscriptions.fan_id, userId)).orderBy(desc(subscriptions.created_at));
      }
      async getSubscription(id) {
        const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.id, id));
        return subscription || void 0;
      }
      async createSubscription(subscription) {
        const [newSubscription] = await db.insert(subscriptions).values(subscription).returning();
        await db.update(users).set({
          total_subscribers: sql`${users.total_subscribers} + 1`,
          updated_at: /* @__PURE__ */ new Date()
        }).where(eq(users.id, subscription.creator_id));
        return newSubscription;
      }
      async updateSubscription(id, updates) {
        const [subscription] = await db.update(subscriptions).set({ ...updates, updated_at: /* @__PURE__ */ new Date() }).where(eq(subscriptions.id, id)).returning();
        return subscription || void 0;
      }
      async cancelSubscription(id) {
        const [subscription] = await db.update(subscriptions).set({
          status: "cancelled",
          auto_renew: false,
          updated_at: /* @__PURE__ */ new Date()
        }).where(eq(subscriptions.id, id)).returning();
        if (subscription) {
          await db.update(users).set({
            total_subscribers: sql`${users.total_subscribers} - 1`,
            updated_at: /* @__PURE__ */ new Date()
          }).where(eq(users.id, subscription.creator_id));
          return true;
        }
        return false;
      }
      async getUserSubscriptionToCreator(fanId, creatorId) {
        try {
          const result = await db.select({
            id: subscriptions.id,
            fan_id: subscriptions.fan_id,
            creator_id: subscriptions.creator_id,
            tier_id: subscriptions.tier_id,
            status: subscriptions.status,
            auto_renew: subscriptions.auto_renew,
            started_at: subscriptions.started_at,
            ends_at: subscriptions.ends_at,
            next_billing_date: subscriptions.next_billing_date,
            created_at: subscriptions.created_at,
            updated_at: subscriptions.updated_at,
            creator_username: users.username,
            tier_name: subscription_tiers.name,
            tier_price: subscription_tiers.price
          }).from(subscriptions).innerJoin(users, eq(subscriptions.creator_id, users.id)).innerJoin(subscription_tiers, eq(subscriptions.tier_id, subscription_tiers.id)).where(
            and(
              eq(subscriptions.fan_id, fanId),
              eq(subscriptions.creator_id, creatorId),
              eq(subscriptions.status, "active")
            )
          ).orderBy(desc(subscriptions.created_at)).limit(1);
          return result[0] || null;
        } catch (error) {
          console.error("Error getting user subscription to creator:", error);
          throw error;
        }
      }
      async createPaymentTransaction(transaction) {
        const [newTransaction] = await db.insert(payment_transactions).values(transaction).returning();
        return newTransaction;
      }
      async getCreatorSubscribers(creatorId) {
        try {
          const result = await db.select({
            id: subscriptions.id,
            fan_id: subscriptions.fan_id,
            creator_id: subscriptions.creator_id,
            tier_id: subscriptions.tier_id,
            status: subscriptions.status,
            auto_renew: subscriptions.auto_renew,
            started_at: subscriptions.started_at,
            ended_at: subscriptions.ends_at,
            next_billing_date: subscriptions.next_billing_date,
            created_at: subscriptions.created_at,
            updated_at: subscriptions.updated_at,
            username: users.username,
            email: users.email,
            display_name: users.display_name,
            avatar: users.avatar
          }).from(subscriptions).innerJoin(users, eq(subscriptions.fan_id, users.id)).where(
            and(
              eq(subscriptions.creator_id, creatorId),
              eq(subscriptions.status, "active")
            )
          ).orderBy(desc(subscriptions.created_at));
          return result.map((row) => ({
            id: row.id,
            fan_id: row.fan_id,
            creator_id: row.creator_id,
            tier_id: row.tier_id,
            status: row.status,
            auto_renew: row.auto_renew,
            started_at: row.started_at,
            ended_at: row.ended_at,
            next_billing_date: row.next_billing_date,
            created_at: row.created_at,
            updated_at: row.updated_at,
            fan: {
              username: row.username,
              email: row.email,
              display_name: row.display_name,
              avatar: row.avatar
            }
          }));
        } catch (error) {
          console.error("Error in getCreatorSubscribers:", error);
          return [];
        }
      }
      // Phase 1 Subscription Management Methods
      async switchSubscriptionTier(subscriptionId, newTierId, prorationAmount = 0) {
        try {
          const [currentSubscription] = await db.select().from(subscriptions).where(eq(subscriptions.id, subscriptionId));
          const [newTier] = await db.select().from(subscription_tiers).where(eq(subscription_tiers.id, newTierId));
          if (!currentSubscription || !newTier) {
            throw new Error("Subscription or tier not found");
          }
          const [updatedSubscription] = await db.update(subscriptions).set({
            previous_tier_id: currentSubscription.tier_id,
            tier_id: newTierId,
            proration_credit: prorationAmount < 0 ? Math.abs(prorationAmount).toString() : "0.00",
            updated_at: /* @__PURE__ */ new Date()
          }).where(eq(subscriptions.id, subscriptionId)).returning();
          await this.createSubscriptionChange({
            subscription_id: subscriptionId,
            from_tier_id: currentSubscription.tier_id,
            to_tier_id: newTierId,
            change_type: parseFloat(newTier.price) > parseFloat(currentSubscription.tier_id.toString()) ? "upgrade" : "downgrade",
            proration_amount: prorationAmount.toString(),
            effective_date: /* @__PURE__ */ new Date(),
            billing_impact: "immediate",
            reason: "user_initiated"
          });
          return updatedSubscription;
        } catch (error) {
          console.error("Error switching subscription tier:", error);
          return void 0;
        }
      }
      async calculateProration(subscriptionId, newTierId) {
        try {
          const subscription = await this.getSubscription(subscriptionId);
          const newTier = await this.getSubscriptionTier(newTierId);
          const currentTier = subscription ? await this.getSubscriptionTier(subscription.tier_id) : null;
          if (!subscription || !newTier || !currentTier) {
            return { prorationAmount: 0, isUpgrade: false, daysRemaining: 0 };
          }
          const now = /* @__PURE__ */ new Date();
          const nextBilling = subscription.next_billing_date ? new Date(subscription.next_billing_date) : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1e3);
          const daysRemaining = Math.ceil((nextBilling.getTime() - now.getTime()) / (24 * 60 * 60 * 1e3));
          const currentPrice = parseFloat(currentTier.price);
          const newPrice = parseFloat(newTier.price);
          const isUpgrade = newPrice > currentPrice;
          const dailyDifference = (newPrice - currentPrice) / 30;
          const prorationAmount = dailyDifference * daysRemaining;
          return {
            prorationAmount,
            isUpgrade,
            daysRemaining
          };
        } catch (error) {
          console.error("Error calculating proration:", error);
          return { prorationAmount: 0, isUpgrade: false, daysRemaining: 0 };
        }
      }
      async createSubscriptionChange(change) {
        const [newChange] = await db.insert(subscription_changes).values(change).returning();
        return newChange;
      }
      async getSubscriptionChangeHistory(subscriptionId) {
        return await db.select().from(subscription_changes).where(eq(subscription_changes.subscription_id, subscriptionId)).orderBy(desc(subscription_changes.created_at));
      }
      async createPendingSubscriptionChange(change) {
        const [newChange] = await db.insert(pending_subscription_changes).values(change).returning();
        return newChange;
      }
      async getPendingSubscriptionChanges(subscriptionId) {
        return await db.select().from(pending_subscription_changes).where(and(
          eq(pending_subscription_changes.subscription_id, subscriptionId),
          eq(pending_subscription_changes.status, "pending")
        )).orderBy(pending_subscription_changes.scheduled_date);
      }
      async applyPendingSubscriptionChange(changeId) {
        try {
          const [change] = await db.select().from(pending_subscription_changes).where(eq(pending_subscription_changes.id, changeId));
          if (!change || change.status !== "pending") {
            return false;
          }
          await this.switchSubscriptionTier(
            change.subscription_id,
            change.to_tier_id,
            parseFloat(change.proration_amount || "0")
          );
          await db.update(pending_subscription_changes).set({ status: "applied" }).where(eq(pending_subscription_changes.id, changeId));
          return true;
        } catch (error) {
          console.error("Error applying pending subscription change:", error);
          return false;
        }
      }
      async cancelPendingSubscriptionChange(changeId) {
        try {
          const result = await db.update(pending_subscription_changes).set({ status: "cancelled" }).where(eq(pending_subscription_changes.id, changeId));
          return (result.rowCount || 0) > 0;
        } catch (error) {
          console.error("Error cancelling pending subscription change:", error);
          return false;
        }
      }
      async createProrationCredit(credit) {
        const [newCredit] = await db.insert(proration_credits).values(credit).returning();
        return newCredit;
      }
      async getProrationCredits(subscriptionId) {
        return await db.select().from(proration_credits).where(eq(proration_credits.subscription_id, subscriptionId)).orderBy(desc(proration_credits.created_at));
      }
      async applyProrationCredit(creditId, paymentId) {
        try {
          const result = await db.update(proration_credits).set({
            applied_to_payment_id: paymentId,
            status: "applied",
            applied_at: /* @__PURE__ */ new Date()
          }).where(eq(proration_credits.id, creditId));
          return (result.rowCount || 0) > 0;
        } catch (error) {
          console.error("Error applying proration credit:", error);
          return false;
        }
      }
      async getSubscriptionTierPerformance(creatorId) {
        try {
          const tiers = await db.select().from(subscription_tiers).where(and(
            eq(subscription_tiers.creator_id, creatorId),
            eq(subscription_tiers.is_active, true)
          )).orderBy(subscription_tiers.price);
          const tierPerformance = await Promise.all(
            tiers.map(async (tier) => {
              const subscriberCountResult = await db.select({ count: sql`count(*)` }).from(subscriptions).where(and(
                eq(subscriptions.creator_id, creatorId),
                eq(subscriptions.tier_id, tier.id),
                eq(subscriptions.status, "active")
              ));
              const subscriberCount = subscriberCountResult[0]?.count || 0;
              const subscribers = Number(subscriberCount);
              const monthlyRevenue = subscribers * parseFloat(tier.price);
              return {
                name: tier.name,
                price: parseFloat(tier.price),
                subscribers,
                revenue: monthlyRevenue,
                tier_id: tier.id
              };
            })
          );
          return tierPerformance;
        } catch (error) {
          console.error("Error getting subscription tier performance:", error);
          return [];
        }
      }
      async getPaymentTransactions(subscriptionId) {
        return await db.select().from(payment_transactions).where(eq(payment_transactions.subscription_id, subscriptionId)).orderBy(desc(payment_transactions.created_at));
      }
      // Get creator subscription tiers
      async getCreatorTiers(creatorId) {
        return db.select().from(subscription_tiers).where(eq(subscription_tiers.creator_id, creatorId));
      }
      // Get specific subscription tier (renamed to avoid duplicate)
      async getSubscriptionTierById(tierId) {
        const result = await db.select().from(subscription_tiers).where(eq(subscription_tiers.id, tierId));
        return result[0];
      }
      // Payout-related methods
      async createCreatorPayout(data) {
        const result = await db.insert(creator_payouts).values(data).returning();
        return result[0];
      }
      async updateCreatorPayoutStatus(payoutId, status, transactionId) {
        const updateData = { status };
        if (status === "completed") {
          updateData.processed_at = /* @__PURE__ */ new Date();
        }
        if (transactionId) {
          updateData.transaction_id = transactionId;
        }
        await db.update(creator_payouts).set(updateData).where(eq(creator_payouts.id, payoutId));
      }
      async getCreatorPayouts(creatorId, limit = 10) {
        return await db.select().from(creator_payouts).where(eq(creator_payouts.creator_id, creatorId)).orderBy(desc(creator_payouts.created_at)).limit(limit);
      }
      async getCreatorPaymentTransactions(creatorId, startDate, endDate) {
        return db.select({
          id: payment_transactions.id,
          amount: payment_transactions.amount,
          currency: payment_transactions.currency,
          processed_at: payment_transactions.processed_at,
          subscription_id: payment_transactions.subscription_id
        }).from(payment_transactions).innerJoin(subscriptions, eq(payment_transactions.subscription_id, subscriptions.id)).where(
          and(
            eq(subscriptions.creator_id, creatorId),
            eq(payment_transactions.status, "completed"),
            gte(payment_transactions.processed_at, startDate),
            lte(payment_transactions.processed_at, endDate)
          )
        );
      }
      async getAllCreators() {
        return db.select().from(users).where(eq(users.role, "creator"));
      }
      async getCreatorPayoutSettings(creatorId) {
        try {
          const [settings] = await db.select().from(creator_payout_settings).where(eq(creator_payout_settings.creator_id, creatorId));
          return settings || void 0;
        } catch (error) {
          console.error("Error fetching payout settings:", error);
          return void 0;
        }
      }
      async saveCreatorPayoutSettings(settings) {
        try {
          const [existingSetting] = await db.select().from(creator_payout_settings).where(eq(creator_payout_settings.creator_id, settings.creator_id));
          if (existingSetting) {
            const [updated] = await db.update(creator_payout_settings).set({ ...settings, updated_at: /* @__PURE__ */ new Date() }).where(eq(creator_payout_settings.creator_id, settings.creator_id)).returning();
            return updated;
          } else {
            const [created] = await db.insert(creator_payout_settings).values(settings).returning();
            return created;
          }
        } catch (error) {
          console.error("Error saving payout settings:", error);
          throw error;
        }
      }
      async updateCreatorPayoutSettings(creatorId, updates) {
        try {
          const [updated] = await db.update(creator_payout_settings).set({ ...updates, updated_at: /* @__PURE__ */ new Date() }).where(eq(creator_payout_settings.creator_id, creatorId)).returning();
          return updated || void 0;
        } catch (error) {
          console.error("Error updating payout settings:", error);
          return void 0;
        }
      }
      async getCreatorPayoutStats(creatorId) {
        try {
          const payouts = await db.select().from(creator_payouts).where(eq(creator_payouts.creator_id, creatorId));
          let totalPaid = 0;
          let totalPending = 0;
          let completedCount = 0;
          let pendingCount = 0;
          payouts.forEach((payout) => {
            const amount = parseFloat(payout.amount);
            if (payout.status === "completed") {
              totalPaid += amount;
              completedCount++;
            } else if (payout.status === "pending") {
              totalPending += amount;
              pendingCount++;
            }
          });
          return {
            total_paid: totalPaid,
            total_pending: totalPending,
            completed_count: completedCount,
            pending_count: pendingCount,
            last_payout: payouts.find((p) => p.status === "completed")?.processed_at || null
          };
        } catch (error) {
          console.error("Error getting creator payout stats:", error);
          return {
            total_paid: 0,
            total_pending: 0,
            completed_count: 0,
            pending_count: 0,
            last_payout: null
          };
        }
      }
      async getAllPayoutStats() {
        try {
          const payouts = await db.select().from(creator_payouts);
          let totalPaid = 0;
          let totalPending = 0;
          let completedCount = 0;
          let pendingCount = 0;
          payouts.forEach((payout) => {
            const amount = parseFloat(payout.amount);
            if (payout.status === "completed") {
              totalPaid += amount;
              completedCount++;
            } else if (payout.status === "pending") {
              totalPending += amount;
              pendingCount++;
            }
          });
          return {
            total_paid: totalPaid,
            total_pending: totalPending,
            completed_count: completedCount,
            pending_count: pendingCount,
            total_creators: await db.select().from(users).where(eq(users.role, "creator")).then((r) => r.length)
          };
        } catch (error) {
          console.error("Error getting all payout stats:", error);
          return {
            total_paid: 0,
            total_pending: 0,
            completed_count: 0,
            pending_count: 0,
            total_creators: 0
          };
        }
      }
      async getPlatformStats() {
        try {
          const totalUsers = await db.select({ count: sql`count(*)` }).from(users);
          const totalCreators = await db.select({ count: sql`count(*)` }).from(users).where(eq(users.role, "creator"));
          const totalFans = await db.select({ count: sql`count(*)` }).from(users).where(eq(users.role, "fan"));
          const activeSubscriptions = await db.select({ count: sql`count(*)` }).from(subscriptions).where(eq(subscriptions.status, "active"));
          const revenueResult = await db.select({
            total: sql`COALESCE(SUM(amount), 0)`
          }).from(payment_transactions).where(eq(payment_transactions.status, "completed"));
          const totalRevenue = parseFloat(revenueResult[0]?.total || "0");
          const platformFees = totalRevenue * 0.15;
          const pendingReports = await db.select({ count: sql`count(*)` }).from(reports).where(eq(reports.status, "pending"));
          const approvedReports = await db.select({ count: sql`count(*)` }).from(reports).where(eq(reports.status, "resolved"));
          const rejectedReports = await db.select({ count: sql`count(*)` }).from(reports).where(eq(reports.status, "dismissed"));
          return {
            totalUsers: totalUsers[0]?.count || 0,
            totalCreators: totalCreators[0]?.count || 0,
            totalFans: totalFans[0]?.count || 0,
            monthlyRevenue: totalRevenue,
            platformFees,
            activeSubscriptions: activeSubscriptions[0]?.count || 0,
            contentModeration: {
              pending: pendingReports[0]?.count || 0,
              approved: approvedReports[0]?.count || 0,
              rejected: rejectedReports[0]?.count || 0
            }
          };
        } catch (error) {
          console.error("Error getting platform stats:", error);
          throw error;
        }
      }
      async getTopCreators(limit = 5) {
        try {
          const topCreators = await db.select({
            id: users.id,
            username: users.username,
            display_name: users.display_name,
            total_subscribers: users.total_subscribers,
            total_earnings: users.total_earnings,
            verified: users.verified
          }).from(users).where(eq(users.role, "creator")).orderBy(desc(users.total_earnings)).limit(limit);
          return topCreators.map((creator) => ({
            id: creator.id.toString(),
            username: creator.username,
            display_name: creator.display_name || creator.username,
            subscribers: creator.total_subscribers,
            monthly_revenue: parseFloat(creator.total_earnings || "0"),
            status: creator.verified ? "verified" : "pending"
          }));
        } catch (error) {
          console.error("Error getting top creators:", error);
          return [];
        }
      }
      async getPlatformSettings() {
        try {
          const result = await db.execute(sql`
        SELECT value FROM platform_settings WHERE key = 'commission_rate'
      `);
          const commissionRate = result.rows[0]?.value || "0.05";
          return {
            commission_rate: parseFloat(commissionRate),
            site_name: "Xclusive",
            site_description: "Premium content monetization platform",
            maintenance_mode: false,
            new_user_registration: true
          };
        } catch (error) {
          console.error("Error getting platform settings:", error);
          return {
            commission_rate: 0.05,
            site_name: "Xclusive",
            site_description: "Premium content monetization platform",
            maintenance_mode: false,
            new_user_registration: true
          };
        }
      }
      async updatePlatformSettings(settings) {
        try {
          await db.execute(sql`
        CREATE TABLE IF NOT EXISTS platform_settings (
          key VARCHAR(255) PRIMARY KEY,
          value TEXT,
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);
          await db.execute(sql`
        INSERT INTO platform_settings (key, value, updated_at)
        VALUES ('commission_rate', ${settings.commission_rate.toString()}, NOW())
        ON CONFLICT (key) DO UPDATE SET
          value = EXCLUDED.value,
          updated_at = EXCLUDED.updated_at
      `);
        } catch (error) {
          console.error("Error updating platform settings:", error);
          throw error;
        }
      }
      async getCreatorGoals(creatorId) {
        try {
          const goalsKey = `creator_goals_${creatorId}`;
          const storedGoals = this.inMemoryGoals.get(goalsKey);
          return storedGoals || {
            subscriberGoal: 30,
            revenueGoal: 1e3,
            postsGoal: 15
          };
        } catch (error) {
          console.error("Error getting creator goals:", error);
          return {
            subscriberGoal: 30,
            revenueGoal: 1e3,
            postsGoal: 15
          };
        }
      }
      async saveCreatorGoals(creatorId, goals) {
        try {
          const goalsKey = `creator_goals_${creatorId}`;
          this.inMemoryGoals.set(goalsKey, {
            ...goals,
            updated_at: /* @__PURE__ */ new Date()
          });
          console.log(`Saved goals for creator ${creatorId}:`, goals);
        } catch (error) {
          console.error("Error saving creator goals:", error);
          throw error;
        }
      }
      // Report methods
      async createReport(report) {
        try {
          const [newReport] = await db.insert(reports).values(report).returning();
          return newReport;
        } catch (error) {
          console.error("Error creating report:", error);
          throw error;
        }
      }
      async getReports() {
        try {
          return await db.select().from(reports).orderBy(desc(reports.created_at));
        } catch (error) {
          console.error("Error getting reports:", error);
          return [];
        }
      }
      async updateReportStatus(reportId, status, adminNotes, resolvedBy) {
        try {
          const updates = {
            status,
            updated_at: /* @__PURE__ */ new Date()
          };
          if (adminNotes !== void 0) updates.admin_notes = adminNotes;
          if (resolvedBy !== void 0) updates.resolved_by = resolvedBy;
          const [updatedReport] = await db.update(reports).set(updates).where(eq(reports.id, reportId)).returning();
          return updatedReport;
        } catch (error) {
          console.error("Error updating report status:", error);
          throw error;
        }
      }
      // Messaging methods
      async getConversations(userId) {
        try {
          return [];
        } catch (error) {
          console.error("Error fetching conversations:", error);
          return [];
        }
      }
      async getConversation(participant1Id, participant2Id) {
        try {
          return void 0;
        } catch (error) {
          console.error("Error fetching conversation:", error);
          return void 0;
        }
      }
      async createConversation(conversation) {
        throw new Error("Conversations feature not yet implemented");
      }
      async getMessages(conversationId) {
        try {
          return [];
        } catch (error) {
          console.error("Error fetching messages:", error);
          return [];
        }
      }
      async sendMessage(message) {
        throw new Error("Messaging feature not yet implemented");
      }
      async markMessagesAsRead(conversationId, userId) {
      }
      // Notification methods
      async getNotifications(userId, limit = 20) {
        try {
          return await db.select().from(notifications).where(eq(notifications.user_id, userId)).orderBy(desc(notifications.created_at)).limit(limit);
        } catch (error) {
          console.error("Error fetching notifications:", error);
          return [];
        }
      }
      async getUnreadNotificationCount(userId) {
        try {
          const result = await db.select({ count: sql`count(*)` }).from(notifications).where(and(eq(notifications.user_id, userId), eq(notifications.read, false)));
          return result[0]?.count || 0;
        } catch (error) {
          console.error("Error getting unread notification count:", error);
          return 0;
        }
      }
      async createNotification(notification) {
        try {
          const [newNotification] = await db.insert(notifications).values(notification).returning();
          return newNotification;
        } catch (error) {
          console.error("Error creating notification:", error);
          throw new Error("Failed to create notification");
        }
      }
      async markNotificationAsRead(notificationId) {
        try {
          const result = await db.update(notifications).set({ read: true }).where(eq(notifications.id, notificationId));
          return (result.rowCount || 0) > 0;
        } catch (error) {
          console.error("Error marking notification as read:", error);
          return false;
        }
      }
      async markAllNotificationsAsRead(userId) {
        try {
          const result = await db.update(notifications).set({ read: true }).where(and(eq(notifications.user_id, userId), eq(notifications.read, false)));
          return (result.rowCount || 0) > 0;
        } catch (error) {
          console.error("Error marking all notifications as read:", error);
          return false;
        }
      }
      async deleteNotification(notificationId) {
        try {
          return false;
        } catch (error) {
          console.error("Error deleting notification:", error);
          return false;
        }
      }
      // Notification preferences methods
      async getNotificationPreferences(userId) {
        try {
          const [prefs] = await db.select().from(notification_preferences).where(eq(notification_preferences.user_id, userId)).limit(1);
          return prefs;
        } catch (error) {
          console.error("Error fetching notification preferences:", error);
          return void 0;
        }
      }
      async createNotificationPreferences(preferences) {
        const [prefs] = await db.insert(notification_preferences).values(preferences).returning();
        return prefs;
      }
      async updateNotificationPreferences(userId, updates) {
        try {
          const [updatedPrefs] = await db.update(notification_preferences).set({ ...updates, updated_at: /* @__PURE__ */ new Date() }).where(eq(notification_preferences.user_id, userId)).returning();
          return updatedPrefs;
        } catch (error) {
          console.error("Error updating notification preferences:", error);
          return void 0;
        }
      }
      async getSystemHealth() {
        try {
          const startTime = Date.now();
          await db.select({ count: sql`count(*)` }).from(users).limit(1);
          const dbResponseTime = Date.now() - startTime;
          const serverPerformance = Math.max(85, Math.min(99, 100 - Math.floor(Math.random() * 15)));
          const databaseHealth = dbResponseTime < 100 ? 98 : dbResponseTime < 500 ? 85 : 70;
          const apiResponseTime = Math.max(50, Math.min(300, dbResponseTime + Math.floor(Math.random() * 100)));
          return {
            server_performance: serverPerformance,
            database_health: databaseHealth,
            api_response_time: apiResponseTime,
            last_updated: /* @__PURE__ */ new Date()
          };
        } catch (error) {
          console.error("Error getting system health:", error);
          return {
            server_performance: 50,
            database_health: 30,
            api_response_time: 1e3,
            last_updated: /* @__PURE__ */ new Date()
          };
        }
      }
      async getUserSettings(userId) {
        try {
          const [user] = await this.db.select({
            comments_enabled: users.comments_enabled,
            auto_post_enabled: users.auto_post_enabled,
            watermark_enabled: users.watermark_enabled,
            profile_discoverable: users.profile_discoverable,
            activity_status_visible: users.activity_status_visible
          }).from(users).where(eq(users.id, userId)).limit(1);
          return user;
        } catch (error) {
          console.error("Error fetching user settings:", error);
          throw error;
        }
      }
      async updateUserProfile(userId, profileData) {
        try {
          const updates = { ...profileData, updated_at: /* @__PURE__ */ new Date() };
          const [updatedUser] = await this.db.update(users).set(updates).where(eq(users.id, userId)).returning();
          return updatedUser;
        } catch (error) {
          console.error("Error updating user profile:", error);
          throw error;
        }
      }
      // Category methods implementation
      async getCategories(includeInactive = false) {
        try {
          if (includeInactive) {
            return await this.db.select().from(categories).orderBy(categories.name);
          }
          return await this.db.select().from(categories).where(eq(categories.is_active, true)).orderBy(categories.name);
        } catch (error) {
          console.error("Error getting categories:", error);
          throw error;
        }
      }
      async getActiveCategories() {
        try {
          const result = await db.select().from(categories).where(eq(categories.is_active, true)).orderBy(categories.name);
          return result;
        } catch (error) {
          console.error("Error getting active categories:", error);
          throw error;
        }
      }
      async getCategory(id) {
        try {
          const [category] = await db.select().from(categories).where(eq(categories.id, id));
          return category || void 0;
        } catch (error) {
          console.error("Error getting category:", error);
          throw error;
        }
      }
      async getCategoryBySlug(slug) {
        try {
          const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
          return category || void 0;
        } catch (error) {
          console.error("Error getting category by slug:", error);
          throw error;
        }
      }
      async createCategory(categoryData) {
        try {
          const [category] = await this.db.insert(categories).values(categoryData).returning();
          return category;
        } catch (error) {
          console.error("Error creating category:", error);
          throw error;
        }
      }
      async updateCategory(categoryId, categoryData) {
        try {
          const [updated] = await this.db.update(categories).set({ ...categoryData, updated_at: /* @__PURE__ */ new Date() }).where(eq(categories.id, categoryId)).returning();
          return updated;
        } catch (error) {
          console.error("Error updating category:", error);
          throw error;
        }
      }
      async deleteCategory(categoryId) {
        try {
          const [creatorCount] = await this.db.select({ count: sql`count(*)` }).from(creator_categories).where(eq(creator_categories.category_id, categoryId));
          if (creatorCount.count > 0) {
            return false;
          }
          await this.db.delete(categories).where(eq(categories.id, categoryId));
          return true;
        } catch (error) {
          console.error("Error deleting category:", error);
          throw error;
        }
      }
      async toggleCategoryStatus(categoryId) {
        try {
          const [category] = await this.db.select().from(categories).where(eq(categories.id, categoryId));
          if (!category) return void 0;
          const [updated] = await this.db.update(categories).set({
            is_active: !category.is_active,
            updated_at: /* @__PURE__ */ new Date()
          }).where(eq(categories.id, categoryId)).returning();
          return updated;
        } catch (error) {
          console.error("Error toggling category status:", error);
          throw error;
        }
      }
      // Creator category methods implementation
      async getCreatorCategories(creatorId) {
        try {
          return await this.db.select({
            id: creator_categories.id,
            category_id: creator_categories.category_id,
            is_primary: creator_categories.is_primary,
            category_name: categories.name,
            category_description: categories.description,
            category_icon: categories.icon,
            category_color: categories.color,
            created_at: creator_categories.created_at
          }).from(creator_categories).innerJoin(categories, eq(creator_categories.category_id, categories.id)).where(eq(creator_categories.creator_id, creatorId)).orderBy(desc(creator_categories.is_primary), categories.name);
        } catch (error) {
          console.error("Error getting creator categories:", error);
          throw error;
        }
      }
      async getCreatorPrimaryCategory(creatorId) {
        try {
          const [result] = await db.select({
            id: categories.id,
            name: categories.name,
            slug: categories.slug,
            description: categories.description,
            icon: categories.icon,
            color: categories.color,
            is_active: categories.is_active,
            created_at: categories.created_at,
            updated_at: categories.updated_at
          }).from(creator_categories).innerJoin(categories, eq(creator_categories.category_id, categories.id)).where(and(
            eq(creator_categories.creator_id, creatorId),
            eq(creator_categories.is_primary, true)
          ));
          return result || void 0;
        } catch (error) {
          console.error("Error getting creator primary category:", error);
          throw error;
        }
      }
      async addCreatorToCategory(creatorCategory) {
        try {
          const [newCreatorCategory] = await db.insert(creator_categories).values(creatorCategory).returning();
          return newCreatorCategory;
        } catch (error) {
          console.error("Error adding creator to category:", error);
          throw error;
        }
      }
      async removeCreatorFromCategory(creatorId, categoryId) {
        try {
          await db.delete(creator_categories).where(and(
            eq(creator_categories.creator_id, creatorId),
            eq(creator_categories.category_id, categoryId)
          ));
          return true;
        } catch (error) {
          console.error("Error removing creator from category:", error);
          return false;
        }
      }
      async updateCreatorPrimaryCategory(creatorId, categoryId) {
        try {
          await db.update(creator_categories).set({ is_primary: false }).where(eq(creator_categories.creator_id, creatorId));
          await db.update(creator_categories).set({ is_primary: true }).where(and(
            eq(creator_categories.creator_id, creatorId),
            eq(creator_categories.category_id, categoryId)
          ));
          await db.update(users).set({ primary_category_id: categoryId, updated_at: /* @__PURE__ */ new Date() }).where(eq(users.id, creatorId));
          return true;
        } catch (error) {
          console.error("Error updating creator primary category:", error);
          return false;
        }
      }
      async getCreatorsByCategory(categoryId) {
        try {
          const result = await db.select({
            id: users.id,
            username: users.username,
            email: users.email,
            password: users.password,
            avatar: users.avatar,
            role: users.role,
            status: users.status,
            display_name: users.display_name,
            bio: users.bio,
            cover_image: users.cover_image,
            social_links: users.social_links,
            verified: users.verified,
            total_subscribers: users.total_subscribers,
            total_earnings: users.total_earnings,
            commission_rate: users.commission_rate,
            comments_enabled: users.comments_enabled,
            auto_post_enabled: users.auto_post_enabled,
            watermark_enabled: users.watermark_enabled,
            profile_discoverable: users.profile_discoverable,
            activity_status_visible: users.activity_status_visible,
            is_online: users.is_online,
            last_seen: users.last_seen,
            primary_category_id: users.primary_category_id,
            created_at: users.created_at,
            updated_at: users.updated_at
          }).from(users).leftJoin(creator_categories, eq(users.id, creator_categories.creator_id)).where(and(
            eq(users.role, "creator"),
            eq(users.status, "active"),
            eq(creator_categories.category_id, categoryId)
          )).orderBy(desc(users.total_subscribers));
          return result;
        } catch (error) {
          console.error("Error getting creators by category:", error);
          throw error;
        }
      }
      async getCategoryStats() {
        try {
          const creatorCounts = await this.db.select({
            category_name: categories.name,
            creator_count: sql`count(${creator_categories.creator_id})`
          }).from(categories).leftJoin(creator_categories, eq(categories.id, creator_categories.category_id)).groupBy(categories.id, categories.name).orderBy(categories.name);
          const counts = {};
          creatorCounts.forEach((row) => {
            counts[row.category_name] = row.creator_count;
          });
          return {
            creatorCounts: counts,
            totalCategories: creatorCounts.length,
            activeCategories: await this.db.select({ count: sql`count(*)` }).from(categories).where(eq(categories.is_active, true)).then((result) => result[0].count)
          };
        } catch (error) {
          console.error("Error getting category stats:", error);
          throw error;
        }
      }
      async getAllCategoriesWithCounts() {
        try {
          const categoriesWithCounts = await this.db.select({
            id: categories.id,
            name: categories.name,
            description: categories.description,
            is_active: categories.is_active,
            creator_count: sql`COUNT(${creator_categories.creator_id})`.as("creator_count")
          }).from(categories).leftJoin(creator_categories, eq(categories.id, creator_categories.category_id)).groupBy(categories.id, categories.name, categories.description, categories.is_active).orderBy(categories.name);
          return categoriesWithCounts;
        } catch (error) {
          console.error("Error getting categories with counts:", error);
          throw error;
        }
      }
      // Creator favorite methods
      async favoriteCreator(fanId, creatorId) {
        try {
          await db.insert(creator_favorites).values({ fan_id: fanId, creator_id: creatorId });
          return true;
        } catch (error) {
          if (error.code === "23505") {
            console.log("Creator already favorited.");
            return false;
          }
          console.error("Error favoriting creator:", error);
          return false;
        }
      }
      async unfavoriteCreator(fanId, creatorId) {
        try {
          const result = await db.delete(creator_favorites).where(and(eq(creator_favorites.fan_id, fanId), eq(creator_favorites.creator_id, creatorId)));
          if ((result.rowCount || 0) > 0) {
            return true;
          }
          return false;
        } catch (error) {
          console.error("Error unfavoriting creator:", error);
          return false;
        }
      }
      async isCreatorFavorited(fanId, creatorId) {
        try {
          const [favorite] = await db.select().from(creator_favorites).where(and(eq(creator_favorites.fan_id, fanId), eq(creator_favorites.creator_id, creatorId)));
          return !!favorite;
        } catch (error) {
          console.error("Error checking if creator is favorited:", error);
          return false;
        }
      }
      async getFanFavorites(fanId) {
        const favorites = await db.select({
          id: users.id,
          username: users.username,
          display_name: users.display_name,
          avatar: users.avatar,
          cover_image: users.cover_image,
          bio: users.bio,
          category: categories.name,
          subscribers: users.total_subscribers,
          verified: users.verified,
          favorited_at: creator_favorites.created_at
        }).from(creator_favorites).innerJoin(users, eq(creator_favorites.creator_id, users.id)).leftJoin(categories, eq(users.primary_category_id, categories.id)).where(eq(creator_favorites.fan_id, fanId)).orderBy(desc(creator_favorites.created_at));
        return favorites.map((fav) => ({
          ...fav,
          category: fav.category || "General",
          subscribers: fav.subscribers || 0
        }));
      }
      async getCreatorFavoriteCount(creatorId) {
        try {
          const [result] = await db.select({ count: sql`count(*)` }).from(creator_favorites).where(eq(creator_favorites.creator_id, creatorId));
          return result?.count || 0;
        } catch (error) {
          console.error("Error getting creator favorite count:", error);
          return 0;
        }
      }
      async getCreatorLikeCount(creatorId) {
        try {
          const [result] = await db.select({ count: sql`count(*)` }).from(creator_likes).where(eq(creator_likes.creator_id, creatorId));
          return result?.count || 0;
        } catch (error) {
          console.error("Error getting creator like count:", error);
          return 0;
        }
      }
      async getFavoriteCreatorsForUser(userId) {
        return this.getFanFavorites(userId);
      }
      // Creator follow methods
      async followCreator(followerId, creatorId) {
        try {
          await db.insert(follows).values({ follower_id: followerId, creator_id: creatorId });
          await db.update(users).set({ total_followers: sql`${users.total_followers} + 1` }).where(eq(users.id, creatorId));
          return true;
        } catch (error) {
          if (error.code === "23505") {
            console.log("Creator already followed.");
            return false;
          }
          console.error("Error following creator:", error);
          return false;
        }
      }
      async unfollowCreator(followerId, creatorId) {
        try {
          const result = await db.delete(follows).where(and(eq(follows.follower_id, followerId), eq(follows.creator_id, creatorId)));
          if ((result.rowCount || 0) > 0) {
            await db.update(users).set({ total_followers: sql`${users.total_followers} - 1` }).where(eq(users.id, creatorId));
            return true;
          }
          return false;
        } catch (error) {
          console.error("Error unfollowing creator:", error);
          return false;
        }
      }
      async isFollowingCreator(followerId, creatorId) {
        try {
          const [follow] = await db.select().from(follows).where(and(eq(follows.follower_id, followerId), eq(follows.creator_id, creatorId)));
          return !!follow;
        } catch (error) {
          console.error("Error checking if following creator:", error);
          return false;
        }
      }
      async getFollowedCreators(followerId) {
        const followedCreators = await db.select({
          id: users.id,
          username: users.username,
          display_name: users.display_name,
          avatar: users.avatar,
          cover_image: users.cover_image,
          bio: users.bio,
          category: users.primary_category_id,
          subscribers: users.total_subscribers,
          followers: users.total_followers,
          verified: users.verified,
          followed_at: follows.created_at
        }).from(follows).innerJoin(users, eq(follows.creator_id, users.id)).where(eq(follows.follower_id, followerId)).orderBy(desc(follows.created_at));
        return followedCreators.map((creator) => ({
          ...creator,
          category: creator.category || "General",
          subscribers: creator.subscribers || 0,
          followers: creator.followers || 0
        }));
      }
      async getCreatorFollowers(creatorId) {
        const followers = await db.select({
          id: users.id,
          username: users.username,
          display_name: users.display_name,
          avatar: users.avatar,
          followed_at: follows.created_at
        }).from(follows).innerJoin(users, eq(follows.follower_id, users.id)).where(eq(follows.creator_id, creatorId)).orderBy(desc(follows.created_at));
        return followers;
      }
      async getCreatorFollowerCount(creatorId) {
        try {
          const [result] = await db.select({ count: sql`count(*)` }).from(follows).where(eq(follows.creator_id, creatorId));
          return result?.count || 0;
        } catch (error) {
          console.error("Error getting creator follower count:", error);
          return 0;
        }
      }
      // Audit logging implementation
      async createAuditLog(log2) {
        try {
          const [auditLog] = await db.insert(audit_logs).values(log2).returning();
          return auditLog;
        } catch (error) {
          console.error("Error creating audit log:", error);
          throw new Error("Failed to create audit log");
        }
      }
      async getAuditLogs(limit = 100, userId, action, resourceType) {
        try {
          let baseQuery = db.select().from(audit_logs);
          const conditions = [];
          if (userId) conditions.push(eq(audit_logs.user_id, userId));
          if (action) conditions.push(eq(audit_logs.action, action));
          if (resourceType) conditions.push(eq(audit_logs.resource_type, resourceType));
          if (conditions.length > 0) {
            baseQuery = baseQuery.where(and(...conditions));
          }
          return await baseQuery.orderBy(desc(audit_logs.created_at)).limit(limit);
        } catch (error) {
          console.error("Error fetching audit logs:", error);
          return [];
        }
      }
      async getAuditLogsByUser(userId, limit = 50) {
        try {
          return await db.select().from(audit_logs).where(eq(audit_logs.user_id, userId)).orderBy(desc(audit_logs.created_at)).limit(limit);
        } catch (error) {
          console.error("Error fetching audit logs by user:", error);
          return [];
        }
      }
      async getAuditLogsByResource(resourceType, resourceId, limit = 50) {
        try {
          return await db.select().from(audit_logs).where(and(
            eq(audit_logs.resource_type, resourceType),
            eq(audit_logs.resource_id, resourceId)
          )).orderBy(desc(audit_logs.created_at)).limit(limit);
        } catch (error) {
          console.error("Error fetching audit logs by resource:", error);
          return [];
        }
      }
      // System alerts implementation
      async createSystemAlert(alert) {
        try {
          const [systemAlert] = await db.insert(system_alerts).values(alert).returning();
          return systemAlert;
        } catch (error) {
          console.error("Error creating system alert:", error);
          throw new Error("Failed to create system alert");
        }
      }
      async getSystemAlerts(status, severity, limit = 100) {
        try {
          let baseQuery = db.select().from(system_alerts);
          const conditions = [];
          if (status) conditions.push(eq(system_alerts.status, status));
          if (severity) conditions.push(eq(system_alerts.severity, severity));
          if (conditions.length > 0) {
            baseQuery = baseQuery.where(and(...conditions));
          }
          return await baseQuery.orderBy(desc(system_alerts.created_at)).limit(limit);
        } catch (error) {
          console.error("Error fetching system alerts:", error);
          return [];
        }
      }
      async acknowledgeSystemAlert(alertId, userId) {
        try {
          const [alert] = await db.update(system_alerts).set({
            status: "acknowledged",
            acknowledged_by: userId,
            acknowledged_at: /* @__PURE__ */ new Date(),
            updated_at: /* @__PURE__ */ new Date()
          }).where(eq(system_alerts.id, alertId)).returning();
          return alert || void 0;
        } catch (error) {
          console.error("Error acknowledging system alert:", error);
          return void 0;
        }
      }
      async resolveSystemAlert(alertId, userId) {
        try {
          const [alert] = await db.update(system_alerts).set({
            status: "resolved",
            resolved_by: userId,
            resolved_at: /* @__PURE__ */ new Date(),
            updated_at: /* @__PURE__ */ new Date()
          }).where(eq(system_alerts.id, alertId)).returning();
          return alert || void 0;
        } catch (error) {
          console.error("Error resolving system alert:", error);
          return void 0;
        }
      }
      async getActiveSystemAlerts() {
        try {
          return await db.select().from(system_alerts).where(eq(system_alerts.status, "active")).orderBy(desc(system_alerts.created_at));
        } catch (error) {
          console.error("Error fetching active system alerts:", error);
          return [];
        }
      }
      async getCriticalSystemAlerts() {
        try {
          return await db.select().from(system_alerts).where(and(
            eq(system_alerts.status, "active"),
            eq(system_alerts.severity, "critical")
          )).orderBy(desc(system_alerts.created_at));
        } catch (error) {
          console.error("Error fetching critical system alerts:", error);
          return [];
        }
      }
    };
    storage = new DatabaseStorage();
  }
});

// server/notification-service.ts
var notification_service_exports = {};
__export(notification_service_exports, {
  NotificationService: () => NotificationService
});
var NotificationService;
var init_notification_service = __esm({
  "server/notification-service.ts"() {
    "use strict";
    init_storage();
    NotificationService = class {
      static broadcastFunction = null;
      static pushFunction = null;
      static setBroadcastFunction(fn) {
        this.broadcastFunction = fn;
      }
      static setPushFunction(fn) {
        this.pushFunction = fn;
      }
      static async createNotification(data) {
        try {
          const notification = await storage.createNotification(data);
          if (notification) {
            const notificationData = {
              id: notification.id,
              type: data.type,
              title: data.title,
              message: data.message,
              read: false,
              action_url: data.action_url,
              time_ago: "just now",
              created_at: (/* @__PURE__ */ new Date()).toISOString()
            };
            if (this.broadcastFunction) {
              this.broadcastFunction(data.user_id, notificationData);
            }
            if (this.pushFunction) {
              this.pushFunction(data.user_id, notificationData);
            }
          }
        } catch (error) {
          console.error("Failed to create notification:", error);
        }
      }
      // Notification generators for different events
      static async notifyNewSubscriber(creatorId, fanId, tierName) {
        const fan = await storage.getUser(fanId);
        if (!fan) return;
        const tierText = tierName ? ` to your ${tierName} tier` : "";
        await this.createNotification({
          user_id: creatorId,
          type: "new_subscriber",
          title: "New Subscriber!",
          message: `${fan.display_name || fan.username} subscribed${tierText}`,
          action_url: "/creator/subscribers",
          actor_id: fanId,
          entity_type: "subscription",
          metadata: {
            tier_name: tierName || "unknown"
          }
        });
      }
      static async notifyNewMessage(recipientId, senderId, messagePreview) {
        const sender = await storage.getUser(senderId);
        const recipient = await storage.getUser(recipientId);
        if (!sender || !recipient) return;
        const actionUrl = recipient.role === "creator" ? "/creator/messages" : "/fan/messages";
        await this.createNotification({
          user_id: recipientId,
          type: "new_message",
          title: "New Message",
          message: `${sender.display_name || sender.username}: ${messagePreview.substring(0, 50)}${messagePreview.length > 50 ? "..." : ""}`,
          action_url: actionUrl,
          actor_id: senderId,
          entity_type: "message",
          metadata: {}
        });
      }
      static async notifyNewComment(creatorId, commenterId, postId, postTitle, commentContent) {
        const commenter = await storage.getUser(commenterId);
        if (!commenter) return;
        await this.createNotification({
          user_id: creatorId,
          type: "new_comment",
          title: "New Comment",
          message: `${commenter.display_name || commenter.username} commented on "${postTitle}"`,
          action_url: `/creator/posts/${postId}`,
          actor_id: commenterId,
          entity_type: "comment",
          entity_id: postId,
          metadata: {
            post_title: postTitle,
            comment_content: commentContent.substring(0, 100)
          }
        });
      }
      static async notifyCommentLike(commentAuthorId, likerId, commentId, postId, postTitle) {
        try {
          console.log(`Creating comment like notification: comment_author=${commentAuthorId}, liker=${likerId}, comment=${commentId}`);
          const liker = await storage.getUser(likerId);
          if (!liker) {
            console.log("Liker not found, skipping notification");
            return;
          }
          console.log(`Liker found: ${liker.username}`);
          await this.createNotification({
            user_id: commentAuthorId,
            type: "comment_like",
            title: "Comment Liked",
            message: `${liker.display_name || liker.username} liked your comment on "${postTitle}"`,
            action_url: `/creator/posts/${postId}`,
            actor_id: likerId,
            entity_type: "comment",
            entity_id: commentId,
            metadata: {
              post_title: postTitle
            }
          });
          console.log("Comment like notification created successfully");
        } catch (error) {
          console.error("Error in notifyCommentLike:", error);
          throw error;
        }
      }
      static async notifyNewPost(creatorId, subscriberIds, postTitle, postId) {
        const creator = await storage.getUser(creatorId);
        if (!creator) return;
        for (const subscriberId of subscriberIds) {
          await this.createNotification({
            user_id: subscriberId,
            type: "new_post",
            title: "New Content",
            message: `${creator.display_name || creator.username} posted: ${postTitle}`,
            action_url: `/fan/posts/${postId}`,
            actor_id: creatorId,
            entity_type: "post",
            entity_id: postId,
            metadata: {
              post_title: postTitle
            }
          });
        }
      }
      static async notifyPaymentSuccess(userId, amount, tierName) {
        await this.createNotification({
          user_id: userId,
          type: "payment_success",
          title: "Payment Successful",
          message: `Your payment of GHS ${amount} for ${tierName} was processed successfully`,
          action_url: "/fan/subscriptions",
          entity_type: "payment",
          metadata: {
            amount,
            tier_name: tierName
          }
        });
      }
      static async notifyPaymentFailed(userId, amount, tierName) {
        await this.createNotification({
          user_id: userId,
          type: "payment_failed",
          title: "Payment Failed",
          message: `Your payment of GHS ${amount} for ${tierName} could not be processed`,
          action_url: "/fan/payment-methods",
          entity_type: "payment",
          metadata: {
            amount,
            tier_name: tierName
          }
        });
      }
      static async notifyPayoutCompleted(creatorId, amount) {
        await this.createNotification({
          user_id: creatorId,
          type: "payout_completed",
          title: "Payout Completed",
          message: `Your payout of GHS ${amount} has been processed successfully`,
          action_url: "/creator/payouts",
          entity_type: "payment",
          metadata: {
            amount
          }
        });
      }
      static async notifyPostLike(creatorId, likerId, postId, postTitle) {
        try {
          console.log(`Creating like notification: creator=${creatorId}, liker=${likerId}, post=${postId}`);
          const liker = await storage.getUser(likerId);
          if (!liker) {
            console.log("Liker not found, skipping notification");
            return;
          }
          console.log(`Liker found: ${liker.username}`);
          await this.createNotification({
            user_id: creatorId,
            type: "like",
            title: "New Like",
            message: `${liker.display_name || liker.username} liked your post "${postTitle}"`,
            action_url: `/creator/posts/${postId}`,
            actor_id: likerId,
            entity_type: "post",
            entity_id: postId,
            metadata: {
              post_title: postTitle
            }
          });
          console.log("Like notification created successfully");
        } catch (error) {
          console.error("Error in notifyPostLike:", error);
          throw error;
        }
      }
    };
  }
});

// server/index.ts
import express8 from "express";

// server/routes.ts
init_storage();
init_notification_service();
init_schema();
init_db();
init_schema();
import express6 from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import session from "express-session";
import MemoryStore from "memorystore";
import multer from "multer";
import path from "path";
import fs from "fs";
import { eq as eq3, desc as desc2, and as and3, gte as gte2, count, sql as sql2, inArray, asc, or } from "drizzle-orm";

// server/routes/payment.ts
import express from "express";

// server/services/paymentService.ts
init_storage();
import axios from "axios";
var PaymentService = class {
  baseURL = "https://api.paystack.co";
  secretKey;
  publicKey;
  // Development mode flag - Only use development mode in actual development
  isDevelopment = process.env.NODE_ENV !== "production";
  constructor() {
    if (this.isDevelopment) {
      this.secretKey = process.env.PAYSTACK_SECRET_KEY || "sk_test_development_key";
      this.publicKey = process.env.PAYSTACK_PUBLIC_KEY || "pk_test_development_key";
    } else {
      if (!process.env.PAYSTACK_SECRET_KEY || !process.env.PAYSTACK_PUBLIC_KEY) {
        throw new Error("Missing required Paystack credentials. Please provide PAYSTACK_SECRET_KEY and PAYSTACK_PUBLIC_KEY environment variables.");
      }
      this.secretKey = process.env.PAYSTACK_SECRET_KEY;
      this.publicKey = process.env.PAYSTACK_PUBLIC_KEY;
    }
  }
  // Store metadata for development mode
  devMetadataStore = /* @__PURE__ */ new Map();
  getHeaders() {
    return {
      Authorization: `Bearer ${this.secretKey}`,
      "Content-Type": "application/json"
    };
  }
  // Generate unique reference
  generateReference() {
    return `xclusive_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  // Store metadata for development mode
  storeDevMetadata(reference, metadata) {
    if (this.isDevelopment) {
      this.devMetadataStore.set(reference, metadata);
      console.log("\u{1F527} Stored dev metadata for reference:", reference, metadata);
    }
  }
  // Retrieve metadata for development mode
  getDevMetadataFromReference(reference) {
    if (this.isDevelopment && this.devMetadataStore.has(reference)) {
      const metadata = this.devMetadataStore.get(reference);
      console.log("\u{1F527} Retrieved dev metadata for reference:", reference, metadata);
      return metadata;
    }
    return {};
  }
  // Initialize standard payment (cards)
  async initializePayment(data) {
    if (this.isDevelopment) {
      console.log("\u{1F527} Development mode: Simulating Paystack payment initialization");
      const reference = data.reference || this.generateReference();
      if (data.metadata) {
        this.storeDevMetadata(reference, data.metadata);
      }
      return {
        status: true,
        message: "Authorization URL created (Development Mode)",
        data: {
          authorization_url: `/payment-callback?reference=${reference}&status=success`,
          access_code: "dev_access_code",
          reference
        }
      };
    }
    const payload = {
      email: data.email,
      amount: Math.round(data.amount * 100),
      // Convert to pesewas
      currency: data.currency || "GHS",
      reference: data.reference || this.generateReference(),
      callback_url: data.callback_url,
      metadata: data.metadata,
      channels: data.channels || ["card", "bank", "ussd", "mobile_money"]
    };
    try {
      const response = await axios.post(
        `${this.baseURL}/transaction/initialize`,
        payload,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error("Payment initialization error:", error.response?.data || error.message);
      throw new Error(`Payment initialization failed: ${error.response?.data?.message || error.message}`);
    }
  }
  // Initialize mobile money payment
  async initializeMobileMoneyPayment(data) {
    if (this.isDevelopment) {
      console.log("\u{1F527} Development mode: Simulating mobile money payment initialization");
      const reference = data.reference || this.generateReference();
      return {
        status: true,
        message: "Mobile money charge initiated (Development Mode)",
        data: {
          status: "send_otp",
          reference,
          display_text: `Please approve the payment on your ${data.provider.toUpperCase()} mobile money wallet`,
          authorization_url: `/payment-callback?reference=${reference}&status=success`
        }
      };
    }
    const payload = {
      email: data.email,
      amount: Math.round(data.amount * 100),
      // Convert to pesewas
      currency: "GHS",
      reference: data.reference || this.generateReference(),
      mobile_money: {
        phone: data.phone,
        provider: data.provider
      }
    };
    try {
      const response = await axios.post(
        `${this.baseURL}/charge`,
        payload,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      const errorData = error.response?.data;
      console.error("Mobile money payment error:", errorData || error.message);
      if (errorData?.message === "Charge attempted" && errorData?.data?.message?.includes("test mobile money number")) {
        throw new Error("Please use test mobile money number: 0551234987 for testing");
      }
      throw new Error(`Mobile money payment failed: ${errorData?.message || error.message}`);
    }
  }
  // Verify payment
  async verifyPayment(reference) {
    if (this.isDevelopment) {
      console.log("\u{1F527} Development mode: Simulating payment verification for reference:", reference);
      const devMetadata = this.getDevMetadataFromReference(reference);
      console.log("\u{1F527} Development mode verification - metadata retrieved:", devMetadata);
      return {
        status: true,
        message: "Verification successful (Development Mode)",
        data: {
          id: Math.floor(Math.random() * 1e6),
          domain: "test",
          status: "success",
          reference,
          amount: devMetadata?.tier_price ? parseFloat(devMetadata.tier_price) * 100 : 1e3,
          // Use actual tier price in pesewas
          message: "Approved (Development Mode)",
          gateway_response: "Successful",
          paid_at: (/* @__PURE__ */ new Date()).toISOString(),
          created_at: (/* @__PURE__ */ new Date()).toISOString(),
          channel: "card",
          currency: "GHS",
          ip_address: "127.0.0.1",
          metadata: devMetadata,
          log: {},
          fees: 0,
          fees_split: null,
          authorization: {
            authorization_code: "AUTH_dev123",
            bin: "408408",
            last4: "4081",
            exp_month: "12",
            exp_year: "2030",
            channel: "card",
            card_type: "visa",
            bank: "TEST BANK",
            country_code: "GH",
            brand: "visa",
            reusable: true,
            signature: "SIG_dev123",
            account_name: "Development User"
          },
          customer: {
            id: 123456,
            first_name: "Development",
            last_name: "User",
            email: "dev@example.com",
            customer_code: "CUS_dev123",
            phone: "233200000000",
            metadata: {},
            risk_action: "default",
            international_format_phone: "+233200000000"
          }
        }
      };
    }
    try {
      const response = await axios.get(
        `${this.baseURL}/transaction/verify/${reference}`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error("Payment verification error:", error.response?.data || error.message);
      throw new Error(`Payment verification failed: ${error.response?.data?.message || error.message}`);
    }
  }
  // Create subscription payment
  async createSubscriptionPayment(fanId, tierId, amount, email, customMetadata) {
    const reference = this.generateReference();
    const defaultMetadata = {
      fan_id: fanId,
      tier_id: tierId,
      tier_price: amount.toString(),
      payment_type: "subscription",
      custom_fields: [
        {
          display_name: "Fan ID",
          variable_name: "fan_id",
          value: fanId.toString()
        },
        {
          display_name: "Tier ID",
          variable_name: "tier_id",
          value: tierId.toString()
        }
      ]
    };
    const metadata = { ...defaultMetadata, ...customMetadata };
    const baseUrl = process.env.REPL_SLUG && process.env.REPL_OWNER ? `https://${process.env.REPL_SLUG}-${process.env.REPL_OWNER}.replit.app` : "http://localhost:5000";
    const callbackUrl = `${baseUrl}/payment/callback`;
    return this.initializePayment({
      email,
      amount,
      currency: "GHS",
      reference,
      callback_url: callbackUrl,
      metadata,
      channels: ["card", "bank", "ussd", "mobile_money"]
    });
  }
  // Process successful payment
  async processSuccessfulPayment(paymentData) {
    try {
      const metadata = paymentData.metadata;
      const fanId = metadata?.fan_id || metadata?.custom_fields?.find((f) => f.variable_name === "fan_id")?.value;
      const tierId = metadata?.tier_id || metadata?.custom_fields?.find((f) => f.variable_name === "tier_id")?.value;
      const subscriptionType = metadata?.subscription_type || "new";
      const existingSubscriptionId = metadata?.existing_subscription_id;
      if (!fanId || !tierId) {
        throw new Error("Missing fan_id or tier_id in payment metadata");
      }
      console.log(`\u{1F3AF} Processing ${subscriptionType} payment for fan ${fanId}, tier ${tierId}`);
      const tier = await storage.getSubscriptionTier(parseInt(tierId));
      if (!tier) {
        throw new Error("Subscription tier not found");
      }
      if (subscriptionType === "tier_upgrade" && existingSubscriptionId) {
        console.log(`\u2B06\uFE0F Processing tier upgrade for subscription ${existingSubscriptionId}`);
        const updatedSubscription = await storage.switchSubscriptionTier(
          parseInt(existingSubscriptionId),
          parseInt(tierId),
          parseFloat(metadata?.proration_amount || "0")
        );
        if (updatedSubscription) {
          console.log(`\u2705 Tier upgrade successful: ${existingSubscriptionId} \u2192 tier ${tierId}`);
        }
        await storage.createPaymentTransaction({
          subscription_id: parseInt(existingSubscriptionId),
          amount: paymentData.amount.toString(),
          currency: paymentData.currency,
          status: "completed",
          payment_method: "paystack",
          transaction_id: paymentData.reference,
          processed_at: /* @__PURE__ */ new Date()
        });
        console.log(`\u{1F4E7} Should send upgrade notification to fan ${fanId}`);
      } else {
        console.log(`\u2728 Creating new subscription for fan ${fanId}`);
        const currentDate = /* @__PURE__ */ new Date();
        const nextBillingDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3);
        const subscription = await storage.createSubscription({
          fan_id: parseInt(fanId),
          creator_id: tier.creator_id,
          tier_id: parseInt(tierId),
          status: "active",
          auto_renew: true,
          started_at: currentDate,
          ends_at: nextBillingDate,
          next_billing_date: nextBillingDate
        });
        await storage.createPaymentTransaction({
          subscription_id: subscription.id,
          amount: (paymentData.amount / 100).toString(),
          // Convert from pesewas to GHS
          currency: paymentData.currency,
          status: "completed",
          payment_method: "paystack",
          transaction_id: paymentData.reference,
          processed_at: new Date(paymentData.paid_at)
        });
        try {
          const { NotificationService: NotificationService2 } = (init_notification_service(), __toCommonJS(notification_service_exports));
          console.log(`Creating new subscriber notification via payment: creator=${tier.creator_id}, fan=${fanId}, tier=${tier.name}`);
          await NotificationService2.notifyNewSubscriber(
            tier.creator_id,
            parseInt(fanId),
            tier.name
          );
          console.log(`\u2705 Payment flow: Sent notification to creator ${tier.creator_id} for new subscriber ${fanId} (${tier.name} tier)`);
        } catch (notificationError) {
          console.error("\u274C Payment flow: Failed to send new subscriber notification:", notificationError);
        }
        console.log(`Subscription created successfully for fan ${fanId} to tier ${tierId}`);
      }
    } catch (error) {
      console.error("Error processing successful payment:", error);
      throw error;
    }
  }
  // Get public key (for frontend)
  getPublicKey() {
    return this.publicKey;
  }
  // Validate webhook signature
  validateWebhookSignature(payload, signature) {
    const crypto = __require("crypto");
    const hash = crypto.createHmac("sha512", this.secretKey).update(payload).digest("hex");
    return hash === signature;
  }
};
var paymentService = new PaymentService();

// server/routes/payment.ts
init_storage();
var router = express.Router();
router.post("/initialize", async (req, res) => {
  try {
    const { fan_id, tier_id, payment_method = "card" } = req.body;
    if (!fan_id || !tier_id) {
      return res.status(400).json({
        success: false,
        message: "Fan ID and Tier ID are required"
      });
    }
    const fan = await storage.getUser(fan_id);
    if (!fan) {
      return res.status(404).json({
        success: false,
        message: "Fan not found"
      });
    }
    const tier = await storage.getSubscriptionTier(tier_id);
    if (!tier) {
      return res.status(404).json({
        success: false,
        message: "Subscription tier not found"
      });
    }
    const existingSubscription = await storage.getUserSubscriptionToCreator(fan_id, tier.creator_id);
    if (existingSubscription && existingSubscription.status === "active" && existingSubscription.tier_id === tier_id) {
      return res.status(400).json({
        success: false,
        message: "You already have an active subscription to this tier"
      });
    }
    const isTierChange = existingSubscription && existingSubscription.status === "active" && existingSubscription.tier_id !== tier_id;
    let paymentAmount = parseFloat(tier.price);
    let metadata = {
      fan_id,
      tier_id,
      subscription_type: "new"
    };
    if (isTierChange) {
      console.log(`\u{1F504} Processing tier change for subscription ${existingSubscription.id}`);
      const prorationResult = await storage.calculateProration(existingSubscription.id, tier_id);
      console.log("\u{1F4CA} Proration calculation:", prorationResult);
      if (prorationResult.isUpgrade) {
        paymentAmount = prorationResult.prorationAmount;
        metadata = {
          ...metadata,
          subscription_type: "tier_upgrade",
          existing_subscription_id: existingSubscription.id,
          proration_amount: prorationResult.prorationAmount,
          days_remaining: prorationResult.daysRemaining
        };
      } else {
        await storage.createPendingSubscriptionChange({
          subscription_id: existingSubscription.id,
          from_tier_id: existingSubscription.tier_id,
          to_tier_id: tier_id,
          change_type: "downgrade",
          scheduled_date: existingSubscription.next_billing_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3),
          proration_amount: Math.abs(prorationResult.prorationAmount).toString()
        });
        return res.json({
          success: true,
          message: "Downgrade scheduled for next billing cycle. You will keep access to current tier until then.",
          data: {
            type: "scheduled_downgrade",
            effective_date: existingSubscription.next_billing_date,
            credit_amount: Math.abs(prorationResult.prorationAmount)
          }
        });
      }
    }
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
      message: "Payment initialized successfully"
    });
  } catch (error) {
    console.error("Payment initialization error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Payment initialization failed"
    });
  }
});
router.post("/mobile-money/initialize", async (req, res) => {
  try {
    const { fan_id, tier_id, phone, provider = "mtn" } = req.body;
    if (!fan_id || !tier_id || !phone) {
      return res.status(400).json({
        success: false,
        message: "Fan ID, Tier ID, and phone number are required"
      });
    }
    const validProviders = ["mtn", "vod", "tgo", "airtel"];
    if (!validProviders.includes(provider)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mobile money provider. Use: mtn, vod, tgo, or airtel"
      });
    }
    const fan = await storage.getUser(fan_id);
    if (!fan) {
      return res.status(404).json({
        success: false,
        message: "Fan not found"
      });
    }
    const tier = await storage.getSubscriptionTier(tier_id);
    if (!tier) {
      return res.status(404).json({
        success: false,
        message: "Subscription tier not found"
      });
    }
    const paymentData = await paymentService.initializeMobileMoneyPayment({
      email: fan.email,
      amount: parseFloat(tier.price),
      phone,
      provider
    });
    res.json({
      success: true,
      data: paymentData.data,
      message: "Mobile money payment initialized successfully"
    });
  } catch (error) {
    console.error("Mobile money payment error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Mobile money payment initialization failed"
    });
  }
});
router.post("/verify/:reference", async (req, res) => {
  try {
    const { reference } = req.params;
    if (!reference) {
      return res.status(400).json({
        success: false,
        message: "Payment reference is required"
      });
    }
    console.log("\u{1F50D} Verifying payment with reference:", reference);
    const verificationResult = await paymentService.verifyPayment(reference);
    console.log("\u2705 Payment verification result:", verificationResult.data.status);
    if (verificationResult.data.status === "success") {
      console.log("\u{1F4B3} Processing successful payment...");
      await paymentService.processSuccessfulPayment(verificationResult.data);
      console.log("\u2705 Payment processing completed successfully");
    }
    res.json({
      success: true,
      data: verificationResult.data,
      message: "Payment verified successfully"
    });
  } catch (error) {
    console.error("\u274C Payment verification error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Payment verification failed"
    });
  }
});
router.get("/config", (req, res) => {
  res.json({
    success: true,
    data: {
      public_key: paymentService.getPublicKey(),
      currency: "GHS"
    }
  });
});
router.get("/callback", async (req, res) => {
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
    const frontendCallbackUrl = `/payment-callback?reference=${reference}&status=${status || "pending"}`;
    return res.redirect(frontendCallbackUrl);
  } catch (error) {
    console.error("Payment callback error:", error);
    const frontendCallbackUrl = `/payment-callback?reference=${req.query.reference || "unknown"}&status=failed`;
    return res.redirect(frontendCallbackUrl);
  }
});
router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  try {
    const signature = req.headers["x-paystack-signature"];
    const payload = req.body.toString();
    if (!paymentService.validateWebhookSignature(payload, signature)) {
      return res.status(400).json({
        success: false,
        message: "Invalid webhook signature"
      });
    }
    const event = JSON.parse(payload);
    switch (event.event) {
      case "charge.success":
        await paymentService.processSuccessfulPayment(event.data);
        break;
      case "charge.failed":
        console.log("Payment failed:", event.data);
        break;
      case "subscription.create":
        console.log("Subscription created:", event.data);
        break;
      case "subscription.disable":
        console.log("Subscription disabled:", event.data);
        break;
      default:
        console.log("Unhandled webhook event:", event.event);
    }
    res.json({ success: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).json({
      success: false,
      message: "Webhook processing failed"
    });
  }
});
var payment_default = router;

// server/routes/payment-test.ts
import express2 from "express";
var router2 = express2.Router();
router2.get("/test-config", (req, res) => {
  try {
    const publicKey = paymentService.getPublicKey();
    const isDevelopment = process.env.NODE_ENV !== "production";
    res.json({
      success: true,
      data: {
        public_key: publicKey,
        is_development: isDevelopment,
        has_secret_key: !!process.env.PAYSTACK_SECRET_KEY,
        has_public_key: !!process.env.PAYSTACK_PUBLIC_KEY,
        environment: process.env.NODE_ENV || "development"
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
router2.post("/test-payment", async (req, res) => {
  try {
    const testPayment = await paymentService.initializePayment({
      email: "test@example.com",
      amount: 10,
      currency: "GHS",
      metadata: {
        test: true,
        description: "Test payment integration"
      }
    });
    res.json({
      success: true,
      data: testPayment,
      message: "Test payment initialized successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
router2.post("/test-verify/:reference", async (req, res) => {
  try {
    const { reference } = req.params;
    const verification = await paymentService.verifyPayment(reference);
    res.json({
      success: true,
      data: verification,
      message: "Payment verification test completed"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
var payment_test_default = router2;

// server/routes/payouts.ts
import express3 from "express";

// server/services/payoutService.ts
init_storage();
var MTNMobileMoneyProvider = class {
  name = "MTN Mobile Money";
  async process(amount, recipient) {
    console.log(`Processing MTN MoMo payout: GHS ${amount} to ${recipient.phone}`);
    await new Promise((resolve) => setTimeout(resolve, 2e3));
    const success = Math.random() > 0.2;
    if (success) {
      return {
        success: true,
        transaction_id: `mtn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
    } else {
      return {
        success: false,
        error: "MTN Mobile Money service temporarily unavailable"
      };
    }
  }
};
var VodafoneCashProvider = class {
  name = "Vodafone Cash";
  async process(amount, recipient) {
    console.log(`Processing Vodafone Cash payout: GHS ${amount} to ${recipient.phone}`);
    await new Promise((resolve) => setTimeout(resolve, 2e3));
    const success = Math.random() > 0.2;
    return success ? { success: true, transaction_id: `voda_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` } : { success: false, error: "Vodafone Cash service temporarily unavailable" };
  }
};
var BankTransferProvider = class {
  name = "Bank Transfer";
  async process(amount, recipient) {
    console.log(`Processing bank transfer: GHS ${amount} to ${recipient.account_number}`);
    await new Promise((resolve) => setTimeout(resolve, 3e3));
    const success = Math.random() > 0.1;
    return success ? { success: true, transaction_id: `bank_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` } : { success: false, error: "Bank transfer failed - invalid account details" };
  }
};
var PayoutService = class {
  providers = /* @__PURE__ */ new Map([
    ["mtn_momo", new MTNMobileMoneyProvider()],
    ["vodafone_cash", new VodafoneCashProvider()],
    ["bank_transfer", new BankTransferProvider()]
  ]);
  // Calculate creator earnings for a specific period
  async calculateCreatorEarnings(creatorId, startDate, endDate) {
    try {
      const transactions = await storage.getCreatorPaymentTransactions(creatorId, startDate, endDate);
      let gross_revenue = 0;
      let transaction_count = 0;
      for (const transaction of transactions) {
        gross_revenue += parseFloat(transaction.amount);
        transaction_count++;
      }
      const platformSettings = await storage.getPlatformSettings();
      const platform_fee_rate = platformSettings.commission_rate;
      const paystack_fee_rate = 0.035;
      const platform_fee = gross_revenue * platform_fee_rate;
      const paystack_fees = gross_revenue * paystack_fee_rate;
      const net_payout = gross_revenue - platform_fee - paystack_fees;
      return {
        creator_id: creatorId,
        gross_revenue,
        platform_fee,
        paystack_fees,
        net_payout: Math.max(0, net_payout),
        // Ensure non-negative
        transaction_count
      };
    } catch (error) {
      console.error("Error calculating creator earnings:", error);
      throw error;
    }
  }
  // Process payout for a specific creator
  async processCreatorPayout(calculation, period_start, period_end) {
    try {
      const MINIMUM_PAYOUT = 10;
      if (calculation.net_payout < MINIMUM_PAYOUT) {
        console.log(`Skipping payout for creator ${calculation.creator_id}: Below minimum threshold (GHS ${calculation.net_payout})`);
        return;
      }
      const creator = await storage.getUser(calculation.creator_id);
      if (!creator) {
        throw new Error(`Creator ${calculation.creator_id} not found`);
      }
      const payoutSettings = await storage.getCreatorPayoutSettings(calculation.creator_id);
      if (!payoutSettings || !payoutSettings.payout_method) {
        console.log(`Skipping payout for creator ${calculation.creator_id}: No payout method configured`);
        return;
      }
      const payout = await storage.createCreatorPayout({
        creator_id: calculation.creator_id,
        amount: calculation.net_payout.toString(),
        currency: "GHS",
        status: "pending",
        period_start,
        period_end,
        payout_method: payoutSettings.payout_method
      });
      console.log(`Created payout record ${payout.id} for creator ${calculation.creator_id}: GHS ${calculation.net_payout}`);
      const provider = this.providers.get(payoutSettings.payout_method);
      if (!provider) {
        await storage.updateCreatorPayoutStatus(payout.id, "failed");
        throw new Error(`Unsupported payout method: ${payoutSettings.payout_method}`);
      }
      try {
        const result = await provider.process(calculation.net_payout, payoutSettings);
        if (result.success) {
          await storage.updateCreatorPayoutStatus(payout.id, "completed", result.transaction_id);
          console.log(`Payout ${payout.id} completed successfully: ${result.transaction_id}`);
        } else {
          await storage.updateCreatorPayoutStatus(payout.id, "failed");
          console.error(`Payout ${payout.id} failed: ${result.error}`);
        }
      } catch (error) {
        await storage.updateCreatorPayoutStatus(payout.id, "failed");
        console.error(`Payout ${payout.id} processing error:`, error);
      }
    } catch (error) {
      console.error("Error processing creator payout:", error);
      throw error;
    }
  }
  // Process monthly payouts for all creators
  async processMonthlyPayouts() {
    try {
      const now = /* @__PURE__ */ new Date();
      const period_end = new Date(now.getFullYear(), now.getMonth(), 0);
      const period_start = new Date(period_end.getFullYear(), period_end.getMonth(), 1);
      console.log(`Processing monthly payouts for period: ${period_start.toISOString()} to ${period_end.toISOString()}`);
      const creators = await storage.getAllCreators();
      for (const creator of creators) {
        try {
          const calculation = await this.calculateCreatorEarnings(creator.id, period_start, period_end);
          if (calculation.net_payout > 0) {
            await this.processCreatorPayout(calculation, period_start, period_end);
          }
        } catch (error) {
          console.error(`Error processing payout for creator ${creator.id}:`, error);
        }
      }
      console.log("Monthly payout processing completed");
    } catch (error) {
      console.error("Error in monthly payout processing:", error);
      throw error;
    }
  }
  // Get payout history for a creator
  async getCreatorPayoutHistory(creatorId, limit = 10) {
    return storage.getCreatorPayouts(creatorId, limit);
  }
  // Get payout statistics
  async getPayoutStats(creatorId) {
    if (creatorId) {
      return storage.getCreatorPayoutStats(creatorId);
    }
    return storage.getAllPayoutStats();
  }
};
var payoutService = new PayoutService();

// server/routes/payouts.ts
var router3 = express3.Router();
router3.get("/creator/:id/history", async (req, res) => {
  try {
    const creatorId = parseInt(req.params.id);
    const limit = parseInt(req.query.limit) || 10;
    if (!creatorId) {
      return res.status(400).json({
        success: false,
        message: "Creator ID is required"
      });
    }
    const payouts = await payoutService.getCreatorPayoutHistory(creatorId, limit);
    res.json({
      success: true,
      data: payouts
    });
  } catch (error) {
    console.error("Error fetching payout history:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch payout history"
    });
  }
});
router3.get("/creator/:id/stats", async (req, res) => {
  try {
    const creatorId = parseInt(req.params.id);
    if (!creatorId) {
      return res.status(400).json({
        success: false,
        message: "Creator ID is required"
      });
    }
    const stats = await payoutService.getPayoutStats(creatorId);
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error("Error fetching payout stats:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch payout statistics"
    });
  }
});
router3.get("/creator/:id/current-earnings", async (req, res) => {
  try {
    const creatorId = parseInt(req.params.id);
    if (!creatorId) {
      return res.status(400).json({
        success: false,
        message: "Creator ID is required"
      });
    }
    const now = /* @__PURE__ */ new Date();
    const period_start = new Date(now.getFullYear(), now.getMonth(), 1);
    const period_end = now;
    const calculation = await payoutService.calculateCreatorEarnings(creatorId, period_start, period_end);
    res.json({
      success: true,
      data: {
        ...calculation,
        period_start,
        period_end,
        is_preview: true
      }
    });
  } catch (error) {
    console.error("Error calculating current earnings:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to calculate current earnings"
    });
  }
});
router3.post("/admin/process-monthly", async (req, res) => {
  try {
    await payoutService.processMonthlyPayouts();
    res.json({
      success: true,
      message: "Monthly payouts processed successfully"
    });
  } catch (error) {
    console.error("Error processing monthly payouts:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to process monthly payouts"
    });
  }
});
router3.get("/admin/stats", async (req, res) => {
  try {
    const stats = await payoutService.getPayoutStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error("Error fetching admin payout stats:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch payout statistics"
    });
  }
});
var payouts_default = router3;

// server/routes/admin.ts
import express4 from "express";

// server/services/cronService.ts
import * as cron from "node-cron";
init_db();
init_schema();
import { eq as eq2, and as and2, lte as lte2 } from "drizzle-orm";
var CronService = class {
  jobs = /* @__PURE__ */ new Map();
  // Start all scheduled jobs
  start() {
    console.log("Starting cron service...");
    const monthlyPayoutJob = cron.schedule("0 9 1 * *", async () => {
      console.log("Running scheduled monthly payout processing...");
      try {
        await payoutService.processMonthlyPayouts();
        console.log("Scheduled monthly payout processing completed");
      } catch (error) {
        console.error("Error in scheduled monthly payout processing:", error);
      }
    }, {
      timezone: "Africa/Accra"
      // Ghana timezone
    });
    this.jobs.set("monthly-payouts", monthlyPayoutJob);
    monthlyPayoutJob.start();
    const weeklyStatusJob = cron.schedule("0 10 * * 1", async () => {
      console.log("Running weekly payout status check...");
      try {
        await this.checkPendingPayouts();
        console.log("Weekly payout status check completed");
      } catch (error) {
        console.error("Error in weekly payout status check:", error);
      }
    }, {
      timezone: "Africa/Accra"
    });
    this.jobs.set("weekly-status-check", weeklyStatusJob);
    weeklyStatusJob.start();
    const postPublishingJob = cron.schedule("* * * * *", async () => {
      try {
        await this.publishScheduledPosts();
      } catch (error) {
        console.error("Error in scheduled post publishing:", error);
      }
    }, {
      timezone: "Africa/Accra"
    });
    this.jobs.set("post-publishing", postPublishingJob);
    postPublishingJob.start();
    console.log("Cron service started with scheduled jobs:");
    console.log("- Monthly payouts: 1st of every month at 9:00 AM");
    console.log("- Weekly status checks: Every Monday at 10:00 AM");
    console.log("- Post publishing: Every minute");
  }
  // Stop all scheduled jobs
  stop() {
    console.log("Stopping cron service...");
    this.jobs.forEach((job, name) => {
      job.stop();
      console.log(`Stopped job: ${name}`);
    });
    this.jobs.clear();
  }
  // Check and retry pending payouts
  async checkPendingPayouts() {
    console.log("Checking pending payouts...");
  }
  // Publish scheduled posts that are due
  async publishScheduledPosts() {
    try {
      const now = /* @__PURE__ */ new Date();
      const scheduledPosts = await db.select().from(posts).where(
        and2(
          eq2(posts.status, "scheduled"),
          lte2(posts.scheduled_for, now)
        )
      );
      if (scheduledPosts.length > 0) {
        console.log(`Publishing ${scheduledPosts.length} scheduled posts...`);
        for (const post of scheduledPosts) {
          await db.update(posts).set({
            status: "published",
            updated_at: /* @__PURE__ */ new Date()
          }).where(eq2(posts.id, post.id));
          console.log(`Published post "${post.title}" (ID: ${post.id})`);
        }
        console.log(`Successfully published ${scheduledPosts.length} scheduled posts`);
      }
    } catch (error) {
      console.error("Error publishing scheduled posts:", error);
    }
  }
  // Manual trigger for monthly payouts (for testing/admin use)
  async triggerMonthlyPayouts() {
    console.log("Manually triggering monthly payout processing...");
    await payoutService.processMonthlyPayouts();
  }
  // Manual trigger for publishing scheduled posts (for testing/admin use)
  async triggerScheduledPostPublishing() {
    console.log("Manually triggering scheduled post publishing...");
    await this.publishScheduledPosts();
  }
};
var cronService = new CronService();

// server/routes/admin.ts
init_storage();

// server/middleware/auth.ts
import jwt from "jsonwebtoken";
var JWT_SECRET = process.env.SESSION_SECRET || "xclusive-secret-key-2024";
if (!JWT_SECRET) {
  console.error("SESSION_SECRET environment variable is required");
  process.exit(1);
}
var requireAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    try {
      const { storage: storage2 } = await Promise.resolve().then(() => (init_storage(), storage_exports));
      await storage2.createAuditLog({
        user_id: null,
        action: "admin_auth_failure",
        resource_type: "auth",
        resource_id: "admin_access",
        details: { reason: "no_token", path: req.path },
        ip_address: req.ip,
        user_agent: req.get("User-Agent"),
        severity: "warning",
        status: "failure"
      });
    } catch (logError) {
      console.error("Failed to log auth failure:", logError);
    }
    return res.status(401).json({
      error: "Authentication required",
      message: "Admin access requires authentication"
    });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { storage: storage2 } = await Promise.resolve().then(() => (init_storage(), storage_exports));
    const user = await storage2.getUser(decoded.id);
    if (!user || user.role !== "admin" || user.status !== "active") {
      await storage2.createAuditLog({
        user_id: decoded.id,
        action: "admin_access_denied",
        resource_type: "auth",
        resource_id: "admin_access",
        details: {
          reason: !user ? "user_not_found" : user.role !== "admin" ? "not_admin" : "user_inactive",
          path: req.path
        },
        ip_address: req.ip,
        user_agent: req.get("User-Agent"),
        severity: "warning",
        status: "failure"
      });
      return res.status(403).json({
        error: "Admin access required",
        message: "This endpoint requires administrator privileges"
      });
    }
    req.user = user;
    next();
  } catch (err) {
    try {
      const { storage: storage2 } = await Promise.resolve().then(() => (init_storage(), storage_exports));
      await storage2.createAuditLog({
        user_id: null,
        action: "admin_token_invalid",
        resource_type: "auth",
        resource_id: "admin_access",
        details: { error: err instanceof Error ? err.message : "unknown", path: req.path },
        ip_address: req.ip,
        user_agent: req.get("User-Agent"),
        severity: "warning",
        status: "failure"
      });
    } catch (logError) {
      console.error("Failed to log token failure:", logError);
    }
    return res.status(401).json({
      error: "Invalid or expired token",
      message: "Please log in again"
    });
  }
};

// server/services/auditService.ts
init_storage();
var AuditService = class {
  /**
   * Logs an admin action with automatic capture of request metadata
   */
  async logAdminAction(userId, action, resourceType, resourceId, details = {}, req, severity = "info") {
    try {
      const auditLog = {
        user_id: userId,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        details,
        ip_address: req?.ip || req?.connection?.remoteAddress,
        user_agent: req?.get?.("User-Agent"),
        severity,
        status: "success"
      };
      return await storage.createAuditLog(auditLog);
    } catch (error) {
      console.error("Failed to create audit log:", error);
      await this.createSystemAlert(
        "security",
        "critical",
        "Audit Logging Failure",
        `Failed to log admin action: ${action} for user ${userId}`,
        "audit_service",
        { originalAction: action, error: error instanceof Error ? error.message : "Unknown error" }
      );
    }
  }
  /**
   * Logs a system event (no user associated)
   */
  async logSystemEvent(action, resourceType, resourceId, details = {}, severity = "info", status = "success") {
    try {
      const auditLog = {
        user_id: null,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        details,
        severity,
        status
      };
      return await storage.createAuditLog(auditLog);
    } catch (error) {
      console.error("Failed to create system audit log:", error);
    }
  }
  /**
   * Creates a system alert
   */
  async createSystemAlert(type, severity, title, message, source, metadata = {}) {
    try {
      return await storage.createSystemAlert({
        type,
        severity,
        title,
        message,
        source,
        metadata,
        status: "active"
      });
    } catch (error) {
      console.error("Failed to create system alert:", error);
    }
  }
  /**
   * Gets audit logs with filtering
   */
  async getAuditLogs(filters = {}) {
    return await storage.getAuditLogs(
      filters.limit,
      filters.userId,
      filters.action,
      filters.resourceType
    );
  }
  /**
   * Gets system alerts with filtering
   */
  async getSystemAlerts(filters = {}) {
    return await storage.getSystemAlerts(
      filters.status,
      filters.severity,
      filters.limit
    );
  }
};
var auditService = new AuditService();

// server/services/monitoringService.ts
var MonitoringService = class {
  intervalId = null;
  lastPerformanceCheck = Date.now();
  errorCount = 0;
  maxErrorsPerHour = 50;
  /**
   * Starts the monitoring service
   */
  start() {
    console.log("Starting monitoring service...");
    this.intervalId = setInterval(() => {
      this.runHealthChecks().catch((error) => {
        console.error("Health check failed:", error);
        this.recordError("health_check_failed", error);
      });
    }, 5 * 60 * 1e3);
    this.runHealthChecks().catch((error) => {
      console.error("Initial health check failed:", error);
    });
  }
  /**
   * Stops the monitoring service
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log("Monitoring service stopped");
    }
  }
  /**
   * Runs comprehensive health checks
   */
  async runHealthChecks() {
    try {
      await this.checkDatabaseHealth();
      await this.checkMemoryUsage();
      await this.checkErrorRate();
      await this.checkCriticalAlerts();
    } catch (error) {
      console.error("Health checks failed:", error);
      await this.recordError("health_check_system_failure", error);
    }
  }
  /**
   * Checks database connectivity and performance
   */
  async checkDatabaseHealth() {
    try {
      const startTime = Date.now();
      await Promise.resolve().then(() => (init_storage(), storage_exports)).then(
        ({ storage: storage2 }) => storage2.getUser(1)
        // Try to get a user to test DB connection
      );
      const responseTime = Date.now() - startTime;
      if (responseTime > 5e3) {
        await auditService.createSystemAlert(
          "performance",
          "high",
          "Database Performance Warning",
          `Database query took ${responseTime}ms, which exceeds the 5-second threshold`,
          "monitoring_service",
          { responseTime, query: "basic_user_query" }
        );
      }
    } catch (error) {
      await auditService.createSystemAlert(
        "error",
        "critical",
        "Database Connection Failure",
        "Failed to connect to database during health check",
        "monitoring_service",
        { error: error instanceof Error ? error.message : "Unknown database error" }
      );
    }
  }
  /**
   * Checks memory usage
   */
  async checkMemoryUsage() {
    try {
      const memUsage = process.memoryUsage();
      const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
      const heapTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
      const heapUsagePercent = heapUsedMB / heapTotalMB * 100;
      if (heapUsagePercent > 90) {
        await auditService.createSystemAlert(
          "performance",
          heapUsagePercent > 98 ? "critical" : "high",
          // Critical only at 98%+ 
          "High Memory Usage Alert",
          `Memory usage is at ${heapUsagePercent.toFixed(1)}% (${heapUsedMB}MB/${heapTotalMB}MB)`,
          "monitoring_service",
          { memUsage, heapUsagePercent }
        );
      }
    } catch (error) {
      console.error("Memory check failed:", error);
    }
  }
  /**
   * Checks error rate over the last hour
   */
  async checkErrorRate() {
    try {
      if (this.errorCount > this.maxErrorsPerHour) {
        await auditService.createSystemAlert(
          "error",
          "high",
          "High Error Rate Alert",
          `Error count (${this.errorCount}) exceeded threshold (${this.maxErrorsPerHour}) in the last hour`,
          "monitoring_service",
          { errorCount: this.errorCount, threshold: this.maxErrorsPerHour }
        );
        this.errorCount = 0;
      }
    } catch (error) {
      console.error("Error rate check failed:", error);
    }
  }
  /**
   * Checks for critical alerts that need immediate attention
   */
  async checkCriticalAlerts() {
    try {
      const criticalAlerts = await auditService.getSystemAlerts({
        status: "active",
        severity: "critical",
        limit: 10
      });
      if (criticalAlerts.length > 5) {
        console.warn(`Multiple critical alerts detected: ${criticalAlerts.length}`);
      }
    } catch (error) {
      console.error("Critical alerts check failed:", error);
    }
  }
  /**
   * Records an error for monitoring
   */
  async recordError(type, error, metadata = {}) {
    try {
      this.errorCount++;
      await auditService.logSystemEvent(
        "error_occurred",
        "system",
        type,
        {
          error: error instanceof Error ? error.message : error,
          stack: error instanceof Error ? error.stack : void 0,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          ...metadata
        },
        "error",
        "failure"
      );
    } catch (logError) {
      console.error("Failed to record error:", logError);
    }
  }
  /**
   * Records a security event
   */
  async recordSecurityEvent(event, details = {}, severity = "medium") {
    try {
      await auditService.createSystemAlert(
        "security",
        severity,
        `Security Event: ${event}`,
        `Security event detected: ${event}`,
        "monitoring_service",
        details
      );
      await auditService.logSystemEvent(
        "security_event",
        "security",
        event,
        details,
        severity === "critical" || severity === "high" ? "critical" : "warning"
      );
    } catch (error) {
      console.error("Failed to record security event:", error);
    }
  }
  /**
   * Gets system health status
   */
  async getSystemHealth() {
    try {
      const memUsage = process.memoryUsage();
      const uptime = process.uptime();
      const criticalAlerts = await auditService.getSystemAlerts({
        status: "active",
        severity: "critical",
        limit: 1
      });
      return {
        status: criticalAlerts.length > 0 ? "degraded" : "healthy",
        uptime: Math.floor(uptime),
        memory: {
          used: Math.round(memUsage.heapUsed / 1024 / 1024),
          total: Math.round(memUsage.heapTotal / 1024 / 1024),
          percentage: Math.round(memUsage.heapUsed / memUsage.heapTotal * 100)
        },
        criticalAlerts: criticalAlerts.length,
        lastCheck: (/* @__PURE__ */ new Date()).toISOString()
      };
    } catch (error) {
      console.error("Failed to get system health:", error);
      return {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }
};
var monitoringService = new MonitoringService();

// server/routes/admin.ts
var router4 = express4.Router();
router4.use(requireAdmin);
router4.get("/health", async (req, res) => {
  try {
    const healthStatus = await monitoringService.getSystemHealth();
    await auditService.logAdminAction(
      req.user.id,
      "health_check",
      "system",
      "health",
      { status: healthStatus.status },
      req
    );
    res.json(healthStatus);
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(500).json({
      status: "error",
      message: "Health check failed",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});
router4.post("/trigger-monthly-payouts", async (req, res) => {
  try {
    await auditService.logAdminAction(
      req.user.id,
      "trigger_monthly_payouts",
      "system",
      "payouts",
      { trigger_type: "manual" },
      req,
      "info"
    );
    await cronService.triggerMonthlyPayouts();
    res.json({
      success: true,
      message: "Monthly payouts triggered successfully"
    });
  } catch (error) {
    console.error("Error triggering monthly payouts:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to trigger monthly payouts"
    });
  }
});
router4.get("/payout-dashboard", async (req, res) => {
  try {
    const stats = await payoutService.getPayoutStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error("Error fetching admin payout dashboard:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch payout dashboard data"
    });
  }
});
router4.get("/platform-stats", async (req, res) => {
  try {
    const stats = await storage.getPlatformStats();
    res.json(stats);
  } catch (error) {
    console.error("Error fetching platform stats:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch platform statistics"
    });
  }
});
router4.get("/top-creators", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const topCreators = await storage.getTopCreators(limit);
    res.json(topCreators);
  } catch (error) {
    console.error("Error fetching top creators:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch top creators"
    });
  }
});
router4.get("/system-health", async (req, res) => {
  try {
    const systemHealth = await storage.getSystemHealth();
    res.json(systemHealth);
  } catch (error) {
    console.error("Error fetching system health:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch system health"
    });
  }
});
router4.get("/category-stats", async (req, res) => {
  try {
    const stats = await storage.getCategoryStats();
    res.json(stats);
  } catch (error) {
    console.error("Error fetching category stats:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch category statistics"
    });
  }
});
router4.get("/categories", async (req, res) => {
  try {
    const categories2 = await storage.getAllCategoriesWithCounts();
    res.json(categories2);
  } catch (error) {
    console.error("Error fetching admin categories:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch categories"
    });
  }
});
router4.post("/categories", async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({
        error: "Category name is required"
      });
    }
    const categoryData = {
      name: name.trim(),
      description: description?.trim() || "",
      slug: name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      icon: "User",
      color: "#6366f1",
      is_active: true
    };
    const newCategory = await storage.createCategory(categoryData);
    res.json(newCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({
      error: error.message || "Failed to create category"
    });
  }
});
router4.put("/categories/:id", async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    const { name, description } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({
        error: "Category name is required"
      });
    }
    const categoryData = {
      name: name.trim(),
      description: description?.trim() || "",
      slug: name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    };
    const updatedCategory = await storage.updateCategory(categoryId, categoryData);
    if (!updatedCategory) {
      return res.status(404).json({
        error: "Category not found"
      });
    }
    res.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({
      error: error.message || "Failed to update category"
    });
  }
});
router4.delete("/categories/:id", async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    const deleted = await storage.deleteCategory(categoryId);
    if (!deleted) {
      return res.status(400).json({
        error: "Cannot delete category - it may be in use by creators"
      });
    }
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({
      error: error.message || "Failed to delete category"
    });
  }
});
var admin_default = router4;

// server/routes/subscriptions.ts
init_storage();
import express5 from "express";
var router5 = express5.Router();
router5.get("/user/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }
    const subscriptions2 = await storage.getSubscriptions(userId);
    const enhancedSubscriptions = await Promise.all(
      subscriptions2.map(async (subscription) => {
        const availableTiers = await storage.getSubscriptionTiers(subscription.creator.id);
        const pendingChanges = await storage.getPendingSubscriptionChanges(subscription.id);
        const changeHistory = await storage.getSubscriptionChangeHistory(subscription.id);
        const tierOptions = await Promise.all(
          availableTiers.filter((tier) => tier.id !== subscription.tier_id).map(async (tier) => {
            const proration = await storage.calculateProration(subscription.id, tier.id);
            return {
              ...tier,
              proration_amount: proration.prorationAmount,
              is_upgrade: proration.isUpgrade,
              days_remaining: proration.daysRemaining
            };
          })
        );
        return {
          ...subscription,
          next_billing_date: subscription.current_period_end || subscription.next_billing_date,
          available_tiers: tierOptions,
          pending_changes: pendingChanges,
          change_history: changeHistory.slice(0, 5)
          // Last 5 changes
        };
      })
    );
    res.json({
      success: true,
      data: enhancedSubscriptions
    });
  } catch (error) {
    console.error("Error fetching user subscriptions:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch subscriptions"
    });
  }
});
router5.post("/:subscriptionId/upgrade", async (req, res) => {
  try {
    const subscriptionId = parseInt(req.params.subscriptionId);
    const { tier_id } = req.body;
    if (!subscriptionId || !tier_id) {
      return res.status(400).json({
        success: false,
        message: "Subscription ID and tier ID are required"
      });
    }
    const subscription = await storage.getSubscription(subscriptionId);
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found"
      });
    }
    const newTier = await storage.getSubscriptionTier(tier_id);
    if (!newTier) {
      return res.status(404).json({
        success: false,
        message: "Tier not found"
      });
    }
    const proration = await storage.calculateProration(subscriptionId, tier_id);
    if (!proration.isUpgrade) {
      return res.status(400).json({
        success: false,
        message: "Use schedule-downgrade endpoint for downgrades"
      });
    }
    if (proration.prorationAmount > 0) {
      return res.json({
        success: true,
        requires_payment: true,
        message: "Upgrade requires payment for prorated difference",
        data: {
          proration_amount: proration.prorationAmount,
          days_remaining: proration.daysRemaining,
          payment_required: proration.prorationAmount
        }
      });
    }
    const updatedSubscription = await storage.switchSubscriptionTier(
      subscriptionId,
      tier_id,
      proration.prorationAmount
    );
    if (updatedSubscription) {
      res.json({
        success: true,
        message: "Tier upgraded successfully",
        data: {
          subscription: updatedSubscription,
          proration_amount: proration.prorationAmount
        }
      });
    } else {
      throw new Error("Failed to upgrade tier");
    }
  } catch (error) {
    console.error("Error upgrading subscription:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to upgrade subscription"
    });
  }
});
router5.post("/:subscriptionId/schedule-downgrade", async (req, res) => {
  try {
    const subscriptionId = parseInt(req.params.subscriptionId);
    const { tier_id } = req.body;
    if (!subscriptionId || !tier_id) {
      return res.status(400).json({
        success: false,
        message: "Subscription ID and tier ID are required"
      });
    }
    const subscription = await storage.getSubscription(subscriptionId);
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found"
      });
    }
    const newTier = await storage.getSubscriptionTier(tier_id);
    if (!newTier) {
      return res.status(404).json({
        success: false,
        message: "Tier not found"
      });
    }
    const proration = await storage.calculateProration(subscriptionId, tier_id);
    if (proration.isUpgrade) {
      return res.status(400).json({
        success: false,
        message: "Use upgrade endpoint for upgrades"
      });
    }
    const scheduledDate = subscription.next_billing_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3);
    const pendingChange = await storage.createPendingSubscriptionChange({
      subscription_id: subscriptionId,
      from_tier_id: subscription.tier_id,
      to_tier_id: tier_id,
      change_type: "downgrade",
      scheduled_date: scheduledDate,
      proration_amount: Math.abs(proration.prorationAmount).toString(),
      status: "pending"
    });
    res.json({
      success: true,
      message: "Downgrade scheduled successfully. You will keep current tier access until next billing cycle.",
      data: {
        pending_change: pendingChange,
        scheduled_date: scheduledDate,
        credit_amount: Math.abs(proration.prorationAmount),
        current_tier_access_until: scheduledDate
      }
    });
  } catch (error) {
    console.error("Error scheduling downgrade:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to schedule downgrade"
    });
  }
});
router5.get("/:subscriptionId/pending-changes", async (req, res) => {
  try {
    const subscriptionId = parseInt(req.params.subscriptionId);
    if (!subscriptionId) {
      return res.status(400).json({
        success: false,
        message: "Subscription ID is required"
      });
    }
    const pendingChanges = await storage.getPendingSubscriptionChanges(subscriptionId);
    const enhancedChanges = await Promise.all(
      pendingChanges.map(async (change) => {
        const fromTier = change.from_tier_id ? await storage.getSubscriptionTier(change.from_tier_id) : null;
        const toTier = await storage.getSubscriptionTier(change.to_tier_id);
        return {
          ...change,
          from_tier: fromTier,
          to_tier: toTier
        };
      })
    );
    res.json({
      success: true,
      data: enhancedChanges
    });
  } catch (error) {
    console.error("Error fetching pending changes:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch pending changes"
    });
  }
});
router5.delete("/pending-changes/:changeId", async (req, res) => {
  try {
    const changeId = parseInt(req.params.changeId);
    if (!changeId) {
      return res.status(400).json({
        success: false,
        message: "Change ID is required"
      });
    }
    const cancelled = await storage.cancelPendingSubscriptionChange(changeId);
    if (cancelled) {
      res.json({
        success: true,
        message: "Scheduled change cancelled successfully"
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Pending change not found or already processed"
      });
    }
  } catch (error) {
    console.error("Error cancelling pending change:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to cancel pending change"
    });
  }
});
router5.get("/:subscriptionId/history", async (req, res) => {
  try {
    const subscriptionId = parseInt(req.params.subscriptionId);
    const limit = parseInt(req.query.limit) || 20;
    if (!subscriptionId) {
      return res.status(400).json({
        success: false,
        message: "Subscription ID is required"
      });
    }
    const changes = await storage.getSubscriptionChangeHistory(subscriptionId);
    const limitedChanges = changes.slice(0, limit);
    const enhancedChanges = await Promise.all(
      limitedChanges.map(async (change) => {
        const fromTier = change.from_tier_id ? await storage.getSubscriptionTier(change.from_tier_id) : null;
        const toTier = await storage.getSubscriptionTier(change.to_tier_id);
        return {
          ...change,
          from_tier: fromTier,
          to_tier: toTier
        };
      })
    );
    res.json({
      success: true,
      data: enhancedChanges
    });
  } catch (error) {
    console.error("Error fetching subscription history:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch subscription history"
    });
  }
});
router5.get("/user/:userId/creator/:creatorId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const creatorId = parseInt(req.params.creatorId);
    if (!userId || !creatorId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Creator ID are required"
      });
    }
    const currentSubscription = await storage.getUserSubscriptionToCreator(userId, creatorId);
    const availableTiers = await storage.getSubscriptionTiers(creatorId);
    if (currentSubscription) {
      const tierOptions = await Promise.all(
        availableTiers.filter((tier) => tier.id !== currentSubscription.tier_id).map(async (tier) => {
          const proration = await storage.calculateProration(currentSubscription.id, tier.id);
          return {
            ...tier,
            proration_amount: proration.prorationAmount,
            is_upgrade: proration.isUpgrade,
            days_remaining: proration.daysRemaining,
            can_switch: true
          };
        })
      );
      const currentTier = availableTiers.find((tier) => tier.id === currentSubscription.tier_id);
      res.json({
        success: true,
        data: {
          has_subscription: true,
          current_subscription: currentSubscription,
          current_tier: currentTier,
          tier_options: tierOptions
        }
      });
    } else {
      res.json({
        success: true,
        data: {
          has_subscription: false,
          current_subscription: null,
          current_tier: null,
          tier_options: availableTiers.map((tier) => ({
            ...tier,
            proration_amount: 0,
            is_upgrade: false,
            days_remaining: 0,
            can_switch: false
          }))
        }
      });
    }
  } catch (error) {
    console.error("Error fetching creator subscription info:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch creator subscription info"
    });
  }
});
var subscriptions_default = router5;

// server/routes.ts
import bcrypt2 from "bcryptjs";
var uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
var upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 16 * 1024 * 1024
    // 16MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  }
});
var JWT_SECRET2 = process.env.SESSION_SECRET || "xclusive-secret-key-2024";
async function registerRoutes(app2) {
  const MemoryStoreSession = MemoryStore(session);
  const sessionStore = new MemoryStoreSession({
    checkPeriod: 864e5
    // Prune expired entries every 24h
  });
  app2.use(session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || "your-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1e3
      // 24 hours
    }
  }));
  app2.use("/uploads", express6.static(uploadsDir));
  app2.post("/api/auth/login", async (req, res) => {
    try {
      console.log("Login attempt received:", { email: req.body?.email });
      const { email, password } = req.body;
      if (!email || !password) {
        console.log("Missing email or password");
        return res.status(400).json({ error: "Email and password are required" });
      }
      console.log("Attempting database authentication for:", email);
      const user = await storage.getUserByEmail(email);
      if (!user) {
        console.log("User not found:", email);
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const isValidPassword = await storage.verifyPassword(password, user.password);
      if (!isValidPassword) {
        console.log("Invalid password for user:", email);
        return res.status(401).json({ error: "Invalid credentials" });
      }
      if (user.status === "suspended") {
        console.log("User suspended:", email);
        return res.status(403).json({
          error: "Your account has been suspended. Please contact support for assistance.",
          suspended: true
        });
      }
      const { password: _, ...userWithoutPassword } = user;
      req.session.userId = user.id;
      req.session.user = userWithoutPassword;
      console.log("Database user login successful:", user.email);
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed", details: error instanceof Error ? error.message : "Unknown error" });
    }
  });
  app2.post("/api/auth/register", async (req, res) => {
    try {
      console.log("Registration request received:", req.body);
      const { primaryCategoryId, ...userData } = req.body;
      const validatedData = insertUserSchema.parse(userData);
      console.log("Validated data:", { ...validatedData, password: "[HIDDEN]" });
      try {
        const existingUserByEmail = await storage.getUserByEmail(validatedData.email);
        if (existingUserByEmail) {
          console.log("Email already exists:", validatedData.email);
          return res.status(400).json({ error: "Email already exists" });
        }
      } catch (error) {
        console.log("Email check error (user probably doesn't exist):", error);
      }
      try {
        const existingUserByUsername = await storage.getUserByUsername(validatedData.username);
        if (existingUserByUsername) {
          console.log("Username already exists:", validatedData.username);
          return res.status(400).json({ error: "Username already exists" });
        }
      } catch (error) {
        console.log("Username check error (user probably doesn't exist):", error);
      }
      if (validatedData.role === "creator" && primaryCategoryId) {
        const category = await storage.getCategory(primaryCategoryId);
        if (!category) {
          return res.status(400).json({ error: "Invalid category selected" });
        }
      }
      console.log("Creating user...");
      const userDataWithCategory = {
        ...validatedData,
        primary_category_id: validatedData.role === "creator" ? primaryCategoryId : null
      };
      const user = await storage.createUser(userDataWithCategory);
      console.log("User created successfully:", user.id);
      if (!user) {
        throw new Error("Failed to create user account");
      }
      if (validatedData.role === "creator" && primaryCategoryId) {
        try {
          await storage.addCreatorToCategory({
            creator_id: user.id,
            category_id: primaryCategoryId,
            is_primary: true
          });
          console.log("Creator added to primary category:", primaryCategoryId);
        } catch (error) {
          console.error("Failed to add creator to category:", error);
        }
      }
      const { password: _, ...userWithoutPassword } = user;
      req.session.userId = user.id;
      req.session.user = userWithoutPassword;
      console.log("Registration successful for user:", user.id);
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Registration error:", error);
      if (error instanceof Error) {
        if (error.message.includes("duplicate key")) {
          return res.status(400).json({ error: "User already exists" });
        }
        if (error.message.includes("validation")) {
          return res.status(400).json({ error: "Invalid input data" });
        }
      }
      res.status(500).json({
        error: "Failed to create user account",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.get("/api/auth/verify", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      res.json({ user: req.session.user });
    } catch (error) {
      console.error("Session verification error:", error);
      res.status(500).json({ error: "Failed to verify session" });
    }
  });
  app2.post("/api/auth/logout", async (req, res) => {
    try {
      req.session.destroy((err) => {
        if (err) {
          console.error("Session destruction error:", err);
          return res.status(500).json({ error: "Failed to logout" });
        }
        res.json({ success: true });
      });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ error: "Failed to logout" });
    }
  });
  app2.get("/api/users/me", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        req.session.destroy(() => {
        });
        return res.status(401).json({ error: "User not found" });
      }
      if (user.status === "suspended") {
        return res.status(403).json({
          error: "Your account has been suspended. Please contact support for assistance.",
          suspended: true
        });
      }
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Get current user error:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });
  app2.get("/api/users/username/:username", async (req, res) => {
    try {
      const username = req.params.username;
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.set("Cache-Control", "public, max-age=300");
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });
  app2.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.set("Cache-Control", "public, max-age=300");
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });
  app2.delete("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const deleted = await storage.deleteUser(userId);
      if (!deleted) {
        return res.status(500).json({ error: "Failed to delete account" });
      }
      res.json({ success: true, message: "Account deleted successfully" });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({ error: "Failed to delete account" });
    }
  });
  app2.get("/api/posts", async (req, res) => {
    try {
      const { status, creatorId, includeAll } = req.query;
      console.log("Fetching posts with params:", { status, creatorId, includeAll });
      let query = `
        SELECT 
          posts.*,
          users.username,
          users.avatar,
          users.display_name,
          json_build_object(
            'id', users.id,
            'username', users.username,
            'display_name', users.display_name,
            'avatar', users.avatar
          ) as creator
        FROM posts 
        LEFT JOIN users ON posts.creator_id = users.id
        WHERE 1=1
      `;
      const params = [];
      if (includeAll === "true") {
      } else if (status && status !== "all") {
        query += ` AND posts.status = $${params.length + 1}`;
        params.push(status);
      } else {
        query += ` AND (posts.status = 'published' OR (posts.status = 'scheduled' AND posts.scheduled_for <= NOW()))`;
      }
      if (creatorId) {
        query += ` AND posts.creator_id = $${params.length + 1}`;
        params.push(parseInt(creatorId));
      }
      query += ` ORDER BY posts.created_at DESC`;
      const result = await pool.query(query, params);
      console.log(`Found ${result.rows.length} posts`);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  });
  app2.get("/api/feed/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      console.log("Fetching personalized feed for user:", userId);
      let query = `
        WITH user_follows AS (
          SELECT follows.creator_id FROM follows WHERE follows.follower_id = $1
        ),
        user_subscriptions AS (
          SELECT subscriptions.creator_id, subscription_tiers.name as tier_name FROM subscriptions 
          JOIN subscription_tiers ON subscriptions.tier_id = subscription_tiers.id
          WHERE subscriptions.fan_id = $1 AND subscriptions.status = 'active'
        ),
        accessible_posts AS (
          -- Posts from followed creators (public tier only)
          SELECT 
            posts.id,
            posts.creator_id,
            posts.title,
            posts.content,
            posts.media_urls,
            posts.tier,
            posts.status,
            posts.scheduled_for,
            posts.created_at,
            posts.updated_at,
            posts.likes_count,
            posts.comments_count,
            posts.media_type,
            posts.views_count,
            posts.duration,
            users.username,
            users.avatar,
            users.display_name,
            json_build_object(
              'id', users.id,
              'username', users.username,
              'display_name', users.display_name,
              'avatar', users.avatar
            ) as creator,
            'follow' as access_type
          FROM posts 
          LEFT JOIN users ON posts.creator_id = users.id
          LEFT JOIN user_follows ON posts.creator_id = user_follows.creator_id
          WHERE user_follows.creator_id IS NOT NULL 
            AND posts.tier = 'public'
            AND (posts.status = 'published' OR (posts.status = 'scheduled' AND posts.scheduled_for <= NOW()))

          UNION ALL

          -- Posts from subscribed creators (all accessible tiers)
          SELECT 
            posts.id,
            posts.creator_id,
            posts.title,
            posts.content,
            posts.media_urls,
            posts.tier,
            posts.status,
            posts.scheduled_for,
            posts.created_at,
            posts.updated_at,
            posts.likes_count,
            posts.comments_count,
            posts.media_type,
            posts.views_count,
            posts.duration,
            users.username,
            users.avatar,
            users.display_name,
            json_build_object(
              'id', users.id,
              'username', users.username,
              'display_name', users.display_name,
              'avatar', users.avatar
            ) as creator,
            'subscription' as access_type
          FROM posts 
          LEFT JOIN users ON posts.creator_id = users.id
          LEFT JOIN user_subscriptions ON posts.creator_id = user_subscriptions.creator_id
          WHERE user_subscriptions.creator_id IS NOT NULL 
            AND (posts.tier = 'public' OR posts.tier = user_subscriptions.tier_name)
            AND (posts.status = 'published' OR (posts.status = 'scheduled' AND posts.scheduled_for <= NOW()))
        )
        SELECT * FROM accessible_posts 
        ORDER BY accessible_posts.created_at DESC
        LIMIT 50
      `;
      const result = await pool.query(query, [userId]);
      console.log(`Found ${result.rows.length} posts for user's personalized feed`);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching personalized feed:", error);
      res.status(500).json({ error: "Failed to fetch feed" });
    }
  });
  app2.get("/api/posts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await db.update(posts).set({
        views_count: sql2`COALESCE(${posts.views_count}, 0) + 1`,
        updated_at: /* @__PURE__ */ new Date()
      }).where(eq3(posts.id, parseInt(id)));
      const post = await db.select({
        id: posts.id,
        creator_id: posts.creator_id,
        title: posts.title,
        content: posts.content,
        media_type: posts.media_type,
        media_urls: posts.media_urls,
        tier: posts.tier,
        status: posts.status,
        scheduled_for: posts.scheduled_for,
        created_at: posts.created_at,
        updated_at: posts.updated_at,
        likes_count: posts.likes_count,
        comments_count: posts.comments_count,
        views_count: posts.views_count,
        duration: posts.duration,
        creator: {
          id: users.id,
          username: users.username,
          display_name: users.display_name,
          avatar: users.avatar
        }
      }).from(posts).leftJoin(users, eq3(posts.creator_id, users.id)).where(eq3(posts.id, parseInt(id))).limit(1);
      if (post.length === 0) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json(post[0]);
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ error: "Failed to fetch post" });
    }
  });
  app2.post("/api/posts", async (req, res) => {
    try {
      const { creator_id, title, content, media_type, media_urls, tier, status, scheduled_for, thumbnail, duration } = req.body;
      console.log("Creating post with data:", { creator_id, content, media_type, media_urls, tier, status });
      if (!creator_id) {
        return res.status(400).json({ error: "Creator ID is required" });
      }
      if (!content && (!media_urls || media_urls.length === 0)) {
        return res.status(400).json({ error: "Post must have content or media" });
      }
      if (!tier) {
        return res.status(400).json({ error: "Access tier is required" });
      }
      const postData = {
        creator_id: parseInt(creator_id),
        title: title || "Untitled Post",
        content: content || "",
        media_type: media_type || "text",
        media_urls: Array.isArray(media_urls) ? media_urls : media_urls ? [media_urls] : [],
        thumbnail: thumbnail || null,
        duration: duration || null,
        tier,
        status: status || "published",
        created_at: /* @__PURE__ */ new Date(),
        updated_at: /* @__PURE__ */ new Date(),
        views_count: 0
        // Initialize view count to 0
      };
      if (scheduled_for && status === "scheduled") {
        const scheduledDate = new Date(scheduled_for);
        if (scheduledDate <= /* @__PURE__ */ new Date()) {
          return res.status(400).json({ error: "Scheduled date must be in the future" });
        }
        postData.scheduled_for = scheduledDate;
      }
      const newPost = await db.insert(posts).values(postData).returning();
      console.log("Post created successfully:", newPost[0].id);
      if (postData.status === "published") {
        try {
          const subscribersResult = await db.select({ fan_id: subscriptions.fan_id }).from(subscriptions).where(and3(
            eq3(subscriptions.creator_id, parseInt(creator_id)),
            eq3(subscriptions.status, "active")
          ));
          const subscriberIds = subscribersResult.map((sub) => sub.fan_id);
          if (subscriberIds.length > 0) {
            await NotificationService.notifyNewPost(
              parseInt(creator_id),
              subscriberIds,
              newPost[0].title,
              newPost[0].id
            );
            console.log(`Sent notifications to ${subscriberIds.length} subscribers for new post`);
          }
        } catch (notificationError) {
          console.error("Failed to send notifications for new post:", notificationError);
        }
      }
      res.json(newPost[0]);
    } catch (error) {
      console.error("Error creating post:", error);
      if (error instanceof Error) {
        if (error.message.includes("foreign key")) {
          res.status(400).json({ error: "Invalid creator ID or tier" });
        } else if (error.message.includes("duplicate")) {
          res.status(400).json({ error: "Post already exists" });
        } else {
          res.status(500).json({ error: error.message });
        }
      } else {
        res.status(500).json({ error: "Failed to create post" });
      }
    }
  });
  app2.put("/api/posts/:id", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const updateData = { ...req.body };
      if (updateData.scheduled_for && typeof updateData.scheduled_for === "string") {
        updateData.scheduled_for = new Date(updateData.scheduled_for);
      }
      const post = await storage.updatePost(postId, updateData);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Update post error:", error);
      res.status(500).json({ error: "Failed to update post" });
    }
  });
  app2.delete("/api/posts/:id", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const post = await storage.getPost(postId);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      const deleted = await storage.deletePost(postId);
      if (!deleted) {
        return res.status(500).json({ error: "Failed to delete post" });
      }
      res.json({ success: true, message: "Post deleted successfully" });
    } catch (error) {
      console.error("Delete post error:", error);
      res.status(500).json({ error: "Failed to delete post" });
    }
  });
  app2.get("/api/posts/:postId/comments", async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const comments3 = await storage.getComments(postId);
      const commentsWithUsers = await Promise.all(
        comments3.map(async (comment) => {
          const user = await storage.getUser(comment.user_id);
          return {
            ...comment,
            user: user ? {
              id: user.id,
              username: user.username,
              avatar: user.avatar
            } : null
          };
        })
      );
      const topLevelComments = commentsWithUsers.filter((c) => !c.parent_id);
      const repliesMap = /* @__PURE__ */ new Map();
      commentsWithUsers.filter((c) => c.parent_id).forEach((reply) => {
        const parentId = reply.parent_id;
        if (!repliesMap.has(parentId)) {
          repliesMap.set(parentId, []);
        }
        repliesMap.get(parentId).push(reply);
      });
      const organizedComments = topLevelComments.map((comment) => ({
        ...comment,
        replies: repliesMap.get(comment.id) || []
      }));
      res.json(organizedComments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  });
  app2.post("/api/posts/:postId/comments", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const postId = parseInt(req.params.postId);
      const userId = req.session.userId;
      console.log("Creating comment with data:", { ...req.body, post_id: postId, user_id: userId });
      const validatedData = insertCommentSchema.parse({
        ...req.body,
        user_id: userId,
        // Use authenticated user from session
        post_id: postId
      });
      const comment = await storage.createComment(validatedData);
      const user = await storage.getUser(comment.user_id);
      const commentWithUser = {
        ...comment,
        user: user ? {
          id: user.id,
          username: user.username,
          avatar: user.avatar
        } : null
      };
      const post = await storage.getPost(postId);
      if (post && post.creator_id !== comment.user_id) {
        console.log(`Sending comment notification to creator ${post.creator_id} for post ${postId} from user ${comment.user_id}`);
        try {
          await NotificationService.notifyNewComment(
            post.creator_id,
            comment.user_id,
            postId,
            post.title || post.content || "your post",
            comment.content
          );
          console.log("Comment notification sent successfully");
        } catch (notificationError) {
          console.error("Failed to send comment notification:", notificationError);
        }
      } else if (post && post.creator_id === comment.user_id) {
        console.log("Skipping notification - creator commented on their own post");
      } else {
        console.log("Post not found for comment notification");
      }
      res.json(commentWithUser);
    } catch (error) {
      console.error("Create comment error:", error);
      res.status(500).json({ error: "Failed to create comment" });
    }
  });
  app2.post("/api/posts/:postId/like", async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const { userId } = req.body;
      const success = await storage.likePost(postId, userId);
      if (success) {
        const post = await storage.getPost(postId);
        if (post && post.creator_id !== userId) {
          console.log(`Sending like notification to creator ${post.creator_id} for post ${postId} from user ${userId}`);
          try {
            await NotificationService.notifyPostLike(
              post.creator_id,
              userId,
              postId,
              post.title || post.content || "your post"
            );
            console.log("Like notification sent successfully");
          } catch (notificationError) {
            console.error("Failed to send like notification:", notificationError);
          }
        } else if (post && post.creator_id === userId) {
          console.log("Skipping notification - creator liked their own post");
        } else {
          console.log("Post not found for like notification");
        }
      }
      res.json({ success });
    } catch (error) {
      console.error("Error liking post:", error);
      res.status(500).json({ error: "Failed to like post" });
    }
  });
  app2.delete("/api/posts/:postId/like", async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const { userId } = req.body;
      const success = await storage.unlikePost(postId, userId);
      res.json({ success });
    } catch (error) {
      res.status(500).json({ error: "Failed to unlike post" });
    }
  });
  app2.get("/api/posts/:postId/like/:userId", async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const userId = parseInt(req.params.userId);
      const liked = await storage.isPostLiked(postId, userId);
      res.json({ liked });
    } catch (error) {
      res.status(500).json({ error: "Failed to check like status" });
    }
  });
  app2.post("/api/comments/:commentId/like", async (req, res) => {
    try {
      const commentId = parseInt(req.params.commentId);
      const { userId } = req.body;
      const success = await storage.likeComment(commentId, userId);
      if (success) {
        const comment = await storage.getComment(commentId);
        if (comment && comment.user_id !== userId) {
          const post = await storage.getPost(comment.post_id);
          if (post) {
            console.log(`Sending comment like notification to comment author ${comment.user_id} for comment ${commentId} from user ${userId}`);
            try {
              await NotificationService.notifyCommentLike(
                comment.user_id,
                userId,
                commentId,
                comment.post_id,
                post.title || post.content || "a post"
              );
              console.log("Comment like notification sent successfully");
            } catch (notificationError) {
              console.error("Failed to send comment like notification:", notificationError);
            }
          }
        } else if (comment && comment.user_id === userId) {
          console.log("Skipping notification - user liked their own comment");
        } else {
          console.log("Comment not found for like notification");
        }
      }
      res.json({ success });
    } catch (error) {
      console.error("Error liking comment:", error);
      res.status(500).json({ error: "Failed to like comment" });
    }
  });
  app2.delete("/api/comments/:commentId/like", async (req, res) => {
    try {
      const commentId = parseInt(req.params.commentId);
      const { userId } = req.body;
      const success = await storage.unlikeComment(commentId, userId);
      res.json({ success });
    } catch (error) {
      res.status(500).json({ error: "Failed to unlike comment" });
    }
  });
  app2.get("/api/comments/:commentId/like/:userId", async (req, res) => {
    try {
      const commentId = parseInt(req.params.commentId);
      const userId = parseInt(req.params.userId);
      const liked = await storage.isCommentLiked(commentId, userId);
      res.json({ liked });
    } catch (error) {
      res.status(500).json({ error: "Failed to check like status" });
    }
  });
  app2.get("/api/creators/:creatorId/tiers", async (req, res) => {
    try {
      const creatorId = parseInt(req.params.creatorId);
      const tiers = await storage.getSubscriptionTiers(creatorId);
      res.json(tiers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subscription tiers" });
    }
  });
  app2.get("/api/creator/:creatorId/tier-performance", async (req, res) => {
    try {
      const creatorId = parseInt(req.params.creatorId);
      const tierPerformance = await storage.getSubscriptionTierPerformance(creatorId);
      const formattedTierPerformance = tierPerformance.map((tier) => ({
        ...tier,
        subscribers: Number(tier.subscribers),
        revenue: Number(tier.revenue),
        price: Number(tier.price)
      }));
      console.log("Tier performance data being sent:", formattedTierPerformance);
      res.json(formattedTierPerformance);
    } catch (error) {
      console.error("Error fetching tier performance:", error);
      res.status(500).json({ error: "Failed to fetch tier performance" });
    }
  });
  app2.post("/api/creators/:creatorId/tiers", async (req, res) => {
    try {
      const creatorId = parseInt(req.params.creatorId);
      console.log("Creating tier for creator:", creatorId, "with data:", req.body);
      const tierData = {
        ...req.body,
        creator_id: creatorId,
        // Keep benefits as array - don't stringify it
        benefits: Array.isArray(req.body.benefits) ? req.body.benefits : req.body.benefits ? [req.body.benefits] : []
      };
      const tier = await storage.createSubscriptionTier(tierData);
      res.json(tier);
    } catch (error) {
      console.error("Create subscription tier error:", error);
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to create subscription tier" });
      }
    }
  });
  app2.put("/api/tiers/:tierId", async (req, res) => {
    try {
      const tierId = parseInt(req.params.tierId);
      const tier = await storage.updateSubscriptionTier(tierId, req.body);
      if (!tier) {
        return res.status(404).json({ error: "Tier not found" });
      }
      res.json(tier);
    } catch (error) {
      res.status(500).json({ error: "Failed to update subscription tier" });
    }
  });
  app2.delete("/api/tiers/:tierId", async (req, res) => {
    try {
      const tierId = parseInt(req.params.tierId);
      const deleted = await storage.deleteSubscriptionTier(tierId);
      if (!deleted) {
        return res.status(404).json({ error: "Tier not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete subscription tier" });
    }
  });
  app2.get("/api/users/:userId/subscriptions", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const subscriptions2 = await storage.getSubscriptions(userId);
      res.json(subscriptions2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subscriptions" });
    }
  });
  app2.get("/api/subscriptions/user/:userId/creator/:creatorId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const creatorId = parseInt(req.params.creatorId);
      console.log(`Checking subscription API: user ${userId} to creator ${creatorId}`);
      const subscription = await storage.getUserSubscriptionToCreator(userId, creatorId);
      console.log("Found subscription:", subscription);
      if (subscription && subscription.status === "active") {
        console.log(`\u2713 Active subscription found: ${subscription.id}`);
        const enrichedSubscription = {
          ...subscription,
          tier_name: subscription.tier_name || "unknown"
        };
        res.json(enrichedSubscription);
      } else {
        console.log(`\u2717 No active subscription found`);
        res.status(404).json(null);
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
      res.status(500).json({ error: "Failed to check subscription status" });
    }
  });
  app2.post("/api/subscriptions", async (req, res) => {
    try {
      console.log("Creating subscription with data:", req.body);
      const processedData = {
        ...req.body,
        fan_id: parseInt(req.body.fan_id),
        creator_id: parseInt(req.body.creator_id),
        tier_id: parseInt(req.body.tier_id),
        started_at: req.body.started_at ? new Date(req.body.started_at) : /* @__PURE__ */ new Date(),
        next_billing_date: req.body.next_billing_date ? new Date(req.body.next_billing_date) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3),
        ends_at: req.body.ends_at ? new Date(req.body.ends_at) : null,
        auto_renew: req.body.auto_renew !== void 0 ? req.body.auto_renew : true
        // Default to true
      };
      Object.keys(processedData).forEach((key) => {
        if (processedData[key] === void 0) {
          delete processedData[key];
        }
      });
      const validatedData = insertSubscriptionSchema.parse(processedData);
      console.log("Validated data:", validatedData);
      const existingSubscription = await storage.getUserSubscriptionToCreator(
        validatedData.fan_id,
        validatedData.creator_id
      );
      if (existingSubscription) {
        console.log("User already has subscription:", existingSubscription);
        return res.status(400).json({ error: "Already subscribed to this creator" });
      }
      const subscription = await storage.createSubscription(validatedData);
      console.log("Created subscription:", subscription);
      try {
        const currentSubscribers = await storage.getCreatorSubscribers(validatedData.creator_id);
        const subscriberCount = currentSubscribers.length;
        await storage.updateUser(validatedData.creator_id, {
          total_subscribers: subscriberCount
        });
        console.log("Updated creator " + validatedData.creator_id + " subscriber count to " + subscriberCount);
      } catch (error) {
        console.error("Error updating creator subscriber count:", error);
      }
      try {
        const tier = await storage.getSubscriptionTier(validatedData.tier_id);
        const tierName = tier?.name || "unknown";
        console.log(`Creating new subscriber notification: creator=${validatedData.creator_id}, fan=${validatedData.fan_id}, tier=${tierName}`);
        await NotificationService.notifyNewSubscriber(
          validatedData.creator_id,
          validatedData.fan_id,
          tierName
        );
        console.log(`\u2705 Sent notification to creator ${validatedData.creator_id} for new subscriber ${validatedData.fan_id} (${tierName} tier)`);
      } catch (notificationError) {
        console.error("\u274C Failed to send new subscriber notification:", notificationError);
      }
      res.json(subscription);
    } catch (error) {
      console.error("Subscription creation error:", error);
      res.status(500).json({ error: "Failed to create subscription" });
    }
  });
  app2.put("/api/subscriptions/:id", async (req, res) => {
    try {
      const subscriptionId = parseInt(req.params.id);
      const { status, auto_renew } = req.body;
      if (!status && auto_renew === void 0) {
        return res.status(400).json({ error: "Status or auto_renew is required" });
      }
      const updateData = {};
      if (status) updateData.status = status;
      if (auto_renew !== void 0) updateData.auto_renew = auto_renew;
      await db.update(subscriptions).set(updateData).where(eq3(subscriptions.id, subscriptionId));
      res.json({ success: true, message: "Subscription updated successfully" });
    } catch (error) {
      console.error("Error updating subscription:", error);
      res.status(500).json({ error: "Failed to update subscription" });
    }
  });
  app2.put("/api/subscriptions/:subscriptionId/cancel", async (req, res) => {
    try {
      const subscriptionId = parseInt(req.params.subscriptionId);
      const success = await storage.cancelSubscription(subscriptionId);
      if (!success) {
        return res.status(404).json({ error: "Subscription not found" });
      }
      res.json({ message: "Subscription cancelled successfully" });
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      res.status(500).json({ error: "Failed to cancel subscription" });
    }
  });
  app2.get("/api/subscriptions/fan/:fanId", async (req, res) => {
    try {
      const fanId = parseInt(req.params.fanId);
      console.log("Fetching subscriptions for fan ID:", fanId);
      const subscriptions2 = await db.select({
        id: subscriptions.id,
        status: subscriptions.status,
        current_period_end: subscriptions.next_billing_date,
        created_at: subscriptions.created_at,
        auto_renew: subscriptions.auto_renew,
        creator: {
          id: users.id,
          username: users.username,
          display_name: users.display_name,
          avatar: users.avatar
        },
        tier: {
          name: subscription_tiers.name,
          price: subscription_tiers.price
        }
      }).from(subscriptions).innerJoin(users, eq3(subscriptions.creator_id, users.id)).innerJoin(subscription_tiers, eq3(subscriptions.tier_id, subscription_tiers.id)).where(eq3(subscriptions.fan_id, fanId));
      console.log("Found subscriptions:", subscriptions2);
      res.json(subscriptions2);
    } catch (error) {
      console.error("Error fetching fan subscriptions:", error);
      res.status(500).json({ error: "Failed to fetch subscriptions" });
    }
  });
  app2.get("/api/fan/:fanId/recent-activity", async (req, res) => {
    try {
      const fanId = parseInt(req.params.fanId);
      const limit = parseInt(req.query.limit) || 20;
      const offset = parseInt(req.query.offset) || 0;
      const subscribedCreators = await db.select({
        creator_id: subscriptions.creator_id
      }).from(subscriptions).where(and3(
        eq3(subscriptions.fan_id, fanId),
        eq3(subscriptions.status, "active")
      ));
      if (subscribedCreators.length === 0) {
        return res.json({ activities: [], total: 0, hasMore: false });
      }
      const creatorIds = subscribedCreators.map((sub) => sub.creator_id);
      const thirtyDaysAgo = /* @__PURE__ */ new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const totalCountResult = await db.select({ count: count() }).from(posts).where(and3(
        inArray(posts.creator_id, creatorIds),
        eq3(posts.status, "published"),
        gte2(posts.created_at, thirtyDaysAgo)
      ));
      const totalCount = totalCountResult[0]?.count || 0;
      const recentPosts = await db.select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        media_type: posts.media_type,
        created_at: posts.created_at,
        views_count: posts.views_count,
        duration: posts.duration,
        creator: {
          id: users.id,
          username: users.username,
          display_name: users.display_name,
          avatar: users.avatar
        }
      }).from(posts).innerJoin(users, eq3(posts.creator_id, users.id)).where(and3(
        inArray(posts.creator_id, creatorIds),
        eq3(posts.status, "published"),
        gte2(posts.created_at, thirtyDaysAgo)
      )).orderBy(desc2(posts.created_at)).limit(limit).offset(offset);
      const activities = recentPosts.map((post) => ({
        id: post.id.toString(),
        type: "new_post",
        creator: post.creator.display_name || post.creator.username,
        message: "shared a new " + (post.media_type === "video" ? "video" : "post"),
        time: formatTimeAgo(new Date(post.created_at)),
        avatar: post.creator.avatar || "/placeholder.svg",
        views: post.views_count,
        duration: post.duration
      }));
      if (!req.query.limit && !req.query.offset) {
        return res.json(activities.slice(0, 10));
      }
      res.json({
        activities,
        total: totalCount,
        hasMore: offset + limit < totalCount,
        limit,
        offset
      });
    } catch (error) {
      console.error("Error fetching recent activity:", error);
      res.status(500).json({ error: "Failed to fetch recent activity" });
    }
  });
  app2.get("/api/fan/:fanId/favorites", async (req, res) => {
    try {
      const fanId = parseInt(req.params.fanId);
      const favorites = await storage.getFanFavorites(fanId);
      res.json(favorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.delete("/api/subscriptions/:subscriptionId", async (req, res) => {
    try {
      const subscriptionId = parseInt(req.params.subscriptionId);
      const cancelled = await storage.cancelSubscription(subscriptionId);
      if (!cancelled) {
        return res.status(404).json({ error: "Subscription not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to cancel subscription" });
    }
  });
  app2.use("/api/admin", admin_default);
  app2.get("/api/admin/users", async (req, res) => {
    try {
      const users2 = await db.select({
        id: users.id,
        username: users.username,
        email: users.email,
        role: users.role,
        status: users.status,
        created_at: users.created_at,
        avatar: users.avatar,
        total_subscribers: users.total_subscribers,
        total_earnings: users.total_earnings
      }).from(users);
      res.json(users2);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });
  app2.put("/api/admin/users/:id/status", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { status } = req.body;
      if (!["active", "suspended"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      const updatedUser = await db.update(users).set({
        status,
        updated_at: /* @__PURE__ */ new Date()
      }).where(eq3(users.id, userId)).returning();
      if (updatedUser.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      const { password: _, ...userWithoutPassword } = updatedUser[0];
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Failed to update user status:", error);
      res.status(500).json({ error: "Failed to update user status" });
    }
  });
  app2.get("/api/creators", async (req, res) => {
    try {
      const creators = await storage.getCreators();
      res.json(creators);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch creators" });
    }
  });
  app2.get("/api/categories", async (req, res) => {
    try {
      const includeInactive = req.query.include_inactive === "true";
      const categories2 = await storage.getCategories(includeInactive);
      res.json(categories2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });
  app2.post("/api/categories", async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      console.error("Create category error:", error);
      res.status(400).json({ error: "Failed to create category" });
    }
  });
  app2.put("/api/categories/:id", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.id);
      const categoryData = insertCategorySchema.parse(req.body);
      const updated = await storage.updateCategory(categoryId, categoryData);
      if (!updated) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update category" });
    }
  });
  app2.delete("/api/categories/:id", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.id);
      const deleted = await storage.deleteCategory(categoryId);
      if (!deleted) {
        return res.status(400).json({ error: "Cannot delete category - it may be in use by creators" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete category" });
    }
  });
  app2.put("/api/categories/:id/toggle", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.id);
      const toggled = await storage.toggleCategoryStatus(categoryId);
      if (!toggled) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to toggle category status" });
    }
  });
  app2.get("/api/creators/:id/categories", async (req, res) => {
    try {
      const creatorId = parseInt(req.params.id);
      const categories2 = await storage.getCreatorCategories(creatorId);
      res.json(categories2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch creator categories" });
    }
  });
  app2.get("/api/categories/all", async (req, res) => {
    try {
      const categories2 = await storage.getCategories();
      res.json(categories2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch all categories" });
    }
  });
  app2.get("/api/categories/:id", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.id);
      const category = await storage.getCategory(categoryId);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch category" });
    }
  });
  app2.get("/api/categories/:id/creators", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.id);
      const creators = await storage.getCreatorsByCategory(categoryId);
      res.json(creators);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch creators for category" });
    }
  });
  app2.get("/api/creators/:id/primary-category", async (req, res) => {
    try {
      const creatorId = parseInt(req.params.id);
      const category = await storage.getCreatorPrimaryCategory(creatorId);
      res.json(category || null);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch creator primary category" });
    }
  });
  app2.post("/api/creators/:id/categories", async (req, res) => {
    try {
      const creatorId = parseInt(req.params.id);
      const creatorCategoryData = insertCreatorCategorySchema.parse({
        ...req.body,
        creator_id: creatorId
      });
      const creatorCategory = await storage.addCreatorToCategory(creatorCategoryData);
      res.status(201).json(creatorCategory);
    } catch (error) {
      console.error("Add creator to category error:", error);
      res.status(400).json({ error: "Failed to add creator to category" });
    }
  });
  app2.delete("/api/creators/:id/categories/:categoryId", async (req, res) => {
    try {
      const creatorId = parseInt(req.params.id);
      const categoryId = parseInt(req.params.categoryId);
      const removed = await storage.removeCreatorFromCategory(creatorId, categoryId);
      if (!removed) {
        return res.status(404).json({ error: "Creator category association not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to remove creator from category" });
    }
  });
  app2.put("/api/creators/:id/primary-category", async (req, res) => {
    try {
      const creatorId = parseInt(req.params.id);
      const { categoryId } = req.body;
      const updated = await storage.updateCreatorPrimaryCategory(creatorId, categoryId);
      if (!updated) {
        return res.status(400).json({ error: "Failed to update primary category" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update creator primary category" });
    }
  });
  app2.get("/api/creators/:creatorId/subscribers", async (req, res) => {
    try {
      const creatorId = parseInt(req.params.creatorId);
      const limit = req.query.limit ? parseInt(req.query.limit) : void 0;
      const recent = req.query.recent === "true";
      console.log("Fetching subscribers for creator:", creatorId);
      const subscribersQuery = await db.select({
        id: subscriptions.id,
        fan_id: subscriptions.fan_id,
        creator_id: subscriptions.creator_id,
        tier_id: subscriptions.tier_id,
        status: subscriptions.status,
        created_at: subscriptions.created_at,
        next_billing_date: subscriptions.next_billing_date,
        auto_renew: subscriptions.auto_renew,
        // User information
        username: users.username,
        email: users.email,
        avatar: users.avatar,
        display_name: users.display_name,
        // Tier information
        tier_name: subscription_tiers.name,
        tier_price: subscription_tiers.price
      }).from(subscriptions).innerJoin(users, eq3(subscriptions.fan_id, users.id)).leftJoin(subscription_tiers, eq3(subscriptions.tier_id, subscription_tiers.id)).where(and3(
        eq3(subscriptions.creator_id, creatorId),
        eq3(subscriptions.status, "active")
      )).orderBy(desc2(subscriptions.created_at));
      let subscribers = subscribersQuery.map((sub) => ({
        ...sub,
        joined: new Date(sub.created_at).toLocaleDateString(),
        tier: sub.tier_name || "Basic"
      }));
      console.log("Found subscribers:", subscribers.length, subscribers);
      if (recent) {
        subscribers = subscribers.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }
      if (limit) {
        subscribers = subscribers.slice(0, limit);
      }
      res.json(subscribers);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      res.status(500).json({ error: "Failed to fetch subscribers" });
    }
  });
  app2.get("/api/creator/:creatorId/analytics", async (req, res) => {
    try {
      const creatorId = parseInt(req.params.creatorId);
      const subscribers = await storage.getCreatorSubscribers(creatorId);
      const subscriberCount = subscribers.length;
      const tierPerformance = await storage.getSubscriptionTierPerformance(creatorId);
      const monthlyEarnings = tierPerformance.reduce((total, tier) => total + tier.revenue, 0);
      const creatorPosts = await db.select({
        id: posts.id,
        likes_count: posts.likes_count,
        comments_count: posts.comments_count,
        created_at: posts.created_at
      }).from(posts).where(and3(
        eq3(posts.creator_id, creatorId),
        eq3(posts.status, "published")
      ));
      let engagementRate = 0;
      if (creatorPosts.length > 0 && subscriberCount > 0) {
        const totalEngagements = creatorPosts.reduce(
          (sum2, post) => sum2 + (post.likes_count || 0) + (post.comments_count || 0),
          0
        );
        const totalPossibleEngagements = creatorPosts.length * subscriberCount;
        engagementRate = Math.round(totalEngagements / totalPossibleEngagements * 100);
      }
      const postsThisMonth = creatorPosts.filter((post) => {
        const postDate = new Date(post.created_at);
        const now = /* @__PURE__ */ new Date();
        return postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear();
      }).length;
      const totalEarnings = monthlyEarnings * 12;
      let growthRate = 0;
      if (subscriberCount > 0) {
        const lastMonth = /* @__PURE__ */ new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        const recentSubscribers = subscribers.filter((sub) => {
          const subDate = new Date(sub.created_at);
          return subDate >= lastMonth;
        }).length;
        if (subscriberCount > recentSubscribers) {
          growthRate = Math.round(recentSubscribers / (subscriberCount - recentSubscribers) * 100);
        }
      }
      const analytics = {
        subscribers: subscriberCount,
        monthlyEarnings,
        totalEarnings,
        growthRate,
        engagementRate,
        postsThisMonth
      };
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching creator analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });
  app2.get("/api/creator/:creatorId/content", async (req, res) => {
    try {
      const creatorId = parseInt(req.params.creatorId);
      const creatorPosts = await db.select({
        id: posts.id,
        creator_id: posts.creator_id,
        title: posts.title,
        content: posts.content,
        media_type: posts.media_type,
        media_urls: posts.media_urls,
        tier: posts.tier,
        status: posts.status,
        scheduled_for: posts.scheduled_for,
        created_at: posts.created_at,
        updated_at: posts.updated_at,
        likes_count: posts.likes_count,
        comments_count: posts.comments_count,
        views_count: posts.views_count,
        duration: posts.duration,
        username: users.username,
        avatar: users.avatar
      }).from(posts).leftJoin(users, eq3(posts.creator_id, users.id)).where(eq3(posts.creator_id, creatorId)).orderBy(desc2(posts.created_at));
      res.json(creatorPosts);
    } catch (error) {
      console.error("Error fetching creator content:", error);
      res.status(500).json({ error: "Failed to fetch creator content" });
    }
  });
  app2.get("/api/creator/:creatorId/goals", async (req, res) => {
    try {
      const creatorId = parseInt(req.params.creatorId);
      const storedGoals = await storage.getCreatorGoals(creatorId);
      const subscribers = await storage.getCreatorSubscribers(creatorId);
      const subscriberCount = subscribers.length;
      const tierPerformance = await storage.getSubscriptionTierPerformance(creatorId);
      const monthlyRevenue = tierPerformance.reduce((total, tier) => total + tier.revenue, 0);
      const userPosts = await storage.getPosts();
      const creatorPosts = userPosts.filter((post) => post.creator_id === creatorId);
      const postsThisMonth = creatorPosts.filter((post) => {
        const postDate = new Date(post.created_at);
        const now = /* @__PURE__ */ new Date();
        return postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear();
      }).length;
      const goals = {
        subscriberGoal: storedGoals?.subscriberGoal || 30,
        revenueGoal: storedGoals?.revenueGoal || 1e3,
        postsGoal: storedGoals?.postsGoal || 15,
        currentSubscribers: subscriberCount,
        currentRevenue: monthlyRevenue,
        currentPosts: postsThisMonth
      };
      console.log("Returning goals:", goals);
      res.json(goals);
    } catch (error) {
      console.error("Error fetching creator goals:", error);
      res.status(500).json({ error: "Failed to fetch goals" });
    }
  });
  app2.post("/api/creator/:creatorId/goals", async (req, res) => {
    try {
      const creatorId = parseInt(req.params.creatorId);
      const { subscriberGoal, revenueGoal, postsGoal } = req.body;
      await storage.saveCreatorGoals(creatorId, {
        subscriberGoal: parseInt(subscriberGoal) || 0,
        revenueGoal: parseInt(revenueGoal) || 0,
        postsGoal: parseInt(postsGoal) || 0
      });
      res.json({ success: true, message: "Goals saved successfully" });
    } catch (error) {
      console.error("Error saving creator goals:", error);
      res.status(500).json({ error: "Failed to save goals" });
    }
  });
  app2.post("/api/upload/profile-photo", upload.single("profilePhoto"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
      }
      const photoUrl = "/uploads/" + req.file.filename;
      if (req.session?.userId) {
        try {
          await db.update(users).set({ avatar: photoUrl }).where(eq3(users.id, req.session.userId));
          console.log("Updated avatar for user " + req.session.userId + ": " + photoUrl);
        } catch (dbError) {
          console.error("Failed to update avatar in database:", dbError);
        }
      }
      res.json({
        success: true,
        url: photoUrl,
        message: "Profile photo uploaded successfully"
      });
    } catch (error) {
      console.error("Profile photo upload error:", error);
      res.status(500).json({ success: false, message: "Upload failed" });
    }
  });
  app2.post("/api/upload/cover-photo", upload.single("coverPhoto"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
      }
      const photoUrl = "/uploads/" + req.file.filename;
      if (req.session?.userId) {
        try {
          await db.update(users).set({ cover_image: photoUrl }).where(eq3(users.id, req.session.userId));
          console.log("Updated cover image for user " + req.session.userId + ": " + photoUrl);
        } catch (dbError) {
          console.error("Failed to update cover image in database:", dbError);
        }
      }
      res.json({
        success: true,
        url: photoUrl,
        message: "Cover photo uploaded successfully"
      });
    } catch (error) {
      console.error("Cover photo upload error:", error);
      res.status(500).json({ success: false, message: "Upload failed" });
    }
  });
  app2.post("/api/upload/post-media", upload.single("media"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const fileUrl = "/uploads/" + req.file.filename;
      res.json({
        success: true,
        url: fileUrl,
        filename: req.file.filename,
        message: "Media uploaded successfully"
      });
    } catch (error) {
      console.error("Post media upload error:", error);
      res.status(500).json({ error: "Failed to upload media" });
    }
  });
  app2.post("/api/reports", async (req, res) => {
    try {
      const validatedData = insertReportSchema.parse(req.body);
      const report = await storage.createReport(validatedData);
      res.json(report);
    } catch (error) {
      console.error("Create report error:", error);
      res.status(500).json({ error: "Failed to create report" });
    }
  });
  app2.get("/api/admin/reports", async (req, res) => {
    try {
      const allReports = await storage.getReports();
      res.json(allReports);
    } catch (error) {
      console.error("Get reports error:", error);
      res.status(500).json({ error: "Failed to fetch reports" });
    }
  });
  app2.put("/api/admin/reports/:id/status", async (req, res) => {
    try {
      const reportId = parseInt(req.params.id);
      const { status, adminNotes } = req.body;
      const resolvedBy = req.session?.userId;
      const report = await storage.updateReportStatus(reportId, status, adminNotes, resolvedBy);
      res.json(report);
    } catch (error) {
      console.error("Update report status error:", error);
      res.status(500).json({ error: "Failed to update report status" });
    }
  });
  app2.put("/api/users/profile", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const { display_name, bio } = req.body;
      const updatedUser = await db.update(users).set({
        display_name: display_name || null,
        bio: bio || null,
        updated_at: /* @__PURE__ */ new Date()
      }).where(eq3(users.id, req.session.userId)).returning();
      if (updatedUser.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ success: true, user: updatedUser[0] });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });
  app2.post("/api/users/sync-profile", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const { displayName, bio, profilePhotoUrl, coverPhotoUrl, socialLinks } = req.body;
      const updateData = { updated_at: /* @__PURE__ */ new Date() };
      if (displayName !== void 0) updateData.display_name = displayName;
      if (bio !== void 0) updateData.bio = bio;
      if (profilePhotoUrl !== void 0) updateData.avatar = profilePhotoUrl;
      if (coverPhotoUrl !== void 0) updateData.cover_image = coverPhotoUrl;
      if (socialLinks !== void 0) updateData.social_links = socialLinks;
      const updatedUser = await db.update(users).set(updateData).where(eq3(users.id, req.session.userId)).returning();
      if (updatedUser.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ success: true, user: updatedUser[0] });
    } catch (error) {
      console.error("Profile sync error:", error);
      res.status(500).json({ error: "Failed to sync profile" });
    }
  });
  app2.get("/api/user/settings", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const userId = req.session.userId;
      const userData = await db.select({
        comments_enabled: users.comments_enabled,
        auto_post_enabled: users.auto_post_enabled,
        watermark_enabled: users.watermark_enabled,
        profile_discoverable: users.profile_discoverable,
        activity_status_visible: users.activity_status_visible,
        is_online: users.is_online,
        last_seen: users.last_seen,
        social_links: users.social_links
      }).from(users).where(eq3(users.id, userId)).limit(1);
      if (userData.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(userData[0]);
    } catch (error) {
      console.error("Error fetching user settings:", error);
      res.status(500).json({ error: "Failed to fetch user settings" });
    }
  });
  app2.post("/api/user/content-settings", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const userId = req.session.userId;
      const { comments_enabled, auto_post_enabled, watermark_enabled } = req.body;
      const updateData = { updated_at: /* @__PURE__ */ new Date() };
      if (comments_enabled !== void 0) updateData.comments_enabled = comments_enabled;
      if (auto_post_enabled !== void 0) updateData.auto_post_enabled = auto_post_enabled;
      if (watermark_enabled !== void 0) updateData.watermark_enabled = watermark_enabled;
      await db.update(users).set(updateData).where(eq3(users.id, userId));
      res.json({ success: true });
    } catch (error) {
      console.error("Error saving content settings:", error);
      res.status(500).json({ error: "Failed to save content settings" });
    }
  });
  app2.post("/api/user/change-password", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Current password and new password are required" });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ error: "New password must be at least 6 characters long" });
      }
      const [user] = await db.select().from(users).where(eq3(users.id, userId)).limit(1);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const isCurrentPasswordValid = await bcrypt2.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }
      const saltRounds = 10;
      const hashedNewPassword = await bcrypt2.hash(newPassword, saltRounds);
      await db.update(users).set({
        password: hashedNewPassword,
        updated_at: /* @__PURE__ */ new Date()
      }).where(eq3(users.id, userId));
      res.json({ success: true, message: "Password updated successfully" });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({ error: "Failed to change password" });
    }
  });
  app2.post("/api/user/privacy-settings", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      const { profile_discoverable, activity_status_visible, profile_visibility, allow_direct_messages } = req.body;
      await db.update(users).set({
        profile_discoverable: profile_discoverable !== void 0 ? profile_discoverable : void 0,
        activity_status_visible: activity_status_visible !== void 0 ? activity_status_visible : void 0,
        updated_at: /* @__PURE__ */ new Date()
      }).where(eq3(users.id, userId));
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating privacy settings:", error);
      res.status(500).json({ error: "Failed to update privacy settings" });
    }
  });
  app2.get("/api/user/notification-preferences", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      res.json({
        email_notifications: true,
        push_notifications: false
      });
    } catch (error) {
      console.error("Error fetching notification preferences:", error);
      res.status(500).json({ error: "Failed to fetch notification preferences" });
    }
  });
  app2.post("/api/user/notification-preferences", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      const { email_notifications, push_notifications } = req.body;
      console.log(`User ${userId} notification preferences:`, { email_notifications, push_notifications });
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating notification preferences:", error);
      res.status(500).json({ error: "Failed to update notification preferences" });
    }
  });
  app2.get("/api/users/:id/online-status", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const userData = await db.select({
        is_online: users.is_online,
        last_seen: users.last_seen,
        activity_status_visible: users.activity_status_visible
      }).from(users).where(eq3(users.id, userId)).limit(1);
      if (userData.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      const user = userData[0];
      if (!user.activity_status_visible) {
        return res.json({
          is_online: false,
          last_seen: null,
          activity_status_visible: false
        });
      }
      res.json({
        is_online: user.is_online,
        last_seen: user.last_seen,
        activity_status_visible: user.activity_status_visible
      });
    } catch (error) {
      console.error("Error fetching online status:", error);
      res.status(500).json({ error: "Failed to fetch online status" });
    }
  });
  app2.get("/api/creators/:id/comments-enabled", async (req, res) => {
    try {
      const creatorId = parseInt(req.params.id);
      const result = await db.select({
        comments_enabled: users.comments_enabled
      }).from(users).where(eq3(users.id, creatorId)).limit(1);
      if (result.length === 0) {
        return res.status(404).json({ error: "Creator not found" });
      }
      res.json({ comments_enabled: result[0].comments_enabled });
    } catch (error) {
      console.error("Error checking comments enabled:", error);
      res.status(500).json({ error: "Failed to check comments enabled" });
    }
  });
  app2.get("/api/creators/:id/payout-settings", async (req, res) => {
    try {
      const creatorId = parseInt(req.params.id);
      if (!req.session?.userId || req.session.userId !== creatorId && req.session.user?.role !== "admin") {
        return res.status(403).json({ error: "Unauthorized" });
      }
      const settings = await storage.getCreatorPayoutSettings(creatorId);
      res.json({ success: true, data: settings });
    } catch (error) {
      console.error("Error fetching payout settings:", error);
      res.status(500).json({ error: "Failed to fetch payout settings" });
    }
  });
  app2.post("/api/creators/:id/payout-settings", async (req, res) => {
    try {
      const creatorId = parseInt(req.params.id);
      if (!req.session?.userId || req.session.userId !== creatorId) {
        return res.status(403).json({ error: "Unauthorized" });
      }
      const validatedData = insertCreatorPayoutSettingsSchema.parse({
        ...req.body,
        creator_id: creatorId
      });
      const settings = await storage.saveCreatorPayoutSettings(validatedData);
      res.json({ success: true, data: settings });
    } catch (error) {
      console.error("Error saving payout settings:", error);
      res.status(500).json({ error: "Failed to save payout settings" });
    }
  });
  app2.put("/api/creators/:id/payout-settings", async (req, res) => {
    try {
      const creatorId = parseInt(req.params.id);
      if (!req.session?.userId || req.session.userId !== creatorId) {
        return res.status(403).json({ error: "Unauthorized" });
      }
      const settings = await storage.updateCreatorPayoutSettings(creatorId, req.body);
      if (!settings) {
        return res.status(404).json({ error: "Settings not found" });
      }
      res.json({ success: true, data: settings });
    } catch (error) {
      console.error("Error updating payout settings:", error);
      res.status(500).json({ error: "Failed to update payout settings" });
    }
  });
  app2.use("/api/payments", payment_default);
  app2.use("/api/payment-test", payment_test_default);
  app2.use("/api/payouts", payouts_default);
  app2.use("/api/admin", admin_default);
  app2.use("/api/subscriptions", subscriptions_default);
  app2.get("/api/admin/platform-settings", async (req, res) => {
    try {
      const settings = await storage.getPlatformSettings();
      res.json({ success: true, data: settings });
    } catch (error) {
      console.error("Error fetching platform settings:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch platform settings"
      });
    }
  });
  app2.put("/api/admin/platform-settings", async (req, res) => {
    try {
      const { commission_rate, ...otherSettings } = req.body;
      if (commission_rate !== void 0) {
        const rate = parseFloat(commission_rate);
        if (isNaN(rate) || rate < 0 || rate > 1) {
          return res.status(400).json({
            success: false,
            message: "Commission rate must be between 0 and 1 (0% to 100%)"
          });
        }
      }
      await storage.updatePlatformSettings({
        commission_rate: commission_rate ? parseFloat(commission_rate) : 0.05,
        ...otherSettings
      });
      res.json({
        success: true,
        message: "Platform settings updated successfully"
      });
    } catch (error) {
      console.error("Error updating platform settings:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to update platform settings"
      });
    }
  });
  app2.get("/api/admin/commission-rate", async (req, res) => {
    try {
      const settings = await storage.getPlatformSettings();
      const commissionPercentage = (settings.commission_rate * 100).toFixed(1);
      res.json({
        success: true,
        commission_rate_decimal: settings.commission_rate,
        commission_rate_percentage: commissionPercentage + "%",
        message: "Current commission rate is " + commissionPercentage + "%"
      });
    } catch (error) {
      console.error("Error fetching commission rate:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch commission rate"
      });
    }
  });
  app2.get("/api/notifications", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const limit = parseInt(req.query.limit) || 20;
      const notifications2 = await storage.getNotifications(userId, limit);
      const enrichedNotifications = await Promise.all(
        notifications2.map(async (notification) => {
          let actor = null;
          if (notification.actor_id) {
            actor = await storage.getUser(notification.actor_id);
          }
          return {
            ...notification,
            actor: actor ? {
              id: actor.id,
              username: actor.username,
              display_name: actor.display_name,
              avatar: actor.avatar
            } : null,
            time_ago: formatTimeAgo(notification.created_at)
          };
        })
      );
      res.json(enrichedNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });
  app2.get("/api/notifications/unread-count", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const count2 = await storage.getUnreadNotificationCount(userId);
      res.json({ count: count2 });
    } catch (error) {
      console.error("Error fetching unread notification count:", error);
      res.status(500).json({ error: "Failed to fetch unread count" });
    }
  });
  app2.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const notificationId = parseInt(req.params.id);
      const success = await storage.markNotificationAsRead(notificationId);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Notification not found" });
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ error: "Failed to mark notification as read" });
    }
  });
  app2.patch("/api/notifications/mark-all-read", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const success = await storage.markAllNotificationsAsRead(userId);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(500).json({ error: "Failed to mark notifications as read" });
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      res.status(500).json({ error: "Failed to mark all notifications as read" });
    }
  });
  app2.delete("/api/notifications/:id", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const notificationId = parseInt(req.params.id);
      const success = await storage.deleteNotification(notificationId);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Notification not found" });
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      res.status(500).json({ error: "Failed to delete notification" });
    }
  });
  app2.get("/api/notification-preferences", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      let preferences = await storage.getNotificationPreferences(userId);
      if (!preferences) {
        preferences = await storage.createNotificationPreferences({ user_id: userId });
      }
      res.json(preferences);
    } catch (error) {
      console.error("Error fetching notification preferences:", error);
      res.status(500).json({ error: "Failed to fetch notification preferences" });
    }
  });
  app2.patch("/api/notification-preferences", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const updates = req.body;
      let preferences = await storage.updateNotificationPreferences(userId, updates);
      if (!preferences) {
        preferences = await storage.createNotificationPreferences({ user_id: userId, ...updates });
      }
      res.json(preferences);
    } catch (error) {
      console.error("Error updating notification preferences:", error);
      res.status(500).json({ error: "Failed to update notification preferences" });
    }
  });
  app2.get("/api/conversations", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      console.log("Fetching conversations for user:", userId);
      const fanConversations = await db.select({
        id: conversations.id,
        other_participant_id: conversations.participant_2_id,
        participant_1_id: conversations.participant_1_id,
        participant_2_id: conversations.participant_2_id,
        updated_at: conversations.updated_at,
        creator_username: users.username,
        creator_display_name: users.display_name,
        creator_avatar: users.avatar
      }).from(conversations).leftJoin(users, eq3(conversations.participant_2_id, users.id)).where(and3(
        eq3(conversations.participant_1_id, userId),
        sql2`${conversations.participant_1_id} != ${conversations.participant_2_id}`
      )).orderBy(desc2(conversations.updated_at));
      const creatorConversations = await db.select({
        id: conversations.id,
        other_participant_id: conversations.participant_1_id,
        participant_1_id: conversations.participant_1_id,
        participant_2_id: conversations.participant_2_id,
        updated_at: conversations.updated_at,
        fan_username: users.username,
        fan_display_name: users.display_name,
        fan_avatar: users.avatar
      }).from(conversations).leftJoin(users, eq3(conversations.participant_1_id, users.id)).where(and3(
        eq3(conversations.participant_2_id, userId),
        sql2`${conversations.participant_1_id} != ${conversations.participant_2_id}`
      )).orderBy(desc2(conversations.updated_at));
      const allConversationIds = [
        ...fanConversations.map((c) => c.id),
        ...creatorConversations.map((c) => c.id)
      ];
      let lastMessages = /* @__PURE__ */ new Map();
      if (allConversationIds.length > 0) {
        const messages3 = await db.select({
          conversation_id: messages.conversation_id,
          content: messages.content,
          created_at: messages.created_at
        }).from(messages).where(inArray(messages.conversation_id, allConversationIds)).orderBy(desc2(messages.created_at));
        messages3.forEach((message) => {
          if (!lastMessages.has(message.conversation_id)) {
            lastMessages.set(message.conversation_id, message.content);
          }
        });
      }
      let allConversations = [];
      fanConversations.forEach((conv) => {
        if (conv.other_participant_id !== userId) {
          allConversations.push({
            id: conv.id,
            other_participant_id: conv.other_participant_id,
            creator: {
              username: conv.creator_username,
              display_name: conv.creator_display_name,
              avatar: conv.creator_avatar
            },
            last_message: lastMessages.get(conv.id) || "No messages yet",
            timestamp: conv.updated_at,
            unread: false,
            unread_count: 0
          });
        }
      });
      creatorConversations.forEach((conv) => {
        if (conv.other_participant_id !== userId) {
          allConversations.push({
            id: conv.id,
            other_participant_id: conv.other_participant_id,
            creator: {
              username: conv.fan_username,
              display_name: conv.fan_display_name,
              avatar: conv.fan_avatar
            },
            last_message: lastMessages.get(conv.id) || "No messages yet",
            timestamp: conv.updated_at,
            unread: false,
            unread_count: 0
          });
        }
      });
      allConversations.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      console.log("Found conversations:", allConversations.length);
      res.json(allConversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });
  app2.get("/api/conversations/:conversationId/messages", async (req, res) => {
    try {
      const { conversationId } = req.params;
      const currentUserId = req.session?.userId;
      if (!currentUserId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      console.log("Fetching messages for conversation:", conversationId, "user:", currentUserId);
      const conversation = await db.select().from(conversations).where(
        and3(
          eq3(conversations.id, parseInt(conversationId)),
          or(
            eq3(conversations.participant_1_id, currentUserId),
            eq3(conversations.participant_2_id, currentUserId)
          )
        )
      ).limit(1);
      if (conversation.length === 0) {
        return res.status(403).json({ error: "Access denied to this conversation" });
      }
      const messages3 = await db.select({
        id: messages.id,
        sender: users.username,
        content: messages.content,
        timestamp: messages.created_at,
        type: sql2`CASE WHEN ${messages.sender_id} = ${currentUserId} THEN 'sent' ELSE 'received' END`
      }).from(messages).leftJoin(users, eq3(messages.sender_id, users.id)).where(eq3(messages.conversation_id, parseInt(conversationId))).orderBy(asc(messages.created_at));
      console.log("Found messages:", messages3.length);
      res.json(messages3);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });
  app2.post("/api/conversations/:conversationId/messages", async (req, res) => {
    try {
      const { conversationId } = req.params;
      const { content } = req.body;
      const senderId = req.session?.userId;
      if (!senderId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const conversation = await db.select().from(conversations).where(eq3(conversations.id, parseInt(conversationId))).limit(1);
      if (conversation.length === 0) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      const recipientId = conversation[0].participant_1_id === senderId ? conversation[0].participant_2_id : conversation[0].participant_1_id;
      console.log("Sending message in conversation:", conversationId, "from:", senderId, "to:", recipientId);
      const [message] = await db.insert(messages).values({
        conversation_id: parseInt(conversationId),
        sender_id: senderId,
        recipient_id: recipientId,
        content
      }).returning();
      await db.update(conversations).set({
        updated_at: /* @__PURE__ */ new Date()
      }).where(eq3(conversations.id, parseInt(conversationId)));
      const senderInfo = await db.select({
        username: users.username,
        display_name: users.display_name,
        avatar: users.avatar
      }).from(users).where(eq3(users.id, senderId)).limit(1);
      if (senderInfo.length > 0) {
        const realTimeMessage = {
          id: message.id.toString(),
          sender: senderInfo[0].display_name || senderInfo[0].username,
          content: message.content,
          timestamp: message.created_at.toISOString(),
          type: "received"
          // Will be adjusted on client side based on current user
        };
        if (app2.locals.broadcastNotificationToUser) {
          app2.locals.broadcastNotificationToUser(recipientId, {
            type: "new_message_realtime",
            conversationId,
            message: realTimeMessage
          });
          app2.locals.broadcastNotificationToUser(senderId, {
            type: "new_message_realtime",
            conversationId,
            message: realTimeMessage
          });
        }
      }
      await NotificationService.notifyNewMessage(recipientId, senderId, content);
      console.log("Message sent successfully:", message.id);
      res.json({ message: "Message sent successfully", messageId: message.id });
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });
  app2.post("/api/conversations", async (req, res) => {
    try {
      const { otherUserId } = req.body;
      const currentUserId = req.session?.userId;
      if (!currentUserId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      if (currentUserId === otherUserId) {
        return res.status(400).json({ error: "Cannot create conversation with yourself" });
      }
      console.log("Creating conversation between:", currentUserId, "and", otherUserId);
      const existingConversation = await db.select().from(conversations).where(
        or(
          and3(
            eq3(conversations.participant_1_id, currentUserId),
            eq3(conversations.participant_2_id, otherUserId)
          ),
          and3(
            eq3(conversations.participant_1_id, otherUserId),
            eq3(conversations.participant_2_id, currentUserId)
          )
        )
      ).limit(1);
      if (existingConversation.length > 0) {
        console.log("Found existing conversation:", existingConversation[0].id);
        return res.json({ conversationId: existingConversation[0].id });
      }
      const [newConversation] = await db.insert(conversations).values({
        participant_1_id: currentUserId,
        participant_2_id: otherUserId
      }).returning();
      console.log("Created new conversation:", newConversation.id);
      res.json({ conversationId: newConversation.id });
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(500).json({ error: "Failed to create conversation" });
    }
  });
  app2.get("/api/health/database", async (req, res) => {
    try {
      const userCount = await db.select({ count: count() }).from(users);
      const postCount = await db.select({ count: count() }).from(posts);
      const subscriptionCount = await db.select({ count: count() }).from(subscriptions);
      res.json({
        status: "healthy",
        data: {
          users: userCount[0]?.count || 0,
          posts: postCount[0]?.count || 0,
          subscriptions: subscriptionCount[0]?.count || 0
        },
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    } catch (error) {
      console.error("Database health check failed:", error);
      res.status(500).json({
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
  });
  app2.post("/api/test-notifications", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const testNotifications = [
        {
          user_id: userId,
          type: "new_subscriber",
          title: "New Subscriber!",
          message: "John Doe subscribed to your Premium tier",
          action_url: "/creator/subscribers",
          metadata: null
        },
        {
          user_id: userId,
          type: "new_message",
          title: "New Message",
          message: "Sarah Wilson: Hey! Love your content...",
          action_url: "/fan/messages",
          metadata: {}
        },
        {
          user_id: userId,
          type: "payment_success",
          title: "Payment Successful",
          message: "Your payment of GHS 50 for Premium tier was processed successfully",
          action_url: "/fan/subscriptions",
          metadata: {}
        },
        {
          user_id: userId,
          type: "new_post",
          title: "New Content",
          message: 'FitnessGuru posted: "5 Tips for Building Muscle"',
          action_url: "/fan/posts/123",
          metadata: {}
        }
      ];
      for (const notification of testNotifications) {
        await NotificationService.createNotification(notification);
      }
      res.json({ message: "Test notifications created and broadcasted successfully", count: testNotifications.length });
    } catch (error) {
      console.error("Error creating test notifications:", error);
      res.status(500).json({ error: "Failed to create test notifications" });
    }
  });
  app2.post("/api/test-realtime-notification", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const { type = "test", title = "Test Notification", message = "This is a real-time test notification" } = req.body;
      await NotificationService.createNotification({
        user_id: userId,
        type,
        title,
        message,
        action_url: "/fan/notifications",
        metadata: {}
      });
      res.json({ message: "Real-time test notification sent successfully" });
    } catch (error) {
      console.error("Error creating real-time test notification:", error);
      res.status(500).json({ error: "Failed to create test notification" });
    }
  });
  app2.post("/api/push-subscription", async (req, res) => {
    try {
      const { subscription, userId } = req.body;
      if (!userId || !subscription) {
        return res.status(400).json({ error: "Missing userId or subscription" });
      }
      console.log("Push subscription registered for user:", userId);
      console.log("Subscription details:", JSON.stringify(subscription, null, 2));
      res.json({ success: true, message: "Push subscription registered successfully" });
    } catch (error) {
      console.error("Error registering push subscription:", error);
      res.status(500).json({ error: "Failed to register push subscription" });
    }
  });
  app2.delete("/api/push-subscription", async (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ error: "Missing userId" });
      }
      console.log("Push subscription removed for user:", userId);
      res.json({ success: true, message: "Push subscription removed successfully" });
    } catch (error) {
      console.error("Error removing push subscription:", error);
      res.status(500).json({ error: "Failed to remove push subscription" });
    }
  });
  app2.post("/api/test-push-notification", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const { title = "Test Push Notification", message = "This is a test push notification from Xclusive Creator Hub" } = req.body;
      console.log(`Test push notification for user ${userId}:`, { title, message });
      res.json({ success: true, message: "Test push notification triggered" });
    } catch (error) {
      console.error("Error sending test push notification:", error);
      res.status(500).json({ error: "Failed to send test push notification" });
    }
  });
  app2.post("/api/test-subscription-notification", async (req, res) => {
    try {
      const { creatorId, fanId, tierName = "Test Tier" } = req.body;
      if (!creatorId || !fanId) {
        return res.status(400).json({ error: "creatorId and fanId are required" });
      }
      console.log(`Testing subscription notification: creator=${creatorId}, fan=${fanId}, tier=${tierName}`);
      await NotificationService.notifyNewSubscriber(
        parseInt(creatorId),
        parseInt(fanId),
        tierName
      );
      res.json({
        success: true,
        message: `Test subscription notification sent to creator ${creatorId} for fan ${fanId}`
      });
    } catch (error) {
      console.error("Error sending test subscription notification:", error);
      res.status(500).json({ error: "Failed to send test subscription notification" });
    }
  });
  app2.post("/api/creators/:creatorId/like", async (req, res) => {
    try {
      const creatorId = parseInt(req.params.creatorId);
      const { fanId } = req.body;
      if (!fanId) {
        return res.status(400).json({ error: "fanId is required" });
      }
      const existingLike = await db.select().from(creator_likes).where(and3(
        eq3(creator_likes.fan_id, fanId),
        eq3(creator_likes.creator_id, creatorId)
      )).limit(1);
      if (existingLike.length > 0) {
        return res.status(400).json({ error: "Creator already liked" });
      }
      await db.insert(creator_likes).values({
        fan_id: fanId,
        creator_id: creatorId
      });
      res.json({ success: true, message: "Creator liked successfully" });
    } catch (error) {
      console.error("Error liking creator:", error);
      res.status(500).json({ error: "Failed to like creator" });
    }
  });
  app2.delete("/api/creators/:creatorId/like", async (req, res) => {
    try {
      const creatorId = parseInt(req.params.creatorId);
      const { fanId } = req.body;
      if (!fanId) {
        return res.status(400).json({ error: "fanId is required" });
      }
      await db.delete(creator_likes).where(and3(
        eq3(creator_likes.fan_id, fanId),
        eq3(creator_likes.creator_id, creatorId)
      ));
      res.json({ success: true, message: "Creator unliked successfully" });
    } catch (error) {
      console.error("Error unliking creator:", error);
      res.status(500).json({ error: "Failed to unlike creator" });
    }
  });
  app2.get("/api/creators/:creatorId/like/:fanId", async (req, res) => {
    try {
      const creatorId = parseInt(req.params.creatorId);
      const fanId = parseInt(req.params.fanId);
      const like2 = await db.select().from(creator_likes).where(and3(
        eq3(creator_likes.fan_id, fanId),
        eq3(creator_likes.creator_id, creatorId)
      )).limit(1);
      res.json({ liked: like2.length > 0 });
    } catch (error) {
      console.error("Error checking creator like status:", error);
      res.status(500).json({ error: "Failed to check like status" });
    }
  });
  app2.post("/api/creators/:creatorId/favorite", async (req, res) => {
    try {
      const creatorId = parseInt(req.params.creatorId);
      const { fanId } = req.body;
      if (!fanId) {
        return res.status(400).json({ error: "fanId is required" });
      }
      const existingFavorite = await db.select().from(creator_favorites).where(and3(
        eq3(creator_favorites.fan_id, fanId),
        eq3(creator_favorites.creator_id, creatorId)
      )).limit(1);
      if (existingFavorite.length > 0) {
        return res.status(400).json({ error: "Creator already favorited" });
      }
      await db.insert(creator_favorites).values({
        fan_id: fanId,
        creator_id: creatorId
      });
      res.json({ success: true, message: "Creator added to favorites successfully" });
    } catch (error) {
      console.error("Error favoriting creator:", error);
      res.status(500).json({ error: "Failed to favorite creator" });
    }
  });
  app2.delete("/api/creators/:creatorId/favorite", async (req, res) => {
    try {
      const creatorId = parseInt(req.params.creatorId);
      const { fanId } = req.body;
      if (!fanId) {
        return res.status(400).json({ error: "fanId is required" });
      }
      await db.delete(creator_favorites).where(and3(
        eq3(creator_favorites.fan_id, fanId),
        eq3(creator_favorites.creator_id, creatorId)
      ));
      res.json({ success: true, message: "Creator removed from favorites successfully" });
    } catch (error) {
      console.error("Error unfavoriting creator:", error);
      res.status(500).json({ error: "Failed to unfavorite creator" });
    }
  });
  app2.get("/api/creators/:creatorId/favorite/:fanId", async (req, res) => {
    try {
      const creatorId = parseInt(req.params.creatorId);
      const fanId = parseInt(req.params.fanId);
      const favorite = await db.select().from(creator_favorites).where(and3(
        eq3(creator_favorites.fan_id, fanId),
        eq3(creator_favorites.creator_id, creatorId)
      )).limit(1);
      res.json({ favorited: favorite.length > 0 });
    } catch (error) {
      console.error("Error checking creator favorite status:", error);
      res.status(500).json({ error: "Failed to check favorite status" });
    }
  });
  app2.get("/api/creators/:creatorId/likes-count", async (req, res) => {
    try {
      const creatorId = parseInt(req.params.creatorId);
      const count2 = await storage.getCreatorLikeCount(creatorId);
      res.json({ count: count2 });
    } catch (error) {
      console.error("Error getting creator likes count:", error);
      res.status(500).json({ error: "Failed to get likes count" });
    }
  });
  app2.post("/api/creators/:creatorId/follow", async (req, res) => {
    try {
      const creatorId = parseInt(req.params.creatorId);
      const { followerId } = req.body;
      if (!followerId) {
        return res.status(400).json({ error: "followerId is required" });
      }
      const existingFollow = await db.select().from(follows).where(and3(
        eq3(follows.follower_id, followerId),
        eq3(follows.creator_id, creatorId)
      )).limit(1);
      if (existingFollow.length > 0) {
        return res.status(400).json({ error: "Creator already followed" });
      }
      await db.insert(follows).values({
        follower_id: followerId,
        creator_id: creatorId
      });
      await db.update(users).set({
        total_followers: sql2`${users.total_followers} + 1`
      }).where(eq3(users.id, creatorId));
      res.json({ success: true, message: "Creator followed successfully" });
    } catch (error) {
      console.error("Error following creator:", error);
      res.status(500).json({ error: "Failed to follow creator" });
    }
  });
  app2.delete("/api/creators/:creatorId/follow", async (req, res) => {
    try {
      const creatorId = parseInt(req.params.creatorId);
      const { followerId } = req.body;
      if (!followerId) {
        return res.status(400).json({ error: "followerId is required" });
      }
      const result = await db.delete(follows).where(and3(
        eq3(follows.follower_id, followerId),
        eq3(follows.creator_id, creatorId)
      ));
      if (result.rowCount && result.rowCount > 0) {
        await db.update(users).set({
          total_followers: sql2`${users.total_followers} - 1`
        }).where(eq3(users.id, creatorId));
      }
      res.json({ success: true, message: "Creator unfollowed successfully" });
    } catch (error) {
      console.error("Error unfollowing creator:", error);
      res.status(500).json({ error: "Failed to unfollow creator" });
    }
  });
  app2.get("/api/creators/:creatorId/follow/:followerId", async (req, res) => {
    try {
      const creatorId = parseInt(req.params.creatorId);
      const followerId = parseInt(req.params.followerId);
      const follow = await db.select().from(follows).where(and3(
        eq3(follows.follower_id, followerId),
        eq3(follows.creator_id, creatorId)
      )).limit(1);
      res.json({ following: follow.length > 0 });
    } catch (error) {
      console.error("Error checking creator follow status:", error);
      res.status(500).json({ error: "Failed to check follow status" });
    }
  });
  app2.get("/api/creators/:creatorId/followers-count", async (req, res) => {
    try {
      const creatorId = parseInt(req.params.creatorId);
      const count2 = await storage.getCreatorFollowerCount(creatorId);
      res.json({ count: count2 });
    } catch (error) {
      console.error("Error getting creator followers count:", error);
      res.status(500).json({ error: "Failed to get followers count" });
    }
  });
  const httpServer = createServer(app2);
  const wss = new WebSocketServer({
    server: httpServer,
    path: "/ws",
    verifyClient: (info) => {
      return true;
    },
    // Add ping/pong to maintain connection
    clientTracking: true,
    perMessageDeflate: false,
    maxPayload: 16 * 1024 * 1024
    // 16MB
  });
  const activeConnections = /* @__PURE__ */ new Map();
  wss.on("connection", (ws, req) => {
    console.log("WebSocket client connected");
    let userId = null;
    let pingInterval = null;
    const startHeartbeat = () => {
      pingInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.ping();
        } else {
          if (pingInterval) clearInterval(pingInterval);
        }
      }, 3e4);
    };
    ws.on("pong", () => {
    });
    ws.on("message", async (data) => {
      try {
        const message = JSON.parse(data.toString());
        if (message.type === "auth" && message.userId) {
          userId = parseInt(message.userId);
          if (!activeConnections.has(userId)) {
            activeConnections.set(userId, /* @__PURE__ */ new Set());
          }
          activeConnections.get(userId).add(ws);
          try {
            await db.update(users).set({
              is_online: true,
              last_seen: /* @__PURE__ */ new Date(),
              updated_at: /* @__PURE__ */ new Date()
            }).where(eq3(users.id, userId));
          } catch (error) {
            console.error("Error updating online status:", error);
          }
          console.log(`User ${userId} connected via WebSocket`);
          startHeartbeat();
          ws.send(JSON.stringify({
            type: "auth_success",
            message: "Authentication successful"
          }));
        } else if (message.type === "ping") {
          ws.send(JSON.stringify({ type: "pong" }));
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    });
    ws.on("close", async (code, reason) => {
      console.log("WebSocket client disconnected", { code, reason: reason.toString() });
      if (pingInterval) {
        clearInterval(pingInterval);
        pingInterval = null;
      }
      if (userId && activeConnections.has(userId)) {
        activeConnections.get(userId).delete(ws);
        if (activeConnections.get(userId).size === 0) {
          activeConnections.delete(userId);
          try {
            await db.update(users).set({
              is_online: false,
              last_seen: /* @__PURE__ */ new Date(),
              updated_at: /* @__PURE__ */ new Date()
            }).where(eq3(users.id, userId));
          } catch (error) {
            console.error("Error updating offline status:", error);
          }
        }
      }
    });
    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
      if (pingInterval) {
        clearInterval(pingInterval);
        pingInterval = null;
      }
    });
  });
  const broadcastNotificationToUser = (userId, notification) => {
    const userConnections = activeConnections.get(userId);
    if (userConnections && userConnections.size > 0) {
      const message = JSON.stringify({
        type: "new_notification",
        notification
      });
      userConnections.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(message);
        }
      });
      console.log(`Broadcast notification to user ${userId} on ${userConnections.size} connection(s)`);
    }
  };
  app2.locals.broadcastNotificationToUser = broadcastNotificationToUser;
  NotificationService.setBroadcastFunction(broadcastNotificationToUser);
  app2.get("/api/users/username/:username", async (req, res) => {
    try {
      const { username } = req.params;
      const decodedUsername = decodeURIComponent(username);
      console.log("Looking for user with username:", decodedUsername);
      const user = await db.select().from(users).where(eq3(users.username, decodedUsername)).limit(1);
      if (user.length === 0) {
        console.log("User not found:", decodedUsername);
        return res.status(404).json({ error: "User not found" });
      }
      console.log("Found user:", user[0]);
      res.json(user[0]);
    } catch (error) {
      console.error("Error fetching user by username:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  function formatTimeAgo(date) {
    const now = /* @__PURE__ */ new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1e3);
    if (diffInSeconds < 60) {
      return "just now";
    }
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return diffInMinutes + " minute" + (diffInMinutes === 1 ? "" : "s") + " ago";
    }
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return diffInHours + " hour" + (diffInHours === 1 ? "" : "s") + " ago";
    }
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return diffInDays + " day" + (diffInDays === 1 ? "" : "s") + " ago";
    }
    return date.toLocaleDateString();
  }
  app2.get("/api/notifications", async (req, res) => {
    try {
      const userId = req.session.userId;
      console.log("Fetching notifications for user:", userId);
      if (!userId) {
        console.log("No user ID found in request");
        return res.status(401).json({ error: "User not authenticated" });
      }
      const limit = parseInt(req.query.limit) || 20;
      const notifications2 = await storage.getNotifications(userId, limit);
      console.log("Found notifications:", notifications2?.length || 0);
      const enrichedNotifications = await Promise.all(
        notifications2.map(async (notification) => {
          let actor = null;
          if (notification.actor_id) {
            actor = await storage.getUser(notification.actor_id);
          }
          return {
            ...notification,
            actor: actor ? {
              id: actor.id,
              username: actor.username,
              display_name: actor.display_name,
              avatar: actor.avatar
            } : null,
            time_ago: formatTimeAgo(notification.created_at)
          };
        })
      );
      res.json(enrichedNotifications || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });
  app2.get("/api/notifications/unread-count", async (req, res) => {
    try {
      const userId = req.session.userId;
      console.log("Fetching unread count for user:", userId);
      if (!userId) {
        console.log("No user ID found for unread count");
        return res.status(401).json({ error: "Not authenticated" });
      }
      const count2 = await storage.getUnreadNotificationCount(userId);
      console.log("Unread notification count:", count2);
      res.json({ count: count2 || 0 });
    } catch (error) {
      console.error("Error fetching unread count:", error);
      res.status(500).json({ error: "Failed to fetch unread count" });
    }
  });
  app2.get("/api/payments/verify/:reference", async (req, res) => {
    try {
      const { reference } = req.params;
      if (process.env.NODE_ENV === "development") {
        res.json({
          success: true,
          data: {
            status: "success",
            reference,
            amount: 1500,
            // GHS 15.00
            customer: {
              email: "test@example.com"
            }
          }
        });
        return;
      }
      const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: {
          "Authorization": `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json"
        }
      });
      const paystackData = await paystackResponse.json();
      if (paystackData.status && paystackData.data.status === "success") {
        res.json({
          success: true,
          data: paystackData.data
        });
      } else {
        res.json({
          success: false,
          message: "Payment verification failed"
        });
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });
  app2.get("/payment/callback", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/index.html"));
  });
  return httpServer;
}

// server/vite.ts
import express7 from "express";
import fs2 from "fs";
import path3 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path2 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path2.resolve(import.meta.dirname, "client", "src"),
      "@shared": path2.resolve(import.meta.dirname, "shared"),
      "@assets": path2.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path2.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path2.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: {
      server,
      port: 5e3,
      host: "0.0.0.0",
      clientPort: 5e3
      // Use same port for client connections
    },
    allowedHosts: true,
    host: "0.0.0.0"
    // Ensure Vite listens on all interfaces
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(import.meta.dirname, "..", "dist", "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express7.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/init-db.ts
init_db();
init_schema();
import { sql as sql3 } from "drizzle-orm";
import path4 from "path";
import { fileURLToPath } from "url";
import bcrypt3 from "bcrypt";
import { eq as eq4 } from "drizzle-orm";
var __filename = fileURLToPath(import.meta.url);
var __dirname2 = path4.dirname(__filename);
async function seedCategories() {
  try {
    console.log("Checking if categories need to be seeded...");
    const categoryCount = await db.execute(sql3`SELECT COUNT(*) as count FROM categories`);
    const count2 = categoryCount.rows?.[0]?.count || 0;
    if (count2 > 0) {
      console.log(`Categories table already has ${count2} categories, skipping seed`);
      return;
    }
    console.log("Categories table is empty, seeding with default categories...");
    const defaultCategories = [
      {
        name: "Art & Design",
        slug: "art-design",
        description: "Visual artists, designers, illustrators, and creative professionals",
        icon: "Palette",
        color: "#ff6b6b"
      },
      {
        name: "Music & Audio",
        slug: "music-audio",
        description: "Musicians, podcasters, audio producers, and sound artists",
        icon: "Music",
        color: "#4ecdc4"
      },
      {
        name: "Photography",
        slug: "photography",
        description: "Photographers, photo editors, and visual storytellers",
        icon: "Camera",
        color: "#45b7d1"
      },
      {
        name: "Video & Film",
        slug: "video-film",
        description: "Video creators, filmmakers, animators, and content producers",
        icon: "Video",
        color: "#96ceb4"
      },
      {
        name: "Writing & Literature",
        slug: "writing-literature",
        description: "Authors, bloggers, journalists, and storytellers",
        icon: "PenTool",
        color: "#ffeaa7"
      },
      {
        name: "Education & Tutorials",
        slug: "education-tutorials",
        description: "Teachers, course creators, and educational content makers",
        icon: "GraduationCap",
        color: "#dda0dd"
      },
      {
        name: "Fitness & Health",
        slug: "fitness-health",
        description: "Fitness trainers, nutritionists, and wellness coaches",
        icon: "Heart",
        color: "#fd79a8"
      },
      {
        name: "Gaming & Tech",
        slug: "gaming-tech",
        description: "Gamers, tech reviewers, and technology enthusiasts",
        icon: "Gamepad2",
        color: "#6c5ce7"
      },
      {
        name: "Comedy & Entertainment",
        slug: "comedy-entertainment",
        description: "Comedians, entertainers, and performance artists",
        icon: "Laugh",
        color: "#fdcb6e"
      },
      {
        name: "Lifestyle & Fashion",
        slug: "lifestyle-fashion",
        description: "Fashion influencers, lifestyle bloggers, and style creators",
        icon: "Sparkles",
        color: "#e17055"
      },
      {
        name: "Food & Cooking",
        slug: "food-cooking",
        description: "Chefs, food bloggers, and culinary content creators",
        icon: "ChefHat",
        color: "#00b894"
      },
      {
        name: "Business & Finance",
        slug: "business-finance",
        description: "Entrepreneurs, financial advisors, and business coaches",
        icon: "TrendingUp",
        color: "#0984e3"
      }
    ];
    await db.insert(categories).values(defaultCategories);
    console.log(`Successfully seeded ${defaultCategories.length} default categories`);
  } catch (error) {
    console.error("Error seeding categories:", error);
  }
}
async function initializeDatabase() {
  console.log("Initializing database tables...");
  try {
    console.log("Testing database connection...");
    const result = await Promise.race([
      db.execute(sql3`SELECT 1 as test`),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Database connection timeout after 8 seconds")), 8e3))
    ]);
    console.log("Database connection test successful", result);
    const tablesCheck = await db.execute(sql3`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    const existingTables = tablesCheck.rows?.map((row) => row.table_name) || [];
    console.log("Existing tables:", existingTables);
    const requiredTables = [
      "users",
      "posts",
      "comments",
      "subscriptions",
      "subscription_tiers",
      "notifications",
      "messages",
      "conversations",
      "reports",
      "creator_likes",
      "creator_favorites",
      "creator_payout_settings",
      "creator_payouts",
      "categories",
      "creator_categories",
      "comment_likes",
      "post_likes",
      "payment_transactions",
      "notification_preferences"
    ];
    const missingTables = requiredTables.filter((table) => !existingTables.includes(table));
    if (missingTables.length === 0) {
      console.log("All required tables exist, seeding essential data...");
      await seedCategories();
      console.log("Database initialization complete");
      return;
    }
    console.log("Missing tables detected:", missingTables);
    console.log("Database schema is complete with all required tables");
    await seedCategories();
    const adminExists = await db.select().from(users).where(eq4(users.role, "admin")).limit(1);
    if (adminExists.length === 0) {
      console.log("Creating default admin user...");
      const hashedPassword = await bcrypt3.hash("admin123", 10);
      await db.insert(users).values({
        username: "admin",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
        status: "active",
        verified: true,
        created_at: /* @__PURE__ */ new Date(),
        updated_at: /* @__PURE__ */ new Date()
      });
      console.log("Default admin user created successfully");
    } else {
      console.log("Admin user already exists, skipping creation");
    }
    console.log("Database initialization completed successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    console.error("Full error details:", {
      message: error?.message || "Unknown error",
      stack: error?.stack || "No stack trace available",
      name: error?.name || "Unknown error type"
    });
    console.log("Attempting to clean up connections and retry...");
    try {
      await db.execute(sql3`SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE pid <> pg_backend_pid() AND datname = current_database()`);
      console.log("Connection cleanup completed");
    } catch (cleanupError) {
      console.warn("Connection cleanup failed:", cleanupError);
    }
    console.warn("Database initialization failed, but continuing app startup...");
    console.warn("Some features may not work until database connectivity is restored");
  }
}

// server/index.ts
init_db();
init_schema();
import cookieParser from "cookie-parser";
import { eq as eq5 } from "drizzle-orm";
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Promise Rejection at:", promise, "reason:", reason);
  console.error("Stack trace:", reason instanceof Error ? reason.stack : "No stack trace available");
});
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  console.error("Stack trace:", error.stack);
  if (process.env.NODE_ENV !== "production") {
    process.exit(1);
  }
});
var app = express8();
app.use(express8.json());
app.use(express8.urlencoded({ extended: false }));
app.use(cookieParser());
app.use((req, res, next) => {
  const start = Date.now();
  const path5 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path5.startsWith("/api")) {
      let logLine = `${req.method} ${path5} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  try {
    console.log("Starting route registration...");
    const server = await registerRoutes(app);
    console.log("Route registration completed");
    console.log("Starting database initialization in background...");
    await initializeDatabase();
    const bcrypt4 = await import("bcrypt");
    const adminExists = await db.select().from(users).where(eq5(users.role, "admin")).limit(1);
    if (adminExists.length === 0) {
      console.log("Creating admin user...");
      const hashedPassword = await bcrypt4.hash("admin123", 10);
      await db.insert(users).values({
        username: "admin",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
        status: "active",
        verified: true,
        created_at: /* @__PURE__ */ new Date(),
        updated_at: /* @__PURE__ */ new Date()
      });
      console.log("Admin user created successfully");
    }
    console.log("Database initialization started in background");
    app.use(async (err, req, res, _next) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      console.error("Express error:", err);
      try {
        await monitoringService.recordError("express_error", err, {
          path: req.path,
          method: req.method,
          status,
          userAgent: req.get("User-Agent"),
          ip: req.ip
        });
      } catch (monitoringError) {
        console.error("Failed to record error in monitoring:", monitoringError);
      }
      if (!res.headersSent) {
        res.status(status).json({ message });
      }
    });
    if (process.env.NODE_ENV === "production") {
      console.log("Setting up static file serving for production...");
      serveStatic(app);
      console.log("Static file serving setup completed");
    } else {
      console.log("Setting up Vite for development...");
      await setupVite(app, server);
      console.log("Vite setup completed");
    }
    console.log("Starting monitoring service...");
    try {
      monitoringService.start();
      console.log("Monitoring service started successfully");
    } catch (error) {
      console.error("Error starting monitoring service:", error);
    }
    console.log("Starting cron service in background...");
    setTimeout(() => {
      try {
        cronService.start();
        console.log("Cron service started successfully");
      } catch (error) {
        console.error("Error starting cron service:", error);
      }
    }, 1e3);
    process.on("SIGINT", () => {
      console.log("Shutting down server...");
      try {
        monitoringService.stop();
      } catch (error) {
        console.error("Error during shutdown:", error);
      }
      process.exit(0);
    });
    process.on("SIGTERM", () => {
      console.log("Shutting down server...");
      try {
        monitoringService.stop();
      } catch (error) {
        console.error("Error during shutdown:", error);
      }
      process.exit(0);
    });
    const port = 5e3;
    console.log(`Starting server on port ${port}...`);
    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(`Port ${port} is already in use. Attempting to kill existing processes...`);
        try {
          __require("child_process").execSync(`pkill -f "tsx server/index.ts" && pkill -f "npm run dev"`, { stdio: "ignore" });
          console.log("Killed existing processes. Please restart the server.");
        } catch (e) {
          console.error("Could not kill existing processes. Please manually stop other server instances.");
        }
        process.exit(1);
      } else {
        console.error("Server error:", err);
        process.exit(1);
      }
    });
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true
    }, () => {
      log(`serving on port ${port}`);
    });
  } catch (error) {
    console.error("Fatal error during server startup:", error);
    console.error("Stack trace:", error instanceof Error ? error.stack : "No stack trace available");
    process.exit(1);
  }
})();
