import { memo } from 'react';

interface CoffeeBrewingAnimationProps {
  isVisible?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onComplete?: () => void;
}

const CoffeeBrewingAnimation = memo(({
  isVisible = true,
  size = 'md',
  className = '',
  onComplete
}: CoffeeBrewingAnimationProps) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40'
  };

  if (!isVisible) return null;

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} gpu-accelerated smooth-transition relative`}>
        {/* Coffee Cup SVG Animation */}
        <div className="coffee-brewing-container relative w-full h-full">
          {/* Coffee Cup */}
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full coffee-cup-animation"
            style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}
          >
            {/* Cup Body */}
            <path
              d="M20 35 L20 75 Q20 85 30 85 L60 85 Q70 85 70 75 L70 35 Z"
              fill="url(#cupGradient)"
              stroke="#8B4513"
              strokeWidth="2"
            />

            {/* Coffee Liquid */}
            <path
              d="M22 37 L22 73 Q22 83 30 83 L60 83 Q68 83 68 73 L68 37 Z"
              fill="url(#coffeeGradient)"
              className="coffee-liquid"
            />

            {/* Cup Handle */}
            <path
              d="M70 45 Q80 45 80 55 Q80 65 70 65"
              fill="none"
              stroke="#8B4513"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Saucer */}
            <ellipse
              cx="45"
              cy="88"
              rx="25"
              ry="4"
              fill="url(#saucerGradient)"
              stroke="#8B4513"
              strokeWidth="1"
            />

            {/* Steam */}
            <g className="steam-animation">
              <path
                d="M35 30 Q37 25 35 20 Q33 15 35 10"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.7"
              />
              <path
                d="M45 30 Q47 25 45 20 Q43 15 45 10"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.7"
              />
              <path
                d="M55 30 Q57 25 55 20 Q53 15 55 10"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.7"
              />
            </g>

            {/* Gradients */}
            <defs>
              <linearGradient id="cupGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F3F4F6" />
                <stop offset="100%" stopColor="#E5E7EB" />
              </linearGradient>

              <linearGradient id="coffeeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D2691E" />
                <stop offset="50%" stopColor="#8B4513" />
                <stop offset="100%" stopColor="#654321" />
              </linearGradient>

              <linearGradient id="saucerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F9FAFB" />
                <stop offset="100%" stopColor="#E5E7EB" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
});

CoffeeBrewingAnimation.displayName = 'CoffeeBrewingAnimation';

export default CoffeeBrewingAnimation;
