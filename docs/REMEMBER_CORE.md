# REMEMBER — Governing Discovery Contract (Version 2)

This is the product source of truth. Older AI Studio chat instructions,
curated sample stories and view-specific prompts are not competing specifications.

## Purpose

REMEMBER takes a person's question, proposes a specific underlying mechanism,
finds where a functionally comparable mechanism may operate in a different
system, translates that relationship into plain language, challenges the
correspondence, and identifies missing information or a discriminating test.

A shared label or dramatic story is not evidence of the same causal mechanism.

## Quality gate (Version 2.1)

The first Gemini call creates up to three cross-system causal candidates, not
finished conclusions. A second, lower-temperature Gemini call must select one
candidate with at least two matching causal steps, a meaningful limitation and a
testable conditional prediction, or reject every candidate. Rejected proposals
are not shown as cross-domain discoveries.

This **model-to-model screen is NOT independent scientific verification**.
It is a quality filter against superficial analogies and overconfident
transfers. Reliable claims still require outside evidence. Never use shared
words, an invented named principle, or metaphorical "stored energy" as proof.

An accepted prediction must state: if-condition, expected observation, what
specific knowledge was transferred, why it could fail, what observations would
count against it under comparable conditions and a safe next check. Reject a
candidate if no such prediction survives.
The user sees a brief parallel and conditional prediction; the detailed
comparison and caveats remain optional.

**Screening calibration (Version 2.2):** A shared causal *sub-mechanism* does
not require identical materials or entire systems. Ask whether a difference
actually breaks a necessary causal link, merely limits the effect, or explains
where the transfer stops. A shared label or a metaphor is still insufficient.
Unobserved target conditions belong in the prediction's IF clause. A single
uncontrolled outcome or one surviving unit rarely disproves a probabilistic
shared-risk prediction; compare the same conditions and record competing causes.
The user sees plain-language uncertainty; the app must never turn an AI review
into a claim of independent verification. No third automatic AI call is added.

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
5. **Cross-examine:** Use a separate adversarial model pass to select a
   transferable causal match or reject all. Include falsifying observations.
6. **Discover:** If a comparison survives, formulate a conditional prediction,
   its disproof and safe next check. Otherwise expose the unresolved question.
   Never promise a new scientific fact or a predestined human outcome.

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
