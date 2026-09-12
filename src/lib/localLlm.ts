import finetuning from "@/data/finetuning.json";

// Hybrid chatbot fallback: regex/intent matching handles known questions instantly
// (see ChatBot.tsx). Only when nothing matches do we ask a small model running
// locally via Ollama (https://ollama.com) — no API cost, no data leaves the machine.
// If Ollama isn't running (e.g. a visitor on the live site), this fails silently
// and the caller falls back to the existing default response.
const OLLAMA_URL = "http://localhost:11434/api/chat";
const OLLAMA_MODEL = "llama3.2:3b";

const CONTEXT = finetuning.examples.map((e) => `Q: ${e.q}\nA: ${e.a}`).join("\n\n");

const SYSTEM_PROMPT = `You are Aniket Rai's portfolio assistant. Answer ONLY using the facts below — do not invent anything. Keep answers under 4 sentences. If the facts don't cover the question, say you don't have that information and suggest emailing rai078945@gmail.com.

${CONTEXT}`;

export async function askLocalLLM(question: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        stream: false,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: question },
        ],
      }),
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const data = await res.json();
    const answer: string | undefined = data?.message?.content?.trim();
    return answer || null;
  } catch {
    // Ollama not running, CORS blocked, or offline — caller falls back to default response.
    return null;
  }
}
