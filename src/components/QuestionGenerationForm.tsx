
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Zap, Brain, Sparkles } from "lucide-react";
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

  return (
    <div className="relative z-10 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl rounded-3xl p-8 border border-orange-200/40 shadow-xl shadow-orange-500/5">
      <ChatAgentHeader credits={credits} />
      
      {/* Enhanced Context Text Box */}
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
            className="w-full min-h-[120px] bg-white/90 backdrop-blur-sm border-orange-200/60 focus:border-orange-400 focus:ring-orange-200/50 rounded-2xl resize-none text-base leading-relaxed transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/5" 
          />
          <div className="absolute bottom-4 right-4 text-xs text-slate-400">
            {context.length}/500
          </div>
        </div>
      </div>

      {/* Enhanced Topic Name */}
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
          className="w-full bg-white/90 backdrop-blur-sm border-orange-200/60 focus:border-orange-400 focus:ring-orange-200/50 rounded-2xl py-4 text-base transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/5" 
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
            className={`relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 px-10 rounded-2xl shadow-xl shadow-orange-500/30 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/40 text-lg font-semibold group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${isGenerating ? 'animate-pulse' : ''}`}
          >
            {/* Creative Loading Animation Overlay */}
            {isGenerating && (
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">
                {/* Animated Background Wave */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[slide-wave_1.5s_ease-in-out_infinite] transform -skew-x-12"></div>
                
                {/* Floating Particles */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-2 left-4 w-1 h-1 bg-white/60 rounded-full animate-[float-particle_2s_ease-in-out_infinite]"></div>
                  <div className="absolute top-4 left-12 w-1.5 h-1.5 bg-white/40 rounded-full animate-[float-particle_2.5s_ease-in-out_infinite_0.5s]"></div>
                  <div className="absolute bottom-3 right-8 w-1 h-1 bg-white/70 rounded-full animate-[float-particle_1.8s_ease-in-out_infinite_1s]"></div>
                  <div className="absolute bottom-5 right-16 w-1.5 h-1.5 bg-white/50 rounded-full animate-[float-particle_2.2s_ease-in-out_infinite_0.3s]"></div>
                  <div className="absolute top-6 right-4 w-1 h-1 bg-white/60 rounded-full animate-[float-particle_1.9s_ease-in-out_infinite_0.8s]"></div>
                </div>

                {/* Pulsing Ring */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-white/30 rounded-full animate-[pulse-ring_2s_ease-in-out_infinite]"></div>
                  <div className="absolute w-12 h-12 border-2 border-white/20 rounded-full animate-[pulse-ring_2s_ease-in-out_infinite_0.5s]"></div>
                </div>

                {/* Neural Network Lines */}
                <div className="absolute inset-0 opacity-30">
                  <svg className="w-full h-full" viewBox="0 0 200 80">
                    <path 
                      d="M20,40 Q60,20 100,40 T180,40" 
                      stroke="white" 
                      strokeWidth="1" 
                      fill="none" 
                      className="animate-[draw-line_3s_ease-in-out_infinite]"
                      strokeDasharray="100"
                      strokeDashoffset="100"
                    />
                    <path 
                      d="M20,30 Q60,50 100,30 T180,30" 
                      stroke="white" 
                      strokeWidth="1" 
                      fill="none" 
                      className="animate-[draw-line_3s_ease-in-out_infinite_0.5s]"
                      strokeDasharray="100"
                      strokeDashoffset="100"
                    />
                    <path 
                      d="M20,50 Q60,30 100,50 T180,50" 
                      stroke="white" 
                      strokeWidth="1" 
                      fill="none" 
                      className="animate-[draw-line_3s_ease-in-out_infinite_1s]"
                      strokeDasharray="100"
                      strokeDashoffset="100"
                    />
                  </svg>
                </div>
              </div>
            )}

            {/* Button Content */}
            <div className="relative z-10 flex items-center">
              {isGenerating ? (
                <>
                  <div className="relative mr-3">
                    <Brain className="w-6 h-6 animate-[brain-pulse_1.5s_ease-in-out_infinite]" />
                    <Sparkles className="absolute -top-1 -right-1 w-4 h-4 animate-[sparkle_2s_ease-in-out_infinite]" />
                  </div>
                  <span className="animate-[text-glow_2s_ease-in-out_infinite]">
                    Crafting Questions...
                  </span>
                </>
              ) : (
                <>
                  <Zap className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
                  Generate Questions
                </>
              )}
            </div>
          </Button>
        </div>
      </div>

      {/* Enhanced CSS Animations */}
      <style jsx>{`
        @keyframes slide-wave {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        
        @keyframes float-particle {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.6; }
          25% { transform: translateY(-8px) translateX(3px); opacity: 1; }
          50% { transform: translateY(-4px) translateX(-2px); opacity: 0.8; }
          75% { transform: translateY(-12px) translateX(1px); opacity: 1; }
        }
        
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.3; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        
        @keyframes draw-line {
          0% { stroke-dashoffset: 100; opacity: 0; }
          25% { opacity: 1; }
          50% { stroke-dashoffset: 0; opacity: 1; }
          75% { stroke-dashoffset: -100; opacity: 1; }
          100% { stroke-dashoffset: -100; opacity: 0; }
        }
        
        @keyframes brain-pulse {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.1); filter: brightness(1.3); }
        }
        
        @keyframes sparkle {
          0%, 100% { transform: rotate(0deg) scale(1); opacity: 0.7; }
          25% { transform: rotate(90deg) scale(1.2); opacity: 1; }
          50% { transform: rotate(180deg) scale(0.8); opacity: 0.5; }
          75% { transform: rotate(270deg) scale(1.1); opacity: 0.9; }
        }
        
        @keyframes text-glow {
          0%, 100% { text-shadow: 0 0 5px rgba(255,255,255,0.5); }
          50% { text-shadow: 0 0 15px rgba(255,255,255,0.8), 0 0 25px rgba(255,255,255,0.4); }
        }
      `}</style>
    </div>
  );
};

export default QuestionGenerationForm;
