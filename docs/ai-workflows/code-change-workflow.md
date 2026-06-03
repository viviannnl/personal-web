# Code Change Workflow

Public share copy of Vivian Li's code-change workflow. This workflow is meant for AI-assisted coding sessions where changes should be planned, tested, verified, reviewed, and only then shipped.

---

---
name: code-change-workflow
description: Use when making any code change for the user. Follow a strict plan-test-implement-review-commit-push workflow with TDD, verification, manual testing, and CI follow-up.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [software-development, code-changes, tdd, verification, github, workflow]
    related_skills: [test-driven-development, systematic-debugging, requesting-code-review, github-pr-workflow]
---

# Code Change Workflow

## Overview

Use this skill every time you need to modify code, tests, configuration, documentation that ships with code, deployment files, or project automation.

Core rule:

> Do not jump straight into code. First define the exact intended behavior and success criteria; then prove the change with tests and/or manual verification; then review; then commit and push only after validation.

This workflow exists to keep changes precise, small, testable, and safe to push.

## When to Use

Always use this skill for:

- Bug fixes
- New features
- UI/UX behavior changes
- Refactors
- Test changes
- Build/deployment/config changes
- Dependency updates
- Any task where files in a code repository may be edited

Do not use this skill for:

- Read-only investigation where no code will be changed
- Pure explanation questions
- One-off data analysis outside a codebase

If the task starts as investigation and later becomes a fix, switch into this workflow before editing.

## Required Workflow

### 1. Understand the request

Before editing, establish what is being asked.

- Restate the bug, feature, or desired behavior.
- Identify the affected user flow/API/component.
- If the user provides an exact repository path, plan path, or document path, treat it as the source of truth. Read that file before using memory, recent-session context, or similarly named projects.
- Verify the active repository/project by checking the requested path, `git status`, current branch, and latest commit in that exact repo before taking action.
- Inspect relevant files and existing behavior.
- Check git branch and working tree before changing files.
- Avoid coding until the current behavior and intended behavior are clear.

Useful commands:

```bash
git status --short
git branch --show-current
git log -1 --oneline --decorate
```

For bugs, write a precise bug statement:

```txt
When <trigger/user action> happens, <actual behavior> occurs because <cause/state mismatch>. Expected behavior is <desired behavior>.
```

### 2. Define success criteria before coding

Before implementation, define measurable success criteria.

Include:

- Expected user-visible behavior
- Relevant edge cases
- Unit/integration tests needed
- Manual localhost test steps for UI flows
- Build/lint/typecheck expectations
- Non-goals or explicitly out-of-scope behavior

For UI changes, include a manual checklist like:

```txt
1. Start localhost.
2. Navigate to the affected page.
3. Perform the exact user action.
4. Confirm the expected UI state.
5. Confirm no incorrect toast/error/console message appears.
```

If useful, write the bug description and success criteria into a temporary or project doc so they can be reviewed.

### 3. Create or update a task plan

For non-trivial changes, maintain a task list.

Suggested sequence:

1. inspect current behavior
2. write failing test
3. implement minimal fix
4. run targeted tests
5. run full validation
6. manual localhost test
7. independent review
8. commit and push
9. monitor CI

Only one task should be marked in progress at a time.

#### Re-executing an existing implementation plan

When the user points to a saved plan and asks to “execute it again,” “verify if it is done,” or “close the gap,” treat it as a plan-compliance audit plus implementation task, not as a blind re-run.

- Read the plan and extract its success criteria/checklist before touching code.
- Compare the current branch, latest commit, and diff to each criterion.
- Look for subtle gaps even when the main feature commit already exists: optional/null API fields, navigation between related records, missing static tests for late-added criteria, and manual-verification blockers.
- If a gap belongs to the same feature branch/commit, amend the existing feature commit after re-verification unless the user asks for separate commits.
- See `references/plan-gap-closure.md` for a compact playbook and reporting shape.

#### Milestone verification before implementation

When the user says to “do milestone N,” “follow the plan,” or “remember your resources,” first verify whether the milestone is already implemented before writing code. This is especially important for foundation/infrastructure milestones that may be complete but need proof.

