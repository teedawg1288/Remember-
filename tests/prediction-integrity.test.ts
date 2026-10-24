import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import type { CrossFieldPrediction } from '../src/types/sameStory';
import { assessPredictionIntegrity } from '../src/data/predictionIntegrity';

const base: CrossFieldPrediction = {
  id: 'test-prediction',
  timestamp: '2026-10-24T00:00:00Z',
  questionInvestigated: 'What causes skipping under load?',
  donorField: 'Engineering',
  targetField: 'Bicycles',
  unansweredQuestion: 'What could we observe?',
  establishedKnowledgeApplied: 'An interface may slip when overloaded.',
  falsifiablePrediction: 'Replacing the chain without changing the cassette will not stop the skipping.',
  evidenceThatWouldProve: 'The bike still skips after the chain alone is replaced, using the original cassette.',
  evidenceThatWouldDisprove: 'The bike stops skipping after the chain alone is replaced, using the original cassette.',
  confidenceRating: 'Plausible Hypothesis',
};

describe('Prediction evidence integrity guard', () => {
  test('catches the actual bicycle-example intervention switch', () => {
    const bad = {
      ...base,
      evidenceThatWouldProve: 'The chain skips on a new cassette.',
      evidenceThatWouldDisprove: 'The chain runs perfectly on a new cassette.',
    };
    const assessment = assessPredictionIntegrity(bad);
    expect(assessment.status).toBe('blocked');
    expect(assessment.issues.join(' ')).toContain('cassette');
  });

  test('does not block a basic controlled test using the original cassette', () => {
    const result = assessPredictionIntegrity(base);
    expect(result.status).toBe('candidate');
    expect(result.issues.length).toBe(0);
  });

  test('identical support and challenge criteria are rejected', () => {
    expect(assessPredictionIntegrity({
      ...base,
      evidenceThatWouldDisprove: base.evidenceThatWouldProve,
    }).status).toBe('blocked');
  });

  test('incomplete and missing predictions cannot record an outcome', () => {
    expect(assessPredictionIntegrity(undefined).status).toBe('blocked');
    expect(assessPredictionIntegrity({
      ...base, evidenceThatWouldProve: 'Unknown',
    }).status).toBe('blocked');
  });

  test('numerical success claims without a source are withheld', () => {
    expect(assessPredictionIntegrity({
      ...base, falsifiablePrediction: 'Changing this part works in 80% of cases.',
    }).status).toBe('blocked');
  });
});

test('visual bridge cannot ship the old text-message fallback again', () => {
  const source = readFileSync('src/components/CrossDomainVisualBridge.tsx', 'utf-8');
  expect(source).not.toContain('Waiting, watching, and wondering why they went quiet');
  expect(source).not.toContain('The Signal & Silence');
  expect(source).not.toContain('Interpersonal</span>');
  expect(source).not.toContain('80%+ of cases');
});
