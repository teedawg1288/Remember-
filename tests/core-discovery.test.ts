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

  test('translation travels from a possible familiar donor to the unfamiliar question, not backwards', () => {
    const example = buildCoreDiscoveryPrompt('How does a frozen drink machine work?', [], []);
    const review = buildDiscoveryReviewPrompt(parseCoreDiscovery(sample, question));
    const view = readFileSync('src/components/CoreDiscoveryView.tsx', 'utf-8');
    expect(example).toContain('unfamiliar target');
    expect(example).toContain('If familiarity was not established');
    expect(example).toContain('A candidate matching one stage cannot stand in for the full process');
    expect(review).toContain('potentially familiar DONOR');
    expect(review).toContain('unfamiliar TARGET');
    expect(view).toContain('Outside experience · if familiar');
    expect(view).toContain('What you want to understand');
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

  test('keeps a sound causal parallel visible even when a prediction cannot transfer', () => {
    const core = parseCoreDiscovery(sample, question);
    const result = applyDiscoveryReview(core, {
      decision: 'compare_only',
      selectedIndex: 0,
      reason: 'Both systems can lose information under excess input, but the device-level buffer rule cannot predict a particular human response.',
      causalMatch: 'New input consumes capacity in both systems; excess input may mean some of it is missed.',
      crucialDifference: 'Human understanding depends on context and intention, not only a fixed buffer size.',
      prediction: null,
    });
    expect(result.bridges).toHaveLength(1);
    expect(result.bridges[0].comparisonSystem).toBe('A receiving buffer');
    expect(result.prediction).toBeNull();
    expect(result.screening?.status).toBe('partial');
    expect(discoveryToSavedResult(result).coreDiscovery?.screening?.status).toBe('partial');
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
    expect(result.bridges).toHaveLength(1);
    expect(result.prediction).toBeNull();
    expect(result.screening?.status).toBe('partial');
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
    expect(prompt).toContain('TRANSFER GATE');
    expect(prompt).toContain('compare_only');
    expect(prompt).toContain('TWO distinct gates');
    expect(prompt).toContain('donor-only feature');
    expect(prompt).toContain('SCOPE GATE');
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
    expect(view).toContain("core.screening?.experienceTranslation ||");
    expect(view).toContain('{!core.screening && (');
    expect(view).toContain('unreviewed transfer');
    expect(view).not.toContain('No convincing different-system match yet');
  });

  test('personal learned language is only a tentative hint, never a fixed profile', () => {
    const prompt = buildCoreDiscoveryPrompt(question, [{ phrase: 'the extra mile', meaning: 'additional effort' }], []);
    expect(prompt).toContain('tentative');
    expect(prompt).toContain('Never ask the person to teach a glossary');
  });
  test('treats the speaker intent and delivery as distinct from model interpretation', () => {
    const prompt = buildCoreDiscoveryPrompt('That is a fucking good analogy', [], []);
    expect(prompt).toContain('INTENTION VERSUS INTERPRETATION');
    expect(prompt).toContain('DELIVERY AND IDENTITY NEUTRALITY');
    expect(prompt).toContain('Never label a metaphor or wording crude');
    expect(prompt).toContain('CURRENT context');
  });

  test('translates from demonstrated experience and asks genuinely open discovery questions', () => {
    const prompt = buildCoreDiscoveryPrompt('How can I use my stair repair experience to understand rust repair?', [], []);
    expect(prompt).toContain('EXPERIENCE-FIRST MEANING');
    expect(prompt).toContain('Do not lecture the user on a familiar skill');
    expect(prompt).toContain('OPEN DISCOVERY QUESTION');
    expect(prompt).toContain('strengthen OR weaken');
    expect(prompt).toContain('the user rejects the bridge');
  });

  test('reviewer challenges identity assumptions and question-shaped assertions', () => {
    const reviewer = buildDiscoveryReviewPrompt(parseCoreDiscovery(sample, question));
    expect(reviewer).toContain('PERSON-FIRST REVIEW');
    expect(reviewer).toContain('QUESTION INTEGRITY TEST');
    expect(reviewer).toContain('A question mark does not excuse an unsupported premise');
    expect(reviewer).toContain('allow compare_only');
  });

});

