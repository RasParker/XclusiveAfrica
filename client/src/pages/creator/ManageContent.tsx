import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

import { ContentCard } from '@/components/creator/ContentCard';
import { QuickEditModal } from '@/components/creator/QuickEditModal';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Heart,
  MessageCircle,
  Share,
  Image,
  Video
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface ContentItem {
  id: string;
  caption: string;
  type: 'Image' | 'Video' | 'Text';
  tier: string;
  status: 'Published' | 'Scheduled' | 'Draft';
  date: string;
  views: number;
  likes: number;
  comments: number;
  mediaPreview?: string;
  category: string;
  scheduledFor?: string;
  ppv_sales_count?: number;
  rawPost?: any;
}

export const ManageContent: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingContent, setViewingContent] = useState<ContentItem | null>(null);
  const [expandedModalCaption, setExpandedModalCaption] = useState(false);
  const [activeTab, setActiveTab] = useState('published');
  const [quickEditPost, setQuickEditPost] = useState<any | null>(null);

  const fetchContent = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/posts?creatorId=${user.id}&includeAll=true`);
      if (response.ok) {
        const allPosts = await response.json();

          // Transform posts to match our interface (posts already filtered by creator on server)
          const userPosts = allPosts
            .map((post: any) => {
              // Handle both string and array formats for media_urls
              let mediaPreview = null;
              if (post.media_urls) {
                const mediaUrls = Array.isArray(post.media_urls) ? post.media_urls : [post.media_urls];
                
                // For videos, find the actual video file (not the thumbnail)
                if (post.media_type === 'video') {
                  // Look for the first URL that has a video extension
                  const videoUrl = mediaUrls.find((url: string) => {
                    return url && url.match(/\.(mp4|mov|webm|avi)(\?|$)/i);
                  });
                  
                  if (videoUrl) {
                    const mediaUrl = String(videoUrl).trim();
                    mediaPreview = mediaUrl.startsWith('http://') || mediaUrl.startsWith('https://') || mediaUrl.startsWith('/uploads/') 
                      ? mediaUrl 
                      : `/uploads/${mediaUrl}`;
                  }
                } else {
                  // For images and other content, use the first URL
                  if (mediaUrls.length > 0 && mediaUrls[0]) {
                    const mediaUrl = String(mediaUrls[0]).trim();
                    // Use URL directly if it's already a full URL (http/https) or starts with /uploads/
                    mediaPreview = mediaUrl.startsWith('http://') || mediaUrl.startsWith('https://') || mediaUrl.startsWith('/uploads/') 
                      ? mediaUrl 
                      : `/uploads/${mediaUrl}`;
                  }
                }
              }

              return {
                id: post.id.toString(),
                caption: post.content || post.title,
                type: post.media_type === 'image' ? 'Image' as const :
                      post.media_type === 'video' ? 'Video' as const : 'Text' as const,
                tier: post.is_ppv_enabled ? `PPV (${post.ppv_currency || 'GHS'} ${parseFloat(post.ppv_price || '0').toFixed(2)})` :
                      post.tier === 'public' ? 'Free' : 
                      post.tier.toLowerCase() === 'starter pump' ? 'Starter Pump' :
                      post.tier.toLowerCase() === 'power gains' ? 'Power Gains' :
                      post.tier.toLowerCase() === 'elite beast mode' ? 'Elite Beast Mode' :
                      post.tier.toLowerCase().includes('starter') ? 'Starter Pump' :
                      post.tier.toLowerCase().includes('power') ? 'Power Gains' :
                      post.tier.toLowerCase().includes('elite') ? 'Elite Beast Mode' :
                      post.tier.toLowerCase().includes('beast') ? 'Elite Beast Mode' :
                      post.tier,
                status: post.status === 'draft' ? 'Draft' as const :
                        post.status === 'scheduled' ? 'Scheduled' as const : 'Published' as const,
                date: post.created_at === "CURRENT_TIMESTAMP" ? 
                      new Date().toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      }) :
                      new Date(post.created_at).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      }),
                views: 0, // Will be implemented later
                likes: post.likes_count || 0,
                comments: post.comments_count || 0,
                mediaPreview: mediaPreview,
                category: 'General',
                scheduledFor: post.scheduled_for || null,
                ppv_sales_count: post.ppv_sales_count || 0,
                rawPost: post,
              };
            });

        setContent(userPosts);
        console.log('Fetched user content:', userPosts);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      toast({
        title: "Error",
        description: "Failed to load your content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's posts
  useEffect(() => {
    fetchContent();

    // Listen for new posts
    const handleNewPost = () => {
      fetchContent();
    };

    window.addEventListener('localStorageChange', handleNewPost);
    return () => window.removeEventListener('localStorageChange', handleNewPost);
  }, [user, toast]);

  const publishedContent = content.filter(item => item.status === 'Published');
  const scheduledContent = content.filter(item => item.status === 'Scheduled');
  const draftContent = content.filter(item => item.status === 'Draft');

  const publishedPosts = content.filter(item => item.status === 'Published');
  const scheduledPosts = content.filter(item => item.status === 'Scheduled');
  const draftPosts = content.filter(item => item.status === 'Draft');

  const handleEdit = (contentId: string) => {
    const contentItem = content.find(item => item.id === contentId);
    
    // If content has been purchased, open quick edit modal instead
    if (contentItem && contentItem.ppv_sales_count && contentItem.ppv_sales_count > 0) {
      setQuickEditPost(contentItem.rawPost);
    } else {
      // Navigate to full edit page for unpurchased content
      navigate(`/creator/edit-post/${contentId}`);
    }
  };

  const handleDelete = async (contentId: string) => {
    const contentItem = content.find(item => item.id === contentId);
    
    // Check if content has purchases before attempting delete
    if (contentItem && contentItem.ppv_sales_count && contentItem.ppv_sales_count > 0) {
      toast({
        title: "Cannot delete content",
        description: `This content has been purchased by ${contentItem.ppv_sales_count} ${contentItem.ppv_sales_count === 1 ? 'person' : 'people'} and cannot be deleted.`,
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch(`/api/posts/${contentId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setContent(prev => prev.filter(item => item.id !== contentId));
        toast({
          title: "Content deleted",
          description: "Your content has been deleted successfully.",
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.error || "Failed to delete content. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete content. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePublish = (contentId: string) => {
    setContent(prev => 
      prev.map(item => 
        item.id === contentId 
          ? { ...item, status: 'Published' as const }
          : item
      )
    );
    toast({
      title: "Content published",
      description: "Your content has been published successfully.",
    });
  };

  const handleViewContent = (item: ContentItem) => {
    setViewingContent(item);
  };

  const closeModal = () => {
    setViewingContent(null);
    setExpandedModalCaption(false);
  };

  // Helper function to get the actual video URL from media_urls array
  const getVideoUrl = (item: ContentItem): string | null => {
    if (!item.rawPost?.media_urls) return item.mediaPreview || null;
    
    const mediaUrls = Array.isArray(item.rawPost.media_urls) 
      ? item.rawPost.media_urls 
      : [item.rawPost.media_urls];
    
    // Find the first URL that's actually a video (has video extension)
    const videoUrl = mediaUrls.find((url: string) => {
      return url && url.match(/\.(mp4|mov|webm|avi)(\?|$)/i);
    });
    
    // If we found a video URL, use it; otherwise fall back to checking if first URL is a video
    if (videoUrl) return videoUrl;
    
    // If mediaUrls[0] is a video (not a thumbnail), use it
    if (mediaUrls.length > 0 && mediaUrls[0]) {
      const firstUrl = mediaUrls[0];
      const isVideo = firstUrl.match(/\.(mp4|mov|webm|avi)(\?|$)/i);
      if (isVideo) return firstUrl;
    }
    
    // Fall back to mediaPreview
    return item.mediaPreview || null;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Image':
        return <Image className="w-4 h-4" />;
      case 'Video':
        return <Video className="w-4 h-4" />;
      case 'Text':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Free':
        return 'outline';
      case 'Basic Support':
        return 'secondary';
      case 'Fan Content':
        return 'secondary';
      case 'Premium Content':
        return 'default';
      case 'Superfan Content':
        return 'default';
      default:
        return 'outline';
    }
  };

  const getFilteredContent = () => {
    return content;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 flex items-center gap-2 justify-center sm:justify-start">
            Manage Content
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            View and edit all your published posts
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <Button asChild className="w-full sm:w-auto">
            <Link to="/creator/upload">
              <Plus className="w-4 h-4 mr-2" />
              Create Content
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tab Navigation */}
            <TabsList className="mb-6">
              <TabsTrigger value="published">
                Published
                <span className="ml-2 text-xs opacity-70">
                  {publishedPosts.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="scheduled">
                Scheduled
                <span className="ml-2 text-xs opacity-70">
                  {scheduledPosts.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="drafts">
                Drafts
                <span className="ml-2 text-xs opacity-70">
                  {draftPosts.length}
                </span>
              </TabsTrigger>
            </TabsList>

          <TabsContent value="published" className="space-y-4">
            {publishedContent.length > 0 ? (
              <div className="space-y-3">
                {publishedContent.map((item) => (
                  <ContentCard
                    key={item.id}
                    {...item}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onPublish={handlePublish}
                    onViewContent={handleViewContent}
                  />
                ))}
              </div>
            ) : (
              <Card className="bg-gradient-card border-border/50">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No published content</h3>
                  <p className="text-muted-foreground text-center mb-4">Publish your first post to get started</p>
                  <Button asChild>
                    <Link to="/creator/upload">Create Content</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="scheduled" className="space-y-4">
            {scheduledContent.length > 0 ? (
              <div className="space-y-3">
                {scheduledContent.map((item) => (
                  <ContentCard
                    key={item.id}
                    {...item}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onPublish={handlePublish}
                    onViewContent={handleViewContent}
                  />
                ))}
              </div>
            ) : (
              <Card className="bg-gradient-card border-border/50">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No scheduled content</h3>
                  <p className="text-muted-foreground text-center mb-4">Schedule posts to publish them automatically</p>
                  <Button asChild>
                    <Link to="/creator/upload">Create Content</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="drafts" className="space-y-4">
            {draftContent.length > 0 ? (
              <div className="space-y-3">
                {draftContent.map((item) => (
                  <ContentCard
                    key={item.id}
                    {...item}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onPublish={handlePublish}
                    onViewContent={handleViewContent}
                  />
                ))}
              </div>
            ) : (
              <Card className="bg-gradient-card border-border/50">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No draft content</h3>
                  <p className="text-muted-foreground text-center mb-4">Save drafts to work on them later</p>
                  <Button asChild>
                    <Link to="/creator/upload">Create Content</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
        )}
      </div>

      {/* Instagram-style Content Modal */}
      <Dialog open={!!viewingContent} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="max-w-full max-h-full w-screen h-screen p-0 m-0 overflow-hidden border-0 [&>button]:hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>{viewingContent?.type} Content</DialogTitle>
            <DialogDescription>View content</DialogDescription>
          </DialogHeader>
          {viewingContent && (
            <div className="relative w-screen h-screen bg-black">
              {/* Back Arrow Button */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 left-4 z-50 w-10 h-10 rounded-full text-white hover:bg-white/10"
                onClick={closeModal}
              >
                <ArrowLeft className="w-7 h-7" />
              </Button>

              {/* Content container that fills entire screen */}
              {viewingContent.mediaPreview ? (
                viewingContent.type === 'Video' ? (
                  <video 
                    src={getVideoUrl(viewingContent) || viewingContent.mediaPreview}
                    className="w-full h-full"
                    controls
                    autoPlay
                    muted
                    style={{ objectFit: 'contain' }}
                  />
                ) : (
                  <img 
                    src={viewingContent.mediaPreview}
                    alt={viewingContent.caption}
                    className="w-full h-full"
                    style={{ objectFit: 'contain' }}
                  />
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center px-6 text-white">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                      <FileText className="w-8 h-8" />
                    </div>
                    <h3 className="font-semibold text-xl mb-4">{viewingContent.caption}</h3>
                    <p className="text-sm text-white/70">Text post</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Quick Edit Modal for Purchased Content */}
      {quickEditPost && (
        <QuickEditModal
          open={!!quickEditPost}
          onOpenChange={(open) => !open && setQuickEditPost(null)}
          post={quickEditPost}
          onSuccess={() => {
            setQuickEditPost(null);
            // Refetch content to show updated data
            fetchContent();
          }}
        />
      )}
    </div>
  );
};