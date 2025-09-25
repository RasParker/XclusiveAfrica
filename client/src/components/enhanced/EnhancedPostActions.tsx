import React, { useState, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';

// UI Components
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Icons
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Edit, 
  Trash2,
  MoreHorizontal,
  Bookmark,
  Flag,
  Link,
  Twitter,
  Facebook,
  Copy,
  Download,
  Eye,
  TrendingUp,
  Clock
} from "lucide-react";

interface EnhancedPostActionsProps {
  post: {
    id: string;
    likes_count: number;
    comments_count: number;
    views_count?: number;
    created_at?: string;
    content?: string;
    media_urls?: string[];
    creator?: {
      username: string;
      display_name?: string;
    };
  };
  postLikes: Record<string, { liked: boolean; count: number }>;
  isOwnProfile: boolean;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  onBookmark?: (postId: string) => void;
  onReport?: (postId: string) => void;
  showStats?: boolean;
  compact?: boolean;
}

export const EnhancedPostActions: React.FC<EnhancedPostActionsProps> = ({
  post,
  postLikes,
  isOwnProfile,
  onLike,
  onComment,
  onShare,
  onEdit,
  onDelete,
  onBookmark,
  onReport,
  showStats = false,
  compact = false
}) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  const isLiked = postLikes[post.id]?.liked;
  const likeCount = postLikes[post.id]?.count || post.likes_count || 0;
  
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLiked) {
      onLike(post.id);
      // Add heart animation effect
      const heart = document.createElement('div');
      heart.innerHTML = '❤️';
      heart.style.cssText = `
        position: fixed;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        font-size: 2rem;
        pointer-events: none;
        z-index: 1000;
        animation: heartFloat 1.5s ease-out forwards;
      `;
      document.body.appendChild(heart);
      setTimeout(() => document.body.removeChild(heart), 1500);
    }
  };

  const handleQuickBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    onBookmark?.(post.id);
    toast({
      title: isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
      duration: 2000,
    });
  };

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const url = `${window.location.origin}/post/${post.id}`;
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied to clipboard",
        duration: 2000,
      });
      setIsShareMenuOpen(false);
    } catch (error) {
      toast({
        title: "Failed to copy link",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const handleSocialShare = (platform: 'twitter' | 'facebook') => (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/post/${post.id}`;
    const text = post.content ? `${post.content.substring(0, 100)}...` : `Check out this post from ${post.creator?.display_name || post.creator?.username}`;
    
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
    setIsShareMenuOpen(false);
  };

  // Mobile: Compact bottom row with essential actions
  if (isMobile || compact) {
    return (
      <div 
        className="flex items-center justify-between mt-2 px-2"
        onDoubleClick={handleDoubleClick}
      >
        <div className="flex items-center gap-4">
          {/* Like button */}
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center gap-1.5 h-auto py-2 px-2 transition-colors duration-200 ${
              isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-red-500'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onLike(post.id);
            }}
            data-testid={`button-like-${post.id}`}
          >
            <Heart className={`w-5 h-5 transition-all duration-200 ${isLiked ? 'fill-current scale-110' : 'hover:scale-110'}`} />
            <span className="text-sm font-medium">{likeCount}</span>
          </Button>

          {/* Comment button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1.5 h-auto py-2 px-2 text-muted-foreground hover:text-blue-500 transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation();
              onComment(post.id);
            }}
            data-testid={`button-comment-${post.id}`}
          >
            <MessageSquare className="w-5 h-5 hover:scale-110 transition-transform duration-200" />
            <span className="text-sm font-medium">{post.comments_count || 0}</span>
          </Button>

          {/* Quick bookmark for mobile */}
          <Button
            variant="ghost"
            size="sm"
            className={`h-auto py-2 px-2 transition-colors duration-200 ${
              isBookmarked ? 'text-amber-500' : 'text-muted-foreground hover:text-amber-500'
            }`}
            onClick={handleQuickBookmark}
            data-testid={`button-bookmark-${post.id}`}
          >
            <Bookmark className={`w-5 h-5 transition-all duration-200 ${isBookmarked ? 'fill-current' : ''}`} />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Stats */}
          {showStats && post.views_count && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Eye className="w-3 h-3" />
              <span>{post.views_count}</span>
            </div>
          )}

          {/* More actions menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto py-2 px-2 text-muted-foreground hover:text-foreground"
                data-testid={`button-more-${post.id}`}
              >
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onShare(post.id); }}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopyLink}>
                <Link className="w-4 h-4 mr-2" />
                Copy Link
              </DropdownMenuItem>
              {!isOwnProfile && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={(e) => { e.stopPropagation(); onReport?.(post.id); }}
                    className="text-red-600"
                  >
                    <Flag className="w-4 h-4 mr-2" />
                    Report
                  </DropdownMenuItem>
                </>
              )}
              {isOwnProfile && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit?.(post.id); }}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={(e) => { e.stopPropagation(); onDelete?.(post.id); }}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }

  // Desktop: Enhanced actions with hover effects and popover
  return (
    <TooltipProvider>
      <div 
        className="flex items-center justify-between mt-3 px-2 group"
        onDoubleClick={handleDoubleClick}
        onMouseEnter={() => setShowQuickActions(true)}
        onMouseLeave={() => setShowQuickActions(false)}
      >
        <div className="flex items-center gap-6">
          {/* Enhanced Like button with tooltip */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center gap-2 h-auto py-2 px-3 transition-all duration-200 ${
                  isLiked 
                    ? 'text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20' 
                    : 'text-muted-foreground hover:text-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/10'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onLike(post.id);
                }}
                data-testid={`button-like-${post.id}`}
              >
                <Heart className={`w-5 h-5 transition-all duration-200 ${
                  isLiked ? 'fill-current scale-110' : 'hover:scale-110'
                }`} />
                <span className="text-sm font-medium">{likeCount}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>{isLiked ? 'Unlike' : 'Like'}</p>
            </TooltipContent>
          </Tooltip>

          {/* Enhanced Comment button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-2 h-auto py-2 px-3 text-muted-foreground hover:text-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/10 transition-all duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  onComment(post.id);
                }}
                data-testid={`button-comment-${post.id}`}
              >
                <MessageSquare className="w-5 h-5 hover:scale-110 transition-transform duration-200" />
                <span className="text-sm font-medium">{post.comments_count || 0}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Comment</p>
            </TooltipContent>
          </Tooltip>

          {/* Enhanced Share with popover */}
          <Popover open={isShareMenuOpen} onOpenChange={setIsShareMenuOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 h-auto py-2 px-3 text-muted-foreground hover:text-green-500 hover:bg-green-50/50 dark:hover:bg-green-950/10 transition-all duration-200"
                onClick={(e) => e.stopPropagation()}
                data-testid={`button-share-${post.id}`}
              >
                <Share2 className="w-5 h-5 hover:scale-110 transition-transform duration-200" />
                <span className="text-sm font-medium">Share</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2" onClick={(e) => e.stopPropagation()}>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2"
                  onClick={handleCopyLink}
                >
                  <Copy className="w-4 h-4" />
                  Copy Link
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2"
                  onClick={handleSocialShare('twitter')}
                >
                  <Twitter className="w-4 h-4" />
                  Share on Twitter
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2"
                  onClick={handleSocialShare('facebook')}
                >
                  <Facebook className="w-4 h-4" />
                  Share on Facebook
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Bookmark button (appears on hover or always for bookmarked) */}
          <div className={`transition-all duration-200 ${showQuickActions || isBookmarked ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none'}`}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-auto py-2 px-3 transition-all duration-200 ${
                    isBookmarked 
                      ? 'text-amber-500 hover:text-amber-600' 
                      : 'text-muted-foreground hover:text-amber-500'
                  }`}
                  onClick={handleQuickBookmark}
                  data-testid={`button-bookmark-${post.id}`}
                >
                  <Bookmark className={`w-5 h-5 transition-all duration-200 ${isBookmarked ? 'fill-current' : ''}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>{isBookmarked ? 'Remove from bookmarks' : 'Bookmark'}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Right side: Stats and actions */}
        <div className="flex items-center gap-3">
          {/* Enhanced stats (appear on hover) */}
          {showStats && (
            <div className={`flex items-center gap-4 text-xs text-muted-foreground transition-all duration-200 ${
              showQuickActions ? 'opacity-100' : 'opacity-70'
            }`}>
              {post.views_count && (
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{post.views_count}</span>
                </div>
              )}
              {post.created_at && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          )}

          {/* Action buttons for own posts */}
          {isOwnProfile && (
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 h-auto py-2 px-3 text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.(post.id);
                    }}
                    data-testid={`button-edit-${post.id}`}
                  >
                    <Edit className="w-4 h-4" />
                    <span className="text-sm">Edit</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Edit post</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 h-auto py-2 px-3 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete?.(post.id);
                    }}
                    data-testid={`button-delete-${post.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-sm">Delete</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Delete post</p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}

          {/* Report button for others' posts (appears on hover) */}
          {!isOwnProfile && (
            <div className={`transition-all duration-200 ${showQuickActions ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'}`}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto py-2 px-2 text-muted-foreground hover:text-red-500 transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      onReport?.(post.id);
                    }}
                    data-testid={`button-report-${post.id}`}
                  >
                    <Flag className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Report content</p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes heartFloat {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          50% {
            opacity: 1;
            transform: translateY(-20px) scale(1.2);
          }
          100% {
            opacity: 0;
            transform: translateY(-40px) scale(0.8);
          }
        }
      `}</style>
    </TooltipProvider>
  );
};