
import { CreditCard, Clock, RefreshCw, Gamepad2 } from "lucide-react";
import { useState, useEffect } from "react";
import { usersAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useDemoCredits } from "@/hooks/useDemoCredits";

interface CreditsDisplayProps {
  credits?: number; // Made optional since we'll get it from the hook
}

const CreditsDisplay = ({ credits: propCredits }: CreditsDisplayProps) => {
  const { user, refreshUserProfile } = useAuth();
  const { credits, isDemoMode, refreshDemoCredits } = useDemoCredits();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeUntilRefresh, setTimeUntilRefresh] = useState<string>("");

  // Use credits from hook, fallback to prop for backward compatibility
  const displayCredits = propCredits !== undefined ? propCredits : credits;

  // Calculate time until next credit refresh
  useEffect(() => {
    if (!user?.lastCreditRefresh) return;

    const updateCountdown = () => {
      const lastRefresh = new Date(user.lastCreditRefresh!);
      const nextRefresh = new Date(lastRefresh);
      nextRefresh.setDate(nextRefresh.getDate() + 1);
      nextRefresh.setHours(0, 0, 0, 0); // Set to midnight

      const now = new Date();
      const timeDiff = nextRefresh.getTime() - now.getTime();

      if (timeDiff <= 0) {
        setTimeUntilRefresh("Refreshing...");
        // Auto-refresh user profile to get updated credits
        refreshUserProfile();
      } else {
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeUntilRefresh(`${hours}h ${minutes}m`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [user?.lastCreditRefresh, refreshUserProfile]);

  const handleManualRefresh = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      if (isDemoMode) {
        // Demo mode - refresh to 10 credits
        refreshDemoCredits();
      } else {
        // Authenticated mode - call API
        await usersAPI.refreshCredits();
        await refreshUserProfile();
      }
    } catch (error) {
      console.error('Failed to refresh credits:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const creditColor = displayCredits === 0 ? 'text-red-600' : displayCredits <= 3 ? 'text-orange-600' : 'text-slate-800';
  const bgColor = displayCredits === 0 ? 'border-red-200/40' : displayCredits <= 3 ? 'border-orange-200/40' : 'border-orange-200/40';

  return (
    <div className={`bg-white/90 backdrop-blur-xl rounded-lg px-3 py-2 shadow-lg shadow-orange-500/10 border ${bgColor} flex items-center gap-2 group`}>
      <div className="w-5 h-5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-md p-1 shadow-md">
        {isDemoMode ? (
          <Gamepad2 className="w-full h-full text-white" />
        ) : (
          <CreditCard className="w-full h-full text-white" />
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-1">
          <p className="text-xs text-slate-600 font-medium">
            {isDemoMode ? 'Demo Credits' : 'Credits'}
          </p>
          {(displayCredits <= 3 || isDemoMode) && (
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-orange-100 rounded"
              title={isDemoMode ? "Refresh demo credits (or refresh page)" : "Refresh credits"}
            >
              <RefreshCw className={`w-3 h-3 text-orange-500 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
        <p className={`text-sm font-bold ${creditColor}`}>{displayCredits}</p>
        {isDemoMode && (
          <div className="flex items-center gap-1 mt-0.5">
            <Gamepad2 className="w-2.5 h-2.5 text-blue-400" />
            <p className="text-xs text-blue-400">Demo Mode</p>
          </div>
        )}
        {timeUntilRefresh && !isDemoMode && (
          <div className="flex items-center gap-1 mt-0.5">
            <Clock className="w-2.5 h-2.5 text-slate-400" />
            <p className="text-xs text-slate-400">{timeUntilRefresh}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreditsDisplay;
