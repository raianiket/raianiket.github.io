# Project rules

Rules for working on this repo, established through direct feedback across
multiple sessions. Follow these without being asked again. One continuous
priority order: if two rules ever pull in different directions, the
lower-numbered one wins.

## Chatbot architecture (non-negotiable constraints)

1. **`llama3.2:1b` is a hard requirement.** Never switch to `llama3.2:3b` or
   a larger model to solve a quality problem. This machine has 8GB RAM and
   has actually OOM-killed the dev server running `3b`. Fix quality problems
   by improving retrieval, prompt design, or task shape around the model,
   never by upsizing it.
2. **Never hardcode a canned answer for an individual question.** If a
   specific phrasing breaks, fix the underlying system prompt, context
   construction, regex pattern, or response-generation logic, not a
   one-off answer for that exact question.
3. **Never flatly refuse a whole question category.** The bot must reason
   about new phrasings using the portfolio context, even if the exact
   question wasn't in training data. A refusal like "that wasn't in the
   training set" is explicitly rejected, it makes the bot look clever for
   30 seconds and useless after that.
4. **Critical/adversarial questions skip the regex layer entirely**
   (`isCriticalQuestion()` gates this in both `ChatBot.tsx`'s `matchIntent`
   and `localLlm.ts`). Don't patch individual overbroad regex patterns that
   happen to swallow a critical question, fix it so critical questions never
   reach the regex loop in the first place.
5. **Regex patterns must be anchored with `\b` word boundaries.** A bare
   keyword like `tech`, `lead`, or `team` matches as a substring inside
   unrelated words ("technical", "leader") or hijacks unrelated questions.
   Every new pattern needs boundary anchors unless there's a specific reason
   not to.

## Handling critical/adversarial questions (bad fit, weaknesses, why not hire)

6. **Selection, not composition.** The model never writes free prose for
   this category, it only picks from pre-vetted, always-true fact lists
   (`CONCERNS`, `EVIDENCE`, `VALIDATE` in `localLlm.ts`) and the app
   assembles a fixed template. Four attempts at free-composition prompting
   all fabricated specific false claims, even with explicit anti-invention
   instructions. This is the only approach that's worked.
7. **Never turn an evidence gap into a fabricated weakness.** Distinguish
   DEMONSTRATED WEAKNESS from POTENTIAL RISK from EVIDENCE GAP. Not having
   direct evidence of something is not the same as evidence against it.
8. **Never assume stereotypes.** Large-company experience does not imply
   slow or inflexible. Lacking direct startup experience does not imply
   inability to succeed at one. If the model or a template implies either,
   that's a bug to fix, not acceptable hedging.
9. If you find a new phrasing that slips past `isCriticalQuestion()` and
   reaches free composition, treat that as a bug: broaden the detector
   rather than accept the composition-path answer.

## Writing style (chatbot content and anywhere else text is written)

10. **Never use em dashes (—).** Use a comma, colon, semicolon, or split
    into two sentences instead. Applies to `responses.json`,
    `finetuning.json`, system prompts in `localLlm.ts`, commit messages,
    and any other written content in this repo.
11. Notice-period wording never hardcodes a specific day count, it goes
    stale. Always phrase it as "currently serving his notice period,
    contact him directly for the exact date."
12. Skills/experience data must match the resume (`Aniket_Resume.pdf`) as
    the source of truth. Don't add tools or technologies to the chatbot or
    Skills section that aren't backed by the resume.

## Workflow

13. Before pushing any chatbot logic or content change: validate JSON
    (`python3 -c "import json; json.load(open(...))"`), `npx tsc --noEmit`,
    a targeted Node test against the real running Ollama instance, then
    `npm run build`.
14. Verify live on the actual hosted URL (`https://raianiket.github.io/`),
    not just `localhost:3000`, before considering something done. Several
    real bugs (CORS, regex overreach) only ever showed up there.
15. Commit messages: short and proper, no verbose multi-paragraph bodies
    unless the change genuinely needs the context (e.g. a bug found via
    live testing, where the "why" matters for the next person reading
    `git log`).
16. `talk-track.md` is local-only (gitignored), it holds the interview demo
    script and talking points. `architecture.md` is the public,
    presentable technical writeup, keep presentation-script language out
    of it.
