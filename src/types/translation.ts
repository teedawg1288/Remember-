export type ScreenId =
  | 'talk'
  | 'visual'
  | 'discoveries'
  | 'discover'
  | 'understand'
  | 'uncover'
  | 'reality'
  | 'move_forward'
  | 'journey'
  | 'same_story'
  | 'missing_engine';

export type MystiqueStyle = 'conversation' | 'visual' | 'comparison' | 'steps';
export type MystiqueDomain = 'everyday' | 'driving' | 'cooking' | 'work' | 'relationships' | 'sports' | 'fixing' | 'tech';
export type MystiqueDetail = 'simple' | 'balanced' | 'deep';

export interface MystiqueProfile {
  style: MystiqueStyle;
  domain: MystiqueDomain;
  detail: MystiqueDetail;
}

export interface RelationshipMapping {
  unfamiliarElement: string;
  familiarElement: string;
  underlyingDynamic: string; // e.g. "Growth & Pruning", "Pressure & Valves", "Feedback Loop", "Filter / Gateway"
  explanation: string;
}

export interface DifferenceBreakdown {
  aspect: string;
  whereComparisonWorks: string;
  whereItFails: string;
  riskOfAssumingIdentical: string;
}

export interface RealWorldActivity {
  title: string;
  description: string;
  type: 'observe' | 'practice' | 'verify' | 'converse';
}

export interface MissingAnalysis {
  establishedFacts: string[];
  assumptionsAndInterpretations: string[];
  missingInformation: string[];
  overlookedConnections: string[];
  alternativeExplanations?: string[];
  usefulRelationships?: string[];
  distinguishingEvidence?: string[];
  questionsToAsk: string[];
  howToResolveUncertainty: string[];
}

export interface BidirectionalInsight {
  unfamiliarToFamiliar: string; // How the familiar reveals the unfamiliar
  familiarToUnfamiliar: string; // What comparing to the unfamiliar reveals back about the familiar system
}

export interface FrameworkFlow {
  reality: string;      // The actual underlying truth
  observation: string;  // What we notice on the surface
  translation: string;  // The bridge between both worlds
  understanding: string;// The spark of insight
  action: string;       // What you can do next
}

export interface VisualStep {
  stepNumber: number;
  title: string;
  unfamiliarScene: string;
  familiarScene: string;
  connectionPoint: string;
  boundaryWarning?: string;
}

export interface VisualExploration {
  visualType: 'dual_scene_comparison' | 'process_flow' | 'system_dynamics' | 'network_diffusion';
  systemAName: string; // The Unfamiliar System
  systemBName: string; // The Familiar Twin
  steps: VisualStep[];
  interactivePrompts: string[];
}

export interface PredictionOutcome {
  id: string;
  scenario: string;
  likelihood: 'most_likely_default' | 'probable_shift' | 'contingent_branch';
  likelihoodExplanation: string;
  timeframeOrTrigger: string;
  influencingFactors: string[];
  whatCouldChangeIt: string;
  verificationTest: {
    howWeFindOut: string;
    falsificationSign: string;
  };
}

export interface CrossFieldDiscovery {
  id: string;
  domain: string;
  title: string;
  whatHappensThere: string;
  connectionType: 'shared_mechanism' | 'structural_parallel';
  whyItMattersHere: string;
  isAlreadyKnownOrNovel: 'well_established_mechanism' | 'uncommon_cross_application' | 'novel_hypothesis';
  untestedCaution: string;
}

export interface TestablePredictionRecord {
  id: string;
  topic: string;
  dateCreated: string;
  predictionSummary: string;
  assumptions: string[];
  whatCouldChangeIt: string;
  howToTest: string;
  falsificationCriteria: string;
  actualResult?: string;
  actualResultDate?: string;
  outcomeMatch?: 'confirmed' | 'partially_confirmed' | 'diverged' | 'pending';
  learningNote?: string;
}

