import { memo, useEffect, useRef } from 'react';
import Lottie from 'lottie-react';

interface LottieAnimationProps {
  animationData?: any;
  width?: number;
  height?: number;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  onComplete?: () => void;
}

const LottieAnimation = memo(({
  animationData,
  width = 200,
  height = 200,
  loop = true,
  autoplay = true,
  className = "",
  onComplete
}: LottieAnimationProps) => {
  const lottieRef = useRef<any>(null);

  useEffect(() => {
    if (lottieRef.current && onComplete) {
      const handleComplete = () => {
        onComplete();
      };

      lottieRef.current.addEventListener('complete', handleComplete);
      
      return () => {
        if (lottieRef.current) {
          lottieRef.current.removeEventListener('complete', handleComplete);
        }
      };
    }
  }, [onComplete]);

  // Fallback animation data (simple loading dots) if no animation provided
  const fallbackAnimationData = {
    "v": "5.7.4",
    "fr": 30,
    "ip": 0,
    "op": 90,
    "w": 200,
    "h": 200,
    "nm": "Loading Animation",
    "ddd": 0,
    "assets": [],
    "layers": [
      {
        "ddd": 0,
        "ind": 1,
        "ty": 4,
        "nm": "Dot 1",
        "sr": 1,
        "ks": {
          "o": {"a": 0, "k": 100},
          "r": {"a": 0, "k": 0},
          "p": {"a": 0, "k": [70, 100, 0]},
          "a": {"a": 0, "k": [0, 0, 0]},
          "s": {
            "a": 1,
            "k": [
              {"i": {"x": [0.833], "y": [0.833]}, "o": {"x": [0.167], "y": [0.167]}, "t": 0, "s": [100]},
              {"i": {"x": [0.833], "y": [0.833]}, "o": {"x": [0.167], "y": [0.167]}, "t": 30, "s": [150]},
              {"t": 60, "s": [100]}
            ]
          }
        },
        "ao": 0,
        "shapes": [
          {
            "ty": "gr",
            "it": [
              {
                "d": 1,
                "ty": "el",
                "s": {"a": 0, "k": [20, 20]},
                "p": {"a": 0, "k": [0, 0]}
              },
              {
                "ty": "fl",
                "c": {"a": 0, "k": [0.97, 0.58, 0.24, 1]},
                "o": {"a": 0, "k": 100}
              }
            ]
          }
        ],
        "ip": 0,
        "op": 90,
        "st": 0
      },
      {
        "ddd": 0,
        "ind": 2,
        "ty": 4,
        "nm": "Dot 2",
        "sr": 1,
        "ks": {
          "o": {"a": 0, "k": 100},
          "r": {"a": 0, "k": 0},
          "p": {"a": 0, "k": [100, 100, 0]},
          "a": {"a": 0, "k": [0, 0, 0]},
          "s": {
            "a": 1,
            "k": [
              {"i": {"x": [0.833], "y": [0.833]}, "o": {"x": [0.167], "y": [0.167]}, "t": 10, "s": [100]},
              {"i": {"x": [0.833], "y": [0.833]}, "o": {"x": [0.167], "y": [0.167]}, "t": 40, "s": [150]},
              {"t": 70, "s": [100]}
            ]
          }
        },
        "ao": 0,
        "shapes": [
          {
            "ty": "gr",
            "it": [
              {
                "d": 1,
                "ty": "el",
                "s": {"a": 0, "k": [20, 20]},
                "p": {"a": 0, "k": [0, 0]}
              },
              {
                "ty": "fl",
                "c": {"a": 0, "k": [0.97, 0.58, 0.24, 1]},
                "o": {"a": 0, "k": 100}
              }
            ]
          }
        ],
        "ip": 0,
        "op": 90,
        "st": 0
      },
      {
        "ddd": 0,
        "ind": 3,
        "ty": 4,
        "nm": "Dot 3",
        "sr": 1,
        "ks": {
          "o": {"a": 0, "k": 100},
          "r": {"a": 0, "k": 0},
          "p": {"a": 0, "k": [130, 100, 0]},
          "a": {"a": 0, "k": [0, 0, 0]},
          "s": {
            "a": 1,
            "k": [
              {"i": {"x": [0.833], "y": [0.833]}, "o": {"x": [0.167], "y": [0.167]}, "t": 20, "s": [100]},
              {"i": {"x": [0.833], "y": [0.833]}, "o": {"x": [0.167], "y": [0.167]}, "t": 50, "s": [150]},
              {"t": 80, "s": [100]}
            ]
          }
        },
        "ao": 0,
        "shapes": [
          {
            "ty": "gr",
            "it": [
              {
                "d": 1,
                "ty": "el",
                "s": {"a": 0, "k": [20, 20]},
                "p": {"a": 0, "k": [0, 0]}
              },
              {
                "ty": "fl",
                "c": {"a": 0, "k": [0.97, 0.58, 0.24, 1]},
                "o": {"a": 0, "k": 100}
              }
            ]
          }
        ],
        "ip": 0,
        "op": 90,
        "st": 0
      }
    ]
  };

  const animationToUse = animationData || fallbackAnimationData;

  return (
    <div className={`lottie-container ${className}`} style={{ width, height }}>
      <Lottie
        lottieRef={lottieRef}
        animationData={animationToUse}
        loop={loop}
        autoplay={autoplay}
        style={{
          width: '100%',
          height: '100%',
          willChange: 'transform',
          transform: 'translateZ(0)', // Hardware acceleration
        }}
        rendererSettings={{
          preserveAspectRatio: 'xMidYMid slice',
          progressiveLoad: true,
          hideOnTransparent: true,
        }}
      />
    </div>
  );
});

LottieAnimation.displayName = 'LottieAnimation';

export default LottieAnimation;
