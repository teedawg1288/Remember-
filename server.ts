import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import { CURATED_STORIES } from './src/data/curatedStories.ts';
import { buildErasForDilemma } from './src/data/eraBuilder.ts';
import type { SameStoryResult, CrossFieldPrediction, WhatIfScenario, EraProjection } from './src/types/sameStory.ts';

// Attempt to read API key from environment or /app/.dev.env.json
let geminiApiKey = process.env.GEMINI_API_KEY || '';
if (!geminiApiKey && fs.existsSync('/app/.dev.env.json')) {
  try {
    const raw = fs.readFileSync('/app/.dev.env.json', 'utf-8');
    const parsed = JSON.parse(raw);
    if (parsed.GEMINI_API_KEY) {
      geminiApiKey = parsed.GEMINI_API_KEY;
    }
  } catch (err) {
    console.warn('[Server] Could not parse /app/.dev.env.json:', err);
  }
}

// Port resolution according to Cloud Run guidelines
function getPort(): number {
  const envPort = process.env.PORT;
  if (envPort) {
    const p = parseInt(envPort, 10);
    if (!isNaN(p) && p > 0) return p;
  }
  return 3000;
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '4mb' }));

// Security Protection: Deny direct access to secrets, archives, and backend files
app.use((req: Request, res: Response, next: NextFunction) => {
  const p = req.path.toLowerCase();
  if (
    p.endsWith('.env') ||
    p.endsWith('.zip') ||
    p.endsWith('.tar.gz') ||
    p.startsWith('/.git') ||
    p === '/server.ts' ||
    p === '/server.js' ||
    p === '/bun.lock'
  ) {
    res.status(403).json({ error: 'Access to sensitive files is forbidden.' });
    return;
  }
  next();
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    geminiConfigured: !!geminiApiKey,
    curatedCount: CURATED_STORIES.length,
    timestamp: new Date().toISOString(),
  });
});

// Curated stories endpoint
app.get('/api/same-story/curated', (_req: Request, res: Response) => {
  res.json({
    success: true,
    stories: CURATED_STORIES,
  });
});

// In-memory memory storage per user session (fallback for local client state)
const userMemoryStore: Record<string, any> = {};

app.get('/api/user-memory/:userId', (req: Request, res: Response) => {
  const { userId } = req.params;
  const data = userMemoryStore[userId] || {
    id: userId,
    conversationsCount: 0,
    savedDiscoveriesCount: 0,
    personalNotes: [],
    acknowledgedPatterns: [],
    lastActive: new Date().toISOString(),
  };
  res.json({ success: true, memory: data });
});

app.post('/api/user-memory/:userId', (req: Request, res: Response) => {
  const { userId } = req.params;
  const { memory } = req.body;
  userMemoryStore[userId] = {
    ...memory,
    id: userId,
    lastActive: new Date().toISOString(),
  };
  res.json({ success: true, memory: userMemoryStore[userId] });
});

