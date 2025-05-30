
import { useState } from "react";
import { Sparkles, Brain, Stars, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import QuestionGenerator from "./QuestionGenerator";
import FloatingElements from "./FloatingElements";
import { useToast } from "@/hooks/use-toast";

const AICard = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const { toast } = useToast();

  const handleGenerateQuestions = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate AI generation with realistic delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const sampleQuestions = [
        "What are the key factors to consider when implementing AI in business?",
        "How can machine learning improve customer experience?",
        "What ethical considerations should guide AI development?",
        "How do you measure the ROI of AI implementations?",
        "What are the emerging trends in artificial intelligence?"
      ];
      
      const randomQuestions = sampleQuestions
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      
      setQuestions(randomQuestions);
      
      toast({
        title: "Questions Generated! ✨",
        description: "AI has generated thoughtful questions for you.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative w-full">
      {/* Main Card */}
      <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 rounded-3xl p-8 shadow-2xl overflow-hidden">
        
        {/* Floating Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Language Icon (top left) */}
          <div className="absolute top-6 left-6 text-orange-200/80">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
            </svg>
          </div>

          {/* Floating Stars */}
          <div className="absolute top-8 right-12 w-2 h-2 bg-white/60 rounded-full animate-pulse" />
          <div className="absolute top-16 right-24 w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse delay-300" />
          <div className="absolute top-12 right-8 w-1 h-1 bg-white/50 rounded-full animate-pulse delay-700" />
          
          {/* Star Shapes */}
          <div className="absolute top-10 right-16 text-white/40 animate-pulse delay-500">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          
          <div className="absolute top-20 right-32 text-white/30 animate-pulse delay-1000">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>

          {/* Large Star */}
          <div className="absolute top-16 right-20 text-white/20 animate-pulse delay-800">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>

          {/* Additional floating dots */}
          <div className="absolute top-24 right-14 w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce delay-400" />
          <div className="absolute top-28 right-28 w-1 h-1 bg-white/40 rounded-full animate-bounce delay-600" />
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          {/* Main Title */}
          <h1 className="text-4xl font-bold text-white mb-3 leading-tight">
            AI Question Generator
          </h1>
          
          {/* Subtitle */}
          <p className="text-orange-100/90 text-lg mb-8 leading-relaxed">
            Generates intelligent questions for various languages and topics.
          </p>

          {/* Generate Button */}
          <Button
            onClick={handleGenerateQuestions}
            disabled={isGenerating}
            className="bg-white/20 hover:bg-white/30 text-white font-semibold py-4 px-8 rounded-2xl backdrop-blur-sm border border-white/20 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating Questions...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Generate AI Questions
              </div>
            )}
          </Button>
        </div>
      </div>

      {/* Question Generator Results */}
      {questions.length > 0 && (
        <div className="mt-6">
          <QuestionGenerator questions={questions} />
        </div>
      )}
    </div>
  );
};

export default AICard;
