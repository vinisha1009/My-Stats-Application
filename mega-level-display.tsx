import { useUserProgress } from "@/hooks/use-user-progress";
import { calculateXpRequiredForLevel } from "@/lib/xp-calculator";

export default function MegaLevelDisplay() {
  const { userProgress } = useUserProgress();

  if (!userProgress || userProgress.length === 0) {
    return null;
  }

  // Calculate mega level as average of the three sub-levels
  const megaLevel = Math.floor(
    userProgress.reduce((sum, progress) => sum + progress.level, 0) / userProgress.length
  );

  const getProgressBarClass = (type: string) => {
    switch (type) {
      case 'abilities': return 'xp-fill-purple';
      case 'skills': return 'xp-fill';
      case 'physical': return 'xp-fill-green';
      default: return 'xp-fill';
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'abilities': return 'border-purple-500/30';
      case 'skills': return 'border-cyan-500/30';
      case 'physical': return 'border-green-500/30';
      default: return 'border-gray-500/30';
    }
  };

  const getTextColor = (type: string) => {
    switch (type) {
      case 'abilities': return 'text-purple-400';
      case 'skills': return 'text-cyan-400';
      case 'physical': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 mb-8">
      <div className="bg-[#1A1A2E] border border-cyan-500/50 rounded-xl p-8 shadow-glow-blue">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-orbitron font-bold text-cyan-400 mb-2">
            LV: {megaLevel}
          </h2>
          <div className="text-gray-400">Overall Ascension Level</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {userProgress.map((progress) => {
            const xpRequiredForNext = calculateXpRequiredForLevel(progress.level + 1);
            const xpRequiredForCurrent = calculateXpRequiredForLevel(progress.level);
            const xpForNextLevel = xpRequiredForNext - xpRequiredForCurrent;
            const progressPercentage = (progress.currentXp / xpForNextLevel) * 100;

            return (
              <div 
                key={progress.type} 
                className={`bg-[#0F0F23]/50 p-6 rounded-lg border ${getBorderColor(progress.type)}`}
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className={`text-xl font-semibold capitalize ${getTextColor(progress.type)}`}>
                    {progress.type}
                  </h3>
                  <span className="text-sm font-orbitron">Lv: {progress.level}</span>
                </div>
                <div className="xp-bar bg-gray-800 rounded-full h-4 mb-2">
                  <div 
                    className={`${getProgressBarClass(progress.type)} h-full rounded-full`}
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-gray-400">
                  {progress.currentXp.toLocaleString()} / {xpForNextLevel.toLocaleString()} XP
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
