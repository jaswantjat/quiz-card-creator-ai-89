import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, Mic, Plus, TrendingUp, Newspaper, Users, Activity, Zap, CreditCard } from "lucide-react";
import QuestionDisplay from "@/components/QuestionDisplay";

interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const ChatAgent = () => {
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

  const handleGenerate = async () => {
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

    // Start the animation sequence
    setShowAnimation(true);
    
    // After animation completes, start loading
    setTimeout(() => {
      setIsGenerating(true);
      setShowAnimation(false);
    }, 800);

    // Simulate API call delay and then show questions
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedQuestions(sampleQuestions.slice(0, totalQuestions || 3));
      
      // Consume credits
      setCredits(prevCredits => prevCredits - (totalQuestions || 3));
    }, 2500);
  };

  const handleRegenerate = () => {
    setGeneratedQuestions([]);
    handleGenerate();
  };

  const handleAddToQB = (questionId: string) => {
    console.log("Adding question to QB:", questionId);
    // TODO: Add to question bank functionality
  };

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

          {/* Header with enhanced typography */}
          <div className="relative z-10 mb-10">
            
          </div>

          {/* Chat Input Area - Enhanced but kept minimal */}
          <div className="relative z-10 mb-10">
            
          </div>

          {/* Enhanced Question Generation Form */}
          <div className="relative z-10 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl rounded-3xl p-8 border border-orange-200/40 shadow-xl shadow-orange-500/5">
            
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-xl shadow-orange-500/15 border border-orange-200/40 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/25 hover:scale-110">
                  <img src="/lovable-uploads/4a7eb61d-f2d1-4530-ae72-abaccb971ba2.png" alt="Company Logo" className="w-full h-full object-contain" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-800 tracking-tight">Generate Questions</h3>
              </div>
              
              {/* Credits Display - Right aligned with title */}
              <div className="bg-white/90 backdrop-blur-xl rounded-lg px-3 py-2 shadow-lg shadow-orange-500/10 border border-orange-200/40 flex items-center gap-2">
                <div className="w-5 h-5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-md p-1 shadow-md">
                  <CreditCard className="w-full h-full text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-600 font-medium">Credits</p>
                  <p className="text-sm font-bold text-slate-800">{credits}</p>
                </div>
              </div>
            </div>
            
            {/* Enhanced Context Text Box */}
            <div className="mb-8">
              <Label htmlFor="context" className="text-slate-700 font-semibold mb-4 block text-base flex items-center gap-2">
                Context
                <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-full">(optional)</span>
              </Label>
              <div className="relative">
                <Textarea 
                  id="context" 
                  placeholder="Provide context for question generation. This helps create more targeted and relevant questions..." 
                  value={context} 
                  onChange={e => setContext(e.target.value)} 
                  className="w-full min-h-[120px] bg-white/90 backdrop-blur-sm border-orange-200/60 focus:border-orange-400 focus:ring-orange-200/50 rounded-2xl resize-none text-base leading-relaxed transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/5" 
                />
                <div className="absolute bottom-4 right-4 text-xs text-slate-400">
                  {context.length}/500
                </div>
              </div>
            </div>

            {/* Enhanced Topic Name */}
            <div className="mb-8">
              <Label htmlFor="topic" className="text-slate-700 font-semibold mb-4 block text-base">
                Topic Name
              </Label>
              <Input 
                id="topic" 
                type="text" 
                placeholder="Enter topic name (e.g., Machine Learning, History, Biology)..." 
                value={topicName} 
                onChange={e => setTopicName(e.target.value)} 
                className="w-full bg-white/90 backdrop-blur-sm border-orange-200/60 focus:border-orange-400 focus:ring-orange-200/50 rounded-2xl py-4 text-base transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/5" 
              />
            </div>

            {/* Enhanced Difficulty Grid */}
            <div className="mb-10">
              <Label className="text-slate-700 font-semibold mb-6 block text-base">
                Number of Questions by Difficulty
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    id: "easy",
                    label: "Easy Questions",
                    value: easyCount,
                    setter: setEasyCount,
                    color: "from-green-500 to-green-600",
                    bgColor: "bg-green-50/80"
                  },
                  {
                    id: "medium",
                    label: "Medium Questions",
                    value: mediumCount,
                    setter: setMediumCount,
                    color: "from-yellow-500 to-yellow-600",
                    bgColor: "bg-yellow-50/80"
                  },
                  {
                    id: "hard",
                    label: "Hard Questions",
                    value: hardCount,
                    setter: setHardCount,
                    color: "from-red-500 to-red-600",
                    bgColor: "bg-red-50/80"
                  }
                ].map(item => (
                  <div key={item.id} className={`${item.bgColor} backdrop-blur-sm rounded-2xl p-6 border border-orange-200/30 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 hover:scale-105 group`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-3 h-3 bg-gradient-to-r ${item.color} rounded-full`}></div>
                      <Label htmlFor={item.id} className="text-slate-700 text-base font-semibold group-hover:text-slate-800 transition-colors">
                        {item.label}
                      </Label>
                    </div>
                    <Input 
                      id={item.id} 
                      type="number" 
                      min="0" 
                      placeholder="0" 
                      value={item.value} 
                      onChange={e => item.setter(Number(e.target.value))} 
                      className="w-full bg-white/90 border-orange-200/50 focus:border-orange-400 focus:ring-orange-200/50 rounded-xl text-lg font-medium text-center transition-all duration-300" 
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Credit Warning and Generate Button */}
            <div className="flex flex-col items-center gap-4">
              {totalQuestions > 0 && (
                <div className="text-center">
                  <p className="text-sm text-slate-600">
                    This will consume <span className="font-semibold text-orange-600">{totalQuestions} credit{totalQuestions !== 1 ? 's' : ''}</span>
                  </p>
                  {credits < totalQuestions && (
                    <p className="text-sm text-red-600 font-medium mt-1">
                      Not enough credits! You need {totalQuestions} but have {credits}
                    </p>
                  )}
                </div>
              )}
              
              <Button 
                onClick={handleGenerate} 
                disabled={credits < totalQuestions || totalQuestions === 0 || isGenerating}
                className={`bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 px-10 rounded-2xl shadow-xl shadow-orange-500/30 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/40 text-lg font-semibold group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${showAnimation ? 'animate-pulse scale-110' : ''}`}
              >
                <Zap className={`w-6 h-6 mr-3 group-hover:rotate-12 transition-transform ${isGenerating ? 'animate-spin' : ''}`} />
                {isGenerating ? 'Generating...' : 'Generate Questions'}
              </Button>
            </div>
          </div>

          {/* Loading Animation */}
          {isGenerating && (
            <div className="relative z-10 mt-8 flex flex-col items-center justify-center py-12">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-orange-200 rounded-full animate-spin border-t-orange-500"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-orange-300"></div>
              </div>
              <p className="mt-4 text-slate-600 font-medium animate-pulse">
                Crafting intelligent questions...
              </p>
            </div>
          )}

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
};

export default ChatAgent;
