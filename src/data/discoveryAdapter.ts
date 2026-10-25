import type { SameStoryResult, MechanismBridge } from '../types/sameStory';
import type { CoreDiscovery } from '../types/discovery';

/**
 * Preserve the existing saved-discoveries format without generating fake
 * histories, research citations, emotions or predictions for V2 questions.
 * The V2 screen reads coreDiscovery; legacy screens continue reading V1 data.
 */
export function discoveryToSavedResult(core: CoreDiscovery): SameStoryResult {
  const first = core.bridges[0];
  const now = new Date().toISOString();
  const mappedBridges: MechanismBridge[] = core.bridges.map((bridge, i) => ({
    id: 'core-bridge-' + (i + 1),
    originalDomain: bridge.originalDomain,
    originalSystem: bridge.originalSystem,
    comparisonDomain: bridge.comparisonDomain,
    comparisonSystem: bridge.comparisonSystem,
    sharedMechanism: bridge.possibleSharedMechanism,
    reasonForComparison: 'A proposed match between causal functions, not verified equivalence.',
    stages: bridge.stages.map(s => ({
      stage: s.label,
      inOriginalSystem: s.inOriginal,
      inComparisonSystem: s.inComparison,
      sameFunction: s.sharedFunction,
      importantDifference: s.importantDifference,
    })),
    possibleTransfer: bridge.whatMightTransfer,
    transferLimit: bridge.whereItBreaks,
    safeNextCheck: bridge.howToChallenge,
  }));
  return {
    id: 'core-' + Date.now(),
    timestamp: now,
    userOriginalInput: core.question,
    userWordsSummary: core.whatIsReported,
    barberOpener: '',
    underneathMechanism: core.possibleMechanism,
    stories: [],
    crucialDifferences: core.bridges.map(bridge => ({
      title: 'Where the comparison differs',
      comparison: bridge.whereItBreaks,
      whyThisDifferenceMatters: 'A shared structure does not establish the same cause.',
    })),
    plausibility: {
      category: 'unproven_analogy',
      verdict: 'Caution: Superficial Similarity',
      analysis: 'Structural candidate; independently unverified.',
      isProvenMechanism: false,
    },
    borrowedInsight: {
      donorField: first?.comparisonDomain || 'Not identified',
      recipientField: first?.originalDomain || 'Current question',
      whatWasLearnedThere: first?.whatMightTransfer || 'No coherent cross-system candidate yet.',
      howItAppliesHere: first?.howToChallenge || core.nextCheck,
    },
    unresolvedQuestion: {
      conversationalHook: core.missingInformation,
      novelQuestion: core.missingInformation,
      testablePossibility: core.nextCheck,
    },
    barberClosingWisdom: '',
    deepResearch: {
      formalHypothesis: '',
      measurableVariables: [],
      competingExplanations: [],
      proposedTestProtocol: '',
      peerReviewedReferences: [],
    },
    mechanismBridges: mappedBridges,
    evidenceNotice: 'Model-proposed mechanisms and transfers, not independently verified.',
    isCustomGenerated: true,
    coreDiscovery: core,
  };
}