- If the user names a plan/document path, open that exact path first and extract the milestone from it. Do not substitute a different project’s plan based on memory or the current working directory.
- Confirm the repo root implied by the plan path before running tests, builds, browser checks, or production smoke checks.
- Extract the milestone’s success criteria and define the verification target before editing.
- Use all relevant safe resources: local tests, lint/build, production smoke checks, browser console checks, deployment inspection, and an independent read-only audit for meaningful milestone closure.
- If every criterion passes, report the milestone as complete with evidence and do not create unnecessary code changes, commits, or pushes.
- If a gap exists, switch to TDD/minimal implementation for that exact plan’s next task.
- If protected/authenticated production behavior cannot be fully exercised without a user session, verify the public/auth-boundary behavior and clearly label the authenticated flow as not verified.
- See `references/milestone-foundation-audit.md` for the repeatable checklist and reporting shape.

### 4. Follow TDD whenever practical

For bugs and behavior changes, use Red-Green-Refactor.

1. Write the test first.
2. Run it and confirm it fails for the expected reason.
3. Implement the smallest fix.
4. Run the test and confirm it passes.
5. Refactor only after tests are green.

If TDD is not practical, explicitly say why. Examples:

- Pure copy/style tweak with no test harness
- Product-strategy or questionnaire documentation updates where the source of truth is the user's latest wording/decision
- Generated file update
- External service configuration where behavior can only be verified manually

Even when TDD is not practical, still define success criteria and perform verification. For documentation-only product decision updates, verify by re-reading the changed sections, checking markdown fence balance where relevant, and searching for superseded phrasing so old guidance does not remain in a conflicting section.

### 5. Implement minimally

When coding:

- Make the smallest safe change.
- Avoid unrelated refactors.
- Avoid touching unrelated files.
- Keep behavior isolated and easy to review.
- Prefer targeted file tools (`read_file`, `search_files`, `patch`, `write_file`) over broad shell edits.
- Never expose secrets or print `.env` values.
- Do not silently change product behavior outside the stated scope.

### 6. Verify in layers

After implementation, run verification from narrow to broad.

#### Configuration/model/version string changes

When changing external provider identifiers or API configuration across a codebase (for example LLM model names, SDK endpoint names, payment price IDs, feature flags):

- Add a regression test or static check that scans the relevant source area and fails if old identifiers remain or new calls omit the required identifier.
- Run the test once before the change to confirm it fails for the existing mismatches, then after the change to confirm it passes.
- Search the repo for old identifiers in both code and docs.
- Verify related API parameter compatibility, not just the identifier string. For LLM model upgrades, check token parameter names (`max_tokens` vs `max_completion_tokens`), temperature/reasoning support, endpoint compatibility, and account access to the target model.
- If full tests/lint fail because of unrelated existing issues, still run targeted tests/static checks and clearly separate unrelated failures from the changed behavior.

#### Backend handoffs with external database migrations

When implementing a frontend handoff that requires Supabase, Prisma, SQL, or another external database change that the agent cannot safely apply directly:

- Read the handoff/spec first and identify which parts are local code versus external state. Treat production database/schema changes as an approval gate, even if local code edits are allowed.
- Add a checked-in migration or SQL file when the repo has a migration location, but do **not** apply it to production or seed data without explicit approval.
- Implement the local read/write API shape exactly from the handoff, including ordering, filters, and response shape. For public personal-site features, prefer read-only public routes unless the spec explicitly defines authenticated writes.
- Wire the frontend to render all required states: loading, success/populated, empty, and backend-error. If the external table does not exist or credentials/network are unavailable locally, verify that the error state is user-friendly and label live-row verification as blocked rather than failed.
- Never seed fabricated/demo rows when the handoff says real data only. Keep empty states honest until the user adds real rows.
- Verification should include production build/typecheck, a local smoke test of valid/invalid API behavior where possible, browser inspection of the affected UI, and a clear remaining step explaining exactly what SQL or external setup the user must apply.

#### LLM classification, clustering, or extraction behavior changes

When fixing an agent/LLM pipeline that turns unstructured inputs into structured records (feedback → signals, documents → fields, comments → categories, etc.):

