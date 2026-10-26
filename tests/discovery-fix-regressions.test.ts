import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { assessDiscoveryRisk, urgentDiscovery } from '../src/data/discoverySafety';
import { extractQuestionAnchors, clearSourceTargetReversal } from '../src/data/questionAnchors';
import { confirmedExperienceExcerpt, unsupportedCompletedActionAttribution } from '../src/data/grounding';
import { applyDiscoveryReview, parseCoreDiscovery } from '../src/data/discoveryContract';
import { buildCoreDiscoveryPrompt } from '../src/data/coreDiscoveryPrompt';
import { buildDiscoveryReviewPrompt } from '../src/data/discoveryReviewPrompt';

const shoeQuestion = 'I repair shoes with glue. Is that like welding metal, or am I missing something important?';
const reversedBridge = {
  originalDomain: 'Footwear', originalSystem: 'Shoe repair',
  comparisonDomain: 'Metalwork', comparisonSystem: 'Welding metal',
  possibleSharedMechanism: 'Both are ways of joining materials.',
  stages: [
    { label: 'Inspect', inOriginal: 'Assess shoe join', inComparison: 'Assess welding joint', sharedFunction: 'Find join location', importantDifference: 'Different materials' },
    { label: 'Prepare', inOriginal: 'Prepare shoe surface', inComparison: 'Prepare steel surface', sharedFunction: 'Make join ready', importantDifference: 'Different tools' },
    { label: 'Join', inOriginal: 'Glue shoe', inComparison: 'Weld metal', sharedFunction: 'Connect pieces', importantDifference: 'Bonding differs' },
  ],
  whatMightTransfer: 'Joined pieces need appropriate preparation.',
  whereItBreaks: 'Welding and adhesion do not have the same physical method.',
  howToChallenge: 'Compare whether the preparation is appropriate to each material.',
};
const base = {
  whatIsReported: 'The speaker reports shoe repair and asks whether metal welding resembles it.',
  possibleMechanism: 'Two joining methods may share preparation, joining and inspection.',
  alternativeExplanations: [], bridges: [reversedBridge],
  missingInformation: 'Does the user need to learn how metal joints are made?',
  nextCheck: 'Ask which part of metal welding they want to understand.',
  meaningCheck: null,
};
const audit = reversedBridge.stages.map((_, stageIndex) => ({
  stageIndex, donorGoal: 'Make parts ready for joining', targetGoal: 'Make parts ready for joining',
  verdict: 'aligned', reason: 'Both use preparation to allow a future join',
}));
const prediction = {
  ifCondition: 'The joint is prepared for this particular material',
  expectedOutcome: 'The pieces are more likely to stay joined',
  borrowedFromOtherSystem: 'Appropriate preparation changes joint strength',
  whyItMayFail: 'The two systems use distinct bonding technologies',
  whatWouldDisproveIt: 'Comparable prepared joints consistently perform no better',
  safeNextCheck: 'Check the materials and consult the relevant instructions',
};

describe('100 simulated people: safety cases', () => {
  test('chest pain cannot be waved away through a pipe repair comparison', () => {
    const q = 'I have fixed a leaky pipe. Can I use that knowledge to decide if chest pain is just indigestion?';
    const risk = assessDiscoveryRisk(q);
    expect(risk?.level).toBe('emergency');
    const core = urgentDiscovery(q, risk!);
    expect(core.bridges).toHaveLength(0);
    expect(core.nextCheck).toContain('911');
    expect(core.prediction).toBeNull();
  });

  test('dog unable to breathe triggers immediate veterinary assistance', () => {
    const risk = assessDiscoveryRisk('I learned CPR once. Could I use that to treat a dog that cannot breathe?');
    expect(risk?.level).toBe('emergency');
    expect(risk?.immediateAction).toContain('emergency veterinarian');
  });

  test('sweeping is no permission for surgery, car repair no permission for wiring', () => {
    expect(assessDiscoveryRisk('I know how to sweep a floor. Does that mean I can safely perform surgery?')?.level).toBe('boundary');
    expect(assessDiscoveryRisk('I know how to fix car brakes. Could I repair household wiring by the same steps?')?.level).toBe('boundary');
    expect(assessDiscoveryRisk('I organize photos into albums. How do computer folders work?')).toBeNull();
  });
});

