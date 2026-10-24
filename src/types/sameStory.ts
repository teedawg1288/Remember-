export type StoryDomain =
  | 'everyday_life'
  | 'history'
  | 'mythology_religion'
  | 'science_biology'
  | 'engineering'
  | 'psychology';

export interface CharacterMapping {
  roleInUserStory: string;
  roleInParallelStory: string;
  realEntity: string;
}

// User Request 2: Simple Interactive Visual - The Story Chain
export interface StoryChainStep {
  whatHappened: string;
  whatYouThought: string;
  whatYouDid: string;
  whatHappenedNext: string;
}

export interface StoryChainAlternative {
  tapPrompt: string; // e.g. "What if their phone died or they were driving?"
  whatActuallyHappened: string;
  whatYouThought: string;
  whatYouDid: string;
  whatHappenedNext: string;
  lesson: string;
}

export interface InteractiveStoryChainData {
  defaultChain: StoryChainStep;
  alternativeChain: StoryChainAlternative;
}

// User Request 3: Start Small, Then Reveal The Bigger Connections
export interface ScaleConnection {
  level: 'personal' | 'group' | 'world';
  levelLabel: string; // "Between Two Friends" -> "In a Family / Team" -> "In a Whole City / History"
  title: string;
  setting: string;
  howItAppearsHere: string;
  whatIsTheSame: string;
  whatIsDifferent: string;
  whyTheDifferenceMatters: string;
}

export interface StoryParallel {
  id: string;
  domain: StoryDomain;
  domainLabel: string;
  title: string;
  timeAndPlace: string;
  characterMapping: CharacterMapping[];
  narrative: string; // Simple, human storytelling
  whatActuallyHappened: string;
  whatThisFieldAlreadyFiguredOut: string;
  historicalRecordOrEvidence: string;
  sourceUrl?: string; // A candidate source link, never automatically treated as verified
}

export interface CrucialDifference {
  title: string;
  comparison: string;
  whyThisDifferenceMatters: string;
}

export interface ConnectionPlausibility {
  category: 'repeating_human_behavior' | 'structural_isomorphism' | 'shared_cultural_origin' | 'unproven_analogy';
  verdict: 'Deep Structural Mechanism' | 'Evolved Behavioral Pattern' | 'Shared Mythic Root' | 'Caution: Superficial Similarity';
  analysis: string;
  isProvenMechanism: boolean;
}

export interface BorrowedInsight {
  donorField: string;
  recipientField: string;
  whatWasLearnedThere: string;
  howItAppliesHere: string;
}

export interface UnresolvedQuestion {
  conversationalHook: string;
  novelQuestion: string;
  testablePossibility: string;
}

export interface DeepResearchLab {
  formalHypothesis: string;
  measurableVariables: { variable: string; measurementMethod: string }[];
  competingExplanations: string[];
  proposedTestProtocol: string;
  peerReviewedReferences: {
    citation: string;
    doiOrSource?: string;
    relevance: string;
  }[];
}

export interface StoryDevelopmentArc {
  whatStartedHappening: string;
  whatPeopleBelieved: string;
  howTheyReacted: string;
  whatHappenedBecauseOfReactions: string;
  unintendedConsequence: string;
  whatKeptTheCycleGoing: string;
  turningPoint: string;
  whereItCouldHaveGoneDifferently: string;
  levelOfCollapse: {
    levelAppears: string;
    levelMaintained: string;
    insight: string;
  };
}

export interface DifferenceThatChangesEverything {
  caseASurvived: {
    name: string;
    description: string;
    outcome: string;
  };
  caseBCollapsed: {
    name: string;
    description: string;
    outcome: string;
  };
  theCrucialDifference: string;
  whyThisExplainsTheOutcome: string;
  crossFieldDiscoveryApplication: string;
}

export interface MirrorEffect {
  externalStoryOrMetaphor: string;
  gentleReflectionQuestion: string;
  objectiveFacts: string[];
  subjectivePerceptions: string[];
  hiddenBlindSpot: string;
}

export interface MechanismBridgeStage {
  stage: string;
  inOriginalSystem: string;
  inComparisonSystem: string;
  sameFunction: string;
  importantDifference: string;
}

export interface MechanismBridge {
  id: string;
  originalDomain: string;
  originalSystem: string;
  comparisonDomain: string;
  comparisonSystem: string;
  sharedMechanism: string;
  reasonForComparison: string;
  stages: MechanismBridgeStage[];
  possibleTransfer: string;
  transferLimit: string;
  safeNextCheck: string;
}

export interface RoundTablePerspective {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
  take: string;
  evidenceStrength: 'Empirical / High' | 'Behavioral / Medium' | 'Intuitive / Everyday';
  keyPoint: string;
  whatCouldChangeMyMind?: string;
  questionForOtherSeats?: string;
}

export interface WhatIfScenario {
  id: string;
  question: string;
  variableChanged: string;
  simulatedOutcome: string;
  historicalOrScientificBasis: string;
}

export interface CrossFieldPrediction {
  id: string;
  timestamp: string;
  questionInvestigated: string;
  donorField: string;
  targetField: string;
  unansweredQuestion: string;
  establishedKnowledgeApplied: string;
  falsifiablePrediction: string;
  evidenceThatWouldProve: string;
  evidenceThatWouldDisprove: string;
  sourceUrl?: string; // Candidate evidence for the donor mechanism
  transferLimit?: string; // Where the analogy may stop applying
  knownInUserSituation?: string; // User-provided starting point, not an inference
  predictionStages?: {
    borrowedFinding: string;
    newPrediction: string;
    howToTest: string;
  };
  confidenceRating:
    | 'Empirically Supported Model'
    | 'Plausible Hypothesis'
    | 'Emerging Cross-Field Bridge'
    | 'Very Strong Bet'
    | 'Solid Pattern'
    | 'Good Chance';
}

