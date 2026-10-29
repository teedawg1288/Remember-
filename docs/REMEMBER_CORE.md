# REMEMBER — Governing Discovery Contract (Version 2)

This is the product source of truth. Older AI Studio chat instructions,
curated sample stories and view-specific prompts are not competing specifications.

## Purpose

REMEMBER starts with the system the person does NOT understand: the target of
their question. It finds one or more other systems whose workings the person
may already understand from experience (potential donors). It maps real
cause-and-effect steps, translates known donor knowledge into an explanation
or OPEN prediction question about the unknown target, challenges the match,
and identifies missing information or a discriminating check.

A shared label or dramatic story is not evidence of the same causal mechanism.

## Experience-first translation and user ownership (Version 2.5)

The person asks about something unfamiliar. REMEMBER first identifies relevant
knowledge they have demonstrated, or offers a donor example **conditionally**
if familiarity has not been established. It traces the donor process from its
relevant starting point through causes, constraints, actions and consequences,
then translates each matching part of the unfamiliar target in the person's
own language. It explains target-specific differences without reteaching the
donor skill. Multiple donors may explain different sub-processes.

**Three different things must stay separate:** (1) what was observed or
explicitly reported, (2) the meaning the speaker actually intended, if
confirmed, and (3) the meaning a listener or the model attributed to it.
A model interpretation is not the user's intention. When the user corrects an
interpretation, accept the correction and update the explanation. Do not
turn an illustrative analogy into a diagnosis, a literal story about the user,
or an unrelated feature.

REMEMBER evaluates knowledge and claims, never human worth. Swearing, humour,
slang, grammar, race, ethnicity, religion, housing, income, substance use,
sex work, credentials, title or visible appearance do not establish
intelligence, ability, honesty or intended meaning. Never label the user's
wording crude or lesser as a substitute for understanding it. A real audience
or safety risk may be explained specifically without judging the speaker.
Where two people attach different experiences to the same words, clarify
their intended meanings instead of presuming they are interchangeable.

**Discovery through questions, not persuasion:** Cross-examination uses a
possible known donor to invite the user to recognize a connection, without
assigning blame or forcing self-identification with a character or scenario.
A question must be open: what would support this, what would contradict it,
and why is this the next question? A question mark must never disguise an
unsupported assertion. The fact about the donor is a reason to investigate,
not proof of the unfamiliar target. If the bridge fails, say so and explore
another without treating the user's lived experience as incorrect.

**Learning without a required crisis:** Someone can learn a useful lesson
through a story, trade, scientific process or practical experience without
living every possible consequence. Do not claim analogies substitute for
trauma, professional certification or material resources. Separate
transferable knowledge from missing training, equipment, credentials and
access. Success means the person can accurately apply a new idea, recognize
the difference between observation and interpretation, and independently
challenge the bridge; merely agreeing with the app is not success.

**Keep the method behind the interface, not the evidence:** The user sees
the familiar experience, genuinely shared steps, material differences, one
reasoned next question and a way to challenge it. Do not expose a claimed
universal formula or proprietary selection method. Never hide the
uncertainty or crucial limits that make the comparison honest.


## Source-to-target direction (Version 2.4)

A question about a Slurpee machine does NOT establish familiarity with Slurpee
machines. It establishes the topic the person wants to learn. The outside
example is a *candidate donor*, and the app must never claim personal familiarity
unless the person has said so. Invite recognition, e.g. "If you have ever
unclogged a vacuum…" A vacuum blockage may suggest a performance bottleneck
in an unfamiliar computer, but never a literal blockage inside its software.
Repairing a misunderstanding may be a useful comparison for debugging message
exchange, not for all computer faults. Different familiar experiences can
explain different sub-processes of one unknown system. Trace an experience's
relevant sequence and limits before borrowing an insight; matching names,
materials or final products does not establish matching processes.

Prediction flows **from possible familiar donor knowledge to the unfamiliar
target**, in question form; the known donor fact is the reason for asking.
What the user sees is the concrete experience, correspondence, next question,
and why—not the internal selection method or a claimed universal formula.
Where one bridge fails, another outside system may be explored without
pretending the rejected bridge proved anything.

**Secrecy boundary:** Moving explanation logic off-screen does not hide it
from readers of a public code repository or client bundle. Protect any real
proprietary implementation in private server-side code; a prompt visible in
a public repository is not secret.

## Quality gates (Version 2.3)

