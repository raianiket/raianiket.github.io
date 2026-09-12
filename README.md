# raianiket.github.io

Aniket Rai's personal portfolio — a Next.js site with a resume page, a
project showcase, and a hybrid regex + local-LLM chatbot that can answer
questions about his experience.

Live: **https://raianiket.github.io/**

## Tech stack

- **Framework:** Next.js 16 (App Router, static export via `output: "export"`) + React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS + inline styles, `framer-motion` for animation
- **Data/analytics:** Supabase (chatbot "unanswered question" logging, `/pulse` dashboard)
- **Icons:** `lucide-react`
- **Hosting:** GitHub Pages, deployed via `.github/workflows/deploy.yml` on every push to `main`

No backend server — the whole site is a static export. The chatbot's
optional local-LLM fallback (below) is the one feature that talks to
anything outside the browser, and it only talks to `localhost`.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
npm run build   # static export, output in out/
npm run start   # serve a production build locally
npm run lint    # eslint
```

## Project structure

```
src/
  app/
    page.tsx        # home page (assembles all sections below)
    resume/         # standalone /resume route, print-friendly
    pulse/          # analytics dashboard (Supabase-backed)
  components/
    Hero, About, Projects, Skills, Experience, Education, Contact, Footer
    ChatBot.tsx      # the portfolio assistant — see below
  data/
    responses.json   # chatbot regex patterns -> canned responses
    finetuning.json  # Q&A corpus used for fuzzy matching + LLM context
  lib/
    levenshtein.ts   # hand-written edit-distance fuzzy matcher, no dependency
    localLlm.ts      # local Ollama fallback for the chatbot
    supabase.ts       # Supabase client
```

## The chatbot: hybrid regex + local LLM

`ChatBot.tsx` answers most questions instantly with **zero AI**, and only
reaches for a small model running locally when nothing else matches. Full
diagram and reasoning: **[architecture.md](./architecture.md)**.

In short, in order:

1. **Follow-up detection** — "tell me more" continues the last topic.
2. **Job-title auto-detect** — "hiring for a backend engineer" gets a tailored pitch.
3. **Regex intent match** — ~84 patterns in `responses.json` cover the common questions (tech stack, projects, availability, contact, etc.). Instant, free, deterministic.
4. **Fuzzy match** — typo'd or reworded questions get matched against the 67-example Q&A corpus in `finetuning.json` via edit distance (`lib/levenshtein.ts`).
5. **Local LLM fallback** — if nothing above matched, the browser calls Ollama at `http://localhost:11434` with the same `finetuning.json` corpus as context, using a small model (`llama3.2:3b`).
6. **Default response** — if the LLM isn't reachable (not running, or it's a different visitor's own machine), the same canned "I don't have that info, here's how to reach him" fallback runs as before.

### Running the local-LLM fallback

Steps 1–4 need nothing extra. To also exercise step 5 (e.g. for a demo):

```bash
brew install ollama          # or see https://ollama.com
brew services start ollama   # or: ollama serve
ollama pull llama3.2:3b      # ~2GB, one-time download
```

Then run the site (`npm run dev`, or just open the live production URL) on
the **same machine** — the fallback calls `localhost:11434` from the
browser, so it only activates for whoever has Ollama running locally. Other
visitors to the live site are unaffected and just get the regex/fuzzy layer,
exactly as before this feature existed.

### Regenerating chatbot content

To add a new question the regex layer should catch, add a pattern + response
to `src/data/responses.json`. To improve fuzzy-match/LLM coverage for
open-ended phrasing, add a `{ q, a }` pair to `src/data/finetuning.json` —
both the fuzzy matcher and the local-LLM context pull from the same file, so
one edit improves both layers.

## Deployment

Push to `main` — `.github/workflows/deploy.yml` builds the static export and
publishes it to GitHub Pages automatically. No manual deploy step.

## Content policy notes

- Skills/experience data must match the resume PDF (source of truth:
  `Aniket_Resume.pdf`) — don't add tools/technologies to the chatbot or
  Skills section that aren't backed by the resume.
- Notice-period wording never hardcodes a specific day count (it goes stale)
  — always phrase it as "currently serving his notice period, contact him
  directly for the exact date."
