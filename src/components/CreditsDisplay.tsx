
import { CreditCard } from "lucide-react";

interface CreditsDisplayProps {
  credits: number;
}

const CreditsDisplay = ({ credits }: CreditsDisplayProps) => {
  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-lg px-3 py-2 shadow-lg shadow-orange-500/10 border border-orange-200/40 flex items-center gap-2">
      <div className="w-5 h-5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-md p-1 shadow-md">
        <CreditCard className="w-full h-full text-white" />
      </div>
      <div>
        <p className="text-xs text-slate-600 font-medium">Credits</p>
        <p className="text-sm font-bold text-slate-800">{credits}</p>
      </div>
    </div>
  );
};

export default CreditsDisplay;
