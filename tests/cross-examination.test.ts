import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { buildCrossExaminationPrompt, parseCrossExaminationResult } from '../src/data/crossExamination';

const question = 'Why can longer explanations sometimes be harder to understand?';
const bridge = {
  originalSystem: 'A conversation',
  comparisonSystem: 'A network buffer',
  sharedMechanism: 'Increasing input can exceed the receiver\'s current processing capacity.',
  crucialDifference: 'Human understanding is not determined only by data throughput.',
  screeningStatus: 'accepted' as const,
  stages: [
    { inOriginal: 'More words', inComparison: 'More packets', sharedFunction: 'Input rises', importantDifference: 'Words carry meaning.' },
    { inOriginal: 'Limited attention', inComparison: 'Finite buffer', sharedFunction: 'Capacity limits', importantDifference: 'Attention changes.' },
  ],
};
const output = {
  observed: 'The user asked a general question; no specific listener response was reported.',
  causalFacts: [
    { statement: 'Information takes time to process.', basis: 'general', whyItMatters: 'Processing cannot be assumed to be unlimited.' },
  ],
  causalExplanation: 'When input outruns available processing, some details may not be retained; whether that happened here is unknown.',
  hypotheses: [
    { explanation: 'Too many details at once', whatWouldSupport: 'More material is recalled when information is chunked.', whatWouldChallenge: 'The same details are recalled accurately.' },
    { explanation: 'A genuine disagreement', whatWouldSupport: 'The listener can repeat the explanation but still rejects the conclusion.', whatWouldChallenge: 'The listener was unable to repeat the main point.' },
  ],
  prediction: {
    donorLesson: 'Reducing traffic during congestion can improve delivery.',
    missingTargetCondition: 'Whether the listener is struggling to process information rather than disagreeing.',
    ifCondition: 'The listener is overloaded but willing to engage.',
    expectedOutcome: 'A shorter explanation followed by clarification may improve accurate recall.',
    comparedWith: 'The same listener receiving a longer explanation under similar conditions.',
    whatWouldChallengeIt: 'Comparable shorter explanations produce no change in accurate recall.',
  },
  noPredictionReason: '',
  nextPredictionQuestion: {
    question: 'Could giving a shorter explanation improve accurate recall when someone is overloaded with information?',
    factBehindQuestion: 'A saturated receiving buffer may lose some incoming data when input exceeds available capacity.',
    whyThisQuestion: 'Capacity limits in the donor system suggest testing whether limited attention plays a comparable role.',
    howAnswerChangesPrediction: 'Ask what the listener recalled under comparable short and long explanations; disagreement despite accurate recall weakens overload.',
  },
  nextCheck: 'With consent, invite the listener to paraphrase the main point after a brief explanation.',
  crossDomainCandidates: [{ system: 'Network buffer', sharedMechanism: 'Input consumes capacity.', criticalDifference: 'People interpret meaning.', howToChallenge: 'Check recall separately from agreement.' }],
  eraCandidates: [],
  evidenceBoundary: 'AI-generated candidates, not externally fact-checked or proven in this situation.',
};

