import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface SubscriptionTierModalProps {
  isOpen: boolean;
  onClose: () => void;
  creator: {
    id: number | string;
    username: string;
    display_name: string;
    avatar: string;
  };
  tiers: Array<{
    id: number | string;
    name: string;
    price: string | number;
    description?: string;
    benefits?: string[];
  }>;
  onTierSelect: (tier: any) => void;
  userIsLoggedIn: boolean;
}

export const SubscriptionTierModal: React.FC<SubscriptionTierModalProps> = ({
  isOpen,
  onClose,
  creator,
  tiers,
  onTierSelect,
  userIsLoggedIn
}) => {
  const [expandedTierId, setExpandedTierId] = useState<number | string | null>(null);

  const handleTierClick = (tier: any) => {
    if (!userIsLoggedIn) {
      window.location.href = `/login?redirect=/creator/${creator.username}`;
      return;
    }
    onTierSelect(tier);
  };

  const toggleTierExpansion = (tierId: number | string) => {
    setExpandedTierId(expandedTierId === tierId ? null : tierId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-4 sm:p-6 pb-0">
          <div className="flex items-center gap-3 mb-2">
            <Avatar className="h-12 w-12">
              <AvatarImage src={creator.avatar} alt={creator.display_name} />
              <AvatarFallback>{creator.display_name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-left text-lg font-semibold">
                Subscribe to {creator.display_name}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">@{creator.username}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="p-4 sm:p-6 pt-4">
          {/* Desktop View - Grid Layout */}
          <div className="hidden sm:block">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tiers.map((tier, index) => (
                <div
                  key={tier.id}
                  className="flex flex-col h-full p-5 border border-border/40 rounded-xl hover:border-border/60 transition-all duration-200 ease-out cursor-pointer hover:shadow-sm hover:-translate-y-0.5"
                  onClick={() => handleTierClick(tier)}
                  data-testid={`tier-card-${tier.id}`}
                >
                  <div className="flex-1 mb-5">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <h4 className="text-base font-semibold uppercase tracking-wide leading-tight">
                        {tier.name}
                      </h4>
                      {index === 0 && tiers.length > 1 && (
                        <Badge className="text-xs px-3 py-1.5 flex-shrink-0 font-semibold bg-primary text-primary-foreground hover:bg-primary/90 border-0">
                          POPULAR
                        </Badge>
                      )}
                    </div>
                    <div className="min-h-[3rem] mb-4">
                      <p className="text-sm text-muted-foreground/90 leading-relaxed">
                        {tier.description || 'Access to exclusive content and connect directly with the creator'}
                      </p>
                    </div>
                    {tier.benefits && tier.benefits.length > 0 && (
                      <div className="space-y-2.5">
                        {tier.benefits.slice(0, 3).map((benefit: string, benefitIndex: number) => (
                          <div key={benefitIndex} className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground/80 leading-relaxed">{benefit}</span>
                          </div>
                        ))}
                        {tier.benefits.length > 3 && (
                          <p className="text-xs text-accent/80 font-medium ml-5">
                            +{tier.benefits.length - 3} more benefits
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="border-t border-border/30 pt-4 mt-auto">
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-xl font-bold text-foreground">GHS {tier.price}</span>
                      <span className="text-sm text-muted-foreground/70 font-medium">/ month</span>
                    </div>
                    <Button 
                      className="w-full bg-accent hover:bg-accent/90 text-white font-semibold"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTierClick(tier);
                      }}
                      data-testid={`button-subscribe-${tier.id}`}
                    >
                      Subscribe Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile View - Collapsible Cards */}
          <div className="sm:hidden space-y-3">
            {tiers.map((tier, index) => (
              <Collapsible
                key={tier.id}
                open={expandedTierId === tier.id}
                onOpenChange={() => toggleTierExpansion(tier.id)}
              >
                <div className="border border-border/40 rounded-xl overflow-hidden">
                  <CollapsibleTrigger className="w-full p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-semibold uppercase tracking-wide">
                            {tier.name}
                          </h4>
                          {index === 0 && tiers.length > 1 && (
                            <Badge className="text-xs px-2 py-0.5 font-semibold bg-primary text-primary-foreground">
                              POPULAR
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-bold text-foreground">GHS {tier.price}</span>
                          <span className="text-xs text-muted-foreground/70 font-medium">/ month</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {expandedTierId === tier.id ? (
                          <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="p-4 pt-0 space-y-4 border-t border-border/20">
                      <p className="text-sm text-muted-foreground/90 leading-relaxed">
                        {tier.description || 'Access to exclusive content and connect directly with the creator'}
                      </p>
                      
                      {tier.benefits && tier.benefits.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-foreground uppercase tracking-wide">
                            What's included:
                          </p>
                          <div className="space-y-2">
                            {tier.benefits.map((benefit: string, benefitIndex: number) => (
                              <div key={benefitIndex} className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                                <span className="text-sm text-muted-foreground/80 leading-relaxed">{benefit}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <Button 
                        className="w-full bg-accent hover:bg-accent/90 text-white font-semibold"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTierClick(tier);
                        }}
                        data-testid={`button-subscribe-mobile-${tier.id}`}
                      >
                        Subscribe Now
                      </Button>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