The first Gemini call creates up to three cross-system causal candidates, not
finished conclusions. A second, lower-temperature Gemini call makes TWO
separate judgments: is there a causal parallel with at least two matching steps,
and can a specific donor lesson be transferred into a testable prediction?
The reviewer returns `accept` (parallel + prediction), `compare_only` (useful
parallel but no justified prediction), or `reject` (no sufficiently mapped
causal parallel). The comparison remains visible in `compare_only`.

This **model-to-model screen is NOT independent scientific verification**.
It is a quality filter against superficial analogies and overconfident
transfers. Reliable claims still require outside evidence. Never use shared
words, an invented named principle, or metaphorical "stored energy" as proof.

An accepted prediction must state: if-condition, expected observation, what
specific knowledge was transferred, why it could fail, what observations would
count against it under comparable conditions and a safe next check. If no
such prediction survives but the shared causal pattern does, keep the
comparison and label its prediction unavailable.
The user sees a brief parallel, with a conditional prediction only if earned;
detailed comparison and caveats remain optional.

**Screening calibration (Version 2.2):** A shared causal *sub-mechanism* does
not require identical materials or entire systems. Ask whether a difference
actually breaks a necessary causal link, merely limits the effect, or explains
where the transfer stops. A shared label or a metaphor is still insufficient.
Unobserved target conditions belong in the prediction's IF clause. A single
uncontrolled outcome or one surviving unit rarely disproves a probabilistic
shared-risk prediction; compare the same conditions and record competing causes.
The user sees plain-language uncertainty; the app must never turn an AI review
into a claim of independent verification. No third automatic AI call is added.

**Prediction counterpart gate:** Causal resemblance alone does not authorize a
prediction. The donor-specific process behind the prediction must have a real,
checkable counterpart in the original system. Do not import healing, learning,
intent or automatic recovery into a system without those functions. If the
shared damage pattern survives but the donor's repair feature does not, the
repair-based prediction must be rejected, but the separate shared damage
pattern can remain visible as `compare_only`. Do not erase a valid parallel
just because a donor-only feature prevents prediction. A model-screened
comparison remains an unverified hypothesis.

For any reviewed comparison, hide the first pass's unreviewed "what this
suggests" sentence. Show a reviewed IF/THEN only after the prediction gate;
otherwise say the causal parallel may hold but no specific prediction earned.
This avoids contradictory claims and reduces explanation clutter.

The second pass adds one Gemini request per question with a viable candidate,
and therefore more latency and potential API usage. No second pass is spent
when the first response has no valid candidates. The system does not claim
independent fact-checking.

## One new-question pipeline

1. **Understand:** Preserve the exact question; separate reports, interpretations
   and unknown facts, including unreported thoughts of another person.
2. **Recognize:** State one candidate causal structure in ordinary words.
3. **Connect:** Seek up to three candidate comparisons in genuinely different
   systems, mapping input, constraint, response and outcome.
4. **Translate:** Explain the correspondence and where it breaks. For
   communication distinguish what was said, heard and UNDERSTOOD; missing
   recipient meanings stay unknown.
5. **Cross-examine:** First decide if a genuine causal parallel exists. Reject
   only when the mapped causal steps do not hold.
6. **Discover:** Separately decide if knowledge from the other system supports a
   bounded prediction and contrary evidence. If not, retain the qualified
   parallel without fabricating an IF/THEN answer.
   Never promise a new scientific fact or a predestined human outcome.

## On-demand cross-examination

When the person taps Cross-Examination, reuse the **selected, reviewed
cross-system comparison** and any already-screened prediction. Do not start
again from only the raw question or silently substitute a more convenient donor.
This remains one **user-triggered** Gemini request; no extra automatic spend.

Present, in plain language:

1. **What is known:** Separate the question's actually reported facts from
   established general mechanisms recalled by the model. The latter are NOT
   independently source-checked; any inferred explanation stays tentative.
2. **Why it could happen:** Map the specific causal stages and name where
   the original situation has not been observed or confirmed.
3. **Prediction as a question:** Ask whether a real donor lesson may produce
   a specific, conditional, previously unknown outcome in the target. It must
   be genuinely open, not a statement hiding behind a question mark. Explain
   the concrete donor or reported fact that led to THIS question, distinguishing
   established general knowledge from facts of the person's situation.
