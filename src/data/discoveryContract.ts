import type { CoreDiscovery, DiscoveryBridge, DiscoveryStage, MeaningCheck, DiscoveryPrediction } from '../types/discovery';
import { hasUnexplainedAcronym, quoteAppearsInQuestion, unsupportedPersonalAttribution, unsupportedCompletedActionAttribution } from './grounding';
import { clearSourceTargetReversal } from './questionAnchors';

// Long model answers must never be sliced through a word without indicating truncation.
const words = (value: unknown, max = 500): string => {
  if (typeof value !== 'string') return '';
  const cleaned = value.trim();
  if (cleaned.length <= max) return cleaned;
  const head = cleaned.slice(0, max);
  const sentenceEnd = Math.max(head.lastIndexOf('. '), head.lastIndexOf('! '), head.lastIndexOf('? '));
  if (sentenceEnd >= Math.floor(max * 0.6)) return head.slice(0, sentenceEnd + 1).trimEnd();
  const wordEnd = head.lastIndexOf(' ');
  return head.slice(0, wordEnd >= Math.floor(max * 0.6) ? wordEnd : max).trimEnd() + '…';
};
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
    // Old saved discoveries do not have this field; they remain readable.
    newKnowledgeNeeded: words(item.newKnowledgeNeeded, 220) || undefined,
  };
  return [stage.label, stage.inOriginal, stage.inComparison, stage.sharedFunction, stage.importantDifference].every(Boolean) ? stage : null;
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
    possibleSharedMechanism: words(item.possibleSharedMechanism, 420),
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
  if (!Object.values(result).every(Boolean)) return null;
  // A generic communication question is not evidence of a reported exchange.
  if (/^(not reported|none reported|not specified|no specific (words|statement))/i.test(result.whatWasSaidOrObserved)) return null;
  return result;
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
    ? item.bridges.map(parseBridge).filter((b): b is DiscoveryBridge => !!b).slice(0, 3)
    : [];
  const alternativeExplanations = Array.isArray(item.alternativeExplanations)
    ? item.alternativeExplanations.map(v => words(v, 210)).filter(Boolean).slice(0, 3)
    : [];
  return {
    version: 2,
    question: exactQuestion, // Never trust the model to replace the submitted question.
    whatIsReported,
    reportedChain: parseReportedChain(item.reportedChain, exactQuestion),
    possibleMechanism,
    alternativeExplanations,
    bridges,
    missingInformation,
    nextCheck,
    meaningCheck: parseMeaning(item.meaningCheck),
  };
}

/** Keep a lived-experience chain ONLY when the user's exact words support it. */
function parseReportedChain(value: unknown, exactQuestion: string): CoreDiscovery['reportedChain'] {
  const item = record(value);
  if (!item) return null;
  const fromQuote = (key: string): string | undefined => {
    const quote = words(item[key], 350);
    return quoteAppearsInQuestion(exactQuestion, quote) ? quote : undefined;
  };
  const chain = {
    interpretation: fromQuote('interpretation'),
    reaction: fromQuote('reaction'),
    consequence: fromQuote('consequence'),
  };
  return Object.values(chain).some(Boolean) ? chain : null;
}

/**
 * A separate, adversarial model pass reviews the proposed analogies. This is
 * still model screening, NOT independent scientific or historical verification.
 * Keep causally plausible comparisons visible without inventing a transfer.
 */