export interface LivingRosettaStone {
  primaryChord: UniversalHumanChord;
  secondaryChords: UniversalHumanChord[];
  oneQuestionThatChangesEverything: {
    question: string;
    whyItShiftsTheLens: string;
  };
  translations: RosettaTranslationLayer[];
  lifeLenses: LifeLensStage[];
  vignetteCreation: {
    title: string;
    type: 'micro_story' | 'song_analogy' | 'visual_moment';
    text: string;
    sensoryImage: string;
  };
}

export type UniversalHumanChord =
  | 'Fear'
  | 'Love'
  | 'Loss'
  | 'Hope'
  | 'Belonging'
  | 'Change'
  | 'Responsibility'
  | 'Conflict'
  | 'Growth';

export interface RosettaTranslationLayer {
  speakerA: {
    role: string;
    said: string;
    meant: string;
    hiddenNeedOrEmotion: string;
  };
  speakerB: {
    role: string;
    heard: string;
    understoodMeaning?: string; // Stage 4: What they understood those words to mean
    isConfirmedInterpretation?: boolean; // Whether confirmed or speculative
    felt: string;
    reactionTriggered: string;
    consequenceOfReaction?: string; // Stage 7: What happened because of the reaction
  };
  meaningShiftPoint?: string; // The exact point where the meaning changed
  whereTranslationFailed: string;
  theBridge: string;
  crossFieldTranslation?: {
    scientificConcept: string;
    everydayExperience: string;
  };
}

export interface LifeLensStage {
  stageId: 'starting_out' | 'heavy_lifting' | 'looking_back';
  stageTitle: string;
  tagline: string;
  howItAppearsHere: string;
  whatYouCouldNotSeeThen: string;
  theSongMetaphor: string;
}

export interface EraProjection {
  id: string;
  year: string;
  label: string;
  setting: string;
  technology: string;
  costume: string;
  howTheDilemmaAppeared: string;
  whatTheyAssumed: string;
  whatActuallyHappened: string;
  quote: string;
  visualAtmosphere: {
    artStyle: string;
    lighting: string;
    colorPalette: string[];
    sceneryDetail: string;
    sensoryDetail: string;
    sceneSvgType: 'bronze_age' | 'classical_athens' | 'industrial_dawn' | 'digital_present' | 'orbital_colony';
  };
}

// Compare what was sent with what each side may have understood, in both directions.
export interface MeaningDirection {
  from: string;
  to: string;
  observableWordsOrSignal: string;
  possibleIntendedMeaningOrFunction: string;
  possibleReceivedMeaningOrEffect: string;
  whatWouldConfirm: string;
}

export interface MeaningSynchronization {
  contextType: 'people' | 'systems' | 'mixed';
  assignedRoleOrTitle: string;
  whatThatRoleActuallyEstablishes: string;
  whatItDoesNotProve: string;
  directions: MeaningDirection[];
  informationAvailableThen: string;
  informationMissingThen: string;
  consequenceOrImpact: string;
  newInformationOrOpportunity: string;
  choiceAndResponsibilityNow: string;
  commonGround: string;
  unknowns: string;
  nextMutualCheck: string;
  authorityAccountabilityCheck?: {
    authorityGranted: string;
    responsibilityOwed: string;
    conductObserved: string;
    whoBenefits: string;
    unverifiedConcern: string;
    checkForAccountability: string;
  };
}

export interface SameStoryResult {
  id: string;
  timestamp: string;
  userOriginalInput: string;
  userWordsSummary: string;
  familiarStartingPoint?: string;
  evidenceNotice?: string;
  questionRouting?: {
    inferredNeed: string;
    signalInQuestion: string;
    whyTheseSeats: string;
    isTentative: boolean;
  };
  roundTableSynthesis?: {
    sharedGround: string;
    keyDisagreement: string;
    missingEvidence: string;
    nextCheck: string;
  };
  barberOpener: string; // "Wait. You know what this reminds me of?"
  underneathMechanism: string;
  stories: StoryParallel[];
  crucialDifferences: CrucialDifference[];
  plausibility: ConnectionPlausibility;
  borrowedInsight: BorrowedInsight;
  unresolvedQuestion: UnresolvedQuestion;
  barberClosingWisdom: string;
  deepResearch: DeepResearchLab;
  storyChain?: InteractiveStoryChainData;
  scaleConnections?: ScaleConnection[];
  rosettaStone?: LivingRosettaStone;
  userResonanceVerdict?: 'resonates' | 'partially_resonates' | 'not_my_story';
  userPersonalTakeaway?: string;
  storyArc?: StoryDevelopmentArc;
  differenceThatChangesEverything?: DifferenceThatChangesEverything;
  mirrorEffect?: MirrorEffect;
  roundTable?: RoundTablePerspective[];
  mechanismBridges?: MechanismBridge[];
  meaningSynchronization?: MeaningSynchronization;
  whatIfScenarios?: WhatIfScenario[];
  prediction?: CrossFieldPrediction;
  eras?: EraProjection[];
  isCustomGenerated?: boolean;
}

export interface UserMemoryProfile {
  id: string;
  preferredName?: string;
  favoriteArchetypes: string[];
  effectiveExplanationStyle: 'barbershop_stories' | 'visual_diagrams' | 'historical_parallels' | 'engineering_models';
  conversationsCount: number;
  savedDiscoveriesCount: number;
  personalNotes: string[];
  acknowledgedPatterns: string[];
  lastActive: string;
}
