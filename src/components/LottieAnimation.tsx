import { memo, useEffect, useRef, useState } from 'react';
import Lottie from 'lottie-react';

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
  const [animationData, setAnimationData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lottieRef = useRef<any>(null);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40'
  };

  useEffect(() => {
    const loadAnimation = async () => {
      try {
        setLoading(true);
        setError(null);

        // For direct URLs (like lottie.host), use them directly
        if (src.startsWith('http')) {
          setAnimationData(src);
          setLoading(false);
          return;
        }

        // For local files, try to load them
        const response = await fetch(src);
        if (!response.ok) {
          throw new Error(`Failed to load animation: ${response.status}`);
        }

        // Try to parse as JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          setAnimationData(data);
        } else {
          // For .lottie files or other formats, try to parse as text first
          const text = await response.text();
          try {
            const data = JSON.parse(text);
            setAnimationData(data);
          } catch {
            // If parsing fails, use the URL directly
            setAnimationData(src);
          }
        }
      } catch (err) {
        console.error('Failed to load Lottie animation:', err);

        // Try fallback if available
        if (fallbackSrc && src !== fallbackSrc) {
          console.log('Trying fallback animation source:', fallbackSrc);
          try {
            const fallbackResponse = await fetch(fallbackSrc);
            if (fallbackResponse.ok) {
              const fallbackText = await fallbackResponse.text();
              try {
                const fallbackData = JSON.parse(fallbackText);
                setAnimationData(fallbackData);
                setLoading(false);
                return;
              } catch {
                setAnimationData(fallbackSrc);
                setLoading(false);
                return;
              }
            }
          } catch (fallbackErr) {
            console.error('Fallback also failed:', fallbackErr);
          }
        }

        setError(err instanceof Error ? err.message : 'Failed to load animation');
      } finally {
        setLoading(false);
      }
    };

    if (src) {
      loadAnimation();
    }
  }, [src]);

  useEffect(() => {
    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion && lottieRef.current) {
      lottieRef.current.pause();
    }
  }, [animationData]);

  if (loading) {
    return (
      <div className={`${sizeClasses[size]} ${className} flex items-center justify-center`} style={style}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || !animationData) {
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
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        autoplay={autoplay}
        loop={loop}
        onComplete={onComplete}
        style={{
          width: '100%',
          height: '100%',
          ...style
        }}
      />
    </div>
  );
});

LottieAnimation.displayName = 'LottieAnimation';

export default LottieAnimation;
