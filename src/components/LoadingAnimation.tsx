
const LoadingAnimation = () => {
  return (
    <div className="relative z-10 mt-8 flex flex-col items-center justify-center py-12">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-orange-200 rounded-full animate-spin border-t-orange-500"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-orange-300"></div>
      </div>
      <p className="mt-4 text-slate-600 font-medium animate-pulse">
        Crafting intelligent questions...
      </p>
    </div>
  );
};

export default LoadingAnimation;
