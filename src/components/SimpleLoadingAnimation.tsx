import { memo } from 'react';
import { Coffee, Brain, Sparkles } from 'lucide-react';

interface SimpleLoadingAnimationProps {
  isGenerating: boolean;
}

const SimpleLoadingAnimation = memo(({ isGenerating }: SimpleLoadingAnimationProps) => {
  if (!isGenerating) return null;

  return (
    <div className="mb-8 relative">
      <div className="relative p-8 rounded-2xl border-2 bg-gradient-to-br from-orange-50/90 to-white border-orange-200 shadow-lg backdrop-blur-sm">
        
        {/* Simple animated icon */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 relative">
              {/* Simple coffee cup */}
              <div className="absolute inset-0 bg-gradient-to-b from-orange-100 to-orange-200 rounded-b-3xl border-2 border-orange-300 shadow-lg">
                {/* Coffee liquid with simple animation */}
                <div 
                  className="absolute bottom-1 left-1 right-1 bg-gradient-to-t from-amber-800 to-orange-700 rounded-b-3xl transition-all duration-1000 ease-out"
                  style={{ height: '70%' }}
                >
                  {/* Simple foam layer */}
                  <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-white to-orange-100 rounded-t-3xl" />
                </div>
              </div>
              
              {/* Simple handle */}
              <div className="absolute right-0 top-6 w-8 h-12 border-2 border-orange-300 rounded-r-full border-l-0" />
              
              {/* Animated icon above */}
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 text-orange-600 animate-bounce">
                <Coffee className="w-12 h-12" />
              </div>
            </div>
          </div>
        </div>

        {/* Simple progress text */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-3 text-orange-600 flex items-center justify-center gap-2">
            <Brain className="w-6 h-6 animate-pulse" />
            Generating Questions...
            <Sparkles className="w-6 h-6 animate-pulse" />
          </h3>
          <p className="text-slate-600 text-base mb-6">
            Creating intelligent questions tailored to your needs
          </p>
          
          {/* Simple progress bar */}
          <div className="w-full bg-orange-100 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full animate-pulse"
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

SimpleLoadingAnimation.displayName = 'SimpleLoadingAnimation';

export default SimpleLoadingAnimation;
