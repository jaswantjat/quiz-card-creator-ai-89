
import CreditsDisplay from "./CreditsDisplay";

interface ChatAgentHeaderProps {
  credits: number;
}

const ChatAgentHeader = ({ credits }: ChatAgentHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-xl shadow-orange-500/15 border border-orange-200/40 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/25 hover:scale-110">
          <img src="/lovable-uploads/4a7eb61d-f2d1-4530-ae72-abaccb971ba2.png" alt="Company Logo" className="w-full h-full object-contain" />
        </div>
        <h3 className="text-2xl font-semibold text-slate-800 tracking-tight">Generate Questions</h3>
      </div>
      
      <CreditsDisplay credits={credits} />
    </div>
  );
};

export default ChatAgentHeader;
