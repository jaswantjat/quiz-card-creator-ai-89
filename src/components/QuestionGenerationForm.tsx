
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

  // Enhanced coffee brewing storyline with rich animations and improved color scheme
  const brewingSteps = [
    { 
      icon: Coffee, 
      text: "Selecting premium beans...", 
      description: "Handpicking the finest question seeds from our curated collection",
      color: "text-orange-700",
      bgColor: "bg-gradient-to-br from-orange-50/90 via-white to-amber-50/80",
      accent: "border-orange-300/60",
      glowColor: "shadow-orange-500/15"
    },
    { 
      icon: Lightbulb, 
      text: "Grinding fresh concepts...", 
      description: "Transforming brilliant ideas into perfect educational particles",
      color: "text-amber-700",
      bgColor: "bg-gradient-to-br from-amber-50/90 via-white to-orange-50/80",
      accent: "border-amber-300/60",
      glowColor: "shadow-amber-500/15"
    },
    { 
      icon: Brain, 
      text: "Brewing intelligence...", 
      description: "Infusing AI wisdom at the optimal temperature for learning",
      color: "text-orange-600",
      bgColor: "bg-gradient-to-br from-slate-50/90 via-white to-orange-50/80",
      accent: "border-slate-300/60",
      glowColor: "shadow-orange-500/20"
    },
    { 
      icon: BookOpen, 
      text: "Extracting knowledge...", 
      description: "Distilling pure educational essence with precision and care",
      color: "text-slate-700",
      bgColor: "bg-gradient-to-br from-slate-50/90 via-white to-amber-50/80",
      accent: "border-slate-300/60",
      glowColor: "shadow-slate-500/15"
    },
    { 
      icon: Sparkles, 
      text: "Perfecting the blend!", 
      description: "Your custom question brew is ready to serve - crafted to perfection",
      color: "text-orange-700",
      bgColor: "bg-gradient-to-br from-orange-50/90 via-white to-amber-50/90",
      accent: "border-orange-400/60",
      glowColor: "shadow-orange-500/25"
    }
  ];

  // Cycle through brewing steps when generating - increased timing for better experience
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
      }, 1200); // Increased from 2000ms to 1200ms for smoother transitions
      
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
            
            {/* Enhanced Coffee Shop Ambiance */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden">
              {/* Animated background particles with improved colors */}
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute w-1.5 h-1.5 ${currentStep.color.replace('text-', 'bg-')} opacity-20 rounded-full`}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `enhanced-float ${4 + Math.random() * 3}s ease-in-out infinite ${Math.random() * 2}s`,
                    animationDirection: Math.random() > 0.5 ? 'normal' : 'reverse'
                  }}
                />
              ))}
              
              {/* Enhanced warm glow effect */}
              <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-40 bg-gradient-radial from-orange-400/15 via-orange-300/10 to-transparent rounded-full blur-2xl animate-pulse`} />
              <div className={`absolute bottom-0 right-0 w-32 h-32 bg-gradient-radial from-amber-400/10 to-transparent rounded-full blur-xl animate-pulse`} style={{ animationDelay: '1s' }} />
            </div>

            {/* Enhanced animated coffee steam */}
            <div className="absolute top-8 right-12 flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="relative"
                >
                  <div
                    className="w-0.5 h-16 bg-gradient-to-t from-orange-400/60 via-orange-300/40 to-transparent rounded-full"
                    style={{
                      animation: `enhanced-steam ${2.5 + i * 0.4}s ease-in-out infinite ${i * 0.3}s`,
                      transform: `rotate(${-15 + i * 6}deg)`
                    }}
                  />
                  {/* Enhanced steam wisps */}
                  <div
                    className="absolute top-0 w-1 h-10 bg-gradient-to-t from-orange-300/30 to-transparent rounded-full"
                    style={{
                      animation: `enhanced-wisp ${3.5 + i * 0.6}s ease-in-out infinite ${i * 0.5}s`,
                      left: `${-2 + i}px`
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Enhanced coffee shop scene */}
            <div className="flex items-center justify-center mb-10">
              <div className="relative">
                {/* Enhanced coffee cup design */}
                <div className="w-28 h-28 bg-gradient-to-b from-orange-50 via-orange-100 to-orange-200 rounded-b-3xl border-4 border-orange-400 relative overflow-hidden shadow-xl">
                  
                  {/* Enhanced cup highlight */}
                  <div className="absolute top-3 left-3 w-5 h-7 bg-gradient-to-br from-white/70 to-white/30 rounded-full blur-sm" />
                  <div className="absolute top-2 left-2 w-3 h-4 bg-white/50 rounded-full" />
                  
                  {/* Enhanced coffee liquid with animated fill */}
                  <div 
                    className="absolute bottom-0 w-full bg-gradient-to-t from-orange-900 via-orange-800 to-orange-700 transition-all duration-2000 rounded-b-2xl shadow-inner overflow-hidden"
                    style={{
                      height: `${Math.min((brewingStage + 1) * 16, 82)}%`,
                      animation: 'enhanced-bubble 4s ease-in-out infinite'
                    }}
                  >
                    {/* Enhanced coffee surface with realistic ripples */}
                    <div className="absolute top-0 w-full h-1.5 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 opacity-90">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-400/50 to-transparent animate-pulse" />
                    </div>
                    
                    {/* Coffee texture lines */}
                    <div className="absolute top-2 w-full h-0.5 bg-orange-600/30 opacity-60" />
                    <div className="absolute top-4 w-full h-0.5 bg-orange-600/20 opacity-40" />
                  </div>
                  
                  {/* Enhanced floating coffee bubbles */}
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute bg-orange-300/60 rounded-full"
                      style={{
                        width: `${3 + Math.random() * 5}px`,
                        height: `${3 + Math.random() * 5}px`,
                        left: `${12 + i * 10}%`,
                        bottom: `${8 + Math.random() * 25}%`,
                        animation: `enhanced-bubble-rise ${2.5 + Math.random() * 2}s ease-in-out infinite ${i * 0.6}s`
                      }}
                    />
                  ))}

                  {/* Enhanced coffee foam */}
                  <div 
                    className="absolute top-1 w-full h-4 bg-gradient-to-b from-white/90 to-white/50 rounded-t-2xl transition-all duration-2000 shadow-inner"
                    style={{
                      opacity: brewingStage > 2 ? 1 : 0,
                      transform: `translateY(${brewingStage > 2 ? 0 : 20}px)`
                    }}
                  >
                    {/* Foam texture */}
                    <div className="absolute inset-0 bg-gradient-to-b from-orange-100/20 to-transparent rounded-t-2xl" />
                  </div>
                </div>
                
                {/* Enhanced coffee cup handle */}
                <div className="absolute right-0 top-6 w-8 h-12 border-4 border-orange-400 rounded-r-full border-l-0 shadow-lg bg-gradient-to-r from-transparent to-orange-50/30" />
                
                {/* Enhanced animated icon above cup */}
                <div className={`absolute -top-16 left-1/2 transform -translate-x-1/2 ${currentStep.color} transition-all duration-700`}>
                  <div className="relative">
                    <CurrentIcon className="w-12 h-12 animate-bounce drop-shadow-xl" />
                    {/* Enhanced icon glow with pulsing effect */}
                    <div className={`absolute inset-0 w-12 h-12 ${currentStep.color.replace('text-', 'bg-')} opacity-30 rounded-full blur-lg animate-pulse`} />
                    <div className={`absolute inset-0 w-12 h-12 ${currentStep.color.replace('text-', 'bg-')} opacity-10 rounded-full blur-xl animate-ping`} />
                  </div>
                </div>

                {/* Enhanced coffee beans scattered around */}
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2.5 h-3.5 bg-gradient-to-b from-orange-800 to-orange-900 rounded-full opacity-50 shadow-sm"
                    style={{
                      left: `${-25 + Math.random() * 150}%`,
                      top: `${75 + Math.random() * 50}%`,
                      transform: `rotate(${Math.random() * 360}deg)`,
                      animation: `enhanced-gentle-float ${5 + Math.random() * 3}s ease-in-out infinite ${Math.random() * 2}s`
                    }}
                  />
                ))}

                {/* Coffee shop accessories */}
                <div className="absolute -left-8 top-12 w-4 h-6 bg-orange-800 rounded opacity-30 transform rotate-12" />
                <div className="absolute -right-6 top-16 w-3 h-4 bg-orange-700 rounded opacity-25 transform -rotate-45" />
              </div>
            </div>

            {/* Enhanced brewing progress text */}
            <div className="text-center relative z-10">
              <h3 className={`text-3xl font-bold mb-4 ${currentStep.color} transition-all duration-1000 drop-shadow-md`}>
                {currentStep.text}
              </h3>
              <p className="text-slate-700 text-lg font-medium mb-8 leading-relaxed max-w-md mx-auto">
                {currentStep.description}
              </p>
              
              {/* Enhanced progress dots with coffee bean shapes */}
              <div className="flex justify-center gap-4 mb-6">
                {brewingSteps.map((step, index) => (
                  <div key={index} className="relative">
                    <div
                      className={`w-5 h-5 rounded-full transition-all duration-1000 ${
                        index <= brewingStage 
                          ? `${step.color.replace('text-', 'bg-')} scale-125 shadow-lg` 
                          : 'bg-orange-200 scale-100'
                      }`}
                    />
                    {index <= brewingStage && (
                      <div className={`absolute inset-0 w-5 h-5 ${step.color.replace('text-', 'bg-')} rounded-full opacity-40 animate-ping`} />
                    )}
                    {index === brewingStage && (
                      <div className={`absolute inset-0 w-5 h-5 ${step.color.replace('text-', 'bg-')} rounded-full opacity-20 animate-pulse`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Enhanced brewing progress bar */}
              <div className="w-full bg-orange-100/60 rounded-full h-3 overflow-hidden shadow-inner">
                <div 
                  className={`h-full ${currentStep.color.replace('text-', 'bg-')} transition-all duration-1500 rounded-full shadow-sm`}
                  style={{ 
                    width: `${((brewingStage + 1) / brewingSteps.length) * 100}%`,
                    background: `linear-gradient(90deg, ${currentStep.color.includes('orange') ? '#ea580c' : '#d97706'}, ${currentStep.color.includes('orange') ? '#f97316' : '#f59e0b'})`
                  }}
                />
              </div>
            </div>

            {/* Enhanced coffee aroma lines */}
            <div className="absolute top-10 left-10 opacity-40">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`w-10 h-0.5 ${currentStep.color.replace('text-', 'bg-')} rounded-full mb-1.5 opacity-60`}
                  style={{
                    animation: `enhanced-aroma ${2.5 + i * 0.6}s ease-in-out infinite ${i * 0.4}s`,
                    transformOrigin: 'left center'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Credit Warning and Enhanced Generate Button */}
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
            className={`relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl shadow-xl transition-all duration-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed ${
              isGenerating 
                ? 'py-7 px-24 text-xl scale-110 shadow-2xl shadow-orange-500/50 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500' 
                : 'py-4 px-12 text-lg hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/40 shadow-orange-500/30'
            }`}
          >
            {/* Enhanced Button Content */}
            <div className="relative z-10 flex items-center justify-center">
              {isGenerating ? (
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <Coffee className="w-7 h-7 animate-spin" />
                    <div className="absolute inset-0 w-7 h-7 bg-white/30 rounded-full animate-ping" />
                  </div>
                  <span className="font-semibold tracking-wide">
                    Brewing Your Questions...
                  </span>
                  <Heart className="w-6 h-6 animate-pulse text-red-200" />
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6" />
                  <span>Generate Questions</span>
                  <Sparkles className="w-5 h-5" />
                </div>
              )}
            </div>

            {/* Enhanced Background Animation for Loading State */}
            {isGenerating && (
              <>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400 animate-pulse opacity-40 rounded-2xl"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-ping rounded-2xl"></div>
                <div className="absolute inset-0 bg-gradient-to-45 from-orange-300/20 to-amber-300/20 animate-pulse rounded-2xl" style={{ animationDelay: '0.5s' }}></div>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Enhanced CSS animations */}
      <style jsx>{`
        @keyframes enhanced-steam {
          0% { opacity: 0.6; transform: translateY(0px) scale(1) rotate(0deg); }
          50% { opacity: 0.9; transform: translateY(-12px) scale(1.2) rotate(5deg); }
          100% { opacity: 0.2; transform: translateY(-24px) scale(0.7) rotate(-3deg); }
        }
        
        @keyframes enhanced-wisp {
          0% { opacity: 0.3; transform: translateX(0px) rotate(0deg) scale(1); }
          50% { opacity: 0.7; transform: translateX(6px) rotate(15deg) scale(1.1); }
          100% { opacity: 0.1; transform: translateX(-3px) rotate(-8deg) scale(0.8); }
        }
        
        @keyframes enhanced-bubble {
          0%, 100% { transform: translateY(0px) scale(1); }
          25% { transform: translateY(-1px) scale(1.01); }
          50% { transform: translateY(-2px) scale(1.02); }
          75% { transform: translateY(-1px) scale(1.01); }
        }
        
        @keyframes enhanced-bubble-rise {
          0% { opacity: 0; transform: translateY(0px) scale(0.6); }
          30% { opacity: 0.8; transform: translateY(-6px) scale(1); }
          70% { opacity: 1; transform: translateY(-12px) scale(1.1); }
          100% { opacity: 0; transform: translateY(-20px) scale(0.4); }
        }
        
        @keyframes enhanced-gentle-float {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          25% { transform: translateY(-2px) rotate(3deg) scale(1.05); }
          50% { transform: translateY(-4px) rotate(-2deg) scale(1.1); }
          75% { transform: translateY(-2px) rotate(1deg) scale(1.05); }
        }
        
        @keyframes enhanced-aroma {
          0% { transform: scaleX(1) translateX(0px) rotate(0deg); opacity: 0.4; }
          50% { transform: scaleX(1.3) translateX(4px) rotate(2deg); opacity: 0.8; }
          100% { transform: scaleX(0.7) translateX(-2px) rotate(-1deg); opacity: 0.2; }
        }
        
        @keyframes enhanced-float {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          25% { transform: translateY(-6px) translateX(2px) rotate(2deg); }
          50% { transform: translateY(-3px) translateX(-1px) rotate(-1deg); }
          75% { transform: translateY(-8px) translateX(1px) rotate(1deg); }
        }
      `}</style>
    </div>
  );
};

export default QuestionGenerationForm;