- Define the expected granularity before editing. Name the atomic units that must remain separate and the cases that should still merge.
- Test the exact user-provided fixture or a close sanitized fixture. Include multilingual examples when the bug came from multilingual input.
- Guard both paths if the system has an LLM path plus a deterministic fallback: prompts alone are not enough, and fallback keyword grouping can regress independently.
- Add post-processing only with safeguards. If post-processing splits or re-ranks LLM output, ensure any downstream plan/summary/evidence still matches the selected structured record; do not reuse a broad LLM plan for a narrower split item unless the evidence/title still align.
- Preserve provenance when persisting multiple structured records from one run. If the run has a single top-level plan/summary, pass the selected record identity (for example title/key/evidence IDs) alongside it and only reuse that plan for the matching persisted record; generate record-specific fallback plans for all other records.
- Test persistence matching/dedup separately from extraction. Existing generic buckets such as “Repeated feature request detected” must not absorb newly detected specific records (for example “Direct resume submission”) merely because they share a type; only fall back to a generic existing record when the new evidence is itself generic.
- Include negative tests for false positives caused by broad keywords. Example: a resume-specific detector should require resume context rather than classifying every “apply” or “type” mention as a resume signal.
- For one input item containing multiple asks, decide whether the product should emit multiple structured records from the same evidence item; if yes, test duplicated evidence IDs across distinct records.

#### Private export → review pipeline changes

When building tooling that parses private exports or personal data for later RAG/training/use in a public product (for example ChatGPT exports, Google Takeout, message archives, email exports):

- Split the milestone into a local-only tooling phase and a later import/deploy phase. Do not import into production, write to Supabase, configure provider keys, or deploy public behavior until the user explicitly approves that separate step.
- Keep raw exports and generated review files out of git by default. Add repo-root/private-output ignores such as `.local/`, export zip names, root `conversations.json`, and private review directories. If adding a checked-in fixture, make it synthetic and ensure the ignore pattern does not accidentally hide the fixture path.
- Use TDD with a sanitized fixture before touching real private data. The fixture should include: one safe user-authored example that must be kept, one assistant/tool/system message that must be skipped, one too-short user message, and secret/contact-like examples that must be filtered.
- Generate human-readable review output with unchecked approval markers by default (for example `APPROVE: [ ]`) plus machine-readable JSONL if useful. Default every candidate to `approved: false`; the user must explicitly opt snippets in.
- Filter obvious secrets and private identifiers before review output: API keys/tokens, `NEXT_PUBLIC_`, database URLs, `.env`, bearer tokens, provider names tied to secrets, emails, phone-number-like strings, and similar patterns. State clearly that this is a safety filter, not a guarantee; the generated review file may still contain private text and should be treated as private.
- The parser should be local-only and deterministic: no network calls, no model calls, no database writes, and no logging of extracted candidate content. Printing counts and output paths is acceptable.
- Verify multiple input shapes when relevant: raw JSON, extracted directory, and zip input. For zip handling, avoid shell interpolation; pass arguments as an array to the child process.
- Run `git check-ignore` or an equivalent check to prove generated private outputs are ignored, and run a diff/secret review before reporting completion.

#### Public UI/content integrity changes

When changing public-facing web UI, landing pages, pricing pages, SEO metadata, privacy/legal pages, or redesign copy:

For publishing static HTML/markdown/design artifacts into a Next.js public site, follow `references/static-artifact-publication.md`: copy the full artifact directory under `public/<slug>/`, verify relative scripts/assets and markdown return 200, privacy-review public handoff docs, isolate the commit from unrelated dirty work, and distinguish Vercel preview readiness from public accessibility when Preview Protection is enabled.

- Search for prototype/sample/demo strings, hardcoded user identities, fake rows, unimplemented keyboard hints, old brand/contact domains, and placeholder labels that should not ship.
- Search for unverified marketing, compliance, or structured-data claims such as ratings/review counts, “#1/best” claims, SOC 2/GDPR wording, security/privacy guarantees, or exact product counts/pricing that are not backed by current product truth.
- Do not infer public positioning from backend architecture. If a product uses organizations/workspaces for data isolation, describe that as internal workspace architecture; do not call the product “B2B” or “enterprise” unless the user has explicitly positioned it that way. For SignalGen specifically, prefer indie coders, solo founders, tiny teams, workspaces/projects, and avoid “B2B-style” as public framing.
- When borrowing an idea from another product or template, separate the product concept from the visual treatment. Rebuild it in the target app’s own design system (colors, surfaces, typography, spacing, components), and do not import the source product’s visual style unless the user explicitly asks for that style.
- Clarify ambiguous preview/data copy in the UI itself. If a card says it “captures” something, state the concrete user actions or milestones being captured and what is *not* captured (for example no private document content, applicant names, or global user stats) so the user does not have to infer the data model.
- Add or update a small regression/static test that scans the relevant source files and fails if the disallowed copy/claims/style regressions return. Prefer a descriptive file-read helper so missing fixture paths fail with a clear message.
- Confirm the test fails before the cleanup when practical, then passes after the cleanup.
- For pricing or billing UI, guard missing public price IDs/feature flags with a user-visible error and disabled action instead of using non-null assertions that can fail silently at runtime.
- Standardize public support/contact email and brand domain across all modified pages.

