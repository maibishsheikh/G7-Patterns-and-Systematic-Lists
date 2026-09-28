# Patterns & Systematic Lists — Grade 7 Gamified Math Module

Same architecture, UI/UX, viewport, and gamified 5-stage flow (Wonder → Story →
Simulate → Practice → Reflect) as the original "Angles Around a Point"
module, rebuilt for a new topic: **number/figure patterns** and
**systematic listing / counting**.

## Getting started

```bash
npm install
npm run dev
```

## Voice narration (ElevenLabs)

Exactly like the original pipeline, narration audio is **pre-generated
offline** and played back as static `.mp3` files (see
`src/utils/audio.js` + `src/utils/audioMap.js`). This repo ships with the
code for that pipeline, but **no `.mp3` files** — generating audio requires
an internet connection, which this build environment didn't have.

To generate the narration audio yourself:

1. Add your ElevenLabs key to a `.env.local` file (recommended — don't commit
   real keys to source control):
   ```
   ELEVENLABS_API_KEY=sk_your_key_here
   ```
   A fallback key is already wired into `scripts/generate_audio.js` for
   convenience, but pulling it from the environment is safer for anything
   beyond local/offline use, especially since `audioMap.js` and any client
   fallback are visible to anyone who opens the app.
2. Run the generator:
   ```bash
   node scripts/generate_audio.js
   ```
   This creates `public/assets/audio/*.mp3` for every line in
   `src/data/narration.js` and rewrites `src/utils/audioMap.js` to point at
   them.

Only the ~30 "core script" lines (station intros, feedback lines, story
slides, reflect Q&A) get pre-generated audio — the 100 individual practice
questions stay silent (visual-only), exactly like the original module.

## What changed vs. the original module

- **Content**: all 10 practice worlds, 100 questions, 4 story slides, 4
  simulate stations, and 6 reflect topics are new, covering number/figure
  patterns, the nth-term formula, and systematic listing/counting
  (tables, tree diagrams, the multiplication counting rule, permutations).
- **New interactive components** (same visual language & cosmic theme):
  - `SequenceRig` — build a growing pattern by adjusting start value & step
    (replaces the angle-dragging rig)
  - `ListingGrid` — reveal a systematic list of combinations in order
    (replaces the protractor overlay)
  - `PatternDiagramSVG` — sequence / chain / grid diagrams for questions
    (replaces the angle diagram renderer)
- **Unchanged**: overall app shell, stage flow, store/progress logic, audio
  engine, color system, typography, and layout.
