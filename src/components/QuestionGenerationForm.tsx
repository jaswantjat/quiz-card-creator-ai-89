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

            {/* Enhanced coffee shop scene with ultra-smooth coffee cup */}
            <div className="flex items-center justify-center mb-10">
              <div className="relative">
                {/* Ultra-enhanced coffee cup design with premium aesthetics */}
                <div className="w-32 h-32 relative overflow-hidden transform-gpu" style={{ animation: 'enhanced-cup-float 4s ease-in-out infinite' }}>
                  
                  {/* Cup base with enhanced 3D effect */}
                  <div className="absolute inset-0 bg-gradient-to-b from-orange-50 via-orange-100 to-orange-200 rounded-b-[2rem] border-4 border-orange-400 shadow-2xl shadow-orange-900/30 backdrop-blur-sm">
                    
                    {/* Premium cup shine and reflections */}
                    <div className="absolute top-2 left-2 w-8 h-12 bg-gradient-to-br from-white/80 via-white/50 to-white/20 rounded-full blur-[1px] opacity-90" />
                    <div className="absolute top-1 left-1 w-4 h-6 bg-white/70 rounded-full" />
                    <div className="absolute top-4 left-6 w-2 h-8 bg-white/30 rounded-full" />
                    
                    {/* Enhanced ceramic texture */}
                    <div className="absolute inset-2 rounded-b-[1.5rem] bg-gradient-to-b from-orange-50/80 to-orange-100/60 shadow-inner shadow-orange-300/40" />
                    
                    {/* Enhanced coffee liquid with ultra-smooth fill animation */}
                    <div 
                      className="absolute bottom-1 left-1 right-1 bg-gradient-to-t from-amber-900 via-orange-800 to-orange-700 transition-all duration-2000 ease-out rounded-b-[1.5rem] shadow-inner shadow-amber-900/60 overflow-hidden"
                      style={{
                        height: `${Math.min((brewingStage + 1) * 18, 85)}%`,
                        animation: 'enhanced-liquid-fill 6s ease-in-out infinite'
                      }}
                    >
                      {/* Ultra-realistic coffee surface with dynamic ripples */}
                      <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 opacity-95 rounded-full shadow-sm">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-400/60 to-transparent animate-pulse" />
                        <div className="absolute top-0.5 left-1/4 w-1/2 h-0.5 bg-orange-400/40 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
                      </div>
                      
                      {/* Enhanced coffee texture with depth */}
                      <div className="absolute top-3 w-full h-0.5 bg-orange-600/40 opacity-70 rounded-full" />
                      <div className="absolute top-5 w-full h-0.5 bg-orange-600/25 opacity-50 rounded-full" />
                      <div className="absolute top-7 w-full h-0.5 bg-orange-600/15 opacity-30 rounded-full" />
                      
                      {/* Premium coffee swirl effect */}
                      <div 
                        className="absolute top-1 left-1/2 w-3 h-3 bg-orange-500/30 rounded-full blur-sm"
                        style={{ animation: 'enhanced-swirl 3s linear infinite' }}
                      />
                    </div>
                    
                    {/* Ultra-enhanced floating coffee bubbles with physics */}
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute bg-gradient-radial from-orange-300/70 to-orange-400/40 rounded-full shadow-sm"
                        style={{
                          width: `${2 + Math.random() * 4}px`,
                          height: `${2 + Math.random() * 4}px`,
                          left: `${15 + i * 8}%`,
                          bottom: `${10 + Math.random() * 30}%`,
                          animation: `enhanced-bubble-physics ${2 + Math.random() * 2}s ease-in-out infinite ${i * 0.4}s`,
                          filter: 'blur(0.5px)'
                        }}
                      />
                    ))}

                    {/* Ultra-premium coffee foam with micro-bubbles */}
                    <div 
                      className="absolute top-0.5 left-0.5 right-0.5 h-5 bg-gradient-to-b from-white/95 via-orange-50/80 to-orange-100/40 rounded-t-[1.5rem] transition-all duration-2000 shadow-inner shadow-orange-200/50 border border-orange-200/30"
                      style={{
                        opacity: brewingStage > 2 ? 1 : 0,
                        transform: `translateY(${brewingStage > 2 ? 0 : 15}px) scale(${brewingStage > 2 ? 1 : 0.8})`,
                        animation: brewingStage > 2 ? 'enhanced-foam-settle 3s ease-out' : 'none'
                      }}
                    >
                      {/* Foam micro-texture */}
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute bg-white/60 rounded-full"
                          style={{
                            width: `${1 + Math.random() * 2}px`,
                            height: `${1 + Math.random() * 2}px`,
                            left: `${10 + i * 10}%`,
                            top: `${20 + Math.random() * 60}%`,
                            animation: `enhanced-micro-bubble ${3 + Math.random()}s ease-in-out infinite ${i * 0.3}s`
                          }}
                        />
                      ))}
                      
                      {/* Foam gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-orange-50/30 to-transparent rounded-t-[1.5rem]" />
                    </div>
                  </div>
                  
                  {/* Ultra-enhanced coffee cup handle with premium design */}
                  <div className="absolute right-0 top-8 w-10 h-16 border-4 border-orange-400 rounded-r-full border-l-0 shadow-xl bg-gradient-to-r from-transparent via-orange-50/20 to-orange-100/40 backdrop-blur-sm">
                    {/* Handle inner shadow for depth */}
                    <div className="absolute inset-1 border-2 border-orange-300/50 rounded-r-full border-l-0" />
                    {/* Handle highlight */}
                    <div className="absolute top-2 right-1 w-1 h-8 bg-white/40 rounded-full blur-[0.5px]" />
                  </div>
                  
                  {/* Ultra-enhanced animated icon above cup */}
                  <div className={`absolute -top-20 left-1/2 transform -translate-x-1/2 ${currentStep.color} transition-all duration-700`} style={{ animation: 'enhanced-icon-float 3s ease-in-out infinite' }}>
                    <div className="relative">
                      <CurrentIcon className="w-14 h-14 drop-shadow-2xl filter" style={{ animation: 'enhanced-icon-pulse 2s ease-in-out infinite' }} />
                      {/* Enhanced icon glow with premium effects */}
                      <div className={`absolute inset-0 w-14 h-14 ${currentStep.color.replace('text-', 'bg-')} opacity-25 rounded-full blur-xl animate-pulse`} />
                      <div className={`absolute inset-0 w-14 h-14 ${currentStep.color.replace('text-', 'bg-')} opacity-10 rounded-full blur-2xl`} style={{ animation: 'enhanced-icon-glow 4s ease-in-out infinite' }} />
                      <div className={`absolute -inset-2 w-18 h-18 ${currentStep.color.replace('text-', 'bg-')} opacity-5 rounded-full blur-3xl animate-ping`} />
                    </div>
                  </div>

                  {/* Premium coffee beans with enhanced physics */}
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute bg-gradient-to-b from-amber-800 via-orange-900 to-amber-900 rounded-full shadow-lg border border-orange-800/30"
                      style={{
                        width: `${3 + Math.random()}px`,
                        height: `${4 + Math.random() * 1.5}px`,
                        left: `${-30 + Math.random() * 160}%`,
                        top: `${80 + Math.random() * 40}%`,
                        transform: `rotate(${Math.random() * 360}deg)`,
                        animation: `enhanced-bean-float ${4 + Math.random() * 2}s ease-in-out infinite ${Math.random() * 2}s`,
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                      }}
                    >
                      {/* Bean highlight */}
                      <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-orange-600/60 rounded-full blur-[0.5px]" />
                    </div>
                  ))}

                  {/* Premium coffee shop accessories */}
                  <div className="absolute -left-10 top-16 w-5 h-7 bg-gradient-to-b from-orange-800 to-amber-900 rounded-lg opacity-40 transform rotate-12 shadow-lg" />
                  <div className="absolute -right-8 top-20 w-4 h-5 bg-gradient-to-b from-orange-700 to-orange-800 rounded opacity-35 transform -rotate-45 shadow-md" />
                </div>
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

      {/* Ultra-enhanced CSS animations for premium coffee mug */}
      <style>{`
        @keyframes enhanced-cup-float {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          25% { transform: translateY(-3px) rotate(0.5deg) scale(1.02); }
          50% { transform: translateY(-1px) rotate(-0.3deg) scale(1.01); }
          75% { transform: translateY(-2px) rotate(0.2deg) scale(1.015); }
        }
        
        @keyframes enhanced-liquid-fill {
          0% { transform: translateY(2px); box-shadow: inset 0 4px 8px rgba(146, 64, 14, 0.3); }
          50% { transform: translateY(-1px); box-shadow: inset 0 6px 12px rgba(146, 64, 14, 0.4); }
          100% { transform: translateY(2px); box-shadow: inset 0 4px 8px rgba(146, 64, 14, 0.3); }
        }
        
        @keyframes enhanced-swirl {
          0% { transform: rotate(0deg) translateX(2px); opacity: 0.6; }
          50% { transform: rotate(180deg) translateX(1px); opacity: 0.8; }
          100% { transform: rotate(360deg) translateX(2px); opacity: 0.6; }
        }
        
        @keyframes enhanced-foam-settle {
          0% { transform: translateY(15px) scale(0.8); opacity: 0; }
          60% { transform: translateY(-2px) scale(1.05); opacity: 0.9; }
          100% { transform: translateY(0px) scale(1); opacity: 1; }
        }
        
        @keyframes enhanced-micro-bubble {
          0%, 100% { transform: scale(1) translateY(0px); opacity: 0.6; }
          50% { transform: scale(1.2) translateY(-1px); opacity: 0.9; }
        }
        
        @keyframes enhanced-bubble-physics {
          0% { opacity: 0; transform: translateY(0px) scale(0.5) rotate(0deg); }
          30% { opacity: 0.8; transform: translateY(-8px) scale(1) rotate(90deg); }
          70% { opacity: 1; transform: translateY(-16px) scale(1.2) rotate(180deg); }
          100% { opacity: 0; transform: translateY(-28px) scale(0.3) rotate(270deg); }
        }
        
        @keyframes enhanced-icon-float {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          33% { transform: translateY(-4px) translateX(2px) rotate(2deg); }
          66% { transform: translateY(-2px) translateX(-1px) rotate(-1deg); }
        }
        
        @keyframes enhanced-icon-pulse {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 4px 8px rgba(234, 88, 12, 0.3)); }
          50% { transform: scale(1.1); filter: drop-shadow(0 6px 16px rgba(234, 88, 12, 0.5)); }
        }
        
        @keyframes enhanced-icon-glow {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.2); }
        }
        
        @keyframes enhanced-bean-float {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); }
          25% { transform: translateY(-3px) translateX(1px) rotate(15deg) scale(1.1); }
          50% { transform: translateY(-1px) translateX(-0.5px) rotate(-8deg) scale(1.05); }
          75% { transform: translateY(-2px) translateX(0.5px) rotate(5deg) scale(1.08); }
        }
        
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