#### Documentation-only product decisions

When the user asks to update local project docs based on a conversation or product decision:

- Treat the user's latest wording as the source of truth; do not preserve old framework/questionnaire language if it conflicts with the new direction.
- Locate the actual local project docs before editing. If the first likely repo is wrong, search adjacent project directories for distinctive phrases from the conversation.
- Prefer patching the decision-bearing sections instead of rewriting the whole document.
- Move over-detailed questions, architecture prompts, or implementation planning into “later/handoff/deeper custom build” sections when the user says they are not needed for the first flow.
- Add concrete user-facing copy, defaults, and explicit “do not ask yet” lists when the decision is about onboarding/questionnaires.
- When the user challenges a roadmap/status item as already done, stop repeating the roadmap. Verify the source of truth against live artifacts first (for example GitHub PR list/view, deployment status, database records, or logs as appropriate), then patch the docs so completed evidence is captured and the remaining-work language is narrowed. Distinguish “first controlled proof succeeded” from “broader production hardening remains.”
- For roadmap/status summaries, explain the product goal in beginner-friendly terms before listing tasks. Clarify whether a task is about multi-project convenience, data isolation, permission safety, or production hardening so the user understands why it remains.
- Verification should include re-reading changed sections, checking markdown fence balance if code blocks were touched, and searching for old conflicting phrases (for example old question counts, labels, or promises).
- If the directory is not a git repository, still make and verify the doc update, then report that there was no commit to make rather than forcing repo workflow.

#### Targeted tests

Run the smallest relevant test first:

```bash
npm run test:run -- path/to/test
pytest path/to/test.py::test_name -q
```

Use the project’s actual test command.

#### Full relevant suite

Then run the full relevant suite:

```bash
npm run test:run
pytest tests/ -q
```

#### Lint/type/build

Run project-appropriate checks:

```bash
npm run lint
npm run typecheck
npm run build
```

For Next.js App Router UI changes, treat both lint and production build as required verification, not interchangeable checks. App Router can pass local/dev rendering while production build fails on client-router hooks such as `useSearchParams()` unless the component is wrapped in a Suspense boundary. React hook lint can also flag synchronous state updates inside effects. Fix these instead of dismissing them as local-only warnings; if a query param is only needed client-side, consider reading `window.location.search` after mount or adding the proper Suspense boundary.

If full lint/build fails because of unrelated existing issues:

- Run a changed-file-specific lint/check if possible.
- Clearly separate changed-file cleanliness from pre-existing repo failures.
- List the unrelated failures with file paths.

### 7. Manual localhost test for UI/app changes

For UI or app-flow changes, start the app locally and manually test the success criteria.

When implementing from an approved design artifact, redesign handoff, screenshot, or prototype, visual fidelity must be verified against the **actual rendered UI**, not just by reading code or comparing static files. Use a local browser to open the implemented app, compare the rendered pages against the approved design artifact, and check spacing, typography, color, surfaces, radius, shadows, hierarchy, component states, responsive behavior, and console errors. Capture screenshots and, for significant redesigns or flows, a short screen recording when available. If browser access, screenshots, or recording are unavailable, report that limitation explicitly and do not claim visual fidelity was verified.

Important wording distinction: if the user asks whether they can “see it live,” whether it is “pushed to live,” or whether “Vercel is hosting the latest change,” do **not** answer with localhost setup. Treat that as a production/preview deployment verification request: check whether the commit is pushed, whether the hosting provider has deployed that commit, and provide the live URL plus smoke-test results. Localhost is only appropriate when the user explicitly asks for local preview or when deployment is not requested/available.

For dark-themed apps embedding Clerk controls, see `references/clerk-dark-appearance.md` for a proven contrast/theming pattern, compact auth/workspace strip pattern, production-key caveats, and visual verification checklist.

For authenticated production dashboards that show persisted extraction/classification results, see `references/authenticated-production-signal-verification.md` for the signed-in browser verification pattern: preserve the user's exact URL/query params, confirm workspace/repo context, verify collection counts and distinct records, open a detail drawer/page, and check console errors.

