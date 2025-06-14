import { memo, useState, useCallback, useMemo, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen, Plus, RotateCcw, Loader2, CheckCircle2, Clock, RefreshCw, MessageSquare, Edit2, Trash2, User } from 'lucide-react';
import { toast } from 'sonner';
import { commentsAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useQuestionAutoScroll } from '@/hooks/useAutoScroll';

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

interface Comment {
  id: string;
  commentText: string;
  createdAt: string;
  updatedAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
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
  regeneratingQuestionIds?: Set<string>;
}

// Difficulty color mapping
const DIFFICULTY_COLORS = {
  easy: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  hard: 'bg-red-100 text-red-800 border-red-200'
};

// Individual Question Card with smooth animations
const QuestionCard = memo(({
  question,
  index,
  onAddToQB,
  onRegenerateQuestion,
  isNew = false,
  isRegenerating = false
}: {
  question: MCQQuestion;
  index: number;
  onAddToQB: (id: string) => void;
  onRegenerateQuestion?: (questionId: string) => void;
  isNew?: boolean;
  isRegenerating?: boolean;
}) => {
  const { user, isAuthenticated } = useAuth();
  // FIXED: Always start visible to prevent blank screen issues
  const [isVisible, setIsVisible] = useState(true);
  const [comment, setComment] = useState('');
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [savingComment, setSavingComment] = useState(false);

  useEffect(() => {
    if (isNew) {
      // FIXED: No delay for visibility - questions should be immediately visible
      setIsVisible(true);
    }
  }, [isNew]);

  const handleAddClick = useCallback(() => {
    onAddToQB(question.id);
    toast.success('Question added to Question Bank!');
  }, [onAddToQB, question.id]);

  const handleRegenerateClick = useCallback(() => {
    if (onRegenerateQuestion && !isRegenerating) {
      onRegenerateQuestion(question.id);
      // Don't show toast here - let the parent component handle feedback
    }
  }, [onRegenerateQuestion, question.id, isRegenerating]);

  // Comment handlers
  const loadComments = useCallback(async () => {
    if (!showCommentBox || loadingComments) return;

    setLoadingComments(true);
    try {
      const response = await commentsAPI.getComments(question.id);
      setComments(response.comments || []);
    } catch (error) {
      console.error('Failed to load comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoadingComments(false);
    }
  }, [question.id, showCommentBox, loadingComments]);

  const handleCommentSave = useCallback(async () => {
    if (!comment.trim() || savingComment) return;

    setSavingComment(true);
    try {
      const response = await commentsAPI.addComment(question.id, comment.trim());
      setComments(prev => [response.comment, ...prev]);
      setComment('');
      toast.success('Comment added successfully!');
    } catch (error) {
      console.error('Failed to save comment:', error);
      toast.error('Failed to save comment');
    } finally {
      setSavingComment(false);
    }
  }, [question.id, comment, savingComment]);

  const handleEditComment = useCallback(async (commentId: string, newText: string) => {
    try {
      const response = await commentsAPI.updateComment(question.id, commentId, newText);
      setComments(prev => prev.map(c => c.id === commentId ? response.comment : c));
      toast.success('Comment updated successfully!');
    } catch (error) {
      console.error('Failed to update comment:', error);
      toast.error('Failed to update comment');
    }
  }, [question.id]);

  const handleDeleteComment = useCallback(async (commentId: string) => {
    try {
      await commentsAPI.deleteComment(question.id, commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
      toast.success('Comment deleted successfully!');
    } catch (error) {
      console.error('Failed to delete comment:', error);
      toast.error('Failed to delete comment');
    }
  }, [question.id]);

  // Load comments when comment box is opened
  useEffect(() => {
    if (showCommentBox) {
      loadComments();
    }
  }, [showCommentBox, loadComments]);

  const difficultyBadgeClass = useMemo(() =>
    DIFFICULTY_COLORS[question.difficulty] || 'bg-gray-100 text-gray-800 border-gray-200',
    [question.difficulty]
  );

  const capitalizedDifficulty = useMemo(() =>
    question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1),
    [question.difficulty]
  );

  // ENHANCED DEBUG: Detailed logging for troubleshooting blank screen
  console.log(`🎨 QuestionCard ${index + 1} RENDERING:`, {
    id: question.id,
    hasQuestion: !!question.question,
    questionText: question.question?.substring(0, 50) + '...',
    hasOptions: !!question.options,
    optionsLength: question.options?.length,
    isVisible,
    isNew,
    difficulty: question.difficulty
  });

  return (
    <Card
      className={`
        bg-white/95 border-orange-200/60 shadow-lg hover:shadow-xl
        transition-all duration-500 ease-out transform
        ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-95 translate-y-1 scale-99'}
        ${isNew ? 'ring-2 ring-orange-300 ring-opacity-50 animate-pulse' : ''}
        hover:scale-[1.02] hover:-translate-y-1
      `}
    >
      <CardContent className="p-6">
        {/* Question Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-sm font-semibold text-slate-500">Q{index + 1}</span>
              {/* 1. First badge: MCQ (Question Type) */}
              {question.metadata?.questionType && (
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                  {question.metadata.questionType}
                </Badge>
              )}
              {/* 2. Second badge: Difficulty Level */}
              <Badge className={difficultyBadgeClass}>
                {capitalizedDifficulty}
              </Badge>
              {/* 3. Third badge: Sub-Topics */}
              {question.metadata?.subTopics && (
                <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                  {question.metadata.subTopics}
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
              Comment {comments.length > 0 && `(${comments.length})`}
            </Button>
            {onRegenerateQuestion && (
              <Button
                onClick={handleRegenerateClick}
                size="sm"
                variant="outline"
                disabled={isRegenerating}
                className={`transition-colors ${
                  isRegenerating
                    ? 'bg-yellow-100 border-yellow-300 text-yellow-700 cursor-not-allowed'
                    : 'hover:bg-yellow-50 hover:border-yellow-300'
                }`}
              >
                <RefreshCw className={`w-4 h-4 mr-1 ${isRegenerating ? 'animate-spin' : ''}`} />
                {isRegenerating ? 'Regenerating...' : 'Regenerate'}
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
          <h4 className="text-lg font-semibold text-slate-800 leading-relaxed">
            {question.question}
          </h4>
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
        <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-2">
            <BookOpen className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h5 className="font-semibold text-blue-800 mb-1">Explanation</h5>
              <p className="text-blue-700 leading-relaxed">{question.explanation}</p>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        {showCommentBox && (
          <div className="mb-6 bg-gray-50 border border-gray-200 rounded-xl p-4">
            <h4 className="font-semibold text-gray-800 mb-4">Subject Matter Expert Comments</h4>

            {/* Add New Comment */}
            {isAuthenticated && (
              <div className="mb-4 p-3 bg-white rounded-lg border">
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add your comments or feedback about this question..."
                  className="mb-3 min-h-[80px] resize-none"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    onClick={() => {
                      setShowCommentBox(false);
                      setComment('');
                    }}
                    size="sm"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCommentSave}
                    size="sm"
                    disabled={savingComment || !comment.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {savingComment ? 'Saving...' : 'Save Comment'}
                  </Button>
                </div>
              </div>
            )}

            {!isAuthenticated && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  Please log in to add comments to this question.
                </p>
              </div>
            )}

            {/* Existing Comments */}
            <div className="space-y-3">
              {loadingComments ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-600 mt-2">Loading comments...</p>
                </div>
              ) : comments.length > 0 ? (
                comments.map((commentItem) => (
                  <div key={commentItem.id} className="bg-white rounded-lg border p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-sm text-gray-800">
                          {commentItem.user.firstName} {commentItem.user.lastName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(commentItem.createdAt).toLocaleDateString()}
                        </span>
                        {commentItem.updatedAt !== commentItem.createdAt && (
                          <span className="text-xs text-gray-400">(edited)</span>
                        )}
                      </div>

                      {/* Edit/Delete buttons for comment owner */}
                      {user?.email === commentItem.user.email && (
                        <div className="flex gap-1">
                          <Button
                            onClick={() => handleEditComment(commentItem.id, commentItem.commentText)}
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 hover:bg-blue-100"
                          >
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteComment(commentItem.id)}
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 hover:bg-red-100"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                      {commentItem.commentText}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">No comments yet</p>
                  {isAuthenticated && (
                    <p className="text-xs text-gray-500">Be the first to add feedback!</p>
                  )}
                </div>
              )}
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
  onRegenerateQuestion,
  regeneratingQuestionIds = new Set()
}: ProgressiveQuestionDisplayProps) => {
  const [newQuestionIds, setNewQuestionIds] = useState<Set<string>>(new Set());
  const { scrollToQuestions, questionsRef } = useQuestionAutoScroll();

  // Track new questions for animation and auto-scroll
  useEffect(() => {
    if (questions.length > 0) {
      const currentIds = new Set(questions.map(q => q.id));
      const newIds = new Set([...currentIds].filter(id => !newQuestionIds.has(id)));

      if (newIds.size > 0) {
        setNewQuestionIds(currentIds);

        // Auto-scroll to questions when first batch is rendered
        // Only scroll on the very first questions (when newQuestionIds was empty)
        if (newQuestionIds.size === 0) {
          console.log('🔄 Auto-scroll: First questions rendered, scrolling to questions section');
          scrollToQuestions(undefined, 800); // 800ms delay to ensure rendering is complete
        }

        // Remove "new" status after animation
        setTimeout(() => {
          setNewQuestionIds(prev => new Set([...prev, ...newIds]));
        }, 2000);
      }
    }
  }, [questions, newQuestionIds, scrollToQuestions]);

  const handleAddToQB = useCallback((questionId: string) => {
    onAddToQB(questionId);
  }, [onAddToQB]);

  const questionsCount = useMemo(() => questions.length, [questions.length]);

  // ENHANCED DEBUG: Track main component rendering
  console.log('🔍 ProgressiveQuestionDisplay RENDERING:', {
    questionsCount,
    hasQuestions: questions.length > 0,
    loadingPhase: loadingState.phase,
    loadingError: loadingState.error,
    isLoading: loadingState.isLoading,
    firstQuestionId: questions[0]?.id || 'none'
  });

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
    <div className="space-y-6 animate-in fade-in-50 duration-500" ref={questionsRef}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <BookOpen className="w-6 h-6 text-orange-500" />
        <h3 className="text-2xl font-semibold text-slate-800">Generated Questions</h3>
        <Badge variant="outline" className="text-slate-600">
          {questionsCount} Question{questionsCount !== 1 ? 's' : ''}
        </Badge>
      </div>



      {/* Questions */}
      <div className="space-y-6">
        {questions.length > 0 ? (
          questions.map((question, index) => {
            const isNew = !newQuestionIds.has(question.id);
            const isRegenerating = regeneratingQuestionIds.has(question.id);
            console.log(`🔄 Rendering question ${index + 1}:`, { id: question.id, isNew, isRegenerating });
            return (
              <QuestionCard
                key={question.id}
                question={question}
                index={index}
                onAddToQB={handleAddToQB}
                onRegenerateQuestion={onRegenerateQuestion}
                isNew={isNew}
                isRegenerating={isRegenerating}
              />
            );
          })
        ) : (
          <div className="text-center py-8 text-slate-500">
            <p>No questions to display</p>
          </div>
        )}
      </div>


    </div>
  );
});

ProgressiveQuestionDisplay.displayName = 'ProgressiveQuestionDisplay';

export default ProgressiveQuestionDisplay;