export function applyDiscoveryReview(core: CoreDiscovery, response: unknown): CoreDiscovery {
  const item = record(response);
  if (!item) throw new Error('INVALID_AI_RESPONSE');
  const reason = words(item.reason, 450);
  if (reason.length < 12) throw new Error('INVALID_AI_RESPONSE');
  const rejected = (why: string): CoreDiscovery => ({
    ...core,
    bridges: [],
    prediction: null,
    screening: { status: 'rejected', reason: why, causalMatch: '', crucialDifference: '' },
  });
  if (item.decision === 'reject') return rejected(reason);
  if ((item.decision !== 'accept' && item.decision !== 'compare_only') || !Number.isInteger(item.selectedIndex)) {
    throw new Error('INVALID_AI_RESPONSE');
  }
  const selectedIndex = Number(item.selectedIndex);
  if (selectedIndex < 0 || selectedIndex >= core.bridges.length) throw new Error('INVALID_AI_RESPONSE');

  const causalMatch = words(item.causalMatch, 450);
  const crucialDifference = words(item.crucialDifference, 450);
  if (causalMatch.length < 15 || crucialDifference.length < 12) {
    return rejected('The comparison did not survive the causal review.');
  }
  const selectedBridge = core.bridges[selectedIndex];
  if (clearSourceTargetReversal(core.question, selectedBridge)) {
    return rejected('The proposed comparison reversed the user\'s known experience and the new subject they asked about.');
  }
  if (selectedBridge.stages.some(stage => unsupportedCompletedActionAttribution(core.question, stage.inComparison))) {
    return rejected('The comparison described a donor action as something the person did without evidence they reported doing it.');
  }
  // A model saying two stages are "the same" is not enough: check the
  // intended effect of each action in BOTH systems. Fail closed if the reviewer
  // did not inspect every stage or cannot account for opposing purposes.
  const rawStageAudit = Array.isArray(item.stagePurposeAudit) ? item.stagePurposeAudit : [];
  if (rawStageAudit.length !== selectedBridge.stages.length) {
    return rejected('A complete check of what each step is meant to accomplish was missing.');
  }
  const checkedIndices = new Set<number>();
  const alignedIndices = new Set<number>();
  const conflicts: string[] = [];
  for (const value of rawStageAudit) {
    const audit = record(value);
    const index = audit?.stageIndex;
    const verdict = audit?.verdict;
    if (!Number.isInteger(index) || Number(index) < 0 ||
        Number(index) >= selectedBridge.stages.length || checkedIndices.has(Number(index)) ||
        !['aligned', 'opposite', 'unverified'].includes(String(verdict)) ||
        words(audit?.donorGoal, 180).length < 8 ||
        words(audit?.targetGoal, 180).length < 8 ||
        words(audit?.reason, 180).length < 8) {
      return rejected('The step-by-step purpose check was incomplete or inconsistent.');
    }
    checkedIndices.add(Number(index));
    if (verdict === 'aligned') alignedIndices.add(Number(index));
    else conflicts.push(selectedBridge.stages[Number(index)].label + ': ' + words(audit?.reason, 180));
  }
  if (alignedIndices.size < 2) {
    return rejected('Fewer than two steps had matching intended effects. The apparent similarity is not a safe learning path.');
  }
  const checkedBridge = conflicts.length
    ? { ...selectedBridge, stages: selectedBridge.stages.filter((_, index) => alignedIndices.has(index)) }
    : selectedBridge;
  const checkedCausalMatch = conflicts.length
    ? 'Only these steps may carry over: ' + checkedBridge.stages.map(stage => stage.sharedFunction).join('; ') + '.'
    : causalMatch;
  const checkedDifference = conflicts.length
    ? 'Nonmatching steps were excluded: ' + conflicts.join('; ') + '. ' + crucialDifference
    : crucialDifference;
  // The reviewer must not promote an invented action or intention as a user fact.
  if (unsupportedPersonalAttribution(core.question, [causalMatch, crucialDifference, selectedBridge.whereItBreaks].join(' ')) ||
      unsupportedCompletedActionAttribution(core.question, [causalMatch, crucialDifference, selectedBridge.whereItBreaks].join(' '))) {
    return rejected('The comparison assigned the person an action or intention they did not report.');
  }
  const rawExperienceTranslation = words(item.experienceTranslation, 350);
  const experienceTranslation = rawExperienceTranslation.length >= 25 &&
    !hasUnexplainedAcronym(rawExperienceTranslation) &&
    !unsupportedPersonalAttribution(core.question, rawExperienceTranslation) &&
    !unsupportedCompletedActionAttribution(core.question, rawExperienceTranslation)
      ? rawExperienceTranslation : undefined;
  const compareOnly = (why: string): CoreDiscovery => ({
    ...core,
    bridges: [checkedBridge],
    prediction: null,
    screening: {
      status: 'partial', reason: why, causalMatch: checkedCausalMatch,
      crucialDifference: checkedDifference,
      experienceTranslation: conflicts.length ? undefined : experienceTranslation,
    },
  });
  // A useful parallel is not automatically a transferable prediction.
  if (item.decision === 'compare_only') return compareOnly(reason);
  const proposed = record(item.prediction);
  const prediction: DiscoveryPrediction | null = proposed ? {
    // The visible labels already say "If:" / "Then we might see:". Models
    // sometimes repeat those words; strip only the label, not the condition.
    ifCondition: words(proposed.ifCondition, 350).replace(/^if\b\s*:?[ \t]*/i, '').trim(),
    expectedOutcome: words(proposed.expectedOutcome, 350)
      .replace(/^then\b(?:\s+we\s+(?:might|may|could|would)\s+see)?\s*:?[ \t]*/i, '').trim(),
    borrowedFromOtherSystem: words(proposed.borrowedFromOtherSystem, 450),
    whyItMayFail: words(proposed.whyItMayFail, 350),
    whatWouldDisproveIt: words(proposed.whatWouldDisproveIt, 350),
    safeNextCheck: words(proposed.safeNextCheck, 350),
  } : null;
  if (!prediction || Object.values(prediction).some(value => value.length < 12) ||
      unsupportedPersonalAttribution(core.question, Object.values(prediction).join(' ')) ||
      unsupportedCompletedActionAttribution(core.question, Object.values(prediction).join(' '))) {
    return compareOnly('The causal parallel remains possible, but no clear, testable prediction survived.');
  }
  if (conflicts.length) {
    const predictionStages = Array.isArray(item.predictionStageIndices) ? item.predictionStageIndices : [];
    const anchors = new Set(predictionStages.filter((index: unknown) => Number.isInteger(index)) as number[]);
    // If any rejected stage is necessary, the prediction is still withheld.
    // An explicitly isolated two-stage transfer can survive unrelated gaps.
    if (anchors.size < 2 || anchors.size !== predictionStages.length ||
        [...anchors].some(index => !alignedIndices.has(index)) ||
        item.predictionScopedToAlignedStages !== true) {
      return compareOnly('Some stages do not match. No separately reviewed prediction was grounded only in the remaining causal steps. ' + checkedDifference);
    }
    return {
      ...core,
      bridges: [checkedBridge],
      prediction,
      screening: {
        status: 'accepted', reason: reason + ' Only the audited matching stages support this question.',
        causalMatch: checkedCausalMatch, crucialDifference: checkedDifference,
        experienceTranslation: undefined,
      },
    };
  }
  return {
    ...core,
    bridges: [core.bridges[selectedIndex]],
    prediction,
    screening: { status: 'accepted', reason, causalMatch, crucialDifference, experienceTranslation },
  };
}
