
import CreditsDisplay from "./CreditsDisplay";

interface ChatAgentHeaderProps {
  credits?: number; // Made optional since CreditsDisplay now manages its own credits
}

const ChatAgentHeader = ({ credits }: ChatAgentHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 bg-white/95 rounded-2xl p-3 shadow-lg shadow-orange-500/10 border border-orange-200/40 transition-shadow duration-200 hover:shadow-xl">
          <img src="/lovable-uploads/iMocha logo .png" alt="iMocha Logo" className="w-full h-full object-contain" />
        </div>
        <h3 className="text-2xl font-semibold text-slate-800 tracking-tight">Generate Questions</h3>
      </div>

      <CreditsDisplay credits={credits} />
    </div>
  );
};

export default ChatAgentHeader;
