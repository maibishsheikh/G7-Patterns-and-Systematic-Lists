// 100 Deterministic Practice Questions across 10 Worlds (10 Questions per World)
// Patterns & Systematic Lists — Grade 7
// Every question is built from a fixed parameter table below, so the session
// content never changes between plays (fully deterministic, not random).

// ---------- Small helpers ----------

function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// Guarantees 4 distinct options: [correct, ...distractors] with collisions
// nudged deterministically so no two options are ever equal.
function uniqueOptions(correct, rawDistractors) {
  const used = new Set([correct]);
  const result = [correct];
  rawDistractors.forEach((val) => {
    let v = val;
    let guard = 0;
    while (used.has(v) && guard < 30) {
      v += 1;
      guard += 1;
    }
    used.add(v);
    result.push(v);
  });
  return result;
}

// Rotates the [correct, d1, d2, d3] array so the correct answer lands in a
// different visual slot for each question (deterministic, based on seed).
function arrange(options, seed) {
  const k = ((seed % options.length) + options.length) % options.length;
  return options.slice(k).concat(options.slice(0, k));
}

function seq(start, step, count) {
  return Array.from({ length: count }, (_, i) => start + i * step);
}

export const staticQuestionBank = {};

// =====================================================================
// WORLD 1: Spot the Next Term (simple +step sequences)
// =====================================================================
const world1Params = [
  { start: 2, step: 3 }, { start: 5, step: 4 }, { start: 1, step: 5 },
  { start: 10, step: 2 }, { start: 6, step: 6 }, { start: 3, step: 7 },
  { start: 8, step: 3 }, { start: 4, step: 8 }, { start: 9, step: 4 },
  { start: 7, step: 9 },
];

staticQuestionBank[1] = world1Params.map(({ start, step }, i) => {
  const terms = seq(start, step, 4);
  const t4 = terms[3];
  const answer = t4 + step;
  const options = arrange(uniqueOptions(answer, [t4 + step + 1, t4 + step - 1, t4]), i);
  return {
    id: `w1_q${i + 1}`, worldId: 1, difficulty: 'Easy', fact: 'next_term',
    prompt: `Look at this pattern: ${terms.join(', ')}, ___. What comes next?`,
    diagram: { type: 'sequence', terms: [...terms, '?'] },
    options, correctAnswer: answer,
    hint: `Find how much is added each time. Here, each term increases by ${step}.`,
    explanation: `Each term adds ${step}. So ${t4} + ${step} = ${answer}.`,
  };
});

// =====================================================================
// WORLD 2: Growing & Shrinking Sequences (increasing or decreasing)
// =====================================================================
const world2Params = [
  { start: 3, step: 4, dir: 'up' }, { start: 10, step: 5, dir: 'up' },
  { start: 2, step: 6, dir: 'up' }, { start: 15, step: 3, dir: 'up' },
  { start: 6, step: 7, dir: 'up' },
  { start: 50, step: 4, dir: 'down' }, { start: 40, step: 5, dir: 'down' },
  { start: 60, step: 3, dir: 'down' }, { start: 30, step: 6, dir: 'down' },
  { start: 45, step: 7, dir: 'down' },
];

staticQuestionBank[2] = world2Params.map(({ start, step, dir }, i) => {
  const signedStep = dir === 'up' ? step : -step;
  const terms = seq(start, signedStep, 4);
  const t4 = terms[3];
  const answer = t4 + signedStep;
  const options = arrange(uniqueOptions(answer, [t4 + signedStep + 1, t4 + signedStep - 1, t4]), i);
  return {
    id: `w2_q${i + 1}`, worldId: 2, difficulty: 'Easy', fact: 'next_term_signed',
    prompt: `This pattern is ${dir === 'up' ? 'growing' : 'shrinking'}: ${terms.join(', ')}, ___. Find the next term.`,
    diagram: { type: 'sequence', terms: [...terms, '?'] },
    options, correctAnswer: answer,
    hint: dir === 'up' ? `Each term adds ${step}.` : `Each term subtracts ${step}.`,
    explanation: dir === 'up'
      ? `${t4} + ${step} = ${answer}.`
      : `${t4} − ${step} = ${answer}.`,
  };
});

