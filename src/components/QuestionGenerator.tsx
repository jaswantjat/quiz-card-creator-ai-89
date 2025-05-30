
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuestionGeneratorProps {
  questions: string[];
}

const QuestionGenerator = ({ questions }: QuestionGeneratorProps) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      toast({
        title: "Copied!",
        description: "Question copied to clipboard.",
      });
      
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-orange-500" />
        Generated Questions
      </h3>
      
      {questions.map((question, index) => (
        <Card
          key={index}
          className="bg-white border-gray-200 p-4 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:border-orange-200"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-gray-700 leading-relaxed flex-1">{question}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(question, index)}
              className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              {copiedIndex === index ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default QuestionGenerator;
