
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, Mic, Plus, TrendingUp, Newspaper, Users, Activity, Zap } from "lucide-react";

const ChatAgent = () => {
  const [inputValue, setInputValue] = useState("");
  const [context, setContext] = useState("");
  const [topicName, setTopicName] = useState("");
  const [easyCount, setEasyCount] = useState(0);
  const [mediumCount, setMediumCount] = useState(0);
  const [hardCount, setHardCount] = useState(0);

  const handleGenerate = () => {
    console.log("Generating questions with:", {
      context,
      topicName,
      easyCount,
      mediumCount,
      hardCount
    });
    // TODO: Add generation logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/20 to-slate-100 p-6 font-inter">
      <div className="w-full max-w-5xl mx-auto">
        {/* Main Chat Card */}
        <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-orange-500/10 overflow-hidden border border-orange-100/50">
          
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-orange-100/20 pointer-events-none" />
          
          {/* Header */}
          <div className="relative z-10 mb-8">
            <h2 className="text-orange-500 font-semibold text-xs uppercase tracking-[0.2em] mb-3 opacity-80">
              CHAT AGENT
            </h2>
            <h1 className="text-3xl font-light text-slate-800 mb-3 leading-tight">
              Good afternoon!
            </h1>
            <h2 className="text-4xl font-bold text-slate-900 mb-4 leading-tight">
              May I help you with anything?
            </h2>
            <p className="text-lg text-slate-600 font-light">
              Generate customized questions for any topic with ease.
            </p>
          </div>

          {/* Chat Input Area */}
          <div className="relative z-10 mb-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-orange-200/30 shadow-lg shadow-orange-500/5">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Mic className="w-5 h-5 text-orange-600" />
                  </div>
                </div>
                <Input
                  type="text"
                  placeholder="What's on your mind today?"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1 border-0 bg-transparent text-lg placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                />
                <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full w-12 h-12 p-0 shadow-lg">
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="relative z-10 mb-8">
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="bg-white/60 backdrop-blur-sm border-orange-200/50 text-orange-700 hover:bg-orange-50 hover:border-orange-300 rounded-full px-6 py-2 text-sm font-medium shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Daily Summary
              </Button>
              <Button
                variant="outline"
                className="bg-white/60 backdrop-blur-sm border-orange-200/50 text-orange-700 hover:bg-orange-50 hover:border-orange-300 rounded-full px-6 py-2 text-sm font-medium shadow-sm"
              >
                <Newspaper className="w-4 h-4 mr-2" />
                News
              </Button>
              <Button
                variant="outline"
                className="bg-white/60 backdrop-blur-sm border-orange-200/50 text-orange-700 hover:bg-orange-50 hover:border-orange-300 rounded-full px-6 py-2 text-sm font-medium shadow-sm"
              >
                <Users className="w-4 h-4 mr-2" />
                Visitors
              </Button>
              <Button
                variant="outline"
                className="bg-white/60 backdrop-blur-sm border-orange-200/50 text-orange-700 hover:bg-orange-50 hover:border-orange-300 rounded-full px-6 py-2 text-sm font-medium shadow-sm"
              >
                <Activity className="w-4 h-4 mr-2" />
                Health Report
              </Button>
            </div>
          </div>

          {/* Question Generation Form */}
          <div className="relative z-10 bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-orange-200/30 shadow-inner">
            <h3 className="text-xl font-semibold text-slate-800 mb-6">Generate Questions</h3>
            
            {/* Context Text Box */}
            <div className="mb-6">
              <Label htmlFor="context" className="text-slate-700 font-medium mb-3 block text-sm">
                Context
              </Label>
              <Textarea
                id="context"
                placeholder="Provide context for question generation..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="w-full min-h-[100px] bg-white/80 backdrop-blur-sm border-orange-200/50 focus:border-orange-400 focus:ring-orange-200/50 rounded-xl resize-none"
              />
            </div>

            {/* Topic Name */}
            <div className="mb-6">
              <Label htmlFor="topic" className="text-slate-700 font-medium mb-3 block text-sm">
                Topic Name
              </Label>
              <Input
                id="topic"
                type="text"
                placeholder="Enter topic name..."
                value={topicName}
                onChange={(e) => setTopicName(e.target.value)}
                className="w-full bg-white/80 backdrop-blur-sm border-orange-200/50 focus:border-orange-400 focus:ring-orange-200/50 rounded-xl"
              />
            </div>

            {/* Number of Questions by Difficulty */}
            <div className="mb-8">
              <Label className="text-slate-700 font-medium mb-4 block text-sm">
                Number of Questions by Difficulty
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Easy Questions */}
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-orange-200/30">
                  <Label htmlFor="easy" className="text-slate-600 text-sm mb-2 block font-medium">
                    Easy Questions
                  </Label>
                  <Input
                    id="easy"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={easyCount}
                    onChange={(e) => setEasyCount(Number(e.target.value))}
                    className="w-full bg-white/80 border-orange-200/50 focus:border-orange-400 focus:ring-orange-200/50 rounded-lg"
                  />
                </div>

                {/* Medium Questions */}
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-orange-200/30">
                  <Label htmlFor="medium" className="text-slate-600 text-sm mb-2 block font-medium">
                    Medium Questions
                  </Label>
                  <Input
                    id="medium"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={mediumCount}
                    onChange={(e) => setMediumCount(Number(e.target.value))}
                    className="w-full bg-white/80 border-orange-200/50 focus:border-orange-400 focus:ring-orange-200/50 rounded-lg"
                  />
                </div>

                {/* Hard Questions */}
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-orange-200/30">
                  <Label htmlFor="hard" className="text-slate-600 text-sm mb-2 block font-medium">
                    Hard Questions
                  </Label>
                  <Input
                    id="hard"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={hardCount}
                    onChange={(e) => setHardCount(Number(e.target.value))}
                    className="w-full bg-white/80 border-orange-200/50 focus:border-orange-400 focus:ring-orange-200/50 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleGenerate}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 px-8 rounded-full shadow-lg shadow-orange-500/25 transition-all duration-300 transform hover:scale-[1.02] text-base font-semibold"
              >
                <Zap className="w-5 h-5 mr-2" />
                Generate Questions
              </Button>
            </div>
          </div>

          {/* Top right logo */}
          <div className="absolute top-6 right-6 z-20">
            <div className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-xl p-2 shadow-lg shadow-orange-500/10 border border-orange-200/30">
              <img 
                src="/lovable-uploads/4a7eb61d-f2d1-4530-ae72-abaccb971ba2.png" 
                alt="Company Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAgent;