describe('cross-examination prediction and question contract', () => {
  test('uses the screened parallel and previously reviewed prediction as inputs', () => {
    const prompt = buildCrossExaminationPrompt({
      question, proposedMechanism: 'Possible information overload',
      selectedBridge: bridge,
      reviewedPrediction: {
        ifCondition: 'Attention is limited',
        expectedOutcome: 'Shorter messages may improve recall',
        borrowedFromOtherSystem: 'Finite network buffers can become congested',
        whyItMayFail: 'Disagreement is not overload',
      },
    });
    expect(prompt).toContain('A network buffer');
    expect(prompt).toContain('PREVIOUSLY SCREENED CROSS-SYSTEM COMPARISON');
    expect(prompt).toContain('EARLIER PREDICTION');
    expect(prompt).toContain('FACT RULE');
    expect(prompt).toContain('PREDICTION QUESTION RULE');
    expect(prompt).toContain('prediction:null');
    expect(prompt).toContain('factBehindQuestion');
  });

  test('keeps reported facts and general mechanisms visibly distinct', () => {
    const result = parseCrossExaminationResult(output);
    expect(result.causalFacts?.[0].basis).toBe('general');
    expect(result.causalFacts?.[0].whyItMatters).toContain('Processing');
    expect(result.causalExplanation).toContain('unknown');
    expect(result.nextPredictionQuestion?.question).toMatch(/^Could /);
    expect(result.nextPredictionQuestion?.factBehindQuestion).toContain('buffer');
    expect(result.nextPredictionQuestion?.whyThisQuestion).toContain('Capacity');
    expect(result.prediction?.expectedOutcome).toContain('recall');
  });

  test('no defensible transfer is a complete response when the missing question is explained', () => {
    const result = parseCrossExaminationResult({
      ...output,
      prediction: null,
      noPredictionReason: 'The comparison does not provide a justified donor-to-target inference.',
      nextPredictionQuestion: {
        question: 'Does the original system have the same limiting stage?',
        factBehindQuestion: 'The original question has not established whether this stage exists.',
        whyThisQuestion: 'Without that causal counterpart the donor lesson cannot be transferred.',
        howAnswerChangesPrediction: 'A verified counterpart opens a test; its absence blocks this prediction.',
      },
      causalFacts: [],
    });
    expect(result.prediction).toBeNull();
    expect(result.causalFacts).toEqual([]);
    expect(result.noPredictionReason).toContain('does not provide');
  });

  test('does not show a prediction with no counterevidence or no explanation for the next question', () => {
    expect(() => parseCrossExaminationResult({
      ...output, prediction: { ...output.prediction, whatWouldChallengeIt: '' },
    })).toThrow('INVALID_AI_RESPONSE');
    expect(() => parseCrossExaminationResult({
      ...output, nextPredictionQuestion: { ...output.nextPredictionQuestion, whyThisQuestion: '' },
    })).toThrow('INVALID_AI_RESPONSE');
    expect(() => parseCrossExaminationResult({
      ...output, causalFacts: [{ statement: 'Someone was angry', basis: 'guess', whyItMatters: 'No evidence' }],
    })).toThrow('INVALID_AI_RESPONSE');
    expect(() => parseCrossExaminationResult({
      ...output, prediction: null, noPredictionReason: '',
    })).toThrow('INVALID_AI_RESPONSE');
  });

  test('wires reviewed bridge to the endpoint and shows the required reasoning without another request', () => {
    const server = readFileSync('server.ts', 'utf8');
    const view = readFileSync('src/components/CoreDiscoveryView.tsx', 'utf8');
    const panel = readFileSync('src/components/CrossExaminationPanel.tsx', 'utf8');
    expect(server).toContain('buildCrossExaminationPrompt({');
    expect(server).toContain('parseCrossExaminationResult(');
    expect(view).toContain('selectedBridge: bridge ?');
    expect(view).toContain('reviewedPrediction: core.prediction ?');
    expect(panel).toContain('What we know—and why it could happen');
    expect(panel).toContain('Why this question in particular');
    expect(panel).toContain('The fact behind this question');
    expect(panel).toContain('How the answer changes things');
    expect(panel).toContain('General principle · not source-checked');
    expect(server.match(/app\.post\('\/api\/same-story\/cross-examine'/g)).toHaveLength(1);
  });
  test('cross-examination respects experience and does not pressure a predetermined belief', () => {
    const prompt = buildCrossExaminationPrompt({
      question: 'Could I be misunderstanding what that person meant?',
      selectedBridge: bridge,
    });
    expect(prompt).toContain('MEANING AND DELIVERY RULE');
    expect(prompt).toContain('KNOWN EXPERIENCE RULE');
    expect(prompt).toContain('NONLEADING CHECK');
    expect(prompt).toContain('A valid prediction question must let either answer change the hypothesis');
    expect(prompt).toContain('A correction by the person overrides a guessed interpretation');
  });

});
