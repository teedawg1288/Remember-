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
  if (!prediction || prediction.id.startsWith('unavailable-')) {
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
  if (/(?:\d+(?:\.\d+)?\s*%|\d+\s+out of\s+\d+)/.test(normalized[0]) &&
      !prediction.sourceUrl?.startsWith('https://')) {
    issues.push('A numerical success claim has no checkable source attached.');
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
