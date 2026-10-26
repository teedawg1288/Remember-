# REMEMBER — Governing Discovery Contract (Version 2)

This is the product source of truth. Older AI Studio chat instructions,
curated sample stories and view-specific prompts are not competing specifications.

## Purpose

REMEMBER takes a person's question, proposes a specific underlying mechanism,
finds where a functionally comparable mechanism may operate in a different
system, translates that relationship into plain language, challenges the
correspondence, and identifies missing information or a discriminating test.

A shared label or dramatic story is not evidence of the same causal mechanism.

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
3. **What the other system helps predict:** Borrow one real donor lesson,
   state the missing target condition, observable IF/THEN result, comparison
   and same-condition counterevidence. If the donor's unique capability has
   no target counterpart, return no prediction and explain the gap.
4. **The next question—and why that one:** Ask one answerable question
   that would distinguish rival causes or verify the missing counterpart.
   Explain why its answer matters and how different answers could alter
   the prediction. Do not ask a generic filler question.

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
