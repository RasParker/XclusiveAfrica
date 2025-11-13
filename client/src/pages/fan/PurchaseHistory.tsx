import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { Play, ShoppingBag, Loader2, AlertCircle } from 'lucide-react';
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
    <div className="max-w-4xl mx-auto p-6 space-y-6">
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
        <div className="space-y-4">
          {purchases.map((purchase) => (
            <Card key={purchase.id} className="overflow-hidden" data-testid={`card-purchase-${purchase.id}`}>
              <div className="flex gap-4 p-4">
                {purchase.post?.media_urls?.[0] && (
                  <div className="relative w-40 h-24 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                    <img
                      src={purchase.post.media_urls[0]}
                      alt={purchase.post.title}
                      className="w-full h-full object-cover"
                    />
                    {purchase.post.media_type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center">
                          <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex-1 min-w-0 space-y-2">
                  <h3 className="font-semibold text-lg line-clamp-2" data-testid={`text-title-${purchase.id}`}>
                    {purchase.post?.title || 'Untitled Content'}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                    <span data-testid={`text-date-${purchase.id}`}>
                      Purchased {formatDistanceToNow(new Date(purchase.purchased_at), { addSuffix: true })}
                    </span>
                    <span>•</span>
                    <span className="font-medium" data-testid={`text-amount-${purchase.id}`}>
                      {purchase.currency} {parseFloat(purchase.amount).toFixed(2)}
                    </span>
                    {purchase.payment_method && (
                      <>
                        <span>•</span>
                        <span className="capitalize" data-testid={`text-payment-method-${purchase.id}`}>
                          {purchase.payment_method.replace('_', ' ')}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center">
                  <Link to={`/video/${purchase.post_id}`}>
                    <Button variant="default" data-testid={`button-watch-${purchase.post_id}`}>
                      <Play className="w-4 h-4 mr-2" />
                      Watch
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {purchases.length > 0 && (
        <div className="text-center text-sm text-muted-foreground pt-4" data-testid="text-purchase-count">
          Showing {purchases.length} purchase{purchases.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
