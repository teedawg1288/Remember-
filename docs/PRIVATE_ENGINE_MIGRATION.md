# REMEMBER — Private Reasoning Engine Migration (staging plan)

Status: **PREPARATION ONLY.** This branch must not be merged, republished or used for production routing until an independently verified private backend exists.

## Goal

Keep the visible React app and its Google AI Studio ↔ GitHub \`main\` synchronization. Move REMEMBER's non-public analysis instructions, prompt construction, cross-domain adjudication and prediction checks to a separate **private** backend. The user's browser should receive results, never the proprietary instructions or the backend secret.

This migration is about controlling future disclosure; it cannot erase code already visible in the public GitHub repository or its history.

## Components and ownership

| Component | Future home | Notes |
|---|---|---|
| React pages, visual bridges, user-controlled interactions, WORDS dictionary | Existing public \`Remember-\` repository / Google AI Studio | Safe-to-share UI and output schemas |
| Public \`/api/...\` routes | Existing Studio server, thinned to a proxy | Keeps browser calls same-origin; enforces public rate limits |
| Prompt constructors, skeptical reviewer, private causal-transfer and prediction logic | New private repository and private backend runtime | Never import into client or publish as JS assets |
| Gemini and private-engine credentials | Hosting environment secret storage | Never GitHub source, browser, screenshots, or chat |
| User-approved memories | Local client until separately designed, authenticated storage exists | Anonymous cloud memory remains disabled |

Current backend-owned source candidates to migrate (verify dependency graph before removing): \`src/data/coreDiscoveryPrompt.ts\`, \`src/data/discoveryReviewPrompt.ts\`, \`src/data/crossExamination.ts\`, \`src/data/discoveryContract.ts\`, \`src/data/questionRouting.ts\`, \`src/data/questionAnchors.ts\`, \`src/data/grounding.ts\`, \`src/data/discoverySafety.ts\`, \`src/data/discoveryAdapter.ts\`, and backend logic embedded in \`server.ts\`. The public \`docs/REMEMBER_CORE.md\` also currently explains proprietary design decisions and should be replaced with a public product description **after** private source-of-truth docs have been secured. Some public-facing validations may remain in the UI for user safety, but they are not a substitute for private server validation.

## Public API contract (unchanged)

The browser continues POSTing JSON to the same origin for these exact routes:

1. \`/api/discovery/analyze\`
2. \`/api/same-story/analyze\`
3. \`/api/same-story/cross-examine\`
4. \`/api/same-story/predict\`
5. \`/api/same-story/era-translate\`
6. \`/api/same-story/simulate-what-if\`

The public server forwards the JSON request body and returns a JSON response with its status. It does not forward browser cookies, browser authorization headers or arbitrary URLs. Private and public services must agree on existing request/response schemas before cutover. The private service must validate user input, authenticate every call, limit payloads, sanitize provider errors and retain minimal logs.

## Safe feature switch prepared in this branch

Default (today): \`REMEMBER_PRIVATE_ENGINE_MODE=local\` or unset; current handlers continue unchanged.

Only in an isolated staging deployment:

- Set \`REMEMBER_PRIVATE_ENGINE_MODE=proxy\`.
- Set \`REMEMBER_PRIVATE_ENGINE_URL\` to the dedicated private service **HTTPS origin only**, no path or query.
- Set \`REMEMBER_PRIVATE_ENGINE_TOKEN\` in the server environment to a new long random server-to-server secret. Put the matching verification credential in the private backend's environment. Rotate the credential before production.

In proxy mode, incomplete or invalid configuration returns HTTP 503. Upstream failure returns generic HTTP 502. No local engine fallback is allowed in proxy mode. Public per-IP and per-instance rate limits continue to run before the proxy.

The initial shared bearer mechanism is for an isolated staging seam. Prefer managed service identity / IAM, centrally enforced authorization, edge throttling and spend caps for production after the actual hosting environment is confirmed. Do not expose the private origin or token through Vite \`VITE_*\` variables.

## Phased, reversible cutover

1. **Secure destination** — Create an access-restricted private repository and service; verify private visibility and membership before copying *any* code. No private repository has been created as part of this PR.
2. **Move the implementation** — Copy only necessary server-side code to private destination; run the core, safety, cross-exam, prediction and contract tests there. Keep environment secrets out of source.
3. **Make runtime parity real** — Current \`server.js\` does not include newer \`server.ts\` discovery routes. Establish one reproducible server build plus CI route parity check. The compiled file in this branch has a manually maintained migration seam, not a full synchronized rebuild.
4. **Run staging** — Deploy an isolated preview from this migration branch with a separate key and \`MODE=proxy\`. Verify route success, 429 throttling, anonymous memory 410, 503 missing credentials, 502 upstream failure, no leaked headers, and browser usability.
5. **Public-code cleanup** — Only after staging passes: remove private prompts, private tests and docs, and local-engine fallback from the public release candidate. Update build scripts to avoid embedding engine internals in \`server.js\` or browser bundles. Scan the full public repo tree and built artifacts. **Remember: deleting current files cannot retract Git history or copies.**
6. **Explicit release approval** — Back up the published version, agree on rollback, merge reviewed changes in order, and republish Google AI Studio only after the owner approves. Verify live endpoints and spend monitoring.

## Release blockers

- No authenticated private backend exists yet.
- No private repository destination or hosting/cost settings have been agreed.
- The published app currently differs from the newer TypeScript server source, and Studio reports unpublished changes.
- Private engine files are already exposed in the public repository history.
- Unit/CI tests are not a staging penetration test, load test, privacy assessment or guarantee against provider charges.

Do not put real secrets, prompt text, or private operational details in this public migration document.