// =====================================================================
// WORLD 3: The Rule Detective (find the common difference)
// =====================================================================
const world3Params = [
  { start: 4, step: 3 }, { start: 7, step: 5 }, { start: 9, step: 2 },
  { start: 11, step: 6 }, { start: 3, step: 8 }, { start: 14, step: 4 },
  { start: 6, step: 9 }, { start: 13, step: 3 }, { start: 8, step: 7 },
  { start: 5, step: 10 },
];

staticQuestionBank[3] = world3Params.map(({ start, step }, i) => {
  const terms = seq(start, step, 4);
  const options = arrange(uniqueOptions(step, [step + 1, step - 1, step + 2]), i);
  return {
    id: `w3_q${i + 1}`, worldId: 3, difficulty: 'Easy-Med', fact: 'find_rule',
    prompt: `Look at this pattern: ${terms.join(', ')}. What number is added each time to get the next term?`,
    diagram: { type: 'sequence', terms },
    options, correctAnswer: step,
    hint: `Subtract any term from the term right after it.`,
    explanation: `${terms[1]} − ${terms[0]} = ${step}, and it stays the same all the way along.`,
  };
});

// =====================================================================
// WORLD 4: Position & the nth Term
// =====================================================================
const world4Params = [
  { start: 3, step: 4, pos: 6 }, { start: 5, step: 6, pos: 5 },
  { start: 2, step: 7, pos: 8 }, { start: 10, step: 3, pos: 7 },
  { start: 6, step: 5, pos: 9 }, { start: 4, step: 9, pos: 6 },
  { start: 8, step: 4, pos: 10 }, { start: 1, step: 8, pos: 7 },
  { start: 9, step: 2, pos: 11 }, { start: 7, step: 6, pos: 8 },
];

staticQuestionBank[4] = world4Params.map(({ start, step, pos }, i) => {
  const answer = start + (pos - 1) * step;
  const forgotMinusOne = start + pos * step;
  const wrongOffset = start + (pos - 2) * step;
  const forgotStart = pos * step;
  const options = arrange(uniqueOptions(answer, [forgotMinusOne, wrongOffset, forgotStart]), i);
  const first3 = seq(start, step, 3);
  return {
    id: `w4_q${i + 1}`, worldId: 4, difficulty: 'Medium', fact: 'nth_term',
    prompt: `A pattern starts at ${start} and adds ${step} each time. What is the value of the ${ordinal(pos)} term?`,
    diagram: { type: 'sequence', terms: [...first3, '...', '?'] },
    options, correctAnswer: answer,
    hint: `Term = start + (position − 1) × step = ${start} + (${pos} − 1) × ${step}.`,
    explanation: `${start} + (${pos} − 1) × ${step} = ${start} + ${(pos - 1) * step} = ${answer}.`,
  };
});

// =====================================================================
// WORLD 5: Shape & Figure Patterns (growing tile/dot figures)
// =====================================================================
const world5Params = [
  { start: 4, step: 3 }, { start: 3, step: 4 }, { start: 5, step: 2 },
  { start: 2, step: 5 }, { start: 6, step: 3 }, { start: 1, step: 6 },
  { start: 7, step: 2 }, { start: 3, step: 5 }, { start: 8, step: 3 },
  { start: 2, step: 7 },
];

