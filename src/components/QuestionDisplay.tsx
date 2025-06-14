
import { memo, useMemo, useCallback, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCw, Plus, CheckCircle, BookOpen, MessageSquare, Edit2, Trash2, User } from "lucide-react";
import { toast } from 'sonner';
import { commentsAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

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

interface QuestionDisplayProps {
  questions: MCQQuestion[];
  onAddToQB: (questionId: string) => void;
  onRegenerate: () => void;
  onRegenerateQuestion?: (questionId: string) => void;
}

// Memoized difficulty color mapping for better performance
const DIFFICULTY_COLORS = {
  easy: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  hard: 'bg-red-100 text-red-800 border-red-200'
} as const;

// Difficulty order for sorting
const DIFFICULTY_ORDER = {
  easy: 1,
  medium: 2,
  hard: 3
};

// Memoized option letters to prevent recreation
const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'] as const;

// Separate QuestionCard component for better performance
const QuestionCard = memo(({
  question,
  index,
  onAddToQB,
  onRegenerate,
  onRegenerateQuestion,
  getDifficultyColor
}: {
  question: MCQQuestion;
  index: number;
  onAddToQB: (id: string) => void;
  onRegenerate: () => void;
  onRegenerateQuestion?: (questionId: string) => void;
  getDifficultyColor: (difficulty: string) => string;
}) => {
  const { user, isAuthenticated } = useAuth();
  const [comment, setComment] = useState('');
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [savingComment, setSavingComment] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState('');

  // Load comments when comment box is opened
  useEffect(() => {
    if (showCommentBox && !loadingComments) {
      loadComments();
    }
  }, [showCommentBox]);

  const loadComments = useCallback(async () => {
    try {
      setLoadingComments(true);
      const response = await commentsAPI.getComments(question.id);
      setComments(response.comments || []);
    } catch (error) {
      console.error('Failed to load comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoadingComments(false);
    }
  }, [question.id]);

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

  const handleCommentSave = useCallback(async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to add comments');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      setSavingComment(true);
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
  }, [comment, question.id, isAuthenticated]);

  const handleEditComment = useCallback((commentId: string, currentText: string) => {
    setEditingCommentId(commentId);
    setEditingCommentText(currentText);
  }, []);

  const handleUpdateComment = useCallback(async (commentId: string) => {
    if (!editingCommentText.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      await commentsAPI.updateComment(question.id, commentId, editingCommentText.trim());
      setComments(prev => prev.map(c =>
        c.id === commentId
          ? { ...c, commentText: editingCommentText.trim(), updatedAt: new Date().toISOString() }
          : c
      ));
      setEditingCommentId(null);
      setEditingCommentText('');
      toast.success('Comment updated successfully!');
    } catch (error) {
      console.error('Failed to update comment:', error);
      toast.error('Failed to update comment');
    }
  }, [editingCommentText, question.id]);

  const handleDeleteComment = useCallback(async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await commentsAPI.deleteComment(question.id, commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
      toast.success('Comment deleted successfully!');
    } catch (error) {
      console.error('Failed to delete comment:', error);
      toast.error('Failed to delete comment');
    }
  }, [question.id]);

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
            </div>
            <h4 className="text-lg font-semibold text-slate-800 leading-relaxed">
              {question.question}
            </h4>
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

                    {/* Comment Text */}
                    {editingCommentId === commentItem.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editingCommentText}
                          onChange={(e) => setEditingCommentText(e.target.value)}
                          className="min-h-[60px] resize-none"
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            onClick={() => {
                              setEditingCommentId(null);
                              setEditingCommentText('');
                            }}
                            size="sm"
                            variant="outline"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => handleUpdateComment(commentItem.id)}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Update
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {commentItem.commentText}
                      </p>
                    )}
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

        {/* Question Metadata */}
        {question.metadata && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex flex-wrap gap-3 text-xs text-slate-500">
              {question.metadata.author && (
                <span className="flex items-center gap-1">
                  <span className="font-medium">Author:</span>
                  <span className="text-slate-600">{question.metadata.author}</span>
                </span>
              )}
              {question.metadata.topic && (
                <span className="flex items-center gap-1">
                  <span className="font-medium">Topic:</span>
                  <span className="text-slate-600">{question.metadata.topic}</span>
                </span>
              )}
              {question.metadata.score && (
                <span className="flex items-center gap-1">
                  <span className="font-medium">Score:</span>
                  <span className="text-slate-600">{question.metadata.score}</span>
                </span>
              )}
            </div>
          </div>
        )}


      </CardContent>
    </Card>
  );
});

QuestionCard.displayName = 'QuestionCard';

const QuestionDisplay = memo(({ questions, onAddToQB, onRegenerate, onRegenerateQuestion }: QuestionDisplayProps) => {
  // Sort questions by difficulty: Easy → Medium → Hard
  const sortedQuestions = useMemo(() => {
    return [...questions].sort((a, b) => {
      const orderA = DIFFICULTY_ORDER[a.difficulty] || 999;
      const orderB = DIFFICULTY_ORDER[b.difficulty] || 999;
      return orderA - orderB;
    });
  }, [questions]);

  const handleAddToQB = useCallback((questionId: string) => {
    onAddToQB(questionId);
  }, [onAddToQB]);

  const getDifficultyColor = useCallback((difficulty: string) => {
    return DIFFICULTY_COLORS[difficulty as keyof typeof DIFFICULTY_COLORS] || 'bg-gray-100 text-gray-800 border-gray-200';
  }, []);

  const questionsCount = useMemo(() => sortedQuestions.length, [sortedQuestions.length]);

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

      {/* Questions - Sorted by difficulty (Easy → Medium → Hard) */}
      <div className="space-y-6">
        {sortedQuestions.map((question, index) => (
          <QuestionCard
            key={question.id}
            question={question}
            index={index}
            onAddToQB={handleAddToQB}
            onRegenerate={onRegenerate}
            onRegenerateQuestion={onRegenerateQuestion}
            getDifficultyColor={getDifficultyColor}
          />
        ))}
      </div>


    </div>
  );
});

QuestionDisplay.displayName = 'QuestionDisplay';

export default QuestionDisplay;
