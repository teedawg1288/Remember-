export interface DocumentedSource {
  title: string;
  authorOrEntity: string;
  year: string;
  citationType: 'primary_source' | 'historical_record' | 'investigative_report' | 'peer_reviewed';
  notes: string;
}

export interface HistoricalCharacter {
  id: string;
  name: string;
  roleTitle: string;
  entity: string;
  avatarType: 'commander' | 'dissenter' | 'promoter' | 'speculator' | 'administrator' | 'merchant' | 'citizen';
  whatTheyKnew: string;
  whatTheyBelievedOrAssumed: string;
  pressuresFaced: string;
  keyDecision: string;
}

export interface ComparableRole {
  roleCategory: string;
  characterA: HistoricalCharacter;
  characterB: HistoricalCharacter;
  sharedRoleDynamic: string;
  crucialDifferenceWarning: string;
}

export interface TurningPoint {
  decisionTitle: string;
  chosenPathway: string;
  alternativePathway: string;
  outcomeDifference: string;
  informationThatCouldHaveHelped: string;
}

export interface TimelinePhase {
  phaseNumber: number;
  title: string;
  eraDateA: string;
  eraDateB: string;
  pressureLevel: number; // 0 to 100
  sceneDescriptionA: string;
  sceneDescriptionB: string;
  causeEffectA: string;
  causeEffectB: string;
  turningPoint?: TurningPoint;
  sharedOperationalMechanism: string;
  whereParallelDiverges: string;
}

export interface BeforeParallel {
  era: string;
  title: string;
  setting: string;
  sharedMechanism: string;
  documentedSource: string;
  evidenceSummary: string;
}

export interface ChangedOutcomeAnalysis {
  pivotPoint: string;
  alternateAction: string;
  plausibleOutcome: string;
  historicalPrecedentOrData: string;
}

export interface ModernReflection {
  modernDomain: string; // e.g. "Workplace & Technology", "Civic / City Planning", "Personal Finance"
  everydayScenario: string;
  sharedMechanism: string;
  keyDifferenceToRemember: string;
  earlyWarningSignal: string;
}

export interface MainDiscoveryNinePoints {
  whatHappened: {
    eventA: string;
    eventB: string;
    synthesis: string;
  };
  whatTheyKnewAtTheTime: {
    knownFactsA: string[];
    knownFactsB: string[];
    blindSpotsSummary: string;
  };
  whatTheyBelievedOrAssumed: {
    assumptionsA: string[];
    assumptionsB: string[];
    sharedCognitiveTrap: string;
  };
  pressuresInfluencingDecisions: {
    externalPressuresA: string[];
    externalPressuresB: string[];
    sharedStressors: string;
  };
  underlyingRelationshipsSimilar: {
    mechanismName: string;
    detailedExplanation: string;
    interactionDynamics: string[];
  };
  whatDifferencesMatter: {
    materialDifferences: string[];
    whyHistoryDoesNotRepeatLiterally: string;
  };
  whatHappenedAfterward: {
    immediateOutcomeA: string;
    immediateOutcomeB: string;
    longTermConsequenceA: string;
    longTermConsequenceB: string;
  };
  informationThatCouldHaveChangedDecisions: {
    criticalMissingData: string[];
    howVerificationCouldHavePreventedFailure: string;
  };
  whatToRecognizeToday: {
    coreInsight: string;
    actionableQuestionsToAsk: string[];
  };
}

export interface HistoricalComparison {
  id: string;
  title: string;
  tagline: string;
  recurringPatternName: string;
  overviewSummary: string;
  eventA: {
    title: string;
    shortLabel: string;
    era: string;
    location: string;
    context: string;
    documentedSources: DocumentedSource[];
  };
  eventB: {
    title: string;
    shortLabel: string;
    era: string;
    location: string;
    context: string;
    documentedSources: DocumentedSource[];
  };
  comparableRoles: ComparableRole[];
  timeline: TimelinePhase[];
  mainDiscovery: MainDiscoveryNinePoints;
  beforeParallels: BeforeParallel[];
  whatCouldHaveChangedOutcome: ChangedOutcomeAnalysis[];
  whereWeSeeThisToday: ModernReflection[];
  personalConnectionPrompt: {
    question: string;
    commonSituations: string[];
    diagnosticAdvice: string;
  };
}