4. **What would answer it:** Name the decisive missing condition and how
   differing observations could change the answer. Internally retain the
   IF/THEN, comparison and same-condition counterevidence so the question
   remains testable; keep those details behind an optional reveal. If no
   valid transfer exists, ask only what information is needed before a
   prediction is possible. Do not invent a predictive conclusion.

The historical era exploration remains optional. A model-generated
general mechanism is not a cited scientific or historical fact. Neither
the initial reviewer nor cross-examination is independent verification.

## What the person sees

- Exact question and what it reports.
- One possible mechanism.
- Cross-system visual with functional stages and limits.
- One question or test that could change the interpretation.

Optional expansions offer alternatives, eras and deeper cross-examination.
The Round Table, life lenses, historical stories, hypothetical simulations
and Research Lab are not mandatory initial outputs.

## Evidence boundaries

- AI-generated candidates are hypotheses, not sourced confirmation.
- An era comparison needs period-appropriate tools/language and independent
  sourcing before it is called documented history.
- Never invent motives, diagnoses, past actions, quotations, success rates,
  capacity limits or causal certainty.
- A test that predicts change needs a comparison condition, not a single
  positive observation. Do not manipulate unwilling people.
- An empty bridge list is an honest unresolved result, not proof that no
  counterpart exists.

## Memory and ownership

Learn tentative language conventions privately from the user's actual words,
not from a required glossary. Current meaning overrides previous assumptions.
Never save sensitive biography as language style. The user controls, erases
and disables learned language. Previous mistakes do not define present identity.

## Backward compatibility

- The old same-story endpoint and V1 saved discoveries remain readable.
- The new discovery endpoint is the default for newly asked questions.
- V2 saves a compact coreDiscovery field within the existing local record.
  Empty documented historical stories are not treated as zero mechanisms.
- Extra cross-examination requires a user-triggered model call.
- Existing curated demonstrations and V1 screens remain available.
- Audit legacy files and duplicates before retirement. Do not delete user data.

## Version 2.6 — Evidence-grounded experience translation

- Treat the question as the unfamiliar **target**, and any independently lived experience as a possible **donor**. The visible interface says the donor is already known only when the question explicitly reports having done or understood it; otherwise familiarity stays conditional.
- The second-pass review may provide one short everyday-language translation of the genuine shared stages. Unexplained acronyms and unsupported assertions about the person are discarded. Causal mechanisms and domain-specific differences remain available on demand.
- For cross-examination, any "reported" causal fact must carry a substantial verbatim quote from the current question. The server checks for that quote and displays the **original words**, not an AI paraphrase presented as the person's fact. When the quote is missing, the alleged fact is omitted.
- The server refuses a leading prediction question or certain unsupported claims that the person believes, ignores, intends or mishandles something. The prediction stays a question about an unknown target condition, with the donor principle, the reason for that question, and what evidence might change the answer.
- Scientific, mechanical, legal and interpersonal generalizations generated by the model are **not independently source-verified** by these checks. Analogy is a learning tool, not a certified repair method or an excuse to claim identical systems. If validation fails, no automatic extra paid model request is made.
- Regression examples include known staircase-repair skills transferred cautiously to an unfamiliar car-door repair, and a familiar vacuum process used to examine an unfamiliar computer problem, without inventing damage or past mistakes.

## Version 2.7 — Simplest matching system first

Before selecting an analogy, privately reduce the unfamiliar target to its simplest accurate working process. "Above" means one step broader and easier to understand—not a higher social role, a grander subject or an automatically universal law. Search for the simplest everyday donor with **two genuinely matching ordered causal steps**. Familiarity learned from the user helps choose between equally sound comparisons; it does not override causality. Then translate from that donor into the unknown target and identify the new target-specific conditions. Do not make the user supply the analogy or display proprietary abstraction rules.

## Version 2.8 — Neutral starter questions

The "Try a sample question" buttons ask ordinary, unanswered questions across unrelated topics without supplying a cause, personal motive, comparison donor, or predicted result. **Every button uses the same live discovery request as typed questions**, not the legacy curated-story substitution. The interface explains that these examples invoke live AI and may require API availability. Prepared stories, where used elsewhere, must remain clearly separate. Avoid inserting hardcoded named showcase analogies into discovery/review prompts; evaluate the question actually submitted.


## Version 2.9 — Experience-to-completion bridge

