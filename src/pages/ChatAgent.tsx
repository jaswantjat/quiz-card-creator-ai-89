
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, Mic, Plus, TrendingUp, Newspaper, Users, Activity, Zap, CreditCard } from "lucide-react";

const ChatAgent = () => {
  const [inputValue, setInputValue] = useState("");
  const [context, setContext] = useState("");
  const [topicName, setTopicName] = useState("");
  const [easyCount, setEasyCount] = useState(0);
  const [mediumCount, setMediumCount] = useState(0);
  const [hardCount, setHardCount] = useState(0);
  const [credits, setCredits] = useState(10);

  const totalQuestions = easyCount + mediumCount + hardCount;

  const handleGenerate = () => {
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

    // Consume credits
    setCredits(prevCredits => prevCredits - totalQuestions);
    
    // TODO: Add generation logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-amber-50/20 p-4 sm:p-6 font-inter">
      <div className="w-full max-w-6xl mx-auto">
        {/* Main Chat Card */}
        <div className="relative bg-white/95 backdrop-blur-xl rounded-[2rem] p-6 sm:p-10 shadow-2xl shadow-orange-500/8 overflow-hidden border border-orange-100/60 transition-all duration-500 hover:shadow-3xl hover:shadow-orange-500/12">
          
          {/* Credits Display - Top Right */}
          <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-xl rounded-xl px-4 py-2 shadow-lg shadow-orange-500/10 border border-orange-200/40 flex items-center gap-2 z-20">
            <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-1 shadow-md">
              <CreditCard className="w-full h-full text-white" />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-medium">Credits</p>
              <p className="text-lg font-bold text-slate-800">{credits}</p>
            </div>
          </div>

          {/* Enhanced gradient overlay with subtle animation */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/40 via-transparent to-amber-100/30 pointer-events-none animate-pulse opacity-60" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-orange-200/20 to-transparent rounded-full blur-3xl pointer-events-none" />
          
          {/* Header with enhanced typography */}
          <div className="relative z-10 mb-10">
            
          </div>

          {/* Chat Input Area - Enhanced but kept minimal */}
          <div className="relative z-10 mb-10">
            
          </div>

          {/* Enhanced Question Generation Form */}
          <div className="relative z-10 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl rounded-3xl p-8 border border-orange-200/40 shadow-xl shadow-orange-500/5">
            
            <div className="flex items-center gap-3 mb-8">
              <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-xl shadow-orange-500/15 border border-orange-200/40 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/25 hover:scale-110">
                <img src="/lovable-uploads/4a7eb61d-f2d1-4530-ae72-abaccb971ba2.png" alt="Company Logo" className="w-full h-full object-contain" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-800 tracking-tight">Generate Questions</h3>
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
                disabled={credits < totalQuestions || totalQuestions === 0}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 px-10 rounded-2xl shadow-xl shadow-orange-500/30 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/40 text-lg font-semibold group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Zap className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
                Generate Questions
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAgent;
