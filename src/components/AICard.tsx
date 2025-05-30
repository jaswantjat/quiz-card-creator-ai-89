
import { useState } from "react";
import { Sparkles, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import QuestionGenerator from "./QuestionGenerator";
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
      <div className="relative bg-white rounded-3xl p-8 shadow-2xl overflow-hidden border border-orange-100">
        
        {/* Orange Gradient Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 opacity-30"></div>
        
        {/* Orange Glow Effect */}
        <div className="absolute -inset-4 bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 rounded-3xl blur-xl opacity-20 animate-pulse"></div>
        
        {/* Floating Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating Stars */}
          <div className="absolute top-8 right-12 w-3 h-3 bg-orange-400/60 rounded-full animate-pulse" />
          <div className="absolute top-16 right-24 w-2 h-2 bg-orange-300/50 rounded-full animate-pulse delay-300" />
          <div className="absolute top-12 right-8 w-1.5 h-1.5 bg-orange-500/40 rounded-full animate-pulse delay-700" />
          
          {/* Star Shapes */}
          <div className="absolute top-10 right-16 text-orange-400/50 animate-pulse delay-500">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          
          <div className="absolute top-20 right-32 text-orange-300/40 animate-pulse delay-1000">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>

          {/* Large Star */}
          <div className="absolute top-16 right-20 text-orange-200/30 animate-pulse delay-800">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>

          {/* Additional floating dots */}
          <div className="absolute top-24 right-14 w-2 h-2 bg-orange-300/40 rounded-full animate-bounce delay-400" />
          <div className="absolute top-28 right-28 w-1.5 h-1.5 bg-orange-400/50 rounded-full animate-bounce delay-600" />
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          {/* Main Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-3 leading-tight">
            AI Question Generator
          </h1>
          
          {/* Subtitle */}
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            Generates intelligent questions for various languages and topics.
          </p>

          {/* Generate Button */}
          <Button
            onClick={handleGenerateQuestions}
            disabled={isGenerating}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed border-0"
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
