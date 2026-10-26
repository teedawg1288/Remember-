import type { DiscoveryBridge } from '../types/discovery';

/** Explicit first-person experience followed by a new question. Not a user profile. */
export function extractQuestionAnchors(question: string): { known: string; unknown: string } | null {
  const clauses = question.trim().split(/(?<=[.!?])\s+/).filter(Boolean);
  if (clauses.length < 2) return null;
  const first = clauses[0].replace(/[.!?]+$/, '').trim();
  const reportedActivity = /\b(?:i|we)\s+(?:(?:have|had)\s+|(?:have|had)\s+been\s+|know\s+how\s+to\s+|can\s+)?(?:fix(?:ed)?|repair(?:ed)?|restore(?:d)?|refinish(?:ed)?|detail(?:ed)?|plan(?:ned)?|organize(?:d)?|learn(?:ed|t)?|manage(?:d)?|build|built|clean(?:ed)?|do|did|use(?:d)?|make|made|work(?:ed)?|run|ran|sweep|swept|grease(?:d)?|paint(?:ed)?|teach|taught|check(?:ed)?|wash(?:ed)?|test(?:ed)?|maintain(?:ed)?|cook(?:ed)?|drive|drove|budget(?:ed)?)\b/i;
  if (!reportedActivity.test(first)) return null;
  const unknown = clauses.slice(1).join(' ').trim();
  if (!unknown.includes('?')) return null;
  return { known: first, unknown };
}

const ignore = new Set([
  'the','and','can','how','what','why','does','that','this','those','like','with','about','for','from','into','have','been','does','they','you','are','were','more','same','different','system','one','another','thing','there','important','would','could','should','know','understand','learn','some','want','really','basic','something','means','mean','doing','did','done','have','has','had','its','but','your','our','their','just','work','works','working','process','first','last','new','used','using','already','life','experience','experiences','time','and','instead','inside',
]);
function terms(text: string): Set<string> {
  return new Set(text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').split(/\s+/)
    .map(w => w.replace(/(?:ations|ation|ments|ment|ities|ity|ing|ed|es|s)$/,'').replace(/(?:e)$/, ''))
    .filter(w => w.length >= 3 && !ignore.has(w)));
}
function overlap(a: Set<string>, b: Set<string>): number {
  return [...a].filter(token => b.has(token)).length;
}

/** When a person explicitly says "through that", do not silently switch donor. */
export function ignoresRequestedDonor(question: string, comparisonSystem: string): boolean {
  const anchors = extractQuestionAnchors(question);
  if (!anchors || !/\b(?:through that|using that|from that|based on that|through my|using my|from my)\b/i.test(question)) return false;
  const donorWords = terms(comparisonSystem);
  const knownWords = terms(anchors.known);
  return overlap(donorWords, knownWords) === 0;
}

/** Only reject a *clear* reversal. Borderline or implicit requests stay with the reviewer. */
export function clearSourceTargetReversal(question: string, bridge: DiscoveryBridge): boolean {
  const anchors = extractQuestionAnchors(question);
  if (!anchors) return false;
  const known = terms(anchors.known);
  const unknown = terms(anchors.unknown);
  const original = terms(bridge.originalSystem);
  const comparison = terms(bridge.comparisonSystem);
  const originalKnown = overlap(original, known);
  const originalUnknown = overlap(original, unknown);
  const donorKnown = overlap(comparison, known);
  const donorUnknown = overlap(comparison, unknown);
  return originalKnown >= 1 && donorUnknown >= 1 &&
    originalKnown > originalUnknown && donorUnknown > donorKnown;
}
