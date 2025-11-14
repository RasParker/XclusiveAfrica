import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { CreatorPostActions } from '@/components/creator/CreatorPostActions';
import { PostActions } from '@/components/creator/PostActions';
import { PostCardLayout } from '@/components/creator/PostCardLayout';
import { CommentSection } from '@/components/fan/CommentSection';
import { PaymentModal } from '@/components/payment/PaymentModal';
import { PPVPaymentModal } from '@/components/payment/PPVPaymentModal';
import { TierDetailsModal } from '@/components/subscription/TierDetailsModal';
import { SubscriptionTierModal } from '@/components/subscription/SubscriptionTierModal';
import { LockedContentOverlay } from '@/components/content/LockedContentOverlay';
import { useAuth } from '@/contexts/AuthContext';
import { Star, Users, UserPlus, UserCheck, DollarSign, Settings, Eye, MessageSquare, Heart, Share2, Share, Image, Video, FileText, Edit, Trash2, ArrowLeft, Plus, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { BioDisplay } from '@/lib/text-utils';
import { OnlineStatusIndicator } from '@/components/OnlineStatusIndicator';
import { getTimeAgo } from '@/lib/timeUtils';

// Add CSS for feed cards to match Fan feed page
const feedCardStyles = `
  .feed-card {
    @apply bg-background border border-border rounded-lg overflow-hidden hover:border-primary/20 transition-all duration-200;
  }

  .feed-card-thumbnail {
    @apply relative aspect-square bg-black overflow-hidden;
  }

  .feed-card-content {
    @apply p-2;
  }

  .feed-card-title {
    @apply font-medium text-foreground text-sm leading-tight line-clamp-2 mb-1;
  }

  .feed-card-meta {
    @apply text-xs text-muted-foreground flex items-center gap-1;
  }

  .feed-card-meta span:not(:last-child)::after {
    content: '';
  }
`;

// Helper function to construct proper image URLs
const getImageUrl = (imageUrl: string | null | undefined): string | undefined => {
  if (!imageUrl) return undefined;

  // If it's already a full URL, use as-is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // If it's a local path starting with /uploads/, use as-is
  if (imageUrl.startsWith('/uploads/')) {
    return imageUrl;
  }

  // For relative paths, prepend /uploads/
  return `/uploads/${imageUrl}`;
};

// Mock creators database
const MOCK_CREATORS = {
  'artisticmia': {
    id: '2',
    username: 'artisticmia',
    display_name: 'Artistic Mia',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5fd?w=150&h=150&fit=crop&crop=face',
    cover: 'https://images.unsplash.com/photo-1541961017774-22349c2?w=800&h=300&fit=crop',
    bio: 'Digital artist creating stunning fantasy worlds and characters. Join me for exclusive art tutorials, behind-the-scenes content, and early access to my latest creations.',
    subscribers: 2840,
    verified: true,
    tiers: [
      { 
        id: '1',
        name: 'Supporter', 
        price: 5,
        description: 'Access to basic content and community posts',
        features: ['Weekly art posts', 'Community access', 'Behind-the-scenes content']
      },
      { 
        id: '2',
        name: 'Fan', 
        price: 15,
        description: 'Everything in Supporter plus exclusive tutorials',
        features: ['Everything in Supporter', 'Monthly tutorials', 'Process videos', 'High-res downloads']
      },
      { 
        id: '3',
        name: 'Superfan', 
        price: 25,
        description: 'Ultimate access with personal interaction',
        features: ['Everything in Fan', 'Direct messaging', '1-on-1 feedback', 'Custom artwork requests']
      }
    ],
    recentPosts: [
      {
        id: '1',
        title: 'New Digital Art Collection',
        content: 'Check out my latest digital artwork featuring cyberpunk themes...',
        mediaType: 'image',
        tier: 'Fan',
        createdAt: '2024-02-19T10:30:00',
        thumbnail: 'https://images.unsplash.com/photo-1541961017774-22349c2?w=400&h=300&fit=crop',
        likes: 24,
        comments: [
          {
            id: '1',
            author: 'johndoe',
            content: 'Amazing work! Love the color palette.',
            time: '1h ago'
          },
          {
            id: '2',
            author: 'sarahsmith',
            content: 'This is incredible! How long did it take?',
            time: '30m ago'
          }
        ]
      },
      {
        id: '2',
        title: 'Behind the Scenes Process',
        content: 'Here\'s how I create my digital masterpieces...',
        mediaType: 'video',
        tier: 'Superfan',
        createdAt: '2024-02-18T15:20:00',
        thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c4443?w=400&h=300&fit=crop',
        likes: 18,
        comments: [
          {
            id: '3',
            author: 'mikejones',
            content: 'Thanks for sharing your process!',
            time: '2h ago'
          }
        ]
      }
    ]
  },
  'original badman': {
    id: '3',
    username: 'original badman',
    display_name: 'Original Badman',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    cover: 'https://images.unsplash.com/photo-1541961017774-22349c2?w=800&h=300&fit=crop',
    bio: 'Welcome to my creative space! I\'m just getting started on this amazing platform. Stay tuned for exciting content coming your way!',
    subscribers: 0,
    verified: false,
    tiers: [],
    recentPosts: []
  }
};

// PostGridCard Component for displaying posts in grid layout
interface PostGridCardProps {
  post: any;
  creator: any;
  user: any;
  username: string | undefined;
  postLikes: Record<string, { liked: boolean; count: number }>;
  isOwnProfile: boolean;
  getImageUrl: (url: string | null | undefined) => string | undefined;
  getTimeAgo: (date: string) => string;
  getMediaOverlayIcon: (mediaType: string) => React.ReactNode;
  hasAccessToTier: (tier: string) => boolean;
  handleContentClick: (post: any) => void;
  handleLike: (postId: string) => void;
  handleCommentClick: (postId: string) => void;
  handleShare: (postId: string) => void;
  handleEditPost: (postId: string) => void;
  handleDeletePost: (postId: string) => void;
  handlePPVPurchase: (post: any) => void;
  setSubscriptionTierModalOpen: (open: boolean) => void;
}

const PostGridCard: React.FC<PostGridCardProps> = ({
  post,
  creator,
  user,
  username,
  postLikes,
  isOwnProfile,
  getImageUrl,
  getTimeAgo,
  getMediaOverlayIcon,
  hasAccessToTier,
  handleContentClick,
  handleLike,
  handleCommentClick,
  handleShare,
  handleEditPost,
  handleDeletePost,
  handlePPVPurchase,
  setSubscriptionTierModalOpen,
}) => {
  const hasAccess = hasAccessToTier(post.tier) || (post.is_ppv_enabled && post.ppv_purchases?.some((p: any) => p.user_id === user?.id));

  const getVideoThumbnail = (url: string) => {
    if (url?.includes('cloudinary.com/') && url.includes('/video/upload/')) {
      return url.replace('/video/upload/', '/video/upload/so_0,w_800,h_450,c_fill,f_jpg/').replace('.mp4', '.jpg');
    }
    return url;
  };

  const mediaUrls = Array.isArray(post.media_urls) ? post.media_urls : [post.media_urls];
  const mediaUrl = mediaUrls[0];
  const fullUrl = getImageUrl(mediaUrl);
  const thumbnailUrl = post.media_type === 'video' && fullUrl ? getVideoThumbnail(fullUrl) : fullUrl;

  return (
    <Card 
      className="overflow-hidden group relative" 
      data-testid={`card-post-${post.id}`}
    >
      <div 
        className="relative w-full aspect-video bg-black cursor-pointer overflow-hidden"
        onClick={() => handleContentClick(post)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleContentClick(post);
          }
        }}
        data-testid={`thumbnail-post-${post.id}`}
      >
        {!hasAccess ? (
          <LockedContentOverlay
            thumbnail={thumbnailUrl}
            tier={post.tier}
            isVideo={post.media_type === 'video'}
            onUnlockClick={(e) => {
              e.stopPropagation();
              if (!user) {
                window.location.href = `/login?redirect=/creator/${username}`;
              } else if (post.is_ppv_enabled) {
                handlePPVPurchase(post);
              } else if (creator && creator.tiers && creator.tiers.length > 0) {
                setSubscriptionTierModalOpen(true);
              } else {
                document.getElementById('subscription-tiers')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            showButton={false}
            ppvEnabled={post.is_ppv_enabled}
            ppvPrice={post.ppv_price}
            ppvCurrency={post.ppv_currency || 'GHS'}
          />
        ) : (
          <>
            {thumbnailUrl ? (
              <img 
                src={thumbnailUrl}
                alt={post.title || 'Post thumbnail'}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://placehold.co/800x450/1f2937/FFFFFF?text=Post+${post.id}`;
                }}
              />
            ) : (
              <img 
                src={`https://placehold.co/800x450/6366F1/FFFFFF?text=Post+${post.id}`}
                alt={post.title || 'Post thumbnail'}
                className="w-full h-full object-cover"
              />
            )}
          </>
        )}
      </div>

      {/* Content type overlay - positioned relative to Card, outside thumbnail stacking context */}
      {post.media_type !== 'video' && (
        <div className="absolute top-2 left-2 z-10 pointer-events-none">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-black/60 backdrop-blur-sm pointer-events-auto">
            {getMediaOverlayIcon(post.media_type)}
          </div>
        </div>
      )}

      {/* Bottom section - Use PostCardLayout for consistency */}
      <PostCardLayout
        post={post}
        creator={creator}
        postLikes={postLikes}
        isOwnProfile={isOwnProfile}
        getImageUrl={getImageUrl}
        getTimeAgo={getTimeAgo}
        handleLike={handleLike}
        handleCommentClick={handleCommentClick}
        handleShare={handleShare}
        handleEditPost={handleEditPost}
        handleDeletePost={handleDeletePost}
      />
    </Card>
  );
};

