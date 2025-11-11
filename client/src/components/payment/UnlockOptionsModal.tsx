import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Check, Sparkles, Zap } from 'lucide-react';

interface UnlockOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: {
    id: number;
    title: string;
    tier: string;
    ppv_price: string;
    ppv_currency: string;
    creator_display_name?: string;
  };
  onSubscribeClick: () => void;
  onPPVClick: () => void;
}

export function UnlockOptionsModal({ 
  isOpen, 
  onClose, 
  post, 
  onSubscribeClick, 
  onPPVClick 
}: UnlockOptionsModalProps) {
  const ppvPrice = parseFloat(post.ppv_price);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl" data-testid="modal-unlock-options">
        <DialogHeader>
          <DialogTitle className="text-2xl">Choose How to Unlock</DialogTitle>
          <DialogDescription>
            Get access to "{post.title}" and more exclusive content
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          {/* Subscribe Option */}
          <Card className="relative hover-elevate transition-all border-2" data-testid="card-subscribe-option">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground shadow-lg">
                <Sparkles className="w-3 h-3" />
                Best Value
              </span>
            </div>
            
            <CardHeader className="pt-8">
              <CardTitle>Subscribe</CardTitle>
              <CardDescription>Unlimited access to all {post.tier} tier content</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary" />
                  <span>All current {post.tier} tier content</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary" />
                  <span>Future {post.tier} tier uploads</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary" />
                  <span>Support the creator monthly</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary" />
                  <span>Cancel anytime</span>
                </div>
              </div>

              <Button 
                className="w-full" 
                onClick={onSubscribeClick}
                data-testid="button-choose-subscribe"
              >
                View Subscription Plans
              </Button>
            </CardContent>
          </Card>

          {/* PPV Option */}
          <Card className="relative hover-elevate transition-all border-2" data-testid="card-ppv-option">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground shadow-lg">
                <Zap className="w-3 h-3" />
                Quick Access
              </span>
            </div>

            <CardHeader className="pt-8">
              <CardTitle>Pay Per View</CardTitle>
              <CardDescription>One-time payment for this content only</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary" />
                  <span>Instant access to this content</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary" />
                  <span>Permanent access</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary" />
                  <span>No recurring charges</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary" />
                  <span>Watch anytime</span>
                </div>
              </div>

              <div className="p-3 bg-muted rounded-md">
                <div className="text-sm text-muted-foreground">One-time payment</div>
                <div className="text-2xl font-bold">
                  {post.ppv_currency} {ppvPrice.toFixed(2)}
                </div>
              </div>

              <Button 
                className="w-full"
                variant="secondary"
                onClick={onPPVClick}
                data-testid="button-choose-ppv"
              >
                Unlock Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
