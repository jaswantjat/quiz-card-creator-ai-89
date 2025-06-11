import { memo, useState, useCallback, useMemo, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Copy, Check, RotateCcw, Loader2, CheckCircle2, Clock } from 'lucide-react';
import { toast } from 'sonner';

// Unified question interface for progressive loading
interface UnifiedQuestion {
  id: string;
  question: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionType: string;
  generated: boolean;
  // Optional MCQ fields for future expansion
  options?: string[];
  correctAnswer?: number;
  explanation?: string;
  metadata?: {
    subTopics?: string;
    author?: string;
    score?: string;
  };
}

interface ProgressiveLoadingState {
  phase: 'initial' | 'loading' | 'complete';
  questionsLoaded: number;
  totalExpected: number;
  isLoading: boolean;
  error?: string;
}

interface SimpleProgressiveDisplayProps {
  questions: UnifiedQuestion[];
  loadingState: ProgressiveLoadingState;
  onAddToQB: (questionId: string) => void;
  onRegenerate: () => void;
}

// Difficulty color mapping
const DIFFICULTY_COLORS = {
  easy: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  hard: 'bg-red-100 text-red-800 border-red-200'
};

// Individual Question Card with smooth animations
const SimpleQuestionCard = memo(({
  question,
  index,
  onAddToQB,
  isNew = false
}: {
  question: UnifiedQuestion;
  index: number;
  onAddToQB: (id: string) => void;
  isNew?: boolean;
}) => {
  const [isVisible, setIsVisible] = useState(!isNew);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

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

  const copyToClipboard = useCallback(async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(idx);
      toast.success('Question copied to clipboard!');
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
      toast.error('Failed to copy question');
    }
  }, []);

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
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                {question.topic}
              </Badge>
              <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                {question.questionType}
              </Badge>
              {isNew && (
                <Badge className="bg-orange-100 text-orange-800 border-orange-200 animate-pulse">
                  New
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2 ml-4">
            <Button
              onClick={() => copyToClipboard(question.question, index)}
              size="sm"
              variant="outline"
              className="hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              {copiedIndex === index ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
            <Button
              onClick={handleAddClick}
              size="sm"
              variant="outline"
              className="hover:bg-orange-50 hover:border-orange-300 transition-colors"
            >
              Add to QB
            </Button>
          </div>
        </div>

        {/* Question Text */}
        <div className="mb-4">
          <p className="text-slate-800 text-lg leading-relaxed font-medium">
            {question.question}
          </p>
        </div>

        {/* Metadata */}
        {question.metadata && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="flex flex-wrap gap-2 text-xs text-slate-500">
              {question.metadata.author && (
                <span>Author: {question.metadata.author}</span>
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

SimpleQuestionCard.displayName = 'SimpleQuestionCard';

// Progressive Loading Status Component
const LoadingStatus = memo(({ loadingState }: { loadingState: ProgressiveLoadingState }) => {
  const getStatusIcon = () => {
    switch (loadingState.phase) {
      case 'initial':
        return <Loader2 className="w-4 h-4 animate-spin text-orange-500" />;
      case 'loading':
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
        return 'Starting question generation...';
      case 'loading':
        return 'Generating questions progressively...';
      case 'complete':
        return 'All questions generated!';
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

// Main Simple Progressive Display Component
const SimpleProgressiveDisplay = memo(({ 
  questions, 
  loadingState, 
  onAddToQB, 
  onRegenerate 
}: SimpleProgressiveDisplayProps) => {
  const [newQuestionIds, setNewQuestionIds] = useState<Set<string>>(new Set());

  // Track new questions for animation
  useEffect(() => {
    if (questions.length > 0) {
      const currentIds = new Set(questions.map(q => q.id));
      const newIds = new Set([...currentIds].filter(id => !newQuestionIds.has(id)));
      
      if (newIds.size > 0) {
        setNewQuestionIds(currentIds);
        
        // Remove "new" status after animation
        setTimeout(() => {
          setNewQuestionIds(prev => new Set([...prev, ...newIds]));
        }, 2000);
      }
    }
  }, [questions, newQuestionIds]);

  const handleAddToQB = useCallback((questionId: string) => {
    onAddToQB(questionId);
  }, [onAddToQB]);

  const questionsCount = useMemo(() => questions.length, [questions.length]);

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

      {/* Questions */}
      <div className="space-y-6">
        {questions.map((question, index) => {
          const isNew = !newQuestionIds.has(question.id);
          return (
            <SimpleQuestionCard
              key={question.id}
              question={question}
              index={index}
              onAddToQB={handleAddToQB}
              isNew={isNew}
            />
          );
        })}
      </div>

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

SimpleProgressiveDisplay.displayName = 'SimpleProgressiveDisplay';

export default SimpleProgressiveDisplay;
