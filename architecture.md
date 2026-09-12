# Portfolio Chatbot — Hybrid Architecture

How `ChatBot.tsx` answers questions: deterministic intent matching first, a
local LLM only as a fallback for questions it doesn't recognize.

## Diagram

```mermaid
flowchart TD
    U[User asks a question] --> N[Normalize input<br/>lowercase, fix typos]
    N --> I{Intent layer<br/>matchIntent}

    I -->|Follow-up phrase,<br/>e.g. "tell me more"| FU[Return topic's<br/>follow-up response]
    I -->|"hiring for a ... engineer"| JM[Return job-match<br/>response]
    I -->|Matches a known<br/>regex pattern| RX[Return response.json<br/>entry]
    I -->|Typo'd/reworded but<br/>close to a known Q| FZ[Fuzzy match via<br/>edit distance]

    I -->|Nothing matched| LLM{Local LLM<br/>askLocalLLM}
    LLM -->|Ollama reachable<br/>localhost:11434| OK[llama3.2:3b answers<br/>using finetuning.json as context]
    LLM -->|Not running /<br/>different visitor's machine| DEF[Default fallback response<br/>+ log as "unanswered"]

    FU --> R[Response Builder]
    JM --> R
    RX --> R
    FZ --> R
    OK --> R
    DEF --> R
    R --> S[Suggestions + typed reply<br/>rendered in chat UI]

    style I fill:#1a6cf5,color:#fff
    style LLM fill:#a78bfa,color:#fff
    style OK fill:#4ade80,color:#000
    style DEF fill:#f59e0b,color:#000
```

## Why this order

| Layer | Cost | Speed | Used for |
|---|---|---|---|
| Regex / intent match | Free | Instant | Known questions (tech stack, projects, contact, etc.) |
| Fuzzy match | Free | Instant | Typos / reworded known questions |
| Local LLM (Ollama, `llama3.2:3b`) | Free, runs on your laptop | ~1-3s | Open-ended questions that combine multiple facts |
| Default response | Free | Instant | LLM unavailable — same behavior the site always had |

The regex layer is never bypassed. The LLM is only invoked when nothing
deterministic matched, so most visitors never touch it and get instant,
predictable answers.

## Where the LLM call happens

`src/lib/localLlm.ts` sends a `fetch` from the **browser** directly to
`http://localhost:11434/api/chat` (Ollama's REST API), with your portfolio
Q&A (`src/data/finetuning.json`) as system-prompt context.

Because the call originates from the visitor's own browser:

- **On your laptop** (dev server, or the live public site opened locally)
  with `ollama serve` running, it works — your browser reaches your own
  `localhost`.
- **For any other visitor**, their browser tries their own `localhost:11434`,
  which doesn't exist for them. The `fetch` fails, `askLocalLLM` returns
  `null`, and the chatbot silently falls back to the same default response
  it always gave. No backend, no API key, no cost, nothing to deploy.

## Talking points for the call

- "I don't want to use an LLM where deterministic logic is sufficient, so I
  built a hybrid: regex for predictable intents, a small local model only
  when the query needs language understanding."
- "It's not a general-purpose assistant — the domain is my own portfolio, so
  a 1B-3B instruct model is enough for the fallback layer."
- "The model runs locally via Ollama. No data leaves my machine, no API
  cost, and production visitors who don't have it running just see the
  original deterministic chatbot — nothing breaks for them."