export interface TranslationResult {
  id: string;
  unfamiliarTopic: string;
  familiarDomain: string;
  headlineSummary: string;
  simplicityLevel: 'standard' | 'simple' | 'deep';
  frameworkFlow: FrameworkFlow;
  visualExploration?: VisualExploration;
  section1Connects: {
    summary: string;
    narrative: string;
    realLifeExamples: string[];
    mappings: RelationshipMapping[];
  };
  section2Differences: {
    summary: string;
    breakdowns: DifferenceBreakdown[];
  };
  section3Missing: MissingAnalysis;
  section4NextSteps: {
    summary: string;
    practicalSteps: string[];
    verificationMethods: string[];
    cautionaryLimitations?: string;
  };
  bidirectionalInsights: BidirectionalInsight;
  realWorldActivities?: RealWorldActivity[];
  predictions?: PredictionOutcome[];
  crossFieldDiscoveries?: CrossFieldDiscovery[];
  providerUsed?: 'openai' | 'gemini' | 'builtin';
  modelUsed?: string;
  investigation?: CrossFieldInvestigation;
  predictionTestResult?: PredictionTestVerification;
  userIntentDetected?: 'prediction' | 'testing' | 'investigation' | 'comparison' | 'understanding';
}

export interface PredictionDataPoint {
  cycle: number;
  actual?: number;
  predicted?: number;
  baseline?: number;
  isWithheld?: boolean;
}

export interface PredictionTestVerification {
  datasetName: string;
  source: string;
  totalCyclesOrSamples: number;
  trainingPercent: number;
  splitCycle: number;
  metricUnit: string;
  eolThreshold?: number;
  actualEolCycle?: number;
  modelPredictedEolCycle?: number;
  baselinePredictedEolCycle?: number;
  eolCycleError: number;
  baselineEolCycleError: number;
  modelRmse: number;
  baselineRmse: number;
  modelMae: number;
  baselineMae: number;
  dataPoints: PredictionDataPoint[];
  methodology: string;
  withheldValidationSummary: string;
  whatIsMissingForRealWorldTesting: string;
  providerUsed?: string;
  modelUsed?: string;
}

export interface ComputationalTestDetail {
  formulaOrLaw: string;
  variableA: string;
  variableB: string;
  calculatedCorrelation: string;
  interpretation: string;
  simulatedObservation: string;
}

export interface CrossFieldInvestigation {
  id: string;
  topic: string;
  primaryDomain: string;
  investigatedDomain: string;
  requiresApprovalForDeep?: boolean;
  estimatedTokenCost?: string;
  synthesizedMechanism: string;
  computationalTest: ComputationalTestDetail;
  challengeSelfCritique: string;
  evidenceSeparation: {
    empiricallyDocumented: string[];
    untestedHypothesis: string[];
  };
  additionalFieldsBroughtIn?: string[];
  missingQuestion: string;
  approvalStatus: 'automatic_summary' | 'deep_investigation_complete';
  providerUsed?: string;
  modelUsed?: string;
}

export interface AIProviderStatus {
  openAiConfigured: boolean;
  geminiConfigured: boolean;
  defaultProvider: 'openai' | 'gemini';
  models: {
    openai: string;
    gemini: string;
  };
  usage: {
    totalRequests: number;
    openAiRequests: number;
    openAiTokens: number;
    geminiRequests: number;
    fallbackActivations: number;
    lastOpenAiError: { timestamp: string; message: string; status?: number } | null;
  };
  rateLimits: {
    maxRequestsPerMinute: number;
    currentWindowRequests: number;
  };
}

export interface RealityCheckResult {
  id: string;
  topic: string;
  whatActuallyHappened: string[];
  whatWasDirectlyObserved: string[];
  whatThePersonIsFeeling: string[];
  whatThePersonBelievesHappened: string[];
  whatAvailableEvidenceSupports: string[];
  whatRemainsUncertain: string[];
  misinformationGuard: string;
  summaryGuidance: string;
  ageAppropriateNote?: string;
}

