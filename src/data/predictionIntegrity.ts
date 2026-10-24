import type { CrossFieldPrediction } from '../types/sameStory';

export interface PredictionIntegrityResult {
  status: 'candidate' | 'blocked';
  issues: string[];
}

/**
 * A conservative, free local check. It does not prove a test is logically valid:
 * it catches missing criteria and some obvious changes to the intervention.
 * Failed checks prevent green/red success claims and outcome logging.
 */
export function assessPredictionIntegrity(
  prediction: CrossFieldPrediction | null | undefined,
): PredictionIntegrityResult {
  if (!prediction || typeof prediction.id !== 'string' || prediction.id.startsWith('unavailable-')) {
    return { status: 'blocked', issues: ['No question-specific prediction was generated.'] };
  }
  const required = [
    prediction.falsifiablePrediction,
    prediction.evidenceThatWouldProve,
    prediction.evidenceThatWouldDisprove,
  ];
  if (required.some((value) => typeof value !== 'string' || value.trim().length < 12)) {
    return { status: 'blocked', issues: ['The claim and the two observation criteria are incomplete.'] };
  }
  const normalized = required.map((value) =>
    value.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim()
  );
  const [, supports, challenges] = normalized;
  const issues: string[] = [];
  if (supports === challenges) {
    issues.push('The proposed supporting and challenging observations are identical.');
  }
  // A measured threshold (e.g. "chain elongation >0.75%") is not a
  // claimed success rate. Flag unsupported statistical *outcome* claims,
  // not every percent or "3 out of 10" measurement.
  const claim = prediction.falsifiablePrediction.toLowerCase();
  const percentOutcomeClaim =
    /\b\d+(?:\.\d+)?\s*%\s*(?:of\s+(?:cases|people|repairs|attempts|the\s+time)|chance|probability|success|successful|accuracy|failure|effective|reliability)/.test(claim) ||
    /\b(?:works?|succeeds?|success|fails?|failure|accuracy|chance|probability|likelihood|reliability)\s+(?:in\s+|about\s+|at\s+)?\d+(?:\.\d+)?\s*%/.test(claim) ||
    /\b\d+\s+out\s+of\s+\d+\s+(?:cases|people|repairs|attempts|times)\b/.test(claim);
  if (percentOutcomeClaim && !prediction.sourceUrl?.startsWith('https://')) {
    issues.push('A numerical outcome-rate claim has no checkable source attached.');
  }

  // Catch a common intervention switch: a claim about "without changing X"
  // followed by evidence that uses a "new X". This is not a semantic proof.
  const isolatedVariables = [
    ...normalized[0].matchAll(/\bwithout\s+(?:first\s+)?(?:checking|changing|replacing|adjusting|repairing|using|adding|removing)\s+(?:the\s+|a\s+|an\s+)?([a-z][\w-]*)/g),
  ].map((match) => match[1]);
  for (const variable of isolatedVariables) {
    const changedVariable = new RegExp(
      '\\b(?:new|replaced|changed|adjusted|updated|different)\\s+(?:[a-z]+\\s+){0,2}' + variable + '\\b',
      'i',
    );
    if (changedVariable.test(supports) || changedVariable.test(challenges)) {
      issues.push('The test changes "' + variable + '", even though the prediction asks what happens without changing it.');
    }
  }
  return { status: issues.length ? 'blocked' : 'candidate', issues };
}