staticQuestionBank[5] = world5Params.map(({ start, step }, i) => {
  const figures = seq(start, step, 4);
  const f4 = figures[3];
  const answer = f4 + step;
  const options = arrange(uniqueOptions(answer, [answer + 1, answer - 1, f4]), i);
  return {
    id: `w5_q${i + 1}`, worldId: 5, difficulty: 'Medium', fact: 'figure_pattern',
    prompt: `A tile pattern grows like this — Figure 1 has ${figures[0]} tiles, Figure 2 has ${figures[1]}, Figure 3 has ${figures[2]}, Figure 4 has ${figures[3]}. How many tiles will Figure 5 have?`,
    diagram: { type: 'sequence', terms: [...figures, '?'], isFigure: true },
    options, correctAnswer: answer,
    hint: `Each new figure adds ${step} tiles to the one before it.`,
    explanation: `Figure 4 has ${f4} tiles, plus ${step} more gives Figure 5 = ${answer} tiles.`,
  };
});

// =====================================================================
// WORLD 6: Systematic Listing with Tables (2-factor multiplication)
// =====================================================================
const world6Params = [
  { a: 3, b: 2, labelA: 'ice-cream flavours', labelB: 'cone types', place: 'a dessert stall' },
  { a: 2, b: 4, labelA: 'T-shirt colours', labelB: 'shorts styles', place: 'a clothing shop' },
  { a: 4, b: 2, labelA: 'bread types', labelB: 'filling options', place: 'a sandwich bar' },
  { a: 3, b: 3, labelA: 'pizza bases', labelB: 'topping choices', place: 'a pizzeria' },
  { a: 2, b: 3, labelA: 'phone case shapes', labelB: 'colour options', place: 'a phone store' },
  { a: 5, b: 2, labelA: 'book genres', labelB: 'cover styles', place: 'a library display' },
  { a: 3, b: 4, labelA: 'salad bases', labelB: 'dressing choices', place: 'a café' },
  { a: 2, b: 5, labelA: 'wallpaper patterns', labelB: 'colour tints', place: 'a design app' },
  { a: 4, b: 3, labelA: 'game characters', labelB: 'costume skins', place: 'a video game' },
  { a: 3, b: 2, labelA: 'notebook covers', labelB: 'page styles', place: 'a stationery shop' },
];

staticQuestionBank[6] = world6Params.map(({ a, b, labelA, labelB, place }, i) => {
  const answer = a * b;
  const options = arrange(uniqueOptions(answer, [a + b, answer + a, answer - b]), i);
  return {
    id: `w6_q${i + 1}`, worldId: 6, difficulty: 'Med-Hard', fact: 'listing_2factor',
    prompt: `${place[0].toUpperCase() + place.slice(1)} offers ${a} ${labelA} and ${b} ${labelB}. If you list every combination systematically, one at a time in order, how many combinations are possible in total?`,
    diagram: { type: 'grid', rows: a, cols: b, rowLabel: 'A', colLabel: 'B' },
    options, correctAnswer: answer,
    hint: `Multiply the two choice counts — don't add them!`,
    explanation: `${a} × ${b} = ${answer}. A systematic table would have ${a} rows and ${b} columns.`,
  };
});

// =====================================================================
// WORLD 7: Tree Diagrams & Counting (3-factor multiplication)
// =====================================================================
const world7Params = [
  { a: 2, b: 3, c: 2, context: 'A sandwich shop offers {a} breads, {b} fillings, and {c} sauces.' },
  { a: 3, b: 2, c: 2, context: 'An ice-cream stall offers {a} cup sizes, {b} flavours, and {c} toppings.' },
  { a: 2, b: 2, c: 3, context: 'A door design app offers {a} paint colours, {b} handle styles, and {c} knob finishes.' },
  { a: 2, b: 4, c: 2, context: 'A bike shop offers {a} frame colours, {b} wheel types, and {c} seat styles.' },
  { a: 3, b: 3, c: 2, context: 'A burger stand offers {a} bun types, {b} patty choices, and {c} cheese options.' },
  { a: 2, b: 2, c: 4, context: 'A phone case app offers {a} case colours, {b} materials, and {c} sticker designs.' },
  { a: 3, b: 2, c: 3, context: 'A dress designer offers {a} fabrics, {b} sleeve styles, and {c} patterns.' },
  { a: 2, b: 3, c: 3, context: 'A game lets you pick {a} body types, {b} hairstyles, and {c} outfits for your avatar.' },
  { a: 4, b: 2, c: 2, context: 'A bakery offers {a} cupcake flavours, {b} frostings, and {c} toppings.' },
  { a: 2, b: 2, c: 2, context: 'You flip {a}... a coin, then another coin, then a third coin.' },
];

