# The Last 10%: Unified Learning Journey & Adaptive Discovery Upgrade

An integrated, cohesive learning experience connecting Discover, Understand, Uncover, Reality, Forward, Journey, and History. When someone describes a problem in their own words, intelligent triage guides them directly to the most impactful tool, keeps their context preserved across screens, tests understanding through self-articulation, adapts seamlessly to everyday physical analogies if confused, and provides a concrete real-world action once understood.

### User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural decisions were confirmed through interactive clarification and form the core specification for this upgrade:

- **Confirmed Decision 1: Direct Intelligent Triage with Quick Switch Options**: When a user describes a situation or dilemma, the system analyzes the root need (conceptual translation, blind spot discovery, reality verification, decision paralysis, or recurring historical pattern) and routes directly to the optimal screen while displaying a one-tap alternative switcher.
- **Confirmed Decision 2: Adaptive Physical Analogies**: If a user does not understand or requests an alternative explanation, the system adapts the explanation to an everyday physical or mechanical analogy (hydraulic pressure, mechanical levers, engine friction, or thermal balance) with interactive visual simulations, rather than repeating the same conceptual text.
- **Confirmed Decision 3: Persistent Cross-Screen Context Banner**: A persistent, mobile-optimized context banner stays active across all screens, preserving the user's initial inquiry, displaying the current active lens, and offering one-tap transfers to any other tool without losing their working state.

---

### 1. Overview & Core Concept

- **What It Does**: Unifies the seven existing analytical tools of *The Last 10%* into a singular, conversational, and visual learning pipeline. Instead of requiring the user to guess whether they need "Discover", "Reality", "Uncover", or "Same Story", they simply articulate what they are facing. The system routes them to the right tool, carries their context across every screen, presents interactive physical visuals, verifies their understanding in their own words, and concludes with a practical real-world exercise.
- **Target Audience / Persona**: Inquisitive learners, professionals navigating complex decisions, and people dealing with information overload who need clarity on unfamiliar topics, organizational dynamics, or confusing life situations.
- **Key Value**: Eliminates screen fragmentation. Moves the user from passive reading to active recognition, tactile visual exploration, self-demonstrated comprehension, and measurable real-world application.

---

### 2. User Experience & Visual Design

#### Key User Flows

```
┌────────────────────────────────────────────────────────────────────────┐
│                       1. Problem Intake & Triage                       │
│  User types problem in plain language -> Intelligent Triage Engine      │
│  selects optimal tool (Understand, Uncover, Reality, Forward, History) │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│               2. Direct Route & Persistent Context Bar                 │
│  Screen loads with tailored analysis. Persistent Context Banner pins   │
│  the user's original words with 1-tap quick transfers to other tools.  │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│               3. Interactive Lived-Experience Visuals                  │
│  Interactive SVG visual components (Court vs Mechanic, Battery, Engine,│
│  or Dual Relationship Nodes) allow physical manipulation of variables. │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│               4. Inline Demonstration of Understanding                 │
│  "Explain it in your own words" prompt at the foot of each analysis.   │
│  Evaluates conceptual grasp, highlights accurate elements.             │
└──────────────────┬─────────────────────────────────┬───────────────────┘
                   │                                 │
         Understood (Accurate)             Not Understood (Confused)
                   │                                 │
                   ▼                                 ▼
┌──────────────────────────────────────┐ ┌───────────────────────────────┐
│       5. Practical Outside Action    │ │  6. Adaptive Physical Analogy │
│  Single measurable real-world action │ │  Pivots to everyday physical  │
│  with verification test. Save to     │ │  metaphor with interactive    │
│  Journey with 1 tap.                 │ │  visual adjustment.           │
└──────────────────────────────────────┘ └───────────────────────────────┘
```

#### Visual Identity & Theme
- **Color Palette & Distribution (60-30-10 Rule)**:
  - *Dominant Canvas (60%)*: Deep slate midnight background (`#0F172A` / `bg-slate-900`) providing high-contrast visual focus.
  - *Structural Panels (30%)*: Subdued charcoal cards (`#1E293B` / `bg-slate-850`) with subtle hairline borders (`border-slate-800`), avoiding nested card-in-card clutter.
  - *Semantic Focal Accents (10%)*: Radiant Teal (`#14B8A6` / `text-teal-400`), Warm Amber (`#F59E0B`) for uncertainty/assumptions, Coral Red (`#EF4444`) for high-pressure friction, and Soft Indigo (`#6366F1`) for historical patterns.
- **Typography & Hierarchy**:
  - Display Title: Modern serif headings (`font-serif`, 24px–32px) for intellectual weight and warmth.
  - Body Prose: Clear geometric sans (`font-sans`, 15px–16px, 1.6 line height) constrained to `max-w-2xl` with `text-wrap: balance` to eliminate orphan words.
  - Monospace Data: `font-mono tabular-nums text-xs` for metrics, dates, and historical pressure levels.
