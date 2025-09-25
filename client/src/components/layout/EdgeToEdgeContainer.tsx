import React from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface EdgeToEdgeContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | '7xl';
  enablePadding?: boolean;
  enableTopPadding?: boolean;
  centerToViewport?: boolean; // Opt-in prop for viewport-centered layout with sidebar
}

export const EdgeToEdgeContainer: React.FC<EdgeToEdgeContainerProps> = ({ 
  children, 
  className,
  maxWidth = 'none',
  enablePadding = false,
  enableTopPadding = false,
  centerToViewport = false
}) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
  // Check if sidebar is present (desktop + logged in user)
  const hasSidebar = !isMobile && user;
  const sidebarWidth = 256; // 16rem = 256px (w-64)
  
  const getMaxWidthClass = () => {
    if (maxWidth === 'none') return '';
    
    // Base max-width class
    const maxWidthOnly = (() => {
      switch (maxWidth) {
        case 'sm': return 'max-w-sm';
        case 'md': return 'max-w-md';
        case 'lg': return 'max-w-lg';
        case 'xl': return 'max-w-xl';
        case '2xl': return 'max-w-2xl';
        case '4xl': return 'max-w-4xl';
        case '6xl': return 'max-w-6xl';
        case '7xl': return 'max-w-7xl';
        default: return '';
      }
    })();
    
    // Always apply mx-auto centering with max-width
    // The transform (if needed) will be applied on top of this centering
    return `${maxWidthOnly} mx-auto`;
  };

  // Custom style for viewport centering with sidebar
  const getCustomStyle = () => {
    if (!centerToViewport || !hasSidebar || maxWidth === 'none') {
      return {};
    }
    
    // Simple, robust approach: use transform to shift content left by half sidebar width
    // This centers content relative to the full viewport without overflow issues
    return {
      transform: `translateX(-${sidebarWidth / 2}px)`
    };
  };

  return (
    <div 
      className={cn(
        'w-full',
        getMaxWidthClass(),
        enablePadding && 'px-4 sm:px-6 lg:px-8',
        enableTopPadding && 'py-6 sm:py-8',
        className
      )}
      style={getCustomStyle()}
    >
      {children}
    </div>
  );
};