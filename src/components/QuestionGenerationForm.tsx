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

  // Cycle through brewing steps when generating
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
      }, 1200);
      
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

      {/* Enhanced Coffee Brewing Animation - Only visible when generating */}
      {isGenerating && (
        <div className="mb-8 relative">
          <div className={`relative p-12 rounded-3xl border-2 transition-all duration-1000 ${currentStep.bgColor} ${currentStep.accent} shadow-2xl ${currentStep.glowColor} backdrop-blur-sm`}>
            
            {/* Enhanced ambient background */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden">
              {/* Clean floating particles */}
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute w-2 h-2 ${currentStep.color.replace('text-', 'bg-')} opacity-25 rounded-full`}
                  style={{
                    left: `${15 + Math.random() * 70}%`,
                    top: `${15 + Math.random() * 70}%`,
                    animation: `clean-float ${3 + Math.random() * 2}s ease-in-out infinite ${Math.random() * 2}s`,
                  }}
                />
              ))}
              
              {/* Refined warm glow effects */}
              <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-gradient-radial from-orange-300/15 via-orange-200/8 to-transparent rounded-full blur-2xl animate-pulse" />
            </div>

            {/* Clean animated steam */}
            <div className="absolute top-6 right-8 flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-16 bg-gradient-to-t from-orange-300/60 via-orange-200/40 to-transparent rounded-full"
                  style={{
                    animation: `clean-steam ${2 + i * 0.3}s ease-in-out infinite ${i * 0.4}s`,
                    transform: `rotate(${-10 + i * 10}deg)`
                  }}
                />
              ))}
            </div>

            {/* Clean Premium Coffee Cup Design */}
            <div className="flex items-center justify-center mb-8">
              <div className="relative">
                <div className="w-32 h-32 relative transform-gpu" style={{ animation: 'clean-cup-float 3s ease-in-out infinite' }}>
                  
                  {/* Refined Cup Base */}
                  <div className="absolute inset-0 bg-gradient-to-b from-orange-100 via-orange-150 to-orange-200 rounded-b-[2rem] border-3 border-orange-400 shadow-xl shadow-orange-900/30 backdrop-blur-sm">
                    
                    {/* Clean cup highlights */}
                    <div className="absolute top-2 left-2 w-8 h-12 bg-gradient-to-br from-white/80 via-white/50 to-white/20 rounded-full blur-[0.5px]" />
                    <div className="absolute top-1 left-1 w-4 h-6 bg-white/70 rounded-full" />
                    
                    {/* Refined ceramic texture */}
                    <div className="absolute inset-1 rounded-b-[1.8rem] bg-gradient-to-b from-orange-50/80 to-orange-100/60 shadow-inner shadow-orange-300/40" />
                    
                    {/* Clean Coffee Liquid */}
                    <div 
                      className="absolute bottom-0.5 left-0.5 right-0.5 bg-gradient-to-t from-amber-800 via-orange-700 to-orange-600 transition-all duration-2000 ease-out rounded-b-[1.8rem] shadow-inner shadow-amber-800/60"
                      style={{
                        height: `${Math.min((brewingStage + 1) * 18, 85)}%`,
                      }}
                    >
                      {/* Clean coffee surface */}
                      <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 rounded-full">
                        <div className="absolute top-0.5 left-1/3 w-1/3 h-0.5 bg-orange-300/60 rounded-full animate-pulse" />
                      </div>
                      
                      {/* Clean coffee texture lines */}
                      <div className="absolute top-3 w-full h-0.5 bg-orange-500/40 rounded-full" />
                      <div className="absolute top-5 w-full h-0.5 bg-orange-500/25 rounded-full" />
                      
                      {/* Clean swirl effect */}
                      <div 
                        className="absolute top-1 left-1/2 w-3 h-3 bg-orange-400/50 rounded-full blur-sm"
                        style={{ animation: 'clean-swirl 4s linear infinite' }}
                      />
                    </div>
                    
                    {/* Clean floating bubbles */}
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute bg-gradient-radial from-orange-300/70 to-orange-400/40 rounded-full"
                        style={{
                          width: `${2 + Math.random() * 3}px`,
                          height: `${2 + Math.random() * 3}px`,
                          left: `${20 + i * 8}%`,
                          bottom: `${15 + Math.random() * 30}%`,
                          animation: `clean-bubble ${2 + Math.random()}s ease-in-out infinite ${i * 0.3}s`,
                        }}
                      />
                    ))}

                    {/* Clean foam layer */}
                    <div 
                      className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white/95 via-orange-50/80 to-orange-100/40 rounded-t-[2rem] transition-all duration-2000 shadow-inner shadow-orange-200/50"
                      style={{
                        opacity: brewingStage > 2 ? 1 : 0,
                        transform: `translateY(${brewingStage > 2 ? 0 : 15}px) scale(${brewingStage > 2 ? 1 : 0.9})`,
                      }}
                    >
                      {/* Clean foam micro-bubbles */}
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute bg-white/60 rounded-full"
                          style={{
                            width: `${1 + Math.random() * 1.5}px`,
                            height: `${1 + Math.random() * 1.5}px`,
                            left: `${15 + i * 12}%`,
                            top: `${30 + Math.random() * 40}%`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Clean Coffee Cup Handle */}
                  <div className="absolute right-0 top-8 w-10 h-16 border-3 border-orange-400 rounded-r-full border-l-0 shadow-lg bg-gradient-to-r from-transparent to-orange-50/40">
                    <div className="absolute inset-1 border-2 border-orange-300/50 rounded-r-full border-l-0" />
                    <div className="absolute top-2 right-0.5 w-1 h-8 bg-white/40 rounded-full" />
                  </div>
                  
                  {/* Clean Animated Icon Above Cup */}
                  <div className={`absolute -top-20 left-1/2 transform -translate-x-1/2 ${currentStep.color} transition-all duration-700`} style={{ animation: 'clean-icon-float 2.5s ease-in-out infinite' }}>
                    <CurrentIcon className="w-14 h-14 drop-shadow-lg" style={{ animation: 'clean-icon-pulse 2s ease-in-out infinite' }} />
                    <div className={`absolute inset-0 w-14 h-14 ${currentStep.color.replace('text-', 'bg-')} opacity-20 rounded-full blur-lg animate-pulse`} />
                  </div>

                  {/* Clean coffee beans */}
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute bg-gradient-to-b from-amber-700 to-amber-800 rounded-full shadow-md"
                      style={{
                        width: `${3 + Math.random()}px`,
                        height: `${4 + Math.random() * 1.5}px`,
                        left: `${-20 + Math.random() * 140}%`,
                        top: `${80 + Math.random() * 30}%`,
                        transform: `rotate(${Math.random() * 360}deg)`,
                        animation: `clean-bean-float ${3 + Math.random()}s ease-in-out infinite ${Math.random()}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Clean brewing progress text */}
            <div className="text-center relative z-10">
              <h3 className={`text-2xl font-bold mb-3 ${currentStep.color} transition-all duration-1000`}>
                {currentStep.text}
              </h3>
              <p className="text-slate-700 text-base font-medium mb-6 leading-relaxed max-w-sm mx-auto">
                {currentStep.description}
              </p>
              
              {/* Clean progress dots */}
              <div className="flex justify-center gap-3 mb-4">
                {brewingSteps.map((step, index) => (
                  <div key={index} className="relative">
                    <div
                      className={`w-3 h-3 rounded-full transition-all duration-700 ${
                        index <= brewingStage 
                          ? `${step.color.replace('text-', 'bg-')} scale-125 shadow-lg` 
                          : 'bg-orange-200 scale-100'
                      }`}
                    />
                    {index === brewingStage && (
                      <div className={`absolute inset-0 w-3 h-3 ${step.color.replace('text-', 'bg-')} rounded-full opacity-40 animate-ping`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Clean progress bar */}
              <div className="w-full bg-orange-100/70 rounded-full h-2 overflow-hidden shadow-inner">
                <div 
                  className={`h-full transition-all duration-1000 rounded-full ${currentStep.color.replace('text-', 'bg-')}`}
                  style={{ 
                    width: `${((brewingStage + 1) / brewingSteps.length) * 100}%`,
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
            className={`relative overflow-hidden bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 text-white rounded-2xl shadow-xl transition-all duration-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed ${
              isGenerating 
                ? 'py-8 px-28 text-xl scale-110 shadow-2xl shadow-orange-500/60 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500' 
                : 'py-4 px-12 text-lg hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/50 shadow-orange-500/30'
            }`}
          >
            {/* Premium Button Content */}
            <div className="relative z-10 flex items-center justify-center">
              {isGenerating ? (
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Coffee className="w-8 h-8 animate-spin" />
                    <div className="absolute inset-0 w-8 h-8 bg-white/40 rounded-full animate-ping" />
                    <div className="absolute inset-0 w-8 h-8 bg-amber-200/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
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

            {/* Ultra-Premium Background Animation for Loading State */}
            {isGenerating && (
              <>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-amber-500 to-orange-500 animate-pulse opacity-50 rounded-2xl"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-ping rounded-2xl"></div>
                <div className="absolute inset-0 bg-gradient-to-45 from-orange-300/30 to-amber-300/30 animate-pulse rounded-2xl" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-transparent to-amber-500/20 animate-pulse rounded-2xl" style={{ animationDelay: '1s' }}></div>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Clean CSS animations */}
      <style>{`
        @keyframes clean-cup-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-3px) rotate(1deg); }
        }
        
        @keyframes clean-swirl {
          0% { transform: rotate(0deg) translateX(2px); opacity: 0.5; }
          100% { transform: rotate(360deg) translateX(2px); opacity: 0.5; }
        }
        
        @keyframes clean-bubble {
          0%, 100% { transform: scale(1) translateY(0px); opacity: 0.7; }
          50% { transform: scale(1.2) translateY(-8px); opacity: 1; }
        }
        
        @keyframes clean-icon-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        
        @keyframes clean-icon-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes clean-bean-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-5px) rotate(180deg); }
        }
        
        @keyframes clean-steam {
          0% { opacity: 0.6; transform: translateY(0px) scale(1); }
          50% { opacity: 1; transform: translateY(-12px) scale(1.2); }
          100% { opacity: 0.3; transform: translateY(-24px) scale(0.8); }
        }
        
        @keyframes clean-float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-4px) translateX(2px); }
        }
      `}</style>
    </div>
  );
};

export default QuestionGenerationForm;
