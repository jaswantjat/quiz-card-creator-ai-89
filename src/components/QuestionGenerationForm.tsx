
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

  // Enhanced coffee brewing storyline with perfect color harmony
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

      {/* Premium Coffee Brewing Animation - Only visible when generating */}
      {isGenerating && (
        <div className="mb-8 relative">
          <div className={`relative p-12 rounded-3xl border-2 transition-all duration-1000 ${currentStep.bgColor} ${currentStep.accent} shadow-2xl ${currentStep.glowColor} backdrop-blur-sm`}>
            
            {/* Enhanced Coffee Shop Ambiance */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden">
              {/* Premium animated background particles */}
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute w-1.5 h-1.5 ${currentStep.color.replace('text-', 'bg-')} opacity-20 rounded-full`}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `premium-float ${4 + Math.random() * 3}s ease-in-out infinite ${Math.random() * 2}s`,
                    animationDirection: Math.random() > 0.5 ? 'normal' : 'reverse'
                  }}
                />
              ))}
              
              {/* Premium warm glow effects */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-48 h-48 bg-gradient-radial from-orange-400/20 via-orange-300/10 to-transparent rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-radial from-amber-400/15 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            {/* Premium animated coffee steam */}
            <div className="absolute top-8 right-12 flex gap-1">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="relative"
                >
                  <div
                    className="w-0.5 h-20 bg-gradient-to-t from-orange-400/70 via-orange-300/50 to-transparent rounded-full"
                    style={{
                      animation: `premium-steam ${2.5 + i * 0.4}s ease-in-out infinite ${i * 0.3}s`,
                      transform: `rotate(${-20 + i * 7}deg)`
                    }}
                  />
                  {/* Premium steam wisps */}
                  <div
                    className="absolute top-0 w-1 h-12 bg-gradient-to-t from-orange-300/40 to-transparent rounded-full"
                    style={{
                      animation: `premium-wisp ${3.5 + i * 0.6}s ease-in-out infinite ${i * 0.5}s`,
                      left: `${-2 + i}px`
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Ultra-Premium Coffee Cup Design */}
            <div className="flex items-center justify-center mb-10">
              <div className="relative">
                <div className="w-36 h-36 relative overflow-hidden transform-gpu" style={{ animation: 'premium-cup-float 4s ease-in-out infinite' }}>
                  
                  {/* Premium Cup Base with Enhanced 3D Effect */}
                  <div className="absolute inset-0 bg-gradient-to-b from-orange-100 via-orange-200 to-orange-300 rounded-b-[2.5rem] border-4 border-orange-500 shadow-2xl shadow-orange-900/40 backdrop-blur-sm">
                    
                    {/* Ultra-Premium Cup Shine and Reflections */}
                    <div className="absolute top-3 left-3 w-10 h-16 bg-gradient-to-br from-white/90 via-white/60 to-white/20 rounded-full blur-[1px] opacity-95" />
                    <div className="absolute top-2 left-2 w-6 h-8 bg-white/80 rounded-full" />
                    <div className="absolute top-5 left-7 w-3 h-10 bg-white/40 rounded-full" />
                    <div className="absolute top-1 right-3 w-4 h-6 bg-white/30 rounded-full" />
                    
                    {/* Premium Ceramic Texture with Enhanced Depth */}
                    <div className="absolute inset-2 rounded-b-[2rem] bg-gradient-to-b from-orange-100/90 to-orange-200/70 shadow-inner shadow-orange-400/50" />
                    <div className="absolute inset-3 rounded-b-[1.5rem] bg-gradient-to-b from-orange-50/60 to-orange-100/40 shadow-inner shadow-orange-300/30" />
                    
                    {/* Ultra-Premium Coffee Liquid with Smooth Fill Animation */}
                    <div 
                      className="absolute bottom-1 left-1 right-1 bg-gradient-to-t from-amber-900 via-orange-800 to-orange-700 transition-all duration-2000 ease-out rounded-b-[2rem] shadow-inner shadow-amber-900/70 overflow-hidden"
                      style={{
                        height: `${Math.min((brewingStage + 1) * 20, 88)}%`,
                        animation: 'premium-liquid-fill 6s ease-in-out infinite'
                      }}
                    >
                      {/* Ultra-Realistic Coffee Surface with Dynamic Ripples */}
                      <div className="absolute top-0 w-full h-3 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 opacity-95 rounded-full shadow-md">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-400/70 to-transparent animate-pulse" />
                        <div className="absolute top-1 left-1/4 w-1/2 h-0.5 bg-orange-400/50 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
                        <div className="absolute top-0.5 left-1/3 w-1/3 h-0.5 bg-orange-300/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                      </div>
                      
                      {/* Premium Coffee Texture with Enhanced Depth */}
                      <div className="absolute top-4 w-full h-0.5 bg-orange-600/50 opacity-80 rounded-full" />
                      <div className="absolute top-6 w-full h-0.5 bg-orange-600/35 opacity-60 rounded-full" />
                      <div className="absolute top-8 w-full h-0.5 bg-orange-600/20 opacity-40 rounded-full" />
                      <div className="absolute top-10 w-full h-0.5 bg-orange-600/10 opacity-20 rounded-full" />
                      
                      {/* Ultra-Premium Coffee Swirl Effect */}
                      <div 
                        className="absolute top-2 left-1/2 w-4 h-4 bg-orange-500/40 rounded-full blur-sm"
                        style={{ animation: 'premium-swirl 3s linear infinite' }}
                      />
                      <div 
                        className="absolute top-3 left-1/3 w-2 h-2 bg-orange-400/30 rounded-full blur-sm"
                        style={{ animation: 'premium-swirl 4s linear infinite reverse' }}
                      />
                    </div>
                    
                    {/* Ultra-Premium Floating Coffee Bubbles with Enhanced Physics */}
                    {[...Array(15)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute bg-gradient-radial from-orange-300/80 to-orange-400/50 rounded-full shadow-md"
                        style={{
                          width: `${2 + Math.random() * 5}px`,
                          height: `${2 + Math.random() * 5}px`,
                          left: `${15 + i * 7}%`,
                          bottom: `${10 + Math.random() * 40}%`,
                          animation: `premium-bubble-physics ${2 + Math.random() * 2}s ease-in-out infinite ${i * 0.4}s`,
                          filter: 'blur(0.5px)'
                        }}
                      />
                    ))}

                    {/* Ultra-Premium Coffee Foam with Enhanced Micro-bubbles */}
                    <div 
                      className="absolute top-0.5 left-0.5 right-0.5 h-6 bg-gradient-to-b from-white/98 via-orange-50/90 to-orange-100/50 rounded-t-[2rem] transition-all duration-2000 shadow-inner shadow-orange-200/60 border border-orange-200/40"
                      style={{
                        opacity: brewingStage > 2 ? 1 : 0,
                        transform: `translateY(${brewingStage > 2 ? 0 : 20}px) scale(${brewingStage > 2 ? 1 : 0.8})`,
                        animation: brewingStage > 2 ? 'premium-foam-settle 3s ease-out' : 'none'
                      }}
                    >
                      {/* Enhanced Foam Micro-texture */}
                      {[...Array(12)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute bg-white/70 rounded-full"
                          style={{
                            width: `${1 + Math.random() * 2.5}px`,
                            height: `${1 + Math.random() * 2.5}px`,
                            left: `${10 + i * 7}%`,
                            top: `${20 + Math.random() * 60}%`,
                            animation: `premium-micro-bubble ${3 + Math.random()}s ease-in-out infinite ${i * 0.3}s`
                          }}
                        />
                      ))}
                      
                      {/* Premium Foam Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-orange-50/40 to-transparent rounded-t-[2rem]" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-t-[2rem] animate-pulse" />
                    </div>
                  </div>
                  
                  {/* Ultra-Premium Coffee Cup Handle with Enhanced Design */}
                  <div className="absolute right-0 top-10 w-12 h-20 border-4 border-orange-500 rounded-r-full border-l-0 shadow-2xl bg-gradient-to-r from-transparent via-orange-50/30 to-orange-100/50 backdrop-blur-sm">
                    {/* Enhanced Handle Inner Shadow for Ultimate Depth */}
                    <div className="absolute inset-1 border-2 border-orange-400/60 rounded-r-full border-l-0" />
                    <div className="absolute inset-2 border border-orange-300/40 rounded-r-full border-l-0" />
                    {/* Premium Handle Highlights */}
                    <div className="absolute top-3 right-1 w-1.5 h-10 bg-white/50 rounded-full blur-[0.5px]" />
                    <div className="absolute top-2 right-0.5 w-0.5 h-12 bg-white/30 rounded-full" />
                  </div>
                  
                  {/* Ultra-Premium Animated Icon Above Cup */}
                  <div className={`absolute -top-24 left-1/2 transform -translate-x-1/2 ${currentStep.color} transition-all duration-700`} style={{ animation: 'premium-icon-float 3s ease-in-out infinite' }}>
                    <div className="relative">
                      <CurrentIcon className="w-16 h-16 drop-shadow-2xl filter" style={{ animation: 'premium-icon-pulse 2s ease-in-out infinite' }} />
                      {/* Ultra-Premium Icon Glow Effects */}
                      <div className={`absolute inset-0 w-16 h-16 ${currentStep.color.replace('text-', 'bg-')} opacity-30 rounded-full blur-xl animate-pulse`} />
                      <div className={`absolute inset-0 w-16 h-16 ${currentStep.color.replace('text-', 'bg-')} opacity-15 rounded-full blur-2xl`} style={{ animation: 'premium-icon-glow 4s ease-in-out infinite' }} />
                      <div className={`absolute -inset-3 w-22 h-22 ${currentStep.color.replace('text-', 'bg-')} opacity-8 rounded-full blur-3xl animate-ping`} />
                    </div>
                  </div>

                  {/* Ultra-Premium Coffee Beans with Enhanced Physics */}
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute bg-gradient-to-b from-amber-800 via-orange-900 to-amber-900 rounded-full shadow-lg border border-orange-800/40"
                      style={{
                        width: `${3 + Math.random() * 1.5}px`,
                        height: `${4 + Math.random() * 2}px`,
                        left: `${-35 + Math.random() * 170}%`,
                        top: `${85 + Math.random() * 45}%`,
                        transform: `rotate(${Math.random() * 360}deg)`,
                        animation: `premium-bean-float ${4 + Math.random() * 2}s ease-in-out infinite ${Math.random() * 2}s`,
                        filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.4))'
                      }}
                    >
                      {/* Premium Bean Highlight */}
                      <div className="absolute top-0.5 left-0.5 w-1 h-1.5 bg-orange-600/70 rounded-full blur-[0.5px]" />
                    </div>
                  ))}

                  {/* Premium Coffee Shop Accessories */}
                  <div className="absolute -left-12 top-20 w-6 h-8 bg-gradient-to-b from-orange-800 to-amber-900 rounded-lg opacity-50 transform rotate-12 shadow-xl" />
                  <div className="absolute -right-10 top-24 w-5 h-6 bg-gradient-to-b from-orange-700 to-orange-800 rounded opacity-45 transform -rotate-45 shadow-lg" />
                </div>
              </div>
            </div>

            {/* Premium brewing progress text */}
            <div className="text-center relative z-10">
              <h3 className={`text-3xl font-bold mb-4 ${currentStep.color} transition-all duration-1000 drop-shadow-lg`}>
                {currentStep.text}
              </h3>
              <p className="text-slate-700 text-lg font-medium mb-8 leading-relaxed max-w-md mx-auto">
                {currentStep.description}
              </p>
              
              {/* Premium progress dots with enhanced coffee bean shapes */}
              <div className="flex justify-center gap-4 mb-6">
                {brewingSteps.map((step, index) => (
                  <div key={index} className="relative">
                    <div
                      className={`w-6 h-6 rounded-full transition-all duration-1000 ${
                        index <= brewingStage 
                          ? `${step.color.replace('text-', 'bg-')} scale-125 shadow-xl` 
                          : 'bg-orange-200 scale-100'
                      }`}
                    />
                    {index <= brewingStage && (
                      <div className={`absolute inset-0 w-6 h-6 ${step.color.replace('text-', 'bg-')} rounded-full opacity-50 animate-ping`} />
                    )}
                    {index === brewingStage && (
                      <div className={`absolute inset-0 w-6 h-6 ${step.color.replace('text-', 'bg-')} rounded-full opacity-25 animate-pulse`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Premium brewing progress bar */}
              <div className="w-full bg-orange-100/80 rounded-full h-4 overflow-hidden shadow-inner">
                <div 
                  className={`h-full ${currentStep.color.replace('text-', 'bg-')} transition-all duration-1500 rounded-full shadow-md`}
                  style={{ 
                    width: `${((brewingStage + 1) / brewingSteps.length) * 100}%`,
                    background: `linear-gradient(90deg, ${currentStep.color.includes('orange') ? '#ea580c' : '#d97706'}, ${currentStep.color.includes('orange') ? '#f97316' : '#f59e0b'})`
                  }}
                />
              </div>
            </div>

            {/* Premium coffee aroma lines */}
            <div className="absolute top-12 left-12 opacity-50">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-12 h-0.5 ${currentStep.color.replace('text-', 'bg-')} rounded-full mb-2 opacity-70`}
                  style={{
                    animation: `premium-aroma ${2.5 + i * 0.6}s ease-in-out infinite ${i * 0.4}s`,
                    transformOrigin: 'left center'
                  }}
                />
              ))}
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

      {/* Ultra-Premium CSS animations for the coffee brewing experience */}
      <style>{`
        @keyframes premium-cup-float {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          25% { transform: translateY(-4px) rotate(1deg) scale(1.02); }
          50% { transform: translateY(-2px) rotate(-0.5deg) scale(1.01); }
          75% { transform: translateY(-3px) rotate(0.3deg) scale(1.015); }
        }
        
        @keyframes premium-liquid-fill {
          0% { transform: translateY(3px); box-shadow: inset 0 6px 12px rgba(146, 64, 14, 0.4); }
          50% { transform: translateY(-2px); box-shadow: inset 0 8px 16px rgba(146, 64, 14, 0.5); }
          100% { transform: translateY(3px); box-shadow: inset 0 6px 12px rgba(146, 64, 14, 0.4); }
        }
        
        @keyframes premium-swirl {
          0% { transform: rotate(0deg) translateX(3px); opacity: 0.7; }
          50% { transform: rotate(180deg) translateX(2px); opacity: 0.9; }
          100% { transform: rotate(360deg) translateX(3px); opacity: 0.7; }
        }
        
        @keyframes premium-foam-settle {
          0% { transform: translateY(20px) scale(0.8); opacity: 0; }
          60% { transform: translateY(-3px) scale(1.05); opacity: 0.95; }
          100% { transform: translateY(0px) scale(1); opacity: 1; }
        }
        
        @keyframes premium-micro-bubble {
          0%, 100% { transform: scale(1) translateY(0px); opacity: 0.7; }
          50% { transform: scale(1.3) translateY(-2px); opacity: 1; }
        }
        
        @keyframes premium-bubble-physics {
          0% { opacity: 0; transform: translateY(0px) scale(0.5) rotate(0deg); }
          30% { opacity: 0.9; transform: translateY(-10px) scale(1) rotate(90deg); }
          70% { opacity: 1; transform: translateY(-20px) scale(1.3) rotate(180deg); }
          100% { opacity: 0; transform: translateY(-35px) scale(0.3) rotate(270deg); }
        }
        
        @keyframes premium-icon-float {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          33% { transform: translateY(-5px) translateX(3px) rotate(3deg); }
          66% { transform: translateY(-3px) translateX(-2px) rotate(-2deg); }
        }
        
        @keyframes premium-icon-pulse {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 6px 12px rgba(234, 88, 12, 0.4)); }
          50% { transform: scale(1.15); filter: drop-shadow(0 8px 20px rgba(234, 88, 12, 0.6)); }
        }
        
        @keyframes premium-icon-glow {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.3); }
        }
        
        @keyframes premium-bean-float {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); }
          25% { transform: translateY(-4px) translateX(2px) rotate(20deg) scale(1.15); }
          50% { transform: translateY(-2px) translateX(-1px) rotate(-10deg) scale(1.08); }
          75% { transform: translateY(-3px) translateX(1px) rotate(8deg) scale(1.12); }
        }
        
        @keyframes premium-steam {
          0% { opacity: 0.7; transform: translateY(0px) scale(1) rotate(0deg); }
          50% { opacity: 1; transform: translateY(-15px) scale(1.3) rotate(8deg); }
          100% { opacity: 0.3; transform: translateY(-30px) scale(0.7) rotate(-5deg); }
        }
        
        @keyframes premium-wisp {
          0% { opacity: 0.4; transform: translateX(0px) rotate(0deg) scale(1); }
          50% { opacity: 0.8; transform: translateX(8px) rotate(20deg) scale(1.2); }
          100% { opacity: 0.2; transform: translateX(-4px) rotate(-12deg) scale(0.8); }
        }
        
        @keyframes premium-aroma {
          0% { transform: scaleX(1) translateX(0px) rotate(0deg); opacity: 0.5; }
          50% { transform: scaleX(1.4) translateX(6px) rotate(3deg); opacity: 0.9; }
          100% { transform: scaleX(0.8) translateX(-3px) rotate(-2deg); opacity: 0.3; }
        }
        
        @keyframes premium-float {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          25% { transform: translateY(-8px) translateX(3px) rotate(3deg); }
          50% { transform: translateY(-4px) translateX(-2px) rotate(-2deg); }
          75% { transform: translateY(-10px) translateX(2px) rotate(1deg); }
        }
      `}</style>
    </div>
  );
};

export default QuestionGenerationForm;
