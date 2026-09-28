// src/utils/badgeEngine.js
// Badge definitions and unlock triggers for Patterns & Systematic Lists (Grade 7)

export const BADGES = [
  { id: 'first_term',       icon: '🏅', label: 'First Step',           description: 'Answered your very first pattern question correctly!' },
  { id: 'hot_streak',       icon: '🔥', label: 'Hot Streak',           description: 'Achieved a streak of 5 correct answers!' },
  { id: 'super_streak',     icon: '⚡', label: 'Pattern Prodigy',      description: 'Achieved a 10-question winning streak!' },
  { id: 'lab_champ',        icon: '🧪', label: 'Lab Champion',         description: 'Completed all 4 interactive simulation stations!' },
  { id: 'district_champ',   icon: '⭐', label: 'World Star',           description: 'Scored 3 stars in a Practice World!' },
  { id: 'boss_slayer',      icon: '👑', label: 'Boss Slayer',          description: 'Defeated a World Boss in battle!' },
  { id: 'century_scorer',   icon: '🎯', label: 'Centurion',            description: 'Answered over 20 questions in Practice!' },
  { id: 'pattern_master',   icon: '🏆', label: 'Pattern Grand Master', description: 'Completed the full 5-phase module journey!' },
];

export function checkBadges(state) {
  const unlocked = [];

  // First correct answer
  const totalCorrect = state.districtCorrect?.reduce((s, c) => s + (c || 0), 0) || 0;
  if (totalCorrect >= 1) unlocked.push('first_term');

  // Streak checks
  if (state.maxStreak >= 5) unlocked.push('hot_streak');
  if (state.maxStreak >= 10) unlocked.push('super_streak');

  // Simulation completion
  if (state.simStationsComplete && state.simStationsComplete.every(Boolean)) {
    unlocked.push('lab_champ');
  }

  // 3-star world check
  if (state.districtScores && state.districtScores.some(score => score !== null && score >= 9)) {
    unlocked.push('district_champ');
  }

  // Centurion
  if (state.currentQuestion >= 20 || totalCorrect >= 20) {
    unlocked.push('century_scorer');
  }

  // Boss slayer
  if (state.badges?.includes('boss_slayer')) {
    unlocked.push('boss_slayer');
  }

  // Full journey
  if (state.phaseComplete && Object.values(state.phaseComplete).every(Boolean)) {
    unlocked.push('pattern_master');
  }

  return unlocked;
}
