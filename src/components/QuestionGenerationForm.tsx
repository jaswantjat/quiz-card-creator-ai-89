
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Zap, Brain, Sparkles, Star, Loader2 } from "lucide-react";
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
            className={`relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 px-10 rounded-2xl shadow-xl shadow-orange-500/30 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/40 text-lg font-semibold group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${isGenerating ? 'animate-pulse' : 'hover:animate-bounce'}`}
          >
            {/* Enhanced Loading Animation Overlay */}
            {isGenerating && (
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 animate-pulse">
                {/* Animated Lightning Background */}
                <div className="absolute inset-0 overflow-hidden">
                  {/* Electric current lines */}
                  <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 200 80">
                    <path 
                      d="M10,40 Q30,20 50,40 T90,40 Q110,60 130,40 T170,40 Q190,20 200,40" 
                      stroke="white" 
                      strokeWidth="2" 
                      fill="none" 
                      className="animate-pulse"
                      strokeDasharray="10 5"
                      strokeDashoffset="0"
                    />
                    <path 
                      d="M10,30 Q30,50 50,30 T90,30 Q110,10 130,30 T170,30 Q190,50 200,30" 
                      stroke="white" 
                      strokeWidth="1.5" 
                      fill="none" 
                      className="animate-pulse"
                      strokeDasharray="8 3"
                      strokeDashoffset="0"
                    />
                    <path 
                      d="M10,50 Q30,30 50,50 T90,50 Q110,70 130,50 T170,50 Q190,30 200,50" 
                      stroke="white" 
                      strokeWidth="1" 
                      fill="none" 
                      className="animate-pulse"
                      strokeDasharray="6 4"
                      strokeDashoffset="0"
                    />
                  </svg>
                </div>

                {/* Morphing Energy Orbs */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-1/2 left-4 w-3 h-3 bg-white/70 rounded-full animate-bounce transform -translate-y-1/2"></div>
                  <div className="absolute top-1/2 left-12 w-4 h-4 bg-white/50 rounded-full animate-pulse transform -translate-y-1/2"></div>
                  <div className="absolute top-1/2 right-4 w-2 h-2 bg-white/80 rounded-full animate-bounce transform -translate-y-1/2"></div>
                  <div className="absolute top-1/2 right-12 w-3.5 h-3.5 bg-white/60 rounded-full animate-pulse transform -translate-y-1/2"></div>
                </div>

                {/* Rotating Neural Network */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-2 border-white/20 rounded-full animate-spin"></div>
                    <div className="absolute inset-2 border-2 border-white/30 rounded-full animate-spin animate-reverse"></div>
                    <div className="absolute inset-4 border-2 border-white/40 rounded-full animate-spin"></div>
                    
                    {/* Connecting nodes */}
                    <div className="absolute top-2 left-1/2 w-1 h-1 bg-white/70 rounded-full animate-ping transform -translate-x-1/2"></div>
                    <div className="absolute bottom-2 left-1/2 w-1 h-1 bg-white/70 rounded-full animate-ping transform -translate-x-1/2"></div>
                    <div className="absolute left-2 top-1/2 w-1 h-1 bg-white/70 rounded-full animate-ping transform -translate-y-1/2"></div>
                    <div className="absolute right-2 top-1/2 w-1 h-1 bg-white/70 rounded-full animate-ping transform -translate-y-1/2"></div>
                  </div>
                </div>

                {/* Cascading Energy Waves */}
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse transform skew-x-12"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-pulse transform -skew-x-12"></div>
                </div>

                {/* Floating Intelligence Particles */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className={`absolute w-1 h-1 bg-white/60 rounded-full animate-bounce`}
                      style={{
                        left: `${10 + i * 10}%`,
                        top: `${20 + (i % 3) * 20}%`,
                        animationDelay: `${i * 0.2}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Button Content */}
            <div className="relative z-10 flex items-center">
              {isGenerating ? (
                <>
                  <div className="relative mr-3">
                    <Brain className="w-6 h-6 animate-spin" />
                    <div className="absolute -top-1 -right-1">
                      <Sparkles className="w-4 h-4 animate-ping" />
                    </div>
                    <div className="absolute -bottom-1 -left-1">
                      <Star className="w-3 h-3 animate-bounce" />
                    </div>
                  </div>
                  <span className="animate-pulse">
                    Crafting Brilliant Questions...
                  </span>
                </>
              ) : (
                <>
                  <div className="relative mr-3 group-hover:animate-bounce">
                    <Zap className="w-6 h-6 group-hover:animate-pulse transition-all duration-300" />
                    <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
                  </div>
                  <span className="group-hover:animate-pulse">
                    Generate Questions
                  </span>
                </>
              )}
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuestionGenerationForm;
