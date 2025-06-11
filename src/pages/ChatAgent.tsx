
import { useState, useCallback, memo, useMemo, lazy, Suspense, useEffect } from "react";
import QuestionGenerationForm from "@/components/QuestionGenerationForm";
import QuestionGenerationLoader from "@/components/QuestionGenerationLoader";
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

// Move sample questions outside component to prevent recreation on every render
const SAMPLE_QUESTIONS: MCQQuestion[] = [
  {
    id: "1",
    question: "What is the primary purpose of React's useState hook?",
    options: [
      "To manage component lifecycle",
      "To handle side effects",
      "To manage local component state",
      "To optimize performance"
    ],
    correctAnswer: 2,
    explanation: "The useState hook is specifically designed to manage local state within functional components. It returns a state variable and a setter function to update that state.",
    difficulty: 'easy'
  },
  {
    id: "2",
    question: "Which of the following best describes the Virtual DOM in React?",
    options: [
      "A direct copy of the browser's DOM",
      "A lightweight JavaScript representation of the DOM",
      "A database for storing component data",
      "A styling framework for React components"
    ],
    correctAnswer: 1,
    explanation: "The Virtual DOM is a lightweight JavaScript representation of the actual DOM. React uses it to efficiently update the UI by comparing (diffing) the virtual DOM with the previous version and only updating the parts that changed.",
    difficulty: 'medium'
  },
  {
    id: "3",
    question: "What happens when you call setState() multiple times in the same function?",
    options: [
      "Each setState call triggers an immediate re-render",
      "Only the last setState call takes effect",
      "React batches the updates and triggers one re-render",
      "It causes an error in the application"
    ],
    correctAnswer: 2,
    explanation: "React batches multiple setState calls within the same function and triggers only one re-render for performance optimization. This is called 'batching' and helps prevent unnecessary re-renders.",
    difficulty: 'hard'
  }
];

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

  // Progressive question generation handler
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
      console.log('🚀 Starting progressive question generation...');

      let allQuestions: MCQQuestion[] = [];
      let hasReceivedInitial = false;

      // Use the progressive generator
      for await (const response of questionGenerationAPI.generateQuestionsProgressive(generationData)) {
        console.log('📦 Progressive response:', response);

        // Update loading state
        setProgressiveLoadingState(response.loadingState);

        if (response.questions.length > 0) {
          if (!hasReceivedInitial) {
            // First batch - show immediately for instant feedback
            console.log('⚡ Displaying initial questions immediately');
            allQuestions = response.questions;
            setGeneratedQuestions(allQuestions);
            setGenerationStatus('success');

            // Show initial success toast
            toast.success(`${response.questions.length} questions loaded instantly!`, {
              description: 'Loading additional questions in background...'
            });

            hasReceivedInitial = true;

            // Reduce loading animation time since we have initial results
            setTimeout(() => setIsGenerating(false), 800);
          } else {
            // Additional batches - append smoothly
            console.log('🔄 Adding additional questions progressively');
            allQuestions = [...allQuestions, ...response.questions];
            setGeneratedQuestions(allQuestions);

            // Show progress toast
            toast.success(`+${response.questions.length} more questions loaded!`, {
              description: `Total: ${allQuestions.length} questions`
            });
          }
        }

        // Handle completion
        if (response.loadingState.phase === 'complete') {
          console.log('🎉 Progressive loading complete');
          toast.success('All questions loaded successfully!', {
            description: `Generated ${allQuestions.length} total questions`
          });
          break;
        }
      }

      // Consume credits
      setCredits(prevCredits => prevCredits - totalQuestions);

    } catch (error) {
      console.error('❌ Progressive generation error:', error);
      setGenerationStatus('error');

      // Update loading state with error
      setProgressiveLoadingState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }));

      // Fallback to sample questions
      console.log('🔄 Falling back to sample questions');
      const fallbackQuestions = SAMPLE_QUESTIONS.slice(0, totalQuestions || 3);
      setGeneratedQuestions(fallbackQuestions);

      toast.error('Progressive loading failed, using sample questions', {
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
      console.log('🚀 Starting legacy question generation...');

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

      let questionsToDisplay: MCQQuestion[] = [];
      if (apiResponse.questions && apiResponse.questions.length > 0) {
        questionsToDisplay = apiResponse.questions;
        toast.success(`Generated ${questionsToDisplay.length} questions!`);
      } else {
        questionsToDisplay = SAMPLE_QUESTIONS.slice(0, totalQuestions || 3);
        toast.info(`Using ${questionsToDisplay.length} sample questions`);
      }

      await new Promise(resolve => setTimeout(resolve, 1500));
      setGeneratedQuestions(questionsToDisplay);
      setCredits(prevCredits => prevCredits - totalQuestions);

    } catch (error) {
      console.error('❌ Legacy generation error:', error);
      setGenerationStatus('error');

      await new Promise(resolve => setTimeout(resolve, 1500));
      const fallbackQuestions = SAMPLE_QUESTIONS.slice(0, totalQuestions || 3);
      setGeneratedQuestions(fallbackQuestions);

      toast.error('Generation failed, using sample questions');
    } finally {
      setIsGenerating(false);
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

  const hasQuestions = generatedQuestions.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-amber-50/20 p-4 sm:p-6 font-inter">
      <div className="w-full max-w-6xl mx-auto">
        {/* Main Chat Card - Optimized for performance */}
        <div className="relative bg-white/95 backdrop-blur-sm rounded-[2rem] p-6 sm:p-10 shadow-xl shadow-orange-500/8 overflow-hidden border border-orange-100/60 smooth-transition hover:shadow-2xl gpu-accelerated">

          {/* Simplified gradient overlay - reduced complexity for better performance */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-amber-100/20 pointer-events-none" />

          {/* Progressive Loading Toggle (for testing) */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-blue-800">Loading Mode</h4>
                <p className="text-sm text-blue-600">
                  {useProgressiveLoading
                    ? 'Progressive: Shows questions immediately as they load'
                    : 'Legacy: Shows all questions after complete loading'
                  }
                </p>
              </div>
              <button
                onClick={() => setUseProgressiveLoading(!useProgressiveLoading)}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-all duration-200
                  ${useProgressiveLoading
                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }
                `}
              >
                {useProgressiveLoading ? 'Progressive' : 'Legacy'}
              </button>
            </div>
          </div>

          <QuestionGenerationForm
            {...formProps}
            onGenerate={handleGenerate}
          />

          {/* Generated Questions with Progressive or Sequential Display */}
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
                  />
                ) : (
                  <SequentialQuestionDisplay
                    questions={generatedQuestions}
                    onAddToQB={handleAddToQB}
                    onRegenerate={handleRegenerate}
                  />
                )}
              </Suspense>
            </div>
          )}

        </div>

        {/* Coffee Brewing Animation Overlay */}
        <QuestionGenerationLoader
          isVisible={isGenerating}
          totalQuestions={totalQuestions}
          generationStatus={generationStatus}
          onComplete={() => setIsGenerating(false)}
        />
      </div>
    </div>
  );
});

ChatAgent.displayName = 'ChatAgent';

export default ChatAgent;
