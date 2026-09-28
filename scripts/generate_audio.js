// scripts/generate_audio.js
// Offline pre-generation script for ElevenLabs narration audio files.
// Strictly follows audio_generation_pipeline (5).md specifications.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to read environment variables from .env.local without external dependencies
function loadEnv() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    const fullPath = path.resolve(file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [key, ...rest] = trimmed.split('=');
          const val = rest.join('=').replace(/^["']|["']$/g, '').trim();
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = val;
          }
        }
      }
    }
  }
}

loadEnv();

const apiKey = process.env.VITE_ELEVENLABS_API_KEY || process.env.ELEVENLABS_API_KEY;
if (!apiKey) {
  console.error("\n❌ Error: VITE_ELEVENLABS_API_KEY is not defined in .env.local or .env.");
  console.log("Please create a .env.local file with: VITE_ELEVENLABS_API_KEY=your_key_here\n");
  process.exit(1);
}

const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice — Clear, Engaging Educator
const VOICE_MODEL = 'eleven_multilingual_v2';

const VOICE_SETTINGS = {
  statement:     { stability: 0.65, similarity_boost: 0.85, style: 0.00, use_speaker_boost: true },
  instruction:   { stability: 0.65, similarity_boost: 0.85, style: 0.00, use_speaker_boost: true },
  question:      { stability: 0.50, similarity_boost: 0.80, style: 0.20, use_speaker_boost: true },
  encouragement: { stability: 0.40, similarity_boost: 0.85, style: 0.35, use_speaker_boost: true },
  emphasis:      { stability: 0.70, similarity_boost: 0.90, style: 0.10, use_speaker_boost: true },
  thinking:      { stability: 0.55, similarity_boost: 0.75, style: 0.15, use_speaker_boost: true },
  celebration:   { stability: 0.35, similarity_boost: 0.85, style: 0.45, use_speaker_boost: true },
};

const phrases = [
  // ─── INTRO ────────────────────────────────────────────────────────────────
  { text: "Welcome to Progression Quest! Let's explore number sequences, nth term rules, and systematic combinations!", style: 'celebration' },

  // ─── WONDER PHASE ────────────────────────────────────────────────────────
  { text: "Aanya is packing for the mission with 3 shirts and 2 pairs of shorts. Kabir thinks there are only 5 outfits because 3 plus 2 is 5. Is that true, or do we multiply?", style: 'question' },
  { text: "And the security door numbers jump in constant steps: 4, 7, 10, 13… Can you calculate the 50th step without counting one by one?", style: 'question' },
  { text: "What do you think? Does combining 3 shirts and 2 shorts add or multiply? Vote to test your intuition! 🤔", style: 'thinking' },
  { text: "✨ Spot on! Every 1 shirt pairs with 2 shorts: 3 × 2 = 6 combinations! That's the Fundamental Counting Principle!", style: 'celebration' },
  { text: "🤔 Kabir thought so too! But if each shirt gets paired with BOTH pairs of shorts, we multiply: 3 × 2 = 6! Let's prove it!", style: 'thinking' },
  { text: "Let's investigate how sequence rules and systematic lists work!", style: 'celebration' },

  // ─── STORY PHASE: PANEL 1 ────────────────────────────────────────────────
  { text: "Patterns are sequences that follow a hidden rule! Meet Arithmetic, adding or subtracting the same number every time, Growing Figures, shapes that add a fixed number of tiles each step, Repeating Patterns, that cycle in a loop, and Systematic Lists, where we organise every possible outcome in careful order so nothing is missed and nothing repeats!", style: 'statement' },
  { text: "Every pattern hides a rule — our job is to find it!", style: 'encouragement' },

  // ─── STORY PHASE: PANEL 2 ────────────────────────────────────────────────
  { text: "When listing outcomes, always work in the same order, for example smallest to largest, or first list to second list. Never jump around! And here's the shortcut: if there are 3 choices for the first thing and 2 choices for the second thing, the total number of combinations is 3 times 2, which is 6, not 3 plus 2!", style: 'statement' },
  { text: "Multiply the choices — don't add them! 3 shirts times 2 shorts equals 6 outfits.", style: 'emphasis' },

  // ─── STORY PHASE: PANEL 3 ────────────────────────────────────────────────
  { text: "Look at staircases that rise by the same height each step, tiling patterns on a floor, ice-cream combos at a shop, and PIN codes on a lock. Every one of these hides either a growing pattern or a systematic list waiting to be counted!", style: 'statement' },
  { text: "A 3-digit code with 10 options per digit? That's 10 times 10 times 10, which equals 1000 codes!", style: 'emphasis' },

  // ─── STORY PHASE: PANEL 4 ────────────────────────────────────────────────
  { text: "Detective Time! A pattern goes 4, 9, 14, 19, and then a missing term. Each term adds 5. So the missing term is 19 plus 5, which is 24! The same detective thinking works for systematic lists too: count what you know, then use the rule to find what's missing.", style: 'statement' },
  { text: "Find the step, then add it one more time. Works every single time!", style: 'celebration' },

  // ─── SIMULATE STATION INTROS ─────────────────────────────────────────────
  { text: "Welcome to Station A — Sequence and Arithmetic Progression Formula Lab! Adjust the first term and common difference, and watch the sequence grow term by term using T n equals a plus n minus 1 times d!", style: 'instruction' },
  { text: "Welcome to Station B — Systematic List Builder! Multiply combinations between categories and generate every possible pair in order with zero duplicates!", style: 'instruction' },
  { text: "Welcome to Station C — Gap Detective! Look at the gaps between consecutive terms to find the common step and calculate the missing term!", style: 'instruction' },
  { text: "Welcome to Station D — Real-World Pattern Simulator! Explore how constant-step arithmetic progressions model stadium seating, growing tile tiers, and staircases!", style: 'instruction' },

  // ─── FEEDBACK & HINTS ────────────────────────────────────────────────────
  { text: "Spot on! That's correct! 🎉", style: 'celebration' },
  { text: "Awesome! Three in a row! ⭐", style: 'celebration' },
  { text: "Incredible streak! You are unstoppable! 🔥", style: 'celebration' },
  { text: "Not quite — check the common difference, look for the step rule, and try again! 💡", style: 'thinking' },
  { text: "Here's your first hint! Look at the step added between the first two terms.", style: 'encouragement' },
  { text: "Here's your final clue! Use the general term formula: Term equals start plus position minus 1 times step.", style: 'encouragement' },

  // ─── DISTRICT & BOSS BATTLES ─────────────────────────────────────────────
  { text: "Choose your world on the map! Beat each world to unlock the next. Earn stars and XP!", style: 'instruction' },
  { text: "World Complete! Spectacular job on this pattern world! 🌟", style: 'celebration' },
  { text: "The Boss Battle begins! Answer correctly to defeat the boss and claim your badge!", style: 'emphasis' },
  { text: "Victory! You defeated the boss and claimed the World Badge! 👑", style: 'celebration' },
  { text: "Oh no! Out of hearts! Don't worry, try again to master this world!", style: 'encouragement' },

  // ─── REFLECT PHASE ───────────────────────────────────────────────────────
  { text: "Welcome to the Reflect Phase! Let's review the key pattern rules, systematic lists, and check your scorecard! 📓", style: 'statement' },
  { text: "Outstanding! You have mastered arithmetic sequences, common differences, and systematic combinations! You are a true Pattern Master! 🏆", style: 'celebration' },
];

