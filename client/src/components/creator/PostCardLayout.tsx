import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageSquare, Share2, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  return (
    <div>
      <div className="p-3 pb-2">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground line-clamp-2 leading-tight">
            {post.content || post.title || 'Untitled Post'}
          </h4>

          </div>
      </div>
    </div>
  );
};