describe('experience-grounded output integrity', () => {
  test('reviewer translation survives only in plain language and no invented person facts', () => {
    const core = parseCoreDiscovery(sample, question);
    const review = {
      decision: 'compare_only', selectedIndex: 0, prediction: null,
      reason: 'Two causal stages match but no transfer survives the differences.',
      causalMatch: 'In both systems extra input increases load and some parts may be lost.',
      crucialDifference: 'A person can change how they interpret a message.',
      experienceTranslation: 'Like checking that a message gets through before sending more, checking what was heard can explain the next step.',
    };
    const cleanReview = applyDiscoveryReview(core, review);
    expect(cleanReview.screening?.experienceTranslation).toContain('checking what was heard');
    const acronymReview = applyDiscoveryReview(core, {
      ...review, experienceTranslation: 'The TCP interface detects CPU overload when talking to someone.',
    });
    expect(acronymReview.screening?.experienceTranslation).toBeUndefined();
    const invented = applyDiscoveryReview(core, {
      ...review, causalMatch: 'The user deliberately ignores the listener while adding messages.',
    });
    expect(invented.screening?.status).toBe('rejected');
  });
});

describe('simple system first', () => {
  test('works upward from the unfamiliar task before proposing familiar systems', () => {
    const prompt = buildCoreDiscoveryPrompt('How do I restore a rusty car door?', [], []);
    expect(prompt).toContain('UPSTREAM SIMPLIFICATION FIRST');
    expect(prompt.indexOf('UPSTREAM SIMPLIFICATION FIRST')).toBeLessThan(prompt.indexOf('CANDIDATE RULE'));
    expect(prompt).toContain('BEFORE searching for comparisons');
    expect(prompt).toContain('Above means a broader explanation');
    expect(prompt).toContain('Only AFTER finding a causal match');
    expect(prompt).toContain('A simple donor that matches only one word loses');
    expect(prompt).not.toContain('You already know how to repair stairs');
  });

  test('review selects the simplest *valid* explanatory process, not just an easy metaphor', () => {
    const prompt = buildDiscoveryReviewPrompt(parseCoreDiscovery(sample, question));
    expect(prompt).toContain('SIMPLICITY ORDER TEST');
    expect(prompt).toContain('fewest extra assumptions');
    expect(prompt).toContain('do not trade away genuine causal correspondence');
    expect(prompt).toContain('no analogy is better than a misleading simple one');
  });
});

describe('example questions do not coach the connection', () => {
  test('every example is a real unanswered question sent through live analysis', () => {
    const view = readFileSync('src/components/BarberInput.tsx', 'utf8');
    const app = readFileSync('src/App.tsx', 'utf8');
    const labels = [...view.matchAll(/label: '([^']+)'/g)].map(match => match[1]);
    expect(labels.length).toBeGreaterThanOrEqual(7);
    expect(new Set(labels).size).toBe(labels.length);
    for (const label of labels) {
      expect(label).toMatch(/^(How|Why|What|When|Can|Does|Do|Is)\b/);
      expect(label).toMatch(/\?$/);
      expect(label.toLowerCase()).not.toMatch(/\b(because|therefore|must be|always ends up|assumed they|felt ignored)\b/);
    }
    expect(view).toContain('onAnalyze(item.label)');
    expect(view).not.toContain('CURATED_STORIES');
    expect(view).not.toContain('onSelectCurated');
    expect(app).not.toContain('onSelectCurated');
    expect(view).toContain('Every example runs live AI.');
  });

  test('internal instructions cannot bias answers toward legacy showcase analogies', () => {
    const instructions = buildCoreDiscoveryPrompt('Why is my computer slow?', [], []);
    const review = buildDiscoveryReviewPrompt(parseCoreDiscovery(sample, question));
    expect(instructions).toContain('never pick a stored showcase example');
    expect(instructions).not.toContain('clearing a household blockage');
    expect(instructions).not.toContain('known ice-making process');
    expect(review).not.toContain('A vacuum blockage may explain a computer');
    expect(review).toContain('without claiming that similar language makes');
  });
});
