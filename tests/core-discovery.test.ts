import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { parseCoreDiscovery } from '../src/data/discoveryContract';
import { discoveryToSavedResult } from '../src/data/discoveryAdapter';
import { buildCoreDiscoveryPrompt } from '../src/data/coreDiscoveryPrompt';

const question = 'Why do longer explanations sometimes make a point harder to understand?';
const bridge = {
  originalDomain: 'Human communication',
  originalSystem: 'Explaining a point',
  comparisonDomain: 'Computer networking',
  comparisonSystem: 'A receiving buffer',
  possibleSharedMechanism: 'Input can exceed processing capacity.',
  stages: [
    { label: 'Input', inOriginal: 'Spoken words', inComparison: 'Data packets', sharedFunction: 'Incoming information', importantDifference: 'Human words carry social meaning.' },
    { label: 'Constraint', inOriginal: 'Limited attention', inComparison: 'Finite buffer', sharedFunction: 'Processing capacity', importantDifference: 'Human attention changes with context.' },
    { label: 'Outcome', inOriginal: 'Possible misunderstanding', inComparison: 'Possible dropped packets', sharedFunction: 'Loss under excess demand', importantDifference: 'Machines follow specified protocols.' },
  ],
  whatMightTransfer: 'Pause and confirm reception before adding more information.',
  whereItBreaks: 'Human interpretation is not machine packet handling.',
  howToChallenge: 'Ask what the listener understood before adding more detail.',
};
const sample = {
  whatIsReported: 'The question asks about difficulty understanding long explanations, not a witnessed event.',
  possibleMechanism: 'Increasing input may outpace attention, but other causes are possible.',
  alternativeExplanations: ['The words may be ambiguous.', 'The listener may lack relevant context.'],
  bridges: [bridge],
  missingInformation: 'What did the listener actually understand?',
  nextCheck: 'Ask them to explain the point in their own words.',
  meaningCheck: null,
};

describe('REMEMBER core discovery contract', () => {
  test('preserves exact submitted wording, validates functional stages and never invents history', () => {
    const core = parseCoreDiscovery({ ...sample, question: 'An unrelated prompt' }, question);
    expect(core.question).toBe(question);
    expect(core.version).toBe(2);
    expect(core.bridges).toHaveLength(1);
    const saved = discoveryToSavedResult(core);
    expect(saved.coreDiscovery?.question).toBe(question);
    expect(saved.stories).toEqual([]);
    expect(saved.deepResearch.peerReviewedReferences).toEqual([]);
    expect(saved.prediction).toBeUndefined();
    expect(saved.roundTable).toBeUndefined();
    expect(saved.mirrorEffect).toBeUndefined();
  });

  test('does not pretend a same-domain association is cross-system', () => {
    const core = parseCoreDiscovery({ ...sample, bridges: [{ ...bridge, comparisonDomain: bridge.originalDomain }] }, question);
    expect(core.bridges).toHaveLength(0);
    expect(core.missingInformation).toBe(sample.missingInformation);
  });

  test('rejects incomplete causal mapping and invalid core output', () => {
    const core = parseCoreDiscovery({ ...sample, bridges: [{ ...bridge, stages: [bridge.stages[0]] }] }, question);
    expect(core.bridges).toHaveLength(0);
    expect(() => parseCoreDiscovery({ ...sample, nextCheck: '' }, question)).toThrow('INVALID_AI_RESPONSE');
  });

  test('does not backfill unreported meaning, motives or feelings', () => {
    const core = parseCoreDiscovery({ ...sample, meaningCheck: { possibleIntendedMeaning: 'Angry' } }, question);
    expect(core.meaningCheck).toBeNull();
    expect(discoveryToSavedResult(core).mirrorEffect).toBeUndefined();
  });

  test('single prompt prioritizes the mechanism bridge and separates optional features', () => {
    const prompt = buildCoreDiscoveryPrompt(question, [], []);
    expect(prompt).toContain('CORE PURPOSE');
    expect(prompt).toContain('CANDIDATE RULE');
    expect(prompt).toContain('NOT mandatory');
    expect(prompt).toContain(question);
    expect(prompt).not.toContain('secretly intended to punish');
    const app = readFileSync('src/App.tsx', 'utf-8');
    const server = readFileSync('server.ts', 'utf-8');
    expect(app).toContain("fetch('/api/discovery/analyze'");
    expect(server).toContain("app.post('/api/discovery/analyze'");
    expect(app).toContain('activeAnalysis.coreDiscovery');
  });

  test('personal learned language is only a tentative hint, never a fixed profile', () => {
    const prompt = buildCoreDiscoveryPrompt(question, [{ phrase: 'the extra mile', meaning: 'additional effort' }], []);
    expect(prompt).toContain('tentative');
    expect(prompt).toContain('Never ask the person to teach a glossary');
  });
});
