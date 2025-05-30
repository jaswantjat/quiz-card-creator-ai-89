
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 font-inter">
      <div className="w-full max-w-4xl mx-auto">
        {/* Main Chat Card */}
        <div className="relative bg-gradient-to-br from-orange-100 via-orange-50 to-red-50 rounded-3xl p-10 shadow-2xl overflow-hidden border border-orange-200/50">
          
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-orange-500 font-semibold text-sm uppercase tracking-wider mb-2">
              QUESTION GENERATOR
            </h2>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Ready to create questions?
            </h1>
            <p className="text-2xl text-gray-700">
              Generate customized questions for any topic with ease.
            </p>
          </div>

          {/* Question Generation Form */}
          <div className="bg-white/60 rounded-2xl p-6 mb-8 border border-orange-200/30">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Generate Questions</h3>
            
            {/* Context Text Box */}
            <div className="mb-4">
              <Label htmlFor="context" className="text-gray-700 font-medium mb-2 block">
                Context
              </Label>
              <Textarea
                id="context"
                placeholder="Provide context for question generation..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="w-full min-h-[100px] bg-white border-orange-200 focus:border-orange-400 focus:ring-orange-200"
              />
            </div>

            {/* Topic Name */}
            <div className="mb-4">
              <Label htmlFor="topic" className="text-gray-700 font-medium mb-2 block">
                Topic Name
              </Label>
              <Input
                id="topic"
                type="text"
                placeholder="Enter topic name..."
                value={topicName}
                onChange={(e) => setTopicName(e.target.value)}
                className="w-full bg-white border-orange-200 focus:border-orange-400 focus:ring-orange-200"
              />
            </div>

            {/* Number of Questions by Difficulty */}
            <div className="mb-6">
              <Label className="text-gray-700 font-medium mb-3 block">
                Number of Questions by Difficulty
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Easy Questions */}
                <div>
                  <Label htmlFor="easy" className="text-gray-600 text-sm mb-2 block">
                    Easy Questions
                  </Label>
                  <Input
                    id="easy"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={easyCount}
                    onChange={(e) => setEasyCount(Number(e.target.value))}
                    className="w-full bg-white border-orange-200 focus:border-orange-400 focus:ring-orange-200"
                  />
                </div>

                {/* Medium Questions */}
                <div>
                  <Label htmlFor="medium" className="text-gray-600 text-sm mb-2 block">
                    Medium Questions
                  </Label>
                  <Input
                    id="medium"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={mediumCount}
                    onChange={(e) => setMediumCount(Number(e.target.value))}
                    className="w-full bg-white border-orange-200 focus:border-orange-400 focus:ring-orange-200"
                  />
                </div>

                {/* Hard Questions */}
                <div>
                  <Label htmlFor="hard" className="text-gray-600 text-sm mb-2 block">
                    Hard Questions
                  </Label>
                  <Input
                    id="hard"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={hardCount}
                    onChange={(e) => setHardCount(Number(e.target.value))}
                    className="w-full bg-white border-orange-200 focus:border-orange-400 focus:ring-orange-200"
                  />
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleGenerate}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] text-base font-semibold"
              >
                <Zap className="w-5 h-5 mr-2" />
                Generate Questions
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            

            

            

            
          </div>

          {/* Additional Health Report Button */}
          <div className="mt-4 flex justify-end">
            
          </div>

          {/* Top right logo */}
          <div className="absolute top-6 right-6">
            <img 
              src="/lovable-uploads/4a7eb61d-f2d1-4530-ae72-abaccb971ba2.png" 
              alt="Company Logo" 
              className="w-16 h-16 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAgent;
