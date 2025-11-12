import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface LockedContentOverlayProps {
  thumbnail?: string | null | undefined;
  tier: string;
  isVideo?: boolean;
  onUnlockClick: (e: React.MouseEvent) => void;
  className?: string;
  showButton?: boolean;
  ppvEnabled?: boolean;
  ppvPrice?: string;
  ppvCurrency?: string;
}

export const LockedContentOverlay: React.FC<LockedContentOverlayProps> = ({
  thumbnail,
  tier,
  isVideo = false,
  onUnlockClick,
  className = '',
  showButton = true,
  ppvEnabled = false,
  ppvPrice,
  ppvCurrency = 'GHS'
}) => {
  const { user } = useAuth();

  return (
    <div className={`w-full h-full relative overflow-hidden group ${className}`}>
      {/* Blurred content preview underneath - ALWAYS show actual thumbnail */}
      <div className="absolute inset-0">
        {thumbnail ? (
          <img 
            src={
              isVideo && thumbnail.includes('cloudinary.com/')
                ? thumbnail.replace('/upload/', '/upload/so_0,w_800,h_800,c_fill,f_jpg/').replace('.mp4', '.jpg')
                : thumbnail.startsWith('/uploads/') || thumbnail.startsWith('http')
                  ? thumbnail
                  : `/uploads/${thumbnail}`
            }
            alt="Locked content preview"
            className="w-full h-full object-cover blur-md scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800" />
        )}
      </div>

      {/* Frosted glass overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60 backdrop-blur-xl group-hover:backdrop-blur-2xl transition-all duration-500" />

      {/* Lock icon and CTA */}
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-16 h-16 mx-auto bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 animate-pulse">
            <svg className="w-8 h-8 text-accent drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-background/20 text-white border border-white/20 backdrop-blur-sm">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="capitalize">{tier.toLowerCase() === 'ppv' ? 'Pay Per View' : tier} Tier</span>
            </div>
          </div>

          {showButton && (
            <div className="space-y-3">
              {/* Single Unlock Button */}
              <Button 
                variant="default"
                size="default"
                onClick={onUnlockClick}
                data-testid="button-unlock"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                {user ? 'Unlock Full Access' : 'Login to Unlock'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
