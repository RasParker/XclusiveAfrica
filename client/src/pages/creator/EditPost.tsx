import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AppLayout } from '@/components/layout/AppLayout';
import { EdgeToEdgeContainer } from '@/components/layout/EdgeToEdgeContainer';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { 
  CalendarIcon,
  Upload,
  ArrowLeft,
  Loader2,
  Save,
  Clock,
  Image,
  Video
} from 'lucide-react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';

const MAX_FILE_SIZE = 16 * 1024 * 1024; // 16MB
const MAX_THUMBNAIL_SIZE = 10 * 1024 * 1024; // 10MB (Cloudinary free tier limit)
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/quicktime"];

const formSchema = z.object({
  caption: z.string().min(1, "Caption is required").max(2000, "Caption must be less than 2000 characters"),
});

type FormData = z.infer<typeof formSchema>;

interface SubscriptionTier {
  id: number;
  creator_id: number;
  name: string;
  price: number;
  description: string;
  benefits: string[];
  is_active: boolean;
}

export const EditPost: React.FC = () => {
  const { id: postId } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [thumbnailRemoved, setThumbnailRemoved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [originalPost, setOriginalPost] = useState<any>(null);
  const [isVideoWithThumbnail, setIsVideoWithThumbnail] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caption: '',
    },
  });

  const handleBackClick = () => {
    console.log('Back button clicked');
    navigate('/creator/dashboard');
  };

  const handleCancelClick = () => {
    console.log('Cancel button clicked');
    navigate('/creator/dashboard');
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!postId || !user?.id) {
        console.log('Missing postId or user.id:', { postId, userId: user?.id });
        setIsLoading(false);
        return;
      }

      try {
        console.log('Fetching data for post:', postId);

        const postResponse = await fetch(`/api/posts/${postId}?userId=${user.id}`);

        if (!postResponse.ok) {
          console.error('Failed to fetch post data:', postResponse.status);
          toast({
            title: "Error",
            description: "Failed to load post data.",
            variant: "destructive",
          });
          navigate('/creator/dashboard');
          return;
        }

        const postData = await postResponse.json();
        console.log('Fetched post data:', postData);

        // Set caption
        form.setValue('caption', postData.content || '');

        // Normalize media_urls to array - backend may return string or array
        const mediaUrls: string[] = Array.isArray(postData.media_urls) 
          ? postData.media_urls 
          : typeof postData.media_urls === 'string' 
            ? postData.media_urls.split(',').map((url: string) => url.trim()).filter((url: string) => url)
            : [];

        // Store normalized media_urls back to postData for consistency
        const normalizedPostData = {
          ...postData,
          media_urls: mediaUrls
        };

        // Determine if this is a video post with a custom thumbnail
        // Videos with custom thumbnails have 2+ URLs: [thumbnail, video, ...]
        // Videos without custom thumbnails have 1 URL: [video]
        // Images have 1 URL: [image]
        const isVideo = normalizedPostData.media_type === 'video';
        
        // Helper function to check if URL is an image based on extension
        const isImageUrl = (url: string) => {
          const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
          const lowerUrl = url.toLowerCase();
          return imageExtensions.some(ext => lowerUrl.includes(ext));
        };
        
        let hasCustomThumbnail = false;
        
        if (isVideo && mediaUrls.length > 0) {
          if (mediaUrls.length > 1) {
            // Multiple URLs - first should be thumbnail, rest are video
            hasCustomThumbnail = true;
          } else if (mediaUrls.length === 1 && isImageUrl(mediaUrls[0])) {
            // Single URL that's an image for a video post = thumbnail only
            hasCustomThumbnail = true;
          }
        }
        
        setIsVideoWithThumbnail(hasCustomThumbnail);

        // Set existing thumbnail preview
        if (mediaUrls.length > 0) {
          if (!isVideo) {
            // Image post - show the image
            setThumbnailPreview(mediaUrls[0]);
          } else if (hasCustomThumbnail) {
            // Video with custom thumbnail - show the first URL (thumbnail)
            setThumbnailPreview(mediaUrls[0]);
          }
          // For videos without custom thumbnails, don't show a preview
        }

        setOriginalPost(normalizedPostData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load post data.",
          variant: "destructive",
        });
        navigate('/creator/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [postId, user?.id, form, toast, navigate]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file for the thumbnail',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > MAX_THUMBNAIL_SIZE) {
      toast({
        title: 'File too large',
        description: `Thumbnail must be less than ${Math.round(MAX_THUMBNAIL_SIZE / 1024 / 1024)} MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)} MB.`,
        variant: 'destructive',
      });
      return;
    }

    setThumbnailFile(file);
    setThumbnailRemoved(false); // Reset removed flag when uploading new thumbnail
    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setThumbnailRemoved(true);
  };

  const handleSubmit = async (data: FormData) => {
    if (!user || !postId || !originalPost) return;

    setIsSaving(true);

    try {
      const existingUrls = Array.isArray(originalPost.media_urls) ? originalPost.media_urls : [];
      const isVideo = originalPost.media_type === 'video';
      let newThumbnailUrl: string | null = null;

      // Upload new thumbnail if one was selected
      if (thumbnailFile) {
        try {
          const formData = new FormData();
          formData.append('media', thumbnailFile);

          const uploadResponse = await fetch('/api/cloudinary/post-media', {
            method: 'POST',
            body: formData,
          });

          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json();
            throw new Error(errorData.error || 'Failed to upload thumbnail');
          }

          const uploadData = await uploadResponse.json();
          newThumbnailUrl = uploadData.url;
        } catch (uploadError) {
          console.error('Thumbnail upload error:', uploadError);
          toast({
            title: 'Upload failed',
            description: uploadError instanceof Error ? uploadError.message : 'Failed to upload thumbnail. Please try again.',
            variant: 'destructive',
          });
          setIsSaving(false);
          return;
        }
      }

      // Update post with new caption and/or thumbnail
      const updateData: any = {
        content: data.caption,
      };

      // Handle media_urls updates based on post type and thumbnail changes
      if (newThumbnailUrl) {
        // New thumbnail was uploaded
        if (isVideo) {
          if (isVideoWithThumbnail) {
            // Video had a custom thumbnail - replace it: [new_thumbnail, video, ...]
            updateData.media_urls = [newThumbnailUrl, ...existingUrls.slice(1)];
          } else {
            // Video didn't have a custom thumbnail - prepend it: [new_thumbnail, video]
            updateData.media_urls = [newThumbnailUrl, ...existingUrls];
          }
        } else {
          // Image post - just replace the image
          updateData.media_urls = [newThumbnailUrl];
        }
      } else if (thumbnailRemoved) {
        // Thumbnail was explicitly removed
        if (isVideo && isVideoWithThumbnail) {
          // Video had a custom thumbnail - remove it, keep the video: [video, ...]
          updateData.media_urls = existingUrls.slice(1);
        } else if (!isVideo) {
          // Image post - removing the image means empty array
          updateData.media_urls = [];
        }
        // If video without custom thumbnail, don't change media_urls
      }
      // If no changes to thumbnail, don't include media_urls in update

      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update post');
      }

      toast({
        title: 'Success',
        description: 'Post updated successfully',
      });

      navigate('/creator/dashboard');
    } catch (error: any) {
      console.error('Error updating post:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update post',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };


  if (isLoading) {
    return (
      <AppLayout>
        <EdgeToEdgeContainer maxWidth="4xl" enablePadding enableTopPadding centerToViewport>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading post...</p>
          </div>
        </EdgeToEdgeContainer>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <EdgeToEdgeContainer maxWidth="4xl" enablePadding enableTopPadding centerToViewport>
        <div className="mb-8">
          <Button 
            variant="outline" 
            size="sm"
            className="mb-4 w-10 h-10 p-0 sm:w-auto sm:h-auto sm:p-2 sm:px-4"
            onClick={handleBackClick}
          >
            <ArrowLeft className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Edit Post</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Update your post content and settings
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Post Content</CardTitle>
                <CardDescription>Update your caption and media</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Caption */}
                <FormField
                  control={form.control}
                  name="caption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Caption</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What's on your mind?"
                          className="min-h-[120px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Thumbnail Upload */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Thumbnail</Label>
                  <p className="text-xs text-muted-foreground">Upload a custom thumbnail image</p>
                  
                  {thumbnailPreview ? (
                    <div className="relative rounded-lg overflow-hidden bg-muted">
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="w-full h-48 object-cover"
                        data-testid="img-thumbnail-preview"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={handleRemoveThumbnail}
                        data-testid="button-remove-thumbnail"
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed rounded-lg p-8 text-center bg-muted/30">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Upload a new thumbnail
                      </p>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="hidden"
                        id="thumbnail-upload"
                        data-testid="input-thumbnail"
                      />
                      <Label
                        htmlFor="thumbnail-upload"
                        className="cursor-pointer"
                      >
                        <Button type="button" variant="outline" size="sm" asChild>
                          <span data-testid="button-upload-thumbnail">
                            <Upload className="w-4 h-4 mr-2" />
                            Choose Thumbnail
                          </span>
                        </Button>
                      </Label>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelClick}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </EdgeToEdgeContainer>
    </AppLayout>
  );
};