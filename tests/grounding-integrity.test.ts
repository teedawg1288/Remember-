import { describe, expect, test } from 'bun:test';
import {
  confirmedExperienceExcerpt, quoteAppearsInQuestion,
  unsupportedPersonalAttribution, isLeadingPredictionQuestion, hasUnexplainedAcronym,
} from '../src/data/grounding';

describe('experience and attribution gates', () => {
  test('recognizes a donor described as experienced, not an unknown or negated one', () => {
    const prompt = 'I repaired my wooden staircase by sanding and painting it. I want to restore a rusty car door.';
    expect(confirmedExperienceExcerpt(prompt, 'Wooden staircase restoration')).toContain('I repaired');
    expect(confirmedExperienceExcerpt(prompt, 'Car door restoration')).toBeNull();
    expect(confirmedExperienceExcerpt('I have never repaired a wooden staircase.', 'Wooden staircase restoration')).toBeNull();
    expect(confirmedExperienceExcerpt('I fixed a vacuum cleaner. Why is my computer slow?', 'Vacuum cleaner')).toContain('vacuum cleaner');
  });

  test('quotes must actually come from the submitted question', () => {
    expect(quoteAppearsInQuestion('I fixed my stairs, then painted them.', 'I fixed my stairs')).toBe(true);
    expect(quoteAppearsInQuestion('I fixed my stairs, then painted them.', 'I fixed the rotten wood')).toBe(false);
    expect(quoteAppearsInQuestion('I fixed my stairs, then painted them.', 'stairs')).toBe(false);
  });

  test('flags hidden claims about user decisions and leading questions', () => {
    expect(unsupportedPersonalAttribution('I repaired my stairs.', 'The user treats rust like wood rot.')).toBe(true);
    expect(unsupportedPersonalAttribution('I repaired my stairs.', 'If moisture is trapped, rust can continue.')).toBe(false);
    expect(isLeadingPredictionQuestion("Don't you agree this proves it?")).toBe(true);
    expect(isLeadingPredictionQuestion('Would this change if the door were still rusting?')).toBe(false);
    expect(hasUnexplainedAcronym('The CPU cycles faster under load.')).toBe(true);
    expect(hasUnexplainedAcronym('The part may need more room to work.')).toBe(false);
  });
});
