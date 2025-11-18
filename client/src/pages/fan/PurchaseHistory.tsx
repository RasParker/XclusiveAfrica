import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { ShoppingBag, Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Purchase {
  id: number;
  post_id: number;
  amount: string;
  currency: string;
  purchased_at: string;
  payment_method: string;
  transaction_id: string;
  post: {
    id: number;
    title: string;
    media_urls: string[];
    media_type: string;
  } | null;
}

interface PurchasesResponse {
  success: boolean;
  purchases: Purchase[];
}

export default function PurchaseHistory() {
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery<PurchasesResponse>({
    queryKey: ['/api/payments/ppv-purchases', user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/payments/ppv-purchases/${user?.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch purchases');
      }
      return response.json();
    },
    enabled: !!user,
  });

  const purchases = data?.purchases || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" data-testid="loader-purchases" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-8 max-w-md text-center space-y-4">
          <AlertCircle className="w-12 h-12 mx-auto text-destructive" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold" data-testid="text-error-title">Failed to Load Purchases</h3>
            <p className="text-muted-foreground" data-testid="text-error-message">
              Unable to fetch your purchase history. Please try again later.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none px-4 py-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold" data-testid="heading-purchase-history">
            My Unlocked Content
          </h1>
          <p className="text-muted-foreground">
            Content you've purchased with permanent access
          </p>
        </div>

        {purchases.length === 0 ? (
          <Card className="p-12 text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold" data-testid="text-empty-title">No Purchases Yet</h3>
              <p className="text-muted-foreground" data-testid="text-empty-description">
                When you unlock content with Pay Per View, it will appear here
              </p>
            </div>
            <Link to="/explore">
              <Button className="mt-4" data-testid="button-explore">
                Explore Content
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {purchases.map((purchase) => {
            const getVideoThumbnail = (url: string) => {
              if (url.includes('cloudinary.com')) {
                if (url.includes('/video/upload/')) {
                  // Convert video URL to thumbnail by replacing /upload/ with transformation parameters
                  return url.replace('/video/upload/', '/video/upload/so_0,w_800,h_450,c_fill,f_jpg/').replace('.mp4', '.jpg');
                }
              }
              return url;
            };

            const mediaUrl = purchase.post?.media_urls?.[0];
            const thumbnailUrl = purchase.post?.media_type === 'video' && mediaUrl
              ? getVideoThumbnail(mediaUrl)
              : mediaUrl;

            return (
              <Card key={purchase.id} className="overflow-hidden group" data-testid={`card-purchase-${purchase.id}`}>
                <Link to={`/video/${purchase.post_id}`} className="block">
                  {thumbnailUrl && (
                    <div className="relative w-full aspect-video bg-muted overflow-hidden">
                      <img
                        src={thumbnailUrl}
                        alt={purchase.post?.title || 'Content thumbnail'}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        onError={(e) => {
                          console.error('Thumbnail load error:', thumbnailUrl);
                          // If thumbnail fails, try the original video URL
                          if (purchase.post?.media_type === 'video' && mediaUrl) {
                            const target = e.target as HTMLImageElement;
                            target.src = mediaUrl;
                          }
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="p-4 space-y-3">
                    <h3 className="font-semibold text-base line-clamp-2 group-hover:text-primary transition-colors" data-testid={`text-title-${purchase.id}`}>
                      {purchase.post?.title || 'Untitled Content'}
                    </h3>
                    
                    <div className="space-y-1.5 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="font-semibold text-foreground" data-testid={`text-amount-${purchase.id}`}>
                          {purchase.currency} {parseFloat(purchase.amount).toFixed(2)}
                        </span>
                        <span>•</span>
                        <span className="capitalize" data-testid={`text-payment-method-${purchase.id}`}>
                          {purchase.payment_method.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <p className="text-muted-foreground text-xs" data-testid={`text-date-${purchase.id}`}>
                        Purchased {formatDistanceToNow(new Date(purchase.purchased_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </Link>
              </Card>
            );
          })}
          </div>
        )}

        {purchases.length > 0 && (
          <div className="text-center text-sm text-muted-foreground pt-4" data-testid="text-purchase-count">
            Showing {purchases.length} purchase{purchases.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}
