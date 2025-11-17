import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface QuickEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: {
    id: number;
    title: string;
    content: string;
    media_urls: string[];
    media_type: string;
    ppv_sales_count: number;
  };
  onSuccess: () => void;
}

export const QuickEditModal: React.FC<QuickEditModalProps> = ({
  open,
  onOpenChange,
  post,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [caption, setCaption] = useState(post.content || '');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload an image file for the thumbnail',
          variant: 'destructive',
        });
        return;
      }
      
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      let thumbnailUrl = post.media_urls[0]; // Keep existing thumbnail by default

      // Upload new thumbnail if one was selected
      if (thumbnailFile) {
        const formData = new FormData();
        formData.append('media', thumbnailFile);

        const uploadResponse = await fetch('/api/cloudinary/post-media', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload thumbnail');
        }

        const uploadData = await uploadResponse.json();
        thumbnailUrl = uploadData.url;
      }

      // Update post with new caption and/or thumbnail
      const updateData: any = {
        content: caption,
      };

      // Only update media_urls if we have a new thumbnail
      if (thumbnailFile && thumbnailUrl) {
        // Preserve existing video URLs while adding/replacing thumbnail
        const existingUrls = post.media_urls || [];
        
        // Find video URLs (not thumbnails) from existing media_urls
        const videoUrls = existingUrls.filter((url: string) => 
          url && url.match(/\.(mp4|mov|webm|avi)(\?|$)/i)
        );
        
        // New structure: [thumbnail, ...video_urls]
        // This ensures thumbnail is first (for display) and video URLs are preserved
        updateData.media_urls = [thumbnailUrl, ...videoUrls];
      }

      const response = await fetch(`/api/posts/${post.id}`, {
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

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating post:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update post',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentThumbnail = thumbnailPreview || post.media_urls[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]" data-testid="modal-quick-edit">
        <DialogHeader>
          <DialogTitle>Quick Edit</DialogTitle>
          <DialogDescription>
            This content has been purchased by {post.ppv_sales_count} {post.ppv_sales_count === 1 ? 'person' : 'people'}. 
            You can only edit the caption and thumbnail.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Purchase Badge */}
          <Badge variant="secondary" className="w-fit" data-testid="badge-purchased-indicator">
            {post.ppv_sales_count} Purchase{post.ppv_sales_count !== 1 ? 's' : ''}
          </Badge>

          {/* Caption */}
          <div className="space-y-2">
            <Label htmlFor="caption">Caption</Label>
            <Textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              className="min-h-[100px]"
              data-testid="input-caption"
            />
          </div>

          {/* Thumbnail */}
          <div className="space-y-2">
            <Label>Thumbnail</Label>
            
            {currentThumbnail ? (
              <div className="relative">
                <img
                  src={currentThumbnail}
                  alt="Thumbnail preview"
                  className="w-full h-48 object-cover rounded-md"
                  data-testid="img-thumbnail-preview"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={handleRemoveThumbnail}
                  data-testid="button-remove-thumbnail"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-md p-8 text-center">
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Upload a new thumbnail
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                  id="thumbnail-upload"
                  data-testid="input-thumbnail"
                />
                <Label
                  htmlFor="thumbnail-upload"
                  className="cursor-pointer text-primary hover:underline"
                >
                  Choose file
                </Label>
              </div>
            )}

            {!currentThumbnail && (
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
                id="thumbnail-upload-alt"
                data-testid="input-thumbnail-alt"
              />
            )}
            
            {currentThumbnail && (
              <div className="flex gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                  id="thumbnail-change"
                  data-testid="input-thumbnail-change"
                />
                <Label
                  htmlFor="thumbnail-change"
                  className="cursor-pointer"
                >
                  <Button type="button" variant="outline" asChild>
                    <span data-testid="button-change-thumbnail">
                      <Upload className="w-4 h-4 mr-2" />
                      Change Thumbnail
                    </span>
                  </Button>
                </Label>
              </div>
            )}
          </div>

          {/* Restricted Fields Info */}
          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm text-muted-foreground">
              <strong>Restricted:</strong> You cannot change the media file, price, or access tier for purchased content.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            data-testid="button-cancel"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            data-testid="button-save-changes"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