// PostsGrid Component for rendering posts in responsive grid
interface PostsGridProps {
  posts: any[];
  emptyMessage: string;
  creator: any;
  user: any;
  username: string | undefined;
  postLikes: Record<string, { liked: boolean; count: number }>;
  isOwnProfile: boolean;
  getImageUrl: (url: string | null | undefined) => string | undefined;
  getTimeAgo: (date: string) => string;
  getMediaOverlayIcon: (mediaType: string) => React.ReactNode;
  hasAccessToTier: (tier: string) => boolean;
  handleContentClick: (post: any) => void;
  handleLike: (postId: string) => void;
  handleCommentClick: (postId: string) => void;
  handleShare: (postId: string) => void;
  handleEditPost: (postId: string) => void;
  handleDeletePost: (postId: string) => void;
  handlePPVPurchase: (post: any) => void;
  setSubscriptionTierModalOpen: (open: boolean) => void;
}

const PostsGrid: React.FC<PostsGridProps> = ({
  posts,
  emptyMessage,
  creator,
  user,
  username,
  postLikes,
  isOwnProfile,
  getImageUrl,
  getTimeAgo,
  getMediaOverlayIcon,
  hasAccessToTier,
  handleContentClick,
  handleLike,
  handleCommentClick,
  handleShare,
  handleEditPost,
  handleDeletePost,
  handlePPVPurchase,
  setSubscriptionTierModalOpen,
}) => {
  if (posts.length === 0) {
    return (
      <div className="text-center py-10" data-testid="empty-posts-state">
        <p className="text-muted-foreground" data-testid="text-empty-message">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {posts.map((post) => (
        <PostGridCard
          key={post.id}
          post={post}
          creator={creator}
          user={user}
          username={username}
          postLikes={postLikes}
          isOwnProfile={isOwnProfile}
          getImageUrl={getImageUrl}
          getTimeAgo={getTimeAgo}
          getMediaOverlayIcon={getMediaOverlayIcon}
          hasAccessToTier={hasAccessToTier}
          handleContentClick={handleContentClick}
          handleLike={handleLike}
          handleCommentClick={handleCommentClick}
          handleShare={handleShare}
          handleEditPost={handleEditPost}
          handleDeletePost={handleDeletePost}
          handlePPVPurchase={handlePPVPurchase}
          setSubscriptionTierModalOpen={setSubscriptionTierModalOpen}
        />
      ))}
    </div>
  );
};

export const CreatorProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // Track previous username to detect changes
  const prevUsernameRef = React.useRef<string | undefined>(username);
  // Don't initialize from localStorage here - we'll do it in useEffect after checking if it's own profile
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
  const [coverPhotoUrl, setCoverPhotoUrl] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [bio, setBio] = useState<string | null>(null);
  const [customTiers, setCustomTiers] = useState<any[]>([]);
  const [profileData, setProfileData] = useState<any>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [selectedContent, setSelectedContent] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedModalCaption, setExpandedModalCaption] = useState(false);
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const [postLikes, setPostLikes] = useState<Record<string, { liked: boolean; count: number }>>({});
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [editCaption, setEditCaption] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [creator, setCreator] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userSubscription, setUserSubscription] = useState<any>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<any>(null);
  const [selectedPPVPost, setSelectedPPVPost] = useState<any>(null);
  const [ppvPaymentModalOpen, setPpvPaymentModalOpen] = useState(false);
  const [isSubscriptionTiersExpanded, setIsSubscriptionTiersExpanded] = useState(false);
  const [tierDetailsModalOpen, setTierDetailsModalOpen] = useState(false);
  const [subscriptionTierModalOpen, setSubscriptionTierModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [isCreatorLiked, setIsCreatorLiked] = useState(false);
  const [isCreatorFavorited, setIsCreatorFavorited] = useState(false);
  const [likingCreator, setLikingCreator] = useState(false);
  const [favoritingCreator, setFavoritingCreator] = useState(false);
  const [creatorLikeCount, setCreatorLikeCount] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [isFollowLoading, setIsFollowLoading] = useState<boolean>(false);

  // Define isOwnProfile early to avoid initialization issues
  const isOwnProfile = user?.username === username;

  // Function to fetch user's posts from database
  const fetchUserPosts = async (userId: string | number) => {
    try {
      const userIdNum = typeof userId === 'string' ? parseInt(userId) : userId;

      // Build query parameters based on who's viewing
      let queryParams = `creatorId=${userIdNum}`;

      // For public profile page, only show published posts regardless of who's viewing
      // Draft posts should only be managed in the Content Manager, not on the profile page

      const response = await fetch(`/api/posts?${queryParams}`);
      if (response.ok) {
        const filteredPosts = await response.json();

        // Sort posts by creation date (newest first)
        filteredPosts.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setUserPosts(filteredPosts);

        // Initialize like status for current user
        if (user) {
          await fetchLikeStatuses(filteredPosts, Number(user.id));
        }

        console.log('Fetched user posts:', filteredPosts);
        console.log('User ID:', userIdNum, 'Is own profile:', isOwnProfile);
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  // Function to fetch like statuses for posts
  const fetchLikeStatuses = async (posts: any[], userId: number) => {
    try {
      const likeStatuses: Record<string, { liked: boolean; count: number }> = {};

      for (const post of posts) {
        const response = await fetch(`/api/posts/${post.id}/like/${userId}`);
        if (response.ok) {
          const { liked } = await response.json();
          likeStatuses[post.id] = {
            liked: liked,
            count: post.likes_count || 0
          };
        } else {
          likeStatuses[post.id] = {
            liked: false,
            count: post.likes_count || 0
          };
        }
      }

      setPostLikes(likeStatuses);
    } catch (error) {
      console.error('Error fetching like statuses:', error);
    }
  };

  // Update profile data from localStorage when component mounts or when navigating
  useEffect(() => {
    const updateProfileData = () => {
      const newProfilePhotoUrl = localStorage.getItem('profilePhotoUrl');
      const newCoverPhotoUrl = localStorage.getItem('coverPhotoUrl');
      const newDisplayName = localStorage.getItem('displayName');
      const newBio = localStorage.getItem('bio');

      // Only update state if the values are different
      if (newProfilePhotoUrl !== profilePhotoUrl) setProfilePhotoUrl(newProfilePhotoUrl);
      if (newCoverPhotoUrl !== coverPhotoUrl) setCoverPhotoUrl(newCoverPhotoUrl);
      if (newDisplayName !== displayName) setDisplayName(newDisplayName);
      if (newBio !== bio) setBio(newBio);

      // Load custom tiers from localStorage
      const savedTiers = localStorage.getItem('subscriptionTiers');
      if (savedTiers) {
        try {
          const parsedTiers = JSON.parse(savedTiers);
          if (Array.isArray(parsedTiers)) {
            // Check if these are mock tiers and clear them
            const isMockData = parsedTiers.some(tier => 
              tier.name === 'Supporter' || tier.name === 'Fan' || tier.name === 'Superfan'
            );

            if (isMockData) {
              // Clear mock data and start fresh
              localStorage.removeItem('subscriptionTiers');
              setCustomTiers([]);
            } else {
              setCustomTiers(parsedTiers);
            }
          } else {
            setCustomTiers([]);
          }
        } catch (error) {
          console.error('Error parsing saved tiers:', error);
          setCustomTiers([]);
        }
      }
    };

    // Initial load
    updateProfileData();

    // Listen for localStorage changes (cross-tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'profilePhotoUrl' || e.key === 'coverPhotoUrl' || 
          e.key === 'displayName' || e.key === 'bio' || e.key === 'subscriptionTiers') {
        updateProfileData();

        // Also trigger a re-fetch of creator data to update the UI
        if (username && user?.username === username) {
          const fetchCreatorData = async () => {
            try {
              const response = await fetch(`/api/users/username/${username}`);
              if (response.ok) {
                const userData = await response.json();
                const newProfilePhotoUrl = localStorage.getItem('profilePhotoUrl');
                const newCoverPhotoUrl = localStorage.getItem('coverPhotoUrl');
                const newDisplayName = localStorage.getItem('displayName');
                const newBio = localStorage.getItem('bio');

                setCreator((prev: any) => prev ? {
                  ...prev,
                  display_name: (newDisplayName && newDisplayName.trim()) || userData.display_name || userData.username,
                  avatar: (newProfilePhotoUrl && newProfilePhotoUrl.trim()) || userData.avatar || prev.avatar,
                  cover: (newCoverPhotoUrl && newCoverPhotoUrl.trim()) || userData.cover_image || prev.cover,
                  bio: (newBio && newBio.trim()) || userData.bio || prev.bio,
                } : null);

                console.log('Updated creator from storage event:', {
                  profilePhoto: newProfilePhotoUrl,
                  coverPhoto: newCoverPhotoUrl,
                  displayName: newDisplayName,
                  bio: newBio
                });
              }
            } catch (error) {
              console.error('Error re-fetching creator data:', error);
            }
          };
          fetchCreatorData();
        }
      }
    };

    // Listen for custom storage events (for same-tab updates)
    const handleCustomStorageChange = (e: CustomEvent) => {
      updateProfileData();

      // Refresh posts if post-related event
      if (e.detail && e.detail.type === 'postCreated' && user && user.username === username) {
        fetchUserPosts(user.id);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageChange', handleCustomStorageChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', handleCustomStorageChange as EventListener);
    };
  }, [username]); // Remove user dependency to prevent infinite loops

  // Fetch user data from database

  // Separate useEffect for fetching user posts
  useEffect(() => {
    if (creator && creator.id) {
      fetchUserPosts(creator.id);
    }
  }, [creator?.id]); // Fetch posts for the profile being viewed

  // Fetch user's subscription to this creator
  useEffect(() => {
    const fetchUserSubscription = async () => {
      if (!user || !creator || isOwnProfile) return;

      try {
        setSubscriptionLoading(true);
        const response = await fetch(`/api/subscriptions/user/${user.id}/creator/${creator.id}`);
        if (response.ok) {
          const subscriptionData = await response.json();
          setUserSubscription(subscriptionData);
        } else {
          setUserSubscription(null);
        }
      } catch (error) {
        console.error('Error fetching subscription:', error);
        setUserSubscription(null);
      } finally {
        setSubscriptionLoading(false);
      }
    };

    fetchUserSubscription();
  }, [user, creator, isOwnProfile]);

  // Check if current user is subscribed to this creator
  useEffect(() => {
    const checkSubscription = async () => {
      if (!user || !creator || isOwnProfile) {
        setUserSubscription(null);
        return;
      }

      try {
        console.log(`Checking subscription for user ${user.id} to creator ${creator.id}`);
        const cacheBuster = Date.now();
        const response = await fetch(`/api/subscriptions/user/${user.id}/creator/${creator.id}?_=${cacheBuster}`);
        if (response.ok) {
          const subscription = await response.json();
          console.log('Subscription API response:', subscription);

          // Only set subscription if it exists, is active, and is for this creator
          if (subscription && 
              subscription.status === 'active' && 
              subscription.creator_id === creator.id) {
            setUserSubscription(subscription);
            console.log(`✓ User ${user.id} has active subscription to creator ${creator.id}:`, subscription);
          } else {
            setUserSubscription(null);
            console.log(`✗ User ${user.id} has no active subscription to creator ${creator.id}`);
          }
        } else {
          setUserSubscription(null);
          console.log(`✗ No subscription found for user ${user.id} to creator ${creator.id} (${response.status})`);
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
        setUserSubscription(null);
      }
    };

    checkSubscription();

    // Listen for subscription changes
    const handleSubscriptionChange = (event: CustomEvent) => {
      if (event.detail && event.detail.type === 'subscriptionCreated') {
        console.log('🔄 Subscription created, refreshing subscription status...');
        checkSubscription();
      }
    };

    window.addEventListener('subscriptionStatusChange', handleSubscriptionChange as EventListener);
    return () => {
      window.removeEventListener('subscriptionStatusChange', handleSubscriptionChange as EventListener);
    };
  }, [user, creator, isOwnProfile]);

  // Function to fetch creator like count
  const fetchCreatorLikeCount = async (creatorId: number) => {
    try {
      const response = await fetch(`/api/creators/${creatorId}/likes-count`);
      if (response.ok) {
        const data = await response.json();
        setCreatorLikeCount(data.count || 0);
      }
    } catch (error) {
      console.error('Error fetching creator like count:', error);
    }
  };

  // Function to check if user is following creator
  const checkFollowStatus = async (creatorId: string, userId: number) => {
    try {
      const response = await fetch(`/api/creators/${creatorId}/follow/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setIsFollowing(data.following || false);
      }
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  // Function to handle follow/unfollow
  const handleFollowToggle = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "You need to be logged in to follow creators.",
        variant: "destructive",
      });
      return;
    }

    if (user.id === parseInt(creator.id)) {
      toast({
        title: "Cannot follow yourself",
        description: "You cannot follow your own profile.",
        variant: "destructive",
      });
      return;
    }

    setIsFollowLoading(true);

    try {
      const url = `/api/creators/${creator.id}/follow`;
      const method = isFollowing ? 'DELETE' : 'POST';
      const body = JSON.stringify({ followerId: user.id });

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      if (response.ok) {
        setIsFollowing(!isFollowing);
        setFollowerCount(prev => Math.max(0, isFollowing ? prev - 1 : prev + 1));
        toast({
          title: isFollowing ? "Unfollowed!" : "Following!",
          description: isFollowing 
            ? `You unfollowed ${creator.display_name || creator.username}`
            : `You are now following ${creator.display_name || creator.username}`,
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.error || "Failed to update follow status",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error toggling follow status:', error);
      toast({
        title: "Error",
        description: "Failed to update follow status",
        variant: "destructive",
      });
    } finally {
      setIsFollowLoading(false);
    }
  };

  // Check creator like, favorite, and follow status
  useEffect(() => {
    const checkCreatorInteractions = async () => {
      if (!creator) {
        setIsCreatorLiked(false);
        setIsCreatorFavorited(false);
        setIsFollowing(false);
        setCreatorLikeCount(0);
        return;
      }

      // Always fetch the like count regardless of user status
      await fetchCreatorLikeCount(creator.id);

      if (!user || isOwnProfile) {
        setIsCreatorLiked(false);
        setIsCreatorFavorited(false);
        setIsFollowing(false);
        return;
      }

      try {
        // Check like status
        const likeResponse = await fetch(`/api/creators/${creator.id}/like/${user.id}`);
        if (likeResponse.ok) {
          const likeData = await likeResponse.json();
          setIsCreatorLiked(likeData.liked);
        }

        // Check favorite status
        const favoriteResponse = await fetch(`/api/creators/${creator.id}/favorite/${user.id}`);
        if (favoriteResponse.ok) {
          const favoriteData = await favoriteResponse.json();
          setIsCreatorFavorited(favoriteData.favorited);
        }

        // Check follow status
        await checkFollowStatus(creator.id, user.id);
      } catch (error) {
        console.error('Error checking creator interactions:', error);
      }
    };

    checkCreatorInteractions();
  }, [user, creator, isOwnProfile]);

  // Clear state when username changes (separate effect runs before fetch)
  useEffect(() => {
    if (prevUsernameRef.current !== username) {
      setCreator(null);
      setUserPosts([]);
      prevUsernameRef.current = username;
    }
  }, [username]);

  useEffect(() => {
    const fetchCreatorData = async () => {
      if (!username) return;

      try {
        setLoading(true);

        // Decode the username from URL encoding
        const decodedUsername = decodeURIComponent(username);
        const response = await fetch(`/api/users/username/${encodeURIComponent(decodedUsername)}`);
        if (response.ok) {
          const userData = await response.json();
          console.log('Creator data loaded:', userData);

          // Only use localStorage for the logged-in user's own profile
          const isViewingOwnProfile = user && user.username === userData.username;

          console.log('Username comparison:', {
            loggedInUser: user?.username,
            profileUser: userData.username,
            isOwnProfile: isViewingOwnProfile
          });

          // Reset state for other profiles, load from localStorage only for own profile
          if (isViewingOwnProfile) {
            // Check localStorage for profile customizations only for own profile
            const storedProfilePhoto = localStorage.getItem('profilePhotoUrl');
            const storedCoverPhoto = localStorage.getItem('coverPhotoUrl');
            const storedDisplayName = localStorage.getItem('displayName');
            const storedBio = localStorage.getItem('bio');

            console.log('Profile photo URL from localStorage:', storedProfilePhoto);
            console.log('Cover photo URL from localStorage:', storedCoverPhoto);
            console.log('Database avatar:', userData.avatar);
            console.log('Database cover:', userData.cover_image);

            // Clear invalid localStorage values
            if (storedProfilePhoto === '' || storedProfilePhoto === 'null' || storedProfilePhoto === 'undefined') {
              localStorage.removeItem('profilePhotoUrl');
              setProfilePhotoUrl(null);
            } else {
              setProfilePhotoUrl(storedProfilePhoto);
            }

            if (storedCoverPhoto === '' || storedCoverPhoto === 'null' || storedCoverPhoto === 'undefined') {
              localStorage.removeItem('coverPhotoUrl');
              setCoverPhotoUrl(null);
            } else {
              setCoverPhotoUrl(storedCoverPhoto);
            }

            setDisplayName(storedDisplayName);
            setBio(storedBio);

            // Validate localStorage URLs and clear if files don't exist
            const validateAndClearInvalidUrls = async () => {
              if (storedProfilePhoto && storedProfilePhoto.trim()) {
                try {
                  const response = await fetch(storedProfilePhoto, { method: 'HEAD' });
                  if (!response.ok) {
                    console.log('Profile photo not found, clearing localStorage:', storedProfilePhoto);
                    localStorage.removeItem('profilePhotoUrl');
                    setProfilePhotoUrl(null);
                  }
                } catch (error) {
                  console.log('Profile photo validation failed, clearing localStorage:', storedProfilePhoto);
                  localStorage.removeItem('profilePhotoUrl');
                  setProfilePhotoUrl(null);
                }
              }

              if (storedCoverPhoto && storedCoverPhoto.trim()) {
                try {
                  const response = await fetch(storedCoverPhoto, { method: 'HEAD' });
                  if (!response.ok) {
                    console.log('Cover photo not found, clearing localStorage:', storedCoverPhoto);
                    localStorage.removeItem('coverPhotoUrl');
                    setCoverPhotoUrl(null);
                  }
                } catch (error) {
                  console.log('Cover photo validation failed, clearing localStorage:', storedCoverPhoto);
                  localStorage.removeItem('coverPhotoUrl');
                  setCoverPhotoUrl(null);
                }
              }
            };

            // Run validation in background
            validateAndClearInvalidUrls();
          } else {
            // Viewing someone else's profile - clear any localStorage values
            setProfilePhotoUrl(null);
            setCoverPhotoUrl(null);
            setDisplayName(null);
            setBio(null);
          }

          // Handle tiers - fetch from API
          let tiers = [];
          if (userData?.id) {
            try {
              const tiersResponse = await fetch(`/api/creators/${userData.id}/tiers`);
              if (tiersResponse.ok) {
                tiers = await tiersResponse.json();
              }
            } catch (error) {
              console.error('Error fetching tiers:', error);
            }
          }

          setCreator({
            ...userData,
            display_name: (displayName && displayName.trim()) || userData.display_name || userData.username,
            avatar: (profilePhotoUrl && profilePhotoUrl.trim()) || userData.avatar || null,
            cover: (coverPhotoUrl && coverPhotoUrl.trim()) || userData.cover_image || null,
            bio: (bio && bio.trim()) || userData.bio || null,
            subscribers: userData.total_subscribers || 0,
            tiers: tiers
          });

          // Fetch follower count
          if (userData?.id) {
            try {
              const followerResponse = await fetch(`/api/creators/${userData.id}/followers-count`);
              if (followerResponse.ok) {
                const { count } = await followerResponse.json();
                setFollowerCount(count || 0);
              }
            } catch (error) {
              console.error('Error fetching follower count:', error);
              setFollowerCount(0);
            }
          }
        } else {
          setCreator(null);
        }
      } catch (error) {
        console.error('Error fetching creator data:', error);
        setCreator(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCreatorData();
  }, [username, user?.username, profilePhotoUrl, coverPhotoUrl, displayName, bio, customTiers]); // Include necessary dependencies

  const handleSubscribe = async (tierId: string) => {
    if (!user) {
      // Redirect to login with return path
      window.location.href = `/login?redirect=/creator/${username}`;
      return;
    }

    // Find the selected tier
    const tier = creator.tiers.find((t: any) => t.id === tierId);
    if (tier) {
      try {
        // Create subscription directly for development/testing
        const response = await fetch('/api/subscriptions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fan_id: user.id,
            creator_id: creator.id,
            tier_id: tier.id,
            status: 'active',
            auto_renew: true,
            started_at: new Date().toISOString(),
            next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          })
        });

        if (response.ok) {
          toast({
            title: "Successfully subscribed!",
            description: `You're now subscribed to ${creator.display_name}'s ${tier.name} tier.`,
          });
        } else {
          const errorData = await response.json();
          toast({
            title: "Subscription failed",
            description: errorData.error || "Failed to create subscription. Please try again.",
            variant: "destructive"
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to create subscription. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'text':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'public':
        return 'outline';
      case 'supporter':
        return 'secondary';
      case 'fan':
        return 'secondary';
      case 'premium':
        return 'default';
      case 'superfan':
        return 'default';
      default:
        return 'outline';
    }
  };

  const getMediaOverlayIcon = (mediaType: string) => {
    switch (mediaType?.toLowerCase()) {
      case 'image':
        return <Image className="w-4 h-4 text-white" />;
      case 'video':
        return <Video className="w-4 h-4 text-white" />;
      case 'text':
        return <FileText className="w-4 h-4 text-white" />;
      default:
        return <FileText className="w-4 h-4 text-white" />;
    }
  };

  // Check if user has access to content based on subscription tier
  const hasAccessToTier = (postTier: string): boolean => {
    // Own profile - can see all content
    if (isOwnProfile) {
      console.log('Access granted: Own profile');
      return true;
    }

    // Public content - everyone can see
    if (postTier.toLowerCase() === 'public') {
      console.log('Access granted: Public content');
      return true;
    }

    // If user is not logged in, no access to premium content
    if (!user) {
      console.log('Access denied: User not logged in');
      return false;
    }

    // If user has no active subscription to this creator, no access to premium content
    if (!userSubscription || userSubscription.status !== 'active') {
      console.log('Access denied: No active subscription', { 
        userSubscription: userSubscription,
        hasSubscription: !!userSubscription,
        subscriptionStatus: userSubscription?.status
      });
      return false;
    }

    // Verify subscription is to this specific creator
    if (userSubscription.creator_id !== creator?.id) {
      console.log('Access denied: Subscription not for this creator', { 
        subscriptionCreatorId: userSubscription.creator_id, 
        currentCreatorId: creator?.id 
      });
      return false;
    }

    // Define tier hierarchy - higher tiers include lower tier content
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
    const postTierLevel = tierHierarchy[postTier.toLowerCase()] || 999; // Default to highest tier for unknown tiers (security)

    const hasAccess = userTierLevel >= postTierLevel;
    console.log('Tier access check:', { 
      postTier, 
      userTierLevel, 
      postTierLevel, 
      userTierName: userSubscription.tier_name,
      hasAccess,
      creatorId: creator?.id,
      userId: user?.id
    });

    return hasAccess;
  };

  // Filter posts based on active tab
  const getFilteredPosts = () => {
    if (!userPosts) return [];

    switch (activeTab) {
      case 'public':
        return userPosts.filter(post => post.tier?.toLowerCase() === 'public' && post.is_ppv_enabled !== true);
      case 'subscription':
        return userPosts.filter(post => post.tier?.toLowerCase() !== 'public' && post.is_ppv_enabled !== true);
      case 'ppv':
        return userPosts.filter(post => post.is_ppv_enabled === true);
      case 'all':
      default:
        return userPosts;
    }
  };

  // Get post counts for each tab
  const getPostCounts = () => {
    if (!userPosts) return { all: 0, subscription: 0, public: 0, ppv: 0 };

    return {
      all: userPosts.length,
      subscription: userPosts.filter(post => post.tier?.toLowerCase() !== 'public' && post.is_ppv_enabled !== true).length,
      public: userPosts.filter(post => post.tier?.toLowerCase() === 'public' && post.is_ppv_enabled !== true).length,
      ppv: userPosts.filter(post => post.is_ppv_enabled === true).length
    };
  };

  const handleContentClick = (post: any) => {
    // Check if this is PPV content
    if (post.is_ppv_enabled) {
      // Check if user has already purchased this PPV content
      const hasPurchased = post.ppv_purchases?.some((p: any) => p.user_id === user?.id);
      if (!hasPurchased) {
        console.log('PPV content not purchased, opening PPV modal');
        handlePPVPurchase(post);
        return;
      }
      // If purchased, skip tier access check and continue to display the content
      console.log('PPV content purchased, opening content');
    } else {
      // Check access control for tier-based content (only for non-PPV posts)
      if (!hasAccessToTier(post.tier)) {
        console.log('Access denied for post tier:', post.tier);
        // Open subscription tier modal instead of scrolling
        if (creator && creator.tiers && creator.tiers.length > 0) {
          setSubscriptionTierModalOpen(true);
        } else {
          // Fallback to scrolling if no tiers available
          const tiersSection = document.getElementById('subscription-tiers');
          if (tiersSection) {
            tiersSection.scrollIntoView({ behavior: 'smooth' });
            if (!isSubscriptionTiersExpanded) {
              setIsSubscriptionTiersExpanded(true);
            }
          }
        }
        return;
      }
    }

    // For video content, check aspect ratio to determine navigation behavior
    if (post.media_type === 'video' && post.media_urls) {
      const mediaUrls = Array.isArray(post.media_urls) ? post.media_urls : [post.media_urls];
      const mediaUrl = mediaUrls[0];
      const fullUrl = getImageUrl(mediaUrl);

      // Create a temporary video element to detect aspect ratio
      if (fullUrl) {
        const media = document.createElement('video');
        media.src = fullUrl;
        media.onloadedmetadata = () => {
          const aspectRatio = media.videoWidth / media.videoHeight;

          if (aspectRatio > 1) {
            // 16:9 or landscape video - navigate to YouTube-style watch page
            navigate(`/video/${post.id}`);
          } else {
            // 9:16 or portrait video - open Instagram-style modal
            const modalData = {
              ...post,
              mediaPreview: fullUrl,
              type: 'Video',
              caption: post.content || post.title
            };
            setSelectedContent(modalData);
            setIsModalOpen(true);
          }
        };

        // Fallback for when metadata can't be loaded - assume landscape for watch page
        media.onerror = () => {
          navigate(`/video/${post.id}`);
        };
      } else {
        // If no valid URL, fallback to watch page
        navigate(`/video/${post.id}`);
      }
    } else {
      // For non-video content, always navigate to watch page
      navigate(`/video/${post.id}`);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedContent(null);
    setExpandedModalCaption(false);
  };

  // Handler functions for post interactions
  const handleLike = async (postId: string) => {
    if (!user) return;

    try {
      const currentLike = postLikes[postId] || { liked: false, count: 0 };

      if (currentLike.liked) {
        // Unlike the post
        await fetch(`/api/posts/${postId}/like`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.id }),
        });
      } else {
        // Like the post
        await fetch(`/api/posts/${postId}/like`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.id }),
        });
      }

      // Update local state immediately for responsive UI
      setPostLikes(prev => ({
        ...prev,
        [postId]: {
          liked: !currentLike.liked,
          count: currentLike.liked ? currentLike.count - 1 : currentLike.count + 1
        }
      }));

      // Refetch posts to get updated counts from database
      if (creator?.id) {
        fetchUserPosts(creator.id);
      }
    } catch (error) {
      console.error('Error liking post:', error);
      toast({
        title: "Error",
        description: "Failed to like post. Please try again.",
      });
    }
  };

  const handleCommentClick = (postId: string) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleCommentCountChange = (postId: string | number, newCount: number) => {
    setUserPosts(prev => prev.map(post => 
      post.id.toString() === postId.toString() 
        ? { ...post, comments_count: newCount }
        : post
    ));
  };

  const handleShare = (postId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`);
    toast({
      title: "Link copied",
      description: "Post link has been copied to your clipboard.",
    });
  };

  // PPV purchase handler
  const handlePPVPurchase = (post: any) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to purchase this content.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    setSelectedPPVPost({
      id: post.id,
      title: post.title || post.content || 'Untitled Post',
      ppv_price: post.ppv_price,
      ppv_currency: post.ppv_currency || 'GHS',
      creator_display_name: creator?.display_name || creator?.username,
      media_urls: post.media_urls || []
    });
    setPpvPaymentModalOpen(true);
  };

  // Chat initiation functionality
  const initiateChatMutation = useMutation({
    mutationFn: async (creatorId: number) => {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otherUserId: creatorId }),
      });
      if (!response.ok) throw new Error('Failed to create conversation');
      return response.json();
    },
    onSuccess: async (data) => {
      // Store the conversation ID in sessionStorage so Messages component can auto-select it
      sessionStorage.setItem('autoSelectConversationId', data.conversationId.toString());

      // Show success message
      toast({
        title: "Chat started!",
        description: `You can now message ${creator?.display_name}.`,
      });

      // Wait a moment to ensure conversation is created, then navigate
      setTimeout(() => {
        // Invalidate conversations query to refresh the list
        queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
        // Navigate to messages page
        window.location.href = '/fan/messages';
      }, 500);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to start conversation. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleChatClick = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = `/login?redirect=/creator/${username}`;
      return;
    }

    if (user.role !== 'fan') {
      toast({
        title: "Access Restricted",
        description: "Only fans can initiate conversations with creators.",
        variant: "destructive"
      });
      return;
    }

    // Force refresh the subscription status before checking
    console.log('🔄 Refreshing subscription status before messaging...');
    if (!creator) {
      console.log('❌ No creator found');
      return;
    }

    try {
      const response = await fetch(`/api/subscriptions/user/${user.id}/creator/${creator.id}`);
      if (response.ok) {
        const subscription = await response.json();
        console.log('💬 Fresh subscription check for messaging:', subscription);

        if (subscription && subscription.status === 'active' && subscription.creator_id === creator.id) {
          console.log('✅ Subscription confirmed for messaging');
          setUserSubscription(subscription);
          if (creator?.id) {
            initiateChatMutation.mutate(creator.id);
          }
          return;
        }
      }
    } catch (error) {
      console.error('Error in handleChatClick:', error);
    }

    console.log('❌ No valid subscription found for messaging');
    toast({
      title: "Subscription Required",
      description: "You need to have an active subscription to message this creator.",
      variant: "destructive"
    });
    // Scroll to subscription tiers
    document.getElementById('subscription-tiers')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCreatorLike = async () => {
    if (!user || !creator || isOwnProfile) {
      return;
    }

    if (user.role !== 'fan') {
      toast({
        title: "Access Restricted",
        description: "Only fans can like creators.",
        variant: "destructive"
      });
      return;
    }

    setLikingCreator(true);

    try {
      if (isCreatorLiked) {
        // Unlike creator
        const response = await fetch(`/api/creators/${creator.id}/like`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fanId: user.id }),
        });

        if (response.ok) {
          setIsCreatorLiked(false);
          // Refresh the like count
          await fetchCreatorLikeCount(creator.id);
          toast({
            title: "Unliked",
            description: `You no longer like ${creator.display_name || creator.username}.`,
          });
        }
      } else {
        // Like creator
        const response = await fetch(`/api/creators/${creator.id}/like`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fanId: user.id }),
        });

        if (response.ok) {
          setIsCreatorLiked(true);
          // Refresh the like count
          await fetchCreatorLikeCount(creator.id);
          toast({
            title: "Liked!",
            description: `You liked ${creator.display_name || creator.username}.`,
          });
        }
      }
    } catch (error) {
      console.error('Error toggling creator like:', error);
      toast({
        title: "Error",
        description: "Failed to update like status. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLikingCreator(false);
    }
  };

  const handleCreatorFavorite = async () => {
    if (!user || !creator || isOwnProfile) {
      return;
    }

    if (user.role !== 'fan') {
      toast({
        title: "Access Restricted",
        description: "Only fans can favorite creators.",
        variant: "destructive"
      });
      return;
    }

    setFavoritingCreator(true);

    try {
      if (isCreatorFavorited) {
        // Remove from favorites
        const response = await fetch(`/api/creators/${creator.id}/favorite`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fanId: user.id }),
        });

        if (response.ok) {
          setIsCreatorFavorited(false);
          toast({
            title: "Removed from favorites",
            description: `${creator.display_name || creator.username} removed from your favorites.`,
          });
        }
      } else {
        // Add to favorites
        const response = await fetch(`/api/creators/${creator.id}/favorite`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fanId: user.id }),
        });

        if (response.ok) {
          setIsCreatorFavorited(true);
          toast({
            title: "Added to favorites!",
            description: `${creator.display_name || creator.username} added to your favorites.`,
          });
        }
      }
    } catch (error) {
      console.error('Error toggling creator favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorite status. Please try again.",
        variant: "destructive"
      });
    } finally {
      setFavoritingCreator(false);
    }
  };

  const handleEdit = (postId: string) => {
    const post = userPosts.find(p => p.id === postId);
    if (post) {
      setEditingPost(post);
      setEditCaption(post.content || post.title);
      setIsEditModalOpen(true);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingPost) return;

    try {
      const response = await fetch(`/api/posts/${editingPost.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editCaption,
          content: editCaption,
        })
      });

      if (response.ok) {
        const updatedPost = await response.json();
        setUserPosts(prev => prev.map(post => 
          post.id === editingPost.id 
            ? { ...post, title: editCaption, content: editCaption }
            : post
        ));
        setIsEditModalOpen(false);
        setEditingPost(null);
        toast({
          title: "Post updated",
          description: "Your post has been successfully updated.",
        });
      } else {
        throw new Error('Failed to update post');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update post. Please try again.",
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditingPost(null);
    setEditCaption('');
  };

  const handleDelete = (postId: string) => {
    // Show confirmation dialog and delete post
    const confirmDelete = window.confirm("Are you sure you want to delete this post? This action cannot be undone.");
    if (confirmDelete) {
      // Here you would typically make an API call to delete the post
      setUserPosts(prev => prev.filter(post => post.id !== postId));
      toast({
        title: "Post deleted",
        description: "Your post has been successfully deleted.",
      });
    }
  };

  // Show loading state while data is being fetched
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading creator profile...</p>
        </div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Creator Not Found</h1>
          <p className="text-muted-foreground">The creator profile you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const handleEditPost = (postId: string) => {
    const post = userPosts.find(p => p.id === postId);
    if (post) {
      setEditingPost(post);
      setEditCaption(post.content || post.title);
      setIsEditModalOpen(true);
    }
  };

  const handleDeletePost = (postId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post? This action cannot be undone.");
    if (confirmDelete) {
      // Simulate deletion
      setUserPosts(prev => prev.filter(post => post.id !== postId));
      toast({
        title: "Post deleted",
        description: "Your post has been successfully deleted.",
      });
    }
  };

  return (
    <>
      <style>{feedCardStyles}</style>
      <div className="min-h-screen bg-background">

      {/* Creator Header */}
      <div className="relative">
        <div className="h-48 md:h-64 overflow-hidden relative">
          {creator.cover ? (
            <img 
              src={getImageUrl(creator.cover)} 
              alt={creator.display_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
              <span className="text-muted-foreground hidden md:block">No cover photo</span>
            </div>
          )}

          {/* Cover Photo Upload Button - Only show for own profile and when no cover photo */}
          {isOwnProfile && !creator.cover && (
            <div className="absolute top-4 right-4">
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 w-10 p-0 bg-background/80 backdrop-blur-sm border-2 border-border hover:bg-background/90 transition-colors"
                  title="Add cover photo"
                  onClick={() => document.getElementById('header-cover-upload')?.click()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <input
                  id="header-cover-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        const formData = new FormData();
                        formData.append('coverPhoto', file);

                        const response = await fetch('/api/upload/cover-photo', {
                          method: 'POST',
                          body: formData,
                        });

                        if (!response.ok) throw new Error('Upload failed');

                        const result = await response.json();

                        // Update localStorage and trigger re-render
                        localStorage.setItem('coverPhotoUrl', result.url);
                        window.dispatchEvent(new CustomEvent('localStorageChange', {
                          detail: { keys: ['coverPhotoUrl'] }
                        }));

                        toast({
                          title: "Cover photo updated",
                          description: "Your cover photo has been updated successfully.",
                        });
                      } catch (error) {
                        toast({
                          title: "Upload failed",
                          description: "Failed to upload cover photo. Please try again.",
                          variant: "destructive",
                        });
                      }
                    }
                  }}
                />
              </div>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-7xl mx-auto flex items-end gap-3">
            <div className="flex items-end gap-3 md:ml-6">
              <div className="relative flex-shrink-0">
                <Avatar className="w-24 h-24 border-4 border-background">
                  <AvatarImage src={getImageUrl(creator.avatar)} alt={creator.username} />
                  <AvatarFallback className="text-2xl">{(creator?.display_name || creator?.username || 'U').charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>

                {/* Profile Photo Upload Button - Only show for own profile and when no avatar */}
                {isOwnProfile && !creator.avatar && (
                  <div className="absolute -bottom-1 -right-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 w-6 p-0 bg-primary rounded-full border-2 border-background hover:bg-primary/90 transition-colors"
                      title="Add profile photo"
                      asChild
                    >
                      <Link to="/creator/settings?tab=profile">
                        <Plus className="w-3 h-3 text-primary-foreground" />
                      </Link>
                    </Button>
                  </div>
                )}
              </div>

              {/* Profile name and username next to avatar */}
              <div className="flex-1 min-w-0 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl font-semibold text-foreground truncate">{creator?.display_name || creator?.username}</h1>
                  {creator.verified && (
                    <Badge variant="secondary" className="bg-accent text-accent-foreground flex-shrink-0">
                      <Star className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm text-muted-foreground">@{creator.username}</p>
                  <OnlineStatusIndicator userId={creator.id} showLastSeen={true} size="md" />
                  <span className="text-muted-foreground">•</span>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {Math.max(0, creator?.total_subscribers || 0).toLocaleString()}
                    </span>
                  </div>
                  <span className="text-muted-foreground">•</span>
                  <div className="flex items-center gap-1">
                    <UserPlus className="w-3 h-3 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {Math.max(0, followerCount).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            {(() => {
              const bioText = creator.bio || (isOwnProfile ? 'Add a bio to tell people about yourself.' : 'No bio available.');

              return (
                <div>
                  <BioDisplay 
                    bio={bioText}
                    context="profile"
                    className="text-muted-foreground leading-tight text-sm line-clamp-2"
                  />
                </div>
              );
            })()}
          </div>
        </div>

        {/* Action Buttons - Both Desktop and Mobile */}
        {isOwnProfile ? (
          <div className="flex items-center gap-2 mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-10 w-10 p-0"
              title="Edit Profile"
              asChild
            >
              <Link to="/creator/settings">
                <Settings className="w-4 h-4" />
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-10 w-10 p-0"
              title="Create Post"
              asChild
            >
              <Link to="/creator/upload">
                <Plus className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 mt-4">
            {/* Follow Button */}
            <Button
              variant={isFollowing ? "outline" : "default"}
              size="sm"
              onClick={handleFollowToggle}
              disabled={isFollowLoading || !user}
              data-testid={`button-${isFollowing ? 'unfollow' : 'follow'}-${creator.id}`}
              className="px-4"
            >
              {isFollowLoading ? (
                <span className="text-sm">Loading...</span>
              ) : isFollowing ? (
                <>
                  <UserCheck className="w-4 h-4 mr-2" />
                  <span className="text-sm">Following</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  <span className="text-sm">Follow</span>
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-10 w-10 p-0"
              title="Start conversation"
              onClick={handleChatClick}
              disabled={initiateChatMutation.isPending}
            >
              <MessageSquare className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-10 w-10 p-0"
                title="Like creator"
                disabled={likingCreator || isOwnProfile || !user || user.role !== 'fan'}
                onClick={handleCreatorLike}
              >
                <Heart className={`w-4 h-4 ${isCreatorLiked ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              {creatorLikeCount > 0 && (
                <span className="text-sm text-muted-foreground">
                  {creatorLikeCount.toLocaleString()} {creatorLikeCount === 1 ? 'like' : 'likes'}
                </span>
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-10 w-10 p-0"
              title="Add to favorites"
              disabled={favoritingCreator || isOwnProfile || !user || user.role !== 'fan'}
              onClick={handleCreatorFavorite}
            >
              <Star className={`w-4 h-4 ${isCreatorFavorited ? 'fill-yellow-500 text-yellow-500' : ''}`} />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-10 w-10 p-0"
              title="Share profile"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast({
                  title: "Profile link copied",
                  description: "Creator profile link has been copied to your clipboard.",
                });
              }}
            >
              <Share className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Compact Subscription Tiers - Show for profiles with tiers (Mobile + Desktop) */}
      {creator?.tiers && creator.tiers.length > 0 && (
        <div id="subscription-tiers" className="mx-4 mb-6 max-w-7xl md:mx-auto md:px-6">
          <div className="border bg-background rounded-lg shadow-lg gap-4 overflow-hidden">
            {!isSubscriptionTiersExpanded ? (
              /* Compact View */
              <div 
                className="p-4 md:p-6 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => setIsSubscriptionTiersExpanded(true)}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-base md:text-lg font-semibold">SUBSCRIBE NOW</h3>
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-3 md:gap-3 flex-wrap">
                      {creator.tiers.slice(0, 3).map((tier: any, index: number) => (
                        <div key={tier.id} className="flex items-center gap-1">
                          <span className="text-sm md:text-base font-medium text-accent whitespace-nowrap">GHS {tier.price}</span>
                          {index < Math.min(creator.tiers.length - 1, 2) && (
                            <span className="text-xs md:text-sm text-muted-foreground mx-1">•</span>
                          )}
                        </div>
                      ))}
                      {creator.tiers.length > 3 && (
                        <span className="text-xs md:text-sm text-muted-foreground whitespace-nowrap">+{creator.tiers.length - 3} more</span>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {isOwnProfile && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="px-3 py-2 text-sm font-medium rounded-full md:px-6 md:py-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsSubscriptionTiersExpanded(true);
                        }}
                      >
                        MANAGE
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Expanded View */
              <div className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <h3 className="text-base md:text-lg font-semibold">SUBSCRIPTION TIERS</h3>
                  <button 
                    onClick={() => setIsSubscriptionTiersExpanded(false)}
                    className="p-1 hover:bg-muted/50 rounded-full transition-colors"
                  >
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                  {creator.tiers.map((tier: any, index: number) => (
                    <div 
                      key={tier.id} 
                      className={`flex flex-col h-full p-5 md:p-6 border border-border/40 rounded-xl hover:border-border/60 transition-all duration-200 ease-out ${!isOwnProfile ? 'cursor-pointer hover:shadow-sm hover:-translate-y-0.5' : ''}`}
                      onClick={!isOwnProfile ? (e) => {
                        e.stopPropagation();
                        console.log('Tier clicked:', tier);
                        setSelectedTier(tier);
                        // Check if user is logged in
                        if (!user) {
                          window.location.href = `/login?redirect=/creator/${username}`;
                          return;
                        }
                        // Open payment modal directly for better UX
                        setPaymentModalOpen(true);
                      } : undefined}
                    >
                      <div className="flex-1 mb-5">
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <h4 className="text-sm md:text-base font-semibold uppercase tracking-wide leading-tight">{tier.name}</h4>
                          {index === 0 && creator.tiers.length > 1 && (
                            <Badge className="text-xs px-3 py-1.5 flex-shrink-0 font-semibold bg-primary text-primary-foreground hover:bg-primary/90 border-0">
                              POPULAR
                            </Badge>
                          )}
                        </div>
                        <div className="min-h-[3rem] mb-4">
                          <p className="text-xs md:text-sm text-muted-foreground/90 leading-relaxed">
                            {tier.description || 'Access to exclusive content and connect directly with the creator'}
                          </p>
                        </div>
                        {tier.benefits && tier.benefits.length > 0 && (
                          <div className="space-y-2.5">
                            {tier.benefits.slice(0, 3).map((benefit: string, benefitIndex: number) => (
                              <div key={benefitIndex} className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                                <span className="text-sm text-muted-foreground/80 leading-relaxed">{benefit}</span>
                              </div>
                            ))}
                            {tier.benefits.length > 3 && (
                              <p className="text-xs text-accent/80 font-medium ml-5">+{tier.benefits.length - 3} more benefits</p>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="border-t border-border/30 pt-4 mt-auto">
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg md:text-xl font-bold text-foreground">GHS {tier.price}</span>
                          <span className="text-xs md:text-sm text-muted-foreground/70 font-medium">/ month</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {isOwnProfile && (
                  <div className="mt-4 pt-4 border-t border-border/20">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full md:w-auto text-sm"
                      asChild
                    >
                      <Link to="/creator/tiers">
                        <Settings className="w-4 h-4 mr-2" />
                        Edit Tiers
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto md:px-6 py-8">
        <div className="space-y-6">
          {/* Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            {/* Tab Navigation */}
            <TabsList className="inline-flex h-auto w-auto gap-0 bg-transparent p-0 border-b border-border rounded-none">
              <TabsTrigger value="all" className="text-sm rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2">
                All ({getPostCounts().all})
              </TabsTrigger>
              <TabsTrigger value="subscription" className="text-sm rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2">
                Subscription ({getPostCounts().subscription})
              </TabsTrigger>
              <TabsTrigger value="ppv" className="text-sm rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2">
                Pay-Per-View (PPV) ({getPostCounts().ppv})
              </TabsTrigger>
              <TabsTrigger value="public" className="text-sm rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2">
                Public ({getPostCounts().public})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              <PostsGrid
                posts={getFilteredPosts()}
                emptyMessage="No posts found for this creator yet."
                creator={creator}
                user={user}
                username={username}
                postLikes={postLikes}
                isOwnProfile={isOwnProfile}
                getImageUrl={getImageUrl}
                getTimeAgo={getTimeAgo}
                getMediaOverlayIcon={getMediaOverlayIcon}
                hasAccessToTier={hasAccessToTier}
                handleContentClick={handleContentClick}
                handleLike={handleLike}
                handleCommentClick={handleCommentClick}
                handleShare={handleShare}
                handleEditPost={handleEditPost}
                handleDeletePost={handleDeletePost}
                handlePPVPurchase={handlePPVPurchase}
                setSubscriptionTierModalOpen={setSubscriptionTierModalOpen}
              />
            </TabsContent>

            <TabsContent value="subscription" className="space-y-6">
              <PostsGrid
                posts={getFilteredPosts()}
                emptyMessage="No subscription content available from this creator."
                creator={creator}
                user={user}
                username={username}
                postLikes={postLikes}
                isOwnProfile={isOwnProfile}
                getImageUrl={getImageUrl}
                getTimeAgo={getTimeAgo}
                getMediaOverlayIcon={getMediaOverlayIcon}
                hasAccessToTier={hasAccessToTier}
                handleContentClick={handleContentClick}
                handleLike={handleLike}
                handleCommentClick={handleCommentClick}
                handleShare={handleShare}
                handleEditPost={handleEditPost}
                handleDeletePost={handleDeletePost}
                handlePPVPurchase={handlePPVPurchase}
                setSubscriptionTierModalOpen={setSubscriptionTierModalOpen}
              />
            </TabsContent>

            <TabsContent value="ppv" className="space-y-6">
              <PostsGrid
                posts={getFilteredPosts()}
                emptyMessage="No Pay-Per-View content available from this creator."
                creator={creator}
                user={user}
                username={username}
                postLikes={postLikes}
                isOwnProfile={isOwnProfile}
                getImageUrl={getImageUrl}
                getTimeAgo={getTimeAgo}
                getMediaOverlayIcon={getMediaOverlayIcon}
                hasAccessToTier={hasAccessToTier}
                handleContentClick={handleContentClick}
                handleLike={handleLike}
                handleCommentClick={handleCommentClick}
                handleShare={handleShare}
                handleEditPost={handleEditPost}
                handleDeletePost={handleDeletePost}
                handlePPVPurchase={handlePPVPurchase}
                setSubscriptionTierModalOpen={setSubscriptionTierModalOpen}
              />
            </TabsContent>

            <TabsContent value="public" className="space-y-6">
              <PostsGrid
                posts={getFilteredPosts()}
                emptyMessage="This creator has no public posts."
                creator={creator}
                user={user}
                username={username}
                postLikes={postLikes}
                isOwnProfile={isOwnProfile}
                getImageUrl={getImageUrl}
                getTimeAgo={getTimeAgo}
                getMediaOverlayIcon={getMediaOverlayIcon}
                hasAccessToTier={hasAccessToTier}
                handleContentClick={handleContentClick}
                handleLike={handleLike}
                handleCommentClick={handleCommentClick}
                handleShare={handleShare}
                handleEditPost={handleEditPost}
                handleDeletePost={handleDeletePost}
                handlePPVPurchase={handlePPVPurchase}
                setSubscriptionTierModalOpen={setSubscriptionTierModalOpen}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Post Editing Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
            <DialogDescription>
              Edit the content of your post below. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid py-4">
            <Textarea
              id="caption"
              value={editCaption}
              onChange={(e) => setEditCaption(e.target.value)}
              placeholder="Write your post content here..."
              className="min-h-[100px] resize-none"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelEdit}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Post Detail Modal (for images/videos) */}
      {selectedContent && (
        <Dialog open={isModalOpen} onOpenChange={closeModal}>
          <DialogContent className="max-w-3xl w-full h-[80vh] p-0 bg-transparent border-none flex flex-col items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
              <button 
                onClick={closeModal}
                className="absolute top-2 right-2 z-30 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {selectedContent.type === 'Video' ? (
                <video 
                  src={selectedContent.mediaPreview} 
                  className="max-w-full max-h-full object-contain" 
                  controls 
                  autoPlay
                />
              ) : (
                <img 
                  src={selectedContent.mediaPreview} 
                  alt={selectedContent.title} 
                  className="max-w-full max-h-full object-contain" 
                />
              )}
            </div>
            <div className="w-full max-w-3xl px-4 py-3 bg-background border-t border-border/50">
              <div className="flex items-start gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={getImageUrl(creator.avatar)} alt={creator.username} />
                  <AvatarFallback>{(creator?.display_name || creator?.username || 'U').charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="font-semibold text-foreground text-sm truncate">{creator.display_name || creator.username}</span>
                    <span className="text-muted-foreground text-xs">•</span>
                    <span className="text-muted-foreground text-xs">{getTimeAgo(selectedContent.createdAt)}</span>
                  </div>
                  <p className={`text-sm text-muted-foreground leading-relaxed ${expandedModalCaption ? '' : 'line-clamp-2'}`}>
                    {selectedContent.caption}
                  </p>
                  {selectedContent.caption && selectedContent.caption.length > 100 && (
                    <button 
                      onClick={() => setExpandedModalCaption(!expandedModalCaption)}
                      className="text-xs text-accent hover:underline"
                    >
                      {expandedModalCaption ? 'Read less' : 'Read more'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Payment Modal (Subscription only) */}
      {selectedTier && creator && (
        <PaymentModal 
          isOpen={paymentModalOpen} 
          onClose={() => {
            setPaymentModalOpen(false);
            setSelectedTier(null);
          }} 
          tier={selectedTier} 
          creatorName={creator.display_name || creator.username}
        />
      )}

      {/* PPV Payment Modal (Dedicated for PPV purchases) */}
      {selectedPPVPost && user && (
        <PPVPaymentModal
          isOpen={ppvPaymentModalOpen}
          onClose={() => {
            setPpvPaymentModalOpen(false);
            setSelectedPPVPost(null);
          }}
          post={selectedPPVPost}
          userId={user.id}
          onSuccess={() => {
            setPpvPaymentModalOpen(false);
            setSelectedPPVPost(null);
            // Refresh the page to show the unlocked content
            window.location.reload();
          }}
        />
      )}

      {/* Tier Details Modal */}
      {selectedTier && creator && (
        <TierDetailsModal 
          isOpen={tierDetailsModalOpen} 
          onClose={() => {
            setTierDetailsModalOpen(false);
            setSelectedTier(null);
          }} 
          tier={selectedTier}
          creatorName={creator.display_name || creator.username}
          onSubscribe={() => {
            if (selectedTier) handleSubscribe(selectedTier.id);
            setTierDetailsModalOpen(false);
          }}
        />
      )}

      {/* Subscription Tier Modal */}
      {creator && creator.tiers && creator.tiers.length > 0 && (
        <SubscriptionTierModal
          isOpen={subscriptionTierModalOpen}
          onClose={() => setSubscriptionTierModalOpen(false)}
          creator={{
            id: creator.id,
            username: creator.username,
            display_name: creator.display_name || creator.username,
            avatar: creator.avatar || ''
          }}
          tiers={creator.tiers}
          onTierSelect={(tier) => {
            setSelectedTier(tier);
            setSubscriptionTierModalOpen(false);
            setPaymentModalOpen(true);
          }}
          userIsLoggedIn={!!user}
        />
      )}
      </div>
    </>
  );
};