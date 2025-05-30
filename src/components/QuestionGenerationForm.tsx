
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
            className={`relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 px-10 rounded-2xl shadow-xl shadow-orange-500/30 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/40 text-lg font-semibold group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${isGenerating ? 'animate-none' : 'hover:animate-bounce'}`}
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
                      className="animate-[electric-flow_1.5s_ease-in-out_infinite]"
                      strokeDasharray="10 5"
                      strokeDashoffset="0"
                    />
                    <path 
                      d="M10,30 Q30,50 50,30 T90,30 Q110,10 130,30 T170,30 Q190,50 200,30" 
                      stroke="white" 
                      strokeWidth="1.5" 
                      fill="none" 
                      className="animate-[electric-flow_2s_ease-in-out_infinite_0.5s]"
                      strokeDasharray="8 3"
                      strokeDashoffset="0"
                    />
                    <path 
                      d="M10,50 Q30,30 50,50 T90,50 Q110,70 130,50 T170,50 Q190,30 200,50" 
                      stroke="white" 
                      strokeWidth="1" 
                      fill="none" 
                      className="animate-[electric-flow_1.8s_ease-in-out_infinite_1s]"
                      strokeDasharray="6 4"
                      strokeDashoffset="0"
                    />
                  </svg>
                </div>

                {/* Morphing Energy Orbs */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-1/2 left-4 w-3 h-3 bg-white/70 rounded-full animate-[energy-morph_2s_ease-in-out_infinite] transform -translate-y-1/2"></div>
                  <div className="absolute top-1/2 left-12 w-4 h-4 bg-white/50 rounded-full animate-[energy-morph_2.5s_ease-in-out_infinite_0.3s] transform -translate-y-1/2"></div>
                  <div className="absolute top-1/2 right-4 w-2 h-2 bg-white/80 rounded-full animate-[energy-morph_1.8s_ease-in-out_infinite_0.7s] transform -translate-y-1/2"></div>
                  <div className="absolute top-1/2 right-12 w-3.5 h-3.5 bg-white/60 rounded-full animate-[energy-morph_2.2s_ease-in-out_infinite_1s] transform -translate-y-1/2"></div>
                </div>

                {/* Rotating Neural Network */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-2 border-white/20 rounded-full animate-[neural-spin_3s_linear_infinite]"></div>
                    <div className="absolute inset-2 border-2 border-white/30 rounded-full animate-[neural-spin_2s_linear_infinite_reverse]"></div>
                    <div className="absolute inset-4 border-2 border-white/40 rounded-full animate-[neural-spin_4s_linear_infinite]"></div>
                    
                    {/* Connecting nodes */}
                    <div className="absolute top-2 left-1/2 w-1 h-1 bg-white/70 rounded-full animate-[node-pulse_1.5s_ease-in-out_infinite] transform -translate-x-1/2"></div>
                    <div className="absolute bottom-2 left-1/2 w-1 h-1 bg-white/70 rounded-full animate-[node-pulse_1.5s_ease-in-out_infinite_0.5s] transform -translate-x-1/2"></div>
                    <div className="absolute left-2 top-1/2 w-1 h-1 bg-white/70 rounded-full animate-[node-pulse_1.5s_ease-in-out_infinite_1s] transform -translate-y-1/2"></div>
                    <div className="absolute right-2 top-1/2 w-1 h-1 bg-white/70 rounded-full animate-[node-pulse_1.5s_ease-in-out_infinite_1.5s] transform -translate-y-1/2"></div>
                  </div>
                </div>

                {/* Cascading Energy Waves */}
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[cascade-wave_2s_ease-in-out_infinite] transform skew-x-12"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-[cascade-wave_2s_ease-in-out_infinite_0.5s] transform -skew-x-12"></div>
                </div>

                {/* Floating Intelligence Particles */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className={`absolute w-1 h-1 bg-white/60 rounded-full animate-[intelligent-float_${2 + i * 0.3}s_ease-in-out_infinite_${i * 0.2}s]`}
                      style={{
                        left: `${10 + i * 10}%`,
                        top: `${20 + (i % 3) * 20}%`,
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
                    <Brain className="w-6 h-6 animate-[brain-think_2s_ease-in-out_infinite]" />
                    <div className="absolute -top-1 -right-1">
                      <Sparkles className="w-4 h-4 animate-[sparkle-burst_1.5s_ease-in-out_infinite]" />
                    </div>
                    <div className="absolute -bottom-1 -left-1">
                      <Star className="w-3 h-3 animate-[star-twinkle_2.5s_ease-in-out_infinite_0.5s]" />
                    </div>
                  </div>
                  <span className="animate-[text-shimmer_3s_ease-in-out_infinite]">
                    Crafting Brilliant Questions...
                  </span>
                </>
              ) : (
                <>
                  <div className="relative mr-3 group-hover:animate-[zap-energy_0.6s_ease-out]">
                    <Zap className="w-6 h-6 group-hover:animate-[lightning-strike_0.4s_ease-out] transition-all duration-300" />
                    <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-[energy-burst_0.6s_ease-out] transition-opacity duration-300"></div>
                  </div>
                  <span className="group-hover:animate-[text-glow_0.5s_ease-out]">
                    Generate Questions
                  </span>
                </>
              )}
            </div>
          </Button>
        </div>
      </div>

      {/* Enhanced CSS Animations */}
      <style jsx>{`
        @keyframes electric-flow {
          0%, 100% { stroke-dashoffset: 0; opacity: 0.3; }
          50% { stroke-dashoffset: 20; opacity: 0.8; }
        }
        
        @keyframes energy-morph {
          0%, 100% { 
            transform: scale(1) translateY(0px) translateX(0px); 
            opacity: 0.7; 
            border-radius: 50%;
          }
          25% { 
            transform: scale(1.3) translateY(-4px) translateX(2px); 
            opacity: 1; 
            border-radius: 30%;
          }
          50% { 
            transform: scale(0.8) translateY(3px) translateX(-1px); 
            opacity: 0.5; 
            border-radius: 60%;
          }
          75% { 
            transform: scale(1.1) translateY(-2px) translateX(3px); 
            opacity: 0.9; 
            border-radius: 40%;
          }
        }
        
        @keyframes neural-spin {
          from { transform: rotate(0deg) scale(1); opacity: 0.2; }
          50% { transform: rotate(180deg) scale(1.1); opacity: 0.6; }
          to { transform: rotate(360deg) scale(1); opacity: 0.2; }
        }
        
        @keyframes node-pulse {
          0%, 100% { 
            transform: scale(1) translateX(-50%) translateY(-50%); 
            box-shadow: 0 0 0 0 rgba(255,255,255,0.7); 
          }
          50% { 
            transform: scale(1.5) translateX(-50%) translateY(-50%); 
            box-shadow: 0 0 0 6px rgba(255,255,255,0); 
          }
        }
        
        @keyframes cascade-wave {
          0% { transform: translateX(-100%) skewX(12deg); opacity: 0; }
          25% { opacity: 0.3; }
          50% { opacity: 0.6; }
          75% { opacity: 0.3; }
          100% { transform: translateX(200%) skewX(12deg); opacity: 0; }
        }
        
        @keyframes intelligent-float {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) scale(1); 
            opacity: 0.6; 
          }
          25% { 
            transform: translateY(-12px) translateX(4px) scale(1.2); 
            opacity: 1; 
          }
          50% { 
            transform: translateY(-6px) translateX(-3px) scale(0.8); 
            opacity: 0.7; 
          }
          75% { 
            transform: translateY(-15px) translateX(2px) scale(1.1); 
            opacity: 0.9; 
          }
        }
        
        @keyframes brain-think {
          0%, 100% { 
            transform: scale(1) rotate(0deg); 
            filter: brightness(1) hue-rotate(0deg); 
          }
          25% { 
            transform: scale(1.1) rotate(2deg); 
            filter: brightness(1.3) hue-rotate(10deg); 
          }
          50% { 
            transform: scale(1.05) rotate(-1deg); 
            filter: brightness(1.1) hue-rotate(5deg); 
          }
          75% { 
            transform: scale(1.15) rotate(1deg); 
            filter: brightness(1.4) hue-rotate(15deg); 
          }
        }
        
        @keyframes sparkle-burst {
          0%, 100% { 
            transform: rotate(0deg) scale(1); 
            opacity: 0.7; 
          }
          25% { 
            transform: rotate(90deg) scale(1.3); 
            opacity: 1; 
          }
          50% { 
            transform: rotate(180deg) scale(0.9); 
            opacity: 0.5; 
          }
          75% { 
            transform: rotate(270deg) scale(1.2); 
            opacity: 0.8; 
          }
        }
        
        @keyframes star-twinkle {
          0%, 100% { 
            transform: scale(1) rotate(0deg); 
            opacity: 0.8; 
          }
          50% { 
            transform: scale(1.4) rotate(180deg); 
            opacity: 1; 
          }
        }
        
        @keyframes text-shimmer {
          0%, 100% { 
            text-shadow: 0 0 5px rgba(255,255,255,0.5); 
            filter: brightness(1); 
          }
          25% { 
            text-shadow: 0 0 15px rgba(255,255,255,0.8), 0 0 25px rgba(255,255,255,0.4); 
            filter: brightness(1.2); 
          }
          50% { 
            text-shadow: 0 0 20px rgba(255,255,255,1), 0 0 35px rgba(255,255,255,0.6); 
            filter: brightness(1.4); 
          }
          75% { 
            text-shadow: 0 0 15px rgba(255,255,255,0.8), 0 0 25px rgba(255,255,255,0.4); 
            filter: brightness(1.2); 
          }
        }
        
        @keyframes zap-energy {
          0% { transform: scale(1); }
          50% { transform: scale(1.2) rotate(5deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        
        @keyframes lightning-strike {
          0%, 100% { filter: brightness(1) drop-shadow(0 0 0 transparent); }
          50% { filter: brightness(2) drop-shadow(0 0 10px rgba(255,255,255,0.8)); }
        }
        
        @keyframes energy-burst {
          0% { transform: scale(0); opacity: 0.8; }
          50% { transform: scale(2); opacity: 0.4; }
          100% { transform: scale(3); opacity: 0; }
        }
        
        @keyframes text-glow {
          0% { text-shadow: none; }
          50% { text-shadow: 0 0 10px rgba(255,255,255,0.6); }
          100% { text-shadow: none; }
        }
      `}</style>
    </div>
  );
};

export default QuestionGenerationForm;