- **Mobile-First Android Polish**:
  - Touch targets strictly $\ge 44\text{px}$ across all buttons, tabs, sliders, and pills.
  - Pinned context bar designed with safe-area paddings and collapsible summary mode so it never obstructs the mobile bottom navigation.
  - Zero horizontal overflow (`overflow-x-hidden`) on mobile viewports.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Direct Intelligent Triage vs. Multi-Step Quiz**
  - *Chosen Approach*: Instant single-field triage that routes immediately with explicit "Routed to [Tool Name]" banner and instant quick-switch chips.
  - *Why*: Users seeking clarity are already experiencing cognitive friction; forcing them through a diagnostic quiz increases drop-off. Instant routing with easy escape hatches provides immediate value.
  - *Alternatives Considered*: Multi-step diagnostic wizard was rejected for excessive friction.
- **Decision 2: Persistent Context Banner vs. Modal / Sidebar**
  - *Chosen Approach*: A non-intrusive sticky header strip below the primary navbar that displays the active problem summary, current lens, and 1-tap transfer pills.
  - *Why*: Keeps the user grounded in their own original question as they move between lenses (e.g. from Reality Check to Uncover to Understand).
  - *Alternatives Considered*: Slide-out drawer was rejected because it hides the active context until explicitly opened.
- **Decision 3: Adaptive Physical Analogy Switching**
  - *Chosen Approach*: When a user indicates confusion or submits an incomplete understanding check, the server switches the analogical domain to a concrete everyday physical mechanism (e.g. hydraulic valves, automobile brakes, thermal expansion) and updates the interactive diagram.
  - *Why*: Repeating the same conceptual explanation in different words fails when the root metaphor doesn't match the user's mental model. Shifting to physical, sensory mechanics produces instant breakthroughs.
- **Decision 4: Private Reasoning Engine Separation**
  - *Chosen Approach*: Internal scoring equations, pattern-matching rules, and system prompts remain strictly executed in Node.js server endpoints (`/api/intelligent-triage`, `/api/translate`, `/api/test-understanding`, `/api/adapt-comparison`, `/api/same-story-compare`). The client receives only structured, actionable results.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                              Client App                                │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    Header & Global Navigation                    │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  ActiveContextBanner: Persistent Problem Context & Quick Jump   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  ┌───────────────────────── Viewport Manager ───────────────────────┐  │
│  │                                                                  │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────────────────┐ │  │
│  │  │DiscoverScreen│  │ Understand   │  │ Uncover / Reality /     │ │  │
│  │  │(Intake &     │  │ Screen       │  │ MoveForward / SameStory │ │  │
│  │  │ Triage)      │  │ (Adaptive)   │  │ (Context-Aware)         │ │  │
│  │  └───────┬──────┘  └──────┬───────┘  └────────────┬────────────┘ │  │
│  │          │                │                       │              │  │
│  │          ▼                ▼                       ▼              │  │
│  │    ┌──────────────────────────────────────────────────────────┐  │  │
│  │    │ Inline UnderstandingCheck & OutsideApplicationAction     │  │  │
│  │    └──────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │               BottomTabBar (Mobile-First Touch Nav)              │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTPS (JSON)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     Node.js / Express Server API                       │
│                                                                        │
│  /api/intelligent-triage     ──> Classifies problem & picks best screen│
│  /api/translate              ──> Analogical translation & structure    │
│  /api/adapt-comparison       ──> Generates alternative physical analogy│
│  /api/test-understanding     ──> Evaluates user's own-words explanation│
│  /api/reality-check          ──> Deconstructs facts vs feelings        │
│  /api/get-unstuck            ──> Concrete low-stakes forward pathways  │
│  /api/same-story-compare     ──> Historical pattern & timeline engine  │
└────────────────────────────────────────────────────────────────────────┘
```

#### State Model (`ActiveProblemContext`)
```typescript
export interface ActiveProblemContext {
  id: string;
  problemQuery: string;            // User's own words
  extractedTopic: string;          // Extracted core subject
  recommendedScreen: ScreenId;     // Optimal tool determined by triage
  triageReason: string;            // Why this screen helps most
  familiarDomain?: string;         // Domain used for translation
  currentAnalogyType?: 'mechanical' | 'hydraulic' | 'thermal' | 'electrical';
  understandingState: 'pending' | 'evaluating' | 'understood' | 'needs_adaptation';
  userExplanation?: string;
  practicalAction?: {
    title: string;
    description: string;
    verificationStep: string;
  };
  historyCount: number;
}
```

#### Verification & Test Plan
1. **Intelligent Triage Verification**: Test intake of 4 diverse problem statements (conceptual inquiry, rumor checking, decision paralysis, recurring organizational loop) and verify instant routing to matching screen with active context preserved.
2. **Persistent Context Banner**: Verify that navigation across all 7 screens retains the active question, displays 1-tap quick transfers, and safely accommodates mobile viewports without covering the bottom bar.
3. **Inline Understanding & Outside Application**: Test submitting a summary in own words on UnderstandScreen, confirm real-world practical action is surfaced upon accuracy, and verify 1-tap save to My Journey.
4. **Adaptive Analogy Switch**: Trigger "Still confused / change comparison", verify backend returns an alternative everyday physical mechanism with updated interactive visual nodes.
5. **Android Responsiveness & Build**: Run `compile_applet` and test clean layout, no horizontal scroll, and $\ge 44\text{px}$ touch targets.
