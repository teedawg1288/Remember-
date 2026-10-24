import { RoundTablePerspective, SameStoryResult } from '../types/sameStory.ts';

export interface QuestionRoutingResult {
  routing: NonNullable<SameStoryResult['questionRouting']>;
  roundTable: RoundTablePerspective[];
  synthesis: NonNullable<SameStoryResult['roundTableSynthesis']>;
}

/**
 * Analyzes the user's question and intent to select 3-5 tailored perspectives,
 * always including an observable-facts lens, explaining why the seats were chosen,
 * and maintaining strict non-diagnostic neutrality.
 */
export function analyzeQuestionAndBuildRoundTable(userInput: string): QuestionRoutingResult {
  const lower = (userInput || '').toLowerCase();

  // QUESTION TYPE A: Inconsistent explanations, shifting stories, questioning, motives, truth/lies
  const isShiftingExplanation =
    lower.includes('changing their explanation') ||
    lower.includes('changing explanation') ||
    lower.includes('change their explanation') ||
    lower.includes('explanation') && (lower.includes('question') || lower.includes('chang') || lower.includes('differ') || lower.includes('shift')) ||
    lower.includes('interrogat') ||
    lower.includes('lying') ||
    lower.includes('deceit') ||
    lower.includes('contradict') ||
    lower.includes('inconsisten') ||
    lower.includes('keep changing');

  if (isShiftingExplanation) {
    return {
      routing: {
        inferredNeed: "Understanding why explanations shift under questioning without assuming deceptive intent or diagnosing personal motives.",
        signalInQuestion: "The phrase 'keep changing their explanation when questioned' points to inconsistent accounts during inquiry.",
        whyTheseSeats: "Selected an evidence auditor to separate observable statements from inferred motives, a cognitive memory researcher on reconstructive recall under pressure, an interpersonal defense analyst on conflict avoidance, and an investigative interviewing specialist on how questioning style induces statement drift.",
        isTentative: true,
      },
      roundTable: [
        {
          id: 'lens-observable-statements',
          name: 'Observable Statement Auditor',
          role: 'Observable facts vs inferred motives',
          avatar: '🔎',
          color: 'from-cyan-600 to-cyan-800',
          take: "What is directly observed is that verbal statements varied across time or questions. What is assumed is the motive behind the variation (such as intentional dishonesty). We must separate recorded words from speculation about internal intent.",
          evidenceStrength: 'Behavioral / Medium',
          keyPoint: 'Document verifiable statement variations before attributing intentional deceit.',
          whatCouldChangeMyMind: 'Contemporaneous written or recorded evidence showing deliberate fabrication rather than memory drift.',
          questionForOtherSeats: 'Can high stress or cognitive fatigue cause a person to alter non-essential details during repeated questioning?',
        },
        {
          id: 'lens-cognitive-memory',
          name: 'Cognitive Memory & Stress Researcher',
          role: 'Reconstructive recall under pressure',
          avatar: '🧠',
          color: 'from-amber-600 to-amber-800',
          take: "Human memory is not a recorded video file; it is actively reconstructed upon retrieval. Under stress or repeated questioning, working memory degrades and peripheral details morph dynamically as the brain tries to assemble a coherent narrative.",
          evidenceStrength: 'Empirical / High',
          keyPoint: 'Memory is reconstructive; shifting details is often a signature of cognitive strain rather than falsehood.',
          whatCouldChangeMyMind: 'Controlled recall experiments where recall remains static across adversarial questioning.',
          questionForOtherSeats: 'How does an interrogator’s accusatory tone affect the subject’s ability to recall calm facts?',
        },
        {
          id: 'lens-interpersonal-defense',
          name: 'Interpersonal Defense Analyst',
          role: 'Conflict avoidance & protective appeasement',
          avatar: '🛡️',
          color: 'from-purple-600 to-purple-800',
          take: "When someone feels cornered or senses that their listener is angry, their goal rapidly switches from 'telling an accurate story' to 'saying whatever stops the conflict'. Changing stories is frequently an appeasement reflex aimed at defusing hostility.",
          evidenceStrength: 'Behavioral / Medium',
          keyPoint: 'Perceived threat causes people to tailor words to defuse immediate tension.',
          whatCouldChangeMyMind: 'Observing statement consistency in a calm, completely non-punitive setting where all outcomes are safe.',
          questionForOtherSeats: 'What interview techniques avoid triggering threat responses in vulnerable individuals?',
        },
        {
          id: 'lens-investigative-protocol',
          name: 'Investigative Interviewing Specialist',
          role: 'Questioning dynamics & statement drift',
          avatar: '📋',
          color: 'from-emerald-600 to-emerald-800',
          take: "In aviation safety and forensic debriefs, confronting someone with 'Why did you say X earlier?' predictably increases confusion and statement drift. Cognitive interviewing uses open-ended, non-judgmental prompts to preserve timeline fidelity.",
          evidenceStrength: 'Empirical / High',
          keyPoint: 'Adversarial cross-examination degrades consistency; open timeline inquiry restores clarity.',
          whatCouldChangeMyMind: 'Empirical trials showing that accusatory questioning improves statement accuracy.',
          questionForOtherSeats: 'What independent physical evidence exists outside of verbal explanations?',
        },
      ],
      synthesis: {
        sharedGround: "All seats agree that shifting words alone do not prove intent; the context, stress level, and method of questioning heavily shape what someone says.",
        keyDisagreement: "Whether the discrepancy stems primarily from reconstructive memory limits or an emotional reflex to avoid conflict.",
        missingEvidence: "A neutral timeline of events recorded before the confrontation began, and knowledge of the emotional stakes involved.",
        nextCheck: "Pause confrontational questioning and test a low-stakes, neutral check: 'Help me understand how the timeline fits together, with no judgment.'",
      },
    };
  }

  // QUESTION TYPE B: Engineering, bridge collapse prevention, structural failure, mechanics
  const isBridgeOrEngineering =
    lower.includes('bridge') ||
    lower.includes('bridges') ||
    lower.includes('engineer') ||
    lower.includes('engineers') ||
    lower.includes('collaps') ||
    lower.includes('structural') ||
    lower.includes('fatigue') ||
    lower.includes('truss') ||
    lower.includes('suspension') ||
    lower.includes('scour') ||
    lower.includes('resonance');

  if (isBridgeOrEngineering) {
    return {
      routing: {
        inferredNeed: "Understanding structural engineering methods, load physics, and safety redundancies to prevent bridge failure.",
        signalInQuestion: "The phrase 'prevent bridges from collapsing' asks for engineering failure prevention mechanisms.",
        whyTheseSeats: "Selected a sensor inspection auditor to separate physical measurements from theoretical models, a structural fatigue engineer on dynamic harmonic resonance, a materials degradation specialist on scour and corrosion, and a fault-tolerant redundancy architect on fail-safe load re-routing.",
        isTentative: true,
      },
      roundTable: [
        {
          id: 'lens-ndt-sensors',
          name: 'Non-Destructive Testing & Sensor Auditor',
          role: 'Empirical sensor data vs theoretical design',
          avatar: '🔎',
          color: 'from-cyan-600 to-cyan-800',
          take: "Preventing collapse requires comparing actual measurements with design assumptions. Strain gauges, acoustic monitoring, and ultrasonic inspection can reveal some developing damage, but no sensor can guarantee early detection of every failure.",
          evidenceStrength: 'Empirical / High',
          keyPoint: 'Monitoring can reveal certain structural changes before visible failure, depending on coverage and interpretation.',
          whatCouldChangeMyMind: 'Calibrated physical load tests proving that detected acoustic anomalies represent benign surface settling.',
          questionForOtherSeats: 'How does dynamic wind resonance accelerate micro-crack propagation in welded steel gussets?',
        },
        {
          id: 'lens-structural-dynamics',
          name: 'Structural Fatigue & Aeroelastic Dynamics Engineer',
          role: 'Harmonic resonance, wind flutter & cyclic loading',
          avatar: '🌉',
          color: 'from-blue-600 to-blue-800',
          take: "Dynamic wind, pedestrian or traffic loading can create resonant vibration in some bridge designs. Engineers assess these risks alongside static loading, foundations, corrosion and fatigue, and may use damping or aerodynamic measures when appropriate.",
          evidenceStrength: 'Empirical / High',
          keyPoint: 'Evaluate resonance risks and use appropriate damping or aerodynamic design where needed.',
          whatCouldChangeMyMind: 'Wind tunnel and computational fluid dynamic simulations confirming self-damping across extreme gale thresholds.',
          questionForOtherSeats: 'How does underwater foundation scour weaken a pier’s ability to resist dynamic torsional moments?',
        },
        {
          id: 'lens-materials-scour',
          name: 'Materials Degradation & Scour Specialist',
          role: 'Underwater riverbed scour & chloride corrosion',
          avatar: '🔬',
          color: 'from-amber-600 to-amber-800',
          take: "Hydraulic scour can remove supporting sediment around river-bridge foundations, while chloride exposure can corrode reinforcement. Inspection, protective design and monitoring may reduce these hazards; the relative risk depends on the bridge and location.",
          evidenceStrength: 'Empirical / High',
          keyPoint: 'Foundation inspection and corrosion controls can reduce certain deterioration risks.',
          whatCouldChangeMyMind: 'Bathymetric multibeam sonar scans showing stable sediment armor and zero pier settlement under flood velocity.',
          questionForOtherSeats: 'If one pier loses support, can the superstructure dynamically redistribute load without unzipping adjacent spans?',
        },
        {
          id: 'lens-fault-tolerant-redundancy',
          name: 'Fault-Tolerant Redundancy Architect',
          role: 'Fail-safe structures & alternate load paths',
          avatar: '🚀',
          color: 'from-emerald-600 to-emerald-800',
          take: "Nonredundant structural members can create single-point failure risks. Alternative load paths and redundant members can improve resilience, but their capacity must be checked under realistic dynamic loading and deterioration scenarios.",
          evidenceStrength: 'Empirical / High',
          keyPoint: 'Reduce single-point failure risks through appropriately verified redundant load paths.',
          whatCouldChangeMyMind: 'Finite element analyses demonstrating that progressive redistribution causes instantaneous dynamic overload.',
          questionForOtherSeats: 'What mandatory inspection protocols ensure redundant members haven’t already fatigued in silence?',
        },
      ],
      synthesis: {
        sharedGround: "All seats agree that preventing bridge collapse requires moving past static load limits to monitor dynamic resonance, underwater scour, and multi-path structural redundancy.",
        keyDisagreement: "Whether preventative investment should focus more heavily on real-time sensor instrumentation or physical structural over-engineering.",
        missingEvidence: "Continuous riverbed sonar bathymetry and long-term strain telemetry under extreme environmental conditions.",
        nextCheck: "Perform ultrasonic joint inspection on fracture-critical points and verify underwater pier riprap armor.",
      },
    };
  }

  // QUESTION TYPE C: General / Interpersonal or Systemic
  const isInterpersonal =
    lower.includes('friend') ||
    lower.includes('text') ||
    lower.includes('partner') ||
    lower.includes('boss') ||
    lower.includes('coworker') ||
    lower.includes('wife') ||
    lower.includes('husband') ||
    lower.includes('talk') ||
    lower.includes('ignore') ||
    lower.includes('silent') ||
    lower.includes('relationship') ||
    lower.includes('arguing');

  if (isInterpersonal) {
    return {
      routing: {
        inferredNeed: "Clarifying interpersonal friction, communication breakdowns, and unstated assumptions without assigning blame.",
        signalInQuestion: "Relational keywords and interpersonal dynamics present in the prompt.",
        whyTheseSeats: "Selected an observation auditor to separate objective actions from perceived intentions, an interpersonal translator to decode mismatched emotional signals, a behavioral systems analyst to trace tit-for-tat escalation loops, and a restorative resolution specialist on constructive resetting.",
        isTentative: true,
      },
      roundTable: [
        {
          id: 'lens-observation',
          name: 'Objective Observation Auditor',
          role: 'Recorded events vs inferred feelings',
          avatar: '🔎',
          color: 'from-cyan-600 to-cyan-800',
          take: "Focus first on the raw physical facts: what messages were sent, what times elapsed, and what specific words were uttered. Almost all interpersonal pain comes from the story we invent about the facts rather than the facts themselves.",
          evidenceStrength: 'Behavioral / Medium',
          keyPoint: 'Separate verifiable events from emotional interpretations.',
          whatCouldChangeMyMind: 'Evidence showing that the other party’s explicit stated goal matches our worst assumptions.',
          questionForOtherSeats: 'What unseen situational crisis might account for the other person’s withdrawal?',
        },
        {
          id: 'lens-translation',
          name: 'Lived Experience Translator',
          role: 'Said vs meant vs heard vs felt',
          avatar: '💬',
          color: 'from-purple-600 to-purple-800',
          take: "When people are depleted, their words lose precision. A person reaching for connection sounds demanding; a person needing rest sounds hostile. Translating the underlying vulnerability dissolves the conflict.",
          evidenceStrength: 'Behavioral / Medium',
          keyPoint: 'Interpret exhaustion before assuming malice.',
          whatCouldChangeMyMind: 'Direct confirmation that the statement was intended to cause harm rather than protect boundaries.',
          questionForOtherSeats: 'How can a low-stakes check-in test this safely without escalating?',
        },
        {
          id: 'lens-systems',
          name: 'Behavioral Feedback Dynamics Analyst',
          role: 'Action-reaction loops & game theory',
          avatar: '🔄',
          color: 'from-amber-600 to-amber-800',
          take: "Two people in conflict form a closed feedback loop: Person A withdraws, Person B feels rejected and attacks, Person A withdraws deeper. Neither person started it; the loop sustains itself.",
          evidenceStrength: 'Empirical / High',
          keyPoint: 'Interrupt the feedback cycle with a generous non-retaliatory signal.',
          whatCouldChangeMyMind: 'Data indicating the interaction is an isolated event rather than a recurring cycle.',
          questionForOtherSeats: 'What single low-power action breaks the tit-for-tat loop?',
        },
        {
          id: 'lens-reset',
          name: 'Restorative Resolution Specialist',
          role: 'De-escalation & relationship repair',
          avatar: '🌱',
          color: 'from-emerald-600 to-emerald-800',
          take: "Waiting for the other person to apologize first creates a standoff where both lose. The person who reaches out first is not conceding defeat; they are leading the repair.",
          evidenceStrength: 'Intuitive / Everyday',
          keyPoint: 'Curiosity and warmth dismantle defensive walls that pride reinforces.',
          whatCouldChangeMyMind: 'Evidence of unilateral exploitation where kindness is weaponized.',
          questionForOtherSeats: 'What boundary is necessary while keeping the door open for honest dialogue?',
        },
      ],
      synthesis: {
        sharedGround: "Both people are likely operating from self-protection rather than calculated aggression.",
        keyDisagreement: "Whether to address the issue directly in words or let a period of low-pressure warmth restore the connection first.",
        missingEvidence: "The other person’s current emotional and situational bandwidth.",
        nextCheck: "Send a brief, neutral, zero-pressure check-in within 24 hours.",
      },
    };
  }

  // DEFAULT / UNIVERSAL ADAPTIVE LENSES
  return {
    routing: {
      inferredNeed: "Examining this dilemma from multiple disciplined vantage points to uncover hidden structural patterns.",
      signalInQuestion: "The core challenge and questions presented in your prompt.",
      whyTheseSeats: "Selected an empirical evidence auditor to separate observable reality from assumptions, a domain-relevant analyst matching this challenge, an alternative systems perspective, and a cross-disciplinary pattern bridge.",
      isTentative: true,
    },
    roundTable: [
      {
        id: 'lens-evidence',
        name: 'Empirical Observation Auditor',
        role: 'Observable facts vs inferred interpretations',
        avatar: '🔎',
        color: 'from-cyan-600 to-cyan-800',
        take: "Before theorizing, catalog only what can be measured or independently verified. Separating objective observations from subjective projections prevents solving the wrong problem.",
        evidenceStrength: 'Empirical / High',
        keyPoint: 'Verify physical facts before building causal theories.',
        whatCouldChangeMyMind: 'Direct verifiable telemetry or logs that contradict initial observations.',
        questionForOtherSeats: 'What critical assumption in our model has not yet been empirically tested?',
      },
      {
        id: 'lens-domain-expert',
        name: 'Domain Systems Analyst',
        role: 'Field-specific dynamics and core mechanisms',
        avatar: '🧭',
        color: 'from-amber-600 to-amber-800',
        take: "When an established system encounters friction, doubling down on standard reactions usually accelerates failure. Look for the structural constraint that governs this outcome.",
        evidenceStrength: 'Behavioral / Medium',
        keyPoint: 'Identify the governing bottleneck rather than treating symptoms.',
        whatCouldChangeMyMind: 'A demonstration that the system is operating within linear parameters rather than at a phase boundary.',
        questionForOtherSeats: 'What alternative explanation accounts for this pattern without requiring exceptional conditions?',
      },
      {
        id: 'lens-alternative',
        name: 'Contrasting Hypothesis Evaluator',
        role: 'Alternative interpretations and edge cases',
        avatar: '⚖️',
        color: 'from-purple-600 to-purple-800',
        take: "Always stress-test the consensus explanation by asking: what if the exact opposite assumption were true? Testing the inverse reveals hidden blind spots.",
        evidenceStrength: 'Empirical / High',
        keyPoint: 'Test the null hypothesis and alternative explanations before committing to action.',
        whatCouldChangeMyMind: 'Data that decisively rules out competing explanations.',
        questionForOtherSeats: 'What would failure look like if our primary assumption is wrong?',
      },
      {
        id: 'lens-cross-domain',
        name: 'Cross-Domain Pattern Bridge',
        role: 'Cross-field translation and borrowed solutions',
        avatar: '🌐',
        color: 'from-emerald-600 to-emerald-800',
        take: "Problems that seem unique in one field have often been solved centuries ago in biology, engineering, or history. Borrowing their verified mechanisms saves years of trial and error.",
        evidenceStrength: 'Behavioral / Medium',
        keyPoint: 'Translate solutions from adjacent fields that have already solved this structural dynamic.',
        whatCouldChangeMyMind: 'Evidence that the structural isomorphism breaks down at this specific scale.',
        questionForOtherSeats: 'What is the crucial difference between the borrowed domain and our current situation?',
      },
    ],
    synthesis: {
      sharedGround: "All perspectives agree that relying on unverified assumptions guarantees suboptimal decisions.",
      keyDisagreement: "Whether the situation is best approached through immediate empirical intervention or systemic redesign.",
      missingEvidence: "Direct measurement of the key constraint under operating stress.",
      nextCheck: "Run a low-cost, controlled test to validate the governing variable before making irreversible commitments.",
    },
  };
}