describe('100 simulated people: translation direction and provenance', () => {
  test('recognizes known experience first and the unfamiliar question second', () => {
    expect(extractQuestionAnchors(shoeQuestion)).toEqual({
      known: 'I repair shoes with glue',
      unknown: 'Is that like welding metal, or am I missing something important?',
    });
    expect(clearSourceTargetReversal(shoeQuestion, reversedBridge)).toBe(true);
    const core = parseCoreDiscovery(base, shoeQuestion);
    const screened = applyDiscoveryReview(core, {
      decision: 'accept', selectedIndex: 0, stagePurposeAudit: audit,
      reason: 'A proposed joining sequence connects the two materials.',
      causalMatch: 'Both require preparation and joining.',
      crucialDifference: 'Adhesives are not heat-based welding.', prediction,
    });
    expect(screened.screening?.status).toBe('rejected');
    expect(screened.bridges).toHaveLength(0);
  });

  test('first pass and reviewer both require the confirmed experience to be the donor', () => {
    const first = buildCoreDiscoveryPrompt('I detail cars for a living. Could I learn basic restoration?', [], []);
    const review = buildDiscoveryReviewPrompt(parseCoreDiscovery(base, shoeQuestion));
    expect(first).toContain('DIRECTION LOCK');
    expect(first).toContain('EXPLICIT DIRECTION ANCHORS');
    expect(review).toContain('DIRECTION AUDIT');
    expect(review).toContain('KNOWN-THEN-UNKNOWN DIRECTION ANCHORS');
  });

  test('ordinary declared experience is recognized without assuming competence', () => {
    expect(confirmedExperienceExcerpt('I detail cars for a living. Could I learn basic restoration?', 'car detailing')).toContain('I detail cars');
    expect(confirmedExperienceExcerpt('I plan children\'s birthday parties. How would I plan a community fundraiser?', 'birthday party planning')).toContain('I plan');
  });

  test('rejects invented past sanding and zipper clearing but allows conditional teaching', () => {
    const zipper = 'I have fixed a sticky zipper. Why might my sliding patio door be hard to move?';
    expect(unsupportedCompletedActionAttribution(zipper, 'You cleared the zipper track.')).toBe(true);
    expect(unsupportedCompletedActionAttribution(zipper, 'If you cleared the zipper track, that might help.')).toBe(false);
    expect(unsupportedCompletedActionAttribution('I refinished the wooden stairs.', 'You sanded the stairs before painting.')).toBe(true);
  });
});

describe('100 simulated people: prediction scope and clean memory', () => {
  test('reviewed two-link prediction can survive an unrelated failed stage, not a linked failure', () => {
    const core = parseCoreDiscovery(base, 'How can shoe repair help me understand joining metal?');
    const auditWithGap = audit.map((row, i) => i === 2 ? { ...row, verdict: 'unverified', reason: 'The final joining effect is not established in the unfamiliar material' } : row);
    const accepted = applyDiscoveryReview(core, {
      decision: 'accept', selectedIndex: 0, stagePurposeAudit: auditWithGap,
      predictionStageIndices: [0, 1], predictionScopedToAlignedStages: true,
      reason: 'Only inspection and preparation truly align.',
      causalMatch: 'Both inspect and prepare a joint before acting.',
      crucialDifference: 'The actual joining methods differ.', prediction,
    });
    expect(accepted.screening?.status).toBe('accepted');
    expect(accepted.bridges[0].stages).toHaveLength(2);
    const failed = applyDiscoveryReview(core, {
      decision: 'accept', selectedIndex: 0, stagePurposeAudit: auditWithGap,
      predictionStageIndices: [1, 2], predictionScopedToAlignedStages: true,
      reason: 'Only inspection and preparation truly align.',
      causalMatch: 'Both inspect and prepare a joint before acting.',
      crucialDifference: 'The actual joining methods differ.', prediction,
    });
    expect(failed.screening?.status).toBe('partial');
    expect(failed.prediction).toBeNull();
  });

  test('isolated URLs disable shared browser memory in requests and storage', () => {
    const app = readFileSync('src/App.tsx', 'utf8');
    expect(app).toContain("get('test') === 'isolated'");
    expect(app).toContain('if (isIsolatedTest) return [];');
    expect(app).toContain('usePersonalLanguage && !isIsolatedTest');
    expect(app).toContain('Isolated test session');
  });
});

describe('simple recognition first, full reasoning only on request', () => {
  test('the two AI passes hide their audits while the UI initially collapses stage detail', () => {
    const first = buildCoreDiscoveryPrompt('I fix stairs. Can I restore a car door?', [], []);
    const review = buildDiscoveryReviewPrompt(parseCoreDiscovery(base, shoeQuestion));
    const view = readFileSync('src/components/CoreDiscoveryView.tsx', 'utf8');
    expect(first).toContain('COMPLEX BACKSTAGE, SIMPLE RECOGNITION');
    expect(review).toContain('Keep complex audits behind the scenes');
    expect(view).toContain('<details className="rounded-xl border border-stone-700 bg-[#111824]');
    expect(view).toContain('Want to see how the steps connect?');
    expect(view).toContain('What you still need to learn here');
  });
});
