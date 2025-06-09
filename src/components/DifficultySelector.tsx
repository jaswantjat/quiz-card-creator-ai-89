
import { memo, useMemo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DifficultySelectorProps {
  easyCount: number;
  mediumCount: number;
  hardCount: number;
  setEasyCount: (count: number) => void;
  setMediumCount: (count: number) => void;
  setHardCount: (count: number) => void;
}

// Move static configuration outside component to prevent recreation
const DIFFICULTY_CONFIG = [
  {
    id: "easy",
    label: "Easy Questions",
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50/80"
  },
  {
    id: "medium",
    label: "Medium Questions",
    color: "from-yellow-500 to-yellow-600",
    bgColor: "bg-yellow-50/80"
  },
  {
    id: "hard",
    label: "Hard Questions",
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-50/80"
  }
] as const;

const DifficultySelector = memo(({
  easyCount,
  mediumCount,
  hardCount,
  setEasyCount,
  setMediumCount,
  setHardCount
}: DifficultySelectorProps) => {
  // Create optimized handlers with useCallback
  const handleEasyChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEasyCount(Number(e.target.value));
  }, [setEasyCount]);

  const handleMediumChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setMediumCount(Number(e.target.value));
  }, [setMediumCount]);

  const handleHardChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setHardCount(Number(e.target.value));
  }, [setHardCount]);

  // Memoize only the dynamic values
  const difficultyValues = useMemo(() => ({
    easy: easyCount,
    medium: mediumCount,
    hard: hardCount
  }), [easyCount, mediumCount, hardCount]);

  const difficultyHandlers = useMemo(() => ({
    easy: handleEasyChange,
    medium: handleMediumChange,
    hard: handleHardChange
  }), [handleEasyChange, handleMediumChange, handleHardChange]);

  return (
    <div className="mb-10">
      <Label className="text-slate-700 font-semibold mb-6 block text-base">
        Number of Questions by Difficulty
      </Label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {DIFFICULTY_CONFIG.map(config => {
          const value = difficultyValues[config.id as keyof typeof difficultyValues];
          const handler = difficultyHandlers[config.id as keyof typeof difficultyHandlers];

          return (
            <div key={config.id} className={`${config.bgColor} backdrop-blur-sm rounded-2xl p-6 border border-orange-200/30 smooth-transition hover:shadow-lg hover:shadow-orange-500/10 hover:scale-[1.02] group gpu-accelerated`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-3 h-3 bg-gradient-to-r ${config.color} rounded-full`}></div>
                <Label htmlFor={config.id} className="text-slate-700 text-base font-semibold group-hover:text-slate-800 smooth-transition">
                  {config.label}
                </Label>
              </div>
              <Input
                id={config.id}
                type="number"
                min="0"
                max="50"
                placeholder="0"
                value={value}
                onChange={handler}
                className="w-full bg-white/90 border-orange-200/50 focus:border-orange-400 focus:ring-orange-200/50 rounded-xl text-lg font-medium text-center smooth-transition"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
});

DifficultySelector.displayName = 'DifficultySelector';

export default DifficultySelector;
