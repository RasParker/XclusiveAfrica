import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

// UI Components
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Icons
import { Settings, User, Bell, Shield, Eye, EyeOff, Save, Camera } from 'lucide-react';

interface QuickSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickSettingsPanel: React.FC<QuickSettingsPanelProps> = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Quick settings state
  const [displayName, setDisplayName] = useState(user?.username || '');
  const [bio, setBio] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    contentUpdates: true,
    newSubscribers: true,
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profileDiscoverable: true,
    showActivity: false,
    allowDirectMessages: true,
  });

  // Content settings
  const [content, setContent] = useState({
    commentsEnabled: true,
    autoPostEnabled: false,
    watermarkEnabled: true,
  });

  // Load current settings when panel opens
  useEffect(() => {
    const loadQuickSettings = async () => {
      if (!isOpen || !user?.id) return;

      try {
        // Load user profile data
        setDisplayName(user.username || '');
        
        // Load privacy settings
        const privacyResponse = await fetch('/api/user/settings');
        if (privacyResponse.ok) {
          const privacyData = await privacyResponse.json();
          setPrivacy(prev => ({
            ...prev,
            profileDiscoverable: privacyData.profile_discoverable ?? true,
            showActivity: privacyData.activity_status_visible ?? false,
          }));
        }

        // Load notification preferences
        try {
          const notificationResponse = await fetch('/api/user/notification-preferences');
          if (notificationResponse.ok) {
            const notificationData = await notificationResponse.json();
            setNotifications(prev => ({
              ...prev,
              emailNotifications: notificationData.email_notifications ?? true,
              pushNotifications: notificationData.push_notifications ?? false,
            }));
          }
        } catch (error) {
          console.log('Notification preferences not available');
        }

      } catch (error) {
        console.error('Error loading quick settings:', error);
      }
    };

    loadQuickSettings();
  }, [isOpen, user?.id]);

  const handleSaveBasicInfo = async () => {
    setIsLoading(true);
    try {
      // Update user info
      updateUser({ username: displayName });
      
      toast({
        title: "Profile updated",
        description: "Your basic information has been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePrivacySettings = async () => {
    try {
      const response = await fetch('/api/user/privacy-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile_discoverable: privacy.profileDiscoverable,
          activity_status_visible: privacy.showActivity,
        }),
      });

      if (response.ok) {
        toast({
          title: "Privacy settings saved",
          description: "Your privacy preferences have been updated.",
        });
      } else {
        throw new Error('Failed to save privacy settings');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save privacy settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const QuickSettingsContent = () => (
    <div className="space-y-6">
      {/* Profile Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <CardTitle className="text-base">Profile</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={profilePhoto || user?.avatar || ''} />
              <AvatarFallback>
                {user?.username?.slice(0, 2).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div>
                <Label htmlFor="displayName" className="text-sm">Display Name</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your display name"
                  data-testid="input-display-name"
                />
              </div>
            </div>
          </div>
          <Button 
            size="sm" 
            onClick={handleSaveBasicInfo} 
            disabled={isLoading}
            data-testid="button-save-profile"
          >
            <Save className="w-3 h-3 mr-2" />
            Save Profile
          </Button>
        </CardContent>
      </Card>

      {/* Privacy Quick Settings */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <CardTitle className="text-base">Privacy</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm">Profile Discoverable</Label>
              <p className="text-xs text-muted-foreground">Allow others to find your profile</p>
            </div>
            <Switch
              checked={privacy.profileDiscoverable}
              onCheckedChange={(checked) => 
                setPrivacy(prev => ({ ...prev, profileDiscoverable: checked }))
              }
              data-testid="switch-profile-discoverable"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm">Show Activity Status</Label>
              <p className="text-xs text-muted-foreground">Let others see when you're online</p>
            </div>
            <Switch
              checked={privacy.showActivity}
              onCheckedChange={(checked) => 
                setPrivacy(prev => ({ ...prev, showActivity: checked }))
              }
              data-testid="switch-show-activity"
            />
          </div>

          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleSavePrivacySettings}
            data-testid="button-save-privacy"
          >
            <Save className="w-3 h-3 mr-2" />
            Save Privacy Settings
          </Button>
        </CardContent>
      </Card>

      {/* Notification Quick Settings */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4" />
            <CardTitle className="text-base">Notifications</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm">Email Notifications</Label>
              <p className="text-xs text-muted-foreground">Get updates via email</p>
            </div>
            <Switch
              checked={notifications.emailNotifications}
              onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, emailNotifications: checked }))
              }
              data-testid="switch-email-notifications"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm">New Subscribers</Label>
              <p className="text-xs text-muted-foreground">Notify when someone subscribes</p>
            </div>
            <Switch
              checked={notifications.newSubscribers}
              onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, newSubscribers: checked }))
              }
              data-testid="switch-new-subscribers"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm">Content Updates</Label>
              <p className="text-xs text-muted-foreground">Notify about content interactions</p>
            </div>
            <Switch
              checked={notifications.contentUpdates}
              onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, contentUpdates: checked }))
              }
              data-testid="switch-content-updates"
            />
          </div>
        </CardContent>
      </Card>

      {/* Content Settings */}
      {user?.role === 'creator' && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <CardTitle className="text-base">Content Settings</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm">Enable Comments</Label>
                <p className="text-xs text-muted-foreground">Allow comments on your posts</p>
              </div>
              <Switch
                checked={content.commentsEnabled}
                onCheckedChange={(checked) => 
                  setContent(prev => ({ ...prev, commentsEnabled: checked }))
                }
                data-testid="switch-comments-enabled"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm">Watermark</Label>
                <p className="text-xs text-muted-foreground">Add watermark to media</p>
              </div>
              <Switch
                checked={content.watermarkEnabled}
                onCheckedChange={(checked) => 
                  setContent(prev => ({ ...prev, watermarkEnabled: checked }))
                }
                data-testid="switch-watermark"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Full Settings Link */}
      <div className="pt-2 border-t">
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={onClose}
          data-testid="button-full-settings"
        >
          <Settings className="w-4 h-4 mr-2" />
          Open Full Settings
        </Button>
      </div>
    </div>
  );

  // Mobile: Use Drawer (bottom sheet)  
  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="max-h-[85vh]" data-testid="quick-settings-drawer">
          <DrawerHeader className="pb-2">
            <DrawerTitle>Quick Settings</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4 overflow-y-auto">
            <QuickSettingsContent />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop: Use Sheet (slide-over panel)
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto" data-testid="quick-settings-sheet">
        <SheetHeader>
          <SheetTitle>Quick Settings</SheetTitle>
          <SheetDescription>
            Quickly adjust your most common settings
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          <QuickSettingsContent />
        </div>
      </SheetContent>
    </Sheet>
  );
};