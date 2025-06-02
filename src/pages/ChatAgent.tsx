
import { useState, useCallback, memo } from "react";
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

  const totalQuestions = easyCount + mediumCount + hardCount;

  // Sample questions for testing
  const sampleQuestions: MCQQuestion[] = [
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
      setGeneratedQuestions(sampleQuestions.slice(0, totalQuestions || 3));

      // Consume credits
      setCredits(prevCredits => prevCredits - (totalQuestions || 3));
    }, 3000);
  }, [credits, totalQuestions, context, topicName, easyCount, mediumCount, hardCount, sampleQuestions]);

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
        {/* Main Chat Card */}
        <div className="relative bg-white/95 backdrop-blur-xl rounded-[2rem] p-6 sm:p-10 shadow-2xl shadow-orange-500/8 overflow-hidden border border-orange-100/60 transition-all duration-500 hover:shadow-3xl hover:shadow-orange-500/12">
          
          {/* Enhanced gradient overlay with subtle animation */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/40 via-transparent to-amber-100/30 pointer-events-none animate-pulse opacity-60" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-orange-200/20 to-transparent rounded-full blur-3xl pointer-events-none" />
          
          {/* Animation Overlay */}
          {showAnimation && (
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-amber-400/20 to-orange-600/20 animate-pulse z-50 rounded-[2rem] border-2 border-orange-400/50">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent animate-ping" />
            </div>
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
