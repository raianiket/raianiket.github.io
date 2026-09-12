# Portfolio Chatbot — Hybrid Regex + Local LLM Architecture

**One-line pitch:** the chatbot answers most questions with zero AI —
deterministic regex matching, free and instant — and only reaches for a
small language model, running entirely on my own laptop via Ollama, when a
question needs real language understanding. No API key, no per-query cost,
no data ever leaves the machine.

---

## 1. The flow

```mermaid
flowchart TD
    U[User asks a question] --> N[Normalize input: lowercase, fix typos]
    N --> I{Intent layer: matchIntent}

    I -->|follow-up phrase, e.g. tell me more| FU[Return topics follow-up response]
    I -->|hiring for a ... engineer| JM[Return job-match response]
    I -->|matches a known regex pattern| RX[Return response.json entry]
    I -->|typo'd or reworded, close to a known question| FZ[Fuzzy match via edit distance]
    I -->|nothing matched| LLM{Local LLM: askLocalLLM}

    LLM -->|Ollama reachable at localhost:11434| OK[llama3.2:1b answers using relevant context only]
    LLM -->|not running, or a different visitors machine| DEF[Default fallback response, logged as unanswered]
    LLM -->|critical or adversarial question, e.g. bad fit, why not hire| DEF

    FU --> R[Response Builder]
    JM --> R
    RX --> R
    FZ --> R
    OK --> R
    DEF --> R
    R --> S[Suggestions plus typed reply rendered in chat UI]

    style I fill:#1a6cf5,color:#fff
    style LLM fill:#a78bfa,color:#fff
    style OK fill:#4ade80,color:#000
    style DEF fill:#f59e0b,color:#000
```

| Layer | Cost | Speed | Used for |
|---|---|---|---|
| Regex / intent match (`matchIntent`) | Free | Instant | ~84 known question patterns — tech stack, projects, contact, availability, etc. |
| Fuzzy match (Levenshtein, hand-written) | Free | Instant | Typo'd or reworded versions of the 67 known Q&A pairs |
| Local LLM (Ollama, `llama3.2:1b`) | Free, runs on my laptop | ~1-4s (warm) | Open-ended questions that combine facts or need real phrasing understanding |
| Default response | Free | Instant | LLM unreachable — identical to the site's original behavior, nothing regresses |

The regex layer is **never bypassed** — the LLM is a last resort, not a
replacement. Most visitors' questions are answered by pattern-matching
alone and never touch the model at all.

---

## 2. Live demo — do this on screen first, explain after

Show it working before explaining how, in this order:

1. **Open the site, ask something ordinary** — *"What's his tech stack?"* →
   answers instantly, **no sparkle icon** — that's the regex layer in
   `responses.json`, zero AI involved.
