import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageSquare, Share2, Edit, Trash2 } from 'lucide-react';

interface PostCardLayoutProps {
  post: any;
  creator: any;
  postLikes: Record<string, { liked: boolean; count: number }>;
  isOwnProfile: boolean;
  getImageUrl: (url: string | null | undefined) => string | undefined;
  getTimeAgo: (date: string) => string;
  handleLike: (postId: string) => void;
  handleCommentClick: (postId: string) => void;
  handleShare: (postId: string) => void;
  handleEditPost: (postId: string) => void;
  handleDeletePost: (postId: string) => void;
}

export const PostCardLayout: React.FC<PostCardLayoutProps> = ({
  post,
  creator,
  postLikes,
  isOwnProfile,
  getImageUrl,
  getTimeAgo,
  handleLike,
  handleCommentClick,
  handleShare,
  handleEditPost,
  handleDeletePost,
}) => {
  return (
    <div className="p-3">
      <div className="flex gap-3">
        <Avatar className="h-12 w-12 flex-shrink-0 ring-2 ring-transparent hover:ring-primary/20 transition-all duration-200">
          <AvatarImage src={getImageUrl(creator.avatar)} alt={creator.username} />
          <AvatarFallback className="text-sm bg-muted text-muted-foreground">
            {(creator?.display_name || creator?.username || 'U').charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0 space-y-2">
          <h4 className="text-lg font-semibold text-foreground line-clamp-2 leading-tight">
            {post.content || post.title || 'Untitled Post'}
          </h4>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="truncate">{creator.display_name}</span>
            <div className="flex items-center gap-1 flex-shrink-0">
              <span>{(post.likes_count || post.views || 0).toLocaleString()} views</span>
              <span>•</span>
              <span>{getTimeAgo(post.created_at || post.createdAt)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/30">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`flex items-center gap-1 h-auto py-2 px-2 ${postLikes[post.id]?.liked ? 'text-red-500' : 'text-muted-foreground'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(post.id);
                }}
                data-testid={`button-like-${post.id}`}
              >
                <Heart className={`w-4 h-4 ${postLikes[post.id]?.liked ? 'fill-current' : ''}`} />
                <span className="text-sm">{postLikes[post.id]?.count || post.likes_count || 0}</span>
              </Button>

              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-1 h-auto py-2 px-2 text-muted-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCommentClick(post.id);
                }}
                data-testid={`button-comment-${post.id}`}
              >
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm">{post.comments_count || 0}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 h-auto py-2 px-2 text-muted-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare(post.id);
                }}
                data-testid={`button-share-${post.id}`}
              >
                <Share2 className="w-4 h-4" />
                <span className="text-sm">Share</span>
              </Button>
            </div>

            {isOwnProfile && (
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-blue-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditPost(post.id);
                  }}
                  data-testid={`button-edit-${post.id}`}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePost(post.id);
                  }}
                  data-testid={`button-delete-${post.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};