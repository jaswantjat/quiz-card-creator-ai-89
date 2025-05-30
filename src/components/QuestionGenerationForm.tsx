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

  // Simplified story sequence
  const storySteps = [
    { icon: Brain, text: "Analyzing your topic...", delay: 0 },
    { icon: Target, text: "Crafting questions...", delay: 2000 },
    { icon: Sparkles, text: "Almost ready!", delay: 4000 }
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
            className={`relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl shadow-xl shadow-orange-500/30 transition-all duration-500 font-semibold disabled:opacity-50 disabled:cursor-not-allowed ${
              isGenerating 
                ? 'py-6 px-16 text-lg scale-110 shadow-2xl shadow-orange-500/50' 
                : 'py-4 px-10 text-lg hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/40'
            }`}
          >
            {/* Smooth Loading Animation */}
            {isGenerating && (
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">
                {/* Simple expanding ripple */}
                <div className="absolute inset-0 rounded-2xl">
                  <div className="absolute inset-0 bg-white/10 rounded-2xl animate-ping opacity-60"></div>
                  <div className="absolute inset-2 bg-white/5 rounded-xl animate-pulse"></div>
                </div>

                {/* Clean floating particles */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1.5 h-1.5 bg-white/70 rounded-full"
                      style={{
                        left: `${25 + i * 25}%`,
                        top: '50%',
                        animation: `bounce 1.5s ease-in-out ${i * 0.3}s infinite`
                      }}
                    />
                  ))}
                </div>

                {/* Central icon with smooth rotation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white animate-spin" style={{ animationDuration: '2s' }} />
                </div>
              </div>
            )}

            {/* Button Content */}
            <div className="relative z-10 flex items-center justify-center">
              {isGenerating ? (
                <div className="flex flex-col items-center gap-2">
                  {/* Sequential story text */}
                  <div className="text-center min-h-[20px] relative">
                    {storySteps.map((step, index) => {
                      const StepIcon = step.icon;
                      const isActive = index === 0 || (index === 1 && Date.now() % 6000 > 2000) || (index === 2 && Date.now() % 6000 > 4000);
                      
                      return (
                        <div 
                          key={index}
                          className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ${
                            isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                          }`}
                        >
                          <span className="text-sm font-medium whitespace-nowrap">
                            {step.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Simple progress dots */}
                  <div className="flex gap-1 mt-1">
                    {storySteps.map((_, index) => (
                      <div 
                        key={index}
                        className="w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse"
                        style={{ animationDelay: `${index * 0.5}s` }}
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
