import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/components/layout/AppLayout';
import { EdgeToEdgeContainer } from '@/components/layout/EdgeToEdgeContainer';
import { SubscriptionCard } from '@/components/fan/SubscriptionCard';
import { ArrowLeft, Heart, CreditCard, Calendar, ChevronDown, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from '@/hooks/use-mobile';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";


interface PendingChange {
  id: number;
  change_type: string;
  scheduled_date: string;
  to_tier: {
    name: string;
    price: string;
  };
  proration_amount: string;
  status: string;
}

interface Subscription {
  id: number;
  creator: {
    id: number;
    username: string;
    display_name: string;
    avatar: string;
  };
  tier: {
    id: number;
    name: string;
    price: string;
    description: string;
  };
  status: 'active' | 'paused' | 'cancelled' | 'expired';
  next_billing_date: string;
  created_at: string;
  auto_renew: boolean;
  pending_changes?: PendingChange[];
  available_tiers?: any[];
  change_history?: any[];
}

export const ManageSubscriptions: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('active');


  useEffect(() => {
    fetchSubscriptions();
  }, [user]);

  const fetchSubscriptions = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Use the enhanced subscription API with tier management data
      const response = await fetch(`/api/subscriptions/user/${user.id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch subscriptions');
      }

      const result = await response.json();
      if (result.success) {
        setSubscriptions(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch subscriptions');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching subscriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePauseResume = async (subscriptionId: number) => {
    const subscription = subscriptions.find(sub => sub.id === subscriptionId);
    const newStatus = subscription?.status === 'active' ? 'paused' : 'active';

    try {
      const response = await fetch(`/api/subscriptions/${subscriptionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          auto_renew: newStatus === 'active'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update subscription');
      }

      // Update local state only after successful API call
      setSubscriptions(subscriptions.map(sub => 
        sub.id === subscriptionId 
          ? { 
              ...sub, 
              status: newStatus,
              auto_renew: newStatus === 'active'
            }
          : sub
      ));

      toast({
        title: newStatus === 'paused' ? "Subscription paused" : "Subscription resumed",
        description: newStatus === 'paused' 
          ? "Your subscription has been paused and will not renew." 
          : "Your subscription has been resumed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update subscription. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = async (subscriptionId: number) => {
    try {
      const response = await fetch(`/api/subscriptions/${subscriptionId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      // Remove from local state only after successful API call
      setSubscriptions(subscriptions.filter(sub => sub.id !== subscriptionId));
      toast({
        title: "Subscription cancelled",
        description: "Your subscription has been cancelled successfully.",
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleToggleAutoRenew = async (subscriptionId: number, autoRenew: boolean) => {
    try {
      const response = await fetch(`/api/subscriptions/${subscriptionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auto_renew: autoRenew
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update auto-renew setting');
      }

      // Update local state only after successful API call
      setSubscriptions(subscriptions.map(sub => 
        sub.id === subscriptionId 
          ? { ...sub, auto_renew: autoRenew }
          : sub
      ));

      toast({
        title: autoRenew ? "Auto-renew enabled" : "Auto-renew disabled",
        description: autoRenew 
          ? "Your subscription will automatically renew." 
          : "Your subscription will not automatically renew.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update auto-renew setting. Please try again.",
        variant: "destructive",
      });
    }
  };

  const totalMonthlySpend = subscriptions
    .filter(sub => sub.status === 'active')
    .reduce((sum, sub) => sum + parseFloat(sub.tier.price), 0);

  // Calculate derived data
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active');
  const inactiveSubscriptions = subscriptions.filter(sub => sub.status === 'paused');
  const subscriptionHistory = subscriptions.filter(sub => !['active', 'paused'].includes(sub.status)); // Cancelled, expired, etc.


  return (
    <AppLayout>
      <EdgeToEdgeContainer maxWidth="7xl" enablePadding enableTopPadding centerToViewport>
        <div className="mb-6 sm:mb-8 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 flex items-center gap-2 justify-center sm:justify-start">
            Manage Subscriptions
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            View and manage all your creator subscriptions
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Active Subscriptions</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">
                    {subscriptions.filter(sub => sub.status === 'active').length}
                  </p>
                </div>
                <Heart className="h-6 w-6 sm:h-8 sm:w-8" strokeWidth={1} style={{ color: '#b3b3b3' }} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Monthly Spending</p>
                  <p className="text-2xl font-bold text-foreground">GHS {totalMonthlySpend}</p>
                </div>
                <CreditCard className="h-8 w-8" strokeWidth={1} style={{ color: '#b3b3b3' }} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                  <p className="text-2xl font-bold text-foreground">Jan 2024</p>
                </div>
                <Calendar className="h-8 w-8" strokeWidth={1} style={{ color: '#b3b3b3' }} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subscriptions List */}
        <div className="space-y-4 sm:space-y-6">
          {/* Tab Bar */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tab Navigation */}
            <TabsList className="mb-6">
              <TabsTrigger value="active">
                <span className="sm:hidden">Active Subs</span>
                <span className="hidden sm:inline">Active Subscriptions</span>
                <span className="ml-2 text-xs opacity-70">
                  {activeSubscriptions.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="inactive">
                <span className="sm:hidden">Inactive Subs</span>
                <span className="hidden sm:inline">Inactive Subscriptions</span>
                <span className="ml-2 text-xs opacity-70">
                  {inactiveSubscriptions.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="history">
                Payment History
                <span className="ml-2 text-xs opacity-70">
                  {subscriptionHistory.length}
                </span>
              </TabsTrigger>
            </TabsList>

          {activeTab === 'active' && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-semibold">
                  Active Subscriptions ({loading ? '...' : activeSubscriptions.length})
                </h2>
              </div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : error ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Error loading subscriptions: {error}</p>
                </div>
              ) : activeSubscriptions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No active subscriptions yet.</p>
                  <Button variant="premium" className="mt-4" asChild>
                    <Link to="/explore">Discover Creators</Link>
                  </Button>
                </div>
              ) : (
                activeSubscriptions.map((subscription) => {
                  const [isExpanded, setIsExpanded] = useState(false);
                  return (
                    <SubscriptionCard
                      key={subscription.id}
                      subscription={subscription}
                      onPauseResume={handlePauseResume}
                      onCancel={handleCancel}
                      onToggleAutoRenew={handleToggleAutoRenew}
                      onSubscriptionUpdate={fetchSubscriptions}
                    >
                      {/* Desktop View */}
                      <div className="hidden sm:block">
                        <Card className="bg-gradient-card border-border/50">
                          <CardContent className="p-6">
                            <div className="flex items-center gap-6">
                              <Avatar className="w-16 h-16 flex-shrink-0">
                                <AvatarImage src={subscription.creator.avatar} alt={subscription.creator.username} />
                                <AvatarFallback>{subscription.creator.display_name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-foreground truncate">
                                  {subscription.creator.display_name}
                                </h3>
                                <p className="text-sm text-muted-foreground truncate">
                                  @{subscription.creator.username}
                                </p>
                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                  <Badge variant="outline" className="text-xs">{subscription.tier.name}</Badge>
                                  <Badge variant={subscription.status === 'active' ? 'success' : subscription.status === 'paused' ? 'destructive' : 'secondary'} className="text-xs">
                                    {subscription.status}
                                  </Badge>
                                  {subscription.pending_changes && subscription.pending_changes.length > 0 && (
                                    <Badge variant="outline" className="text-xs border-orange-300 text-orange-700 bg-orange-50">
                                      <Clock className="w-3 h-3 mr-1" />
                                      Pending
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="text-base font-bold text-foreground">
                                  GHS {subscription.tier.price}/month
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Next billing: {new Date(subscription.next_billing_date).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 ml-auto">
                                <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handlePauseResume(subscription.id); }}>
                                  {subscription.status === 'active' ? 'Pause' : 'Resume'}
                                </Button>
                                <Button variant="destructive" size="sm" onClick={(e) => { e.stopPropagation(); handleCancel(subscription.id); }}>
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Mobile View - Collapsible */}
                      <div className="sm:hidden">
                        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
                          <CollapsibleTrigger className="w-full p-4" asChild>
                            <div className="cursor-pointer">
                              <div className="flex items-start gap-3">
                                <Avatar className="w-12 h-12 flex-shrink-0">
                                  <AvatarImage src={subscription.creator.avatar} alt={subscription.creator.username} />
                                  <AvatarFallback>{subscription.creator.display_name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2 mb-1">
                                    <h3 className="text-sm font-semibold text-foreground truncate">
                                      {subscription.creator.display_name}
                                    </h3>
                                  </div>
                                  <p className="text-xs text-muted-foreground truncate mb-2">
                                    @{subscription.creator.username}
                                  </p>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <Badge variant="outline" className="text-xs">{subscription.tier.name}</Badge>
                                    <Badge variant={subscription.status === 'active' ? 'success' : subscription.status === 'paused' ? 'destructive' : 'secondary'} className="text-xs">
                                      {subscription.status}
                                    </Badge>
                                    {subscription.pending_changes && subscription.pending_changes.length > 0 && (
                                      <Badge variant="outline" className="text-xs border-orange-300 text-orange-700 bg-orange-50">
                                        <Clock className="w-3 h-3 mr-1" />
                                        Pending
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center justify-between mt-2">
                                    <p className="text-sm font-bold text-foreground">
                                      GHS {subscription.tier.price}/month
                                    </p>
                                    <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="p-4 pt-0">
                            <div className="flex flex-col gap-3">
                              <p className="text-sm text-muted-foreground">
                                Next billing: {new Date(subscription.next_billing_date).toLocaleDateString()}
                              </p>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handlePauseResume(subscription.id); }} className="flex-1">
                                  {subscription.status === 'active' ? 'Pause' : 'Resume'}
                                </Button>
                                <Button variant="destructive" size="sm" onClick={(e) => { e.stopPropagation(); handleCancel(subscription.id); }} className="flex-1">
                                  Cancel
                                </Button>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                <label className="inline-flex items-center cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={subscription.auto_renew} 
                                    onChange={(e) => { e.stopPropagation(); handleToggleAutoRenew(subscription.id, e.target.checked); }} 
                                    className="form-checkbox h-4 w-4 text-primary rounded" 
                                  />
                                  <span className="ml-2">Auto-renew</span>
                                </label>
                              </div>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    </SubscriptionCard>
                  );
                })
              )}
            </>
          )}

          {activeTab === 'inactive' && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-semibold">
                  Inactive Subscriptions ({loading ? '...' : inactiveSubscriptions.length})
                </h2>
              </div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : error ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Error loading subscriptions: {error}</p>
                </div>
              ) : inactiveSubscriptions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No inactive subscriptions.</p>
                </div>
              ) : (
                inactiveSubscriptions.map((subscription) => (
                  <SubscriptionCard
                    key={subscription.id}
                    subscription={subscription}
                    onPauseResume={handlePauseResume}
                    onCancel={handleCancel}
                    onToggleAutoRenew={handleToggleAutoRenew}
                    onSubscriptionUpdate={fetchSubscriptions}
                  />
                ))
              )}
            </>
          )}

          {activeTab === 'history' && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-semibold">
                  Payment History ({loading ? '...' : subscriptionHistory.length})
                </h2>
              </div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : error ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Error loading payment history: {error}</p>
                </div>
              ) : subscriptionHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No payment history yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {subscriptionHistory.map((subscription) => (
                    <Card key={subscription.id} className="bg-gradient-card border-border/50">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex items-start gap-3 sm:gap-4">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden flex-shrink-0">
                              {subscription.creator.avatar ? (
                                <img 
                                  src={subscription.creator.avatar} 
                                  alt={subscription.creator.display_name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                                  <span className="text-foreground font-medium text-sm sm:text-base">
                                    {subscription.creator.display_name?.charAt(0) || subscription.creator.username.charAt(0)}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-foreground text-sm sm:text-base">
                                {subscription.creator.display_name || subscription.creator.username}
                              </h3>
                              <p className="text-xs sm:text-sm text-muted-foreground">
                                @{subscription.creator.username}
                              </p>
                              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                                {subscription.tier.name} • GHS {subscription.tier.price}/month
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant={
                                  subscription.status === 'active' ? 'success' :
                                  subscription.status === 'cancelled' || subscription.status === 'expired'
                                    ? 'destructive' 
                                    : 'secondary'
                                } className="text-xs">
                                  {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-xs sm:text-sm text-muted-foreground">
                              <p>Subscribed: {new Date(subscription.created_at).toLocaleDateString()}</p>
                              <p>Ended: {new Date(subscription.next_billing_date).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </Tabs>
        </div>
      </EdgeToEdgeContainer>
    </AppLayout>
  );
};