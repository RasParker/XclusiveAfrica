// Core types for Jukwaa platform

export interface User {
  id: number;
  email: string;
  username: string;
  avatar?: string | null;
  role: 'fan' | 'creator' | 'admin';
  status: 'active' | 'suspended';
  display_name?: string | null;
  bio?: string | null;
  cover_image?: string | null;
  social_links?: {
    twitter?: string;
    instagram?: string;
    website?: string;
  } | null;
  verified: boolean;
  total_subscribers: number;
  total_followers: number;
  total_earnings: string;
  commission_rate: string;
  comments_enabled: boolean;
  auto_post_enabled: boolean;
  watermark_enabled: boolean;
  profile_discoverable: boolean;
  activity_status_visible: boolean;
  is_online: boolean;
  last_seen?: string | null;
  primary_category_id?: number | null;
  created_at: string;
  updated_at: string;
}

export interface Creator extends User {
  role: 'creator';
  display_name: string;
}

export interface SubscriptionTier {
  id: number;
  creator_id: number;
  name: string;
  description?: string | null;
  price: string;
  currency: string;
  benefits: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: number;
  fan_id: number;
  creator_id: number;
  tier_id: number;
  status: 'active' | 'paused' | 'cancelled' | 'expired';
  started_at: string;
  ends_at?: string | null;
  auto_renew: boolean;
  next_billing_date?: string | null;
  previous_tier_id?: number | null;
  billing_cycle_anchor?: string | null;
  proration_credit?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: number;
  creator_id: number;
  title: string;
  content?: string | null;
  media_urls: string[];
  media_type: string;
  tier: string;
  status: 'published' | 'draft' | 'scheduled';
  scheduled_for?: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: number;
  post_id: number;
  user_id: number;
  parent_id?: number | null;
  content: string;
  likes_count: number;
  created_at: string;
  updated_at: string;
  user?: Pick<User, 'id' | 'username' | 'avatar'>;
  replies?: Comment[];
  liked?: boolean;
}

export interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  recipient_id: number;
  content: string;
  read: boolean;
  created_at: string;
  updated_at: string;
  sender?: Pick<User, 'id' | 'username' | 'avatar'>;
}

export interface Analytics {
  subscriber_count: number;
  total_earnings: number;
  monthly_earnings: number;
  top_tier: string;
  growth_rate: number;
  engagement_rate: number;
}