const outputDir = path.resolve('public/assets/audio');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function cleanString(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 45).replace(/_+/g, '_').replace(/^_|_$/g, '');
}

async function main() {
  console.log(`\n🎙️ Starting ElevenLabs Audio Generation Pipeline`);
  console.log(`Voice ID: ${VOICE_ID} | Model: ${VOICE_MODEL}`);
  console.log(`Total phrases to process: ${phrases.length}\n`);

  // Load existing audioMap if available to preserve previous mappings
  let mapping = {};
  const mapFilePath = path.resolve('src/utils/audioMap.js');
  if (fs.existsSync(mapFilePath)) {
    try {
      const existing = fs.readFileSync(mapFilePath, 'utf-8');
      const match = existing.match(/export const audioMap = ({[\s\S]*?});/);
      if (match) {
        mapping = JSON.parse(match[1]);
      }
    } catch {
      mapping = {};
    }
  }

  for (let i = 0; i < phrases.length; i++) {
    const { text, style } = phrases[i];
    const cleanText = cleanString(text);
    const fileName = `audio_${cleanText}_${i}.mp3`;
    const destPath = path.join(outputDir, fileName);

    const relativeWebPath = `/assets/audio/${fileName}`;
    mapping[text] = relativeWebPath;
    mapping[text.trim()] = relativeWebPath;

    if (fs.existsSync(destPath)) {
      console.log(`[${i + 1}/${phrases.length}] ⏩ Skipped (already exists): ${fileName}`);
      continue;
    }

    console.log(`[${i + 1}/${phrases.length}] 🔊 Generating: "${text.substring(0, 40)}..." -> ${fileName}`);

    const settings = VOICE_SETTINGS[style] || VOICE_SETTINGS.statement;

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: VOICE_MODEL,
          voice_settings: settings,
        }),
      });

      if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`HTTP ${response.status}: ${errBody}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(destPath, buffer);
      console.log(`   ✅ Saved: ${fileName}`);
    } catch (e) {
      console.error(`   ❌ Failed to generate phrase "${text}":`, e.message);
    }
    // Brief sleep to respect ElevenLabs rate limits
    await new Promise(r => setTimeout(r, 250));
  }

  // Write mapping to src/utils/audioMap.js
  const mapContent = `// Auto-generated by generate_audio.js\n// Static asset mapping for offline generated narration phrases in Progression Quest\n\nexport const audioMap = ${JSON.stringify(mapping, null, 2)};\n\nexport default audioMap;\n`;
  fs.writeFileSync(mapFilePath, mapContent);
  console.log("\n✨ Audio mapping updated in src/utils/audioMap.js!");
  console.log("🎉 Audio generation script execution completed!\n");
}

main().catch(console.error);
