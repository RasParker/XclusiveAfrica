import React, { useState, useEffect } from 'react';
// UI Updates Applied: Transparency removal - Jan 27 2025
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EdgeToEdgeContainer } from '@/components/layout/EdgeToEdgeContainer';
import { CommentSection } from '@/components/fan/CommentSection';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Heart, MessageSquare, MessageCircle, Calendar, Eye, Share2, Share, ArrowLeft, Image, Video, Music, FileText, Loader2, Grid3X3, List, MoreVertical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const MOCK_FEED = [
  {
    id: '1',
    creator: {
      username: 'artisticmia',
      display_name: 'Artistic Mia',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5fd?w=150&h=150&fit=crop&crop=face'
    },
    content: 'Just finished my latest series of fantasy warrior illustrations! This collection took me 3 weeks to complete and features 12 unique characters.',
    type: 'image',
    tier: 'Fan',
    thumbnail: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
    posted: '2024-02-19T10:30:00',
    likes: 142,
    comments: 28,
    views: 1250,
    liked: false,
    initialComments: [
      {
        id: '1',
        user: {
          id: '2',
          username: 'artlover123',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
        },
        content: 'Amazing work! The detail in these characters is incredible. How long did each one take?',
        likes: 5,
        liked: false,
        createdAt: '2024-02-19T11:00:00',
        replies: [
          {
            id: '2',
            user: {
              id: '1',
              username: 'artisticmia',
              avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5fd?w=150&h=150&fit=crop&crop=face'
            },
            content: 'Thank you! Each character took about 6-8 hours. The armor details were the most time-consuming part.',
            likes: 2,
            liked: false,
            createdAt: '2024-02-19T11:30:00',
            replies: []
          },
          {
            id: '5',
            user: {
              id: '3',
              username: 'digitalart_fan',
              avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
            },
            content: 'The armor textures look so realistic! What software do you use for the detail work?',
            likes: 1,
            liked: false,
            createdAt: '2024-02-19T12:15:00',
            replies: []
          }
        ]
      },
      {
        id: '6',
        user: {
          id: '4',
          username: 'fantasy_enthusiast',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'
        },
        content: 'Love the fantasy theme! The character designs remind me of classic D&D artwork. Are you planning to create a whole campaign setting?',
        likes: 8,
        liked: true,
        createdAt: '2024-02-19T13:00:00',
        replies: [
          {
            id: '7',
            user: {
              id: '1',
              username: 'artisticmia',
              avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5fd?w=150&h=150&fit=crop&crop=face'
            },
            content: 'That\'s actually a great idea! I\'ve been thinking about creating a comprehensive world with these characters. Maybe I should start working on background lore and maps.',
            likes: 4,
            liked: false,
            createdAt: '2024-02-19T13:30:00',
            replies: []
          }
        ]
      }
    ]
  },
  {
    id: '2',
    creator: {
      username: 'fitnessking',
      display_name: 'Fitness King',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    content: 'Starting the week strong with an intense upper body workout! Follow along for maximum gains. Remember to warm up properly!',
    type: 'video',
    tier: 'Supporter',
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f9b9d8b?w=400&h=300&fit=crop',
    posted: '2024-02-19T07:00:00',
    likes: 89,
    comments: 15,
    views: 892,
    liked: true,
    initialComments: [
      {
        id: '3',
        user: {
          id: '3',
          username: 'fitnessfan',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
        },
        content: 'Great workout! Following along now. My arms are already burning! 💪',
        likes: 8,
        liked: true,
        createdAt: '2024-02-19T07:30:00',
        replies: [
          {
            id: '8',
            user: {
              id: '2',
              username: 'fitnessking',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
            },
            content: 'That\'s the spirit! Remember to keep proper form even when it gets tough. Results come from consistency, not just intensity.',
            likes: 3,
            liked: false,
            createdAt: '2024-02-19T08:00:00',
            replies: []
          }
        ]
      },
      {
        id: '9',
        user: {
          id: '5',
          username: 'morningworkout',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
        },
        content: 'Perfect timing! Just what I needed for my morning routine. How often do you recommend doing this specific workout?',
        likes: 2,
        liked: false,
        createdAt: '2024-02-19T08:15:00',
        replies: []
      }
    ]
  },
  {
    id: '3',
    creator: {
      username: 'musicmaker',
      display_name: 'Music Maker',
      avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop&crop=face'
    },
    content: 'Working on a new beat for my upcoming album. Here\'s a sneak peek at my creative process. What genre should I explore next?',
    type: 'audio',
    tier: 'Superfan',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    posted: '2024-02-18T20:15:00',
    likes: 56,
    comments: 12,
    views: 423,
    liked: false,
    initialComments: [
      {
        id: '4',
        user: {
          id: '4',
          username: 'beathead',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'
        },
        content: 'This sounds fire! 🔥 Have you considered exploring some drill or UK garage elements?',
        likes: 3,
        liked: false,
        createdAt: '2024-02-18T21:00:00',
        replies: [
          {
            id: '10',
            user: {
              id: '3',
              username: 'musicmaker',
              avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop&crop=face'
            },
            content: 'UK garage is definitely something I want to experiment with! The syncopated rhythms would work perfectly with my style.',
            likes: 1,
            liked: false,
            createdAt: '2024-02-18T21:30:00',
            replies: []
          }
        ]
      },
      {
        id: '11',
        user: {
          id: '6',
          username: 'producer_pro',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
        },
        content: 'The layering in this beat is amazing! What DAW are you using? The mixing sounds really clean.',
        likes: 6,
        liked: false,
        createdAt: '2024-02-18T22:00:00',
        replies: [
          {
            id: '12',
            user: {
              id: '3',
              username: 'musicmaker',
              avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop&crop=face'
            },
            content: 'Thanks! I\'m using Logic Pro X with some custom plugins. The secret is in the compression chain I\'ve built over the years.',
            likes: 2,
            liked: false,
            createdAt: '2024-02-18T22:15:00',
            replies: []
          },
          {
            id: '13',
            user: {
              id: '4',
              username: 'beathead',
              avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'
            },
            content: 'Would love to hear more about your compression setup! Maybe you could do a tutorial on your production process?',
            likes: 4,
            liked: false,
            createdAt: '2024-02-18T22:45:00',
            replies: []
          }
        ]
      }
    ]
  },
  {
    id: '4',
    creator: {
      username: 'artisticmia',
      display_name: 'Artistic Mia',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5fd?w=150&h=150&fit=crop&crop=face'
    },
    content: 'Here\'s a sneak peek at my upcoming digital painting. Still working on the lighting effects and color balance. What do you think so far?',
    type: 'image',
    tier: 'Supporter',
    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    posted: '2024-02-20T14:15:00',
    likes: 78,
    comments: 12,
    views: 456,
    liked: false,
    initialComments: []
  }
];

export const FeedPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [feed, setFeed] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const [expandedCaptions, setExpandedCaptions] = useState<Record<string, boolean>>({});
  const [expandedModalCaption, setExpandedModalCaption] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'single'>('grid');

  // Fetch real posts from API with subscription filtering
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setLoading(true);

        // Use personalized feed if user is logged in, otherwise show all public posts
        const feedUrl = user ? `/api/feed/${user.id}` : '/api/posts';
        const response = await fetch(feedUrl);
        if (response.ok) {
          const posts = await response.json();
          console.log('Fetched posts from API:', posts.length);

          if (!Array.isArray(posts)) {
            throw new Error('Invalid response format from API');
          }

          // Transform and filter posts based on access
          const transformedPosts = posts.map((post: any) => {
            const postTier = post.tier || 'public';

            // Handle media_urls as either string or array
            let thumbnail = '';
            if (post.media_urls) {
              const mediaUrls = Array.isArray(post.media_urls) ? post.media_urls : [post.media_urls];
              if (mediaUrls.length > 0 && mediaUrls[0]) {
                const mediaUrl = mediaUrls[0];
                // Use URL directly if it's already a full URL (http/https) or starts with /uploads/
                thumbnail = mediaUrl.startsWith('http') || mediaUrl.startsWith('/uploads/') 
                  ? mediaUrl 
                  : `/uploads/${mediaUrl}`;
              }
            }

            return {
              id: post.id.toString(),
              creator: {
                username: post.creator?.username || post.username || 'Unknown',
                display_name: post.creator?.display_name || post.display_name || post.creator?.username || post.username || 'Unknown',
                avatar: post.creator?.avatar || post.avatar || '',
                id: post.creator_id
              },
              content: post.content || post.title || '',
              type: post.media_type || 'post',
              tier: postTier,
              thumbnail: thumbnail,
              posted: post.created_at || new Date().toISOString(),
              likes: post.likes_count || 0,
              comments: post.comments_count || 0,
              views: post.views_count || 0, // Corrected to use views_count from API
              liked: false,
              initialComments: [],
              hasAccess: true, // Personalized feed already filters accessible content
              access_type: post.access_type || 'unknown' // Track how user has access (follow or subscription)
            };
          });

          // Remove duplicates based on post ID
          const uniquePosts = transformedPosts.filter((post, index, self) =>
            index === self.findIndex((p) => p.id === post.id)
          );

          // Show all posts but mark access level for display logic
          console.log('Total posts after filtering:', uniquePosts.length);
          setFeed(uniquePosts);
        } else {
          const errorText = await response.text();
          console.error('API request failed:', response.status, errorText);
          throw new Error(`API request failed with status ${response.status}`);
        }
      } catch (error) {
        console.error('Error fetching feed:', error);
        toast({
          title: "Error",
          description: "Failed to load feed. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, [user, toast]);

  // Check if user has access to content based on subscription
  const hasAccessToContent = (postTier: string, creatorId: number, userSubscriptions: any[]) => {
    console.log('hasAccessToContent called:', { postTier, creatorId, userSubscriptionsCount: userSubscriptions?.length });

    // Public content is always accessible
    if (postTier === 'public' || postTier === 'free' || !postTier) {
      console.log('Public content access granted');
      return true;
    }

    // If user is not logged in, no access to premium content
    if (!user) {
      console.log('No user logged in, access denied');
      return false;
    }

    // Find user's subscription to this creator
    const userSubscription = userSubscriptions.find(
      sub => (sub.creator?.id === creatorId || sub.creator_id === creatorId) && sub.status === 'active'
    );

    console.log('Subscription search:', { 
      creatorId, 
      userSubscriptions: userSubscriptions.map(sub => ({ 
        id: sub.id, 
        creator_id: sub.creator?.id || sub.creator_id, 
        status: sub.status,
        tier_name: sub.tier?.name || sub.tier_name
      })),
      foundSubscription: userSubscription ? {
        id: userSubscription.id,
        creator_id: userSubscription.creator?.id || userSubscription.creator_id,
        status: userSubscription.status,
        tier_name: userSubscription.tier?.name || userSubscription.tier_name
      } : null
    });

    // If no subscription, no access to premium content
    if (!userSubscription) {
      console.log('No matching subscription found, access denied');
      return false;
    }

    // Define tier hierarchy - higher number = higher access level
    // Using exact tier names as they appear in the database
    const tierHierarchy: Record<string, number> = {
      'Supporter': 1,
      'Starter Pump': 1,
      'Fan': 2,
      'Premium': 2, 
      'Power Gains': 2,
      'Superfan': 3,
      'Elite Beast Mode': 3,
      'The VIP Elite': 3
    };

    const userTierLevel = userSubscription.tier?.name ? tierHierarchy[userSubscription.tier.name] || 0 : (userSubscription.tier_name ? tierHierarchy[userSubscription.tier_name] || 0 : 0);
    const postTierLevel = tierHierarchy[postTier] || 999; // Default to highest tier for unknown tiers (security)

    console.log('Feed access check:', {
      postTier,
      userTierLevel,
      postTierLevel,
      userTierName: userSubscription.tier?.name || userSubscription.tier_name,
      hasAccess: userTierLevel >= postTierLevel,
      creatorId,
      userId: user?.id
    });

    // User has access if their tier level is equal or higher than required
    return userTierLevel >= postTierLevel;
  };

  const handleLike = async (postId: string) => {
    if (!user) return;

    try {
      const currentPost = feed.find(post => post.id === postId);
      if (!currentPost) return;

      // Optimistically update UI
      setFeed(feed.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1
            }
          : post
      ));

      if (currentPost.liked) {
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

    } catch (error) {
      console.error('Error liking post:', error);
      // Revert UI if API call fails
      setFeed(feed.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              liked: !post.liked,
              likes: post.liked ? post.likes + 1 : post.likes - 1
            }
          : post
      ));
    }
  };

  const handleCommentClick = (postId: string) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleModalCommentClick = () => {
    setShowBottomSheet(true);
  };

  const handleCommentCountChange = (postId: string, newCount: number) => {
    setFeed(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, comments: newCount }
        : post
    ));
  };

  const handleShare = async (postId: string) => {
    const postToShare = feed.find(post => post.id === postId);
    if (!postToShare) return;

    const shareUrl = `${window.location.origin}/post/${postId}`; // Construct a shareable URL

    try {
      if (navigator.share && window.innerWidth < 768) { // Use Web Share API on mobile if available
        await navigator.share({
          title: `${postToShare.creator.display_name}'s post`,
          text: postToShare.content,
          url: shareUrl,
        });
        toast({
          title: "Shared successfully",
          description: "Post shared via native share dialog.",
        });
      } else {
        // Fallback for desktop or if Web Share API is not supported
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link copied",
          description: "Post link has been copied to your clipboard.",
        });
      }
    } catch (error) {
      console.error('Error sharing post:', error);
      toast({
        title: "Share failed",
        description: "Could not share post. Please try again.",
        variant: "destructive",
      });
    }
  };


  const handleThumbnailClick = (post: any) => {
    // Check if user has access to this content
    if (!post.hasAccess) {
      // Redirect to creator profile for subscription
      navigate(`/creator/${post.creator.username}`);
      return;
    }

    // All videos navigate to the dedicated video player page
    if (post.type === 'video') {
      navigate(`/video/${post.id}`);
    } else {
      // Non-video content opens in modal
      const index = feed.findIndex(p => p.id === post.id);
      setSelectedContent(post);
      setSelectedIndex(index);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedContent(null);
    setSelectedIndex(0);
    setExpandedModalCaption(false);
    setShowBottomSheet(false);
  };

  const handleSwipeUp = () => {
    if (selectedIndex < feed.length - 1) {
      const nextIndex = selectedIndex + 1;
      setSelectedIndex(nextIndex);
      setSelectedContent(feed[nextIndex]);
      setExpandedModalCaption(false);
    }
  };

  const handleSwipeDown = () => {
    if (selectedIndex > 0) {
      const prevIndex = selectedIndex - 1;
      setSelectedIndex(prevIndex);
      setSelectedContent(feed[prevIndex]);
      setExpandedModalCaption(false);
    }
  };

  const toggleComments = (postId: string) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const toggleCaptionExpansion = (postId: string) => {
    setExpandedCaptions(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const truncateText = (text: string, maxLines: number = 1) => {
    const words = text.split(' ');
    // Estimate words per line based on typical line length in the modal
    const wordsPerLine = window.innerWidth < 640 ? 10 : 15; // Adjust based on testing
    const maxWords = maxLines * wordsPerLine;

    if (words.length <= maxWords) {
      return { truncated: text, needsExpansion: false };
    }

    // Truncate and add ellipsis
    let truncatedText = words.slice(0, maxWords).join(' ');
    // Ensure we don't cut off a word in the middle if possible, by checking last few chars
    if (truncatedText.length > 0 && truncatedText.length < text.length) {
        truncatedText += '...';
    }


    return {
      truncated: truncatedText,
      needsExpansion: true
    };
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'image':
        return <Image className="w-4 h-4 text-white" />;
      case 'video':
        return <Video className="w-4 h-4 text-white" />;
      case 'audio':
        return <Music className="w-4 h-4 text-white" />;
      case 'text':
      case 'post':
        return <FileText className="w-4 h-4 text-white" />;
      default:
        return <FileText className="w-4 h-4 text-white" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'public':
        return 'outline';
      case 'supporter':
      case 'starter pump':
        return 'secondary';
      case 'fan':
      case 'power gains':
        return 'secondary';
      case 'premium':
      case 'superfan':
      case 'elite beast mode':
        return 'default';
      default:
        return 'outline';
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    // Return weeks for anything longer than a week
    return `${Math.floor(diffInDays / 7)}w ago`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Mobile Layout with better touch targets and spacing */}
      <div className="md:hidden">
        {/* Mobile Feed Container - Full Width with invisible scrollbar */}
        <div className="w-full bg-background -mt-16 pt-16 overflow-y-auto scrollbar-hide" style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
          {loading ? (
            <div className="space-y-0">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-full">
                  <div className="px-4 py-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-muted rounded-full animate-pulse"></div>
                      <div className="space-y-2 flex-1">
                        <div className="w-3/4 h-4 bg-muted rounded animate-pulse"></div>
                        <div className="w-1/2 h-3 bg-muted rounded animate-pulse"></div>
                      </div>
                    </div>
                    <div className="w-full h-72 bg-muted rounded-xl animate-pulse mb-4"></div>
                    <div className="space-y-3">
                      <div className="w-full h-4 bg-muted rounded animate-pulse"></div>
                      <div className="w-4/5 h-4 bg-muted rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : feed.length === 0 ? (
            <div className="text-center py-20 px-6">
              <Calendar className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
              <h3 className="text-2xl font-semibold mb-3">No posts yet</h3>
              <p className="text-muted-foreground mb-8 text-lg">
                Follow some creators to see their content in your feed
              </p>
              <Button asChild size="lg" className="px-8 py-3">
                <Link to="/explore">Discover Creators</Link>
              </Button>
            </div>
          ) : (
            /* Enhanced Mobile Feed Items with better spacing and touch targets */
            <div className="space-y-4 pb-6">
              {feed.map((post, index) => (
                <div key={post.id} className="w-full bg-background border-b border-border/10 overflow-hidden">
                  <div 
                    className="relative w-full aspect-video bg-black cursor-pointer transition-transform duration-200 active:scale-[0.99]"
                    onClick={() => handleThumbnailClick(post)}
                    style={{ minHeight: '44px' }} // Ensure minimum touch target size
                  >
                    {post.hasAccess ? (
                      post.thumbnail ? (
                        post.type === 'video' ? (
                          <div className="w-full h-full relative bg-gradient-to-br from-gray-900 to-gray-800">
                            <img 
                              src={
                                post.thumbnail.includes('cloudinary.com/') 
                                  ? post.thumbnail.replace('/upload/', '/upload/so_0,w_800,h_800,c_fill,f_jpg/').replace('.mp4', '.jpg')
                                  : post.thumbnail.startsWith('/uploads/') 
                                    ? post.thumbnail 
                                    : `/uploads/${post.thumbnail}`
                              }
                              alt={`${post.creator.display_name}'s video`}
                              className="w-full h-full object-cover"
                              loading={index > 3 ? "lazy" : "eager"}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = `https://placehold.co/800x800/1f2937/FFFFFF?text=Video+${post.id}`;
                              }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <div className="w-12 h-12 bg-black/60 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <img 
                            src={post.thumbnail.startsWith('/uploads/') ? post.thumbnail : `/uploads/${post.thumbnail}`}
                            alt={`${post.creator.display_name}'s post`}
                            className="w-full h-full object-cover"
                            loading={index > 3 ? "lazy" : "eager"}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://placehold.co/800x800/6366F1/FFFFFF?text=Creator+Post+${post.id}`;
                            }}
                          />
                        )
                      ) : (
                        <img 
                          src={post.id === '1' ? 'https://placehold.co/800x800/E63946/FFFFFF?text=Creator+Post+1' :
                               post.id === '2' ? 'https://placehold.co/800x800/457B9D/FFFFFF?text=Creator+Post+2' :
                               post.id === '3' ? 'https://placehold.co/800x800/1D3557/FFFFFF?text=Creator+Post+3' :
                               `https://placehold.co/800x800/6366F1/FFFFFF?text=Creator+Post+${post.id}`}
                          alt={`${post.creator.display_name}'s post`}
                          className="w-full h-full object-cover"
                          loading={index > 3 ? "lazy" : "eager"}
                        />
                      )
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-muted/30 to-muted/10 flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

                        {/* Minimal locked content preview matching desktop */}
                        <div className="text-center z-10 p-6 space-y-4">
                          <div className="w-16 h-16 bg-background/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>

                          {/* Better tier indicator */}
                          <div className="space-y-2">
                            <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-background/20 text-white border border-white/20 backdrop-blur-sm">
                              {post.tier === 'public' ? 'Free' : `${post.tier} Content`}
                            </div>
                          </div>

                          {/* Simplified CTA matching desktop styling */}
                          <Button 
                            size="lg" 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/creator/${post.creator.username}`);
                            }}
                            className="bg-accent hover:bg-accent/90 text-black text-sm h-12 px-8 rounded-lg font-semibold shadow-lg min-w-[120px]"
                            style={{ minHeight: '48px', minWidth: '120px' }} // Ensure proper touch target
                          >
                            Subscribe to View
                          </Button>
                        </div>
                      </div>
                    )}


                  </div>

                  {/* Enhanced bottom section with better spacing */}
                  <div className="p-4 space-y-3">
                    <div className="flex gap-4">
                      <Avatar 
                        className="h-12 w-12 flex-shrink-0 ring-2 ring-transparent cursor-pointer hover:ring-primary/20 transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/creator/${encodeURIComponent(post.creator.username)}`);
                        }}
                      >
                        <AvatarImage 
                          src={post.creator.avatar ? (post.creator.avatar.startsWith('http') || post.creator.avatar.startsWith('/uploads/') ? post.creator.avatar : `/uploads/${post.creator.avatar}`) : undefined} 
                          alt={post.creator.username} 
                        />
                        <AvatarFallback className="text-sm bg-muted text-muted-foreground">
                          {(post.creator.display_name || post.creator.username || 'U').charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0 space-y-2">
                        <h4 className="text-base font-semibold text-foreground line-clamp-1 leading-tight">
                          {post.content || 'Untitled Post'}
                        </h4>
                        {/* Creator name with view count and timestamp on same row - matching desktop view */}
                        <div className="flex items-center justify-between gap-2">
                          <p 
                            className="text-sm text-muted-foreground font-medium truncate cursor-pointer hover:text-foreground transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/creator/${encodeURIComponent(post.creator.username)}`);
                            }}
                          >
                            {post.creator.display_name || post.creator.username}
                          </p>
                          {/* Updated stats display format for mobile */}
                          <div className="flex items-center gap-2 text-sm text-muted-foreground flex-shrink-0">
                            <span>{(post.likes_count || post.views || 0).toLocaleString()} views</span>
                            <span>•</span>
                            <span>{getTimeAgo(post.posted)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Comments Section */}
                    {showComments[post.id] && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <CommentSection
                          postId={post.id}
                          initialComments={post.initialComments || []}
                          onCommentCountChange={(newCount) => handleCommentCountChange(post.id, newCount)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Desktop Layout - Keep original design */}
      <div className="hidden md:block">
        <EdgeToEdgeContainer>
      {/* Hero Section - Full Width */}
      <div className="bg-gradient-to-r from-accent/10 via-primary/5 to-accent/10 border-b border-border">
        <EdgeToEdgeContainer maxWidth="4xl" enablePadding enableTopPadding>
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Your Feed
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Latest content from creators you follow
            </p>

            {/* View Toggle - Desktop Only */}
            <div className="hidden md:flex justify-center">
              <div className="inline-flex items-center rounded-lg border border-border bg-background p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8 px-3"
                >
                  <Grid3X3 className="w-4 h-4 mr-2" />
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'single' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('single')}
                  className="h-8 px-3"
                >
                  <List className="w-4 h-4 mr-2" />
                  Single
                </Button>
              </div>
            </div>
          </div>
        </EdgeToEdgeContainer>
      </div>

      {/* Feed Content */}
      <EdgeToEdgeContainer maxWidth="7xl" enablePadding className="py-4 sm:py-6">
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-gradient-card border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-muted rounded-full animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="w-32 h-4 bg-muted rounded animate-pulse"></div>
                      <div className="w-24 h-3 bg-muted rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="w-full h-48 bg-muted rounded-lg animate-pulse mb-4"></div>
                  <div className="space-y-2">
                    <div className="w-full h-4 bg-muted rounded animate-pulse"></div>
                    <div className="w-3/4 h-4 bg-muted rounded animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : feed.length === 0 ? (
          <div className="text-center py-12 px-4 sm:px-6">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
            <p className="text-muted-foreground mb-6">
              Follow some creators to see their content in your feed
            </p>
            <Button asChild>
              <Link to="/explore">Discover Creators</Link>
            </Button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="w-full max-w-none px-4 py-6">
            {/* Optimized 4-column grid with consistent sizing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 max-w-7xl mx-auto">
              {feed.map((post, index) => (
                <div 
                  key={post.id} 
                  className="group bg-card border border-border rounded-lg overflow-hidden cursor-pointer h-full flex flex-col"
                  onClick={() => handleThumbnailClick(post)}
                  style={{
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  {/* Enhanced Thumbnail with improved overlays */}
                  <div className="relative w-full aspect-video bg-black overflow-hidden">
                    {post.hasAccess ? (
                      post.thumbnail ? (
                        post.type === 'video' ? (
                          <div className="w-full h-full relative bg-gradient-to-br from-gray-900 to-gray-800">
                            <img 
                              src={
                                post.thumbnail.includes('cloudinary.com/') 
                                  ? post.thumbnail.replace('/upload/', '/upload/so_0,w_640,h_360,c_fill,f_jpg/').replace('.mp4', '.jpg')
                                  : post.thumbnail.startsWith('/uploads/') 
                                    ? post.thumbnail 
                                    : `/uploads/${post.thumbnail}`
                              }
                              alt={`${post.creator.display_name}'s video`}
                              className="w-full h-full object-cover"
                              loading={index > 8 ? "lazy" : "eager"}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = `https://placehold.co/640x360/1f2937/FFFFFF?text=Video+${post.id}`;
                              }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <div className="w-12 h-12 bg-black/60 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <img 
                            src={post.thumbnail.startsWith('/uploads/') ? post.thumbnail : `/uploads/${post.thumbnail}`}
                            alt={`${post.creator.display_name}'s post`}
                            className="w-full h-full object-cover"
                            loading={index > 8 ? "lazy" : "eager"}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://placehold.co/640x360/6366F1/FFFFFF?text=Creator+Post+${post.id}`;
                            }}
                          />
                        )
                      ) : (
                        <img 
                          src={post.id === '1' ? 'https://placehold.co/640x360/E63946/FFFFFF?text=Creator+Post+1' :
                               post.id === '2' ? 'https://placehold.co/640x360/457B9D/FFFFFF?text=Creator+Post+2' :
                               post.id === '3' ? 'https://placehold.co/640x360/1D3557/FFFFFF?text=Creator+Post+3' :
                               `https://placehold.co/640x360/6366F1/FFFFFF?text=Creator+Post+${post.id}`}
                          alt={`${post.creator.display_name}'s post`}
                          className="w-full h-full object-cover"
                          loading={index > 8 ? "lazy" : "eager"}
                        />
                      )
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-muted/30 to-muted/10 flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

                        {/* Enhanced locked content preview */}
                        <div className="text-center z-10 p-4 space-y-3">
                          <div className="w-12 h-12 mx-auto bg-background/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>

                          {/* Better tier indicator */}
                          <div className="space-y-1">
                            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-background/20 text-white border border-white/20 backdrop-blur-sm">
                              {post.tier} Content
                            </div>
                          </div>

                          {/* Improved subscribe CTA */}
                          <Button 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/creator/${post.creator.username}`);
                            }}
                            className="bg-accent text-black text-xs px-4 py-2 rounded-lg font-medium shadow-lg"
                          >
                            Subscribe to View
                          </Button>
                        </div>
                      </div>
                    )}


                  </div>

                  {/* Enhanced content section with uniform height */}
                  <div className="flex-1 flex flex-col p-3 space-y-3">
                    <div className="flex gap-3 flex-1">
                      <Avatar 
                        className="h-8 w-8 flex-shrink-0 ring-2 ring-transparent cursor-pointer hover:ring-primary/20 transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/creator/${encodeURIComponent(post.creator.username)}`);
                        }}
                      >
                        <AvatarImage 
                          src={post.creator.avatar ? (post.creator.avatar.startsWith('http') || post.creator.avatar.startsWith('/uploads/') ? post.creator.avatar : `/uploads/${post.creator.avatar}`) : undefined} 
                          alt={post.creator.username} 
                        />
                        <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                          {(post.creator.display_name || post.creator.username || 'U').charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0 space-y-1">
                        {/* Enhanced typography hierarchy */}
                        <h3 className="text-sm font-semibold text-foreground line-clamp-1 leading-snug">
                          {post.content || 'Untitled Post'}
                        </h3>

                        {/* Creator name with view count and timestamp on same row */}
                        <div className="flex items-center justify-between gap-2">
                          <p 
                            className="text-xs text-muted-foreground font-medium truncate cursor-pointer hover:text-foreground transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/creator/${encodeURIComponent(post.creator.username)}`);
                            }}
                          >
                            {post.creator.display_name || post.creator.username}
                          </p>
                          {/* Updated stats display format for desktop grid view */}
                          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-shrink-0">
                            <span>{(post.likes_count || post.views || 0).toLocaleString()} views</span>
                            <span>•</span>
                            <span>{getTimeAgo(post.posted)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Enhanced Single View with smoother transitions and better loading states */
          <div className="max-w-5xl mx-auto space-y-8 px-4">
            {feed.map((post, index) => (
              <Card 
                key={post.id} 
                className="bg-gradient-card border-border/50 overflow-hidden"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeIn 0.6s ease-out forwards'
                }}
              >
                <CardContent className="p-0">
                  {/* Enhanced Media Content */}
                  <div 
                    className="relative aspect-video bg-black cursor-pointer overflow-hidden group"
                    onClick={() => handleThumbnailClick(post)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleThumbnailClick(post);
                      }
                    }}
                  >
                    {post.hasAccess ? (
                      post.thumbnail ? (
                        post.type === 'video' ? (
                          <div className="w-full h-full relative bg-gradient-to-br from-gray-900 to-gray-800">
                            <img 
                              src={
                                post.thumbnail.includes('cloudinary.com/') 
                                  ? post.thumbnail.replace('/upload/', '/upload/so_0,w_1280,h_720,c_fill,f_jpg/').replace('.mp4', '.jpg')
                                  : post.thumbnail.startsWith('/uploads/') 
                                    ? post.thumbnail 
                                    : `/uploads/${post.thumbnail}`
                              }
                              alt={`${post.creator.display_name}'s video`}
                              className="w-full h-full object-cover"
                              loading={index > 2 ? "lazy" : "eager"}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = `https://placehold.co/1280x720/1f2937/FFFFFF?text=Video+${post.id}`;
                              }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <div className="w-16 h-16 bg-black/60 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <img 
                            src={post.thumbnail.startsWith('/uploads/') ? post.thumbnail : `/uploads/${post.thumbnail}`}
                            alt={`${post.creator.display_name}'s post`}
                            className="w-full h-full object-cover"
                            loading={index > 2 ? "lazy" : "eager"}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://placehold.co/1280x720/6366F1/FFFFFF?text=Creator+Post+${post.id}`;
                            }}
                          />
                        )
                      ) : (
                        <img 
                          src={post.id === '1' ? 'https://placehold.co/1280x720/E63946/FFFFFF?text=Creator+Post+1' :
                               post.id === '2' ? 'https://placehold.co/1280x720/457B9D/FFFFFF?text=Creator+Post+2' :
                               post.id === '3' ? 'https://placehold.co/1280x720/1D3557/FFFFFF?text=Creator+Post+3' :
                               `https://placehold.co/1280x720/6366F1/FFFFFF?text=Creator+Post+${post.id}`}
                          alt={`${post.creator.display_name}'s post`}
                          className="w-full h-full object-cover"
                          loading={index > 2 ? "lazy" : "eager"}
                        />
                      )
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-muted/30 to-muted/10 flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
                        <div className="text-center z-10 p-8 space-y-6">
                          <div className="w-20 h-20 mx-auto bg-background/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <svg className="w-12 h-12 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>

                          <div className="space-y-3">
                            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-background/20 text-white border border-white/20 backdrop-blur-sm">
                              {post.tier} Content
                            </div>

                          </div>

                          <Button 
                            size="lg"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/creator/${post.creator.username}`);
                            }}
                            className="bg-accent text-black text-base h-12 px-8 rounded-lg font-semibold shadow-lg"
                          >
                            Subscribe
                          </Button>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Enhanced content section */}
                  <div className="p-6 space-y-4">
                    {/* Creator Info with enhanced typography */}
                    <div className="flex gap-4">
                      <Avatar 
                        className="h-12 w-12 flex-shrink-0 ring-2 ring-transparent cursor-pointer hover:ring-primary/20 transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/creator/${encodeURIComponent(post.creator.username)}`);
                        }}
                      >
                        <AvatarImage 
                          src={post.creator.avatar ? (post.creator.avatar.startsWith('http') || post.creator.avatar.startsWith('/uploads/') ? post.creator.avatar : `/uploads/${post.creator.avatar}`) : undefined} 
                          alt={post.creator.username} 
                        />
                        <AvatarFallback>{(post.creator.display_name || post.creator.username || 'U').charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0 space-y-2">
                        <h4 className="text-lg font-semibold text-foreground line-clamp-2 leading-tight">
                          {post.content || 'Untitled Post'}
                        </h4>
                        {/* Creator name with view count and timestamp on same row - matching grid view */}
                        <div className="flex items-center justify-between gap-3">
                          <p 
                            className="text-sm text-muted-foreground font-medium truncate cursor-pointer hover:text-foreground transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/creator/${encodeURIComponent(post.creator.username)}`);
                            }}
                          >
                            {post.creator.display_name || post.creator.username}
                          </p>
                          {/* Updated stats display format for desktop single view */}
                          <div className="flex items-center gap-2 text-sm text-muted-foreground flex-shrink-0">
                            <span>{(post.likes_count || post.views || 0).toLocaleString()} views</span>
                            <span>•</span>
                            <span>{getTimeAgo(post.posted)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Action Buttons */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/30">
                      <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-10 w-10 p-0 rounded-full ${post.liked ? 'text-red-500 bg-red-50' : 'text-muted-foreground'}`}
                            onClick={() => handleLike(post.id)}
                          >
                            <Heart className={`w-5 h-5 ${post.liked ? 'fill-current' : ''}`} />
                          </Button>
                          <span className="text-sm font-semibold text-foreground">
                            {(post.likes_count || 0).toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-10 w-10 p-0 rounded-full text-muted-foreground"
                            onClick={() => handleCommentClick(post.id)}
                          >
                            <MessageSquare className="w-5 h-5" />
                          </Button>
                          <span className="text-sm font-semibold text-foreground">
                            {(post.comments_count || 0).toLocaleString()}
                          </span>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-10 w-10 p-0 rounded-full text-muted-foreground"
                          onClick={() => handleShare(post.id)}
                        >
                          <Share2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>

                    {/* Comments Section */}
                    {showComments[post.id] && (
                      <div className="mt-6 pt-4 border-t border-border animate-in slide-in-from-top-2 duration-300">
                        <CommentSection
                          postId={post.id}
                          initialComments={post.initialComments || []}
                          onCommentCountChange={(count) => handleCommentCountChange(post.id, count)}
                          isBottomSheet={false}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Load More */}
        {!loading && feed.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline">
              Load More Posts
            </Button>
          </div>
        )}
      </EdgeToEdgeContainer>

      {/* Instagram-style Content Modal with responsive design */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-full max-h-full p-0 m-0 overflow-hidden border-0 [&>button]:hidden sm:max-w-5xl sm:max-h-[95vh] sm:w-auto sm:h-auto sm:rounded-lg">
          <DialogHeader className="sr-only">
            <DialogTitle>{selectedContent?.type} Content</DialogTitle>
            <DialogDescription>View content from {selectedContent?.creator?.display_name}</DialogDescription>
          </DialogHeader>
          {selectedContent && (
            <div 
              className="relative w-full h-full bg-black sm:flex sm:h-[90vh] sm:max-h-[800px] sm:rounded-lg sm:overflow-hidden"
              onTouchStart={(e) => {
                const touch = e.touches[0];
                const startY = touch.clientY;

                const handleTouchMove = (moveEvent: TouchEvent) => {
                  const currentTouch = moveEvent.touches[0];
                  const deltaY = startY - currentTouch.clientY;

                  if (Math.abs(deltaY) > 50) {
                    if (deltaY > 0) {
                      handleSwipeUp();
                    } else {
                      handleSwipeDown();
                    }
                    document.removeEventListener('touchmove', handleTouchMove);
                    document.removeEventListener('touchend', handleTouchEnd);
                  }
                };

                const handleTouchEnd = () => {
                  document.removeEventListener('touchmove', handleTouchMove);
                  document.removeEventListener('touchend', handleTouchEnd);
                };

                document.addEventListener('touchmove', handleTouchMove);
                document.addEventListener('touchend', handleTouchEnd);
              }}
            >
              {/* Back Arrow Button */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 left-4 z-50 w-10 h-10 rounded-full text-white hover:bg-gray-800 sm:text-gray-600 sm:hover:bg-gray-200"
                onClick={closeModal}
              >
                <ArrowLeft className="w-7 h-7" />
              </Button>

              {/* Mobile: Full screen content */}
              <div className="relative w-full h-full bg-black sm:hidden">
                {selectedContent.thumbnail ? (
                  selectedContent.type === 'video' ? (
                    <div className="w-full h-full bg-black flex items-center justify-center">
                    <video 
                      key={selectedContent.id}
                      src={selectedContent.thumbnail} 
                      className="max-w-full max-h-full"
                      controls
                      autoPlay
                      muted
                      loop
                      onLoadedMetadata={(e) => {
                        const video = e.target as HTMLVideoElement;
                        const aspectRatio = video.videoWidth / video.videoHeight;

                        if (aspectRatio > 1) {
                          // Landscape video - fit width
                          video.style.width = '100%';
                          video.style.height = 'auto';
                        } else {
                          // Portrait video - fit height
                          video.style.width = 'auto';
                          video.style.height = '100%';
                        }
                      }}
                    />
                    </div>
                  ) : (
                    <img 
                      src={selectedContent.thumbnail} 
                      alt={`${selectedContent.creator.display_name}'s post`}
                      className="w-full h-full object-cover"
                    />
                  )
                ) : (
                  selectedContent.id === '1' ? (
                    <img 
                      src="https://placehold.co/1080x1920/E63946/FFFFFF?text=Creator+Post+1"
                      alt={`${selectedContent.creator.display_name}'s post`}
                      className="w-full h-full object-cover"
                    />
                  ) : selectedContent.id === '2' ? (
                    <img 
                      src="https://placehold.co/1080x1920/457B9D/FFFFFF?text=Creator+Post+2"
                      alt={`${selectedContent.creator.display_name}'s post`}
                      className="w-full h-full object-cover"
                    />
                  ) : selectedContent.id === '3' ? (
                    <img 
                      src="https://placehold.co/1080x1920/1D3557/FFFFFF?text=Creator+Post+3"
                      alt={`${selectedContent.creator.display_name}'s post`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img 
                      src={`https://placehold.co/1080x1920/6366F1/FFFFFF?text=Creator+Post+${selectedContent.id}`}
                      alt={`${selectedContent.creator.display_name}'s post`}
                      className="w-full h-full object-cover"
                    />
                  )
                )}

                {/* Mobile overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none">
                  {/* Creator info overlay - bottom left - moved up */}
                  <div className="absolute bottom-20 left-4 right-16 pointer-events-auto">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-10 w-10 border-2 border-white">
                        <AvatarImage 
                          src={selectedContent.creator.avatar ? (selectedContent.creator.avatar.startsWith('http') || selectedContent.creator.avatar.startsWith('/uploads/') ? selectedContent.creator.avatar : `/uploads/${selectedContent.creator.avatar}`) : undefined} 
                          alt={selectedContent.creator.username} 
                        />
                        <AvatarFallback className="text-black">{(selectedContent.creator.display_name || selectedContent.creator.username || 'U').charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold text-white text-sm drop-shadow-lg">
                          @{selectedContent.creator.username}
                        </p>
                        <span className="text-xs text-white/80 drop-shadow-lg">
                          {getTimeAgo(selectedContent.posted)}
                        </span>
                      </div>
                    </div>

                    {/* Caption */}
                    <div className="mb-3">
                      {(() => {
                        const { truncated, needsExpansion } = truncateText(selectedContent.content, 2);

                        return (
                          <p className="text-sm leading-relaxed text-white drop-shadow-lg">
                            {expandedModalCaption ? selectedContent.content : (
                              <>
                                {truncated}
                                {needsExpansion && !expandedModalCaption && (
                                  <>
                                    {'... '}
                                    <button
                                      onClick={() => setExpandedModalCaption(true)}
                                      className="text-white/80 hover:text-white font-normal underline"
                                    >
                                      more
                                    </button>
                                  </>
                                )}
                              </>
                            )}
                            {expandedModalCaption && needsExpansion && (
                              <>
                                {' '}
                                <button
                                  onClick={() => setExpandedModalCaption(false)}
                                  className="text-white/80 hover:text-white font-normal underline"
                                >
                                  less
                                </button>
                              </>
                            )}
                          </p>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Action buttons - right side */}
                  <div className="absolute bottom-20 right-4 flex flex-col gap-4 pointer-events-auto">
                    <div className="flex flex-col items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-12 w-12 p-0 rounded-full bg-gray-900 border-2 border-gray-500 ${selectedContent.liked ? 'text-red-500' : 'text-white'}`}
                        onClick={() => handleLike(selectedContent.id)}
                      >
                        <Heart className={`w-6 h-6 ${selectedContent.liked ? 'fill-current' : ''}`} />
                      </Button>
                      <span className="text-xs font-medium text-white drop-shadow-lg mt-1">
                        {selectedContent.likes}
                      </span>
                    </div>

                    <div className="flex flex-col items-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-12 w-12 p-0 rounded-full bg-gray-900 border-2 border-gray-500 text-white"
                        onClick={handleModalCommentClick}
                      >
                        <MessageSquare className="w-6 h-6" />
                      </Button>
                      <span className="text-xs font-medium text-white drop-shadow-lg mt-1">
                        {selectedContent.comments}
                      </span>
                    </div>

                    <div className="flex flex-col items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-12 w-12 p-0 rounded-full bg-gray-900 border-2 border-gray-500 text-white"
                        onClick={() => handleShare(selectedContent.id)}
                      >
                        <Share2 className="w-6 h-6" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop: Two-panel Instagram-style layout */}
              <div className="hidden sm:flex w-full h-full">
                {/* Left panel - Content */}
                <div className="flex-1 bg-black flex items-center justify-center">
                  <div className="relative w-full h-full max-w-md mx-auto">
                  {selectedContent.thumbnail ? (
                      selectedContent.type === 'video' ? (
                        <div className="w-full h-full bg-black flex items-center justify-center">
                        <video 
                          key={selectedContent.id}
                          src={selectedContent.thumbnail}
                          className="max-w-full max-h-full"
                          controls
                          autoPlay
                          muted
                          loop
                          onLoadedMetadata={(e) => {
                            const video = e.target as HTMLVideoElement;
                            const aspectRatio = video.videoWidth / video.videoHeight;

                            if (aspectRatio > 1) {
                              // Landscape video - fit width
                              video.style.width = '100%';
                              video.style.height = 'auto';
                            } else {
                              // Portrait video - fit height
                              video.style.width = 'auto';
                              video.style.height = '100%';
                            }
                          }}
                        />
                        </div>
                      ) : (
                        <img 
                          src={selectedContent.thumbnail} 
                          alt={`${selectedContent.creator.display_name}'s post`}
                          className="w-full h-full object-contain"
                        />
                      )
                    ) : (
                      selectedContent.id === '1' ? (
                        <img 
                          src="https://placehold.co/1080x1920/E63946/FFFFFF?text=Creator+Post+1"
                          alt={`${selectedContent.creator.display_name}'s post`}
                          className="w-full h-full object-contain"
                        />
                      ) : selectedContent.id === '2' ? (
                        <img 
                          src="https://placehold.co/1080x1920/457B9D/FFFFFF?text=Creator+Post+2"
                          alt={`${selectedContent.creator.display_name}'s post`}
                          className="w-full h-full object-contain"
                        />
                      ) : selectedContent.id === '3' ? (
                        <img 
                          src="https://placehold.co/1080x1920/1D3557/FFFFFF?text=Creator+Post+3"
                          alt={`${selectedContent.creator.display_name}'s post`}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <img 
                          src={`https://placehold.co/1080x1920/6366F1/FFFFFF?text=Creator+Post+${selectedContent.id}`}
                          alt={`${selectedContent.creator.display_name}'s post`}
                          className="w-full h-full object-contain"
                        />
                      )
                    )}
                  </div>
                </div>

                {/* Right panel - Post info and comments */}
                <div className="w-96 bg-background flex flex-col">
                  {/* Post header */}
                  <div className="px-4 py-3 border-b border-border">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage 
                          src={selectedContent.creator.avatar ? (selectedContent.creator.avatar.startsWith('http') || selectedContent.creator.avatar.startsWith('/uploads/') ? selectedContent.creator.avatar : `/uploads/${selectedContent.creator.avatar}`) : undefined} 
                          alt={selectedContent.creator.username} 
                        />
                        <AvatarFallback>{(selectedContent.creator.display_name || selectedContent.creator.username || 'U').charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground text-sm">
                          @{selectedContent.creator.username}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {getTimeAgo(selectedContent.posted)}
                        </span>
                      </div>
                    </div>

                    {/* Caption */}
                    <div className="mt-3">
                      <p className="text-sm leading-relaxed text-foreground line-clamp-2">
                        {selectedContent.content}
                      </p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="px-4 py-3 border-b border-border">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-8 w-8 p-0 ${selectedContent.liked ? 'text-red-500' : 'text-muted-foreground'}`}
                          onClick={() => handleLike(selectedContent.id)}
                        >
                          <Heart className={`w-6 h-6 ${selectedContent.liked ? 'fill-current' : ''}`} />
                        </Button>
                        <span className="text-sm font-medium text-foreground">
                          {selectedContent.likes}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-muted-foreground"
                        >
                          <MessageSquare className="w-6 h-6" />
                        </Button>
                        <span className="text-sm font-medium text-foreground">
                          {selectedContent.comments}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground"
                        onClick={() => handleShare(selectedContent.id)}
                      >
                        <Share2 className="w-6 h-6" />
                      </Button>
                    </div>
                  </div>

                  {/* Comments section */}
                  <div className="flex-1 overflow-hidden">
                    <CommentSection
                      postId={selectedContent.id}
                      initialComments={selectedContent.initialComments || []}
                      onCommentCountChange={(count) => handleCommentCountChange(selectedContent.id, count)}
                      isBottomSheet={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Instagram-style Bottom Sheet Comment Section */}
      <Sheet open={showBottomSheet} onOpenChange={setShowBottomSheet}>
        <SheetContent 
          side="bottom" 
          className="h-[75vh] p-0 border-t-4 border-border/30 rounded-t-xl bg-background flex flex-col"
        >
          <SheetHeader className="px-4 py-3 border-b border-border/20 bg-background shrink-0">
            <div className="flex items-center justify-center">
              <div className="w-12 h-1 bg-muted-foreground/30 rounded-full mb-2"></div>
            </div>
            <SheetTitle className="text-center text-lg font-semibold text-foreground">
              Comments
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto bg-background">
            {selectedContent && (
              <CommentSection
                postId={selectedContent.id}
                initialComments={selectedContent.initialComments || []}
                onCommentCountChange={(count) => handleCommentCountChange(selectedContent.id, count)}
                isBottomSheet={true}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
        </EdgeToEdgeContainer>
      </div>
    </div>
  );
};