// src/utils/shuffle.js
// Question set generator for deterministic session ordering

export function generateSessionQuestions(bank) {
  if (Array.isArray(bank)) {
    return [...bank];
  }
  if (bank && typeof bank === 'object') {
    const list = [];
    for (let w = 1; w <= 10; w++) {
      if (bank[w]) list.push(...bank[w]);
    }
    return list;
  }
  return [];
}
