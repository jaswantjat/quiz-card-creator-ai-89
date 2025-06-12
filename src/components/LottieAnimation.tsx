import { memo, useEffect, useRef, useState } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';



interface LottieAnimationProps {
  src: string;
  fallbackSrc?: string;
  autoplay?: boolean;
  loop?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onComplete?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const LottieAnimation = memo(({
  src,
  fallbackSrc,
  autoplay = true,
  loop = true,
  className = '',
  style,
  onComplete,
  size = 'md'
}: LottieAnimationProps) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [error, setError] = useState<string | null>(null);
  const playerRef = useRef<any>(null);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40'
  };

  // Handle animation load errors with better fallback logic
  const handleError = () => {
    console.error('🚨 Failed to load animation from:', currentSrc);
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      console.log('🔄 Trying fallback animation:', fallbackSrc);
      setCurrentSrc(fallbackSrc);
      setError(null);
    } else {
      console.error('❌ All animation sources failed, showing static fallback');
      setError('Animation failed to load');
    }
  };

  const handleLoad = () => {
    setError(null);
    console.log('✅ Animation loaded successfully from:', currentSrc);
  };

  useEffect(() => {
    console.log('🎭 LottieAnimation mounted with src:', src, 'fallback:', fallbackSrc);

    // Check for external URLs and CSP compliance
    if (src.startsWith('http')) {
      console.log('🛡️ CSP Check: Loading external animation from', new URL(src).origin);
    }

    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      console.log('🔇 Reduced motion detected, will pause animation');
      if (playerRef.current) {
        playerRef.current.pause();
      }
    }
  }, [src, fallbackSrc]);

  if (error) {
    return (
      <div className={`${sizeClasses[size]} ${className} flex items-center justify-center bg-orange-100 rounded-lg`} style={style}>
        <div className="text-orange-600 text-xs text-center p-2">
          Animation unavailable
        </div>
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} ${className} gpu-accelerated`} style={style}>
      <Player
        ref={playerRef}
        src={currentSrc}
        autoplay={autoplay}
        loop={loop}
        onEvent={(event) => {
          console.log('🎬 Player event:', event, 'for:', currentSrc);
          if (event === 'load') {
            handleLoad();
          } else if (event === 'error' || event === 'loadError') {
            handleError();
          } else if (event === 'complete') {
            onComplete?.();
          }
        }}
        onError={handleError}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
});

LottieAnimation.displayName = 'LottieAnimation';

export default LottieAnimation;
