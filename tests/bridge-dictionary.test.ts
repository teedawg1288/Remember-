import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { bridgeDictionary, findBridgeWord } from '../src/data/bridgeDictionary';

describe('WORDS starter dictionary', () => {
  test('contains 100 unique, searchable words with at least two meanings', () => {
    expect(bridgeDictionary).toHaveLength(100);
    expect(new Set(bridgeDictionary.map((entry) => entry.word.toLowerCase())).size).toBe(100);
    for (const entry of bridgeDictionary) {
      expect(entry.senses.length).toBeGreaterThanOrEqual(2);
      expect(entry.connection.length).toBeGreaterThan(15);
      expect(entry.difference.length).toBeGreaterThan(15);
      expect(entry.question.endsWith('?')).toBe(true);
      for (const sense of entry.senses) {
        expect(sense.field.length).toBeGreaterThan(1);
        expect(sense.meaning.length).toBeGreaterThan(5);
      }
    }
    expect(findBridgeWord('  RESISTANCE  ')?.senses.length).toBeGreaterThanOrEqual(4);
    expect(findBridgeWord('not-a-starter-word')).toBeUndefined();
  });

  test('remains separate from private discovery prompts and asks for live analysis', () => {
    const app = readFileSync('src/App.tsx', 'utf8');
    const header = readFileSync('src/components/Header.tsx', 'utf8');
    const page = readFileSync('src/components/BridgeDictionaryPage.tsx', 'utf8');
    expect(header).toContain("onMainTabChange('words')");
    expect(app).toContain('<BridgeDictionaryPage');
    expect(app).toContain('handleAnalyze(');
    expect(page).toContain('not proof of a shared cause');
    expect(page).toContain('not an automatically verified dictionary entry');
    expect(page).not.toContain('coreDiscoveryPrompt');
  });
});