For public aggregate analytics/social-proof cards, see `references/public-analytics-usage-pulse.md` for the server-only aggregate API pattern, privacy guardrails, PostHog/Vercel env notes, and copy/style verification checklist.

For approved redesign handoffs, see `references/redesign-handoff-implementation.md`: create a dedicated redesign branch, implement tokens/components/pages in order, verify the actual rendered UI in a browser against the design artifact, capture screenshots/screen recording when available, then push the branch and open a PR for human review.

When creating or improving public prompt/docs repositories for a Claude Design → Claude Code redesign workflow, see `references/redesign-workflow-prompt-repo.md`: make the two prompts' responsibilities explicit, require users to download/unzip the Claude Design ZIP into the app repo (not rely only on a share link), and document browser visual verification plus branch/PR safety.

Example:

```bash
npm run dev
```

Then use browser tools to exercise the flow.

Confirm:

- The page loads.
- The exact changed flow works.
- Expected success/error messages appear.
- Incorrect old behavior does not appear.
- Browser console has no relevant new errors.

If authentication, missing seed data, or external services prevent full manual testing, say exactly what was and was not verified.

### 8. Run independent review before committing or pushing

Before committing, review the change.

Minimum review:

```bash
git diff
git status --short
```

Check:

- Diff only includes intended files.
- No secrets or debug logs are included.
- Tests match behavior, not implementation details.
- Edge cases are handled.
- The fix does not create a broader regression.

For meaningful changes, use an independent subagent/code review pass. If review finds issues, fix them and re-run verification.

### 9. Commit cleanly

Before commit:

```bash
git status --short
git diff
```

Stage only intended files:

```bash
git add <files>
```

Use a conventional commit message:

```txt
fix: correct saved resume reload state
feat: add profile resume continuation flow
refactor: extract resume reload helper
test: cover saved resume reload state
```

Commit body should mention:

- What changed
- Why it changed
- Test/verification results

### 10. Push and create/update PR

Push the branch:

```bash
git push -u origin HEAD
```

If requested or appropriate, create/update a PR.

PR body should include:

- Summary
- Test plan
- Manual test notes
- Screenshots/video for visible UI changes when useful
- Known limitations or blocked manual checks
- Linked issue if applicable

### 11. Monitor CI/deployment and fix failures

After pushing:

- Check CI status.
- Inspect failed logs if checks fail.
- Fix failures in follow-up commits.
- Push again and re-check.
- Repeat until CI is green or blocked by an external issue.
- If the project deploys automatically (for example Vercel/Netlify), monitor the deployment too — not just GitHub status.

For Vercel projects with the Vercel CLI available:

```bash
# List recent deployments and identify the newest deployment URL/status
vercel ls <project-name>

# Inspect the specific deployment URL until status is Ready or Error
vercel inspect https://<deployment-url>

# Verify the production alias responds after the deployment is Ready
curl -I https://<production-domain>
```

Notes:

- `vercel ls` output can be less parseable when piped or in non-interactive mode; if polling text output is ambiguous, use `vercel inspect <deployment-url>` as the source of truth for `status` and aliases.
- Vercel CLI flags differ by version. In Vercel CLI 54.x, `vercel list` does not support `--limit`, and setting a personal account as `--scope` can fail with `You cannot set your Personal Account as the scope.` Prefer `vercel list --format json` from the linked project without `--scope`, redirect JSON to a temp file, then parse it separately.
- Avoid piping Vercel output directly into an interpreter when deployment metadata could include untrusted text. Use a temp file, inspect/parse it, and do not print env var values or secrets.
- A successful deployment should show `status ● Ready`; production deploys should also show the expected aliases/domains.
- If the deployment fails, inspect build logs, fix in a follow-up commit, push, and monitor the new deployment.

If blocked, explain the blocker and what remains.

### Post-approval push/deploy/smoke continuation

When a previous turn stopped at a production-risky approval gate and the user later explicitly approves pushing/deploying (for example “yes, push it and then smoke test production”):

