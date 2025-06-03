import { memo, useEffect, useState } from 'react';
import { Coffee, Brain, Sparkles, Zap } from 'lucide-react';

interface SimpleLoadingAnimationProps {
  isGenerating: boolean;
}

const SimpleLoadingAnimation = memo(({ isGenerating }: SimpleLoadingAnimationProps) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { icon: Brain, text: "Analyzing context...", duration: 800 },
    { icon: Zap, text: "Processing requirements...", duration: 1000 },
    { icon: Sparkles, text: "Generating questions...", duration: 1200 }
  ];

  useEffect(() => {
    if (!isGenerating) {
      setProgress(0);
      setCurrentStep(0);
      return;
    }

    let progressInterval: NodeJS.Timeout;
    let stepTimeout: NodeJS.Timeout;

    // Smooth progress animation
    progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + 1;
      });
    }, 30); // 3 seconds total (100 * 30ms)

    // Step progression
    const progressSteps = () => {
      steps.forEach((step, index) => {
        stepTimeout = setTimeout(() => {
          setCurrentStep(index);
        }, index * 1000);
      });
    };

    progressSteps();

    return () => {
      clearInterval(progressInterval);
      clearTimeout(stepTimeout);
    };
  }, [isGenerating]);

  if (!isGenerating) return null;

  const CurrentIcon = steps[currentStep]?.icon || Brain;

  return (
    <div className="mb-8 relative">
      <div className="relative p-8 rounded-2xl border-2 bg-gradient-to-br from-orange-50/90 to-white border-orange-200 shadow-lg backdrop-blur-sm overflow-hidden">

        {/* Animated background pulse */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-amber-400/5 to-orange-600/5 animate-pulse" />

        {/* Enhanced animated icon */}
        <div className="flex items-center justify-center mb-6 relative z-10">
          <div className="relative">
            {/* Pulsing background circle */}
            <div className="absolute inset-0 w-24 h-24 bg-gradient-to-br from-orange-200/50 to-amber-200/50 rounded-full animate-ping" />
            <div className="absolute inset-2 w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full" />

            {/* Dynamic icon with smooth transitions */}
            <div className="relative w-24 h-24 flex items-center justify-center">
              <CurrentIcon className="w-12 h-12 text-orange-600 transition-all duration-500 ease-in-out transform hover:scale-110" />
            </div>

            {/* Floating particles */}
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
            <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
            <div className="absolute top-1/2 -right-4 w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
          </div>
        </div>

        {/* Enhanced progress text with step indication */}
        <div className="text-center relative z-10">
          <h3 className="text-2xl font-bold mb-3 text-orange-600 flex items-center justify-center gap-2 transition-all duration-300">
            <CurrentIcon className="w-6 h-6 animate-pulse" />
            {steps[currentStep]?.text || "Generating Questions..."}
          </h3>
          <p className="text-slate-600 text-base mb-6 transition-opacity duration-300">
            Creating intelligent questions tailored to your needs
          </p>

          {/* Enhanced progress bar with smooth animation */}
          <div className="w-full bg-orange-100 rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-100 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
            </div>
          </div>

          {/* Progress percentage */}
          <div className="mt-2 text-sm text-orange-600 font-medium">
            {Math.round(progress)}% Complete
          </div>
        </div>
      </div>
    </div>
  );
});

SimpleLoadingAnimation.displayName = 'SimpleLoadingAnimation';

export default SimpleLoadingAnimation;
