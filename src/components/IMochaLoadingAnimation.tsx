import { memo, useEffect, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface IMochaLoadingAnimationProps {
  isVisible: boolean;
  totalQuestions: number;
  generationStatus?: 'idle' | 'generating' | 'success' | 'error';
  progressiveLoadingState?: {
    phase: 'initial' | 'background' | 'complete';
    questionsLoaded: number;
    totalExpected: number;
    isLoading: boolean;
    error?: string;
  };
  onComplete?: () => void;
}

// Enhanced CSS-based fallback animation component with larger size and better storytelling
const CoffeeFallbackAnimation = () => {
  // Inject custom CSS for floating animation
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      .animate-float {
        animation: float 3s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="w-48 h-48 flex items-center justify-center relative">
      {/* Brewing Station Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-amber-50 rounded-full opacity-30 animate-pulse"></div>

      <div className="relative z-10">
        {/* Enhanced Coffee Cup - Larger and more detailed */}
        <div className="w-24 h-24 border-4 border-orange-400 rounded-b-full relative bg-gradient-to-b from-orange-100 to-orange-200 shadow-lg">
          {/* Coffee liquid with brewing animation */}
          <div className="absolute bottom-2 left-2 right-2 h-12 bg-gradient-to-b from-amber-600 to-amber-800 rounded-b-full">
            {/* Brewing bubbles */}
            <div className="absolute top-1 left-2 w-1 h-1 bg-amber-300 rounded-full animate-ping opacity-75"></div>
            <div className="absolute top-2 right-3 w-1 h-1 bg-amber-300 rounded-full animate-ping opacity-60" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-1 left-1/2 w-1 h-1 bg-amber-300 rounded-full animate-ping opacity-80" style={{ animationDelay: '1s' }}></div>
          </div>

          {/* Enhanced Steam with more realistic movement */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="w-1.5 h-6 bg-gradient-to-t from-gray-400 to-transparent rounded-full animate-bounce opacity-70" style={{ animationDelay: '0s' }}></div>
          </div>
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 -ml-3">
            <div className="w-1 h-5 bg-gradient-to-t from-gray-300 to-transparent rounded-full animate-bounce opacity-50" style={{ animationDelay: '0.3s' }}></div>
          </div>
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 ml-3">
            <div className="w-1 h-5 bg-gradient-to-t from-gray-300 to-transparent rounded-full animate-bounce opacity-50" style={{ animationDelay: '0.6s' }}></div>
          </div>
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 -ml-1">
            <div className="w-0.5 h-4 bg-gradient-to-t from-gray-200 to-transparent rounded-full animate-bounce opacity-40" style={{ animationDelay: '0.9s' }}></div>
          </div>
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 ml-1">
            <div className="w-0.5 h-4 bg-gradient-to-t from-gray-200 to-transparent rounded-full animate-bounce opacity-40" style={{ animationDelay: '1.2s' }}></div>
          </div>
        </div>

        {/* Enhanced Handle */}
        <div className="absolute right-0 top-3 w-4 h-8 border-3 border-orange-400 rounded-r-full shadow-md"></div>

        {/* Assessment Elements - Adding context to the brewing metaphor */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-1">
            <div className="w-2 h-1 bg-orange-300 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-1 bg-orange-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-1 bg-orange-300 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <div className="text-xs text-orange-600 font-medium mt-1 text-center">Ideas Brewing</div>
        </div>
      </div>

      {/* Floating Assessment Icons */}
      <div className="absolute top-4 right-8 text-orange-300 animate-float opacity-60">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
        </svg>
      </div>
      <div className="absolute bottom-6 left-6 text-orange-300 animate-float opacity-50" style={{ animationDelay: '1s' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </div>
    </div>
  );
};

const IMochaLoadingAnimation = memo(({
  isVisible,
  totalQuestions,
  generationStatus = 'idle',
  progressiveLoadingState,
  onComplete
}: IMochaLoadingAnimationProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loadingText, setLoadingText] = useState('Brewing your questions...');
  const [lottieError, setLottieError] = useState(false);

  // Coffee-themed loading messages that align with iMocha's brand
  const loadingSteps = [
    'Brewing your questions...',
    'Grinding through the context...',
    'Steaming up intelligent queries...',
    'Filtering the perfect difficulty...',
    'Adding the finishing touches...',
    'Serving your question set...'
  ];

  // Dynamic loading text based on progressive state
  useEffect(() => {
    if (!isVisible) {
      setCurrentStep(0);
      return;
    }

    // Progressive loading text updates
    if (progressiveLoadingState) {
      const { phase, questionsLoaded, totalExpected } = progressiveLoadingState;
      
      if (phase === 'initial') {
        setLoadingText('Initializing question generation...');
      } else if (phase === 'background') {
        if (questionsLoaded === 0) {
          setLoadingText('Starting to brew your questions...');
        } else if (questionsLoaded < totalExpected) {
          setLoadingText(`Brewing question ${questionsLoaded + 1} of ${totalExpected}...`);
        } else {
          setLoadingText('Finalizing your question set...');
        }
      } else if (phase === 'complete') {
        setLoadingText('Questions ready to serve!');
      }
      return;
    }

    // Fallback to step-based loading for non-progressive mode
    const stepDuration = 1200; // 1.2s per step for better pacing
    const totalSteps = loadingSteps.length;

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        const next = (prev + 1) % totalSteps;
        setLoadingText(loadingSteps[next]);
        return next;
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, [isVisible, progressiveLoadingState]);

  // Auto-hide after success or when progressive loading completes
  useEffect(() => {
    if (generationStatus === 'success' ||
        (progressiveLoadingState?.phase === 'complete' && !progressiveLoadingState.isLoading)) {
      const timer = setTimeout(() => {
        onComplete?.();
      }, 1500); // Show success state for 1.5s before hiding
      return () => clearTimeout(timer);
    }
  }, [generationStatus, progressiveLoadingState, onComplete]);

  // Handle Lottie loading errors
  const handleLottieError = () => {
    console.warn('🎭 Lottie animation failed to load, using CSS fallback');
    setLottieError(true);
  };

  if (!isVisible) {
    console.log('🎭 iMocha Loading Animation: HIDDEN');
    return null;
  }

  console.log('🎭 iMocha Loading Animation: VISIBLE', {
    generationStatus,
    phase: progressiveLoadingState?.phase,
    questionsLoaded: progressiveLoadingState?.questionsLoaded,
    totalExpected: progressiveLoadingState?.totalExpected,
    lottieError
  });

  // Calculate progress percentage
  const progressPercentage = progressiveLoadingState 
    ? Math.round((progressiveLoadingState.questionsLoaded / progressiveLoadingState.totalExpected) * 100)
    : Math.min((currentStep + 1) * 16.67, 100); // Approximate progress for step-based loading

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center gpu-accelerated animate-in fade-in-0 duration-300">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-orange-200/40 max-w-lg mx-4 text-center smooth-transition animate-in slide-in-from-bottom-4 duration-500">
        
        {/* Coffee Animation with fallback */}
        <div className="mb-6 flex justify-center">
          {!lottieError ? (
            <div className="w-32 h-32">
              <DotLottieReact
                src="https://lottie.host/7be80b0a-e74f-4f53-813e-ed4acc44ba85/VnwfboMquS.json"
                loop
                autoplay
                className="w-full h-full"
                onError={handleLottieError}
                onLoadError={handleLottieError}
              />
            </div>
          ) : (
            <CoffeeFallbackAnimation />
          )}
        </div>

        {/* Loading Text */}
        <div className="mb-6">
          <h3 className="text-2xl font-semibold text-slate-800 mb-3 text-optimized">
            {generationStatus === 'success' ? 'Questions Ready!' : 'Generating Questions'}
          </h3>
          <p className="text-slate-600 smooth-transition text-optimized text-lg">
            {loadingText}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">
              {progressiveLoadingState 
                ? `${progressiveLoadingState.questionsLoaded} of ${progressiveLoadingState.totalExpected} questions`
                : `Generating ${totalQuestions} question${totalQuestions !== 1 ? 's' : ''}`
              }
            </span>
            <span className="text-sm font-medium text-orange-600">
              {progressPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-orange-500 to-amber-500 h-3 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Generation Status Indicator */}
        {generationStatus !== 'idle' && (
          <div className="mb-4">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              generationStatus === 'generating' ? 'bg-blue-100 text-blue-700' :
              generationStatus === 'success' ? 'bg-green-100 text-green-700' :
              generationStatus === 'error' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {generationStatus === 'generating' && (
                <>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  Brewing in progress...
                </>
              )}
              {generationStatus === 'success' && (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Questions brewed successfully ✓
                </>
              )}
              {generationStatus === 'error' && (
                <>
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Brewing failed - please try again
                </>
              )}
            </div>
          </div>
        )}

        {/* iMocha Branding */}
        <div className="text-xs text-slate-500 mt-4">
          <p>Powered by iMocha's AI Question Engine</p>
          {lottieError && (
            <p className="text-orange-600 mt-1">Using optimized animation</p>
          )}
        </div>
      </div>
    </div>
  );
});

IMochaLoadingAnimation.displayName = 'IMochaLoadingAnimation';

export default IMochaLoadingAnimation;
