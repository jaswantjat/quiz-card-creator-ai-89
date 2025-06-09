import { memo, useEffect, useState } from 'react';
import CoffeeBrewingAnimation from './CoffeeBrewingAnimation';

interface QuestionGenerationLoaderProps {
  isVisible: boolean;
  totalQuestions: number;
  generationStatus?: 'idle' | 'generating' | 'success' | 'error';
  onComplete?: () => void;
}

const QuestionGenerationLoader = memo(({
  isVisible,
  totalQuestions,
  generationStatus = 'idle',
  onComplete
}: QuestionGenerationLoaderProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loadingText, setLoadingText] = useState('Brewing your questions...');

  const loadingSteps = [
    'Processing your request...',
    'Analyzing context and topics...',
    'Crafting intelligent questions...',
    'Adding explanations and options...',
    'Finalizing your question set...'
  ];

  useEffect(() => {
    if (!isVisible) {
      setCurrentStep(0);
      return;
    }

    const stepDuration = 800; // 800ms per step
    const totalSteps = loadingSteps.length;

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        const next = (prev + 1) % totalSteps;
        setLoadingText(loadingSteps[next]);
        return next;
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center gpu-accelerated">
      <div className="bg-white/95 backdrop-optimized rounded-3xl p-8 shadow-2xl border border-orange-200/40 max-w-md mx-4 text-center smooth-transition">
        {/* Coffee Animation */}
        <div className="mb-6">
          <CoffeeBrewingAnimation 
            size="lg"
            className="mx-auto"
          />
        </div>

        {/* Loading Text */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-2 text-optimized">
            Generating Questions
          </h3>
          <p className="text-slate-600 smooth-transition text-optimized">
            {loadingText}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-sm text-slate-500 text-optimized">
              Creating {totalQuestions} question{totalQuestions !== 1 ? 's' : ''}
            </span>
          </div>
          
          {/* Animated Progress Dots */}
          <div className="flex justify-center gap-1">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full smooth-transition ${
                  index === currentStep 
                    ? 'bg-orange-500 scale-125' 
                    : 'bg-orange-200'
                }`}
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              />
            ))}
          </div>
        </div>

        {/* Generation Status Indicator */}
        {generationStatus !== 'idle' && (
          <div className="mb-3">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
              generationStatus === 'generating' ? 'bg-blue-100 text-blue-700' :
              generationStatus === 'success' ? 'bg-green-100 text-green-700' :
              generationStatus === 'error' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {generationStatus === 'generating' && (
                <>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  Generating questions...
                </>
              )}
              {generationStatus === 'success' && (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Questions generated ✓
                </>
              )}
              {generationStatus === 'error' && (
                <>
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Generation failed ⚠
                </>
              )}
            </div>
          </div>
        )}

        {/* Estimated Time */}
        <div className="text-xs text-slate-400 text-optimized">
          This usually takes a few seconds...
        </div>
      </div>
    </div>
  );
});

QuestionGenerationLoader.displayName = 'QuestionGenerationLoader';

export default QuestionGenerationLoader;
