import { describe, expect, test } from 'bun:test';
import { CURATED_STORIES } from '../src/data/curatedStories';
import { getRosettaStoneForAnalysis } from '../src/data/curatedRosettaStones';

describe('Suggested situation stays within its own context', () => {
  for (const demo of CURATED_STORIES) {
    test(`${demo.id} has its own translation`, () => {
      const translation = getRosettaStoneForAnalysis(demo);
      expect(translation).toBeDefined();
      expect(translation?.translations.length).toBeGreaterThan(0);
      expect(translation?.lifeLenses.length).toBeGreaterThan(0);
    });
  }

  test('the parent/candy situation never imports the unanswered-text example', () => {
    const demo = CURATED_STORIES.find((story) => story.id === 'parent-giving-in');
    expect(demo).toBeDefined();
    const text = JSON.stringify(getRosettaStoneForAnalysis(demo!)).toLowerCase();
    expect(text).toContain('candy');
    expect(text).toContain('parent');
    expect(text).not.toContain('unanswered text');
    expect(text).not.toContain('missing text');
    expect(text).not.toContain('read receipt');
  });

  test('a user-modified situation cannot inherit demo translations by ID', () => {
    const demo = CURATED_STORIES.find((story) => story.id === 'parent-giving-in');
    expect(demo).toBeDefined();
    expect(getRosettaStoneForAnalysis({
      ...demo!,
      userOriginalInput: 'My actual situation is different from the demo.',
    })).toBeUndefined();
  });
});
