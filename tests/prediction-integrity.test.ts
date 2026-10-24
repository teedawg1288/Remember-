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

  test('numerical outcome-rate claims without a source are withheld', () => {
    for (const claim of [
      'Changing this part works in 80% of cases.',
      'The repair succeeds 80% of the time.',
      'It succeeds in 8 out of 10 cases.',
    ]) {
      expect(assessPredictionIntegrity({ ...base, falsifiablePrediction: claim }).status).toBe('blocked');
    }
  });

  test('measured physical thresholds are not confused with success rates', () => {
    expect(assessPredictionIntegrity({
      ...base,
      falsifiablePrediction: 'If the chain is elongated >0.75%, replacing it without the cassette will not fully resolve the skip under high torque.',
    }).status).toBe('candidate');
    expect(assessPredictionIntegrity({
      ...base,
      falsifiablePrediction: 'At 12% humidity, a sensor registers a different resistance.',
    }).status).toBe('candidate');
  });

  test('statistical claims still require sources even if they mention technical components', () => {
    expect(assessPredictionIntegrity({
      ...base,
      falsifiablePrediction: 'The bike repair succeeds in 80% of cases.',
    }).status).toBe('blocked');
  });
});

test('live-analysis prompts avoid forcing human drama and invented odds into technical questions', () => {
  const server = readFileSync('server.ts', 'utf-8');
  const liveStart = server.indexOf('const prompt = `You are REMEMBER');
  const liveEnd = server.indexOf('Return STRICT, VALID JSON ONLY', liveStart);
  const instructions = server.slice(liveStart, liveEnd);
  expect(instructions).toContain('persona is a STYLE, not a topic selector');
  expect(instructions).toContain('never turn a mechanical, medical, engineering');
  expect(instructions).toContain('Never make up what the user did');
  expect(server).not.toContain('8 out of 10 times they will smile right back');
  expect(server).not.toContain('their phone died or they were busy');
});

test('primary UI prioritizes question, observation, explanation, and next check', () => {
  const screen = readFileSync('src/components/StoryComparisonView.tsx', 'utf-8');
  const input = readFileSync('src/components/BarberInput.tsx', 'utf-8');
  const map = readFileSync('src/components/InteractiveDiscoveryMap.tsx', 'utf-8');
  const bridge = readFileSync('src/components/CrossDomainVisualBridge.tsx', 'utf-8');
  const roundTable = readFileSync('src/components/RoundTableView.tsx', 'utf-8');
  expect(screen).toContain('1 · What we know');
  expect(screen).toContain('2 · What might explain it');
  expect(screen).toContain('3 · Best next check');
  expect(screen).toContain('<details className="rounded-2xl');
  expect(screen).not.toContain('"Different people, different places, but look at what');
  expect(input).toContain('What are you trying to understand?');
  expect(input).toContain('Try a sample question');
  expect(input).not.toContain('Silence is never hostility');
  expect(input.indexOf('<form onSubmit')).toBeLessThan(input.indexOf('Try a sample question'));
  expect(map).not.toContain('already cracked this code');
  expect(map).not.toContain('Real AI Reasoning Active');
  expect(map).toContain("node.id === 'node-history'");
  expect(bridge).toContain('How the mechanisms compare');
  expect(roundTable).not.toContain('It sounds like you\'re asking:');
});

test('custom analyses do not fall back to unrelated fictional era scenes', () => {
  const server = readFileSync('server.ts', 'utf-8');
  const ui = readFileSync('src/components/StoryComparisonView.tsx', 'utf-8');
  expect(server).toContain('parsed.eras = []');
  expect(ui).toContain('No period-specific example was supplied.');
});

test('cross-examination is an optional, evidence-oriented route, not a forced invented historical story', () => {
  const server = readFileSync('server.ts', 'utf-8');
  const panel = readFileSync('src/components/CrossExaminationPanel.tsx', 'utf-8');
  const story = readFileSync('src/components/StoryComparisonView.tsx', 'utf-8');
  const divergence = readFileSync('src/components/DifferenceThatChangesEverythingView.tsx', 'utf-8');
  expect(server).toContain("app.post('/api/same-story/cross-examine'");
  expect(server).toContain('SILENT CROSS-EXAMINATION');
  expect(server).toContain('Never place a modern invention in antiquity');
  expect(panel).toContain('Uses one additional live Gemini request');
  expect(story).toContain('runCrossExamination');
  expect(story).toContain('focus="eras"');
  expect(story).toContain('focus="parallels"');
  expect(story).toContain('focus="mechanism"');
  expect(divergence).not.toContain('The Divergence Law');
  expect(divergence).toContain('hypothetical paths, not documented cases');
});

test('functional cross-domain candidates are shown even without a historical story', () => {
  const server = readFileSync('server.ts', 'utf-8');
  const comparison = readFileSync('src/components/StoryComparisonView.tsx', 'utf-8');
  const map = readFileSync('src/components/InteractiveDiscoveryMap.tsx', 'utf-8');
  expect(server).toContain('mechanismBridges: PRIMARY DISCOVERY OUTPUT');
  expect(server).toContain('historical stories');
  expect(server).toContain('input, capacity/constraint and outcome');
  expect(comparison).toContain('Cross-system connection · Candidate');
  expect(comparison).toContain('Historical Examples to Examine');
  expect(comparison).toContain('firstMechanismBridge.sharedMechanism');
  expect(comparison).toContain('<MechanismBridgeView');
  expect(comparison).not.toContain('{analysis.stories.length} Parallels');
  expect(map).toContain('Candidate cross-domain leads can be explored');
  expect(map).not.toContain("if (node.id === 'node-science' && analysis.isCustomGenerated)");
});

test('visual bridge cannot ship the old text-message fallback again', () => {
  const source = readFileSync('src/components/CrossDomainVisualBridge.tsx', 'utf-8');
  expect(source).not.toContain('Waiting, watching, and wondering why they went quiet');
  expect(source).not.toContain('The Signal & Silence');
  expect(source).not.toContain('Interpersonal</span>');
  expect(source).not.toContain('80%+ of cases');
});
