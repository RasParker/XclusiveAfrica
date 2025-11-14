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
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center p-4 space-y-3">
          {/* Animated lock icon */}
          <div className="w-10 h-10 mx-auto bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 animate-pulse">
            <svg className="w-5 h-5 text-accent drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          {/* Exclusive tier badge */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/30 backdrop-blur-md shadow-lg">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="capitalize">{tier.toLowerCase() === 'ppv' ? 'Pay Per View' : tier} Tier</span>
            </div>
            
            {/* PPV Price hint - render internally for consistent spacing */}
            {ppvEnabled && ppvPrice && (
              <p className="text-xs text-white/70 font-medium">
                One-time unlock for {ppvCurrency} {parseFloat(ppvPrice).toFixed(2)}
              </p>
            )}
          </div>

          {showButton && (
            <>
              {/* Enhanced CTA button with shimmer effect */}
              <Button 
                size="sm" 
                className="bg-accent hover:bg-accent/90 text-white text-sm px-6 py-2.5 rounded-lg font-semibold shadow-2xl hover:shadow-accent/50 transition-all duration-300 hover:scale-105 relative overflow-hidden group/btn"
                onClick={onUnlockClick}
                data-testid="button-unlock"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                  {user ? 'Unlock Full Access' : 'Login to Unlock'}
                </span>
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
