
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

const DifficultySelector = ({
  easyCount,
  mediumCount,
  hardCount,
  setEasyCount,
  setMediumCount,
  setHardCount
}: DifficultySelectorProps) => {
  const difficultyOptions = [
    {
      id: "easy",
      label: "Easy Questions",
      value: easyCount,
      setter: setEasyCount,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50/80"
    },
    {
      id: "medium",
      label: "Medium Questions",
      value: mediumCount,
      setter: setMediumCount,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50/80"
    },
    {
      id: "hard",
      label: "Hard Questions",
      value: hardCount,
      setter: setHardCount,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50/80"
    }
  ];

  return (
    <div className="mb-10">
      <Label className="text-slate-700 font-semibold mb-6 block text-base">
        Number of Questions by Difficulty
      </Label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {difficultyOptions.map(item => (
          <div key={item.id} className={`${item.bgColor} backdrop-blur-sm rounded-2xl p-6 border border-orange-200/30 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 hover:scale-105 group`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-3 h-3 bg-gradient-to-r ${item.color} rounded-full`}></div>
              <Label htmlFor={item.id} className="text-slate-700 text-base font-semibold group-hover:text-slate-800 transition-colors">
                {item.label}
              </Label>
            </div>
            <Input 
              id={item.id} 
              type="number" 
              min="0" 
              placeholder="0" 
              value={item.value} 
              onChange={e => item.setter(Number(e.target.value))} 
              className="w-full bg-white/90 border-orange-200/50 focus:border-orange-400 focus:ring-orange-200/50 rounded-xl text-lg font-medium text-center transition-all duration-300" 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DifficultySelector;
