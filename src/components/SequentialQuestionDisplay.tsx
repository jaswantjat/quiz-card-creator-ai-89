import { memo, useState, useCallback, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Plus, RefreshCw, CheckCircle, BookOpen } from "lucide-react";

interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  metadata?: {
    subTopics?: string;
    author?: string;
    topic?: string;
    score?: string;
    questionType?: string;
  };
}

interface SequentialQuestionDisplayProps {
  questions: MCQQuestion[];
  onAddToQB: (questionId: string) => void;
  onRegenerate: () => void;
}

// Difficulty color mapping
const DIFFICULTY_COLORS = {
  easy: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  hard: 'bg-red-100 text-red-800 border-red-200'
};

const SequentialQuestionDisplay = memo(({ questions, onAddToQB, onRegenerate }: SequentialQuestionDisplayProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentQuestion = useMemo(() => 
    questions[currentQuestionIndex], 
    [questions, currentQuestionIndex]
  );

  const totalQuestions = useMemo(() => questions.length, [questions.length]);

  const handlePrevious = useCallback(() => {
    setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1));
  }, [questions.length]);

  const handleAddToQB = useCallback(() => {
    if (currentQuestion) {
      onAddToQB(currentQuestion.id);
    }
  }, [currentQuestion, onAddToQB]);

  const getDifficultyColor = useCallback((difficulty: string) => {
    return DIFFICULTY_COLORS[difficulty as keyof typeof DIFFICULTY_COLORS] || 'bg-gray-100 text-gray-800 border-gray-200';
  }, []);

  const capitalizedDifficulty = useMemo(() => 
    currentQuestion?.difficulty.charAt(0).toUpperCase() + currentQuestion?.difficulty.slice(1),
    [currentQuestion?.difficulty]
  );

  if (!currentQuestion) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">No questions available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      {/* Header with Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-orange-500" />
          <h3 className="text-2xl font-semibold text-slate-800">Generated Questions</h3>
          <Badge variant="outline" className="text-slate-600">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </Badge>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-2">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            variant="outline"
            size="sm"
            className="border-orange-200 text-orange-600 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={currentQuestionIndex === questions.length - 1}
            variant="outline"
            size="sm"
            className="border-orange-200 text-orange-600 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Question Card */}
      <Card className="bg-white/95 border-orange-200/60 shadow-lg hover:shadow-xl smooth-transition hover-lift gpu-accelerated">
        <CardContent className="p-6">
          {/* Question Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-sm font-semibold text-slate-500">Q{currentQuestionIndex + 1}</span>
                <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                  {capitalizedDifficulty}
                </Badge>
                {currentQuestion.metadata?.questionType && (
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                    {currentQuestion.metadata.questionType}
                  </Badge>
                )}
                {currentQuestion.metadata?.subTopics && (
                  <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                    {currentQuestion.metadata.subTopics}
                  </Badge>
                )}
              </div>
              <h4 className="text-lg font-semibold text-slate-800 leading-relaxed">
                {currentQuestion.question}
              </h4>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, optionIndex) => {
              const optionLetter = String.fromCharCode(65 + optionIndex); // A, B, C, D, E
              const isCorrect = optionIndex === currentQuestion.correctAnswer;

              return (
                <div
                  key={optionIndex}
                  className={`p-4 rounded-xl border-2 smooth-transition ${
                    isCorrect
                      ? "bg-green-50 border-green-300 text-green-800"
                      : "bg-gray-50 border-gray-200 text-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-current/10 text-current font-semibold text-sm">
                      {optionLetter}
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
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
            <h5 className="font-semibold text-blue-800 mb-1">Explanation</h5>
            <p className="text-blue-700 leading-relaxed">{currentQuestion.explanation}</p>
          </div>

          {/* Question Metadata */}
          {currentQuestion.metadata && (
            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                {currentQuestion.metadata.author && (
                  <span className="flex items-center gap-1">
                    <span className="font-medium">Author:</span>
                    <span className="text-slate-600">{currentQuestion.metadata.author}</span>
                  </span>
                )}
                {currentQuestion.metadata.topic && (
                  <span className="flex items-center gap-1">
                    <span className="font-medium">Topic:</span>
                    <span className="text-slate-600">{currentQuestion.metadata.topic}</span>
                  </span>
                )}
                {currentQuestion.metadata.score && (
                  <span className="flex items-center gap-1">
                    <span className="font-medium">Score:</span>
                    <span className="text-slate-600">{currentQuestion.metadata.score}</span>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-4">
            <Button
              onClick={onRegenerate}
              variant="outline"
              className="border-orange-200 text-orange-600 hover:bg-orange-50 smooth-transition"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate All
            </Button>

            <Button
              onClick={handleAddToQB}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl smooth-transition transform hover:scale-105 active:scale-95 gpu-accelerated"
            >
              <Plus className="w-4 h-4 mr-2 smooth-transition group-hover:rotate-90" />
              Add to QB
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Question Navigation Dots */}
      <div className="flex justify-center gap-2">
        {questions.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentQuestionIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentQuestionIndex
                ? 'bg-orange-500 scale-125'
                : 'bg-orange-200 hover:bg-orange-300'
            }`}
            aria-label={`Go to question ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
});

SequentialQuestionDisplay.displayName = 'SequentialQuestionDisplay';

export default SequentialQuestionDisplay;
