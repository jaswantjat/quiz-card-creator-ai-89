
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

// Memoized difficulty color mapping for better performance
const DIFFICULTY_COLORS = {
  easy: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  hard: 'bg-red-100 text-red-800 border-red-200'
} as const;

// Memoized option letters to prevent recreation
const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'] as const;

// Separate QuestionCard component for better performance
const QuestionCard = memo(({
  question,
  index,
  onAddToQB,
  onRegenerate,
  getDifficultyColor
}: {
  question: MCQQuestion;
  index: number;
  onAddToQB: (id: string) => void;
  onRegenerate: () => void;
  getDifficultyColor: (difficulty: string) => string;
}) => {
  const handleAddClick = useCallback(() => {
    onAddToQB(question.id);
  }, [onAddToQB, question.id]);

  const difficultyBadgeClass = useMemo(() =>
    getDifficultyColor(question.difficulty),
    [getDifficultyColor, question.difficulty]
  );

  const capitalizedDifficulty = useMemo(() =>
    question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1),
    [question.difficulty]
  );

  return (
    <Card className="bg-white/95 border-orange-200/60 shadow-lg hover:shadow-xl smooth-transition hover-lift gpu-accelerated">
      <CardContent className="p-6">
        {/* Question Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold text-slate-500">Q{index + 1}</span>
              <Badge className={difficultyBadgeClass}>
                {capitalizedDifficulty}
              </Badge>
            </div>
            <h4 className="text-lg font-semibold text-slate-800 leading-relaxed">
              {question.question}
            </h4>
          </div>
        </div>

        {/* Options - Optimized rendering */}
        <div className="space-y-3 mb-6">
          {question.options.map((option, optionIndex) => {
            const isCorrect = optionIndex === question.correctAnswer;
            const optionLetter = OPTION_LETTERS[optionIndex];

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
            className="border-orange-200 text-orange-600 hover:bg-orange-50 smooth-transition"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Regenerate
          </Button>

          <Button
            onClick={handleAddClick}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl smooth-transition transform hover:scale-105 active:scale-95 gpu-accelerated"
          >
            <Plus className="w-4 h-4 mr-2 smooth-transition group-hover:rotate-90" />
            Add to QB
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

QuestionCard.displayName = 'QuestionCard';

const QuestionDisplay = memo(({ questions, onAddToQB, onRegenerate }: QuestionDisplayProps) => {
  const handleAddToQB = useCallback((questionId: string) => {
    onAddToQB(questionId);
  }, [onAddToQB]);

  const getDifficultyColor = useCallback((difficulty: string) => {
    return DIFFICULTY_COLORS[difficulty as keyof typeof DIFFICULTY_COLORS] || 'bg-gray-100 text-gray-800 border-gray-200';
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

      {/* Questions - Optimized with better performance */}
      <div className="space-y-6">
        {questions.map((question, index) => (
          <QuestionCard
            key={question.id}
            question={question}
            index={index}
            onAddToQB={handleAddToQB}
            onRegenerate={onRegenerate}
            getDifficultyColor={getDifficultyColor}
          />
        ))}
      </div>


    </div>
  );
});

QuestionDisplay.displayName = 'QuestionDisplay';

export default QuestionDisplay;
