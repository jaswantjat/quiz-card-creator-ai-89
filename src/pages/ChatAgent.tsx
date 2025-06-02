
import { useState, useCallback, memo, useMemo } from "react";
import QuestionGenerationForm from "@/components/QuestionGenerationForm";
import QuestionDisplay from "@/components/QuestionDisplay";

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
  const [inputValue, setInputValue] = useState("");
  const [context, setContext] = useState("");
  const [topicName, setTopicName] = useState("");
  const [easyCount, setEasyCount] = useState(0);
  const [mediumCount, setMediumCount] = useState(0);
  const [hardCount, setHardCount] = useState(0);
  const [credits, setCredits] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<MCQQuestion[]>([]);

  // Memoize totalQuestions to prevent unnecessary recalculations
  const totalQuestions = useMemo(() =>
    easyCount + mediumCount + hardCount,
    [easyCount, mediumCount, hardCount]
  );

  const handleGenerate = useCallback(async () => {
    if (credits < totalQuestions) {
      console.log("Not enough credits. Need:", totalQuestions, "Have:", credits);
      return;
    }

    console.log("Generating questions with:", {
      context,
      topicName,
      easyCount,
      mediumCount,
      hardCount
    });

    // Start generation immediately
    setIsGenerating(true);

    // Reduced simulation time from 6000ms to 3000ms for better performance
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedQuestions(SAMPLE_QUESTIONS.slice(0, totalQuestions || 3));

      // Consume credits
      setCredits(prevCredits => prevCredits - (totalQuestions || 3));
    }, 3000);
  }, [credits, totalQuestions, context, topicName, easyCount, mediumCount, hardCount]);

  const handleRegenerate = useCallback(() => {
    setGeneratedQuestions([]);
    handleGenerate();
  }, [handleGenerate]);

  const handleAddToQB = useCallback((questionId: string) => {
    console.log("Adding question to QB:", questionId);
    // TODO: Add to question bank functionality
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-amber-50/20 p-4 sm:p-6 font-inter">
      <div className="w-full max-w-6xl mx-auto">
        {/* Main Chat Card - Optimized for performance */}
        <div className="relative bg-white/95 backdrop-blur-sm rounded-[2rem] p-6 sm:p-10 shadow-xl shadow-orange-500/8 overflow-hidden border border-orange-100/60 transition-shadow duration-300 hover:shadow-2xl">

          {/* Simplified gradient overlay - reduced complexity for better performance */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-amber-100/20 pointer-events-none" />

          {/* Animation Overlay - Simplified */}
          {showAnimation && (
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/15 via-amber-400/15 to-orange-600/15 z-50 rounded-[2rem] border border-orange-400/30" />
          )}

          <QuestionGenerationForm
            context={context}
            setContext={setContext}
            topicName={topicName}
            setTopicName={setTopicName}
            easyCount={easyCount}
            setEasyCount={setEasyCount}
            mediumCount={mediumCount}
            setMediumCount={setMediumCount}
            hardCount={hardCount}
            setHardCount={setHardCount}
            credits={credits}
            isGenerating={isGenerating}
            showAnimation={showAnimation}
            onGenerate={handleGenerate}
          />

          {/* Generated Questions */}
          {generatedQuestions.length > 0 && (
            <div className="relative z-10 mt-8">
              <QuestionDisplay 
                questions={generatedQuestions}
                onAddToQB={handleAddToQB}
                onRegenerate={handleRegenerate}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

ChatAgent.displayName = 'ChatAgent';

export default ChatAgent;
