import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Heart, UserPlus, UserCheck } from 'lucide-react';
import { BioDisplay } from '@/lib/text-utils';
import { OnlineStatusIndicator } from '@/components/OnlineStatusIndicator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface CreatorCardProps {
  creator: {
    id: string;
    username: string;
    display_name?: string;
    avatar?: string;
    bio?: string;
    verified?: boolean;
    total_subscribers?: number;
    total_followers?: number;
  };
}

export const CreatorCard: React.FC<CreatorCardProps> = ({ creator }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [likeCount, setLikeCount] = useState<number>(0);
  const [followerCount, setFollowerCount] = useState<number>(creator.total_followers || 0);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [isFollowLoading, setIsFollowLoading] = useState<boolean>(false);

  // Function to fetch creator like count
  const fetchCreatorLikeCount = async (creatorId: string) => {
    try {
      const response = await fetch(`/api/creators/${creatorId}/likes-count`);
      if (response.ok) {
        const data = await response.json();
        setLikeCount(data.count || 0);
      }
    } catch (error) {
      console.error('Error fetching creator like count:', error);
    }
  };

  // Function to fetch creator follower count
  const fetchCreatorFollowerCount = async (creatorId: string) => {
    try {
      const response = await fetch(`/api/creators/${creatorId}/followers-count`);
      if (response.ok) {
        const data = await response.json();
        setFollowerCount(data.count || 0);
      }
    } catch (error) {
      console.error('Error fetching creator follower count:', error);
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

  // Fetch data when component mounts
  useEffect(() => {
    if (creator.id) {
      fetchCreatorLikeCount(creator.id);
      fetchCreatorFollowerCount(creator.id);
      
      if (user && user.id !== parseInt(creator.id)) {
        checkFollowStatus(creator.id, user.id);
      }
    }
  }, [creator.id, user]);

  return (
    <Card className="bg-gradient-card border-border/50 hover:border-primary/50 transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="relative">
            <Avatar className="w-12 h-12">
              <AvatarImage
                src={creator.avatar ? (creator.avatar.startsWith('/uploads/') ? creator.avatar : `/uploads/${creator.avatar}`) : undefined}
                alt={creator.username}
              />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {(creator.display_name || creator.username).charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {/* Online status dot - positioned absolutely on avatar border */}
            <OnlineStatusIndicator userId={parseInt(creator.id)} dotOnly={true} size="xs" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm truncate">
                {creator.display_name || creator.username}
              </h3>
              {creator.verified && (
                <Badge variant="secondary" className="text-xs">
                  Verified
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">@{creator.username}</p>
            {creator.bio && (
              <div className="mt-1">
                <BioDisplay
                  bio={creator.bio}
                  context="card"
                  className="text-xs text-muted-foreground line-clamp-2 leading-tight max-h-[2.2em] overflow-hidden"
                />
              </div>
            )}
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {creator.total_subscribers || 0} subscribers
                </span>
              </div>
              <div className="flex items-center gap-1">
                <UserPlus className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {followerCount} followers
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {likeCount} likes
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          {/* Follow/Unfollow Button */}
          {user && user.id !== parseInt(creator.id) && (
            <Button
              variant={isFollowing ? "outline" : "default"}
              size="sm"
              className="flex-1"
              onClick={handleFollowToggle}
              disabled={isFollowLoading}
              data-testid={`button-${isFollowing ? 'unfollow' : 'follow'}-${creator.id}`}
            >
              {isFollowLoading ? (
                <span className="text-xs">Loading...</span>
              ) : isFollowing ? (
                <>
                  <UserCheck className="w-3 h-3 mr-1" />
                  <span className="text-xs">Following</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-3 h-3 mr-1" />
                  <span className="text-xs">Follow</span>
                </>
              )}
            </Button>
          )}
          
          {/* View Profile Button */}
          <Link to={`/creator/${encodeURIComponent(creator.username)}`} className={user && user.id !== parseInt(creator.id) ? "flex-1" : "w-full"}>
            <Button
              variant="outline"
              size="sm"
              className="w-full view-profile-btn"
              style={{
                '--hover-bg': '#22222a'
              } as React.CSSProperties}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.backgroundColor = '#22222a';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.backgroundColor = '';
              }}
              data-testid={`button-view-profile-${creator.id}`}
            >
              <span className="text-xs">View Profile</span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};