export interface GetUnstuckResult {
  id: string;
  situation: string;
  whatsPreventingProgress: string[];
  whatUserCanControl: string[];
  whatUserCannotControl: string[];
  whatInformationIsStillNeeded: string[];
  oneReasonableNextStep: string;
  howToEvaluateOutcome: string;
  isRepetitiveLoopDetected: boolean;
  loopBreakChoices: {
    choice1Investigate: string;
    choice2Action: string;
    choice3LeaveUnresolved: string;
  };
}

export interface UnderstandingMomentFeedback {
  userExplanation: string;
  reflectionAssessment: {
    isAccurate: boolean;
    whatIsSpotOn: string;
    whatWasOverlookedOrMissing: string | null;
    encouragement: string;
  };
  everydayApplication: {
    title: string;
    scenario: string;
    actionableInsight: string;
  };
}

export interface DomainSuggestion {
  domain: string;
  reason: string;
  exampleParallel: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface SavedJourneyItem {
  id: string;
  topic: string;
  domain: string;
  headline: string;
  savedAt: string;
  userNotes?: string;
  unresolvedQuestions?: string[];
  translation?: TranslationResult;
  realityCheck?: RealityCheckResult;
  getUnstuck?: GetUnstuckResult;
  practicalOutsideAction?: PracticalOutsideAction;
  predictions?: PredictionOutcome[];
  crossFieldDiscoveries?: CrossFieldDiscovery[];
  testableRecord?: TestablePredictionRecord;
  autonomousJob?: AutonomousDiscoveryJob;
}

export interface PracticalOutsideAction {
  title: string;
  description: string;
  verificationStep: string;
}

export interface IntelligentTriageResult {
  targetScreen: ScreenId;
  reason: string;
  extractedTopic: string;
  suggestedFamiliarDomain?: string;
  alternativeScreens: Array<{
    screen: ScreenId;
    label: string;
    reason: string;
  }>;
}

export interface ActiveProblemContext {
  id: string;
  originalQuery: string;
  extractedTopic: string;
  targetScreen: ScreenId;
  triageReason: string;
  suggestedFamiliarDomain?: string;
  alternativeScreens: Array<{
    screen: ScreenId;
    label: string;
    reason: string;
  }>;
  understandingState?: 'untested' | 'evaluating' | 'understood' | 'needs_adaptation';
  userExplanation?: string;
  evaluationFeedback?: UnderstandingMomentFeedback['reflectionAssessment'];
  practicalOutsideAction?: PracticalOutsideAction;
  activeAnalogyType?: 'mechanical' | 'hydraulic' | 'thermal' | 'electrical' | 'workshop';
  completedStages?: Array<'reality' | 'observation' | 'translation' | 'understanding' | 'action'>;
}

export interface KnownFactItem {
  id: string;
  fact: string;
  sourceCategory: 'documented_history' | 'empirical_science' | 'observed_behavior' | 'direct_evidence';
  verificationConfidence: 'high' | 'medium';
  distinction: string;
}

export interface AssumptionItem {
  id: string;
  assumption: string;
  riskLevel: 'critical' | 'moderate';
  whyUnverified: string;
  commonBias: string;
}

export interface BridgeConnection {
  id: string;
  domain: string;
  title: string;
  historicalOrScientificExample: string;
  connectionType: 'shared_mechanism' | 'shared_pattern';
  connectionStatus: 'supported' | 'hypothesis';
  mechanismOrPatternDescription: string;
  crucialDifference: string;
  disconfirmingEvidence: string;
}

export interface RoundTableNode {
  id: string;
  title: string;
  archetype: 'System Dynamics' | 'Human Psychology' | 'Historical Materialism' | 'Information Asymmetry' | 'Incentive Alignment' | 'Custom';
  keyContribution: string;
  evidenceBrought: string;
  blindSpotOfThisView: string;
  competingHypothesis: string;
  customAdded?: boolean;
}

export interface MissingQuestionItem {
  id: string;
  question: string;
  impactLevel: 'transformational' | 'high' | 'moderate';
  relevance: 'direct' | 'contextual';
  canRealisticallyBeInvestigated: boolean;
  investigationMethod: string;
  whatAnsweringCouldChange: string;
  category: 'unexamined_incentive' | 'absent_data' | 'hidden_variable' | 'counter_factual';
}

export interface FinalTenPercentAnalysis {
  establishedTruths: string[];
  whatRemainsUncertain: string[];
  newPossibilitiesEmerged: string[];
  practicalNextAction: {
    actionTitle: string;
    actionStep: string;
    outcomeTest: string;
    choicePoint: string;
  };
}

export interface MissingQuestionAnalysis {
  id: string;
  query: string;
  topicTitle: string;
  summaryInsight: string;
  knownFacts: KnownFactItem[];
  assumptions: AssumptionItem[];
  bridges: BridgeConnection[];
  roundTableNodes: RoundTableNode[];
  missingQuestions: MissingQuestionItem[];
  finalTenPercent: FinalTenPercentAnalysis;
  evidenceRevisions?: Array<{
    timestamp: string;
    note: string;
  }>;
}

export type DiscoveryJobStatus =
  | 'queued'
  | 'investigating'
  | 'testing_calculations'
  | 'contradiction_check'
  | 'requires_approval'
  | 'completed'
  | 'dismissed';

export interface ExpandingRoundTableField {
  fieldName: string;
  knownContribution: string;
  limitOrMissingPiece: string;
  isExpandingField?: boolean;
}

export interface AutonomousDiscoveryJob {
  id: string;
  status: DiscoveryJobStatus;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;

