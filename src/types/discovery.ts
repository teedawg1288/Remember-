/**
 * REMEMBER V2: the one discovery contract.
 * These are model-generated CANDIDATES. No field independently verifies a cause.
 */
export interface DiscoveryStage {
  label: string;
  inOriginal: string;
  inComparison: string;
  sharedFunction: string;
  importantDifference: string;
  // Unfamiliar target-only skills, methods, terms or constraints for this stage.
  // Optional for older saved discoveries.
  newKnowledgeNeeded?: string;
}

export interface DiscoveryBridge {
  originalDomain: string;
  originalSystem: string;
  comparisonDomain: string;
  comparisonSystem: string;
  possibleSharedMechanism: string;
  stages: DiscoveryStage[];
  whatMightTransfer: string;
  whereItBreaks: string;
  howToChallenge: string;
}

export interface MeaningCheck {
  whatWasSaidOrObserved: string;
  possibleIntendedMeaning: string;
  possibleUnderstoodMeaning: string;
  whatRemainsUnknown: string;
  howToClarify: string;
}

export interface DiscoveryPrediction {
  ifCondition: string;
  expectedOutcome: string;
  borrowedFromOtherSystem: string;
  whyItMayFail: string;
  whatWouldDisproveIt: string;
  safeNextCheck: string;
}

export interface DiscoveryScreening {
  status: 'accepted' | 'partial' | 'rejected';
  reason: string;
  causalMatch: string;
  crucialDifference: string;
  // A short reviewer-written translation using the person's confirmed or possible donor experience.
  experienceTranslation?: string;
}

export interface ReportedExperienceChain {
  // Direct excerpts from the submitted question, never model-created events.
  interpretation?: string;
  reaction?: string;
  consequence?: string;
}

export interface CoreDiscovery {
  version: 2;
  question: string;
  whatIsReported: string;
  // Optional for older saved discoveries.
  reportedChain?: ReportedExperienceChain | null;
  possibleMechanism: string;
  alternativeExplanations: string[];
  bridges: DiscoveryBridge[];
  missingInformation: string;
  nextCheck: string;
  meaningCheck: MeaningCheck | null;
  // Optional for V2 saved discoveries written before screening was introduced.
  prediction?: DiscoveryPrediction | null;
  screening?: DiscoveryScreening | null;
}
