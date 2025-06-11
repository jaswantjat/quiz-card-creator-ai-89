import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import iQubeLogo from '@/assets/images/5f87692c-a4e5-4595-8ad0-26c2ce2c520e.png';
import aiIcon from '@/assets/images/2d10c74e-3a04-4e16-adec-d4b95a85bc81.png';
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// Simplified AICard - Navigation only, no question generation

const AICard = () => {
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Simple navigation handler - no question generation here
  const handleNavigateToGenerator = () => {
    setIsNavigating(true);

    // Show loading feedback
    toast.success("Opening Question Generator...", {
      description: "Redirecting to the question generation form"
    });

    // Navigate to the proper question generation page
    setTimeout(() => {
      navigate('/chat-agent');
      setIsNavigating(false);
    }, 500);
  };



  return (
    <div className="relative w-full font-inter">
      {/* Main Card */}
      <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 rounded-3xl p-10 shadow-2xl overflow-hidden border border-orange-200/20">
        
        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-black/5 to-black/20"></div>
        
        {/* Floating Decorative Elements with Elegant Animations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating Stars with Smooth Movement */}
          <div className="absolute top-8 right-12 w-3 h-3 bg-white/30 rounded-full animate-[float_6s_ease-in-out_infinite]" />
          <div className="absolute top-16 right-24 w-2 h-2 bg-white/20 rounded-full animate-[float_8s_ease-in-out_infinite_1s]" />
          <div className="absolute top-12 right-8 w-1.5 h-1.5 bg-white/25 rounded-full animate-[float_7s_ease-in-out_infinite_2s]" />
          
          {/* Star Shapes with Elegant Rotation */}
          <div className="absolute top-10 right-16 text-white/25 animate-[rotate_20s_linear_infinite]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="transform-gpu">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          
          <div className="absolute top-20 right-32 text-white/20 animate-[rotate_25s_linear_infinite_reverse]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="transform-gpu">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>

          {/* Large Star with Subtle Scale Animation */}
          <div className="absolute top-16 right-20 text-white/15 animate-[breathe_4s_ease-in-out_infinite]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="transform-gpu">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>

          {/* Additional floating dots with gentle drift */}
          <div className="absolute top-24 right-14 w-2 h-2 bg-white/20 rounded-full animate-[drift_10s_ease-in-out_infinite]" />
          <div className="absolute top-28 right-28 w-1.5 h-1.5 bg-white/25 rounded-full animate-[drift_12s_ease-in-out_infinite_3s]" />
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          {/* Logo and Title */}
          <div className="flex items-center gap-3 mb-4">
            <img src={iQubeLogo} alt="iQube Logo" className="w-20 h-20 object-contain" />
            <h1 className="font-space text-5xl font-bold text-white leading-tight tracking-tight mx--6 px-0 my-0">
              iQube
            </h1>
          </div>
          
          {/* Subtitle */}
          <p className="text-white/90 text-lg mb-8 leading-relaxed font-inter font-medium">
            Generates intelligent questions for various topics.
          </p>

          {/* Navigate to Generator Button */}
          <Button onClick={handleNavigateToGenerator} disabled={isNavigating} className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed border border-white/30 font-inter">
            {isNavigating ? <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Opening Generator...
              </div> : <div className="flex items-center gap-2">
                <img src={aiIcon} alt="AI Icon" className="w-6 h-6" />
                Start Question Generation
              </div>}
          </Button>
        </div>
      </div>


    </div>
  );
};

export default AICard;
