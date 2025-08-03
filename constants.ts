export const REALMS = {
  scholar: {
    name: "Scholar",
    icon: "fas fa-graduation-cap",
    color: "text-cyan-400",
  },
  technomancer: {
    name: "Technomancer",
    icon: "fas fa-microchip",
    color: "text-purple-400",
  },
  entrepreneur: {
    name: "Entrepreneur",
    icon: "fas fa-chart-line",
    color: "text-emerald-400",
  },
  sage: {
    name: "Sage",
    icon: "fas fa-brain",
    color: "text-orange-400",
  },
  athlete: {
    name: "Athlete",
    icon: "fas fa-dumbbell",
    color: "text-red-400",
  },
  polyglot: {
    name: "Polyglot",
    icon: "fas fa-language",
    color: "text-blue-400",
  },
  alchemist: {
    name: "Alchemist",
    icon: "fas fa-flask",
    color: "text-yellow-400",
  },
  "shadow-hunter": {
    name: "Shadow Hunter",
    icon: "fas fa-mask",
    color: "text-gray-400",
  },
} as const;

export const DIFFICULTY_OPTIONS = [
  { value: "very_easy", label: "Very Easy", xp: 25 },
  { value: "easy", label: "Easy", xp: 50 },
  { value: "medium", label: "Medium", xp: 100 },
  { value: "hard", label: "Hard", xp: 200 },
  { value: "very_hard", label: "Very Hard", xp: 350 },
  { value: "extreme", label: "Extreme", xp: 500 },
  { value: "nightmare", label: "Nightmare", xp: 750 },
  { value: "legendary", label: "Legendary", xp: 1000 },
  { value: "mythical", label: "Mythical", xp: 1500 },
  { value: "transcendent", label: "Transcendent", xp: 2000 },
] as const;

export const DIFFICULTY_LABELS = {
  very_easy: "Very Easy",
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
  very_hard: "Very Hard",
  extreme: "Extreme",
  nightmare: "Nightmare",
  legendary: "Legendary",
  mythical: "Mythical",
  transcendent: "Transcendent",
} as const;
