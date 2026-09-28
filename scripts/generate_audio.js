import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { staticQuestionBank } from '../src/data/questionBank.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ELEVENLABS_API_KEY = "sk_1477a0b0a31e89b834b1e17ca4468c02a6e8bf554f621c5a";
const VOICE_ID = "Xb7hH8MSUJpSbSDYk0k2"; // Alice voice ID

function sanitizePhonetics(text) {
  if (!text) return "";
  return text
    .replace(/___/g, " missing term ")
    .replace(/\bcm\b/gi, " centimeters")
    .replace(/\$/g, " dollars ")
    .replace(/×/g, " times ")
    .replace(/÷/g, " divided by ")
    .replace(/\+/g, " plus ")
    .replace(/−/g, " minus ")
    .replace(/=/g, " equals ")
    .replace(/\s+/g, " ")
    .trim();
}

const coreScript = {
  home_intro: "Welcome to Patterns and Systematic Lists! Ready to crack the rule behind any sequence, and list every single possibility without missing one? Let's roll!",
  wonder_prompt: "Robo is packing for a trip. Alex has 3 t-shirts and 2 pairs of shorts, and says: There are only 5 outfits I can make, because 3 plus 2 is 5. Is that actually true? And Robo notices the staircase outside grows by 2 steps every floor: 2, 4, 6, 8... will it ever land exactly on 25 steps?",
  wonder_teaser: "What if Alex packed one more t-shirt? How many outfits would that unlock?",

  story_slide_1: "Slide 1: Meet the Pattern Family! Patterns are sequences that follow a hidden rule. Meet Arithmetic, adding or subtracting the same number every time. Growing Figures, shapes that add a fixed number of tiles each step. Repeating patterns, that cycle in a loop. And Systematic Lists, where we organise every possible outcome in careful order so nothing is missed and nothing repeats!",
  story_slide_2: "Slide 2: The Golden Rule of Systematic Listing! When listing outcomes, always work in the same order, for example smallest to largest, or first list to second list. Never jump around. And here's the shortcut: if there are 3 choices for the first thing and 2 choices for the second thing, the total number of combinations is 3 times 2, which is 6, not 3 plus 2!",
  story_slide_3: "Slide 3: Real World Pattern Powers! Look at staircases that rise by the same height each step, tiling patterns on a floor, ice cream combos at a shop, and PIN codes on a lock. Every one of these hides either a growing pattern or a systematic list waiting to be counted!",
  story_slide_4: "Slide 4: Finding the Missing Term! Detective Time! A pattern goes 4, 9, 14, 19, and then a missing term. Each term adds 5. So the missing term is 19 plus 5, which is 24! The same detective thinking works for systematic lists too: count what you know, then use the rule to find what's missing.",

  station_a_intro: "Welcome to the Pattern Lab! Adjust the starting number and the step size, and watch the sequence grow term by term. Can you build the target pattern shown on screen?",
  station_b_intro: "Station B: Systematic List Builder! Tap through the grid in order, row by row, to list every combination between two lists. Watch the total update as you go — it always equals rows times columns!",
  station_c_intro: "Station C: Pattern Detective! Use the step rule to work out the missing term hiding in each sequence.",
  station_d_intro: "Station D: Real-World Pattern Lab! Explore how constant-step patterns show up in staircases, stadium seating, tiling floors, and savings jars!",

  practice_welcome: "Choose your world on the map! Beat each world to unlock the next. Earn stars and XP!",
  correct_cheer: "Awesome job! You got it right!",
  incorrect_try_again: "Not quite. Look for the rule between the terms, or multiply the choices at each stage!",
  out_of_hearts: "Oh no! Out of hearts! Don't worry, try again to master this world!",
  world_complete: "Congratulations! You completed the world and earned new stars!",

  reflect_intro: "Your Performance! Amazing work! Let's reflect on what you learned.",
  reflect_q1: "What is a number pattern, and what do we call the fixed amount added each time?",
  reflect_a1: "A number pattern is a sequence of numbers that follows a rule. The fixed amount added or subtracted each time is called the common difference, or the step.",
  reflect_q2: "What is the golden rule for finding the total in a systematic list?",
  reflect_a2: "Multiply the number of choices at each stage! If there are 3 choices for one thing and 2 for another, the total is 3 times 2, which is 6.",
  reflect_q3: "How do you find a missing term in the middle or end of a sequence?",
  reflect_a3: "Find the common difference from the terms you know, then add or subtract that step to reach the missing term!",
  reflect_q4: "How do you find the value at any position, like the 10th term, without listing every term?",
  reflect_a4: "Use the formula: Term = start + (position minus 1) times step. Plug in the position you need!",
  reflect_q5: "Where can you see patterns and systematic lists in real life?",
  reflect_a5: "Staircases, stadium seating, tiling floors, savings that grow each week, ice-cream flavour combos, and PIN or padlock codes!",
  reflect_q6: "Why must we list outcomes in the same order every time instead of jumping around?",
  reflect_a6: "Working in a fixed order, like smallest to largest, makes sure we never repeat an outcome and never accidentally skip one!"
};

