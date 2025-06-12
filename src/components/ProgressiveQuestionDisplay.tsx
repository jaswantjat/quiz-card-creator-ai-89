import { memo, useState, useCallback, useMemo, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen, Plus, RotateCcw, Loader2, CheckCircle2, Clock, MessageSquare, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

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

interface ProgressiveLoadingState {
  phase: 'initial' | 'background' | 'complete';
  questionsLoaded: number;
  totalExpected: number;
  isLoading: boolean;
  error?: string;
}

interface ProgressiveQuestionDisplayProps {
  questions: MCQQuestion[];
  loadingState: ProgressiveLoadingState;
  onAddToQB: (questionId: string) => void;
  onRegenerate: () => void;
  onRegenerateQuestion?: (questionId: string) => void;
}

// Difficulty color mapping
const DIFFICULTY_COLORS = {
  easy: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  hard: 'bg-red-100 text-red-800 border-red-200'
};

// Difficulty order for sorting
const DIFFICULTY_ORDER = {
  easy: 1,
  medium: 2,
  hard: 3
};

// Individual Question Card with smooth animations
const QuestionCard = memo(({
  question,
  index,
  onAddToQB,
  onRegenerateQuestion,
  isNew = false
}: {
  question: MCQQuestion;
  index: number;
  onAddToQB: (id: string) => void;
  onRegenerateQuestion?: (questionId: string) => void;
  isNew?: boolean;
}) => {
  const [isVisible, setIsVisible] = useState(true); // Always visible for immediate display
  const [comment, setComment] = useState('');
  const [showCommentBox, setShowCommentBox] = useState(false);

  useEffect(() => {
    if (isNew) {
      // Smooth entrance animation for new questions
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isNew]);

  const handleAddClick = useCallback(() => {
    onAddToQB(question.id);
    toast.success('Question added to Question Bank!');
  }, [onAddToQB, question.id]);

  const handleRegenerateClick = useCallback(() => {
    if (onRegenerateQuestion) {
      onRegenerateQuestion(question.id);
      toast.info('Regenerating this question...');
    }
  }, [onRegenerateQuestion, question.id]);

  const handleCommentSave = useCallback(() => {
    // TODO: Implement comment saving functionality
    toast.success('Comment saved for review!');
    setShowCommentBox(false);
  }, [comment]);

  const difficultyBadgeClass = useMemo(() =>
    DIFFICULTY_COLORS[question.difficulty] || 'bg-gray-100 text-gray-800 border-gray-200',
    [question.difficulty]
  );

  const capitalizedDifficulty = useMemo(() =>
    question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1),
    [question.difficulty]
  );

  return (
    <Card 
      className={`
        bg-white/95 border-orange-200/60 shadow-lg hover:shadow-xl 
        transition-all duration-500 ease-out transform
        ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}
        ${isNew ? 'ring-2 ring-orange-300 ring-opacity-50' : ''}
        hover:scale-[1.02] hover:-translate-y-1
      `}
    >
      <CardContent className="p-6">
        {/* Question Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-sm font-semibold text-slate-500">Q{index + 1}</span>
              <Badge className={difficultyBadgeClass}>
                {capitalizedDifficulty}
              </Badge>
              {question.metadata?.questionType && (
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                  {question.metadata.questionType}
                </Badge>
              )}
              {isNew && (
                <Badge className="bg-orange-100 text-orange-800 border-orange-200 animate-pulse">
                  New
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Button
              onClick={() => setShowCommentBox(!showCommentBox)}
              size="sm"
              variant="outline"
              className="hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              <MessageSquare className="w-4 h-4 mr-1" />
              Comment
            </Button>
            {onRegenerateQuestion && (
              <Button
                onClick={handleRegenerateClick}
                size="sm"
                variant="outline"
                className="hover:bg-yellow-50 hover:border-yellow-300 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Regenerate
              </Button>
            )}
            <Button
              onClick={handleAddClick}
              size="sm"
              variant="outline"
              className="hover:bg-orange-50 hover:border-orange-300 transition-colors"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add to QB
            </Button>
          </div>
        </div>

        {/* Question Text */}
        <div className="mb-6">
          <p className="text-slate-800 text-lg leading-relaxed font-medium">
            {question.question}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {question.options.map((option, optionIndex) => (
            <div
              key={optionIndex}
              className={`
                p-4 rounded-xl border-2 transition-all duration-200
                ${optionIndex === question.correctAnswer
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }
              `}
            >
              <div className="flex items-start gap-3">
                <span className={`
                  flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold
                  ${optionIndex === question.correctAnswer
                    ? 'bg-green-200 text-green-800'
                    : 'bg-slate-200 text-slate-600'
                  }
                `}>
                  {String.fromCharCode(65 + optionIndex)}
                </span>
                <span className="flex-1">{option}</span>
                {optionIndex === question.correctAnswer && (
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Explanation */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h4 className="font-semibold text-blue-800 mb-2">Explanation</h4>
          <p className="text-blue-700 leading-relaxed">{question.explanation}</p>
        </div>

        {/* Comment Box */}
        {showCommentBox && (
          <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
            <h4 className="font-semibold text-gray-800 mb-2">Subject Matter Expert Comments</h4>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add your comments or feedback about this question..."
              className="mb-3 min-h-[80px] resize-none"
            />
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => setShowCommentBox(false)}
                size="sm"
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCommentSave}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save Comment
              </Button>
            </div>
          </div>
        )}

        {/* Metadata */}
        {question.metadata && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="flex flex-wrap gap-2 text-xs text-slate-500">
              {question.metadata.author && (
                <span>Author: {question.metadata.author}</span>
              )}
              {question.metadata.topic && (
                <span>• Topic: {question.metadata.topic}</span>
              )}
              {question.metadata.subTopics && (
                <span>• Sub-topics: {question.metadata.subTopics}</span>
              )}
              {question.metadata.score && (
                <span>• Score: {question.metadata.score}</span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

QuestionCard.displayName = 'QuestionCard';

// Progressive Loading Status Component
const LoadingStatus = memo(({ loadingState }: { loadingState: ProgressiveLoadingState }) => {
  const getStatusIcon = () => {
    switch (loadingState.phase) {
      case 'initial':
        return <Loader2 className="w-4 h-4 animate-spin text-orange-500" />;
      case 'background':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'complete':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      default:
        return <Loader2 className="w-4 h-4 animate-spin text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (loadingState.phase) {
      case 'initial':
        return 'Loading initial questions...';
      case 'background':
        return 'Loading additional questions in background...';
      case 'complete':
        return 'All questions loaded!';
      default:
        return 'Processing...';
    }
  };

  const progressPercentage = Math.round((loadingState.questionsLoaded / loadingState.totalExpected) * 100);

  if (loadingState.phase === 'complete' && !loadingState.isLoading) {
    return null; // Hide status when complete
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm border border-orange-200 rounded-xl p-4 mb-6">
      <div className="flex items-center gap-3 mb-2">
        {getStatusIcon()}
        <span className="text-sm font-medium text-slate-700">{getStatusText()}</span>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <span className="text-xs text-slate-500 font-medium">
          {loadingState.questionsLoaded}/{loadingState.totalExpected} ({progressPercentage}%)
        </span>
      </div>
    </div>
  );
});

LoadingStatus.displayName = 'LoadingStatus';

// Main Progressive Question Display Component
const ProgressiveQuestionDisplay = memo(({
  questions,
  loadingState,
  onAddToQB,
  onRegenerate,
  onRegenerateQuestion
}: ProgressiveQuestionDisplayProps) => {
  const [newQuestionIds, setNewQuestionIds] = useState<Set<string>>(new Set());

  // Sort questions by difficulty: Easy → Medium → Hard
  const sortedQuestions = useMemo(() => {
    console.log('🔄 Sorting questions:', questions.length);
    return [...questions].sort((a, b) => {
      const orderA = DIFFICULTY_ORDER[a.difficulty] || 999;
      const orderB = DIFFICULTY_ORDER[b.difficulty] || 999;
      return orderA - orderB;
    });
  }, [questions]);

  // Track new questions for animation
  useEffect(() => {
    if (sortedQuestions.length > 0) {
      const currentIds = new Set(sortedQuestions.map(q => q.id));
      const newIds = new Set([...currentIds].filter(id => !newQuestionIds.has(id)));

      if (newIds.size > 0) {
        setNewQuestionIds(currentIds);

        // Remove "new" status after animation
        setTimeout(() => {
          setNewQuestionIds(prev => new Set([...prev, ...newIds]));
        }, 2000);
      }
    }
  }, [sortedQuestions, newQuestionIds]);

  const handleAddToQB = useCallback((questionId: string) => {
    onAddToQB(questionId);
  }, [onAddToQB]);

  const questionsCount = useMemo(() => sortedQuestions.length, [sortedQuestions.length]);

  // Debug logging
  useEffect(() => {
    console.log('🔍 ProgressiveQuestionDisplay Debug:', {
      questionsReceived: questions.length,
      sortedQuestionsCount: sortedQuestions.length,
      loadingState,
      firstQuestion: questions[0]
    });
  }, [questions, sortedQuestions, loadingState]);

  if (loadingState.error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">
          <p className="font-semibold">Error loading questions</p>
          <p className="text-sm">{loadingState.error}</p>
        </div>
        <Button onClick={onRegenerate} variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

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

      {/* Loading Status */}
      <LoadingStatus loadingState={loadingState} />

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm">
          <strong>Debug:</strong> Questions: {questions.length}, Sorted: {sortedQuestions.length}, Loading: {loadingState.isLoading ? 'Yes' : 'No'}
          {questions.length > 0 && (
            <div className="mt-2">
              <strong>First Question:</strong> {questions[0]?.question?.substring(0, 50)}...
            </div>
          )}
        </div>
      )}

      {/* Questions */}
      {sortedQuestions.length > 0 ? (
        <div className="space-y-6">
          {sortedQuestions.map((question, index) => {
            const isNew = !newQuestionIds.has(question.id);
            return (
              <QuestionCard
                key={question.id}
                question={question}
                index={index}
                onAddToQB={handleAddToQB}
                onRegenerateQuestion={onRegenerateQuestion}
                isNew={isNew}
              />
            );
          })}
        </div>
      ) : !loadingState.isLoading ? (
        <div className="text-center py-8 text-slate-500">
          <p>No questions generated yet. Click "Generate Questions" to start.</p>
        </div>
      ) : null}

      {/* Regenerate Button */}
      {questionsCount > 0 && (
        <div className="flex justify-center pt-6">
          <Button
            onClick={onRegenerate}
            variant="outline"
            className="hover:bg-orange-50 hover:border-orange-300"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Regenerate Questions
          </Button>
        </div>
      )}
    </div>
  );
});

ProgressiveQuestionDisplay.displayName = 'ProgressiveQuestionDisplay';

export default ProgressiveQuestionDisplay;
