import type { CoreDiscovery, DiscoveryBridge, DiscoveryStage, MeaningCheck } from '../types/discovery';

const words = (value: unknown, max = 500): string =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';
const record = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;

function parseStage(value: unknown): DiscoveryStage | null {
  const item = record(value);
  if (!item) return null;
  const stage: DiscoveryStage = {
    label: words(item.label, 65),
    inOriginal: words(item.inOriginal, 180),
    inComparison: words(item.inComparison, 180),
    sharedFunction: words(item.sharedFunction, 180),
    importantDifference: words(item.importantDifference, 180),
  };
  return Object.values(stage).every(Boolean) ? stage : null;
}

function parseBridge(value: unknown): DiscoveryBridge | null {
  const item = record(value);
  if (!item) return null;
  const stages = Array.isArray(item.stages) ? item.stages.map(parseStage).filter((s): s is DiscoveryStage => !!s).slice(0, 5) : [];
  const bridge: DiscoveryBridge = {
    originalDomain: words(item.originalDomain, 90),
    originalSystem: words(item.originalSystem, 90),
    comparisonDomain: words(item.comparisonDomain, 90),
    comparisonSystem: words(item.comparisonSystem, 90),
    possibleSharedMechanism: words(item.possibleSharedMechanism, 200),
    stages,
    whatMightTransfer: words(item.whatMightTransfer, 240),
    whereItBreaks: words(item.whereItBreaks, 240),
    howToChallenge: words(item.howToChallenge, 240),
  };
  if (stages.length < 3 || Object.entries(bridge).some(([key, val]) => key !== 'stages' && !val)) return null;
  // Separate systems must genuinely differ. Same-domain comparisons can still
  // be useful elsewhere, but cannot satisfy the cross-system discovery slot.
  if (bridge.originalDomain.toLowerCase() === bridge.comparisonDomain.toLowerCase() ||
      bridge.originalSystem.toLowerCase() === bridge.comparisonSystem.toLowerCase()) return null;
  return bridge;
}

function parseMeaning(value: unknown): MeaningCheck | null {
  const item = record(value);
  if (!item) return null;
  const result: MeaningCheck = {
    whatWasSaidOrObserved: words(item.whatWasSaidOrObserved, 240),
    possibleIntendedMeaning: words(item.possibleIntendedMeaning, 240),
    possibleUnderstoodMeaning: words(item.possibleUnderstoodMeaning, 240),
    whatRemainsUnknown: words(item.whatRemainsUnknown, 240),
    howToClarify: words(item.howToClarify, 240),
  };
  return Object.values(result).every(Boolean) ? result : null;
}

export function parseCoreDiscovery(value: unknown, exactQuestion: string): CoreDiscovery {
  const item = record(value);
  if (!item) throw new Error('INVALID_AI_RESPONSE');
  const whatIsReported = words(item.whatIsReported, 350);
  const possibleMechanism = words(item.possibleMechanism, 350);
  const missingInformation = words(item.missingInformation, 350);
  const nextCheck = words(item.nextCheck, 350);
  if (![whatIsReported, possibleMechanism, missingInformation, nextCheck].every(s => s.length >= 8)) {
    throw new Error('INVALID_AI_RESPONSE');
  }
  const bridges = Array.isArray(item.bridges)
    ? item.bridges.map(parseBridge).filter((b): b is DiscoveryBridge => !!b).slice(0, 2)
    : [];
  const alternativeExplanations = Array.isArray(item.alternativeExplanations)
    ? item.alternativeExplanations.map(v => words(v, 210)).filter(Boolean).slice(0, 3)
    : [];
  return {
    version: 2,
    question: exactQuestion, // Never trust the model to replace the submitted question.
    whatIsReported,
    possibleMechanism,
    alternativeExplanations,
    bridges,
    missingInformation,
    nextCheck,
    meaningCheck: parseMeaning(item.meaningCheck),
  };
}
