"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Copy, Check, Mic, MicOff, Bot } from "lucide-react";
import { RESPONSES, FOLLOW_UPS, DEFAULT_RESPONSE, DEFAULT_RESPONSE_TEXTS, FINETUNING_EXAMPLES, INITIAL_SUGGESTIONS, RECRUITER_SUGGESTIONS, TYPO_MAP } from "@/data/chatResponses";
import type { ResponseEntry } from "@/data/chatResponses";
import { track } from "@/lib/track";
import { supabase } from "@/lib/supabase";
import { closestMatch } from "@/lib/levenshtein";
import { EASE, SESSION_KEY, CONTACT_EMAIL, PORTFOLIO_URL } from "@/lib/constants";

interface Message {
  from: "user" | "bot" | "compose";
  text: string;
  time: string;
  id: number | string;
}

function EmailCompose({ fullscreen }: { fullscreen: boolean }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!subject.trim() && !body.trim()) return;
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject || "Reaching out from your portfolio")}&body=${encodeURIComponent(body)}`;
    window.open(mailto);
    setSent(true);
    track("contact_click", { label: "email_compose" });
  };

  if (sent) {
    return (
      <div style={{ padding: "0.75rem 1rem", borderRadius: "14px", background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.25)", color: "#4ade80", fontSize: "0.75rem", textAlign: "center" }}>
        ✓ Email client opened! Aniket typically responds within 24 hours.
      </div>
    );
  }

  return (
    <div style={{ padding: "0.85rem 1rem", borderRadius: "14px", background: "var(--bg-card-alpha-hi)", border: "1px solid rgba(26,108,245,0.3)", display: "flex", flexDirection: "column", gap: "0.55rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
        <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#4d8ff7" }}>✉ Compose Email to Aniket</span>
        <span style={{ fontSize: "0.6rem", color: "var(--text-muted)" }}>{CONTACT_EMAIL}</span>
      </div>
      <input
        value={subject}
        onChange={e => setSubject(e.target.value)}
        placeholder="Subject"
        style={{ background: "var(--bg-card-alpha)", border: "1px solid var(--border-strong)", borderRadius: "8px", padding: "0.4rem 0.65rem", color: "var(--text-primary)", fontSize: fullscreen ? "0.8rem" : "0.72rem", outline: "none", transition: "border-color 0.2s" }}
        onFocus={e => e.target.style.borderColor = "rgba(26,108,245,0.5)"}
        onBlur={e => e.target.style.borderColor = "var(--border-strong)"}
      />
      <textarea
        value={body}
        onChange={e => setBody(e.target.value)}
        placeholder="Write your message..."
        rows={3}
        style={{ background: "var(--bg-card-alpha)", border: "1px solid var(--border-strong)", borderRadius: "8px", padding: "0.4rem 0.65rem", color: "var(--text-primary)", fontSize: fullscreen ? "0.8rem" : "0.72rem", outline: "none", resize: "none", lineHeight: 1.6, fontFamily: "inherit", transition: "border-color 0.2s" }}
        onFocus={e => e.target.style.borderColor = "rgba(26,108,245,0.5)"}
        onBlur={e => e.target.style.borderColor = "var(--border-strong)"}
      />
      <button
        onClick={handleSend}
        style={{ alignSelf: "flex-end", padding: "0.35rem 1rem", borderRadius: "999px", background: subject.trim() || body.trim() ? "#1a6cf5" : "var(--border-subtle)", border: "none", color: subject.trim() || body.trim() ? "#fff" : "var(--text-muted)", fontSize: "0.7rem", fontWeight: 700, cursor: subject.trim() || body.trim() ? "pointer" : "default", transition: "all 0.2s" }}>
        Send via Email Client →
      </button>
    </div>
  );
}

function nextId() { return Date.now() + Math.random(); }

function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function normalizeTypos(text: string): string {
  let result = text.toLowerCase().trim();
  for (const [typo, correct] of Object.entries(TYPO_MAP)) {
    result = result.replace(new RegExp(`\\b${typo}\\b`, "g"), correct);
  }
  return result;
}

function getVariableDelay(text: string): number {
  return Math.min(600 + text.length * 1.8, 2800);
}

function getTimeBasedSuggestions(): string[] {
  if (typeof window === "undefined") return INITIAL_SUGGESTIONS;
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return ["Is he available for interviews?", "What's his notice period?", "His tech stack", "Recent AI projects"];
  if (h >= 12 && h < 18) return ["Most impactful projects", "His full tech stack", "Open to remote roles?", "AI/LLM experience"];
  return INITIAL_SUGGESTIONS;
}

const CHAT_STORAGE_KEY = "chatbot_history_v1";

async function logUnanswered(question: string) {
  try {
    const existing = JSON.parse(localStorage.getItem("chatbot_unanswered") || "[]");
    if (!existing.find((e: { q: string }) => e.q === question)) {
      existing.push({ q: question, time: new Date().toISOString() });
      localStorage.setItem("chatbot_unanswered", JSON.stringify(existing));
    }
    // Also track to Supabase for Pulse dashboard
    await supabase.from("events").insert({
      event_type: "chatbot_unanswered",
      label: question,
      session_id: sessionStorage.getItem(SESSION_KEY) || "unknown",
    });
  } catch { /* ignore */ }
}

function getResponse(input: string, lastTopic: string | null): { response: ResponseEntry; topic: string | null } {
  const raw = input.toLowerCase().trim().replace(/\s+/g, " ");
  const normalized = normalizeTypos(raw);

  // Follow-up detection — context-aware
  if (/\b(tell me more|more details|elaborate|explain more|go on|continue|more about that|what else|expand on)\b/.test(raw)) {
    if (lastTopic && FOLLOW_UPS[lastTopic]) {
      return { response: FOLLOW_UPS[lastTopic], topic: lastTopic };
    }
  }

  // Auto-suggest based on job title detection
  const jobMatch = raw.match(/(?:hiring for|looking for|need a?n?\s+|position for)\s+([a-z\s]+(?:engineer|developer|architect|lead))/i);
  if (jobMatch) {
    // The capture group can include a leading article ("hiring for a lead
    // engineer" -> "a lead engineer"), which duplicated into "hiring for a a
    // lead engineer" since the template below also prepends "a".
    const title = jobMatch[1].trim().replace(/^(a|an)\s+/i, "");
    return {
      response: {
        text: `Interesting, you're hiring for a ${title}! Aniket could be a strong fit.\n\nHis relevant strengths:\n🔹 5+ years leading backend / full-stack systems at the Lead/Staff level\n🔹 Node.js + TypeScript at production scale\n🔹 AI/LLM integration experience\n🔹 System design and architecture ownership\n🔹 Currently serving his notice period, contact him directly for the exact date\n\nReach out at ${CONTACT_EMAIL} to start the conversation!`,
        suggestions: ["His full tech stack", "Projects & impact", "Notice period?", "Schedule an interview"],
        topic: "job_match",
      },
      topic: "job_match",
    };
  }

  // Try normalized text first, then raw
  for (const { pattern, response } of RESPONSES) {
    if (pattern.test(normalized) || pattern.test(raw)) {
      return { response, topic: response.topic || null };
    }
  }

  // Last resort before giving up: fuzzy-match against training examples via
  // edit distance, in case it's a typo'd or slightly-reworded known question
  // that slipped past every regex above.
  const fuzzy = closestMatch(normalized, FINETUNING_EXAMPLES, (ex) => ex.q, 0.78);
  if (fuzzy) {
    return {
      response: { text: fuzzy.item.a, suggestions: pickRandom(DEFAULT_RESPONSE.suggestions ?? [], 4) },
      topic: null,
    };
  }

  logUnanswered(input.trim());
  const text = pickRandom(DEFAULT_RESPONSE_TEXTS.length ? DEFAULT_RESPONSE_TEXTS : [DEFAULT_RESPONSE.text], 1)[0];
  return { response: { ...DEFAULT_RESPONSE, text, suggestions: pickRandom(DEFAULT_RESPONSE.suggestions ?? [], 4) }, topic: null };
}

