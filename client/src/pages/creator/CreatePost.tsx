import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';

import { ArrowLeft, Upload, Image, Video, Calendar as CalendarIcon, Clock, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const MAX_FILE_SIZE = 16 * 1024 * 1024; // 16MB
const MAX_THUMBNAIL_SIZE = 10 * 1024 * 1024; // 10MB (Cloudinary free tier limit)
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/mov'];

const formSchema = z.object({
  caption: z.string().optional(),
  accessTier: z.string().min(1, "Please select who can see this post"),
  ppvPrice: z.coerce.number().positive("Price must be a positive number").optional().or(z.literal(undefined)),
  ppvCurrency: z.string().default('GHS'),
  scheduledDate: z.date().optional(),
  scheduledTime: z.string().optional(),
}).refine((data) => {
  // If accessTier is PPV, price is required and must be positive
  if (data.accessTier === 'ppv' && (!data.ppvPrice || data.ppvPrice <= 0)) {
    return false;
  }
  return true;
}, {
  message: "PPV price is required when Pay Per View is selected",
  path: ["ppvPrice"],
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

export const CreatePost: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [tiers, setTiers] = useState<SubscriptionTier[]>([]);
  const [videoAspectRatio, setVideoAspectRatio] = useState<'landscape' | 'portrait' | null>(null);
  const [videoDimensions, setVideoDimensions] = useState<{ width: number; height: number } | null>(null);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [isLoadingDraft, setIsLoadingDraft] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caption: '',
      accessTier: '',
      ppvPrice: undefined,
      ppvCurrency: 'GHS',
      scheduledTime: '',
    },
  });

  // Fetch creator's subscription tiers
  useEffect(() => {
    const fetchTiers = async () => {
      if (!user?.id) return;

      try {
        const response = await fetch(`/api/creators/${user.id}/tiers`);
        if (response.ok) {
          const tiersData = await response.json();
          setTiers(tiersData);
        } else {
          console.error('Failed to fetch tiers');
          setTiers([]);
        }
      } catch (error) {
        console.error('Error fetching tiers:', error);
        setTiers([]);
      }
    };

    fetchTiers();
  }, [user?.id]);

  // Load draft post if draft ID is in URL
  useEffect(() => {
    const loadDraft = async () => {
      const draftParam = searchParams.get('draft');
      if (!draftParam || !user?.id) return;

      setDraftId(draftParam);
      setIsLoadingDraft(true);

      try {
        console.log('Loading draft post:', draftParam);
        const response = await fetch(`/api/posts/${draftParam}?userId=${user.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to load draft');
        }

        const draftData = await response.json();
        console.log('Draft data loaded:', draftData);

        // Restore form values
        form.setValue('caption', draftData.content || '');
        
        // Restore access tier
        if (draftData.is_ppv_enabled) {
          form.setValue('accessTier', 'ppv');
          form.setValue('ppvPrice', draftData.ppv_price || undefined);
          form.setValue('ppvCurrency', draftData.ppv_currency || 'GHS');
        } else {
          form.setValue('accessTier', draftData.tier || '');
        }

        // Restore scheduled date/time if present
        if (draftData.scheduled_for) {
          const scheduledDate = new Date(draftData.scheduled_for);
          form.setValue('scheduledDate', scheduledDate);
          const hours = scheduledDate.getHours().toString().padStart(2, '0');
          const minutes = scheduledDate.getMinutes().toString().padStart(2, '0');
          form.setValue('scheduledTime', `${hours}:${minutes}`);
        }

        // Restore media if present
        const mediaUrls = Array.isArray(draftData.media_urls) 
          ? draftData.media_urls 
          : typeof draftData.media_urls === 'string'
            ? draftData.media_urls.split(',').map((url: string) => url.trim()).filter((url: string) => url)
            : [];

        if (mediaUrls.length > 0) {
          const isVideo = draftData.media_type === 'video';
          setMediaType(draftData.media_type);
          
          if (isVideo && mediaUrls.length > 1) {
            // Video with custom thumbnail: first is thumbnail, second is video
            setThumbnailPreview(mediaUrls[0]);
            setMediaPreview(mediaUrls[1]);
          } else {
            // Single media (image or video without custom thumbnail)
            setMediaPreview(mediaUrls[0]);
            if (isVideo && mediaUrls.length === 1) {
              // Video without custom thumbnail
              setThumbnailPreview(null);
            }
          }
        }

        toast({
          title: "Draft loaded",
          description: "Continue editing your draft post.",
        });
      } catch (error) {
        console.error('Error loading draft:', error);
        toast({
          title: "Error",
          description: "Failed to load draft. Starting fresh.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingDraft(false);
      }
    };

    loadDraft();
  }, [searchParams, user?.id, form, toast]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 16MB.",
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    const isImage = ACCEPTED_IMAGE_TYPES.includes(file.type);
    const isVideo = ACCEPTED_VIDEO_TYPES.includes(file.type);

    if (!isImage && !isVideo) {
      toast({
        title: "Invalid file type",
        description: "Please select a valid image (.jpg, .png, .gif) or video (.mp4, .mov) file.",
        variant: "destructive",
      });
      return;
    }

    setMediaFile(file);
    setMediaType(isImage ? 'image' : 'video');

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setMediaPreview(previewUrl);

    toast({
      title: "Media uploaded",
      description: `${file.name} has been selected successfully.`,
    });
  };

  const removeMedia = () => {
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview);
    }
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType(null);
    setVideoAspectRatio(null);
    setVideoDimensions(null);
    setThumbnailFile(null);
    setThumbnailPreview(null);
  };

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
    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
  };

  const handleSubmit = async (data: FormData, action: 'draft' | 'schedule' | 'publish') => {
    // Validate that we have either caption or media
    if (!data.caption?.trim() && !mediaFile) {
      toast({
        title: "Content required",
        description: "Please provide a caption or upload media to create a post.",
        variant: "destructive",
      });
      return;
    }

    // Validate scheduled posts have a date
    if (action === 'schedule' && !data.scheduledDate) {
      toast({
        title: "Schedule date required",
        description: "Please select a date and time to schedule your post.",
        variant: "destructive",
      });
      return;
    }

    // Set specific loading state based on action
    setIsUploading(true);
    if (action === 'draft') {
      setIsDraftSaving(true);
    } else if (action === 'publish') {
      setIsPublishing(true);
    } else if (action === 'schedule') {
      setIsScheduling(true);
    }

    try {
      // Get current user ID from auth context
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to create a post.",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      // Upload media files
      let uploadedMediaUrls: string[] = [];

      // If we're editing a draft and haven't changed the media, use existing URLs
      const hasNewMedia = mediaFile !== null;
      const hasNewThumbnail = thumbnailFile !== null;
      
      // If no new media and we have preview URLs (from loaded draft), preserve them
      if (!hasNewMedia && mediaPreview) {
        // We're using existing media from the draft
        if (mediaType === 'video' && thumbnailPreview) {
          // Video with thumbnail: preserve both URLs
          uploadedMediaUrls = [thumbnailPreview, mediaPreview];
        } else {
          // Single media (image or video without custom thumbnail)
          uploadedMediaUrls = [mediaPreview];
        }
      }

      // Upload thumbnail first if it exists (for video posts)
      if (mediaType === 'video' && hasNewThumbnail) {
        try {
          const thumbnailFormData = new FormData();
          thumbnailFormData.append('media', thumbnailFile);

          const thumbnailUploadResponse = await fetch('/api/cloudinary/post-media', {
            method: 'POST',
            body: thumbnailFormData,
          });

          if (!thumbnailUploadResponse.ok) {
            const errorData = await thumbnailUploadResponse.json();
            throw new Error(errorData.error || 'Failed to upload thumbnail');
          }

          const thumbnailResult = await thumbnailUploadResponse.json();
          if (thumbnailResult.url) {
            uploadedMediaUrls.push(thumbnailResult.url);
          } else {
            throw new Error('Thumbnail upload did not return a valid URL');
          }
        } catch (thumbnailError) {
          console.error('Thumbnail upload error:', thumbnailError);
          toast({
            title: "Thumbnail upload failed",
            description: thumbnailError instanceof Error ? thumbnailError.message : "Please try uploading again.",
            variant: "destructive",
          });
          return;
        }
      }

      // Upload main media file if it exists and is new
      if (hasNewMedia) {
        try {
          const formData = new FormData();
          formData.append('media', mediaFile);

          const uploadResponse = await fetch('/api/cloudinary/post-media', {
            method: 'POST',
            body: formData,
          });

          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json();
            throw new Error(errorData.error || 'Failed to upload media');
          }

          const uploadResult = await uploadResponse.json();
          if (uploadResult.url) {
            uploadedMediaUrls.push(uploadResult.url);
          } else {
            throw new Error('Media upload did not return a valid URL');
          }
        } catch (uploadError) {
          console.error('Media upload error:', uploadError);
          toast({
            title: "Media upload failed",
            description: uploadError instanceof Error ? uploadError.message : "Please try uploading again.",
            variant: "destructive",
          });
          return;
        }
      }

      if (mediaFile && uploadedMediaUrls.length === 0) {
        throw new Error('Media upload did not return a valid URL');
      }

      // Handle scheduled date and time
      let scheduled_for = null;
      if (data.scheduledDate && action === 'schedule') {
        const scheduledDateTime = new Date(data.scheduledDate);
        if (data.scheduledTime) {
          const [hours, minutes] = data.scheduledTime.split(':');
          scheduledDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        }
        scheduled_for = scheduledDateTime.toISOString();
      }

      // Prepare post data for API
      const isPPV = data.accessTier === 'ppv';
      const postData = {
        creator_id: parseInt(user.id.toString()),
        title: data.caption?.substring(0, 50) || 'Untitled Post',
        content: data.caption || '',
        media_type: mediaType || 'text',
        media_urls: uploadedMediaUrls,
        tier: isPPV ? 'ppv' : data.accessTier === 'free' ? 'public' : data.accessTier,
        status: action === 'draft' ? 'draft' : action === 'schedule' ? 'scheduled' : 'published',
        scheduled_for: scheduled_for,
        is_ppv_enabled: isPPV,
        ppv_price: isPPV && data.ppvPrice ? data.ppvPrice : null,
        ppv_currency: isPPV && data.ppvCurrency ? data.ppvCurrency : null
      };

      console.log(draftId ? 'Updating draft with data:' : 'Creating post with data:', postData);

      // Create or update the post via API
      const apiUrl = draftId ? `/api/posts/${draftId}` : '/api/posts';
      const apiMethod = draftId ? 'PUT' : 'POST';
      
      const response = await fetch(apiUrl, {
        method: apiMethod,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${draftId ? 'update' : 'create'} post`);
      }

      const createdPost = await response.json();
      console.log(draftId ? 'Draft updated successfully:' : 'Post created successfully:', createdPost);

      // Dispatch custom event to notify profile page
      window.dispatchEvent(new CustomEvent('localStorageChange', {
        detail: { type: 'postCreated', post: createdPost }
      }));

      toast({
        title: `Post ${action === 'publish' ? 'published' : action === 'schedule' ? 'scheduled' : 'saved as draft'}`,
        description: `Your post has been ${action === 'publish' ? 'published successfully' : action === 'schedule' ? 'scheduled successfully' : 'saved as draft'}.`,
      });

      // Navigate back to dashboard or schedule page
      if (action === 'schedule') {
        navigate('/creator/schedule');
      } else {
        navigate('/creator/dashboard');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${action} post. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setIsDraftSaving(false);
      setIsPublishing(false);
      setIsScheduling(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 sm:mb-8 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 flex items-center gap-2 justify-center sm:justify-start">
            Create New Post
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Share exclusive content with your subscribers
          </p>
        </div>

        <Form {...form}>
          <form className="space-y-6">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Post Content</CardTitle>
                <CardDescription>Add your caption and media</CardDescription>
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

                {/* Media Upload */}
                <div className="space-y-4">
                  <Label>Media (Optional)</Label>

                  {!mediaFile ? (
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <Input
                        type="file"
                        accept=".jpg,.jpeg,.png,.gif,.mp4,.mov"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="media-upload"
                      />
                      <Label htmlFor="media-upload" className="cursor-pointer">
                        <div className="flex flex-col items-center gap-4">
                          <Upload className="w-12 h-12 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Click to upload media</p>
                            <p className="text-xs text-muted-foreground">
                              Images: JPG, PNG, GIF (max 16MB)<br/>
                              Videos: MP4, MOV (max 16MB)
                            </p>
                          </div>
                        </div>
                      </Label>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative rounded-lg overflow-hidden bg-muted">
                        {mediaType === 'image' ? (
                          <img
                            src={mediaPreview!}
                            alt="Preview"
                            className="w-full h-64 object-cover"
                          />
                        ) : (
                          <video
                            src={mediaPreview!}
                            className="w-full h-64 object-cover"
                            controls
                          />
                        )}
                        <div className="absolute top-2 right-2">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={removeMedia}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {mediaType === 'image' ? <Image className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                        <span>{mediaFile.name} ({(mediaFile.size / 1024 / 1024).toFixed(1)} MB)</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Video Thumbnail Upload - Only show when video is uploaded */}
                {mediaType === 'video' && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Video Thumbnail (Optional)</Label>
                    <p className="text-xs text-muted-foreground">Upload a custom thumbnail image for your video</p>
                    
                    {thumbnailPreview ? (
                      <div className="relative rounded-lg overflow-hidden bg-muted">
                        <img
                          src={thumbnailPreview}
                          alt="Thumbnail preview"
                          className="w-full h-32 object-cover"
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
                      <div className="border-2 border-dashed rounded-lg p-6 text-center bg-muted/30">
                        <Image className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Upload a thumbnail for your video
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
                )}
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Audience & Publishing</CardTitle>
                <CardDescription>Choose who can see this post and when to publish</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Access Tier */}
                <FormField
                  control={form.control}
                  name="accessTier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Choose who can see this post</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          if (value === 'create_new_tier') {
                            navigate('/creator/tiers');
                          } else {
                            field.onChange(value);
                          }
                        }} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select access level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="free">Free for all followers</SelectItem>
                          <SelectItem value="ppv">Pay Per View (PPV)</SelectItem>
                          {tiers.length === 0 && (
                            <SelectItem value="create_new_tier" className="text-primary font-medium">
                              + Create new tier
                            </SelectItem>
                          )}
                          {tiers.map((tier) => (
                            <SelectItem key={tier.id} value={tier.name}>
                              {tier.name} (GHS {tier.price}/month)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* PPV Settings - Only show when PPV is selected */}
                {form.watch('accessTier') === 'ppv' && (
                  <div className="space-y-4 border-t border-border pt-6">
                    <div className="rounded-lg border border-border p-4 bg-muted/50">
                      <div className="space-y-0.5 mb-4">
                        <FormLabel className="text-base">
                          Pay Per View Settings
                        </FormLabel>
                        <FormDescription>
                          Set a one-time price for fans to purchase permanent access to this content without subscribing
                        </FormDescription>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="ppvPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>PPV Price *</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0.01"
                                  placeholder="0.00"
                                  className="pl-10"
                                  {...field}
                                  value={field.value ?? ''}
                                  onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                  data-testid="input-ppv-price"
                                />
                              </div>
                            </FormControl>
                            <FormDescription>
                              One-time payment for permanent access
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="ppvCurrency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Currency</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-ppv-currency">
                                  <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="GHS">GHS (Ghanaian Cedi)</SelectItem>
                                <SelectItem value="USD">USD (US Dollar)</SelectItem>
                                <SelectItem value="EUR">EUR (Euro)</SelectItem>
                                <SelectItem value="GBP">GBP (British Pound)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  </div>
                )}

                {/* Schedule Options */}
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="scheduledDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Schedule Date (Optional)</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date(new Date().setHours(0, 0, 0, 0))
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="scheduledTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Schedule Time</FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/creator/dashboard')}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => form.handleSubmit((data) => handleSubmit(data, 'draft'))()}
                disabled={isUploading}
              >
                {isDraftSaving ? 'Saving...' : 'Save as Draft'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => form.handleSubmit((data) => handleSubmit(data, 'schedule'))()}
                disabled={isUploading || !form.watch('scheduledDate')}
              >
                {isScheduling ? 'Scheduling...' : 'Schedule Post'}
              </Button>
              <Button
                type="button"
                onClick={() => form.handleSubmit((data) => handleSubmit(data, 'publish'))()}
                disabled={isUploading}
              >
                {isPublishing ? 'Publishing...' : 'Publish Now'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};