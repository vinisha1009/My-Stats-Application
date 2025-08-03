// XP calculation based on difficulty levels
export const DIFFICULTY_XP_MAP = {
  very_easy: 25,
  easy: 50,
  medium: 100,
  hard: 200,
  very_hard: 350,
  extreme: 500,
  nightmare: 750,
  legendary: 1000,
  mythical: 1500,
  transcendent: 2000,
} as const;

export function calculateXpForDifficulty(difficulty: string): number {
  return DIFFICULTY_XP_MAP[difficulty as keyof typeof DIFFICULTY_XP_MAP] || 100;
}

// Level calculation - exponential growth but capped to prevent impossible levels
export function calculateLevelFromXp(totalXp: number): number {
  if (totalXp < 100) return 1;
  
  // Use a formula that makes progression challenging but achievable
  // Level 70 should require significant effort but be possible
  const level = Math.floor(Math.log(totalXp / 100) / Math.log(1.15)) + 1;
  return Math.max(1, Math.min(level, 100)); // Cap at level 100
}

export function calculateXpRequiredForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.floor(100 * Math.pow(1.15, level - 1));
}

export function calculateXpRequiredForNextLevel(currentLevel: number): number {
  return calculateXpRequiredForLevel(currentLevel + 1) - calculateXpRequiredForLevel(currentLevel);
}
