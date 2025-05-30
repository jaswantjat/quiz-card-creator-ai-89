import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Send, Mic, Plus, TrendingUp, Newspaper, Users, Activity } from "lucide-react";
const ChatAgent = () => {
  const [inputValue, setInputValue] = useState("");
  const [context, setContext] = useState("");
  const [topicName, setTopicName] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const handleGenerate = () => {
    console.log("Generating questions with:", {
      context,
      topicName,
      difficulty
    });
    // TODO: Add generation logic here
  };
  return <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 font-inter">
      <div className="w-full max-w-4xl mx-auto">
        {/* Main Chat Card */}
        <div className="relative bg-gradient-to-br from-orange-100 via-orange-50 to-red-50 rounded-3xl p-10 shadow-2xl overflow-hidden border border-orange-200/50">
          
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-orange-500 font-semibold text-sm uppercase tracking-wider mb-2">
              CHAT AGENT
            </h2>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Good afternoon, Jeff!
            </h1>
            <p className="text-2xl text-gray-700">
              May I help you with anything?
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-8">
            <div className="flex items-center bg-white rounded-full shadow-lg p-2 border border-orange-200/30">
              <Button variant="ghost" size="icon" className="rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                <Mic className="w-5 h-5" />
              </Button>
              <Input type="text" placeholder="What's on my calendar tomorrow?" value={inputValue} onChange={e => setInputValue(e.target.value)} className="flex-1 border-none bg-transparent text-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-0 text-lg" />
              <Button size="icon" className="rounded-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg">
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Question Generation Form */}
          <div className="bg-white/60 rounded-2xl p-6 mb-8 border border-orange-200/30">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Generate Questions</h3>
            
            {/* Context Text Box */}
            <div className="mb-4">
              <Label htmlFor="context" className="text-gray-700 font-medium mb-2 block">
                Context
              </Label>
              <Textarea id="context" placeholder="Provide context for question generation..." value={context} onChange={e => setContext(e.target.value)} className="w-full min-h-[100px] bg-white border-orange-200 focus:border-orange-400 focus:ring-orange-200" />
            </div>

            {/* Topic Name */}
            <div className="mb-4">
              <Label htmlFor="topic" className="text-gray-700 font-medium mb-2 block">
                Topic Name
              </Label>
              <Input id="topic" type="text" placeholder="Enter topic name..." value={topicName} onChange={e => setTopicName(e.target.value)} className="w-full bg-white border-orange-200 focus:border-orange-400 focus:ring-orange-200" />
            </div>

            {/* Difficulty Level */}
            <div className="mb-6">
              <Label className="text-gray-700 font-medium mb-3 block">
                Difficulty Level
              </Label>
              <RadioGroup value={difficulty} onValueChange={setDifficulty} className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Easy" id="easy" className="border-orange-400 text-orange-500" />
                  <Label htmlFor="easy" className="text-gray-700 cursor-pointer">Easy</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Medium" id="medium" className="border-orange-400 text-orange-500" />
                  <Label htmlFor="medium" className="text-gray-700 cursor-pointer">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Hard" id="hard" className="border-orange-400 text-orange-500" />
                  <Label htmlFor="hard" className="text-gray-700 cursor-pointer">Hard</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Generate Button */}
            <Button onClick={handleGenerate} className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
              Generate Questions
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            

            

            

            
          </div>

          {/* Additional Health Report Button */}
          <div className="mt-4 flex justify-end">
            
          </div>

          {/* Top right icon */}
          <div className="absolute top-6 right-6">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-400 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default ChatAgent;