async function generateAudio(text, filename, retries = 3) {
  const outputDir = path.join(__dirname, '../public/assets/audio');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const cleanText = sanitizePhonetics(text);
  const outputPath = path.join(outputDir, filename);

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY
        },
        body: JSON.stringify({
          text: cleanText,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`ElevenLabs API Error (${response.status}): ${errText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(outputPath, buffer);
      return `/assets/audio/${filename}`;
    } catch (err) {
      if (attempt === retries) throw err;
      console.warn(`⚠️ Attempt ${attempt} failed for ${filename}: ${err.message}. Retrying...`);
      await new Promise((r) => setTimeout(r, 1000 * attempt));
    }
  }
}

async function run() {
  console.log("🎙️ Preparing Audio Assets Generation for Patterns & Systematic Lists...");

  const fullNarrationScript = { ...coreScript };

  // Add all 100 questions + 100 hints across all 10 worlds
  for (let w = 1; w <= 10; w++) {
    const qList = staticQuestionBank[w] || [];
    qList.forEach((q, idx) => {
      const qNum = idx + 1;
      const promptKey = `w${w}_q${qNum}_prompt`;
      const hintKey = `w${w}_q${qNum}_hint`;
      fullNarrationScript[promptKey] = q.prompt;
      fullNarrationScript[hintKey] = q.hint;
    });
  }

  const outputDir = path.join(__dirname, '../public/assets/audio');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const entries = Object.entries(fullNarrationScript);
  console.log(`📋 Total audio assets to generate: ${entries.length}`);

  const audioMapData = {};
  let successCount = 0;
  let failCount = 0;

  // Process in batches of 4 for speed while staying safe with rate limits
  const BATCH_SIZE = 4;
  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async ([key, text]) => {
        const filename = `${key}.mp3`;
        try {
          const audioUrl = await generateAudio(text, filename);
          audioMapData[text] = audioUrl;
          audioMapData[`key:${key}`] = audioUrl;
          successCount++;
          console.log(`[${successCount}/${entries.length}] ✅ Generated: ${filename}`);
        } catch (e) {
          failCount++;
          console.error(`❌ Failed to generate audio for key [${key}]:`, e.message);
        }
      })
    );
    // Brief delay between batches
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log("💾 Writing updated audioMap.js and narration.js...");

  const mapFilePath = path.join(__dirname, '../src/utils/audioMap.js');
  const codeContent = `// Auto-generated Audio Asset Map\nexport const audioMap = ${JSON.stringify(audioMapData, null, 2)};\nexport default audioMap;\n`;
  fs.writeFileSync(mapFilePath, codeContent, 'utf-8');

  const narrationFilePath = path.join(__dirname, '../src/data/narration.js');
  const narrationContent = `// Auto-generated Narration Script Dictionary\nexport const narrationScript = ${JSON.stringify(fullNarrationScript, null, 2)};\nexport default narrationScript;\n`;
  fs.writeFileSync(narrationFilePath, narrationContent, 'utf-8');

  console.log(`🎉 Audio Generation Completed! Successfully generated ${successCount}/${entries.length} audio files (${failCount} failed).`);
}

run();