// Main AI Analysis Endpoint for "Same Story, Different Characters"
app.post('/api/same-story/analyze', async (req: Request, res: Response) => {
  const { userInput, persona = 'barber' } = req.body;

  if (!userInput || typeof userInput !== 'string' || !userInput.trim()) {
    res.status(400).json({ error: 'Please tell me what happened or what is on your mind.' });
    return;
  }

  const trimmedInput = userInput.trim();

  // Check if this closely matches one of our rich pre-computed gems
  const lower = trimmedInput.toLowerCase();
  const directMatch = CURATED_STORIES.find((c) => {
    const qLower = c.userOriginalInput.toLowerCase();
    const idLower = c.id.toLowerCase();
    return (
      lower.includes(idLower) ||
      qLower.includes(lower.slice(0, 30)) ||
      lower.includes(qLower.slice(0, 30)) ||
      ((lower.includes('text') || lower.includes('ignore') || lower.includes('reply') || lower.includes('ghost')) && c.id === 'unanswered-text') ||
      ((lower.includes('housework') || lower.includes('chore') || lower.includes('dishes') || lower.includes('clean') || lower.includes('sink')) && c.id === 'housework-chore-trap') ||
      ((lower.includes('child') || lower.includes('tantrum') || lower.includes('parent') || lower.includes('candy') || lower.includes('giving in')) && c.id === 'parent-giving-in') ||
      ((lower.includes('bystander') || lower.includes('responsibility') || lower.includes('someone else') || lower.includes('waits')) && c.id === 'bystander-freeze') ||
      (lower.includes('burnout') && c.id.includes('burnout')) ||
      (lower.includes('70 hours') && c.id.includes('burnout')) ||
      (lower.includes('credit') && c.id.includes('post-success')) ||
      (lower.includes('award') && c.id.includes('post-success')) ||
      (lower.includes('habit') && c.id.includes('habit')) ||
      (lower.includes('willpower') && c.id.includes('willpower')) ||
      (lower.includes('binge') && c.id.includes('habit'))
    );
  });

  // If Gemini API Key is available, run live generation with prompt engineering
  if (geminiApiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey: geminiApiKey });

      const personaTone =
        persona === 'bartender'
          ? 'a thoughtful, candid late-night bartender polishing a glass who has heard thousands of human confessions and cuts straight to the real point with kindness'
          : 'a warm, razor-sharp master barber in a buzzing neighborhood shop who knows everyone, sees all human patterns, and talks with grounded humor, street wisdom, and zero corporate fluff';

      const prompt = `You are REMEMBER's "Same Story, Different Characters" core intelligence engine.
Your voice and demeanor: ${personaTone}.
You talk like a real human sitting right across from someone in a barber chair.
Understand their words even if they use slang, informal phrasing, swearing, or typos.
Never talk like an academic textbook or corporate consultant.

Key Rules:
1. Understand what they are saying in their own words without judging.
2. ABSOLUTE DIGNITY & NO-BOXING RULE: Never use the person's past history, previous mistakes, or saved memories against them. Never assume that past struggles or patterns define who they are "in the now." Never typecast, label, or psychoanalyze them into a permanent personality category (e.g. NEVER say "you're someone who always...", "given your history...", or treat them as a fixed character). The song didn't change; the person did. Past events were situations they navigated, not a permanent diagnosis. Treat every conversation with fresh eyes, unconditional dignity, and total respect for who they are becoming right now.
3. Find 2 to 3 parallel stories across History, Mythology/Religion, Biology/Medicine, Systems Engineering, Everyday Life, or Psychology.
4. Pinpoint the COMMON UNDERLYING STRUCTURE ("What's actually happening underneath").
5. Highlight WHAT IS DIFFERENT and why those differences matter (never claim identical mechanisms without evidence).
6. State the connection plausibility honestly (category: 'repeating_human_behavior', 'structural_isomorphism', 'shared_cultural_origin', or 'unproven_analogy').
7. Provide a BORROWED INSIGHT: What one field already figured out that helps explain what's missing in the other.
8. Ask an UNRESOLVED QUESTION ("What if we've been looking at the wrong part of the problem?").
9. Include:
   - storyChain: 4 simple cause-and-effect steps (whatHappened, whatYouThought, whatYouDid, whatHappenedNext) + alternativeChain (tapPrompt, whatActuallyHappened, whatYouThought, whatYouDid, whatHappenedNext, lesson).
   - rosettaStone: primaryChord (Fear/Love/Loss/Hope/Belonging/Change/Responsibility/Conflict/Growth), oneQuestionThatChangesEverything, translations (what Speaker A said vs meant vs Speaker B heard vs felt, where translation failed, theBridge, and crossFieldTranslation), and lifeLenses (3 places in life: starting_out, heavy_lifting, looking_back with what you couldn't see then and the song metaphor), plus a vignetteCreation.
   - storyArc: what started, what people believed (perception vs reality), reactions, unintended consequences, what kept cycle going, turning point, and levelOfCollapse.
   - differenceThatChangesEverything: Case A survived vs Case B collapsed, the crucial difference, and cross-field application.
   - mirrorEffect: external metaphor, gentle non-judgmental question, objective facts vs subjective perceptions, and blind spot.
   - roundTable: 4 perspectives (Barber, Systems Engineer, Biologist, Historian).
   - whatIfScenarios: 3 interactive What-If alternatives.
   - prediction: Cross-Action Discovery written in simple, everyday language that anyone can easily read in 10 seconds. Propose a relatable real-life test, what another field figured out, and simple observable signs of how they'll know if it worked.
   - deepResearch: formal hypothesis, measurable variables, competing explanations, test protocol, and citations.

User's Story/Situation:
"""${trimmedInput}"""

Return STRICT, VALID JSON ONLY conforming to:
{
  "id": "generated-${Date.now()}",
  "timestamp": "${new Date().toISOString()}",
  "userOriginalInput": ${JSON.stringify(trimmedInput)},
  "userWordsSummary": "1-2 sentences summarizing their situation in plain, empathetic, street-smart terms",
  "barberOpener": "Wait. You know what this reminds me of? ...",
  "underneathMechanism": "Different people, different places, but look at what's happening underneath: ...",
  "storyChain": {
    "defaultChain": {
      "whatHappened": "What started it (1 sentence)",
      "whatYouThought": "The immediate assumption or thought",
      "whatYouDid": "The defensive action or reaction taken",
      "whatHappenedNext": "The counter-reaction or resulting trap"
    },
    "alternativeChain": {
      "tapPrompt": "What if [alternative assumption, e.g. their phone died or they were busy]?",
      "whatActuallyHappened": "A harmless reality or alternative explanation",
      "whatYouThought": "The wiser, calmer reframe",
      "whatYouDid": "The calm, constructive response",
      "whatHappenedNext": "The peaceful, resolved outcome",
      "lesson": "Short, memorable street wisdom lesson"
    }
  },
  "scaleConnections": [
    {
      "level": "personal",
      "levelLabel": "Between Two People",
      "title": "Title on personal scale",
      "setting": "Everyday context",
      "howItAppearsHere": "How it plays out between two people",
      "whatIsTheSame": "The shared underlying dynamic",
      "whatIsDifferent": "Personal emotional stakes",
      "whyTheDifferenceMatters": "Why this scale is unique"
    },
    {
      "level": "group",
      "levelLabel": "In a Workplace or Family",
      "title": "Title on group scale",
      "setting": "Office, team, or family setting",
      "howItAppearsHere": "How this plays out across a department or family",
      "whatIsTheSame": "The shared underlying dynamic",
      "whatIsDifferent": "Social and organizational hierarchy",
      "whyTheDifferenceMatters": "Why this scale is unique"
    },
    {
      "level": "world",
      "levelLabel": "In Nature, Cities or History",
      "title": "Title on world scale",
      "setting": "Geopolitics, ecology, or history",
      "howItAppearsHere": "How this played out in a famous historical event or natural law",
      "whatIsTheSame": "The shared underlying dynamic",
      "whatIsDifferent": "Scale and complexity",
      "whyTheDifferenceMatters": "Why this scale is unique"
    }
  ],
  "rosettaStone": {
    "primaryChord": "Belonging" | "Fear" | "Love" | "Loss" | "Hope" | "Change" | "Responsibility" | "Conflict" | "Growth",
    "secondaryChords": ["Fear", "Conflict"],
    "oneQuestionThatChangesEverything": {
      "question": "Provocative lens-shift question",
      "whyItShiftsTheLens": "Why it dissolves pride or defensiveness"
    },
    "translations": [
      {
        "speakerA": {
          "role": "Speaker A (e.g. You / The Partner)",
          "said": "What was said",
          "meant": "What was actually meant",
          "hiddenNeedOrEmotion": "The hidden need"
        },
        "speakerB": {
          "role": "Speaker B (e.g. Other Person / Child / Coworker)",
          "heard": "What was heard",
          "felt": "What was felt",
          "reactionTriggered": "The reaction"
        },
        "whereTranslationFailed": "Where meaning broke down",
        "theBridge": "How to say it so both feel understood",
        "crossFieldTranslation": {
          "scientificConcept": "Scientific concept name",
          "everydayExperience": "Relatable everyday translation"
        }
      }
    ],
    "lifeLenses": [
      {
        "stageId": "starting_out",
        "stageTitle": "Starting Out (Pride)",
        "tagline": "How it looks when proving yourself",
        "howItAppearsHere": "Description from this stage",
        "whatYouCouldNotSeeThen": "What was invisible",
        "theSongMetaphor": "Musical analogy"
      },
      {
        "stageId": "heavy_lifting",
        "stageTitle": "Carrying The Load (Responsibility)",
        "tagline": "How it looks under real weight",
        "howItAppearsHere": "Description from this stage",
        "whatYouCouldNotSeeThen": "What was invisible",
        "theSongMetaphor": "Musical analogy"
      },
      {
        "stageId": "looking_back",
        "stageTitle": "Looking Back (Grace)",
        "tagline": "How it looks with distance and forgiveness",
        "howItAppearsHere": "Description from this stage",
        "whatYouCouldNotSeeThen": "What was invisible",
        "theSongMetaphor": "Musical analogy"
      }
    ],
    "vignetteCreation": {
      "title": "Creation Vignette Title",
      "type": "micro_story",
      "text": "Evocative artistic micro-story (2-3 sentences)",
      "sensoryImage": "Vivid sensory detail"
    }
  },
  "stories": [
    {
      "id": "story-1",
      "domain": "history" | "mythology_religion" | "science_biology" | "engineering" | "everyday_life" | "psychology",
      "domainLabel": "Domain label",
      "title": "Title",
      "timeAndPlace": "Era and location",
      "characterMapping": [
        { "roleInUserStory": "...", "roleInParallelStory": "...", "realEntity": "..." }
      ],
      "narrative": "Picture this: [barber-style storytelling, 3-4 sentences]",
      "whatActuallyHappened": "Historical/empirical reality",
      "whatThisFieldAlreadyFiguredOut": "Key principle or solution established",
      "historicalRecordOrEvidence": "Documented sources or experiments"
    }
  ],
  "crucialDifferences": [
    { "title": "...", "comparison": "...", "whyThisDifferenceMatters": "..." }
  ],
  "plausibility": {
    "category": "repeating_human_behavior" | "structural_isomorphism" | "shared_cultural_origin" | "unproven_analogy",
    "verdict": "Deep Structural Mechanism" | "Evolved Behavioral Pattern" | "Shared Mythic Root" | "Caution: Superficial Similarity",
    "analysis": "Honest assessment",
    "isProvenMechanism": true
  },
  "borrowedInsight": {
    "donorField": "...",
    "recipientField": "...",
    "whatWasLearnedThere": "...",
    "howItAppliesHere": "Now here's something they figured out in another field that might help us understand this: ..."
  },
  "unresolvedQuestion": {
    "conversationalHook": "What if we've been looking at the wrong part of the problem?",
    "novelQuestion": "Provocative question",
    "testablePossibility": "How to test it"
  },
  "barberClosingWisdom": "Grounded, warm parting wisdom",
  "storyArc": {
    "whatStartedHappening": "...",
    "whatPeopleBelieved": "...",
    "howTheyReacted": "...",
    "whatHappenedBecauseOfReactions": "...",
    "unintendedConsequence": "...",
    "whatKeptTheCycleGoing": "...",
    "turningPoint": "...",
    "whereItCouldHaveGoneDifferently": "...",
    "levelOfCollapse": {
      "levelAppears": "...",
      "levelMaintained": "...",
      "insight": "..."
    }
  },
  "differenceThatChangesEverything": {
    "caseASurvived": { "name": "...", "description": "...", "outcome": "..." },
    "caseBCollapsed": { "name": "...", "description": "...", "outcome": "..." },
    "theCrucialDifference": "...",
    "whyThisExplainsTheOutcome": "...",
    "crossFieldDiscoveryApplication": "..."
  },
  "mirrorEffect": {
    "externalStoryOrMetaphor": "...",
    "gentleReflectionQuestion": "...",
    "objectiveFacts": ["Fact 1", "Fact 2"],
    "subjectivePerceptions": ["Perception 1", "Perception 2"],
    "hiddenBlindSpot": "..."
  },
  "roundTable": [
    { "id": "barber", "name": "The Barber", "role": "Corner Wisdom", "avatar": "💈", "color": "from-amber-600 to-amber-800", "take": "...", "evidenceStrength": "Intuitive / Everyday", "keyPoint": "..." },
    { "id": "engineer", "name": "The Systems Engineer", "role": "Dynamics", "avatar": "⚙️", "color": "from-cyan-600 to-cyan-800", "take": "...", "evidenceStrength": "Empirical / High", "keyPoint": "..." },
    { "id": "biologist", "name": "The Evolutionary Biologist", "role": "Adaptation", "avatar": "🧬", "color": "from-emerald-600 to-emerald-800", "take": "...", "evidenceStrength": "Empirical / High", "keyPoint": "..." },
    { "id": "historian", "name": "The Historian", "role": "Centuries Record", "avatar": "📜", "color": "from-purple-600 to-purple-800", "take": "...", "evidenceStrength": "Behavioral / Medium", "keyPoint": "..." }
  ],
  "whatIfScenarios": [
    { "id": "wi-1", "question": "...", "variableChanged": "...", "simulatedOutcome": "...", "historicalOrScientificBasis": "..." }
  ],
  "prediction": {
    "id": "pred-live-1",
    "timestamp": "${new Date().toISOString()}",
    "questionInvestigated": "...",
    "donorField": "...",
    "targetField": "...",
    "unansweredQuestion": "...",
    "establishedKnowledgeApplied": "...",
    "falsifiablePrediction": "...",
    "evidenceThatWouldProve": "...",
    "evidenceThatWouldDisprove": "...",
    "confidenceRating": "Plausible Hypothesis"
  },
  "deepResearch": {
    "formalHypothesis": "...",
    "measurableVariables": [{ "variable": "...", "measurementMethod": "..." }],
    "competingExplanations": ["...", "..."],
    "proposedTestProtocol": "...",
    "peerReviewedReferences": [{ "citation": "...", "relevance": "..." }]
  }
}`;

      let response;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.7,
          },
        });
      } catch (liteErr) {
        console.warn('[Server] gemini-3.1-flash-lite failed, falling back to gemini-3.8-flash:', liteErr);
        response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.7,
          },
        });
      }

      const text = response.text?.trim() || '';
      let parsed: SameStoryResult;
      try {
        const clean = text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
        parsed = JSON.parse(clean);
        parsed.isCustomGenerated = true;

        if (!parsed.rosettaStone) {
          parsed.rosettaStone = {
            primaryChord: 'Belonging',
            secondaryChords: ['Fear', 'Responsibility'],
            oneQuestionThatChangesEverything: {
              question: "If they were dealing with unseen exhaustion right now, how would you speak to them?",
              whyItShiftsTheLens: "Shifts your posture from defending your pride to understanding their capacity.",
            },
            translations: [
              {
                speakerA: {
                  role: 'Speaker A (The Reacher)',
                  said: parsed.userWordsSummary,
                  meant: 'I want to feel connected and safe in this relationship.',
                  hiddenNeedOrEmotion: 'Need for mutual reassurance.',
                },
                speakerB: {
                  role: 'Speaker B (The Other)',
                  heard: 'You are criticizing me and making demands I cannot meet.',
                  felt: 'Overwhelmed and defensive.',
                  reactionTriggered: 'Withdrawal and distance.',
                },
                whereTranslationFailed: 'A desire for connection was translated as an accusation.',
                theBridge: 'I care about our relationship and just wanted to check in with zero pressure.',
              },
            ],
            lifeLenses: [
              {
                stageId: 'starting_out',
                stageTitle: 'Starting Out (Pride)',
                tagline: 'When every bump feels like an attack on your worth',
                howItAppearsHere: 'Scorekeeping and proving who needs who less.',
                whatYouCouldNotSeeThen: 'That winning an argument often means losing the relationship.',
                theSongMetaphor: 'Listening to fiery defiance tracks in the dark.',
              },
              {
                stageId: 'heavy_lifting',
                stageTitle: 'Carrying The Load (Responsibility)',
                tagline: 'When fatigue teaches you to forgive others',
                howItAppearsHere: 'Recognizing that silence is usually exhaustion, not malice.',
                whatYouCouldNotSeeThen: 'That everyone is carrying heavy invisible luggage.',
                theSongMetaphor: 'Hearing soulful ballads and understanding every lyric.',
              },
              {
                stageId: 'looking_back',
                stageTitle: 'Looking Back (Grace)',
                tagline: 'When life is too short to carry grudges',
                howItAppearsHere: 'Laughing off old friction and holding connection as precious.',
                whatYouCouldNotSeeThen: 'That being right is meaningless compared to being close.',
                theSongMetaphor: 'Listening with warmth to songs that once broke your heart.',
              },
            ],
            vignetteCreation: {
              title: 'The Unspoken Line',
              type: 'micro_story',
              text: 'Two people looked out at the same sunset, each waiting for the other to break the silence, each wishing they knew how to say: I just miss you.',
              sensoryImage: 'The orange dusk fading into violet across empty telephone wires.',
            },
          };
        }

        if (!parsed.eras || parsed.eras.length < 5) {
          parsed.eras = buildErasForDilemma(
            trimmedInput,
            parsed.userWordsSummary,
            parsed.underneathMechanism
          );
        }

        res.json({ success: true, result: parsed });
        return;
      } catch (jsonErr) {
        console.warn('[Server] Failed to parse Gemini JSON output, falling back to heuristic engine:', jsonErr);
      }
    } catch (apiErr: any) {
      console.error('[Server] Gemini generation error:', apiErr?.message || apiErr);
    }
  }

  // Fallback engine: Use direct match or dynamically adapt curated patterns
  if (directMatch) {
    const matchedEras = buildErasForDilemma(
      trimmedInput,
      directMatch.userWordsSummary,
      directMatch.underneathMechanism
    );
    res.json({
      success: true,
      result: {
        ...directMatch,
        userOriginalInput: trimmedInput,
        eras: matchedEras,
        isCustomGenerated: false,
      },
    });
    return;
  }

  // Adaptive heuristic synthesis from curated knowledge base
  const template = CURATED_STORIES[0];
  const synSummary = `You're facing a stubborn impasse where the natural reflex feels like pushing harder against a locked door.`;
  const synUnderneath = `Different people, different places, but look at what's happening underneath: when an established system hits an unexpected bottleneck, doubling down on the old playbook only accelerates fatigue. The structure itself is begging for a phase transition.`;

  const synthesized: SameStoryResult = {
    ...template,
    id: `adaptive-${Date.now()}`,
    timestamp: new Date().toISOString(),
    userOriginalInput: trimmedInput,
    userWordsSummary: synSummary,
    barberOpener: `Wait. You know what this reminds me of? Pull up a chair. You think nobody's ever faced this before, but people have been running headfirst into this exact wall across history and science.`,
    underneathMechanism: synUnderneath,
    eras: buildErasForDilemma(trimmedInput, synSummary, synUnderneath),
    isCustomGenerated: false,
  };

  res.json({
    success: true,
    result: synthesized,
  });
});

