import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

// UI Components
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// Icons
import { Upload, X, Image, Video, Send, Clock, Plus } from 'lucide-react';

const MAX_FILE_SIZE = 16 * 1024 * 1024; // 16MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/mov'];

const formSchema = z.object({
  caption: z.string().min(1, "Caption is required").refine(val => val.trim().length > 0, "Caption cannot be empty"),
  accessTier: z.string().min(1, "Please select who can see this post"),
  ppvPrice: z.coerce.number().positive("Price must be a positive number").optional().or(z.literal(undefined)),
  ppvCurrency: z.string().default('GHS'),
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

interface QuickPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: () => void;
}

export const QuickPostModal: React.FC<QuickPostModalProps> = ({ isOpen, onClose, onPostCreated }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // States
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [tiers, setTiers] = useState<SubscriptionTier[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isFormComplete, setIsFormComplete] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caption: '',
      accessTier: '',
      ppvPrice: undefined,
      ppvCurrency: 'GHS',
    },
    mode: 'onChange', // Enable real-time validation
  });

  // Watch form changes and validate
  const caption = form.watch('caption');
  const accessTier = form.watch('accessTier');
  const ppvPrice = form.watch('ppvPrice');
  const ppvCurrency = form.watch('ppvCurrency');

  useEffect(() => {
    const errors: string[] = [];

    // Check if we have a caption (required for all posts)
    if (!caption?.trim()) {
      errors.push('Add a caption to your post');
    }

    // Check if tier is selected
    if (!accessTier) {
      errors.push('Select who can see this post');
    }

    // Check if PPV price is set when PPV is selected
    if (accessTier === 'ppv' && (!ppvPrice || ppvPrice <= 0)) {
      errors.push('Set a price for Pay Per View content');
    }

    setValidationErrors(errors);
    setIsFormComplete(errors.length === 0);
  }, [caption, accessTier, ppvPrice, mediaFile]);

  // Fetch creator's subscription tiers
  useEffect(() => {
    const fetchTiers = async () => {
      if (!user?.id || !isOpen) return;

      try {
        const response = await fetch(`/api/creators/${user.id}/tiers`);
        if (response.ok) {
          const tiersData = await response.json();
          setTiers(tiersData);
        } else {
          setTiers([]);
        }
      } catch (error) {
        console.error('Error fetching tiers:', error);
        setTiers([]);
      }
    };

    fetchTiers();
  }, [user?.id, isOpen]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      form.reset();
      removeMedia();
      setShowAdvanced(false);
    }
  }, [isOpen, form]);

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
        description: "Please select a valid image or video file.",
        variant: "destructive",
      });
      return;
    }

    setMediaFile(file);
    setMediaType(isImage ? 'image' : 'video');

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setMediaPreview(previewUrl);
  };

  const removeMedia = () => {
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview);
    }
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType(null);
  };

  const handleSubmit = async (data: FormData) => {
    // Validate that we have a caption (required for all posts)
    if (!data.caption?.trim()) {
      toast({
        title: "Caption required",
        description: "Please provide a caption for your post.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a post.",
        variant: "destructive",
      });
      return;
    }

    setIsPublishing(true);

    try {
      // Upload media file first if it exists
      let uploadedMediaUrls: string[] = [];
      if (mediaFile) {
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
        uploadedMediaUrls = uploadResult.url ? [uploadResult.url] : [];

        if (uploadedMediaUrls.length === 0) {
          throw new Error('Media upload did not return a valid URL');
        }
      }

      // Prepare post data for API
      const isPPV = data.accessTier === 'ppv';
      const postData = {
        creator_id: parseInt(user.id.toString()),
        title: data.caption?.substring(0, 50) || 'Quick Post',
        content: data.caption || '',
        media_type: mediaType || 'text',
        media_urls: uploadedMediaUrls,
        tier: isPPV ? 'ppv' : (data.accessTier === 'free' ? 'public' : data.accessTier),
        status: 'published',
        scheduled_for: null,
        is_ppv_enabled: isPPV,
        ppv_price: isPPV && data.ppvPrice ? data.ppvPrice : null,
        ppv_currency: isPPV && data.ppvCurrency ? data.ppvCurrency : null
      };

      // Create the post via API
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const createdPost = await response.json();

      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('localStorageChange', {
        detail: { type: 'postCreated', post: createdPost }
      }));

      toast({
        title: "Post published",
        description: "Your post has been published successfully.",
      });

      onClose();
      onPostCreated?.();

    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to publish post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const QuickPostContent = useMemo(() => (
    <div className="space-y-4">
      {/* Caption Input */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="caption"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Write your caption here... (required)"
                    className="min-h-[120px] resize-none border-0 bg-transparent text-base focus-visible:ring-0"
                    {...field}
                    data-testid="input-caption"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Media Preview */}
          {mediaPreview && (
            <div className="relative rounded-lg overflow-hidden bg-muted">
              {mediaType === 'image' ? (
                <img
                  src={mediaPreview}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                />
              ) : (
                <video
                  src={mediaPreview}
                  className="w-full h-48 object-cover"
                  controls
                />
              )}
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={removeMedia}
                data-testid="button-remove-media"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Media Upload & Quick Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept=".jpg,.jpeg,.png,.gif,.mp4,.mov"
                onChange={handleFileUpload}
                className="hidden"
                id="quick-media-upload"
              />
              <Label htmlFor="quick-media-upload" className="cursor-pointer">
                <Button type="button" variant="ghost" size="sm" asChild>
                  <div data-testid="button-upload-media">
                    <Upload className="w-4 h-4 mr-2" />
                    Media
                  </div>
                </Button>
              </Label>
              
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
                data-testid="button-advanced-options"
                className={!accessTier ? 'text-blue-600 dark:text-blue-400' : ''}
              >
                <Plus className="w-4 h-4 mr-2" />
                {showAdvanced ? 'Less' : (!accessTier ? 'Select Audience' : 'More')}
              </Button>
            </div>

            <Button 
              type="submit" 
              disabled={isPublishing || !isFormComplete}
              data-testid="button-publish-post"
            >
              {isPublishing ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Publish
                </>
              )}
            </Button>
          </div>

          {/* Validation Feedback */}
          {validationErrors.length > 0 && (
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 space-y-1">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">To publish your post:</p>
              <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-0.5">
                {validationErrors.map((error, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-amber-600 dark:bg-amber-400 rounded-full"></span>
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tier Selection - Always show initially, can be toggled */}
          {(!accessTier || showAdvanced) && (
            <div className="border-t pt-4 space-y-4">
              <FormField
                control={form.control}
                name="accessTier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Who can see this post?</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        if (value === 'create_new_tier') {
                          // Close modal and navigate to manage tiers
                          onClose();
                          window.location.href = '/creator/tiers';
                        } else {
                          field.onChange(value);
                        }
                      }} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger data-testid="select-access-tier">
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
              {accessTier === 'ppv' && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm font-medium">
                      Pay Per View Settings
                    </FormLabel>
                    <p className="text-xs text-muted-foreground">
                      Set a one-time price for this content
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* PPV Price */}
                    <FormField
                      control={form.control}
                      name="ppvPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-3 text-xs text-muted-foreground">
                                {ppvCurrency}
                              </span>
                              <Input
                                type="number"
                                step="0.01"
                                min="0.01"
                                placeholder="0.00"
                                className="pl-14"
                                value={field.value ?? ''}
                                onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                data-testid="input-ppv-price"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* PPV Currency */}
                    <FormField
                      control={form.control}
                      name="ppvCurrency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Currency</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Currency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="GHS">GHS</SelectItem>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                              <SelectItem value="GBP">GBP</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </form>
      </Form>
    </div>
  ), [form, handleSubmit, mediaPreview, mediaType, removeMedia, handleFileUpload, showAdvanced, setShowAdvanced, isPublishing, isFormComplete, validationErrors, accessTier, ppvPrice, ppvCurrency, tiers]);

  // Mobile: Use Drawer (bottom sheet)
  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="max-h-[90vh]" data-testid="quick-post-drawer">
          <DrawerHeader className="pb-2">
            <DrawerTitle>Create Post</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4">
            {QuickPostContent}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop: Use Modal Dialog
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]" data-testid="quick-post-modal">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
        </DialogHeader>
        {QuickPostContent}
      </DialogContent>
    </Dialog>
  );
};