The user may know how to complete a process in one area without knowing the vocabulary, tools or specific technique in another. REMEMBER must first consider a genuinely **confirmed** lived experience if the person's question supplies one. Otherwise it proposes a possible donor conditionally. It then:

1. Identifies the unfamiliar target outcome and its simplest correct functional process.
2. Reconstructs the donor's relevant sequence without inventing the person's steps.
3. Maps 3–5 real ordered stages from known experience to unfamiliar target action or understanding.
4. Translates the new system's words into what each step *does*, while keeping correct technical meanings.
5. Identifies at each stage exactly what additional target-only knowledge, tools, limits or qualifications are needed.
6. Screens each transferred step and asks one open, evidence-grounded question about an unverified target condition.

A familiar working order is a learning advantage, **not** automatic mastery, licensure, safety or proof that the target works identically. When only a sub-process transfers, present that bounded transfer and its remaining gaps. Do not turn any one donor into the canonical analogy for every future question. Keep the abstraction method private; keep the observed facts, steps, and caveats visible.


## Version 2.10 — Observation, interpretation, response, outcome

A situation question may contain several different kinds of claims. Keep them distinct:
the observed or reported event, the **meaning the person assigned**, what they say
they did in response, and the consequence they say followed. The model cannot fill
in missing intentions, actions or outcomes. A consequence is real when reported
but does not itself establish that the earlier interpretation was correct.
A neutral reassessment question asks what new observation would change the reading.
This is not a moral claim about what people freely choose to experience.

The optional reportedChain is extracted as **verbatim excerpts** from the
current user question and rejected if the words cannot be found there.
The UI shows it only when at least one of its stages is actually stated.
Older saved discoveries without the field continue to render.
This sits alongside—not instead of—the cross-domain experience translation,
target-only skill gaps, causal screening and question-led prediction.


## Version 2.11 — Matching purpose before matching steps

A visually similar action or the same workflow label is **not** necessarily
the same function. Every candidate donor stage is checked for the goal its
action is intended to cause or prevent, separately from the target stage.
Preparation for release or non-stick behavior cannot be described as equivalent
to preparation for bonding, even if both begin with surface treatment.

The independent model reviewer now supplies a stage-by-stage intended-purpose
audit: `aligned`, `opposite`, or `unverified`. The server fails closed when
the audit is missing or malformed. Opposite and unverified stages are removed
from visible "same function" mappings. If fewer than two genuinely aligned
stages remain, the whole bridge is rejected. When a bounded sub-process remains,
it is shown only as a tentative comparison, and the former prediction is
withheld pending a fresh review. This is still AI screening, not proof of
scientific equivalence.

Cross-examination must also avoid quietly manufacturing an outcome: hearing
that instructions are confusing does not establish that anyone attempted or
failed the task. Any consequence not reported belongs in a conditional
hypothesis, never a description of reality. Questions and translations must
use plain language and avoid unnecessary specialized words.

## WORDS: origins and conceptual associations

WORDS has curated, publicly checkable examples of two different questions:
(1) the attested linguistic history of a word, including historical meanings,
and (2) why a person or culture applied a word or metaphor to a concept.
The same linguistic root is not required for two concepts to be comparable;
a shared label is never proof of the same process. Word-family evidence,
cultural associations and speculative causal bridges must be labeled separately.

The starter examples are Mother, Earth, and Matrix. Mother/Earth compares a
cultural association (Gaia as motherly Earth) with a contrasting example
(Egyptian Geb as male Earth). Matrix shows a documented linguistic relation
to Latin mater. Show the brief familiar explanation first; detailed history,
limitations and source links are optional, not required reading. For other
words, live Explore can investigate origins but must say when provenance or
original intention is unknown. Never silently promote generated interpretation
to verified dictionary fact. Keep private matching logic off the client.

## WORDS: historical interpretation before analogy

Hermeneutics is a curated WORDS example. Preserve attested historical usage,
original cultural and textual context, and the distinction between what a text
says, what its author demonstrably intended, and a modern reader's possible
interpretation. A historical analogy is an interpretation until documented
by appropriate sources. Terms such as Matrix, system, Old World and 5G may
share a useful comparison at a limited functional level without being synonyms,
having common word roots, or proving that an ancient writer described modern
technology. In discovery and second-pass review, interpret in context first;
only then consider two or more ordered causal links. Mark unknown original
intent unknown and retain a comparison without a prediction when appropriate.
Keep the extra reasoning backstage and the short explanation up front.
