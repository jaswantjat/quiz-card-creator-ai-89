
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Zap, Brain, Sparkles, Target, Coffee, Lightbulb, BookOpen } from "lucide-react";
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

  // Coffee brewing storyline with animations
  const brewingSteps = [
    { 
      icon: Coffee, 
      text: "Brewing fresh ideas...", 
      description: "Selecting the finest question beans",
      color: "text-amber-600",
      bgColor: "bg-amber-50"
    },
    { 
      icon: Lightbulb, 
      text: "Grinding concepts...", 
      description: "Breaking down complex topics",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    { 
      icon: Brain, 
      text: "Percolating intelligence...", 
      description: "Mixing AI with creativity",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    { 
      icon: BookOpen, 
      text: "Filtering perfection...", 
      description: "Refining question quality",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    { 
      icon: Sparkles, 
      text: "Serving hot questions!", 
      description: "Your perfect blend is ready",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
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
      }, 1800);
      
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

      {/* Coffee Brewing Animation - Only visible when generating */}
      {isGenerating && (
        <div className="mb-8 relative">
          <div className={`relative p-8 rounded-3xl border-2 transition-all duration-1000 ${currentStep.bgColor} border-current/20`}>
            {/* Animated coffee steam */}
            <div className="absolute top-4 right-8 flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-8 bg-gradient-to-t from-gray-400 to-transparent rounded-full animate-pulse opacity-60"
                  style={{
                    animationDelay: `${i * 0.3}s`,
                    animationDuration: '2s'
                  }}
                />
              ))}
            </div>

            {/* Coffee cup animation */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                {/* Coffee cup */}
                <div className="w-20 h-20 bg-gradient-to-b from-amber-100 to-amber-200 rounded-b-3xl border-4 border-amber-400 relative overflow-hidden">
                  {/* Coffee liquid with brewing animation */}
                  <div 
                    className="absolute bottom-0 w-full bg-gradient-to-t from-amber-800 to-amber-600 transition-all duration-1000 rounded-b-2xl"
                    style={{
                      height: `${(brewingStage + 1) * 16}%`,
                      animation: 'coffee-bubble 2s ease-in-out infinite'
                    }}
                  />
                  
                  {/* Floating coffee bubbles */}
                  {isGenerating && [...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-amber-300/60 rounded-full animate-ping"
                      style={{
                        left: `${20 + i * 20}%`,
                        top: `${60 + i * 10}%`,
                        animationDelay: `${i * 0.5}s`,
                        animationDuration: '1.5s'
                      }}
                    />
                  ))}
                </div>
                
                {/* Coffee cup handle */}
                <div className="absolute right-0 top-4 w-6 h-8 border-4 border-amber-400 rounded-r-full border-l-0" />
                
                {/* Animated icon above cup */}
                <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 ${currentStep.color} animate-bounce`}>
                  <CurrentIcon className="w-8 h-8" />
                </div>
              </div>
            </div>

            {/* Brewing progress text */}
            <div className="text-center">
              <h3 className={`text-2xl font-bold mb-2 ${currentStep.color} transition-all duration-500`}>
                {currentStep.text}
              </h3>
              <p className="text-slate-600 text-lg font-medium">
                {currentStep.description}
              </p>
              
              {/* Progress dots */}
              <div className="flex justify-center gap-2 mt-4">
                {brewingSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-500 ${
                      index <= brewingStage 
                        ? 'bg-orange-500 scale-110' 
                        : 'bg-orange-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-orange-300/30 rounded-full animate-float"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.8}s`,
                    animationDuration: `${3 + Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Credit Warning and Generate Button */}
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
            className={`relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl shadow-xl shadow-orange-500/30 transition-all duration-500 font-semibold disabled:opacity-50 disabled:cursor-not-allowed ${
              isGenerating 
                ? 'py-6 px-16 text-lg scale-105 shadow-2xl shadow-orange-500/50 bg-gradient-to-r from-amber-500 to-orange-600' 
                : 'py-4 px-10 text-lg hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/40'
            }`}
          >
            {/* Button Content */}
            <div className="relative z-10 flex items-center justify-center">
              {isGenerating ? (
                <div className="flex items-center gap-3">
                  <Coffee className="w-5 h-5 animate-spin" />
                  <span className="text-sm font-medium">
                    Brewing Questions...
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6" />
                  <span>Generate Questions</span>
                </div>
              )}
            </div>

            {/* Background Animation for Loading State */}
            {isGenerating && (
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 animate-pulse opacity-20 rounded-2xl"></div>
            )}
          </Button>
        </div>
      </div>

      {/* CSS for coffee brewing animation */}
      <style jsx>{`
        @keyframes coffee-bubble {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-2px); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
};

export default QuestionGenerationForm;
