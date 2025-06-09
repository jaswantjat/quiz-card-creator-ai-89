
import { useState, useCallback, memo, useMemo, lazy, Suspense } from "react";
import QuestionGenerationForm from "@/components/QuestionGenerationForm";
import QuestionGenerationLoader from "@/components/QuestionGenerationLoader";
import { webhookAPI } from "@/lib/api";
import { toast } from "sonner";

// Lazy load QuestionDisplay for better initial page load performance
const QuestionDisplay = lazy(() => import("@/components/QuestionDisplay"));

interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
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

const ChatAgent = memo(() => {
  const [context, setContext] = useState("");
  const [topicName, setTopicName] = useState("");
  const [easyCount, setEasyCount] = useState(0);
  const [mediumCount, setMediumCount] = useState(0);
  const [hardCount, setHardCount] = useState(0);
  const [credits, setCredits] = useState(10);
  const [generatedQuestions, setGeneratedQuestions] = useState<MCQQuestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [webhookStatus, setWebhookStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

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

  const handleGenerate = useCallback(async () => {
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
    setWebhookStatus('sending');

    try {
      // Step 1: Send data to webhook
      console.log('🚀 Starting question generation process...');

      const webhookData = {
        context,
        topicName,
        easyCount,
        mediumCount,
        hardCount,
        totalQuestions,
        webhookId: 'c6ef8f24-74f3-4781-9d60-13e917c7d2a7'
      };

      const webhookResponse = await webhookAPI.sendQuestionGenerationData(webhookData);

      console.log('✅ Webhook sent successfully:', webhookResponse);
      setWebhookStatus('success');

      // Show success toast for webhook
      toast.success('Form data sent to webhook successfully!', {
        description: `Webhook responded with status ${webhookResponse.status}`
      });

      // Step 2: Continue with existing question generation logic
      // Maintain the coffee brewing animation timing for good UX
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 seconds remaining for animation

      // Generate questions using existing logic
      setGeneratedQuestions(SAMPLE_QUESTIONS.slice(0, totalQuestions || 3));

      // Consume credits
      setCredits(prevCredits => prevCredits - (totalQuestions || 3));

      console.log('🎉 Question generation completed successfully');

    } catch (error) {
      console.error('❌ Error in question generation process:', error);
      setWebhookStatus('error');

      // Show error toast but continue with question generation
      toast.error('Webhook failed, but continuing with question generation', {
        description: error instanceof Error ? error.message : 'Unknown webhook error'
      });

      // Continue with question generation even if webhook fails
      await new Promise(resolve => setTimeout(resolve, 2000));
      setGeneratedQuestions(SAMPLE_QUESTIONS.slice(0, totalQuestions || 3));
      setCredits(prevCredits => prevCredits - (totalQuestions || 3));
    } finally {
      setIsGenerating(false);
      // Reset webhook status after a delay
      setTimeout(() => setWebhookStatus('idle'), 3000);
    }
  }, [credits, totalQuestions, context, topicName, easyCount, mediumCount, hardCount]);

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

          <QuestionGenerationForm
            {...formProps}
            onGenerate={handleGenerate}
          />

          {/* Generated Questions with Lazy Loading */}
          {hasQuestions && (
            <div className="relative z-10 mt-8">
              <Suspense fallback={
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                  <span className="ml-3 text-slate-600">Loading questions...</span>
                </div>
              }>
                <QuestionDisplay
                  questions={generatedQuestions}
                  onAddToQB={handleAddToQB}
                  onRegenerate={handleRegenerate}
                />
              </Suspense>
            </div>
          )}

        </div>

        {/* Coffee Brewing Animation Overlay */}
        <QuestionGenerationLoader
          isVisible={isGenerating}
          totalQuestions={totalQuestions}
          webhookStatus={webhookStatus}
          onComplete={() => setIsGenerating(false)}
        />
      </div>
    </div>
  );
});

ChatAgent.displayName = 'ChatAgent';

export default ChatAgent;