staticQuestionBank[7] = world7Params.map(({ a, b, c, context }, i) => {
  const answer = a * b * c;
  const text = context.replace('{a}', a).replace('{b}', b).replace('{c}', c);
  const options = arrange(uniqueOptions(answer, [a * b, b * c, answer + a]), i);
  return {
    id: `w7_q${i + 1}`, worldId: 7, difficulty: 'Med-Hard', fact: 'listing_3factor',
    prompt: `${text} Drawing a tree diagram in your head, how many different total combinations are possible?`,
    diagram: { type: 'chain', parts: [a, '×', b, '×', c, '=', '?'] },
    options, correctAnswer: answer,
    hint: `A tree diagram branches ${a} ways, then each branch splits ${b} ways, then each of those splits ${c} ways.`,
    explanation: `${a} × ${b} × ${c} = ${answer}.`,
  };
});

// =====================================================================
// WORLD 8: The Multiplication Counting Rule (unequal choice counts)
// =====================================================================
const world8Params = [
  { list: [9, 10], context: 'A padlock has 2 dials. The first can show 9 symbols and the second can show 10 symbols.' },
  { list: [10, 10, 10], context: 'A suitcase lock has 3 dials, each showing digits 0 to 9 (10 options).' },
  { list: [26, 26], context: 'An airport lounge code uses 2 letters, each from a 26-letter alphabet.' },
  { list: [5, 5, 5], context: 'A toy lock has 3 dials, each showing 5 different symbols.' },
  { list: [4, 3], context: 'A vending machine menu has 4 snack rows and 3 columns per row to choose from.' },
  { list: [10, 9], context: 'A 2-digit display shows a first digit with 10 options and a second with 9 lit options.' },
  { list: [6, 6, 6], context: 'You roll 3 dice, each with 6 faces.' },
  { list: [8, 8], context: 'You roll 2 eight-sided dice.' },
  { list: [10, 10], context: 'A 2-digit PIN uses digits 0 to 9 for each of its 2 positions.' },
  { list: [3, 3, 3, 3], context: 'A toy robot code has 4 buttons, each with 3 possible settings.' },
];

staticQuestionBank[8] = world8Params.map(({ list, context }, i) => {
  const answer = list.reduce((p, v) => p * v, 1);
  const sum = list.reduce((p, v) => p + v, 0);
  const options = arrange(uniqueOptions(answer, [sum, answer + list[0], answer - list[list.length - 1]]), i);
  return {
    id: `w8_q${i + 1}`, worldId: 8, difficulty: 'Hard', fact: 'counting_rule',
    prompt: `${context} How many different total possibilities are there?`,
    diagram: { type: 'chain', parts: list.flatMap((v, idx) => idx === 0 ? [v] : ['×', v]).concat(['=', '?']) },
    options, correctAnswer: answer,
    hint: `Multiply the number of options at every stage together.`,
    explanation: `${list.join(' × ')} = ${answer}.`,
  };
});