1. Reconstruct the exact local state before acting: check branch, `git status --short`, latest commit, and remote tracking state. Confirm the local commit to ship is the expected one.
2. Push the already-reviewed commit; do not re-open implementation unless the working tree or commit differs from the reviewed state.
3. Monitor the deployment that corresponds to the pushed commit SHA/message, not merely the newest previously-ready deployment.
   - Prefer `vercel list --format json > /tmp/<project>-vercel-list.json` and parse the temp file.
   - Then `vercel inspect https://<deployment-url>` until `status ● Ready` or `Error`.
   - Confirm the production alias/domain is attached to that ready deployment.
4. Run a production smoke suite appropriate to the change:
   - health/public endpoint returns 200,
   - the main changed page renders 200,
   - protected unauthenticated API still fails closed with the expected auth code (for SignalGen-style Clerk routes, `401` + `AUTH_REQUIRED`),
   - use browser automation for visible pages and check browser console for new errors.
5. If the fully authenticated flow requires user-owned secrets/session/org state, smoke the signed-out/auth-boundary behavior and clearly label the authenticated end-to-end flow as not verified rather than inventing coverage.
6. Final report should include commit SHA, deployment URL, production alias, each smoke endpoint/status, browser-console result, repo sync status, and any caveat about auth/session-limited checks.

## Reporting Back to the User

Final summary after a code change should include:

- Exact bug/feature description
- Files changed
- What was implemented
- Tests run and results
- Build/lint/typecheck results
- Manual localhost test results
- Review findings and fixes
- Commit/PR/push status
- Any remaining caveats

Do not say the work is done until verification and review are complete, or clearly label what could not be completed.

## Common Pitfalls

1. **Coding before defining success criteria.** Stop and write the expected behavior first.

2. **Skipping the failing test for a bug.** The test proves the bug exists and prevents regression. If no test is possible, explain why and use manual verification.

3. **Running only happy-path checks.** Include edge cases and regression checks.

4. **Hiding pre-existing failures.** If full lint/test fails for unrelated reasons, say so clearly and still validate changed files.

5. **Committing unrelated files.** Always inspect `git diff` and stage only intended files.

   When the user asks to review or clean up a dirty working tree after a task, classify each modified/untracked file before committing:
   - `fix`: bug/test/type/build correction that should usually ship if verified.
   - `feature`: user-visible behavior or new endpoint/page; ship only if coherent and in scope.
   - `chore`: config/docs/workflow/dependency cleanup; ship if low-risk and relevant.
   - `docs`: documentation/plan updates; usually safe if no secrets.

   Decide `push now` vs `hold` per file based on scope, safety, and product readiness. For risky or future-scope work (e.g. automation without permission gates, unauthenticated cron jobs, production-cost triggers), hold it even if tests pass. To verify only the selected subset while preserving unselected local work:

   ```bash
   git add <selected-files>
   git stash push --keep-index --include-untracked -m 'hold non-selected local changes before safe push'
   # run typecheck/tests/build against the selected index/worktree
   git commit -m "<type>: <summary>"
   git push origin <branch>
   git stash pop
   ```

   If generated caches like `.next` reference held/untracked routes, remove the cache before typecheck/build (`rm -rf .next`). After pushing, restore held changes and report both the pushed commit and remaining local files.

6. **Pushing without CI follow-up.** After pushing, check CI and address failures where possible.

7. **Confusing localhost with live deployment.** When the user asks to see the change “live” or asks whether Vercel/production has the latest change, verify GitHub push state and the hosting deployment/alias. Do not start a dev server and present `localhost` as the answer unless the user explicitly asked for local preview.

8. **Manual test without console check.** For browser UI changes, also check browser console errors.

8. **Over-refactoring.** Keep the change scoped unless the user explicitly asks for broader cleanup.

## Verification Checklist

Before finalizing any code-change task:

- [ ] Request understood and exact behavior defined
- [ ] Git branch/status checked
- [ ] Success criteria written before coding
- [ ] Task plan created for non-trivial work
- [ ] Failing test written and observed, or exception explained
- [ ] Minimal implementation completed
- [ ] Targeted tests pass
- [ ] Full relevant tests pass, or unrelated failures documented
- [ ] Lint/type/build checks pass, or unrelated failures documented
- [ ] Manual localhost test completed for UI/app flow, or blocker documented
- [ ] Browser console checked for UI changes
- [ ] Diff reviewed for scope/secrets/debug code
- [ ] Independent review completed for meaningful changes
- [ ] Review findings fixed and verification re-run
- [ ] Intended files committed
- [ ] Branch pushed / PR created if requested
- [ ] CI checked and followed up when possible
