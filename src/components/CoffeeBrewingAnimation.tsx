import { memo } from 'react';
import LottieAnimation from './LottieAnimation';

interface CoffeeBrewingAnimationProps {
  isVisible?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onComplete?: () => void;
}

// Use the exact Lottie animation URL provided, with JSON fallback
const LOTTIE_ANIMATION_URL = 'https://lottie.host/0e55ab1a-dd3a-4a0a-95cf-cb52b8719407/kpKxG90DHf.lottie';
const JSON_FALLBACK = '/src/assets/animations/coffee-fallback.json';

const CoffeeBrewingAnimation = memo(({
  isVisible = true,
  size = 'md',
  className = '',
  onComplete
}: CoffeeBrewingAnimationProps) => {
  if (!isVisible) return null;

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <LottieAnimation
        src={LOTTIE_ANIMATION_URL}
        fallbackSrc={JSON_FALLBACK}
        autoplay={true}
        loop={true}
        size={size}
        onComplete={onComplete}
        className="coffee-brewing-lottie smooth-transition"
      />
    </div>
  );
});

CoffeeBrewingAnimation.displayName = 'CoffeeBrewingAnimation';

export default CoffeeBrewingAnimation;
