import { describe, expect, test } from 'bun:test';
import { chooseAutomaticLensWeights, normalizeLensWeights, redistributeLensWeight } from '../src/core/roundTableControl';

const seats = [
  { id: 'barber', name: 'The Barber', role: 'Human perspective' },
  { id: 'engineer', name: 'Systems Engineer', role: 'Systems' },
  { id: 'biologist', name: 'Biologist', role: 'Biology' },
  { id: 'historian', name: 'Historian', role: 'History' },
];

describe('Round Table attention routing', () => {
  test('always distributes exactly 100 percent', () => {
    for (const x of [{ a: 0, b: 0, c: 0 }, { a: 1, b: 999, c: 0 }, { a: NaN, b: -7, c: 3 }]) {
      const weights = normalizeLensWeights(x);
      expect(Object.values(weights).reduce((a, b) => a + b, 0)).toBe(100);
      expect(Object.values(weights).every(v => Number.isInteger(v) && v >= 0)).toBe(true);
    }
  });
  test('manual override keeps the selected value and redistributes the rest', () => {
    const result = redistributeLensWeight({ a: 25, b: 25, c: 25, d: 25 }, 'a', 70);
    expect(result.a).toBe(70);
    expect(Object.values(result).reduce((a, b) => a + b, 0)).toBe(100);
  });
  test('automatic routing responds to the actual question', () => {
    const biology = chooseAutomaticLensWeights('Can a cancer cell evade immune attack?', seats);
    const history = chooseAutomaticLensWeights('Why does history repeat ancient patterns?', seats);
    expect(biology.biologist).toBeGreaterThan(biology.historian);
    expect(history.historian).toBeGreaterThan(history.biologist);
  });
  test('equal weights are allowed when no signal exists', () => {
    expect(normalizeLensWeights({ a: 1, b: 1, c: 1, d: 1 })).toEqual({ a: 25, b: 25, c: 25, d: 25 });
  });
});