// =====================================================================
// WORLD 9: Arrangements Without Repeats (permutations, small n)
// =====================================================================
const world9Params = [
  { n: 3, r: 2, context: 'Using the digits 1, 2, 3 with no digit repeated, how many different 2-digit numbers can you form?' },
  { n: 4, r: 2, context: 'From 4 friends, how many ways can you pick a Captain and a Vice-Captain (2 different roles)?' },
  { n: 3, r: 3, context: 'In how many different orders can 3 runners finish a race (1st, 2nd, 3rd — no ties)?' },
  { n: 4, r: 3, context: 'From 4 medal contenders, how many ways can Gold, Silver, and Bronze be awarded?' },
  { n: 5, r: 2, context: 'Using the letters A, B, C, D, E with no repeats, how many different 2-letter codes can you form?' },
  { n: 4, r: 4, context: 'In how many different orders can 4 books be arranged in a row on a shelf?' },
  { n: 5, r: 3, context: 'From 5 sprinters, how many ways can 1st, 2nd, and 3rd place be awarded?' },
  { n: 3, r: 2, context: 'A locker uses 2 different digits chosen from 1, 2, 3 (no repeats). How many locker codes are possible?' },
  { n: 6, r: 2, context: 'From 6 students, how many ways can you choose a Team Leader and a Note-Taker (2 different roles)?' },
  { n: 5, r: 4, context: 'In how many different orders can 4 of 5 friends line up for a photo (no repeats)?' },
];

function permCount(n, r) {
  let result = 1;
  for (let i = 0; i < r; i++) result *= (n - i);
  return result;
}

staticQuestionBank[9] = world9Params.map(({ n, r, context }, i) => {
  const answer = permCount(n, r);
  const parts = [];
  for (let i = 0; i < r; i++) {
    if (i > 0) parts.push('×');
    parts.push(n - i);
  }
  parts.push('=', '?');
  const options = arrange(uniqueOptions(answer, [n * r, answer + n, Math.max(1, answer - r)]), i);
  return {
    id: `w9_q${i + 1}`, worldId: 9, difficulty: 'Hard', fact: 'permutation',
    prompt: context,
    diagram: { type: 'chain', parts },
    options, correctAnswer: answer,
    hint: `Once one item is used, it can't be used again — so the choices shrink by 1 each step.`,
    explanation: `${parts.filter((p) => p !== '=' && p !== '?' && p !== '×').join(' × ')} = ${answer}.`,
  };
});

