
import { useState, useCallback, memo, useMemo, lazy, Suspense, useEffect } from "react";
import QuestionGenerationForm from "@/components/QuestionGenerationForm";
import { questionGenerationAPI } from "@/lib/api";
import { toast } from "sonner";

// Lazy load components for better initial page load performance
const SequentialQuestionDisplay = lazy(() => import("@/components/SequentialQuestionDisplay"));
const ProgressiveQuestionDisplay = lazy(() => import("@/components/ProgressiveQuestionDisplay"));

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



// Progressive Loading State Interface
interface ProgressiveLoadingState {
  phase: 'initial' | 'background' | 'complete';
  questionsLoaded: number;
  totalExpected: number;
  isLoading: boolean;
  error?: string;
}

const ChatAgent = memo(() => {
  const [context, setContext] = useState("");
  const [topicName, setTopicName] = useState("");
  const [easyCount, setEasyCount] = useState(0);
  const [mediumCount, setMediumCount] = useState(0);
  const [hardCount, setHardCount] = useState(0);
  const [credits, setCredits] = useState(10);
  const [generatedQuestions, setGeneratedQuestions] = useState<MCQQuestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'generating' | 'success' | 'error'>('idle');

  // Progressive loading state
  const [progressiveLoadingState, setProgressiveLoadingState] = useState<ProgressiveLoadingState>({
    phase: 'initial',
    questionsLoaded: 0,
    totalExpected: 0,
    isLoading: false
  });
  const [useProgressiveLoading, setUseProgressiveLoading] = useState(true);

  // Memoize totalQuestions to prevent unnecessary recalculations
  const totalQuestions = useMemo(() =>
    easyCount + mediumCount + hardCount,
    [easyCount, mediumCount, hardCount]
  );

  // Memoize form props to prevent unnecessary re-renders
  const formProps = useMemo(() => ({
    context,
    setContext,
    topicName,
    setTopicName,
    easyCount,
    setEasyCount,
    mediumCount,
    setMediumCount,
    hardCount,
    setHardCount,
    credits,
    totalQuestions
  }), [context, topicName, easyCount, mediumCount, hardCount, credits, totalQuestions]);

  // Progressive question generation handler with FIXED state management
  const handleProgressiveGenerate = useCallback(async () => {
    if (credits < totalQuestions) {
      return;
    }

    // Basic validation
    if (!topicName.trim()) {
      toast.error('Please enter a topic name before generating questions');
      return;
    }

    if (totalQuestions === 0) {
      toast.error('Please select at least one question to generate');
      return;
    }

    setIsGenerating(true);
    setGenerationStatus('generating');
    setGeneratedQuestions([]); // Clear previous questions

    // Initialize progressive loading state
    setProgressiveLoadingState({
      phase: 'initial',
      questionsLoaded: 0,
      totalExpected: totalQuestions,
      isLoading: true
    });

    const generationData = {
      context,
      topicName,
      easyCount,
      mediumCount,
      hardCount,
      totalQuestions,
      serviceId: 'c6ef8f24-74f3-4781-9d60-13e917c7d2a7'
    };

    try {
      console.log('🚀 Starting FIXED progressive question generation...');

      // ✅ CRITICAL FIX: Use functional state updates to avoid closure issues
      let questionsAccumulator: MCQQuestion[] = [];
      let hasReceivedInitial = false;

      // Use the progressive generator
      for await (const response of questionGenerationAPI.generateQuestionsProgressive(generationData)) {
        // Update loading state
        setProgressiveLoadingState(response.loadingState);

        if (response.questions.length > 0) {
          if (!hasReceivedInitial) {
            // First batch - show immediately for instant feedback
            questionsAccumulator = [...response.questions];
            setGeneratedQuestions([...questionsAccumulator]);
            setGenerationStatus('success');
            setIsGenerating(false);

            toast.success(`${response.questions.length} questions loaded instantly!`, {
              description: 'Loading additional questions in background...'
            });

            hasReceivedInitial = true;
          } else {
            // Additional batches - append smoothly
            questionsAccumulator = [...questionsAccumulator, ...response.questions];
            setGeneratedQuestions([...questionsAccumulator]);

            toast.success(`+${response.questions.length} more questions loaded!`, {
              description: `Total: ${questionsAccumulator.length} questions`
            });
          }
        }

        // Handle completion
        if (response.loadingState.phase === 'complete') {
          setGeneratedQuestions([...questionsAccumulator]);
          toast.success('All questions loaded successfully!', {
            description: `Generated ${questionsAccumulator.length} total questions`
          });
          break;
        }
      }

      // Consume credits
      setCredits(prevCredits => prevCredits - totalQuestions);

    } catch (error) {
      console.error('❌ Progressive generation error:', error);
      setGenerationStatus('error');
      setIsGenerating(false);

      // Update loading state with error
      setProgressiveLoadingState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }));

      // Show error to user
      toast.error('Question generation failed', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      // Reset generation status after a delay
      setTimeout(() => setGenerationStatus('idle'), 3000);
    }
  }, [credits, totalQuestions, context, topicName, easyCount, mediumCount, hardCount]);

  // Legacy single-request handler (kept for fallback)
  const handleLegacyGenerate = useCallback(async () => {
    if (credits < totalQuestions) {
      return;
    }

    // Basic validation
    if (!topicName.trim()) {
      toast.error('Please enter a topic name before generating questions');
      return;
    }

    if (totalQuestions === 0) {
      toast.error('Please select at least one question to generate');
      return;
    }

    setIsGenerating(true);
    setGenerationStatus('generating');

    try {
      const generationData = {
        context,
        topicName,
        easyCount,
        mediumCount,
        hardCount,
        totalQuestions,
        serviceId: 'c6ef8f24-74f3-4781-9d60-13e917c7d2a7'
      };

      const apiResponse = await questionGenerationAPI.generateQuestions(generationData);
      setGenerationStatus('success');

      if (apiResponse.questions && apiResponse.questions.length > 0) {
        setGeneratedQuestions(apiResponse.questions);
        setCredits(prevCredits => prevCredits - totalQuestions);
        toast.success(`Generated ${apiResponse.questions.length} questions!`);

        // Hide loader after a short delay for smooth transition
        setTimeout(() => setIsGenerating(false), 500);
      } else {
        // No questions returned - show error
        setGenerationStatus('error');
        setIsGenerating(false);
        toast.error('No questions were generated. Please try again.');
      }

    } catch (error) {
      console.error('❌ Legacy generation error:', error);
      setGenerationStatus('error');
      setIsGenerating(false);

      toast.error('Question generation failed', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setTimeout(() => setGenerationStatus('idle'), 3000);
    }
  }, [credits, totalQuestions, context, topicName, easyCount, mediumCount, hardCount]);



  // Main generate handler - chooses between progressive and legacy
  const handleGenerate = useCallback(() => {
    if (useProgressiveLoading) {
      return handleProgressiveGenerate();
    } else {
      return handleLegacyGenerate();
    }
  }, [useProgressiveLoading, handleProgressiveGenerate, handleLegacyGenerate]);

  const handleRegenerate = useCallback(async () => {
    setIsGenerating(true);
    setGeneratedQuestions([]);
    await handleGenerate();
  }, [handleGenerate]);

  const handleAddToQB = useCallback((questionId: string) => {
    // TODO: Add to question bank functionality
  }, []);

  const handleRegenerateQuestion = useCallback(async (questionId: string) => {
    // TODO: Implement individual question regeneration
    // For now, we'll regenerate all questions as a placeholder
    console.log(`Regenerating question with ID: ${questionId}`);
    await handleRegenerate();
  }, [handleRegenerate]);



  const hasQuestions = generatedQuestions.length > 0;

  // Simple debug logging for production
  useEffect(() => {
    if (generatedQuestions.length > 0) {
      console.log(`✅ Questions in state: ${generatedQuestions.length}`);
    }
  }, [generatedQuestions.length]);



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-amber-50/20 p-4 sm:p-6 font-inter">
      <div className="w-full max-w-6xl mx-auto">
        {/* Main Chat Card - Optimized for performance */}
        <div className="relative bg-white/95 backdrop-blur-sm rounded-[2rem] p-6 sm:p-10 shadow-xl shadow-orange-500/8 overflow-hidden border border-orange-100/60 smooth-transition hover:shadow-2xl gpu-accelerated">

          {/* Simplified gradient overlay - reduced complexity for better performance */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-amber-100/20 pointer-events-none" />



          <QuestionGenerationForm
            {...formProps}
            onGenerate={handleGenerate}
          />



          {/* Generated Questions Display */}
          {hasQuestions && (
            <div className="relative z-10 mt-8">
              <Suspense fallback={
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                  <span className="ml-3 text-slate-600">Loading questions...</span>
                </div>
              }>
                {useProgressiveLoading ? (
                  <ProgressiveQuestionDisplay
                    questions={generatedQuestions}
                    loadingState={progressiveLoadingState}
                    onAddToQB={handleAddToQB}
                    onRegenerate={handleRegenerate}
                    onRegenerateQuestion={handleRegenerateQuestion}
                  />
                ) : (
                  <SequentialQuestionDisplay
                    questions={generatedQuestions}
                    onAddToQB={handleAddToQB}
                    onRegenerate={handleRegenerate}
                    onRegenerateQuestion={handleRegenerateQuestion}
                  />
                )}
              </Suspense>
            </div>
          )}



        </div>



      </div>
    </div>
  );
});

ChatAgent.displayName = 'ChatAgent';

export default ChatAgent;
