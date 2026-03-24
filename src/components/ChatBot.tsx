"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, RotateCcw, Copy, Check, Share2, Mic, MicOff, Download, Mail } from "lucide-react";
import { RESPONSES, FOLLOW_UPS, DEFAULT_RESPONSE, INITIAL_SUGGESTIONS, RECRUITER_SUGGESTIONS, TYPO_MAP } from "@/data/chatResponses";
import type { ResponseEntry } from "@/data/chatResponses";
import { track } from "@/lib/track";
import { supabase } from "@/lib/supabase";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface Message {
  from: "user" | "bot";
  text: string;
  time: string;
  id: number | string;
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
      session_id: sessionStorage.getItem("portfolio_session") || "unknown",
    });
  } catch { /* ignore */ }
}

function getResponse(input: string, lastTopic: string | null): { response: ResponseEntry; topic: string | null } {
  const raw = input.toLowerCase().trim();
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
    const title = jobMatch[1].trim();
    return {
      response: {
        text: `Interesting — you're hiring for a ${title}! Aniket could be a strong fit.\n\nHis relevant strengths:\n🔹 5+ years of Senior Backend / Full-Stack experience\n🔹 Node.js + TypeScript at production scale\n🔹 AI/LLM integration experience\n🔹 System design and architecture ownership\n🔹 90-day notice (negotiable)\n\nReach out at rai078945@gmail.com to start the conversation!`,
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

  logUnanswered(input.trim());
  return { response: DEFAULT_RESPONSE, topic: null };
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
  const [suggestions, setSuggestions] = useState<string[]>(INITIAL_SUGGESTIONS);
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
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);

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

  // Close header menu on outside click
  useEffect(() => {
    if (!showHeaderMenu) return;
    const handler = () => setShowHeaderMenu(false);
    setTimeout(() => window.addEventListener("click", handler), 0);
    return () => window.removeEventListener("click", handler);
  }, [showHeaderMenu]);

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
    }, 10);
  };

  const send = useCallback((text: string) => {
    if (!text.trim() || typing || isTypingEffect) return;
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
    setSuggestions(INITIAL_SUGGESTIONS);
    setTypingText("");
    setTyping(false);
    setIsTypingEffect(false);
    setLastTopic(null);
    setReactions({});
    setRecruiterMode(false);
  };

  const activateRecruiterMode = () => {
    setRecruiterMode(true);
    setSuggestions(RECRUITER_SUGGESTIONS);
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
    const subject = "Aniket Rai — Portfolio Chat Transcript";
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const downloadTranscript = () => {
    const lines = [
      "═══════════════════════════════════════",
      "     Aniket Rai — Portfolio Chat",
      `     ${new Date().toLocaleString()}`,
      "═══════════════════════════════════════",
      "",
      ...messages.map((m) => `[${m.time}] ${m.from === "bot" ? "🤖 Bot" : "👤 You"}\n${m.text}`),
      "",
      "───────────────────────────────────────",
      "Contact: rai078945@gmail.com",
      "Portfolio: raianiket.github.io",
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
    const url = "https://raianiket.github.io";
    const text = "Check out Aniket Rai's portfolio — Senior Software Engineer with 5+ years in AI, AWS & scalable systems.";
    if (navigator.share) {
      navigator.share({ title: "Aniket Rai — Portfolio", text, url });
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
      alert("Voice input is not supported in this browser. Try Chrome or Edge.");
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
      {/* Floating button with label */}
      <div style={{ position: "fixed", bottom: "1.75rem", right: "1.75rem", zIndex: 999, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
        {/* Label tooltip — hide when small panel is open */}
        {(!open || fullscreen) && (
          <div
            style={{
              background: "rgba(7,20,36,0.95)",
              border: "1px solid rgba(26,108,245,0.35)",
              borderRadius: "10px",
              padding: "0.4rem 0.75rem",
              display: "flex", alignItems: "center", gap: "6px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              whiteSpace: "nowrap",
            }}
          >
            <motion.span
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80", display: "inline-block", flexShrink: 0 }}
            />
            <span style={{ color: "#e8f0fe", fontSize: "0.72rem", fontWeight: 600 }}>Aniket Assistant Bot</span>
            <span style={{ color: "#4a6b8a", fontSize: "0.65rem" }}>Ask me anything</span>
          </div>
        )}

        <motion.button
          onClick={() => { setOpen((o) => !o); setFullscreen(false); }}
          animate={open ? { y: 0 } : { y: [0, -10, 0] }}
          transition={open ? {} : { duration: 1.2, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.6 }}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.95 }}
          style={{
            width: "72px", height: "72px", borderRadius: "50%",
            background: "linear-gradient(135deg, #0d1b2e, #1a3a6e)",
            border: "3px solid rgba(126,179,255,0.5)",
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 6px 36px rgba(26,108,245,0.7), 0 0 0 6px rgba(26,108,245,0.2)",
            position: "relative",
          }}
        >
          {!open && (
            <motion.span
              animate={{ scale: [1, 1.7], opacity: [0.6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
              style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(26,108,245,0.45)", pointerEvents: "none" }}
            />
          )}
          <AnimatePresence mode="wait">
            {open
              ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}><X size={22} color="#fff" /></motion.span>
              : <motion.span key="bot" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/aniketbot.jpg" alt="bot" style={{ width: "58px", height: "58px", objectFit: "contain", mixBlendMode: "screen" }} />
                </motion.span>
            }
          </AnimatePresence>
          <AnimatePresence>
            {!open && unread > 0 && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                style={{ position: "absolute", top: "-4px", right: "-4px", width: "18px", height: "18px", borderRadius: "50%", background: "#ef4444", color: "#fff", fontSize: "0.6rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #050d1a" }}>
                {unread}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

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
              background: "rgba(5,13,26,0.85)",
              backdropFilter: "blur(8px)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: fullscreen ? 40 : 30, scale: fullscreen ? 0.95 : 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: fullscreen ? 80 : 120, scale: 0.88 }}
            transition={{ duration: fullscreen ? 0.45 : 0.35, ease: EASE }}
            style={fullscreen ? {
              position: "fixed", inset: 0, margin: "auto",
              zIndex: 998,
              width: "min(640px, 92vw)", height: "min(700px, 90vh)",
              background: "rgba(5,13,26,0.98)",
              border: "1px solid rgba(30,58,95,0.9)",
              borderRadius: "24px",
              display: "flex", flexDirection: "column",
              boxShadow: "0 32px 100px rgba(0,0,0,0.75), 0 0 0 1px rgba(26,108,245,0.15)",
              backdropFilter: "blur(20px)",
              overflow: "hidden",
            } : {
              position: "fixed", bottom: "5.75rem", right: "1.75rem", zIndex: 998,
              width: "360px", maxHeight: "560px",
              background: "rgba(5,13,26,0.98)",
              border: "1px solid rgba(30,58,95,0.9)",
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
              borderBottom: "1px solid rgba(30,58,95,0.7)",
              display: "flex", alignItems: "center", gap: "0.75rem",
              background: "rgba(7,20,36,0.9)",
              position: "relative",
            }}>
              <div style={{
                width: "42px", height: "42px", borderRadius: "50%", flexShrink: 0,
                background: "linear-gradient(135deg, #0d1b2e, #1a3a6e)",
                border: "2px solid rgba(26,108,245,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                overflow: "hidden",
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/aniketbot.jpg" alt="bot" style={{ width: "36px", height: "36px", objectFit: "contain", mixBlendMode: "screen" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <p style={{ color: "#e8f0fe", fontWeight: 700, fontSize: "0.85rem" }}>Aniket Assistant Bot</p>
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

              {/* Header actions */}
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <button onClick={sharePortfolio} title="Share portfolio"
                  style={{ background: "none", border: "none", cursor: "pointer", padding: "5px", color: "#4a6b8a", display: "flex", borderRadius: "6px", transition: "color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#4d8ff7"}
                  onMouseLeave={e => e.currentTarget.style.color = "#4a6b8a"}>
                  <Share2 size={13} />
                </button>
                <div style={{ position: "relative" }}>
                  <button onClick={(e) => { e.stopPropagation(); setShowHeaderMenu(!showHeaderMenu); }} title="More options"
                    style={{ background: "none", border: "none", cursor: "pointer", padding: "5px", color: "#4a6b8a", display: "flex", borderRadius: "6px", fontSize: "1rem", lineHeight: 1, transition: "color 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#4d8ff7"}
                    onMouseLeave={e => e.currentTarget.style.color = "#4a6b8a"}>
                    ⋯
                  </button>
                  <AnimatePresence>
                    {showHeaderMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        onClick={e => e.stopPropagation()}
                        style={{
                          position: "absolute", top: "100%", right: 0, marginTop: "4px",
                          background: "rgba(7,20,36,0.98)", border: "1px solid rgba(30,58,95,0.9)",
                          borderRadius: "12px", padding: "0.35rem",
                          boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
                          zIndex: 10, minWidth: "160px",
                        }}
                      >
                        {[
                          ...(!recruiterMode ? [{ icon: null, label: "👔 Recruiter Mode", action: () => { activateRecruiterMode(); setShowHeaderMenu(false); } }] : []),
                          { icon: Mail, label: "Email transcript", action: emailTranscript },
                          { icon: Download, label: "Download .txt", action: downloadTranscript },
                          { icon: RotateCcw, label: "Reset chat", action: () => { reset(); setShowHeaderMenu(false); } },
                        ].map(({ icon: Icon, label, action }) => (
                          <button key={label} onClick={() => { action(); setShowHeaderMenu(false); }}
                            style={{ width: "100%", display: "flex", alignItems: "center", gap: "8px", padding: "0.45rem 0.75rem", background: "none", border: "none", cursor: "pointer", color: "#7a9cc5", fontSize: "0.75rem", borderRadius: "8px", textAlign: "left", transition: "all 0.15s" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(26,108,245,0.1)"; e.currentTarget.style.color = "#e8f0fe"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#7a9cc5"; }}>
                            {Icon && <Icon size={12} />}
                            {label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {fullscreen && (
                  <button onClick={() => { setOpen(false); setFullscreen(false); }} title="Close"
                    style={{ background: "none", border: "none", cursor: "pointer", padding: "5px", color: "#4a6b8a", display: "flex", marginLeft: "2px", transition: "color 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#e8f0fe"}
                    onMouseLeave={e => e.currentTarget.style.color = "#4a6b8a"}>
                    <X size={16} />
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
                  onMouseEnter={() => msg.from === "bot" && setHoveredId(msg.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{ display: "flex", flexDirection: "column", alignItems: msg.from === "user" ? "flex-end" : "flex-start", gap: "3px" }}>
                  <div style={{
                    maxWidth: "88%", padding: fullscreen ? "0.75rem 1.1rem" : "0.6rem 0.9rem",
                    borderRadius: msg.from === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    background: msg.from === "user" ? "linear-gradient(135deg, #1a6cf5, #4d8ff7)" : "rgba(13,27,46,0.95)",
                    border: msg.from === "user" ? "none" : "1px solid rgba(30,58,95,0.8)",
                    color: msg.from === "user" ? "#fff" : "#c8daf4",
                    fontSize: fullscreen ? "0.88rem" : "0.77rem", lineHeight: 1.65, whiteSpace: "pre-line",
                    position: "relative",
                  }}>{msg.text}</div>

                  {/* Bot message actions: time + reactions + copy */}
                  {msg.from === "bot" && (
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", paddingInline: "4px", minHeight: "20px" }}>
                      <span style={{ fontSize: "0.6rem", color: "#2d4a6a" }}>{msg.time}</span>
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
                                  background: reactions[msg.id] === emoji ? "rgba(26,108,245,0.2)" : "rgba(13,27,46,0.6)",
                                  border: `1px solid ${reactions[msg.id] === emoji ? "rgba(26,108,245,0.4)" : "rgba(30,58,95,0.5)"}`,
                                  borderRadius: "6px", padding: "2px 6px", cursor: "pointer",
                                  fontSize: "0.65rem", lineHeight: 1.5, transition: "all 0.15s",
                                }}>
                                {emoji}
                              </button>
                            ))}
                            <button onClick={() => copyMessage(msg.text, msg.id)}
                              title="Copy"
                              style={{ background: "rgba(13,27,46,0.6)", border: "1px solid rgba(30,58,95,0.5)", borderRadius: "6px", padding: "2px 5px", cursor: "pointer", display: "flex", alignItems: "center", transition: "all 0.15s" }}>
                              {copiedId === msg.id
                                ? <Check size={10} color="#4ade80" />
                                : <Copy size={10} color="#4a6b8a" />
                              }
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* User message time */}
                  {msg.from === "user" && (
                    <span style={{ fontSize: "0.6rem", color: "#2d4a6a", paddingInline: "4px" }}>{msg.time}</span>
                  )}
                </motion.div>
              ))}

              {/* Typing indicator */}
              {typing && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "3px" }}>
                  <div style={{ padding: "0.6rem 0.9rem", borderRadius: "16px 16px 16px 4px", background: "rgba(13,27,46,0.95)", border: "1px solid rgba(30,58,95,0.8)", display: "flex", gap: "4px", alignItems: "center" }}>
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
                  <div style={{ maxWidth: "88%", padding: fullscreen ? "0.75rem 1.1rem" : "0.6rem 0.9rem", borderRadius: "16px 16px 16px 4px", background: "rgba(13,27,46,0.95)", border: "1px solid rgba(30,58,95,0.8)", color: "#c8daf4", fontSize: fullscreen ? "0.88rem" : "0.77rem", lineHeight: 1.65, whiteSpace: "pre-line" }}>
                    {typingText}
                    <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }}
                      style={{ display: "inline-block", width: "2px", height: "12px", background: "#4d8ff7", marginLeft: "2px", verticalAlign: "middle" }} />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Contextual suggestions */}
            <div style={{ padding: "0.5rem 1rem 0.6rem", display: "flex", flexWrap: "wrap", gap: "0.4rem", borderTop: "1px solid rgba(30,58,95,0.5)" }}>
              {suggestions.map((s) => (
                <motion.button key={s} whileHover={{ borderColor: "rgba(26,108,245,0.5)", background: "rgba(26,108,245,0.12)" }}
                  onClick={() => send(s)}
                  style={{ fontSize: "0.65rem", padding: "0.28rem 0.65rem", borderRadius: "999px", background: "rgba(26,108,245,0.07)", border: "1px solid rgba(26,108,245,0.2)", color: "#4d8ff7", cursor: "pointer", transition: "all 0.2s" }}>
                  {s}
                </motion.button>
              ))}
            </div>

            {/* Input */}
            <div style={{ padding: "0.7rem 1rem", borderTop: "1px solid rgba(30,58,95,0.7)", display: "flex", gap: "0.5rem", alignItems: "center", background: "rgba(7,20,36,0.8)" }}>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send(input)}
                placeholder="Ask me anything..."
                style={{ flex: 1, background: "rgba(13,27,46,0.8)", border: "1px solid rgba(30,58,95,0.8)", borderRadius: "12px", padding: "0.5rem 0.75rem", color: "#e8f0fe", fontSize: "0.78rem", outline: "none", transition: "border-color 0.2s" }}
                onFocus={(e) => e.target.style.borderColor = "rgba(26,108,245,0.5)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(30,58,95,0.8)"}
              />
              {/* Mic button */}
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={toggleVoice}
                title={isListening ? "Stop listening" : "Voice input"}
                style={{
                  width: "36px", height: "36px", borderRadius: "11px", flexShrink: 0,
                  background: isListening ? "rgba(239,68,68,0.2)" : "rgba(30,58,95,0.4)",
                  border: isListening ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(30,58,95,0.6)",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s",
                }}
              >
                {isListening
                  ? <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.8, repeat: Infinity }}><MicOff size={14} color="#ef4444" /></motion.span>
                  : <Mic size={14} color="#4a6b8a" />
                }
              </motion.button>
              {/* Send button */}
              <motion.button whileTap={{ scale: 0.92 }} onClick={() => send(input)}
                style={{ width: "36px", height: "36px", borderRadius: "11px", flexShrink: 0, background: input.trim() ? "#1a6cf5" : "rgba(30,58,95,0.4)", border: "none", cursor: input.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}>
                <Send size={14} color={input.trim() ? "#fff" : "#4a6b8a"} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