// =====================================================================
// WORLD 10: Real-Life Pattern & Listing Challenges (capstone, hand-built)
// =====================================================================
staticQuestionBank[10] = [
  {
    id: 'w10_q1', worldId: 10, difficulty: 'Hard', fact: 'word_problem_nth',
    prompt: 'A stadium\'s rows grow by a fixed number of seats: Row 1 has 20 seats, Row 2 has 28, Row 3 has 36. How many seats are in Row 8?',
    diagram: { type: 'sequence', terms: [20, 28, 36, '...', '?'] },
    options: arrange(uniqueOptions(76, [84, 68, 56]), 0), correctAnswer: 76,
    hint: 'Step = 8 seats per row. Term = 20 + (8 − 1) × 8.',
    explanation: '20 + (8 − 1) × 8 = 20 + 56 = 76 seats.',
  },
  {
    id: 'w10_q2', worldId: 10, difficulty: 'Hard', fact: 'word_problem_listing',
    prompt: 'A café menu has 4 mains, 3 sides, and 2 drinks. Using a systematic list, how many complete 3-course meals can be made?',
    diagram: { type: 'chain', parts: [4, '×', 3, '×', 2, '=', '?'] },
    options: arrange(uniqueOptions(24, [9, 28, 20]), 1), correctAnswer: 24,
    hint: 'Multiply all three choice counts together.',
    explanation: '4 × 3 × 2 = 24 possible meals.',
  },
  {
    id: 'w10_q3', worldId: 10, difficulty: 'Hard', fact: 'word_problem_nth',
    prompt: 'A savings jar starts with $15 and gains a fixed amount every week: $15, $23, $31, $39. How much will be in the jar after 12 weeks (the 12th term)?',
    diagram: { type: 'sequence', terms: [15, 23, 31, '...', '?'] },
    options: arrange(uniqueOptions(103, [111, 95, 128]), 2), correctAnswer: 103,
    hint: 'Step = $8. Term = 15 + (12 − 1) × 8.',
    explanation: '15 + (12 − 1) × 8 = 15 + 88 = $103.',
  },
  {
    id: 'w10_q4', worldId: 10, difficulty: 'Hard', fact: 'word_problem_permutation',
    prompt: 'A password uses 3 different letters chosen from A, B, C, D, E (no letter repeated). How many different passwords are possible?',
    diagram: { type: 'chain', parts: [5, '×', 4, '×', 3, '=', '?'] },
    options: arrange(uniqueOptions(60, [15, 125, 20]), 3), correctAnswer: 60,
    hint: 'Once a letter is used, there is one fewer option for the next spot: 5 × 4 × 3.',
    explanation: '5 × 4 × 3 = 60 passwords.',
  },
  {
    id: 'w10_q5', worldId: 10, difficulty: 'Hard', fact: 'word_problem_figure',
    prompt: 'A staircase pattern of tiles grows: Step 1 uses 5 tiles, Step 2 uses 9, Step 3 uses 13. How many tiles will Step 6 use?',
    diagram: { type: 'sequence', terms: [5, 9, 13, '...', '?'], isFigure: true },
    options: arrange(uniqueOptions(25, [29, 21, 17]), 4), correctAnswer: 25,
    hint: 'Step size = 4 tiles. Term = 5 + (6 − 1) × 4.',
    explanation: '5 + (6 − 1) × 4 = 5 + 20 = 25 tiles.',
  },
  {
    id: 'w10_q6', worldId: 10, difficulty: 'Hard', fact: 'word_problem_listing',
    prompt: 'A theme park wristband can be 1 of 6 colours, paired with 1 of 4 charm designs. A systematic list is being made of every colour-charm pair. How many pairs are on the list in total?',
    diagram: { type: 'grid', rows: 6, cols: 4, rowLabel: 'Colours', colLabel: 'Charms' },
    options: arrange(uniqueOptions(24, [10, 28, 20]), 5), correctAnswer: 24,
    hint: 'Multiply the number of colours by the number of charms.',
    explanation: '6 × 4 = 24 colour-charm pairs.',
  },
  {
    id: 'w10_q7', worldId: 10, difficulty: 'Hard', fact: 'word_problem_nth',
    prompt: 'A ladder\'s rungs are spaced evenly: rung 1 is at 30cm, rung 2 at 55cm, rung 3 at 80cm. At what height is rung 9?',
    diagram: { type: 'sequence', terms: [30, 55, 80, '...', '?'] },
    options: arrange(uniqueOptions(230, [255, 205, 280]), 6), correctAnswer: 230,
    hint: 'Step = 25cm. Term = 30 + (9 − 1) × 25.',
    explanation: '30 + (9 − 1) × 25 = 30 + 200 = 230cm.',
  },
  {
    id: 'w10_q8', worldId: 10, difficulty: 'Hard', fact: 'word_problem_permutation',
    prompt: 'A relay team of 4 sprinters must run in some order, and the coach wants to try every possible running order (no repeats). How many orders are there to list?',
    diagram: { type: 'chain', parts: [4, '×', 3, '×', 2, '×', 1, '=', '?'] },
    options: arrange(uniqueOptions(24, [16, 10, 12]), 7), correctAnswer: 24,
    hint: '4 choices for 1st, then 3 left for 2nd, then 2, then 1.',
    explanation: '4 × 3 × 2 × 1 = 24 possible running orders.',
  },
  {
    id: 'w10_q9', worldId: 10, difficulty: 'Hard', fact: 'word_problem_listing',
    prompt: 'A gift shop is bundling 3 types of candles with 5 scent options and 2 box styles into a systematic gift-list. How many different gift bundles are on the list?',
    diagram: { type: 'chain', parts: [3, '×', 5, '×', 2, '=', '?'] },
    options: arrange(uniqueOptions(30, [10, 34, 25]), 8), correctAnswer: 30,
    hint: 'Multiply all three factors: candles × scents × boxes.',
    explanation: '3 × 5 × 2 = 30 gift bundles.',
  },
  {
    id: 'w10_q10', worldId: 10, difficulty: 'Hard', fact: 'word_problem_nth',
    prompt: 'A plant\'s height is measured weekly and grows by a fixed amount: Week 1 = 4cm, Week 2 = 10cm, Week 3 = 16cm. In which week will the plant first reach exactly 46cm?',
    diagram: { type: 'sequence', terms: [4, 10, 16, '...', '?'] },
    options: arrange(uniqueOptions(8, [7, 9, 6]), 9), correctAnswer: 8,
    hint: 'Step = 6cm. Solve 4 + (n − 1) × 6 = 46 for n.',
    explanation: '4 + (n − 1) × 6 = 46 → (n − 1) × 6 = 42 → n − 1 = 7 → n = 8 (Week 8).',
  },
];

