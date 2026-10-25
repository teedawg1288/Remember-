import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { parseCoreDiscovery, applyDiscoveryReview } from '../src/data/discoveryContract';
import { buildDiscoveryReviewPrompt } from '../src/data/discoveryReviewPrompt';
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

  test('does not show a guessed listener meaning when no exchange was reported', () => {
    const core = parseCoreDiscovery({
      ...sample,
      meaningCheck: {
        whatWasSaidOrObserved: 'Not reported',
        possibleIntendedMeaning: 'Maybe they wanted to explain',
        possibleUnderstoodMeaning: 'Maybe the listener was defensive',
        whatRemainsUnknown: 'Everything about that exchange',
        howToClarify: 'Ask what they heard',
      },
    }, question);
    expect(core.meaningCheck).toBeNull();
  });

  test('single prompt prioritizes the mechanism bridge and separates optional features', () => {
    const prompt = buildCoreDiscoveryPrompt(question, [], []);
    expect(prompt).toContain('CORE PURPOSE');
    expect(prompt).toContain('CANDIDATE RULE');
    expect(prompt).toContain('General questions about why people misunderstand');
    expect(prompt).toContain('Lead with the other system');
    expect(prompt).toContain('NOT mandatory');
    expect(prompt).toContain(question);
    expect(prompt).not.toContain('secretly intended to punish');
    const app = readFileSync('src/App.tsx', 'utf-8');
    const server = readFileSync('server.ts', 'utf-8');
    expect(app).toContain("fetch('/api/discovery/analyze'");
    expect(server).toContain("app.post('/api/discovery/analyze'");
    expect(server).toContain('applyDiscoveryReview(core, reviewRaw)');
    expect(app).toContain('activeAnalysis.coreDiscovery');
  });

  test('non-referential questions do not leak earlier subjects into comparisons', () => {
    const previous = 'Why did a couple argue over a text message?';
    const prompt = buildCoreDiscoveryPrompt('Why does a bridge fatigue under cycles?', [], [previous]);
    expect(prompt).not.toContain(previous);
    const followup = buildCoreDiscoveryPrompt('What about that earlier question?', [], [previous]);
    expect(followup).toContain(previous);
  });

  test('an adversarial review can accept one bridge with a falsifiable transfer', () => {
    const core = parseCoreDiscovery(sample, question);
    const screened = applyDiscoveryReview(core, {
      decision: 'accept',
      selectedIndex: 0,
      reason: 'Both systems have a limited receiving capacity and discard or misunderstand some input when overwhelmed.',
      causalMatch: 'Extra input takes capacity; when input exceeds processing capacity, some messages are lost.',
      crucialDifference: 'Human meanings and feelings are not fixed packet protocols.',
      prediction: {
        ifCondition: 'If attention is the limiting factor in this exchange',
        expectedOutcome: 'The listener should reproduce more of a shorter explanation',
        borrowedFromOtherSystem: 'A finite network buffer handles shorter bursts without dropping packets',
        whyItMayFail: 'Human resistance may come from disagreement rather than capacity',
        whatWouldDisproveIt: 'Shortening an otherwise equivalent explanation does not change the listener response',
        safeNextCheck: 'Ask the listener what they understood, with their consent',
      },
    });
    expect(screened.bridges).toHaveLength(1);
    expect(screened.prediction?.expectedOutcome).toContain('shorter explanation');
    expect(screened.prediction?.whatWouldDisproveIt).toContain('Shortening');
    expect(screened.screening?.status).toBe('accepted');
    expect(discoveryToSavedResult(screened).coreDiscovery?.prediction).toEqual(screened.prediction);
  });

  test('review rejects weak metaphors instead of promoting them as discovered facts', () => {
    const core = parseCoreDiscovery(sample, question);
    const rejected = applyDiscoveryReview(core, {
      decision: 'reject', selectedIndex: null, prediction: null,
      reason: 'This is only a shared metaphor; causal constraints differ between the two systems.',
    });
    expect(rejected.bridges).toHaveLength(0);
    expect(rejected.prediction).toBeNull();
    expect(rejected.screening?.status).toBe('rejected');
    expect(() => applyDiscoveryReview(core, {
      decision: 'accept', selectedIndex: 99, reason: 'Select an unrelated system',
    })).toThrow('INVALID_AI_RESPONSE');
  });

  test('no prediction is promoted when the review cannot supply a disproof', () => {
    const core = parseCoreDiscovery(sample, question);
    const result = applyDiscoveryReview(core, {
      decision: 'accept', selectedIndex: 0,
      reason: 'Both systems have bounded input capacity.',
      causalMatch: 'Input consumes a finite buffer and overload loses content.',
      crucialDifference: 'Human attention is context dependent.',
      prediction: { ifCondition: 'If attention runs out', expectedOutcome: 'Some input is missed' },
    });
    expect(result.bridges).toHaveLength(0);
    expect(result.prediction).toBeNull();
  });

  test('long explanations are truncated at a word boundary, not in the middle of a word', () => {
    const core = parseCoreDiscovery({
      ...sample,
      bridges: [{ ...bridge, possibleSharedMechanism: ('Forest systems and network systems may adapt differently. ').repeat(12) }],
    }, question);
    expect(core.bridges[0].possibleSharedMechanism.endsWith('…') || core.bridges[0].possibleSharedMechanism.endsWith('.')).toBe(true);
    expect(core.bridges[0].possibleSharedMechanism).not.toMatch(/syste…$/);
  });

  test('review prompt explicitly screens causal links and rejects word-only matches', () => {
    const reviewPrompt = buildDiscoveryReviewPrompt(parseCoreDiscovery(sample, question));
    expect(reviewPrompt).toContain('TWO distinct cause-and-effect steps');
    expect(reviewPrompt).toContain('A shared word');
    expect(reviewPrompt).toContain('whatWouldDisproveIt');
    expect(reviewPrompt).toContain('selectedIndex');
  });

  test('review instructions separate shared causal roles from literal system identity', () => {
    const prompt = buildDiscoveryReviewPrompt(parseCoreDiscovery(sample, question));
    expect(prompt).toContain('DIFFERENCE TEST');
    expect(prompt).toContain('Never reject solely');
    expect(prompt).toContain('ASSUMPTION TEST');
    expect(prompt).toContain('COUNTEREVIDENCE TEST');
    expect(prompt).toContain('A single exception');
    expect(prompt).toContain('SAME condition and comparison');
    expect(prompt).toContain('must NOT begin with "If"');
    const firstPass = buildCoreDiscoveryPrompt(question, [], []);
    expect(firstPass).toContain('shared sub-mechanism');
    expect(firstPass).toContain('conditions not reported');
  });

  test('visible prediction labels do not repeat model-produced If and Then', () => {
    const core = parseCoreDiscovery(sample, question);
    const result = applyDiscoveryReview(core, {
      decision: 'accept', selectedIndex: 0,
      reason: 'Both systems have a receiving limit; shorter inputs may be transmitted or understood more reliably.',
      causalMatch: 'Incoming messages occupy capacity in both; beyond their available capacity, some content may be missed.',
      crucialDifference: 'Human attention depends on purpose and context rather than a fixed packet buffer.',
      prediction: {
        ifCondition: 'If incoming information exceeds the attention available at that time',
        expectedOutcome: 'Then we might see fewer main points recalled than after a comparable shorter explanation',
        borrowedFromOtherSystem: 'A finite network buffer is more likely to drop data when it is saturated.',
        whyItMayFail: 'The listener may disagree even when every word is understood.',
        whatWouldDisproveIt: 'Under comparable conditions, repeated shorter explanations show no improvement in main-point recall.',
        safeNextCheck: 'With consent, ask which points were understood after a brief explanation.',
      },
    });
    expect(result.prediction?.ifCondition).toBe('incoming information exceeds the attention available at that time');
    expect(result.prediction?.expectedOutcome).toBe('fewer main points recalled than after a comparable shorter explanation');
    expect(result.prediction?.whatWouldDisproveIt).toContain('comparable conditions');
    const view = readFileSync('src/components/CoreDiscoveryView.tsx', 'utf-8');
    expect(view).toContain('What would count against it');
    expect(view).not.toContain('No convincing different-system match yet');
  });

  test('personal learned language is only a tentative hint, never a fixed profile', () => {
    const prompt = buildCoreDiscoveryPrompt(question, [{ phrase: 'the extra mile', meaning: 'additional effort' }], []);
    expect(prompt).toContain('tentative');
    expect(prompt).toContain('Never ask the person to teach a glossary');
  });
});
