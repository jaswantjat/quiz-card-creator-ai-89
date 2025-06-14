
import { useState, useCallback, memo, useMemo, useEffect, useRef } from "react";
import QuestionGenerationForm from "@/components/QuestionGenerationForm";
import { questionGenerationAPI, usersAPI } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useDemoCredits } from "@/hooks/useDemoCredits";

import { Button } from "@/components/ui/button";

// Direct imports to eliminate lazy loading issues during debugging
import SequentialQuestionDisplay from "@/components/SequentialQuestionDisplay";
import ProgressiveQuestionDisplay from "@/components/ProgressiveQuestionDisplay";
import ErrorBoundary from "@/components/ErrorBoundary";
import IMochaLoadingAnimation from "@/components/IMochaLoadingAnimationEnhanced";

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
  const { user, updateCredits: updateUserCredits, refreshUserProfile } = useAuth();
  const {
    credits,
    updateCredits,
    deductCredits,
    hasEnoughCredits,
    isDemoMode,
    isInitialized
  } = useDemoCredits();
  const [context, setContext] = useState("");
  const [topicName, setTopicName] = useState("");
  const [easyCount, setEasyCount] = useState(0);
  const [mediumCount, setMediumCount] = useState(0);
  const [hardCount, setHardCount] = useState(0);
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

  // AbortController ref for request cancellation
  const abortControllerRef = useRef<AbortController | null>(null);
  const generationInProgressRef = useRef(false);
  const [useProgressiveLoading, setUseProgressiveLoading] = useState(true);
  const [regeneratingQuestionIds, setRegeneratingQuestionIds] = useState<Set<string>>(new Set());

  // Memoize totalQuestions to prevent unnecessary recalculations
  const totalQuestions = useMemo(() =>
    easyCount + mediumCount + hardCount,
    [easyCount, mediumCount, hardCount]
  );

  // Credits are now managed by useDemoCredits hook

  // Refresh user profile on component mount to get latest credit data
  useEffect(() => {
    if (user) {
      refreshUserProfile().catch(console.error);
    }
  }, [user?.id, refreshUserProfile]);

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

  // Cleanup function to cancel ongoing requests
  const cancelOngoingGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      console.log('🛑 Cancelling ongoing generation...');
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    generationInProgressRef.current = false;
  }, []);

  // Progressive question generation handler with FIXED state management and abort handling
  const handleProgressiveGenerate = useCallback(async () => {
    // Prevent multiple concurrent generations
    if (generationInProgressRef.current) {
      console.log('⚠️ Generation already in progress, cancelling previous...');
      cancelOngoingGeneration();
      // Small delay to ensure cleanup
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    if (!hasEnoughCredits(totalQuestions)) {
      toast.error('Insufficient credits', {
        description: `You need ${totalQuestions} credits but only have ${credits}. ${isDemoMode ? 'Refresh the page to get 10 new demo credits.' : 'Please wait for your daily credit refresh.'}`
      });
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

    // Set generation in progress flag
    generationInProgressRef.current = true;

    // Create new AbortController for this generation
    abortControllerRef.current = new AbortController();

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

      // Use the progressive generator with abort signal
      for await (const response of questionGenerationAPI.generateQuestionsProgressive(generationData, abortControllerRef.current?.signal)) {
        // Check if generation was cancelled
        if (!generationInProgressRef.current || abortControllerRef.current?.signal.aborted) {
          console.log('🛑 Generation cancelled, stopping...');
          break;
        }

        // Update loading state
        setProgressiveLoadingState(response.loadingState);

        if (response.questions.length > 0) {
          // ✅ CRITICAL: Enhanced validation and deduplication
          const newIds = response.questions.map(q => q.id);
          const existingIds = questionsAccumulator.map(q => q.id);
          const existingIdsSet = new Set(existingIds);

          // Filter out questions that already exist in accumulator
          const uniqueNewQuestions = response.questions.filter(q => !existingIdsSet.has(q.id));
          const filteredIds = uniqueNewQuestions.map(q => q.id);

          console.log('🔍 Enhanced ID Validation:', {
            newIds,
            existingIds,
            filteredIds,
            duplicatesRemoved: newIds.length - uniqueNewQuestions.length,
            uniqueNewQuestions: uniqueNewQuestions.length
          });

          if (uniqueNewQuestions.length !== response.questions.length) {
            const duplicateIds = newIds.filter(id => existingIdsSet.has(id));
            console.warn('⚠️ Filtered out duplicate questions:', duplicateIds);
            // Removed debug-level toast warning - this is handled internally
          }

          // Only process truly unique questions
          if (uniqueNewQuestions.length === 0) {
            console.log('ℹ️ No new unique questions to add, skipping...');
            return; // Skip this iteration if no unique questions
          }

          if (!hasReceivedInitial) {
            // First batch - show immediately for instant feedback
            questionsAccumulator = [...uniqueNewQuestions]; // ✅ Use filtered questions
            console.log('🎯 Setting initial questions in state:', questionsAccumulator.length);
            console.log('🎯 First question structure:', questionsAccumulator[0]);
            console.log('🎯 Question IDs:', questionsAccumulator.map(q => q.id));

            // CRITICAL FIX: Force state update with new array reference
            setGeneratedQuestions(() => [...questionsAccumulator]);
            // ✅ FIX: Don't set success status or hide loading animation yet - more questions are coming!
            // setGenerationStatus('success'); // Removed - wait for completion
            // setIsGenerating(false); // Removed - wait for completion

            // Removed intermediate success toast - loading animation provides visual feedback

            hasReceivedInitial = true;

            // CRITICAL DEBUG: Log state after setting
            setTimeout(() => {
              console.log('🔍 State after initial set - should have questions now');
            }, 100);
          } else {
            // Additional batches - append smoothly
            questionsAccumulator = [...questionsAccumulator, ...uniqueNewQuestions]; // ✅ Use filtered questions
            console.log('🎯 Appending questions to state:', questionsAccumulator.length);
            console.log('🎯 All question IDs:', questionsAccumulator.map(q => q.id));

            // CRITICAL FIX: Force state update with new array reference
            setGeneratedQuestions(() => [...questionsAccumulator]);

            // Removed intermediate progress toast - loading animation provides visual feedback
          }
        }

        // Handle completion
        if (response.loadingState.phase === 'complete') {
          // ✅ CRITICAL FIX: Don't process response.questions in complete phase to prevent duplication
          // The accumulator already contains all questions from previous phases
          console.log('🏁 Completion phase - Using accumulator only');
          console.log('🏁 Response questions (ignored):', response.questions.length);
          console.log('🏁 Accumulator questions (final):', questionsAccumulator.length);
          console.log('🏁 Final questions structure:', questionsAccumulator);

          // ✅ FINAL VALIDATION: Ensure no duplicate IDs in final state
          const finalIds = questionsAccumulator.map(q => q.id);
          const uniqueFinalIds = new Set(finalIds);

          if (finalIds.length !== uniqueFinalIds.size) {
            console.error('🚨 CRITICAL: Duplicate IDs in final state!', {
              totalQuestions: finalIds.length,
              uniqueIds: uniqueFinalIds.size,
              duplicates: finalIds.filter((id, index) => finalIds.indexOf(id) !== index)
            });
            // Removed debug-level error toast - this is logged for developers
          } else {
            console.log('✅ Final validation passed: All question IDs are unique');
          }

          // ✅ FIXED: Use accumulator only, don't add response.questions
          setGeneratedQuestions(() => [...questionsAccumulator]);

          // ✅ FIXED: Only hide loading animation when progressive loading is completely finished
          setGenerationStatus('success');
          setIsGenerating(false);

          // Silent success - questions appearing is sufficient confirmation

          // CRITICAL DEBUG: Verify state after completion
          setTimeout(() => {
            console.log('🔍 Final state verification - questions should be visible now');
          }, 100);

          break;
        }
      }

      // Consume credits only if generation completed successfully
      if (generationInProgressRef.current && !abortControllerRef.current?.signal.aborted) {
        try {
          // Deduct credits using the unified credit system
          const success = deductCredits(totalQuestions);
          if (!success) {
            console.error('Failed to deduct credits after successful generation');
          }

          // Refresh user profile for authenticated users
          if (!isDemoMode) {
            setTimeout(() => {
              refreshUserProfile().catch(console.error);
            }, 1000);
          }
        } catch (error) {
          console.error('Failed to update credits:', error);
        }
      }

    } catch (error) {
      // Handle different types of errors
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('🛑 Generation was cancelled by user');
        toast.info('Question generation cancelled');
      } else {
        console.error('❌ Progressive generation error:', error);
        setGenerationStatus('error');

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
      }

      setIsGenerating(false);
    } finally {
      // Clean up
      generationInProgressRef.current = false;
      abortControllerRef.current = null;

      // Reset generation status after a delay
      setTimeout(() => setGenerationStatus('idle'), 3000);
    }
  }, [hasEnoughCredits, credits, totalQuestions, context, topicName, easyCount, mediumCount, hardCount, cancelOngoingGeneration, deductCredits, isDemoMode, refreshUserProfile]);

  // Legacy single-request handler (kept for fallback)
  const handleLegacyGenerate = useCallback(async () => {
    // Cancel any ongoing generation
    if (generationInProgressRef.current) {
      cancelOngoingGeneration();
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    if (!hasEnoughCredits(totalQuestions)) {
      toast.error('Insufficient credits', {
        description: `You need ${totalQuestions} credits but only have ${credits}. ${isDemoMode ? 'Refresh the page to get 10 new demo credits.' : 'Please wait for your daily credit refresh.'}`
      });
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

    generationInProgressRef.current = true;
    abortControllerRef.current = new AbortController();

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

        try {
          // Deduct credits using the unified credit system
          const success = deductCredits(totalQuestions);
          if (!success) {
            console.error('Failed to deduct credits after successful generation');
          }

          // Refresh user profile for authenticated users
          if (!isDemoMode) {
            setTimeout(() => {
              refreshUserProfile().catch(console.error);
            }, 1000);
          }
        } catch (error) {
          console.error('Failed to update credits:', error);
        }

        // Silent success - questions appearing is sufficient confirmation

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
      generationInProgressRef.current = false;
      abortControllerRef.current = null;
      setTimeout(() => setGenerationStatus('idle'), 3000);
    }
  }, [hasEnoughCredits, credits, totalQuestions, context, topicName, easyCount, mediumCount, hardCount, cancelOngoingGeneration, deductCredits, isDemoMode, refreshUserProfile]);



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
    // Check if user has enough credits for regeneration
    if (!hasEnoughCredits(1)) {
      toast.error('Insufficient credits', {
        description: `You need 1 credit to regenerate a question. ${isDemoMode ? 'Refresh the page to get 10 new demo credits.' : 'Please wait for your daily credit refresh.'}`
      });
      return;
    }

    // Find the question to regenerate
    const questionToRegenerate = generatedQuestions.find(q => q.id === questionId);
    if (!questionToRegenerate) {
      toast.error('Question not found for regeneration');
      return;
    }

    // Prevent multiple regenerations of the same question
    if (regeneratingQuestionIds.has(questionId)) {
      console.log('⚠️ Question already being regenerated:', questionId);
      return;
    }

    console.log('🔄 Starting individual question regeneration:', questionId);

    // Add to regenerating set
    setRegeneratingQuestionIds(prev => new Set([...prev, questionId]));

    try {
      // Call the regeneration API
      const response = await questionGenerationAPI.regenerateQuestion({
        questionId,
        originalQuestion: questionToRegenerate,
        context,
        topicName
      });

      if (response.question) {
        // Replace the question in the list
        setGeneratedQuestions(prevQuestions =>
          prevQuestions.map(q =>
            q.id === questionId ? response.question : q
          )
        );

        // Deduct 1 credit for regeneration
        try {
          const success = deductCredits(1);
          if (!success) {
            console.error('Failed to deduct credits after successful regeneration');
          }

          // Refresh user profile for authenticated users
          if (!isDemoMode) {
            setTimeout(() => {
              refreshUserProfile().catch(console.error);
            }, 1000);
          }
        } catch (error) {
          console.error('Failed to update credits after regeneration:', error);
        }

        toast.success('Question regenerated successfully!', {
          description: 'The new question has replaced the original one.'
        });

        console.log('✅ Question regenerated successfully:', response.question.id);
      } else {
        throw new Error('No regenerated question received from webhook');
      }

    } catch (error) {
      console.error('❌ Question regeneration failed:', error);

      toast.error('Failed to regenerate question', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      // Remove from regenerating set
      setRegeneratingQuestionIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(questionId);
        return newSet;
      });
    }
  }, [generatedQuestions, regeneratingQuestionIds, context, topicName, hasEnoughCredits, deductCredits, isDemoMode, refreshUserProfile]);





  const hasQuestions = generatedQuestions.length > 0;

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      console.log('🧹 ChatAgent unmounting, cleaning up...');
      cancelOngoingGeneration();
    };
  }, [cancelOngoingGeneration]);









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


              <ErrorBoundary fallback={
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="text-red-800 font-semibold">Question Display Error</h3>
                  <p className="text-red-700 text-sm mt-2">
                    The question display component failed to render. Check console for details.
                  </p>
                </div>
              }>
                {useProgressiveLoading ? (
                  <ProgressiveQuestionDisplay
                    questions={generatedQuestions}
                    loadingState={progressiveLoadingState}
                    onAddToQB={handleAddToQB}
                    onRegenerate={handleRegenerate}
                    onRegenerateQuestion={handleRegenerateQuestion}
                    regeneratingQuestionIds={regeneratingQuestionIds}
                  />
                ) : (
                  <SequentialQuestionDisplay
                    questions={generatedQuestions}
                    onAddToQB={handleAddToQB}
                    onRegenerate={handleRegenerate}
                    onRegenerateQuestion={handleRegenerateQuestion}
                    regeneratingQuestionIds={regeneratingQuestionIds}
                  />
                )}
              </ErrorBoundary>
            </div>
          )}





        </div>

        {/* iMocha Loading Animation Overlay */}
        <IMochaLoadingAnimation
          isVisible={isGenerating}
          totalQuestions={totalQuestions}
          generationStatus={generationStatus}
          progressiveLoadingState={useProgressiveLoading ? progressiveLoadingState : undefined}
          onComplete={() => {
            // Hide the loading animation after completion
            console.log('🎉 Question generation animation completed');
            setIsGenerating(false);
          }}
        />

      </div>
    </div>
  );
});

ChatAgent.displayName = 'ChatAgent';

export default ChatAgent;
