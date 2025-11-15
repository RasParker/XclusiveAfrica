import React, { useState, useEffect } from 'react';
// UI Updates Applied: Up Next layout fix + transparency removal - Jan 27 2025
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { CommentSection } from '@/components/fan/CommentSection';
import { Heart, MessageSquare, Share2, ArrowLeft, Maximize2, X, Eye, ChevronDown, Play, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { SubscriptionTierModal } from '@/components/subscription/SubscriptionTierModal';
import { PaymentModal } from '@/components/payment/PaymentModal';
import { LockedContentOverlay } from '@/components/content/LockedContentOverlay';
import { UnlockOptionsModal } from '@/components/payment/UnlockOptionsModal';
import { PPVPaymentModal } from '@/components/payment/PPVPaymentModal';
import { getTimeAgo } from '@/lib/timeUtils';

export const VideoWatch: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isImmersive, setIsImmersive] = useState(false);
  const [videoAspectRatio, setVideoAspectRatio] = useState<'landscape' | 'portrait' | null>(null);
  const [liked, setLiked] = useState(false);
  const [showCommentsSheet, setShowCommentsSheet] = useState(false);
  const [nextVideos, setNextVideos] = useState<any[]>([]);
  const [userSubscription, setUserSubscription] = useState<any>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [subscriptionTierModalOpen, setSubscriptionTierModalOpen] = useState(false);
  const [selectedCreatorForSubscription, setSelectedCreatorForSubscription] = useState<any>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<any>(null);
  const [hasPPVAccess, setHasPPVAccess] = useState(false);
  const [unlockOptionsModalOpen, setUnlockOptionsModalOpen] = useState(false);
  const [ppvPaymentModalOpen, setPPVPaymentModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Check PPV access
  useEffect(() => {
    const checkPPVAccess = async () => {
      if (!user || !post || !post.is_ppv_enabled) {
        setHasPPVAccess(false);
        return;
      }

      try {
        const response = await fetch(`/api/payments/ppv-access/${user.id}/${post.id}`);
        if (response.ok) {
          const data = await response.json();
          setHasPPVAccess(data.has_access);
        } else {
          setHasPPVAccess(false);
        }
      } catch (error) {
        console.error('Error checking PPV access:', error);
        setHasPPVAccess(false);
      }
    };

    checkPPVAccess();
  }, [user, post]);

  // Check tier access control (including PPV)
  useEffect(() => {
    if (!post) {
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

    // Check PPV access first
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

    // Check tier hierarchy
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
    console.log('Video access check:', { 
      postTier, 
      userTierLevel, 
      postTierLevel, 
      userTierName: userSubscription.tier_name,
      hasPPVAccess,
      hasAccess: access 
    });

    setHasAccess(access);
  }, [post, user, userSubscription, hasPPVAccess]);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      try {
        const url = user ? `/api/posts/${id}?userId=${user.id}` : `/api/posts/${id}`;
        const response = await fetch(url);
        if (response.ok) {
          const postData = await response.json();
          // Map the creator data to the expected format
          const mappedPost = {
            ...postData,
            creator_display_name: postData.creator?.display_name || postData.creator?.username || postData.display_name || postData.username || 'Unknown Creator',
            creator_username: postData.creator?.username || postData.username || 'unknown',
            creator_avatar: postData.creator?.avatar || postData.avatar || null,
            creator: postData.creator || {
              id: postData.creator_id,
              username: postData.username,
              display_name: postData.display_name,
              avatar: postData.avatar
            }
          };
          setPost(mappedPost);

          // Check user's subscription to this creator
          if (user && mappedPost.creator_id) {
            try {
              const subResponse = await fetch(`/api/subscriptions/user/${user.id}/creator/${mappedPost.creator_id}`);
              if (subResponse.ok) {
                const subscription = await subResponse.json();
                setUserSubscription(subscription);
                console.log('User subscription:', subscription);
              }
            } catch (error) {
              console.error('Error checking subscription:', error);
            }
          }

          // Check if user has liked this post
          if (user) {
            const likeResponse = await fetch(`/api/posts/${id}/like/${user.id}`);
            if (likeResponse.ok) {
              const likeData = await likeResponse.json();
              setLiked(likeData.liked);
            }
          }
        } else {
          toast({
            title: "Error",
            description: "Failed to load video.",
            variant: "destructive"
          });
          navigate('/fan/feed');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        toast({
          title: "Error",
          description: "Failed to load video.",
          variant: "destructive"
        });
        navigate('/fan/feed');
      } finally {
        setLoading(false);
      }
    };

    const fetchNextVideos = async () => {
      try {
        // Use personalized feed if user is logged in, otherwise show all public posts
        const feedUrl = user ? `/api/feed/${user.id}` : '/api/posts';
        const response = await fetch(feedUrl);
        if (response.ok) {
          const posts = await response.json();
          // Filter out current video and take next 5, and map creator data
          const filtered = posts
            .filter((p: any) => p.id.toString() !== id)
            .slice(0, 5)
            .map((post: any) => {
              // If has_access exists, use it. Otherwise, infer from tier (public = accessible)
              const postTier = post.tier?.toLowerCase() || 'public';
              const hasAccessFlag = post.has_access !== undefined 
                ? post.has_access === true 
                : postTier === 'public';

              return {
                ...post,
                creator_display_name: post.creator?.display_name || post.creator?.username || post.display_name || post.username || 'Unknown Creator',
                creator_username: post.creator?.username || post.username || 'unknown',
                creator_avatar: post.creator?.avatar || post.avatar || null,
                hasAccess: hasAccessFlag
              };
            });
          setNextVideos(filtered);
        }
      } catch (error) {
        console.error('Error fetching next videos:', error);
      }
    };

    fetchPost();
    fetchNextVideos();
  }, [id, user, toast, navigate]);

  const handleLike = async () => {
    if (!user || !post) return;

    try {
      if (liked) {
        await fetch(`/api/posts/${post.id}/like`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id }),
        });
      } else {
        await fetch(`/api/posts/${post.id}/like`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id }),
        });
      }

      setLiked(!liked);
      setPost((prev: any) => ({
        ...prev,
        likes_count: liked ? prev.likes_count - 1 : prev.likes_count + 1
      }));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Video link has been copied to your clipboard.",
    });
  };

  const handleUnlockClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      navigate(`/login?redirect=/video/${id}`);
      return;
    }

    if (!post) return;

    // If PPV is enabled, open PPV payment modal directly
    if (post.is_ppv_enabled && post.ppv_price) {
      setPPVPaymentModalOpen(true);
    } else {
      // If no PPV, go straight to subscription
      handleSubscribeClick();
    }
  };

  const handleSubscribeClick = async () => {
    if (!user) {
      navigate(`/login?redirect=/video/${id}`);
      return;
    }

    if (!post) return;

    try {
      // Fetch creator data and tiers
      const [userResponse, tiersResponse] = await Promise.all([
        fetch(`/api/users/${post.creator_id}`),
        fetch(`/api/creators/${post.creator_id}/tiers`)
      ]);

      if (!userResponse.ok || !tiersResponse.ok) {
        toast({
          title: "Error",
          description: "Failed to load subscription options",
          variant: "destructive"
        });
        return;
      }

      const creatorData = await userResponse.json();
      const tiersData = await tiersResponse.json();

      // Set creator data and open modal
      setSelectedCreatorForSubscription({
        id: creatorData.id,
        username: creatorData.username,
        display_name: creatorData.display_name || creatorData.username,
        avatar: creatorData.avatar || '',
        tiers: tiersData
      });
      setSubscriptionTierModalOpen(true);
    } catch (error) {
      console.error('Error fetching creator tiers:', error);
      toast({
        title: "Error",
        description: "Failed to load subscription options",
        variant: "destructive"
      });
    }
  };

  const handlePPVSelection = () => {
    setUnlockOptionsModalOpen(false);
    setPPVPaymentModalOpen(true);
  };

  const handleSubscribeSelection = () => {
    setUnlockOptionsModalOpen(false);
    handleSubscribeClick();
  };

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

  const toggleImmersive = () => {
    if (videoAspectRatio === 'portrait') {
      setIsImmersive(!isImmersive);
    }
  };

  const handleVideoLoad = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.target as HTMLVideoElement;
    const aspectRatio = video.videoWidth / video.videoHeight;

    if (aspectRatio > 1) {
      setVideoAspectRatio('landscape');
      video.setAttribute('data-aspect-ratio', 'landscape');
    } else {
      setVideoAspectRatio('portrait');
      video.setAttribute('data-aspect-ratio', 'portrait');
    }

    // Try to autoplay
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.log('Autoplay blocked:', error);
          setIsPlaying(false);
        });
    }
  };

  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = e.currentTarget.querySelector('video');
    if (!video) return;
    
    if (video.paused) {
      video.play().then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        console.error('Play failed:', error);
      });
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleVideoCardClick = (videoId: string) => {
    navigate(`/video/${videoId}`);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isImmersive) {
        setIsImmersive(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isImmersive]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Video not found</h2>
          <Button onClick={() => navigate('/fan/feed')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Feed
          </Button>
        </div>
      </div>
    );
  }

  const mediaUrl = Array.isArray(post.media_urls) ? post.media_urls[0] : post.media_urls;
  const fullMediaUrl = mediaUrl?.startsWith('http') ? mediaUrl : `/uploads/${mediaUrl}`;

  return (
    <div className={`min-h-screen bg-background ${isImmersive ? 'is-immersive' : ''}`}>
      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* Video Player Wrapper - YouTube style for mobile - Sticky */}
        <div className="video-player-wrapper sticky top-0 z-20 relative bg-black w-full">
          {/* Back Button */}
          {!isImmersive && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 left-4 z-10 text-white hover:bg-white/20"
              onClick={() => {
                // Check if we came from a creator profile by looking at the post's creator
                if (post && post.creator_username) {
                  navigate(`/creator/${post.creator_username}`);
                } else if (user?.role === 'creator') {
                  navigate(`/creator/${user.username}`);
                } else {
                  navigate('/fan/feed');
                }
              }}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}

          {/* Close Immersive Button */}
          {isImmersive && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
              onClick={() => setIsImmersive(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          )}

          {/* Immersive Toggle Button - only for portrait videos */}
          {videoAspectRatio === 'portrait' && !isImmersive && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
              onClick={toggleImmersive}
            >
              <Maximize2 className="w-5 h-5" />
            </Button>
          )}

          {/* Video Element or Locked State */}
          {hasAccess ? (
            post.media_type === 'video' ? (
              <div className="relative w-full h-full" onClick={handleVideoClick}>
                <video
                  src={fullMediaUrl}
                  poster={
                    mediaUrl?.includes('cloudinary.com/') 
                      ? mediaUrl.replace('/upload/', '/upload/so_0,w_1280,h_720,c_fill,f_jpg/').replace('.mp4', '.jpg')
                      : undefined
                  }
                  className="w-full h-full video-element"
                  controls
                  playsInline
                  onLoadedMetadata={handleVideoLoad}
                  onPlay={handlePlay}
                  onPause={handlePause}
                  style={{
                    objectFit: videoAspectRatio === 'landscape' ? 'contain' : 'contain',
                    backgroundColor: 'black'
                  }}
                  data-testid="video-player"
                />
                {!isPlaying && (
                  <div 
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', paddingBottom: '48px' }}
                  >
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                      <Play className="w-6 h-6 text-white" fill="white" />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <img
                src={fullMediaUrl}
                alt={post.title}
                className="w-full h-full object-contain bg-black"
              />
            )
          ) : (
            <div className="w-full h-full relative">
              <LockedContentOverlay
                thumbnail={mediaUrl}
                tier={post.tier || 'public'}
                isVideo={post.media_type === 'video'}
                onUnlockClick={handleUnlockClick}
                ppvEnabled={post.is_ppv_enabled}
                ppvPrice={post.ppv_price}
                ppvCurrency={post.ppv_currency || 'GHS'}
              />
            </div>
          )}
        </div>

        {/* Content Wrapper - Scrollable area below video */}
        <div className="content-wrapper bg-background scrollbar-hide">
          <div className="px-4 py-4">
            {/* Video Caption with Avatar */}
            <div className="flex items-start gap-3 mb-3">
              <Avatar 
                className="h-9 w-9 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => navigate(`/creator/${post.creator_username || post.creator?.username}`)}
              >
                <AvatarImage 
                  src={post.creator_avatar || post.creator?.avatar || undefined} 
                  alt={post.creator_username || post.creator?.username} 
                />
                <AvatarFallback className="text-sm">
                  {(post.creator_display_name || post.creator?.display_name || post.creator_username || post.creator?.username || 'U').charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 space-y-2">
                <h1 className="text-sm font-medium text-foreground line-clamp-2">
                  {post.content || 'Untitled Post'}
                </h1>
                <div className="flex items-center justify-between text-xs text-muted-foreground w-full">
                  <span 
                    className="truncate mr-2 cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => navigate(`/creator/${post.creator_username || post.creator?.username}`)}
                  >
                    {post.creator_display_name || post.creator?.display_name || post.creator_username || post.creator?.username}
                  </span>
                  <div className="flex items-center gap-1 flex-shrink-0 text-right">
                    <span>{post.views_count ? (post.views_count >= 1000 ? `${(post.views_count / 1000).toFixed(1)}K` : post.views_count) : '0'} views</span>
                    <span>•</span>
                    <span>{getTimeAgo(post.posted || post.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="flex items-center justify-between mb-6 px-2 overflow-hidden">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex items-center gap-1 h-auto py-2 px-2 ${liked ? 'text-red-500' : 'text-muted-foreground'}`}
                  onClick={handleLike}
                  disabled={!hasAccess}
                  data-testid="button-like"
                >
                  <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                  <span className="text-sm">{post.likes_count || 0}</span>
                </Button>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-1 h-auto py-2 px-2 text-muted-foreground"
                  disabled={!hasAccess}
                  data-testid="button-comment"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm">{post.comments_count || 0}</span>
                </Button>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-1 h-auto py-2 px-2 text-muted-foreground" 
                  onClick={handleShare}
                  disabled={!hasAccess}
                  data-testid="button-share"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm">Share</span>
                </Button>
              </div>

              {/* Creator Edit/Delete Actions */}
              {user && post.creator_id === user.id && (
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center gap-1 h-auto py-2 px-2 text-muted-foreground hover:text-foreground"
                    onClick={() => navigate(`/creator/edit-post/${post.id}`)}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z"/>
                    </svg>
                    <span className="text-xs">Edit</span>
                  </Button>

                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center gap-1 h-auto py-2 px-2 text-red-500 hover:text-red-600"
                    onClick={async () => {
                      if (window.confirm('Are you sure you want to delete this post?')) {
                        try {
                          const response = await fetch(`/api/posts/${post.id}`, {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json' }
                          });

                          if (response.ok) {
                            toast({
                              title: "Success",
                              description: "Post deleted successfully"
                            });
                            navigate('/creator/dashboard');
                          } else {
                            throw new Error('Failed to delete post');
                          }
                        } catch (error) {
                          toast({
                            title: "Error",
                            description: "Failed to delete post",
                            variant: "destructive"
                          });
                        }
                      }
                    }}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 0 0 1-2-2V6h14Z"/>
                      <line x1="10" x2="10" y1="11" y2="17"/>
                      <line x1="14" x2="14" y1="11" y2="17"/>
                    </svg>
                    <span className="text-xs">Delete</span>
                  </Button>
                </div>
              )}
            </div>



            {/* Comments Container - YouTube Style */}
            {hasAccess ? (
              <div 
                className="bg-background border border-border rounded-lg p-4 mb-6 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setShowCommentsSheet(true)}
                data-testid="container-comments"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-semibold">Comments</h3>
                    <span className="text-sm text-muted-foreground">{post.comments_count || 379}</span>
                  </div>
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                </div>

                <div className="flex items-center gap-3 mt-3">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user?.avatar || undefined} alt={user?.username} />
                    <AvatarFallback className="text-xs">{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 bg-muted/50 rounded-full px-4 py-2">
                    <span className="text-sm text-muted-foreground">Add a comment...</span>
                  </div>
                </div>
              </div>
            ) : (
              <div 
                className="bg-background border border-border rounded-lg p-4 mb-6 opacity-50 cursor-not-allowed"
                data-testid="container-comments-locked"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-semibold">Comments</h3>
                    <span className="text-sm text-muted-foreground">{post.comments_count || 0}</span>
                  </div>
                  <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Subscribe to view and add comments
                </p>
              </div>
            )}

            {/* Next Videos Section - Edge-to-Edge */}
            <div className="space-y-0 -mx-4">
              <h3 className="text-lg font-semibold mb-4 px-4 text-foreground">Up next</h3>
              <div className="space-y-0">
                {nextVideos.map((video) => {
                  const videoMediaUrl = Array.isArray(video.media_urls) ? video.media_urls[0] : video.media_urls;
                  const videoFullUrl = videoMediaUrl?.startsWith('http') ? videoMediaUrl : `/uploads/${videoMediaUrl}`;
                  const thumbnailUrl = videoMediaUrl?.includes('cloudinary.com/') 
                    ? videoMediaUrl.replace('/upload/', '/upload/so_0,w_640,h_360,c_fill,f_jpg/').replace('.mp4', '.jpg')
                    : videoFullUrl;

                  const videoHasAccess = video.hasAccess !== false;

                  return (
                    <div 
                      key={video.id} 
                      className="cursor-pointer hover:bg-muted/50 transition-colors border-b border-border/20 last:border-b-0"
                      onClick={() => handleVideoCardClick(video.id)}
                    >
                      <div className="py-3">
                        <div className="relative w-full aspect-video bg-black overflow-hidden mb-3 rounded-lg">
                          {videoHasAccess ? (
                            <>
                              <img
                                src={thumbnailUrl}
                                alt={video.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = `https://placehold.co/640x360/1f2937/FFFFFF?text=Video+${video.id}`;
                                }}
                              />
                              {video.duration && (
                                <div className="absolute bottom-1 right-1 bg-black text-white text-xs px-1 rounded">
                                  {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                                </div>
                              )}
                            </>
                          ) : (
                            <>
                              <LockedContentOverlay
                                thumbnail={thumbnailUrl}
                                tier={video.tier || 'public'}
                                isVideo={true}
                                showButton={false}
                                onUnlockClick={async (e) => {
                                  e.stopPropagation();
                                  if (!user) {
                                    window.location.href = `/login?redirect=/video/${video.id}`;
                                  } else {
                                    try {
                                      const [userResponse, tiersResponse] = await Promise.all([
                                        fetch(`/api/users/${video.creator_id}`),
                                        fetch(`/api/creators/${video.creator_id}/tiers`)
                                      ]);

                                      const creatorData = userResponse.ok ? await userResponse.json() : null;
                                      const tiersData = tiersResponse.ok ? await tiersResponse.json() : [];

                                      if (creatorData) {
                                        setSelectedCreatorForSubscription({
                                          id: creatorData.id,
                                          username: creatorData.username,
                                          display_name: creatorData.display_name || creatorData.username,
                                          avatar: creatorData.avatar || '',
                                          tiers: tiersData
                                        });
                                        setSubscriptionTierModalOpen(true);
                                      }
                                    } catch (error) {
                                      console.error('Error fetching creator data:', error);
                                    }
                                  }
                                }}
                                ppvEnabled={video.is_ppv_enabled}
                                ppvPrice={video.ppv_price}
                                ppvCurrency={video.ppv_currency || 'GHS'}
                              />
                            </>
                          )}
                        </div>

                        <div className="flex gap-3 px-4">
                          <Avatar className="h-9 w-9 flex-shrink-0">
                            <AvatarImage src={video.creator_avatar || video.avatar} alt={video.creator_username || video.username} />
                            <AvatarFallback className="text-sm">{(video.creator_display_name || video.creator_username || video.display_name || video.username || 'U').charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-light text-foreground line-clamp-2 mb-1 leading-tight">
                              {video.title || video.content}
                            </h4>
                            <div className="flex items-center justify-between text-xs text-muted-foreground w-full">
                              <span className="truncate mr-2">{video.creator_display_name || video.creator_username}</span>
                              <div className="flex items-center gap-1 flex-shrink-0 text-right">
                                <span>{video.views_count ? (video.views_count >= 1000 ? `${(video.views_count / 1000).toFixed(1)}K` : video.views_count) : '0'} views</span>
                                <span>•</span>
                                <span>{getTimeAgo(video.created_at)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Comments Bottom Sheet - Mobile Only */}
        {hasAccess && (
          <Sheet open={showCommentsSheet} onOpenChange={setShowCommentsSheet}>
            <SheetContent 
              side="bottom" 
              className="p-0 border-t-4 border-border/30 rounded-t-xl bg-background flex flex-col touch-pan-y"
              style={{
                height: '85vh',
                maxHeight: '85vh',
                minHeight: '40vh'
              }}
            >

              <div className="flex-1 overflow-hidden">
                <CommentSection
                  postId={post.id.toString()}
                  initialComments={[]}
                  onCommentCountChange={(count) => setPost((prev: any) => ({ ...prev, comments_count: count }))}
                  isBottomSheet={true}
                />
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex min-h-screen bg-background justify-center">
        <div className="w-full max-w-8xl px-6">
          <div className="flex gap-6 py-6 justify-center">
            {/* Main Content */}
            <div className="flex-1 max-w-6xl">
              {/* Back Button */}
              <Button
                variant="ghost"
                size="sm"
                className="mb-4 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  // Check if we came from a creator profile by looking at the post's creator
                  if (post && post.creator_username) {
                    navigate(`/creator/${post.creator_username}`);
                  } else if (user?.role === 'creator') {
                    navigate(`/creator/${user.username}`);
                  } else {
                    navigate('/fan/feed');
                  }
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Feed
              </Button>

              {/* Video Player or Locked State */}
              <div className="bg-black rounded-lg overflow-hidden mb-4">
                {hasAccess ? (
                  post.media_type === 'video' ? (
                    <div className="relative w-full aspect-video" onClick={handleVideoClick}>
                      <video
                        src={fullMediaUrl}
                        poster={
                          mediaUrl?.includes('cloudinary.com/') 
                            ? mediaUrl.replace('/upload/', '/upload/so_0,w_1920,h_1080,c_fill,f_jpg/').replace('.mp4', '.jpg')
                            : undefined
                        }
                        className="w-full aspect-video"
                        controls
                        playsInline
                        onLoadedMetadata={handleVideoLoad}
                        onPlay={handlePlay}
                        onPause={handlePause}
                        style={{
                          objectFit: 'contain',
                          backgroundColor: 'black'
                        }}
                        data-testid="video-player"
                      />
                      {!isPlaying && (
                        <div 
                          className="absolute inset-0 flex items-center justify-center pointer-events-none"
                          style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', paddingBottom: '48px' }}
                        >
                          <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                            <Play className="w-8 h-8 text-white" fill="white" />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <img
                      src={fullMediaUrl}
                      alt={post.title}
                      className="w-full aspect-video object-contain bg-black"
                    />
                  )
                ) : (
                  <div className="w-full aspect-video relative">
                    <LockedContentOverlay
                      thumbnail={mediaUrl}
                      tier={post.tier || 'public'}
                      isVideo={post.media_type === 'video'}
                      onUnlockClick={handleUnlockClick}
                      ppvEnabled={post.is_ppv_enabled}
                      ppvPrice={post.ppv_price}
                      ppvCurrency={post.ppv_currency || 'GHS'}
                    />
                  </div>
                )}
              </div>

              {/* Video Caption with Avatar */}
              <div className="flex items-start gap-3 mb-4">
                <Avatar 
                  className="h-9 w-9 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => navigate(`/creator/${post.creator_username || post.creator?.username}`)}
                >
                  <AvatarImage 
                    src={post.creator_avatar || post.creator?.avatar || undefined} 
                    alt={post.creator_username || post.creator?.username} 
                  />
                  <AvatarFallback className="text-sm">
                    {(post.creator_display_name || post.creator?.display_name || post.creator_username || post.creator?.username || 'U').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h1 className="text-sm font-medium text-foreground line-clamp-2 mb-1">
                    {post.content}
                  </h1>
                  <div className="flex items-center justify-between text-xs text-muted-foreground w-full">
                    <span 
                      className="truncate mr-2 cursor-pointer hover:text-foreground transition-colors"
                      onClick={() => navigate(`/creator/${post.creator_username || post.creator?.username}`)}
                    >
                      {post.creator_display_name || post.creator?.display_name || post.creator_username || post.creator?.username}
                    </span>
                    <div className="flex items-center gap-1 flex-shrink-0 text-right">
                      <span>{post.views_count ? (post.views_count >= 1000 ? `${(post.views_count / 1000).toFixed(1)}K` : post.views_count) : '0'} views</span>
                      <span>•</span>
                      <span>{getTimeAgo(post.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border overflow-hidden">
                <div className="flex items-center gap-6 flex-1 min-w-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`flex items-center gap-2 h-auto py-2 px-3 ${liked ? 'text-red-500' : 'text-muted-foreground'}`}
                    onClick={handleLike}
                    disabled={!hasAccess}
                    data-testid="button-like"
                  >
                    <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                    <span className="text-sm">{post.likes_count || 0}</span>
                  </Button>

                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center gap-2 h-auto py-2 px-3 text-muted-foreground"
                    disabled={!hasAccess}
                    data-testid="button-comment"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span className="text-sm">{post.comments_count || 0}</span>
                  </Button>

                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center gap-2 h-auto py-2 px-3 text-muted-foreground" 
                    onClick={handleShare}
                    disabled={!hasAccess}
                    data-testid="button-share"
                  >
                    <Share2 className="w-5 h-5" />
                    <span className="text-sm">Share</span>
                  </Button>
                </div>

                {/* Creator Edit/Delete Actions - Desktop */}
                {user && post.creator_id === user.id && (
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center gap-2 h-auto py-2 px-3 text-muted-foreground hover:text-foreground"
                      onClick={() => navigate(`/creator/edit-post/${post.id}`)}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z"/>
                      </svg>
                      <span className="text-sm">Edit</span>
                    </Button>

                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center gap-2 h-auto py-2 px-3 text-red-500 hover:text-red-600"
                      onClick={async () => {
                        if (window.confirm('Are you sure you want to delete this post?')) {
                          try {
                            const response = await fetch(`/api/posts/${post.id}`, {
                              method: 'DELETE',
                              headers: { 'Content-Type': 'application/json' }
                            });

                            if (response.ok) {
                              toast({
                                title: "Success",
                                description: "Post deleted successfully"
                              });
                              navigate('/creator/dashboard');
                            } else {
                              throw new Error('Failed to delete post');
                            }
                          } catch (error) {
                            toast({
                              title: "Error",
                              description: "Failed to delete post",
                              variant: "destructive"
                            });
                          }
                        }
                      }}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 0 0 1-2-2V6h14Z"/>
                        <line x1="10" x2="10" y1="11" y2="17"/>
                        <line x1="14" x2="14" y1="11" y2="17"/>
                      </svg>
                      <span className="text-sm">Delete</span>
                    </Button>
                  </div>
                )}
              </div>

              {/* Comments Section - Desktop */}
              {hasAccess ? (
                <CommentSection
                  postId={post.id.toString()}
                  initialComments={[]}
                  onCommentCountChange={(count) => setPost((prev: any) => ({ ...prev, comments_count: count }))}
                  isBottomSheet={false}
                />
              ) : (
                <div className="bg-background border border-border rounded-lg p-6 text-center opacity-50">
                  <svg className="w-8 h-8 text-muted-foreground mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <h3 className="text-base font-semibold mb-2">Comments Locked</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Subscribe to view and add comments
                  </p>
                  <Button 
                    onClick={handleSubscribeClick}
                    data-testid="button-subscribe-comments"
                  >
                    Subscribe to Unlock
                  </Button>
                </div>
              )}
            </div>

            {/* Sidebar - Next Videos */}
            <div className="w-70 space-y-0">
              <h3 className="text-lg font-semibold mb-4 px-2">Up next</h3>
              <div className="space-y-0 border border-border rounded-lg overflow-hidden">
                {nextVideos.map((video, index) => {
                  const videoMediaUrl = Array.isArray(video.media_urls) ? video.media_urls[0] : video.media_urls;
                  const videoFullUrl = videoMediaUrl?.startsWith('http') ? videoMediaUrl : `/uploads/${videoMediaUrl}`;
                  const thumbnailUrl = videoMediaUrl?.includes('cloudinary.com/') 
                    ? videoMediaUrl.replace('/upload/', '/upload/so_0,w_640,h_360,c_fill,f_jpg/').replace('.mp4', '.jpg')
                    : videoFullUrl;

                  const videoHasAccess = video.hasAccess !== false;

                  return (
                    <div 
                      key={`${video.id}-${index}`} 
                      className={`cursor-pointer hover:bg-muted/50 transition-colors ${index !== nextVideos.length - 1 ? 'border-b border-border' : ''}`}
                      onClick={() => handleVideoCardClick(video.id)}
                    >
                      <div className="p-3">
                        <div className="relative w-full aspect-video bg-black overflow-hidden mb-2 md:rounded-lg">
                          {videoHasAccess ? (
                            <>
                              <img
                                src={thumbnailUrl}
                                alt={video.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = `https://placehold.co/640x360/1f2937/FFFFFF?text=Video+${video.id}`;
                                }}
                              />
                              {video.duration && (
                                <div className="absolute bottom-1 right-1 bg-black text-white text-xs px-1 rounded">
                                  {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                                </div>
                              )}
                            </>
                          ) : (
                            <>
                              <LockedContentOverlay
                                thumbnail={thumbnailUrl}
                                tier={video.tier || 'public'}
                                isVideo={true}
                                showButton={false}
                                onUnlockClick={async (e) => {
                                  e.stopPropagation();
                                  if (!user) {
                                    window.location.href = `/login?redirect=/video/${video.id}`;
                                  } else {
                                    try {
                                      const [userResponse, tiersResponse] = await Promise.all([
                                        fetch(`/api/users/${video.creator_id}`),
                                        fetch(`/api/creators/${video.creator_id}/tiers`)
                                      ]);

                                      const creatorData = userResponse.ok ? await userResponse.json() : null;
                                      const tiersData = tiersResponse.ok ? await tiersResponse.json() : [];

                                    if (creatorData) {
                                      setSelectedCreatorForSubscription({
                                        id: creatorData.id,
                                        username: creatorData.username,
                                        display_name: creatorData.display_name || creatorData.username,
                                        avatar: creatorData.avatar || '',
                                        tiers: tiersData
                                      });
                                      setSubscriptionTierModalOpen(true);
                                    }
                                  } catch (error) {
                                    console.error('Error fetching creator data:', error);
                                  }
                                }
                              }}
                                ppvEnabled={video.is_ppv_enabled}
                                ppvPrice={video.ppv_price}
                                ppvCurrency={video.ppv_currency || 'GHS'}
                              />
                            </>
                          )}
                        </div>

                        <div className="flex gap-3">
                          <Avatar className="h-9 w-9 flex-shrink-0">
                            <AvatarImage src={video.creator_avatar || video.avatar} alt={video.creator_username || video.username} />
                            <AvatarFallback className="text-sm">{(video.creator_display_name || video.creator_username || video.display_name || video.username || 'U').charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-foreground line-clamp-2 mb-1" style={{ fontSize: '14px', fontWeight: 500 }}>
                              {video.title || video.content}
                            </h3>
                            <div className="flex items-center justify-between text-xs text-muted-foreground w-full">
                              <span className="truncate mr-2">{video.creator_display_name || video.creator_username}</span>
                              <div className="flex items-center gap-1 flex-shrink-0 text-right">
                                <span>{video.views_count ? (video.views_count >= 1000 ? `${Math.floor(video.views_count / 1000)}K` : video.views_count) : '0'} views</span>
                                <span>•</span>
                                <span>{getTimeAgo(video.created_at)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Tier Modal */}
      {selectedCreatorForSubscription && (
        <SubscriptionTierModal
          isOpen={subscriptionTierModalOpen}
          onClose={() => {
            setSubscriptionTierModalOpen(false);
            setSelectedCreatorForSubscription(null);
          }}
          creator={selectedCreatorForSubscription}
          tiers={selectedCreatorForSubscription.tiers}
          onTierSelect={(tier) => {
            setSelectedTier(tier);
            setSubscriptionTierModalOpen(false);
            setPaymentModalOpen(true);
          }}
          userIsLoggedIn={!!user}
        />
      )}

      {/* Payment Modal */}
      {selectedTier && selectedCreatorForSubscription && (
        <PaymentModal
          isOpen={paymentModalOpen}
          onClose={() => {
            setPaymentModalOpen(false);
            setSelectedTier(null);
          }}
          tier={selectedTier}
          creatorName={selectedCreatorForSubscription.display_name || selectedCreatorForSubscription.username}
        />
      )}

      {/* Unlock Options Modal */}
      {post && user && post.is_ppv_enabled && (
        <UnlockOptionsModal
          isOpen={unlockOptionsModalOpen}
          onClose={() => setUnlockOptionsModalOpen(false)}
          post={post}
          onSubscribeClick={handleSubscribeSelection}
          onPPVClick={handlePPVSelection}
        />
      )}

      {/* PPV Payment Modal */}
      {post && user && (
        <PPVPaymentModal
          isOpen={ppvPaymentModalOpen}
          onClose={() => setPPVPaymentModalOpen(false)}
          post={post}
          userId={user.id}
          onSuccess={handlePPVSuccess}
        />
      )}
    </div>
  );
};