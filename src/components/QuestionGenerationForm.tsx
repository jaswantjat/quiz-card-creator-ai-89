
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Zap } from "lucide-react";
import { memo } from "react";
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
  totalQuestions: number; // Pass memoized value from parent
  onGenerate: () => void;
}

const QuestionGenerationForm = memo(({
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
  totalQuestions, // Use memoized value from parent
  onGenerate
}: QuestionGenerationFormProps) => {



  return (
    <div className="relative z-10 bg-gradient-to-br from-white/85 to-white/70 backdrop-optimized rounded-3xl p-8 border border-orange-200/40 shadow-xl shadow-orange-500/5 layout-stable">
      <ChatAgentHeader credits={credits} />

      {/* Context Text Box */}
      <div className="mb-8">
        <Label htmlFor="context" className="text-slate-700 font-semibold mb-4 block text-base flex items-center gap-2 text-optimized">
          Context
          <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-full">(optional)</span>
        </Label>
        <div className="relative">
          <Textarea
            id="context"
            placeholder="Provide context for question generation. This helps create more targeted and relevant questions..."
            value={context}
            onChange={e => setContext(e.target.value)}
            className="w-full min-h-[120px] bg-white/90 backdrop-optimized border-orange-200/60 focus:border-orange-400 focus:ring-orange-200/50 rounded-2xl resize-none text-base leading-relaxed optimized-input smooth-transition"
            maxLength={500}
          />
          <div className="absolute bottom-4 right-4 text-xs text-slate-400 text-optimized">
            {context.length}/500
          </div>
        </div>
      </div>

      {/* Topic Name */}
      <div className="mb-8">
        <Label htmlFor="topic" className="text-slate-700 font-semibold mb-4 block text-base text-optimized">
          Topic Name
        </Label>
        <Input
          id="topic"
          type="text"
          placeholder="Enter topic name (e.g., Machine Learning, History, Biology)..."
          value={topicName}
          onChange={e => setTopicName(e.target.value)}
          className="w-full bg-white/90 backdrop-optimized border-orange-200/60 focus:border-orange-400 focus:ring-orange-200/50 rounded-2xl py-4 text-base optimized-input smooth-transition"
          maxLength={100}
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
        
        <div className="relative group">
          {/* Simplified button glow effect for better performance */}
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl blur opacity-25 group-hover:opacity-75 smooth-transition" />

          <Button
            onClick={onGenerate}
            disabled={credits < totalQuestions || totalQuestions === 0}
            className="relative bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed py-3 px-8 text-base hover:shadow-xl optimized-button gpu-accelerated"
          >
            <div className="flex items-center justify-center gap-2">
              <Zap className="w-5 h-5 smooth-transition group-hover:scale-110" />
              <span className="smooth-transition text-optimized">Generate Questions</span>
            </div>

            {/* Simplified ripple effect */}
            <div className="absolute inset-0 rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-white/20 transform scale-0 group-active:scale-100 smooth-transition rounded-xl" />
            </div>
          </Button>
        </div>
      </div>

    </div>
  );
});

QuestionGenerationForm.displayName = 'QuestionGenerationForm';

export default QuestionGenerationForm;
