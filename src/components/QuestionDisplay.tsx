
import { memo, useMemo, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Plus, CheckCircle, BookOpen } from "lucide-react";

interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface QuestionDisplayProps {
  questions: MCQQuestion[];
  onAddToQB: (questionId: string) => void;
  onRegenerate: () => void;
}

const QuestionDisplay = memo(({ questions, onAddToQB, onRegenerate }: QuestionDisplayProps) => {
  const handleAddToQB = useCallback((questionId: string) => {
    onAddToQB(questionId);
    console.log('Question added to QB:', questionId);
  }, [onAddToQB]);

  const getDifficultyColor = useCallback((difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }, []);

  const questionsCount = useMemo(() => questions.length, [questions.length]);

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      {/* Header */}
      <div className="flex items-center gap-3">
        <BookOpen className="w-6 h-6 text-orange-500" />
        <h3 className="text-2xl font-semibold text-slate-800">Generated Questions</h3>
        <Badge variant="outline" className="text-slate-600">
          {questionsCount} Question{questionsCount !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Questions - Optimized animations */}
      <div className="space-y-6">
        {questions.map((question, index) => (
          <Card
            key={question.id}
            className="bg-white/95 border-orange-200/60 shadow-lg hover:shadow-xl transition-all duration-200 hover-lift gpu-accelerated smooth-scale"
          >
            <CardContent className="p-6">
              {/* Question Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-slate-500">Q{index + 1}</span>
                    <Badge className={getDifficultyColor(question.difficulty)}>
                      {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                    </Badge>
                  </div>
                  <h4 className="text-lg font-semibold text-slate-800 leading-relaxed">
                    {question.question}
                  </h4>
                </div>
              </div>

              {/* Options - Creator View */}
              <div className="space-y-3 mb-6">
                {question.options.map((option, optionIndex) => {
                  const isCorrect = optionIndex === question.correctAnswer;
                  
                  let optionClass = "p-4 rounded-xl border-2 transition-all duration-200 ";
                  
                  if (isCorrect) {
                    optionClass += "bg-green-50 border-green-300 text-green-800";
                  } else {
                    optionClass += "bg-gray-50 border-gray-200 text-gray-700";
                  }

                  return (
                    <div key={optionIndex} className={optionClass}>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-current/10 text-current font-semibold text-sm">
                          {String.fromCharCode(65 + optionIndex)}
                        </div>
                        <span className="flex-1">{option}</span>
                        {isCorrect && (
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                              Correct Answer
                            </Badge>
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Explanation */}
              <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-semibold text-blue-800 mb-1">Explanation</h5>
                    <p className="text-blue-700 leading-relaxed">{question.explanation}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center">
                <Button
                  onClick={onRegenerate}
                  variant="outline"
                  className="border-orange-200 text-orange-600 hover:bg-orange-50"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
                
                <Button
                  onClick={() => handleAddToQB(question.id)}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 gpu-accelerated"
                >
                  <Plus className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:rotate-90" />
                  Add to QB
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
});

QuestionDisplay.displayName = 'QuestionDisplay';

export default QuestionDisplay;
