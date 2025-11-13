import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Lock, Check, CreditCard, Smartphone } from 'lucide-react';

interface PPVPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: {
    id: number;
    title: string;
    ppv_price: string;
    ppv_currency: string;
    creator_display_name?: string;
    media_urls: string[];
  };
  userId: number;
  onSuccess: () => void;
}

export function PPVPaymentModal({ isOpen, onClose, post, userId, onSuccess }: PPVPaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'mobile_money'>('card');
  const { toast } = useToast();

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Initialize PPV payment
      const response = await fetch('/api/payments/initialize-ppv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fan_id: userId,
          post_id: post.id,
          payment_method: selectedMethod,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Payment initialization failed');
      }

      // Redirect to Paystack payment page
      if (result.data.authorization_url) {
        window.location.href = result.data.authorization_url;
      }
    } catch (error: any) {
      console.error('PPV payment error:', error);
      toast({
        title: 'Payment Failed',
        description: error.message || 'Failed to process payment',
        variant: 'destructive',
      });
      setIsProcessing(false);
    }
  };

  const price = parseFloat(post.ppv_price);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" data-testid="modal-ppv-payment">
        <DialogHeader>
          <DialogTitle>
            Unlock This Content
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Content Details */}
          <div className="space-y-1">
            <h3 className="font-semibold text-lg" data-testid="text-ppv-title">{post.title}</h3>
            {post.creator_display_name && (
              <p className="text-sm text-muted-foreground">
                by {post.creator_display_name}
              </p>
            )}
          </div>

          {/* Price Details */}
          <div className="bg-muted rounded-md p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-lg" data-testid="text-ppv-price">
                {post.ppv_currency} {price.toFixed(2)}
              </span>
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>One-time payment</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>Permanent access</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>Watch anytime</span>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Payment Method</label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={selectedMethod === 'card' ? 'default' : 'outline'}
                onClick={() => setSelectedMethod('card')}
                className="h-auto py-3"
                data-testid="button-payment-card"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Card
              </Button>
              <Button
                variant={selectedMethod === 'mobile_money' ? 'default' : 'outline'}
                onClick={() => setSelectedMethod('mobile_money')}
                className="h-auto py-3"
                data-testid="button-payment-mobile"
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Mobile Money
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isProcessing}
              data-testid="button-ppv-cancel"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex-1"
              data-testid="button-ppv-pay"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ${post.ppv_currency} ${price.toFixed(2)}`
              )}
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Already have access? Try refreshing the page
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