export const DISTRICTS = [
  { id: 0, name: 'Spot the Next Term', icon: '🔢', boss: { name: 'Sequence Sprite', emoji: '👾', reward: 'Pattern Scout Badge 🔢' } },
  { id: 1, name: 'Growing & Shrinking', icon: '📈', boss: { name: 'Delta Dragon', emoji: '🐉', reward: 'Delta Master Badge 📈' } },
  { id: 2, name: 'The Rule Detective', icon: '🕵️', boss: { name: 'Rule Master', emoji: '🕵️', reward: 'Detective Crown 🕵️' } },
  { id: 3, name: 'Position & nth Term', icon: '🎯', boss: { name: 'Formula Phantom', emoji: '👻', reward: 'Formula Wizard Badge 🎯' } },
  { id: 4, name: 'Shape & Figures', icon: '🧱', boss: { name: 'Tile Titan', emoji: '🗿', reward: 'Geometry Guru Badge 🧱' } },
  { id: 5, name: 'Listing with Tables', icon: '📋', boss: { name: 'Grid Guardian', emoji: '🛡️', reward: 'Table Tactician Badge 📋' } },
  { id: 6, name: 'Tree Diagrams', icon: '🌳', boss: { name: 'Branching Baron', emoji: '🌲', reward: 'Tree Tracker Badge 🌳' } },
  { id: 7, name: 'Multiplication Rule', icon: '✖️', boss: { name: 'Combinations King', emoji: '👑', reward: 'Multiplier Champ Badge ✖️' } },
  { id: 8, name: 'Without Repeats', icon: '🔀', boss: { name: 'Permutation Prince', emoji: '🎩', reward: 'Permutation Pro Badge 🔀' } },
  { id: 9, name: 'Grand Challenges', icon: '🏆', boss: { name: 'Grand Archon', emoji: '⚡', reward: 'Grand Master Trophy 🏆' } },
];

export const RAW_QUESTIONS = [];
for (let w = 1; w <= 10; w++) {
  if (staticQuestionBank[w]) {
    staticQuestionBank[w].forEach((q) => {
      RAW_QUESTIONS.push({
        ...q,
        districtId: w - 1,
        questionText: q.prompt,
        hint1: q.hint,
        hint2: q.explanation,
        category: DISTRICTS[w - 1]?.name || 'PATTERNS & LISTS',
      });
    });
  }
}

export const questionBank = RAW_QUESTIONS;

export function buildWorldSession(worldId, sessionSize = 10) {
  const worldQuestions = staticQuestionBank[worldId] || staticQuestionBank[1];
  return [...worldQuestions].slice(0, sessionSize);
}

export function generateQuestionForWorld(worldId) {
  const worldQuestions = staticQuestionBank[worldId] || staticQuestionBank[1];
  return worldQuestions[0];
}

export default questionBank;

