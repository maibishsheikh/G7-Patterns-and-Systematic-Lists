// src/utils/narration.js
// Narration script builder for Patterns & Systematic Lists (Grade 7)
// Strictly matches on-screen text 1:1 with audio generation pipeline

export const say       = (text) => ({ text, style: 'statement' });
export const ask       = (text) => ({ text, style: 'question' });
export const cheer     = (text) => ({ text, style: 'celebration' });
export const emphasize = (text) => ({ text, style: 'emphasis' });
export const think     = (text) => ({ text, style: 'thinking' });
export const instruct  = (text) => ({ text, style: 'instruction' });
export const encourage = (text) => ({ text, style: 'encouragement' });

export function wonderNarration() {
  return [
    say("Welcome to Progression Quest! Let's explore number sequences, nth term rules, and systematic combinations!"),
    ask("Aanya is packing for the mission with 3 shirts and 2 pairs of shorts. Kabir thinks there are only 5 outfits because 3 plus 2 is 5. Is that true, or do we multiply?"),
    ask("And the security door numbers jump in constant steps: 4, 7, 10, 13… Can you calculate the 50th step without counting one by one?"),
    cheer("Let's investigate how sequence rules and systematic lists work!"),
  ];
}

export function storyNarration(panel) {
  const scripts = [
    [
      say("Patterns are sequences that follow a hidden rule! Meet Arithmetic, adding or subtracting the same number every time, Growing Figures, shapes that add a fixed number of tiles each step, Repeating Patterns, that cycle in a loop, and Systematic Lists, where we organise every possible outcome in careful order so nothing is missed and nothing repeats!"),
      encourage("Every pattern hides a rule — our job is to find it!"),
    ],
    [
      say("When listing outcomes, always work in the same order, for example smallest to largest, or first list to second list. Never jump around! And here's the shortcut: if there are 3 choices for the first thing and 2 choices for the second thing, the total number of combinations is 3 times 2, which is 6, not 3 plus 2!"),
      emphasize("Multiply the choices — don't add them! 3 shirts times 2 shorts equals 6 outfits."),
    ],
    [
      say("Look at staircases that rise by the same height each step, tiling patterns on a floor, ice-cream combos at a shop, and PIN codes on a lock. Every one of these hides either a growing pattern or a systematic list waiting to be counted!"),
      emphasize("A 3-digit code with 10 options per digit? That's 10 times 10 times 10, which equals 1000 codes!"),
    ],
    [
      say("Detective Time! A pattern goes 4, 9, 14, 19, and then a missing term. Each term adds 5. So the missing term is 19 plus 5, which is 24! The same detective thinking works for systematic lists too: count what you know, then use the rule to find what's missing."),
      cheer("Find the step, then add it one more time. Works every single time!"),
    ],
  ];

  return scripts[panel] || scripts[0];
}

export function simStationIntro(stationIdx) {
  const intros = [
    [
      instruct("Welcome to Station A — Sequence and Arithmetic Progression Formula Lab! Adjust the first term and common difference, and watch the sequence grow term by term using T n equals a plus n minus 1 times d!"),
    ],
    [
      instruct("Welcome to Station B — Systematic List Builder! Multiply combinations between categories and generate every possible pair in order with zero duplicates!"),
    ],
    [
      instruct("Welcome to Station C — Gap Detective! Look at the gaps between consecutive terms to find the common step and calculate the missing term!"),
    ],
    [
      instruct("Welcome to Station D — Real-World Pattern Simulator! Explore how constant-step arithmetic progressions model stadium seating, growing tile tiers, and staircases!"),
    ],
  ];

  return intros[stationIdx] || intros[0];
}

export function playQuestionNarration(questionText) {
  return [ask(questionText)];
}

export function playCorrectNarration(streak = 1) {
  if (streak >= 5) {
    return [cheer("Incredible streak! You are unstoppable! 🔥")];
  }
  if (streak >= 3) {
    return [cheer("Awesome! Three in a row! ⭐")];
  }
  return [cheer("Spot on! That's correct! 🎉")];
}

export function playWrongNarration() {
  return [think("Not quite — check the common difference, look for the step rule, and try again! 💡")];
}

export function playHint1Narration() {
  return [encourage("Here's your first hint! Look at the step added between the first two terms.")];
}

export function playHint2Narration() {
  return [encourage("Here's your final clue! Use the general term formula: Term equals start plus position minus 1 times step.")];
}

export function districtCompleteNarration() {
  return [cheer("World Complete! Spectacular job on this pattern world! 🌟")];
}

export function bossStartNarration() {
  return [emphasize("The Boss Battle begins! Answer correctly to defeat the boss and claim your badge!")];
}

export function bossWinNarration() {
  return [cheer("Victory! You defeated the boss and claimed the World Badge! 👑")];
}

export function reflectNarration() {
  return [say("Welcome to the Reflect Phase! Let's review the key pattern rules, systematic lists, and check your scorecard! 📓")];
}

export function reflectCompleteNarration() {
  return [cheer("Outstanding! You have mastered arithmetic sequences, common differences, and systematic combinations! You are a true Pattern Master! 🏆")];
}

export default {
  say,
  ask,
  cheer,
  emphasize,
  think,
  instruct,
  encourage,
  wonderNarration,
  storyNarration,
  simStationIntro,
  playQuestionNarration,
  playCorrectNarration,
  playWrongNarration,
  playHint1Narration,
  playHint2Narration,
  districtCompleteNarration,
  bossStartNarration,
  bossWinNarration,
  reflectNarration,
  reflectCompleteNarration,
};
