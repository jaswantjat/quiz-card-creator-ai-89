
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Zap, Brain, Sparkles, Star, Loader2, Lightbulb, Target, CheckCircle } from "lucide-react";
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

  // Story sequence for loading animation
  const storySteps = [
    { icon: Lightbulb, text: "Analyzing your topic...", delay: 0 },
    { icon: Brain, text: "Thinking deeply about content...", delay: 1000 },
    { icon: Target, text: "Crafting perfect questions...", delay: 2000 },
    { icon: Sparkles, text: "Adding final touches...", delay: 3000 },
    { icon: CheckCircle, text: "Almost ready!", delay: 4000 }
  ];

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
            className={`relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl shadow-xl shadow-orange-500/30 transition-all duration-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed ${
              isGenerating 
                ? 'py-6 px-16 text-lg scale-110 shadow-2xl shadow-orange-500/50' 
                : 'py-4 px-10 text-lg hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/40'
            }`}
          >
            {/* Story-based Loading Animation */}
            {isGenerating && (
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">
                {/* Expanding ripple effect */}
                <div className="absolute inset-0 rounded-2xl">
                  <div className="absolute inset-0 bg-white/20 rounded-2xl animate-ping"></div>
                  <div className="absolute inset-2 bg-white/10 rounded-xl animate-pulse"></div>
                  <div className="absolute inset-4 bg-white/5 rounded-lg animate-bounce"></div>
                </div>

                {/* Floating story elements */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                  {/* Floating dots that represent ideas */}
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-white/60 rounded-full animate-bounce"
                      style={{
                        left: `${15 + i * 12}%`,
                        top: `${30 + (i % 2) * 40}%`,
                        animationDelay: `${i * 0.3}s`,
                        animationDuration: `${1.5 + i * 0.2}s`
                      }}
                    />
                  ))}
                  
                  {/* Connecting lines between ideas */}
                  <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 200 80">
                    <path 
                      d="M20,40 Q60,20 100,40 T180,40" 
                      stroke="white" 
                      strokeWidth="2" 
                      fill="none" 
                      strokeDasharray="5 5"
                      className="animate-pulse"
                    />
                  </svg>
                </div>

                {/* Central spinning brain/processing icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <Brain className="w-8 h-8 text-white animate-spin" />
                    <div className="absolute -top-1 -right-1">
                      <Sparkles className="w-4 h-4 text-white animate-ping" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Button Content with Story Progression */}
            <div className="relative z-10 flex items-center justify-center">
              {isGenerating ? (
                <div className="flex flex-col items-center gap-2">
                  {/* Dynamic story text that changes */}
                  <div className="text-center min-h-[24px]">
                    {storySteps.map((step, index) => {
                      const StepIcon = step.icon;
                      return (
                        <div 
                          key={index}
                          className={`flex items-center gap-2 transition-all duration-500 ${
                            // Show each step sequentially with fade in/out
                            index === 0 ? 'animate-pulse' : 
                            index === 1 ? 'opacity-0 animate-[fadeIn_0.5s_ease-in-out_1s_forwards]' :
                            index === 2 ? 'opacity-0 animate-[fadeIn_0.5s_ease-in-out_2s_forwards]' :
                            index === 3 ? 'opacity-0 animate-[fadeIn_0.5s_ease-in-out_3s_forwards]' :
                            'opacity-0 animate-[fadeIn_0.5s_ease-in-out_4s_forwards]'
                          }`}
                          style={{
                            position: index === 0 ? 'relative' : 'absolute',
                            top: index === 0 ? 'auto' : '50%',
                            left: index === 0 ? 'auto' : '50%',
                            transform: index === 0 ? 'none' : 'translate(-50%, -50%)'
                          }}
                        >
                          <StepIcon className="w-5 h-5 animate-bounce" style={{ animationDelay: `${index * 0.2}s` }} />
                          <span className="text-sm font-medium animate-pulse">
                            {step.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Progress indicators */}
                  <div className="flex gap-1 mt-2">
                    {storySteps.map((_, index) => (
                      <div 
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index <= 0 ? 'bg-white animate-pulse' : 'bg-white/30'
                        }`}
                        style={{
                          animationDelay: `${index * 1000}ms`
                        }}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6" />
                  <span>Generate Questions</span>
                </div>
              )}
            </div>
          </Button>
        </div>
      </div>

      {/* Custom keyframes for fade animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default QuestionGenerationForm;