// Dedicated Real-Time Prediction Generator (Requirement 7: performs real cross-field investigation)
app.post('/api/same-story/predict', async (req: Request, res: Response) => {
  const { currentDilemma, userFocus } = req.body;

  if (!currentDilemma || typeof currentDilemma !== 'string') {
    res.status(400).json({ error: 'Please provide the current situation to generate a prediction for.' });
    return;
  }

  if (geminiApiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey: geminiApiKey });

      const prompt = `You are REMEMBER's Cross-Action Discovery Engine.
A user is dealing with:
"""${currentDilemma}"""
${userFocus ? `Specific focus/question: """${userFocus}"""` : ''}

CRITICAL LANGUAGE RULE:
Write in clear, warm, everyday English that anyone can read in 10 seconds.
Talk like a sharp, down-to-earth friend at a kitchen table.
NO academic or clinical jargon (do not use words like "falsifiable", "stochastic", "isomorphism", "dispositional", "attribution error", or "retransmission protocol").
Make this a practical, real-world test they can actually go try tomorrow.

How to build it:
1. Borrow an answer from another world (like radio communication, wildlife biology, cooking, sports, emergency medicine, gardening).
2. Tell them what we bet will happen if they try a simple action in their life.
3. Tell them plainly how they'll know if it worked, and how they'll know if it didn't.

Return STRICT, VALID JSON ONLY conforming to:
{
  "id": "prediction-${Date.now()}",
  "timestamp": "${new Date().toISOString()}",
  "questionInvestigated": "Simple everyday question (e.g. 'What happens if you're the first one to smile?')",
  "donorField": "The other field in everyday words (e.g. 'Radio Communication', 'Wildlife Biology', 'Gardening')",
  "targetField": "Everyday Life & Relationships",
  "unansweredQuestion": "The simple question nobody asked yet in plain words",
  "establishedKnowledgeApplied": "What people in that other world figured out, written simply in 1-2 easy sentences",
  "falsifiablePrediction": "A friendly, concrete real-world test (e.g. 'If you give them a casual nod next time, 8 out of 10 times they will smile right back with relief.')",
  "evidenceThatWouldProve": "Simple sign that it worked (what you will actually see or hear)",
  "evidenceThatWouldDisprove": "Simple sign that it didn't work",
  "confidenceRating": "Very Strong Bet" | "Solid Pattern" | "Good Chance"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: prompt,
        config: { responseMimeType: 'application/json', temperature: 0.6 },
      });

      const clean = (response.text || '').replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
      const parsed: CrossFieldPrediction = JSON.parse(clean);
      res.json({ success: true, prediction: parsed });
      return;
    } catch (err: any) {
      console.warn('[Server] Predict endpoint error, falling back:', err?.message || err);
    }
  }

  // Fallback prediction
  const fallback = CURATED_STORIES[0].prediction!;
  res.json({
    success: true,
    prediction: {
      ...fallback,
      id: `pred-fallback-${Date.now()}`,
      timestamp: new Date().toISOString(),
    },
  });
});

// Dedicated Interactive What-If Simulator (Requirement 8)
app.post('/api/same-story/simulate-what-if', async (req: Request, res: Response) => {
  const { currentDilemma, whatIfQuestion } = req.body;

  if (!currentDilemma || !whatIfQuestion) {
    res.status(400).json({ error: 'Missing dilemma or question for what-if simulation.' });
    return;
  }

  if (geminiApiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey: geminiApiKey });

      const prompt = `You are REMEMBER's Interactive Counterfactual Simulation Engine.
Base Situation: """${currentDilemma}"""
User's Counterfactual / What-If Question: """${whatIfQuestion}"""

Simulate what happens if this single variable changes:
- Show how the reaction shifts.
- Show whether a solution creates an unintended consequence elsewhere.
- Provide the historical or scientific basis.

Return STRICT VALID JSON ONLY:
{
  "id": "sim-${Date.now()}",
  "question": ${JSON.stringify(whatIfQuestion)},
  "variableChanged": "Summary of the changed variable",
  "simulatedOutcome": "Detailed 2-3 sentence chain reaction of what happens",
  "historicalOrScientificBasis": "Documented parallel in science or history"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: prompt,
        config: { responseMimeType: 'application/json', temperature: 0.6 },
      });

      const clean = (response.text || '').replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
      const parsed: WhatIfScenario = JSON.parse(clean);
      res.json({ success: true, scenario: parsed });
      return;
    } catch (err: any) {
      console.warn('[Server] What-if simulation error:', err?.message || err);
    }
  }

  // Fallback simulation
  res.json({
    success: true,
    scenario: {
      id: `sim-${Date.now()}`,
      question: whatIfQuestion,
      variableChanged: "Intervention applied to local system constraints",
      simulatedOutcome: "The immediate stress drops by 40%, but downstream queues back up unless the upstream input rate is simultaneously regulated.",
      historicalOrScientificBasis: "Demonstrated in Forrester system dynamics and traffic flow dampening models."
    }
  });
});

async function startServer() {
  const isDev = process.env.NODE_ENV === 'development';
  const distPath = path.resolve(process.cwd(), 'dist');
  const hasDist = fs.existsSync(distPath) && fs.existsSync(path.join(distPath, 'index.html'));

  if (!isDev && hasDist) {
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('[REMEMBER Server] Serving production static files from dist.');
  } else {
    // In development mode, mount Vite middleware for instant hot module reloading and SPA serving
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
      console.log('[REMEMBER Server] Vite middleware mounted for development.');
    } catch (viteErr) {
      console.error('[REMEMBER Server] Failed to mount Vite middleware:', viteErr);
      if (hasDist) {
        app.use(express.static(distPath));
        app.get('*', (_req: Request, res: Response) => {
          res.sendFile(path.join(distPath, 'index.html'));
        });
      }
    }
  }

  const PORT = getPort();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[REMEMBER Server] Running on http://0.0.0.0:${PORT}`);
    console.log(`[REMEMBER Server] Gemini API status: ${geminiApiKey ? 'CONFIGURED' : 'UNCONFIGURED (using curated/heuristic engine)'}`);
  });
}

startServer();
