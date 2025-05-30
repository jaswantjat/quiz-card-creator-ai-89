
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Zap, Brain, Sparkles, Target, Coffee, Lightbulb, BookOpen, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import ChatAgentHeader from "./ChatAgentHeader";
import DifficultySelector from "./DifficultySelector";

interface QuestionGenerationFormProps {
  context: string;
  setContext: (context: string) => void;
  topicName: string;
  setTopicName: (topicName: string) => void;
  easyCount: number;
  setEasyCount: (count: number) => void;
  mediumCount: number;
  setMediumCount: (count: number) => void;
  hardCount: number;
  setHardCount: (count: number) => void;
  credits: number;
  isGenerating: boolean;
  showAnimation: boolean;
  onGenerate: () => void;
}

const QuestionGenerationForm = ({
  context,
  setContext,
  topicName,
  setTopicName,
  easyCount,
  setEasyCount,
  mediumCount,
  setMediumCount,
  hardCount,
  setHardCount,
  credits,
  isGenerating,
  showAnimation,
  onGenerate
}: QuestionGenerationFormProps) => {
  const totalQuestions = easyCount + mediumCount + hardCount;
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [brewingStage, setBrewingStage] = useState(0);

  // Enhanced coffee brewing storyline with refined color harmony
  const brewingSteps = [
    { 
      icon: Coffee, 
      text: "Selecting premium beans...", 
      description: "Handpicking the finest question seeds from our curated collection",
      color: "text-orange-600",
      bgColor: "bg-gradient-to-br from-orange-50/95 via-white to-amber-50/90",
      accent: "border-orange-300/70",
      glowColor: "shadow-orange-500/20"
    },
    { 
      icon: Lightbulb, 
      text: "Grinding fresh concepts...", 
      description: "Transforming brilliant ideas into perfect educational particles",
      color: "text-amber-600",
      bgColor: "bg-gradient-to-br from-amber-50/95 via-white to-orange-50/90",
      accent: "border-amber-300/70",
      glowColor: "shadow-amber-500/20"
    },
    { 
      icon: Brain, 
      text: "Brewing intelligence...", 
      description: "Infusing AI wisdom at the optimal temperature for learning",
      color: "text-orange-700",
      bgColor: "bg-gradient-to-br from-slate-50/95 via-white to-orange-50/90",
      accent: "border-orange-400/70",
      glowColor: "shadow-orange-500/25"
    },
    { 
      icon: BookOpen, 
      text: "Extracting knowledge...", 
      description: "Distilling pure educational essence with precision and care",
      color: "text-amber-700",
      bgColor: "bg-gradient-to-br from-amber-50/95 via-white to-slate-50/90",
      accent: "border-amber-400/70",
      glowColor: "shadow-amber-500/25"
    },
    { 
      icon: Sparkles, 
      text: "Perfecting the blend!", 
      description: "Your custom question brew is ready to serve - crafted to perfection",
      color: "text-orange-600",
      bgColor: "bg-gradient-to-br from-orange-50/95 via-white to-amber-50/95",
      accent: "border-orange-400/80",
      glowColor: "shadow-orange-500/30"
    }
  ];

  // Enhanced cycling through brewing steps with smoother timing
  useEffect(() => {
    if (isGenerating) {
      setCurrentStepIndex(0);
      setBrewingStage(0);
      
      const interval = setInterval(() => {
        setCurrentStepIndex((prev) => {
          const next = (prev + 1) % brewingSteps.length;
          setBrewingStage(next);
          return next;
        });
      }, 900); // Reduced from 1200ms to 900ms for smoother progression
      
      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  const currentStep = brewingSteps[currentStepIndex];
  const CurrentIcon = currentStep.icon;

  return (
    <div className="relative z-10 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl rounded-3xl p-8 border border-orange-200/40 shadow-xl shadow-orange-500/5">
      <ChatAgentHeader credits={credits} />
      
      {/* Context Text Box */}
      <div className="mb-8">
        <Label htmlFor="context" className="text-slate-700 font-semibold mb-4 block text-base flex items-center gap-2">
          Context
          <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-full">(optional)</span>
        </Label>
        <div className="relative">
          <Textarea 
            id="context" 
            placeholder="Provide context for question generation. This helps create more targeted and relevant questions..." 
            value={context} 
            onChange={e => setContext(e.target.value)} 
            className="w-full min-h-[120px] bg-white/90 backdrop-blur-sm border-orange-200/60 focus:border-orange-400 focus:ring-orange-200/50 rounded-2xl resize-none text-base leading-relaxed transition-all duration-300" 
          />
          <div className="absolute bottom-4 right-4 text-xs text-slate-400">
            {context.length}/500
          </div>
        </div>
      </div>

      {/* Topic Name */}
      <div className="mb-8">
        <Label htmlFor="topic" className="text-slate-700 font-semibold mb-4 block text-base">
          Topic Name
        </Label>
        <Input 
          id="topic" 
          type="text" 
          placeholder="Enter topic name (e.g., Machine Learning, History, Biology)..." 
          value={topicName} 
          onChange={e => setTopicName(e.target.value)} 
          className="w-full bg-white/90 backdrop-blur-sm border-orange-200/60 focus:border-orange-400 focus:ring-orange-200/50 rounded-2xl py-4 text-base transition-all duration-300" 
        />
      </div>

      <DifficultySelector
        easyCount={easyCount}
        mediumCount={mediumCount}
        hardCount={hardCount}
        setEasyCount={setEasyCount}
        setMediumCount={setMediumCount}
        setHardCount={setHardCount}
      />

      {/* Ultra-Premium Coffee Brewing Animation */}
      {isGenerating && (
        <div className="mb-8 relative">
          <div className={`relative p-12 rounded-3xl border-2 transition-all duration-700 ease-in-out ${currentStep.bgColor} ${currentStep.accent} shadow-2xl ${currentStep.glowColor} backdrop-blur-sm`}>
            
            {/* Enhanced ambient background particles with smoother movement */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden">
              {[...Array(18)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute w-2 h-2 ${currentStep.color.replace('text-', 'bg-')} opacity-40 rounded-full transition-all duration-1000 ease-in-out`}
                  style={{
                    left: `${15 + Math.random() * 70}%`,
                    top: `${15 + Math.random() * 70}%`,
                    animation: `premium-float ${2.5 + Math.random() * 1.5}s ease-in-out infinite ${Math.random() * 2}s`,
                  }}
                />
              ))}
              
              {/* Enhanced warm glow effects with smoother transitions */}
              <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-48 h-48 bg-gradient-radial from-orange-300/25 via-orange-200/15 to-transparent rounded-full blur-3xl animate-pulse transition-all duration-2000" />
              <div className="absolute bottom-1/4 right-1/4 w-36 h-36 bg-gradient-radial from-amber-300/20 via-amber-200/10 to-transparent rounded-full blur-2xl animate-pulse transition-all duration-2000" style={{ animationDelay: '1s' }} />
            </div>

            {/* Enhanced elegant steam animation with smoother movement */}
            <div className="absolute top-8 right-10 flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-0.5 h-24 bg-gradient-to-t from-orange-300/80 via-orange-200/60 to-transparent rounded-full transition-all duration-1000"
                  style={{
                    animation: `premium-steam ${2.2 + i * 0.3}s ease-in-out infinite ${i * 0.4}s`,
                    transform: `rotate(${-20 + i * 10}deg)`
                  }}
                />
              ))}
            </div>

            {/* Ultra-Premium Coffee Cup Design with enhanced smooth animations */}
            <div className="flex items-center justify-center mb-8">
              <div className="relative">
                <div className="w-40 h-40 relative transform-gpu transition-all duration-1000 ease-in-out" style={{ animation: 'premium-cup-float 3.5s ease-in-out infinite' }}>
                  
                  {/* Premium Cup Base with enhanced design */}
                  <div className="absolute inset-0 bg-gradient-to-b from-orange-100 via-orange-150 to-orange-200 rounded-b-[2.8rem] border-4 border-orange-400/80 shadow-2xl shadow-orange-900/40 backdrop-blur-sm transition-all duration-1000 ease-in-out">
                    
                    {/* Enhanced cup highlights with smooth transitions */}
                    <div className="absolute top-3 left-3 w-12 h-18 bg-gradient-to-br from-white/95 via-white/70 to-white/25 rounded-full blur-[1px] transition-all duration-1000" />
                    <div className="absolute top-2 left-2 w-6 h-10 bg-white/85 rounded-full transition-all duration-700" />
                    <div className="absolute top-1 left-1 w-3 h-5 bg-white/95 rounded-full transition-all duration-500" />
                    
                    {/* Premium ceramic texture with enhanced depth */}
                    <div className="absolute inset-1 rounded-b-[2.5rem] bg-gradient-to-b from-orange-50/95 to-orange-100/75 shadow-inner shadow-orange-300/60 transition-all duration-1000" />
                    <div className="absolute inset-2 rounded-b-[2.2rem] bg-gradient-to-b from-orange-25/60 to-orange-75/35 shadow-inner shadow-orange-200/40 transition-all duration-800" />
                    
                    {/* Premium Coffee Liquid with enhanced realism and smooth filling */}
                    <div 
                      className="absolute bottom-1 left-1 right-1 bg-gradient-to-t from-amber-900 via-orange-800 to-orange-700 ease-in-out rounded-b-[2.5rem] shadow-inner shadow-amber-900/80 border border-orange-800/50"
                      style={{
                        height: `${Math.min((brewingStage + 1) * 18, 92)}%`,
                        transition: 'height 1.2s cubic-bezier(0.4, 0, 0.2, 1)', // Smoother easing
                      }}
                    >
                      {/* Premium coffee surface with enhanced realistic effects */}
                      <div className="absolute top-0 w-full h-4 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 rounded-full overflow-hidden transition-all duration-1000">
                        <div className="absolute top-1 left-1/3 w-1/3 h-1.5 bg-orange-400/75 rounded-full animate-pulse transition-all duration-700" />
                        <div className="absolute top-0.5 left-1/4 w-1/2 h-0.5 bg-orange-300/60 rounded-full transition-all duration-500" />
                      </div>
                      
                      {/* Enhanced coffee texture with smooth depth transitions */}
                      <div className="absolute top-5 w-full h-0.5 bg-orange-600/60 rounded-full transition-all duration-1000" />
                      <div className="absolute top-7 w-full h-0.5 bg-orange-600/45 rounded-full transition-all duration-800" />
                      <div className="absolute top-9 w-full h-0.5 bg-orange-600/30 rounded-full transition-all duration-600" />
                      
                      {/* Enhanced premium swirl effect with smoother rotation */}
                      <div 
                        className="absolute top-2 left-1/2 w-5 h-5 bg-gradient-radial from-orange-400/70 to-orange-500/50 rounded-full blur-sm transition-all duration-1000"
                        style={{ animation: 'premium-swirl 4s ease-in-out infinite' }}
                      />
                      <div 
                        className="absolute top-3 left-1/3 w-3 h-3 bg-orange-300/50 rounded-full blur-sm transition-all duration-800"
                        style={{ animation: 'premium-swirl 2.5s ease-in-out infinite reverse' }}
                      />
                    </div>
                    
                    {/* Enhanced floating coffee bubbles with smoother movement */}
                    {[...Array(15)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute bg-gradient-radial from-orange-400/85 to-orange-500/60 rounded-full shadow-sm transition-all duration-1000"
                        style={{
                          width: `${2.5 + Math.random() * 3}px`,
                          height: `${2.5 + Math.random() * 3}px`,
                          left: `${15 + i * 5}%`,
                          bottom: `${20 + Math.random() * 40}%`,
                          animation: `premium-bubble ${2.2 + Math.random()}s ease-in-out infinite ${i * 0.3}s`,
                        }}
                      />
                    ))}

                    {/* Premium foam layer with enhanced realism and smooth appearance */}
                    <div 
                      className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-white/99 via-orange-50/95 to-orange-100/60 rounded-t-[2.8rem] shadow-inner shadow-orange-200/70 border-t-2 border-white/90"
                      style={{
                        opacity: brewingStage > 2 ? 1 : 0,
                        transform: `translateY(${brewingStage > 2 ? 0 : 25}px) scale(${brewingStage > 2 ? 1 : 0.8})`,
                        transition: 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)', // Smoother entrance
                      }}
                    >
                      {/* Premium foam micro-bubbles with enhanced detail */}
                      {[...Array(12)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute bg-white/80 rounded-full shadow-sm transition-all duration-1000"
                          style={{
                            width: `${1.8 + Math.random() * 2.5}px`,
                            height: `${1.8 + Math.random() * 2.5}px`,
                            left: `${10 + i * 8}%`,
                            top: `${20 + Math.random() * 60}%`,
                          }}
                        />
                      ))}
                      <div className="absolute top-1.5 left-1/2 transform -translate-x-1/2 w-10 h-1.5 bg-white/70 rounded-full transition-all duration-1000" />
                    </div>
                  </div>
                  
                  {/* Premium Coffee Cup Handle with enhanced design and smooth transitions */}
                  <div className="absolute right-0 top-12 w-14 h-22 border-4 border-orange-400/85 rounded-r-full border-l-0 shadow-xl bg-gradient-to-r from-transparent to-orange-50/60 transition-all duration-1000">
                    <div className="absolute inset-1 border-2 border-orange-300/70 rounded-r-full border-l-0 transition-all duration-800" />
                    <div className="absolute top-3 right-1 w-2 h-12 bg-white/60 rounded-full transition-all duration-600" />
                    <div className="absolute top-2 right-0.5 w-0.5 h-10 bg-white/80 rounded-full transition-all duration-400" />
                  </div>
                  
                  {/* Premium Animated Icon Above Cup with enhanced smooth movement */}
                  <div className={`absolute -top-28 left-1/2 transform -translate-x-1/2 ${currentStep.color} transition-all duration-1000 ease-in-out`} style={{ animation: 'premium-icon-float 2.8s ease-in-out infinite' }}>
                    <CurrentIcon className="w-18 h-18 drop-shadow-xl transition-all duration-1000" style={{ animation: 'premium-icon-pulse 2.2s ease-in-out infinite' }} />
                    <div className={`absolute inset-0 w-18 h-18 ${currentStep.color.replace('text-', 'bg-')} opacity-30 rounded-full blur-xl animate-pulse transition-all duration-1000`} />
                    <div className={`absolute inset-2 w-14 h-14 ${currentStep.color.replace('text-', 'bg-')} opacity-20 rounded-full blur-lg animate-pulse transition-all duration-800`} style={{ animationDelay: '0.5s' }} />
                  </div>

                  {/* Premium coffee beans with enhanced realism and smoother movement */}
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute bg-gradient-to-b from-amber-800 to-amber-900 rounded-full shadow-lg border border-amber-700/60 transition-all duration-1000"
                      style={{
                        width: `${4 + Math.random() * 2}px`,
                        height: `${5.5 + Math.random() * 2.5}px`,
                        left: `${-30 + Math.random() * 160}%`,
                        top: `${85 + Math.random() * 30}%`,
                        transform: `rotate(${Math.random() * 360}deg)`,
                        animation: `premium-bean-float ${3.5 + Math.random() * 2}s ease-in-out infinite ${Math.random() * 2}s`,
                      }}
                    >
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-full bg-amber-700 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Premium brewing progress text with smooth transitions */}
            <div className="text-center relative z-10">
              <h3 className={`text-3xl font-bold mb-4 ${currentStep.color} transition-all duration-1000 ease-in-out`}>
                {currentStep.text}
              </h3>
              <p className="text-slate-700 text-lg font-medium mb-8 leading-relaxed max-w-md mx-auto transition-all duration-1000 ease-in-out">
                {currentStep.description}
              </p>
              
              {/* Premium progress dots with enhanced smooth transitions */}
              <div className="flex justify-center gap-5 mb-6">
                {brewingSteps.map((step, index) => (
                  <div key={index} className="relative">
                    <div
                      className={`w-4 h-4 rounded-full transition-all duration-1000 ease-in-out ${
                        index <= brewingStage 
                          ? `${step.color.replace('text-', 'bg-')} scale-125 shadow-lg` 
                          : 'bg-orange-200 scale-100'
                      }`}
                    />
                    {index === brewingStage && (
                      <div className={`absolute inset-0 w-4 h-4 ${step.color.replace('text-', 'bg-')} rounded-full opacity-50 animate-ping transition-all duration-1000`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Premium progress bar with smoother filling animation */}
              <div className="w-full bg-orange-100/90 rounded-full h-3 overflow-hidden shadow-inner">
                <div 
                  className={`h-full rounded-full ${currentStep.color.replace('text-', 'bg-')} shadow-sm`}
                  style={{ 
                    width: `${((brewingStage + 1) / brewingSteps.length) * 100}%`,
                    transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)', // Smoother progress filling
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Credit Warning and Ultra-Premium Generate Button */}
      <div className="flex flex-col items-center gap-4">
        {totalQuestions > 0 && (
          <div className="text-center">
            <p className="text-sm text-slate-600">
              This will consume <span className="font-semibold text-orange-600">{totalQuestions} credit{totalQuestions !== 1 ? 's' : ''}</span>
            </p>
            {credits < totalQuestions && (
              <p className="text-sm text-red-600 font-medium mt-1">
                Not enough credits! You need {totalQuestions} but have {credits}
              </p>
            )}
          </div>
        )}
        
        <div className="relative">
          <Button 
            onClick={onGenerate} 
            disabled={credits < totalQuestions || totalQuestions === 0 || isGenerating}
            className={`relative overflow-hidden bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 text-white rounded-2xl shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed ${
              isGenerating 
                ? 'py-8 px-32 text-xl scale-110 shadow-2xl shadow-orange-500/60 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500' 
                : 'py-4 px-12 text-lg hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/50 shadow-orange-500/30'
            }`}
            style={{
              transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)' // Smoother button transitions
            }}
          >
            {/* Premium Button Content */}
            <div className="relative z-10 flex items-center justify-center">
              {isGenerating ? (
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Coffee className="w-8 h-8 animate-spin" />
                    <div className="absolute inset-0 w-8 h-8 bg-white/50 rounded-full animate-ping" />
                    <div className="absolute inset-0 w-8 h-8 bg-amber-200/30 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                  </div>
                  <span className="font-bold tracking-wide">
                    Brewing Your Questions...
                  </span>
                  <Heart className="w-7 h-7 animate-pulse text-red-200" />
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6" />
                  <span>Generate Questions</span>
                  <Sparkles className="w-5 h-5" />
                </div>
              )}
            </div>

            {/* Ultra-Premium Background Animation for Loading State with smoother effects */}
            {isGenerating && (
              <>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-amber-500 to-orange-500 animate-pulse opacity-60 rounded-2xl"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-ping rounded-2xl"></div>
                <div className="absolute inset-0 bg-gradient-to-45 from-orange-300/40 to-amber-300/40 animate-pulse rounded-2xl" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/30 via-transparent to-amber-500/30 animate-pulse rounded-2xl" style={{ animationDelay: '1s' }}></div>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Enhanced Premium CSS animations with smoother easing */}
      <style>{`
        @keyframes premium-cup-float {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          33% { transform: translateY(-5px) rotate(1.5deg) scale(1.02); }
          66% { transform: translateY(-3px) rotate(-1deg) scale(1.01); }
        }
        
        @keyframes premium-swirl {
          0% { transform: rotate(0deg) translateX(4px) scale(1); opacity: 0.7; }
          50% { transform: rotate(180deg) translateX(5px) scale(1.15); opacity: 0.9; }
          100% { transform: rotate(360deg) translateX(4px) scale(1); opacity: 0.7; }
        }
        
        @keyframes premium-bubble {
          0%, 100% { transform: scale(1) translateY(0px); opacity: 0.8; }
          50% { transform: scale(1.4) translateY(-15px); opacity: 1; }
        }
        
        @keyframes premium-icon-float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-6px) scale(1.08); }
        }
        
        @keyframes premium-icon-pulse {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.2); filter: brightness(1.3); }
        }
        
        @keyframes premium-bean-float {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          50% { transform: translateY(-10px) rotate(180deg) scale(1.15); }
        }
        
        @keyframes premium-steam {
          0% { opacity: 0.8; transform: translateY(0px) scale(1) rotate(0deg); }
          50% { opacity: 1; transform: translateY(-20px) scale(1.4) rotate(8deg); }
          100% { opacity: 0.5; transform: translateY(-40px) scale(0.8) rotate(-5deg); }
        }
        
        @keyframes premium-float {
          0%, 100% { transform: translateY(0px) translateX(0px) scale(1); }
          50% { transform: translateY(-8px) translateX(4px) scale(1.15); }
        }
      `}</style>
    </div>
  );
};

export default QuestionGenerationForm;
