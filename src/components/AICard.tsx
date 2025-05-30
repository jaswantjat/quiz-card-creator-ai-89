
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
    <div className="relative">
      <FloatingElements />
      
      {/* Main Card */}
      <div className="relative bg-gradient-to-br from-orange-500 via-red-500 to-purple-600 p-[1px] rounded-3xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 group">
        <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-3xl p-8 relative overflow-hidden">
          
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/10 to-purple-600/10 rounded-3xl" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
          
          {/* Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">AI Assistant</h2>
                <p className="text-gray-300 text-sm">Intelligent Question Generator</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-300 mb-8 leading-relaxed">
              Supercharged AI tools for generating thoughtful questions. 
              Get personalized insights and discover new perspectives.
            </p>

            {/* Generate Button */}
            <Button
              onClick={handleGenerateQuestions}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed mb-6"
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

            {/* Features */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <div className="w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                  <Zap className="w-3 h-3 text-white" />
                </div>
                <span>Instant AI-powered generation</span>
              </div>
              
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <div className="w-5 h-5 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center">
                  <Stars className="w-3 h-3 text-white" />
                </div>
                <span>Personalized question insights</span>
              </div>
              
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <div className="w-5 h-5 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                  <Brain className="w-3 h-3 text-white" />
                </div>
                <span>Advanced AI algorithms</span>
              </div>
            </div>
          </div>
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
