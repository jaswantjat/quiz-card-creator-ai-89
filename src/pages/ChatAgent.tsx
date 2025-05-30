
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Mic, Plus, TrendingUp, Newspaper, Users, Activity } from "lucide-react";

const ChatAgent = () => {
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 font-inter">
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
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                <Mic className="w-5 h-5" />
              </Button>
              <Input
                type="text"
                placeholder="What's on my calendar tomorrow?"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 border-none bg-transparent text-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-0 text-lg"
              />
              <Button
                size="icon"
                className="rounded-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="ghost"
              className="h-auto p-4 rounded-2xl bg-white/50 hover:bg-white/70 border border-orange-200/30 flex flex-col items-center gap-2 transition-all duration-300 hover:scale-[1.02]"
            >
              <Plus className="w-6 h-6 text-orange-500" />
              <span className="text-gray-600 font-medium">Add</span>
            </Button>

            <Button
              variant="ghost"
              className="h-auto p-4 rounded-2xl bg-white/50 hover:bg-white/70 border border-orange-200/30 flex flex-col items-center gap-2 transition-all duration-300 hover:scale-[1.02]"
            >
              <TrendingUp className="w-6 h-6 text-orange-500" />
              <span className="text-gray-600 font-medium">Daily Summary</span>
            </Button>

            <Button
              variant="ghost"
              className="h-auto p-4 rounded-2xl bg-white/50 hover:bg-white/70 border border-orange-200/30 flex flex-col items-center gap-2 transition-all duration-300 hover:scale-[1.02]"
            >
              <Newspaper className="w-6 h-6 text-orange-500" />
              <span className="text-gray-600 font-medium">News</span>
            </Button>

            <Button
              variant="ghost"
              className="h-auto p-4 rounded-2xl bg-white/50 hover:bg-white/70 border border-orange-200/30 flex flex-col items-center gap-2 transition-all duration-300 hover:scale-[1.02]"
            >
              <Users className="w-6 h-6 text-orange-500" />
              <span className="text-gray-600 font-medium">Visitors</span>
            </Button>
          </div>

          {/* Additional Health Report Button */}
          <div className="mt-4 flex justify-end">
            <Button
              variant="ghost"
              className="h-auto p-4 rounded-2xl bg-white/50 hover:bg-white/70 border border-orange-200/30 flex items-center gap-2 transition-all duration-300 hover:scale-[1.02]"
            >
              <Activity className="w-6 h-6 text-orange-500" />
              <span className="text-gray-600 font-medium">Health Report</span>
            </Button>
          </div>

          {/* Top right icon */}
          <div className="absolute top-6 right-6">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-400 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAgent;