  // Conceptual Scope
  title: string;
  unansweredQuestion: string;
  primaryFieldA: string;
  primaryFieldB: string;
  expandingFields: ExpandingRoundTableField[];

  // Conversational Findings
  conversationalHeadline:
    | "Here's something interesting I found."
    | "These two fields might have the answer to each other's problem."
    | "I tested that connection, but it didn't hold up."
    | "This idea survived the calculations, but it still needs a real-world experiment."
    | string;
  plainEnglishSummary: string;

  // The Expanding Round Table & Missing Question
  sharedMechanism: string;
  unaskedQuestionDiscovered: string;
  contradictionOrClash: string;
  conditionsWhereItWorks: string[];
  conditionsWhereItFails: string[];

  // Genuine Computational & Mathematical Testing
  computationalTest: ComputationalTestDetail;
  calculationVerdict: 'mathematically_supported' | 'divergent_or_failed' | 'needs_calibration';

  // Rigorous Evidence Separation & Sources
  userId?: string;
  executionMethod?: 'live_ai_inquiry' | 'genuine_computational_proof' | 'deterministic_framework';
  executionAuditLog?: Array<{
    step: string;
    timestamp: string;
    detail: string;
    status: 'executed' | 'skipped' | 'verified';
    provider?: string;
    model?: string;
  }>;
  verifiedFactsWithSources?: Array<{
    fact: string;
    source: string;
    citationUrl?: string;
  }>;
  calculatedResultsWithFormulas?: Array<{
    formula: string;
    inputs: Record<string, any>;
    calculatedOutput: string;
    interpretation: string;
  }>;
  proposedHypotheses?: Array<{
    hypothesis: string;
    falsificationTest: string;
    testStatus: 'untested' | 'partially_tested';
  }>;
  analogiesWithBoundaries?: Array<{
    analogy: string;
    whereItWorks: string;
    whereItBreaksDown: string;
  }>;

  evidenceSeparation: {
    empiricallyDocumented: string[];
    newlyGeneratedHypothesis: string[];
    computationalResult: string[];
    realWorldValidationStatus: string;
  };

  // Cost, Safety & Approval Safeguards
  isDeepInvestigation: boolean;
  requiresApproval: boolean;
  estimatedTokens: number;
  tokensConsumed?: number;
  providerUsed?: string;
  modelUsed?: string;
  userApproved?: boolean;

  // Presentation & Journaling
  wasNotified?: boolean;
  isSavedToDiscoveries?: boolean;
  userNotes?: string;
}


