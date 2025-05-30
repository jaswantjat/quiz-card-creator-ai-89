
const FloatingElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating Stars */}
      <div className="absolute top-8 right-12 w-1 h-1 bg-white rounded-full animate-pulse" />
      <div className="absolute top-16 right-24 w-1.5 h-1.5 bg-orange-300 rounded-full animate-pulse delay-300" />
      <div className="absolute top-20 right-8 w-1 h-1 bg-purple-300 rounded-full animate-pulse delay-700" />
      
      {/* Star Shapes */}
      <div className="absolute top-12 right-16 text-white/30 animate-pulse delay-500">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </div>
      
      <div className="absolute top-24 right-32 text-orange-300/40 animate-pulse delay-1000">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </div>

      {/* Floating Dots */}
      <div className="absolute top-32 right-20 w-2 h-2 bg-gradient-to-r from-orange-400 to-red-400 rounded-full animate-bounce delay-200" />
      <div className="absolute top-40 right-28 w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce delay-500" />
    </div>
  );
};

export default FloatingElements;
