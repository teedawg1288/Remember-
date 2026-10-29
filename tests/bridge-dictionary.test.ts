import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { bridgeDictionary, findBridgeWord } from '../src/data/bridgeDictionary';
import { getWordOrigin } from '../src/data/wordOrigins';

describe('WORDS starter dictionary', () => {
  test('contains 103 unique, searchable words with at least two meanings', () => {
    expect(bridgeDictionary).toHaveLength(103);
    expect(new Set(bridgeDictionary.map((entry) => entry.word.toLowerCase())).size).toBe(103);
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
    expect(findBridgeWord('Mother')?.senses.length).toBeGreaterThanOrEqual(2);
    expect(findBridgeWord('Earth')?.senses.length).toBeGreaterThanOrEqual(2);
    expect(findBridgeWord('Matrix')?.senses.length).toBeGreaterThanOrEqual(2);
  });

  test('separates etymology from conceptual association with evidence', () => {
    expect(getWordOrigin(' MOTHER ')?.kind).toBe('word-family-and-metaphor');
    expect(getWordOrigin('earth')?.kind).toBe('conceptual-association');
    expect(getWordOrigin('matrix')?.kind).toBe('linguistic-origin');
    for (const word of ['Mother', 'Earth', 'Matrix']) {
      const note = getWordOrigin(word);
      expect(note?.wordHistory.length).toBeGreaterThan(40);
      expect(note?.whyUsed.length).toBeGreaterThan(40);
      expect(note?.caution.length).toBeGreaterThan(40);
      expect(note?.sources.length).toBeGreaterThan(0);
      expect(note?.sources.every((source) => source.url.startsWith('https://'))).toBe(true);
    }
    expect(getWordOrigin('no-evidence')).toBeUndefined();
  });

  test('remains separate from private discovery prompts and asks for live analysis', () => {
    const app = readFileSync('src/App.tsx', 'utf8');
    const header = readFileSync('src/components/Header.tsx', 'utf8');
    const page = readFileSync('src/components/BridgeDictionaryPage.tsx', 'utf8');
    expect(header).toContain("onMainTabChange('words')");
    expect(app).toContain('<BridgeDictionaryPage');
    expect(app).toContain('handleAnalyze(');
    expect(page).toContain('not proof of a shared cause');
    expect(page).toContain('Where the meaning came from');
    expect(app).toContain('linguistic ancestry from metaphor');
    expect(page).toContain('not an automatically verified dictionary entry');
    expect(page).not.toContain('coreDiscoveryPrompt');
  });
});