2. **Ask something open-ended, specific, and clearly not a canned
   question** — e.g. *"What kind of engineering culture would he thrive in
   versus struggle in?"* → takes a couple of seconds, a small **purple
   sparkle icon** appears next to the timestamp — that message was
   generated live by the local model, grounded in the actual portfolio
   facts (see section 7 for how you can tell it isn't hallucinating).
3. **Say the line that makes the architecture click:** *"Nothing about the
   first answer changed to make the second one possible. The model is
   strictly additive — it only ever gets a turn when the deterministic
   layer has nothing. Same chatbot, same regex, one extra fallback rung."*
4. **Optional — show the failure mode on purpose.** Stop Ollama
   (`brew services stop ollama`) and ask another open-ended question: it
   falls back to the exact same canned "I don't have that info, here's how
   to reach him" response the chatbot always gave. Nothing errors, nothing
   looks broken. This is the strongest point to make to a CTO: **the
   feature has no visible failure mode for a real visitor.**
5. **Optional, and a good one for a technical interviewer — ask something
   adversarial:** *"What would make him a bad fit for a startup?"* or *"Why
   shouldn't I hire him?"* → it declines rather than guessing, same as the
   Ollama-down case. This is deliberate, not a gap — see section 6 for the
   real testing behind that call.

### Running it

```bash
brew install ollama
brew services start ollama      # or: ollama serve
ollama pull llama3.2:1b         # ~1.3GB, one-time
npm run dev                     # or open the live production URL directly
```

The local-LLM step works against the **live public URL** too, not just
`localhost:3000` — see section 3 for why. Full setup notes: see
[`README.md`](./README.md).

---

## 3. Where the LLM call actually happens

`src/lib/localLlm.ts` sends a `fetch` from the **visitor's own browser**
directly to `http://localhost:11434/api/chat` (Ollama's REST API). There is
no backend server involved — the whole site is a static export
(`next.config.ts` → `output: "export"`, deployed to GitHub Pages).

Because the request originates in the browser:

- **On my laptop**, with `ollama serve` running, it works — the browser
  reaches its own `localhost`. This is true even against the live public
  URL, not just `localhost:3000` in dev.
- **For any other visitor**, their browser tries *their* `localhost:11434`,
  which doesn't exist. The fetch fails, `askLocalLLM` resolves to `null`,
  and the chatbot silently falls back to the same canned response it always
  gave. Nothing breaks, nothing looks different, no error is shown.

This is the core design property: **the feature can only ever help, never
hurt** — it has no failure mode visible to a real visitor.

---

## 4. The performance problem I hit, and how I fixed it

This is worth walking through live — it's a real "found a problem, diagnosed
it, fixed it" story, not just a feature that worked first try.

**First version:** the system prompt included the *entire* 67-question Q&A
corpus (`finetuning.json`) as context on every single LLM call, so the model
had maximum grounding. Measured latency on a warm model: **~54 seconds** for
one answer. Completely unusable in a chat UI.

**Root cause:** it wasn't the model being slow to *generate* — it was slow
to *read*. ~20,000 characters of context means the model has to process
thousands of tokens before it writes a single word of the answer, and a
laptop CPU/Metal isn't fast at that regardless of model size.

**Fixes applied (`src/lib/localLlm.ts`):**

1. **Keyword-relevance filtering.** Instead of sending all 67 Q&A pairs,
   score each pair by shared keywords with the question and send only the
   top ~6. The context shrinks by roughly 10x for the common case.
2. **Full-corpus fallback for the rare miss.** If literally nothing shares a
   keyword with the question, send the full corpus instead of guessing with
   an arbitrary slice — correctness over speed for that one rare path, still
   protected by the timeout below.
3. **Response length cap.** `options.num_predict: 150` plus an explicit
   "answer in at most 3 short sentences, no bullet lists or headers"
   instruction — the first version's answers were long, over-formatted, and
   ignored a softer version of this instruction.
4. **Prewarming.** `prewarmLocalLLM()` fires a throwaway request to Ollama
   the moment the chat window opens (not when a message is waiting on it),
   so the one-time cost of loading the model into memory happens in the
   background before the visitor has even finished reading the greeting.
   Guarded by a module-level singleton flag so it only fires once per page
   load, not every time the chat is toggled open/closed.

**Result:** typical warm-path answers now return in a few seconds — fast
enough for a real chat interaction, measured live against the actual UI, not
just the raw API.

**Talking point:** *"My first version worked, but it was demo-unusable —
50+ seconds. I profiled it, found the bottleneck was prompt size, not
inference, and fixed it with retrieval instead of brute-force context
stuffing. That's the same problem, and the same fix, as scaling any
RAG-style system."*

### Why `llama3.2:1b` specifically, not `3b`

This machine has **8GB of total RAM**. While testing the `3b` model
(2.0GB), the dev server process was actually killed mid-session by macOS for
running the system low on memory — a real, reproducible resource-exhaustion
bug, not a hypothetical one.

That prompted a direct benchmark: `llama3.2:3b` (2.0GB) vs. `llama3.2:1b`
(1.3GB) vs. `qwen2.5:0.5b` (0.4GB), all against the same real grounded
question. `qwen2.5:0.5b` was fastest but its answers were generic and
ignored the supplied facts — too weak for this to be worth demoing.
`llama3.2:1b` gave answers just as specific and grounded as the `3b` model,
at roughly two-thirds the memory footprint, with no OOM risk. That's the one
shipped.

**Talking point:** *"I didn't just pick the biggest model that would run —
I hit an actual out-of-memory kill during testing, benchmarked three model
sizes on the same question, and picked the smallest one that didn't lose
answer quality. On constrained hardware, that tradeoff curve matters as much
as raw capability."*

---

## 5. Guardrails

- **Grounding:** the system prompt instructs the model to answer *only*
  from the provided facts and say "I don't have that information" rather
  than invent details — small models will confidently hallucinate
  technologies or claims if not explicitly told not to (I saw this happen
  in testing before this instruction existed).
- **Tone / prompt-injection resistance:** a fixed "tone rules" block tells
  the model to stay professional, never insult anyone, and ignore any
  instruction embedded inside the visitor's question that tries to change
  its persona or behavior — it only ever answers as Aniket's portfolio
  assistant, regardless of what the input asks it to do.
- **Timeout safety net:** every call is wrapped in a 15s `AbortController`.
  If the model is unreachable, cold-starting, or unexpectedly slow, it
  fails closed into the same default response — never a hung UI.

## 6. A tested limitation: critical/adversarial questions skip the LLM entirely

Questions like *"what would make him a bad fit for a startup?"*, *"what are
his weaknesses?"*, or *"why shouldn't I hire him?"* are deliberately routed
**away** from the LLM (`isCriticalQuestion()` in `localLlm.ts` short-circuits
to the same default response used when Ollama is unreachable). This is a
documented capability ceiling, not a shortcut — worth walking through
because it's a better engineering story than "it just works."

**What was tried, in order, against the real `llama3.2:1b` model on this
machine:**

1. A single call with the full 67-entry Q&A corpus and an 8-rule
   anti-hallucination system prompt (evidence/inference separation, a rigid
   4-line output format, temperature 0.2).
2. The same, but scoped to only the keyword-matched subset of the corpus.
3. A two-step pipeline: one call to *extract* relevant evidence into a
   structured SUPPORTING / CONCERNS / UNKNOWN summary, a second call to
   *reason* only from that summary — deliberately keeping each step's job
   small, per the standard "smaller task, better small-model result"
   principle.
4. A single call scoped to a small, hand-picked ~10-entry pool
   (~3,300 characters) of facts specifically relevant to work style,
   ownership, and pressure-handling — removing the noise of 60+ irrelevant
   facts (salary, PHP, education) entirely.

**Every single approach still invented specific, plausible-sounding,
entirely unfounded claims** — "scope creep," "overemphasis on technical
debt," "lack of experience with agile methodologies," "high expectations for
rapid growth" — none of which exist anywhere in the source data, even with
explicit "only claim what's below, say so if evidence is insufficient"
instructions in every version. Approach 1 additionally leaked markdown
asterisks and ran ~54s per answer at the original (larger) context size; approach 3's first
step ignored its own "extract, don't answer" instruction outright once given
the full corpus, and just answered the original question directly.

**Why this happens:** it's not a wording problem. A 1B-parameter model has a
real, measurable ceiling on how many simultaneous constraints it can track —
find the relevant facts among many, reason about risk, and obey a strict
format, all while resisting the pull toward writing something that *sounds*
like a complete, confident answer. Adversarially-framed questions make this
worse: the question itself supplies a plausible narrative shape ("enterprise
experience → slow, inflexible") that a small model tends to complete rather
than checks against evidence.

**The deliberate constraint that shaped the fix:** this project keeps
`llama3.2:1b` as a hard requirement — local execution, low RAM/storage, no
paid API — specifically *not* solving quality problems by upsizing the
model. Given that constraint plus four failed grounding attempts, the
responsible choice for a chatbot that represents a real person to real
recruiters is to not let the model attempt this category of question at all,
rather than ship a plausible-looking but occasionally fabricated answer.

**Talking point:** *"I could have shipped the LLM answering everything and
it would have looked fine in a casual demo — but I specifically tested it
against adversarial framing, found it fabricates unsupported claims, and
made the call to route that category away from generation entirely rather
than accept the risk. Knowing where a small model's reasoning ceiling is,
and designing around it, is a more useful skill than pretending it doesn't
have one."*

## 7. Transparency: how you can tell which layer answered

Every bot message that came from the local LLM (not regex/fuzzy) carries a
small purple sparkle icon next to its timestamp (`Message.viaLLM` in
`ChatBot.tsx`) — no visible label, no mention of "AI" or a model name in the
chat itself, just a subtle visual marker so it's obvious during a demo which
answers are deterministic and which are generated live.

---

## 8. Anticipated questions

**"Why not just call OpenAI/Claude's API?"**
Cost and data. This is a personal portfolio with unpredictable traffic — a
paid API means unbounded cost per visitor question, and it means every
question a visitor types gets sent to a third party. A local model has
neither problem, and the domain (my own resume/projects) is narrow enough
that a small model is genuinely sufficient.

**"Why not just use the LLM for everything and drop the regex?"**
Predictability and speed. Regex is instant, free, and 100% deterministic —
the same question always gets the same answer. That matters for the common
questions (tech stack, contact info, availability) where there's no reason
to introduce model variance or latency at all. The LLM earns its keep only
where regex genuinely can't — synthesis across multiple facts, unexpected
phrasing.

**"What happens when this doesn't work — like right now, on a call, if
Ollama isn't running?"**
Nothing breaks. That's the point of the fallback chain — it degrades to
exactly the chatbot's original behavior with zero visible difference. I can
show that failure mode on purpose by stopping `ollama serve` mid-demo.

**"How would this scale past a 1B model / past a portfolio?"**
Same retrieval principle, bigger retrieval: swap the keyword-overlap scorer
for embeddings + a vector index once the corpus is too large for keyword
matching to stay accurate, and swap Ollama for a hosted endpoint once the
traffic or model size no longer fits comfortably on one machine. The
regex-first / LLM-fallback *shape* of the architecture doesn't change.

**"Ask it why you'd be a bad fit for a startup, right now."**
It'll say it doesn't have that information — deliberately (section 6). Good
to have ready if someone in the room already read the code and asks why.