function pickRandom<T>(pool: T[], count: number): T[] {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

const INITIAL_MSG: Message = {
  from: "bot",
  text: "Hey! I'm Aniket's portfolio assistant. Ask me anything about his skills, projects, experience, or how to get in touch.",
  time: now(),
  id: nextId(),
};

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MSG]);
  const [suggestions, setSuggestions] = useState<string[]>(getTimeBasedSuggestions);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const [typingText, setTypingText] = useState("");
  const [isTypingEffect, setIsTypingEffect] = useState(false);
  const [lastTopic, setLastTopic] = useState<string | null>(null);
  const [reactions, setReactions] = useState<Record<string, "👍" | "👎">>({});
  const [copiedId, setCopiedId] = useState<number | string | null>(null);
  const [hoveredId, setHoveredId] = useState<number | string | null>(null);
  const [recruiterMode, setRecruiterMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [justClosed, setJustClosed] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);
  const messagesRef = useRef<Message[]>(messages);
  const openRef = useRef(open);
  const nudgeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nudgeFiredRef = useRef(false);
  const userTypingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wasOpenRef = useRef(false);
  const [isUserTyping, setIsUserTyping] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const full = (e as CustomEvent).detail?.full === true;
      setFullscreen(full);
      setOpen(true);
    };
    window.addEventListener("openChatBot", handler);
    return () => window.removeEventListener("openChatBot", handler);
  }, []);

  useEffect(() => {
    if (open) {
      setUnread(0);
      track("chatbot_open", { label: fullscreen ? "welcome_modal" : "floating_button" });
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingText, typing]);

  // Keep refs in sync
  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { openRef.current = open; }, [open]);

  // Show "come back" tooltip for 5s after closing
  useEffect(() => {
    if (open) { wasOpenRef.current = true; return; }
    if (!wasOpenRef.current) return;
    wasOpenRef.current = false;
    setJustClosed(true);
    const t = setTimeout(() => setJustClosed(false), 5000);
    return () => clearTimeout(t);
  }, [open]);

  // Persist chat history to localStorage
  useEffect(() => {
    if (messages.length <= 1) return;
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages.filter(m => m.from !== "compose")));
    } catch { /* ignore */ }
  }, [messages]);

  // Restore history on first mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CHAT_STORAGE_KEY);
      if (!saved) return;
      const parsed: Message[] = JSON.parse(saved);
      if (parsed.length <= 1) return;
      const welcome: Message = { from: "bot", text: "Welcome back! 👋 Picking up where we left off.", time: now(), id: nextId() };
      setMessages([...parsed, welcome]);
    } catch { /* ignore */ }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Proactive nudge — fires 90s after last user message
  useEffect(() => {
    if (!messages.some(m => m.from === "user")) return;
    if (nudgeFiredRef.current) return;
    if (nudgeTimerRef.current) clearTimeout(nudgeTimerRef.current);
    nudgeTimerRef.current = setTimeout(() => {
      if (nudgeFiredRef.current) return;
      nudgeFiredRef.current = true;
      const nudge: Message = { from: "bot", text: "Still here if you have more questions! 👋\n\nWant to know about Aniket's AI work, his availability, or how to get in touch?", time: now(), id: nextId() };
      setMessages(m => [...m, nudge]);
      if (!openRef.current) setUnread(u => u + 1);
      setSuggestions(["His AI/ML projects", "Availability & notice", "How to contact him", "His tech stack"]);
    }, 90000);
    return () => { if (nudgeTimerRef.current) clearTimeout(nudgeTimerRef.current); };
  }, [messages]); // eslint-disable-line react-hooks/exhaustive-deps

  const typeMessage = (text: string, onDone: () => void) => {
    setIsTypingEffect(true);
    setTypingText("");
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTypingText(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setIsTypingEffect(false);
        onDone();
      }
    }, 20);
  };

  const send = useCallback((text: string) => {
    if (!text.trim() || typing || isTypingEffect) return;
    // Resume link shortcuts
    if (text.trim() === "View resume online →") {
      window.open("/resume", "_blank");
      const botMsg: Message = { from: "bot", text: "Opening Aniket's resume in a new tab! 🌐\nURL: raianiket.github.io/resume\n\nYou can also print it directly from that page.", time: now(), id: nextId() };
      setMessages(m => [...m, { from: "user", text: text.trim(), time: now(), id: nextId() }, botMsg]);
      setSuggestions(["⬇ Download resume PDF", "His experience highlights", "How to contact him?"]);
      return;
    }
    if (text.trim() === "⬇ Download resume PDF") {
      const a = document.createElement("a"); a.href = "/Aniket_Resume.pdf"; a.download = "Aniket_Resume.pdf"; a.click();
      const botMsg: Message = { from: "bot", text: "Resume download started! 📥\n\nYou can also view it online at raianiket.github.io/resume", time: now(), id: nextId() };
      setMessages(m => [...m, { from: "user", text: text.trim(), time: now(), id: nextId() }, botMsg]);
      setSuggestions(["View resume online →", "His experience highlights", "How to contact him?"]);
      return;
    }
    // Email compose shortcut
    if (text.trim() === "✉ Send Aniket an email") {
      const composeMsg: Message = { from: "compose", text: "", time: now(), id: nextId() };
      setMessages((m) => [...m, composeMsg]);
      return;
    }
    // Reset nudge on new user message
    nudgeFiredRef.current = false;

    // Frustration detection
    const inputLower = text.trim().toLowerCase();
    const recentUserTexts = messagesRef.current.filter(m => m.from === "user").slice(-3).map(m => m.text.toLowerCase().trim());
    const frustrated = /\?{2,}|wtf|not (helpful|right|working)|that'?s? wrong/i.test(text)
      || (recentUserTexts.length >= 2 && recentUserTexts.every(m => m === inputLower));
    if (frustrated) {
      setMessages(m => [...m, { from: "user", text: text.trim(), time: now(), id: nextId() }]);
      setInput("");
      track("chatbot_message", { label: "frustrated" });
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        const fr = `Hmm, looks like I might not be hitting the mark! 😅\n\nLet me connect you directly:\n📧 ${CONTACT_EMAIL}\n💼 linkedin.com/in/aniket-kumar-rai\n\nOr try asking something specific like "What's his tech stack?" or "Is he open to remote?"`;
        typeMessage(fr, () => {
          setMessages(m => [...m, { from: "bot", text: fr, time: now(), id: nextId() }]);
          setTypingText("");
          setSuggestions(["✉ Send Aniket an email", "What's his tech stack?", "Is he open to remote?"]);
        });
      }, 800);
      return;
    }

    const userMsg: Message = { from: "user", text: text.trim(), time: now(), id: nextId() };
    setMessages((m) => [...m, userMsg]);
    track("chatbot_message", { label: text.trim() });
    setInput("");
    setTyping(true);

    const { response, topic } = getResponse(text, lastTopic);
    const delay = getVariableDelay(response.text);

    setTimeout(() => {
      setTyping(false);
      if (topic) setLastTopic(topic);
      typeMessage(response.text, () => {
        const botMsg: Message = { from: "bot", text: response.text, time: now(), id: nextId() };
        setMessages((m) => [...m, botMsg]);
        setTypingText("");
        setSuggestions(response.suggestions);
        if (!open) setUnread((u) => u + 1);
      });
    }, delay);
  }, [typing, isTypingEffect, lastTopic, open]); // eslint-disable-line react-hooks/exhaustive-deps

  const reset = () => {
    setMessages([INITIAL_MSG]);
    setSuggestions(getTimeBasedSuggestions());
    try { localStorage.removeItem(CHAT_STORAGE_KEY); } catch { /* ignore */ }
    nudgeFiredRef.current = false;
    setTypingText("");
    setTyping(false);
    setIsTypingEffect(false);
    setLastTopic(null);
    setReactions({});
    setRecruiterMode(false);
  };

  const activateRecruiterMode = () => {
    if (recruiterMode) return;
    setRecruiterMode(true);
    setSuggestions(RECRUITER_SUGGESTIONS);
    track("recruiter_mode", { label: "activated" });
    const botMsg: Message = {
      from: "bot",
      text: "Switched to Recruiter Mode! 👔\n\nI'll now prioritize the most relevant information for evaluating Aniket. Use the quick actions below or ask me anything specific.",
      time: now(),
      id: nextId(),
    };
    setMessages((m) => [...m, botMsg]);
  };

  const copyMessage = (text: string, id: number | string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }).catch(() => {
      // Clipboard not available (non-HTTPS / permissions denied) — silently ignore
    });
  };

  const setReaction = (id: number | string, emoji: "👍" | "👎") => {
    setReactions((r) => {
      if (r[id] === emoji) {
        const next = { ...r };
        delete next[id];
        return next;
      }
      return { ...r, [id]: emoji };
    });
    track("chatbot_reaction", { label: emoji });
  };

  const emailTranscript = () => {
    const body = messages.map((m) => `[${m.time}] ${m.from === "bot" ? "Bot" : "You"}: ${m.text}`).join("\n\n");
    const subject = "Aniket Rai: Portfolio Chat Transcript";
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const downloadTranscript = () => {
    const lines = [
      "═══════════════════════════════════════",
      "     Aniket Rai: Portfolio Chat",
      `     ${new Date().toLocaleString()}`,
      "═══════════════════════════════════════",
      "",
      ...messages.map((m) => `[${m.time}] ${m.from === "bot" ? "🤖 Bot" : "👤 You"}\n${m.text}`),
      "",
      "───────────────────────────────────────",
      `Contact: ${CONTACT_EMAIL}`,
      `Portfolio: ${PORTFOLIO_URL}`,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "aniket-rai-chat.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const sharePortfolio = () => {
    const url = PORTFOLIO_URL;
    const text = "Check out Aniket Rai's portfolio, Lead Software Engineer with 5+ years in AI, AWS & scalable systems.";
    if (navigator.share) {
      navigator.share({ title: "Aniket Rai: Portfolio", text, url });
    } else {
      navigator.clipboard.writeText(`${text}\n${url}`);
    }
  };

  const toggleVoice = () => {
    type SRResult = { transcript: string };
    type SRCtor = new () => {
      continuous: boolean;
      interimResults: boolean;
      lang: string;
      onresult: ((e: { results: Array<{ 0: SRResult }> }) => void) | null;
      onerror: (() => void) | null;
      onend: (() => void) | null;
      start: () => void;
      stop: () => void;
    };

    const w = window as unknown as { SpeechRecognition?: SRCtor; webkitSpeechRecognition?: SRCtor };
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;

    if (!SR) {
      setInput("⚠ Voice input requires Chrome or Edge");
      setTimeout(() => setInput(""), 2500);
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };

  return (
    <>
      {/* Floating launcher — one capsule that morphs into a circle when open */}
      <motion.button
        className="chatbot-fab"
        layout
        onClick={() => { setOpen((o) => !o); setFullscreen(false); }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ layout: { duration: 0.35, ease: EASE } }}
        aria-label={open ? "Close assistant" : "Open Aniket's Assistant"}
        style={{
          position: "fixed", bottom: "1.75rem", right: "1.75rem", zIndex: 999,
          display: "flex", alignItems: "center", gap: open ? 0 : "10px",
          padding: open ? "4px" : "6px 8px 6px 18px",
          borderRadius: "999px", border: "none",
          background: "var(--bg-card-alpha-hi)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.25), 0 0 0 1px rgba(26,108,245,0.22)",
          cursor: "pointer",
        }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {!open && (
            <motion.span
              key={justClosed ? "comeback" : "default"}
              layout="position"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              className="chatbot-copy"
              style={{ display: "flex", alignItems: "center", gap: "8px", whiteSpace: "nowrap" }}
            >
              {justClosed ? (
                <>
                  <span style={{ fontSize: "0.85rem" }}>↩</span>
                  <span style={{ color: "#7eb3ff", fontSize: "0.74rem", fontWeight: 600 }}>Come back & ask anything</span>
                </>
              ) : (
                <>
                  <motion.span
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80", flexShrink: 0 }}
                  />
                  <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.25, textAlign: "left" }}>
                    <span style={{ color: "var(--text-primary)", fontSize: "0.74rem", fontWeight: 600 }}>Aniket&apos;s Assistant</span>
                    <span className="chatbot-sub" style={{ color: "var(--text-muted)", fontSize: "0.62rem" }}>Ask me anything</span>
                  </span>
                </>
              )}
            </motion.span>
          )}
        </AnimatePresence>

        <motion.span
          layout
          className="chatbot-icon"
          style={{
            width: open ? "52px" : "44px", height: open ? "52px" : "44px", borderRadius: "50%",
            background: "rgba(26,108,245,0.14)", border: "1px solid rgba(77,143,247,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative",
          }}
        >
          {!open && (
            <motion.span
              animate={{ scale: [1, 1.55], opacity: [0.5, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
              style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(26,108,245,0.5)", pointerEvents: "none" }}
            />
          )}
          <AnimatePresence mode="wait">
            {open
              ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }} style={{ display: "flex" }}><X size={19} color="var(--text-primary)" /></motion.span>
              : <motion.span key="bot" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }} style={{ display: "flex" }}><Bot size={21} color="#4d8ff7" strokeWidth={2} /></motion.span>
            }
          </AnimatePresence>
          <AnimatePresence>
            {!open && unread > 0 && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                style={{ position: "absolute", top: "-3px", right: "-3px", width: "17px", height: "17px", borderRadius: "50%", background: "#ef4444", color: "#fff", fontSize: "0.58rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid var(--bg-primary)" }}>
                {unread}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.span>
      </motion.button>

      {/* Backdrop for fullscreen mode */}
      <AnimatePresence>
        {open && fullscreen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => { setOpen(false); setFullscreen(false); }}
            style={{
              position: "fixed", inset: 0, zIndex: 997,
              background: "var(--bg-card-alpha)",
              backdropFilter: "blur(8px)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: fullscreen ? 40 : 60, scale: fullscreen ? 0.95 : 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: fullscreen ? 120 : 220, scale: 0.72, x: 20 }}
            transition={{ duration: fullscreen ? 0.45 : 0.4, ease: [0.4, 0, 1, 1] }}
            style={fullscreen ? {
              position: "fixed", inset: 0, margin: "auto",
              zIndex: 998,
              width: "min(640px, 92vw)", height: "min(700px, 90vh)",
              background: "var(--bg-card-alpha-hi)",
              border: "1px solid var(--border-strong)",
              borderRadius: "24px",
              display: "flex", flexDirection: "column",
              boxShadow: "0 32px 100px rgba(0,0,0,0.75), 0 0 0 1px rgba(26,108,245,0.15)",
              backdropFilter: "blur(20px)",
              overflow: "hidden",
            } : {
              position: "fixed", bottom: "5.75rem", right: "max(0.75rem, min(1.75rem, calc(100vw - 362px)))", zIndex: 998,
              width: "min(360px, calc(100vw - 1.5rem))", maxHeight: "min(560px, 80vh)",
              background: "var(--bg-card-alpha-hi)",
              border: "1px solid var(--border-strong)",
              borderRadius: "22px",
              display: "flex", flexDirection: "column",
              boxShadow: "0 20px 70px rgba(0,0,0,0.6), 0 0 0 1px rgba(26,108,245,0.12)",
              backdropFilter: "blur(20px)",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div style={{
              padding: "0.9rem 1.25rem",
              borderBottom: "1px solid var(--border-medium)",
              display: "flex", alignItems: "center", gap: "0.75rem",
              flexWrap: "wrap", rowGap: "0.5rem",
              background: "var(--bg-card-alpha-hi)",
              position: "relative",
            }}>
              <div style={{
                width: "42px", height: "42px", borderRadius: "50%", flexShrink: 0,
                background: "rgba(26,108,245,0.14)",
                border: "1px solid rgba(77,143,247,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Bot size={20} color="#4d8ff7" strokeWidth={2} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <p style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: "0.85rem" }}>Aniket&apos;s Assistant</p>
                  {recruiterMode && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { setRecruiterMode(false); setSuggestions(INITIAL_SUGGESTIONS); }}
                      title="Exit Recruiter Mode"
                      style={{ fontSize: "0.58rem", fontWeight: 700, padding: "0.1rem 0.45rem", borderRadius: "999px", background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.35)", color: "#fbbf24", cursor: "pointer", display: "flex", alignItems: "center", gap: "3px" }}
                    >
                      RECRUITER <span style={{ opacity: 0.7 }}>×</span>
                    </motion.button>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <motion.span
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80", display: "inline-block" }}
                  />
                  <span style={{ color: "#4ade80", fontSize: "0.65rem" }}>Online · Always here</span>
                </div>
              </div>

              {/* Header actions — text badge buttons */}
              <div style={{ display: "flex", alignItems: "center", gap: "5px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                {/* Recruiter toggle badge */}
                {!recruiterMode ? (
                  <button onClick={activateRecruiterMode} title="Switch to Recruiter Mode"
                    style={{ fontSize: "0.6rem", fontWeight: 700, padding: "0.2rem 0.55rem", borderRadius: "999px", border: "1px solid rgba(251,191,36,0.3)", background: "rgba(251,191,36,0.07)", color: "#92780a", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s", letterSpacing: "0.02em" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(251,191,36,0.6)"; e.currentTarget.style.color = "#fbbf24"; e.currentTarget.style.background = "rgba(251,191,36,0.14)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(251,191,36,0.3)"; e.currentTarget.style.color = "#92780a"; e.currentTarget.style.background = "rgba(251,191,36,0.07)"; }}>
                    👔 Recruiter
                  </button>
                ) : null}

                {/* Divider */}
                <span style={{ width: "1px", height: "14px", background: "var(--border-strong)", flexShrink: 0 }} />

                {/* Action text badges */}
                {([
                  { label: "Share", tooltip: "Share portfolio link", action: sharePortfolio },
                  { label: "Email", tooltip: "Email this transcript", action: emailTranscript },
                  { label: "Save", tooltip: "Download transcript (.txt)", action: downloadTranscript },
                  { label: "Reset", tooltip: "Clear conversation", action: reset, danger: true },
                ] as { label: string; tooltip: string; action: () => void; danger?: boolean }[]).map(({ label, tooltip, action, danger }) => (
                  <div key={label} style={{ position: "relative" }}
                    onMouseEnter={e => { const t = e.currentTarget.querySelector(".hdr-tip") as HTMLElement; if (t) t.style.opacity = "1"; }}
                    onMouseLeave={e => { const t = e.currentTarget.querySelector(".hdr-tip") as HTMLElement; if (t) t.style.opacity = "0"; }}>
                    <button onClick={action}
                      style={{ fontSize: "0.6rem", fontWeight: 600, padding: "0.2rem 0.5rem", borderRadius: "999px", border: "1px solid var(--border-medium)", background: "none", color: "var(--text-muted)", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = danger ? "rgba(239,68,68,0.4)" : "rgba(26,108,245,0.4)"; e.currentTarget.style.color = danger ? "#ef4444" : "var(--text-primary)"; e.currentTarget.style.background = danger ? "rgba(239,68,68,0.07)" : "rgba(26,108,245,0.07)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-medium)"; e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "none"; }}>
                      {label}
                    </button>
                    <div className="hdr-tip" style={{ position: "absolute", bottom: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)", background: "var(--bg-card-alpha-hi)", border: "1px solid var(--border-strong)", borderRadius: "7px", padding: "0.25rem 0.55rem", fontSize: "0.6rem", color: "var(--text-primary)", whiteSpace: "nowrap", pointerEvents: "none", opacity: 0, transition: "opacity 0.15s", zIndex: 20 }}>
                      {tooltip}
                    </div>
                  </div>
                ))}

                {fullscreen && (
                  <button onClick={() => { setOpen(false); setFullscreen(false); }} title="Close"
                    style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: "var(--text-muted)", display: "flex", borderRadius: "6px", marginLeft: "1px", transition: "color 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.color = "var(--text-primary)"}
                    onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}>
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.65rem" }}>

              {/* Recruiter banner — shown after initial message only */}
              {!recruiterMode && messages.length === 1 && (
                <motion.button
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  onClick={activateRecruiterMode}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: "10px",
                    padding: "0.65rem 0.9rem", borderRadius: "14px",
                    background: "linear-gradient(135deg, rgba(251,191,36,0.1), rgba(245,158,11,0.06))",
                    border: "1px solid rgba(251,191,36,0.4)",
                    cursor: "pointer", textAlign: "left",
                    transition: "all 0.2s",
                  }}
                  whileHover={{ borderColor: "rgba(251,191,36,0.7)", scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span style={{ fontSize: "1.2rem", flexShrink: 0 }}>👔</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#fbbf24", fontSize: "0.78rem", fontWeight: 700, marginBottom: "2px" }}>Are you a recruiter?</div>
                    <div style={{ color: "#92780a", fontSize: "0.66rem" }}>Switch to Recruiter Mode for tailored insights →</div>
                  </div>
                </motion.button>
              )}

              {messages.map((msg) => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
                  onMouseEnter={() => setHoveredId(msg.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{ display: "flex", flexDirection: "column", alignItems: msg.from === "user" ? "flex-end" : "flex-start", gap: "3px" }}>
                  {msg.from === "compose" ? (
                    <div style={{ width: "100%", maxWidth: "92%" }}>
                      <EmailCompose fullscreen={fullscreen} />
                    </div>
                  ) : (
                  <div style={{
                    maxWidth: "88%", padding: fullscreen ? "0.75rem 1.1rem" : "0.6rem 0.9rem",
                    borderRadius: msg.from === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    background: msg.from === "user" ? "linear-gradient(135deg, #1a6cf5, #4d8ff7)" : "var(--bg-card-alpha-hi)",
                    border: msg.from === "user" ? "none" : "1px solid var(--border-strong)",
                    color: msg.from === "user" ? "#fff" : "var(--text-primary)",
                    fontSize: fullscreen ? "0.88rem" : "0.77rem", lineHeight: 1.65, whiteSpace: "pre-line",
                    position: "relative",
                  }}>{msg.text}</div>
                  )}

                  {/* Bot message actions: time + reactions + copy */}
                  {msg.from === "bot" && (
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", paddingInline: "4px", minHeight: "20px" }}>
                      <span style={{ fontSize: "0.6rem", color: "var(--text-muted)" }}>{msg.time}</span>
                      <AnimatePresence>
                        {(hoveredId === msg.id || reactions[msg.id]) && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.15 }}
                            style={{ display: "flex", alignItems: "center", gap: "3px" }}
                          >
                            {(["👍", "👎"] as const).map((emoji) => (
                              <button key={emoji} onClick={() => setReaction(msg.id, emoji)}
                                style={{
                                  background: reactions[msg.id] === emoji ? "rgba(26,108,245,0.2)" : "var(--bg-card-alpha-lo)",
                                  border: `1px solid ${reactions[msg.id] === emoji ? "rgba(26,108,245,0.4)" : "var(--border-faint)"}`,
                                  borderRadius: "6px", padding: "2px 6px", cursor: "pointer",
                                  fontSize: "0.65rem", lineHeight: 1.5, transition: "all 0.15s",
                                }}>
                                {emoji}
                              </button>
                            ))}
                            <button onClick={() => copyMessage(msg.text, msg.id)}
                              title="Copy"
                              style={{ background: "var(--bg-card-alpha-lo)", border: "1px solid var(--border-faint)", borderRadius: "6px", padding: "2px 5px", cursor: "pointer", display: "flex", alignItems: "center", transition: "all 0.15s" }}>
                              {copiedId === msg.id
                                ? <Check size={10} color="#4ade80" />
                                : <Copy size={10} color="var(--text-muted)" />
                              }
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* User message: time + reuse */}
                  {msg.from === "user" && (
                    <div style={{ display: "flex", alignItems: "center", gap: "5px", paddingInline: "4px" }}>
                      <span style={{ fontSize: "0.6rem", color: "var(--text-muted)" }}>{msg.time}</span>
                      <AnimatePresence>
                        {hoveredId === msg.id && (
                          <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.15 }}
                            onClick={() => { setInput(msg.text); setTimeout(() => inputRef.current?.focus(), 50); }}
                            title="Edit & resend"
                            style={{ fontSize: "0.58rem", fontWeight: 600, padding: "0.12rem 0.45rem", borderRadius: "999px", background: "rgba(26,108,245,0.1)", border: "1px solid rgba(26,108,245,0.25)", color: "#4d8ff7", cursor: "pointer", transition: "all 0.15s" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(26,108,245,0.2)"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "rgba(26,108,245,0.1)"; }}
                          >
                            ↩ Edit
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing indicator */}
              {typing && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "3px" }}>
                  <div style={{ padding: "0.6rem 0.9rem", borderRadius: "16px 16px 16px 4px", background: "var(--bg-card-alpha-hi)", border: "1px solid var(--border-strong)", display: "flex", gap: "4px", alignItems: "center" }}>
                    {[0, 1, 2].map((d) => (
                      <motion.span key={d} animate={{ y: [0, -4, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: d * 0.15 }}
                        style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#4d8ff7", display: "inline-block" }} />
                    ))}
                  </div>
                </div>
              )}

              {/* Typing effect */}
              {isTypingEffect && typingText && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "3px" }}>
                  <div style={{ maxWidth: "88%", padding: fullscreen ? "0.75rem 1.1rem" : "0.6rem 0.9rem", borderRadius: "16px 16px 16px 4px", background: "var(--bg-card-alpha-hi)", border: "1px solid var(--border-strong)", color: "var(--text-primary)", fontSize: fullscreen ? "0.88rem" : "0.77rem", lineHeight: 1.65, whiteSpace: "pre-line" }}>
                    {typingText}
                    <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }}
                      style={{ display: "inline-block", width: "2px", height: "12px", background: "#4d8ff7", marginLeft: "2px", verticalAlign: "middle" }} />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Contextual suggestions */}
            <div style={{ padding: "0.5rem 1rem 0.6rem", display: "flex", flexWrap: "wrap", gap: "0.4rem", borderTop: "1px solid var(--border-faint)" }}>
              {suggestions.map((s) => (
                <motion.button key={s} whileHover={{ borderColor: "rgba(26,108,245,0.5)", background: "rgba(26,108,245,0.12)" }}
                  onClick={() => send(s)}
                  style={{ fontSize: "0.65rem", padding: "0.28rem 0.65rem", borderRadius: "999px", background: "rgba(26,108,245,0.07)", border: "1px solid rgba(26,108,245,0.2)", color: "#4d8ff7", cursor: "pointer", transition: "all 0.2s" }}>
                  {s}
                </motion.button>
              ))}
            </div>

            {/* User typing indicator */}
            <AnimatePresence>
              {isUserTyping && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ padding: "0.2rem 1.1rem", display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <span style={{ fontSize: "0.58rem", color: "var(--text-muted)", fontStyle: "italic" }}>typing</span>
                  {[0, 1, 2].map(d => (
                    <motion.span key={d} animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 0.7, repeat: Infinity, delay: d * 0.2 }}
                      style={{ width: "3px", height: "3px", borderRadius: "50%", background: "var(--text-muted)", display: "inline-block" }} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <div style={{ padding: "0.7rem 1rem", borderTop: "1px solid var(--border-medium)", display: "flex", gap: "0.5rem", alignItems: "center", background: "var(--bg-card-alpha)" }}>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  if (e.target.value.trim()) {
                    setIsUserTyping(true);
                    if (userTypingTimerRef.current) clearTimeout(userTypingTimerRef.current);
                    userTypingTimerRef.current = setTimeout(() => setIsUserTyping(false), 1000);
                  } else {
                    setIsUserTyping(false);
                  }
                }}
                onKeyDown={(e) => e.key === "Enter" && send(input)}
                placeholder="Ask me anything..."
                style={{ flex: 1, background: "var(--bg-card-alpha)", border: "1px solid var(--border-strong)", borderRadius: "12px", padding: "0.5rem 0.75rem", color: "var(--text-primary)", fontSize: "0.78rem", outline: "none", transition: "border-color 0.2s" }}
                onFocus={(e) => e.target.style.borderColor = "rgba(26,108,245,0.5)"}
                onBlur={(e) => e.target.style.borderColor = "var(--border-strong)"}
              />
              {/* Mic button */}
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={toggleVoice}
                title={isListening ? "Stop listening" : "Voice input"}
                style={{
                  width: "36px", height: "36px", borderRadius: "11px", flexShrink: 0,
                  background: isListening ? "rgba(239,68,68,0.2)" : "var(--border-subtle)",
                  border: isListening ? "1px solid rgba(239,68,68,0.5)" : "1px solid var(--border-medium)",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s",
                }}
              >
                {isListening
                  ? <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.8, repeat: Infinity }}><MicOff size={14} color="#ef4444" /></motion.span>
                  : <Mic size={14} color="var(--text-muted)" />
                }
              </motion.button>
              {/* Send button */}
              <motion.button whileTap={{ scale: 0.92 }} onClick={() => send(input)}
                style={{ width: "36px", height: "36px", borderRadius: "11px", flexShrink: 0, background: input.trim() ? "#1a6cf5" : "var(--border-subtle)", border: "none", cursor: input.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}>
                <Send size={14} color={input.trim() ? "#fff" : "var(--text-muted)"} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 640px) {
          .chatbot-fab { bottom: 1rem !important; right: 1rem !important; padding: 5px !important; }
          .chatbot-copy { display: none !important; }
          .chatbot-icon { width: 46px !important; height: 46px !important; }
        }
      `}</style>
    </>
  );
}
