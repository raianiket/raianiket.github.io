"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, RotateCcw } from "lucide-react";
import { RESPONSES, DEFAULT_RESPONSE, INITIAL_SUGGESTIONS } from "@/data/chatResponses";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface Message {
  from: "user" | "bot";
  text: string;
  time: string;
}

function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function logUnanswered(question: string) {
  try {
    const existing = JSON.parse(localStorage.getItem("chatbot_unanswered") || "[]");
    if (!existing.find((e: { q: string }) => e.q === question)) {
      existing.push({ q: question, time: new Date().toISOString() });
      localStorage.setItem("chatbot_unanswered", JSON.stringify(existing));
    }
  } catch { /* ignore */ }
}

function getResponse(input: string) {
  const q = input.toLowerCase().trim();
  for (const { pattern, response } of RESPONSES) {
    if (pattern.test(q)) return response;
  }
  logUnanswered(input.trim());
  return DEFAULT_RESPONSE;
}

const INITIAL_MSG: Message = {
  from: "bot",
  text: "Hey! I'm Aniket's portfolio assistant. Ask me anything about his skills, projects, experience, or how to get in touch.",
  time: now(),
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
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingText, typing]);

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
    }, 12);
  };

  const send = (text: string) => {
    if (!text.trim() || typing || isTypingEffect) return;
    setMessages((m) => [...m, { from: "user", text: text.trim(), time: now() }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const { text: reply, suggestions: nextSuggestions } = getResponse(text);
      setTyping(false);
      typeMessage(reply, () => {
        setMessages((m) => [...m, { from: "bot", text: reply, time: now() }]);
        setTypingText("");
        setSuggestions(nextSuggestions);
        if (!open) setUnread((u) => u + 1);
      });
    }, 700);
  };

  const reset = () => {
    setMessages([INITIAL_MSG]);
    setSuggestions(INITIAL_SUGGESTIONS);
    setTypingText("");
    setTyping(false);
    setIsTypingEffect(false);
  };

  return (
    <>
      {/* Floating button with label */}
      <div style={{ position: "fixed", bottom: "1.75rem", right: "1.75rem", zIndex: 999, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
        {/* Label tooltip — always visible */}
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

        <motion.button
          onClick={() => { setOpen((o) => !o); setFullscreen(false); }}
          animate={open ? { y: 0 } : { y: [0, -10, 0] }}
          transition={open ? {} : { duration: 1.2, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.6 }}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.95 }}
          style={{
            width: "58px", height: "58px", borderRadius: "50%",
            background: "linear-gradient(135deg, #1a6cf5, #7eb3ff)",
            border: "2px solid rgba(126,179,255,0.4)",
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 28px rgba(26,108,245,0.6), 0 0 0 4px rgba(26,108,245,0.15)",
            position: "relative",
          }}
        >
        {/* Pulse ring */}
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
                <img src="/bot.png" alt="bot" style={{ width: "34px", height: "34px", objectFit: "contain" }} />
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

      {/* Chat window */}
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
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: fullscreen ? 32 : 24, scale: fullscreen ? 0.95 : 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: fullscreen ? 20 : 24, scale: fullscreen ? 0.96 : 0.94 }}
            transition={{ duration: fullscreen ? 0.45 : 0.3, ease: EASE }}
            style={fullscreen ? {
              position: "fixed", inset: 0, margin: "auto",
              zIndex: 998,
              width: "min(640px, 92vw)", height: "min(680px, 88vh)",
              background: "rgba(5,13,26,0.98)",
              border: "1px solid rgba(30,58,95,0.9)",
              borderRadius: "24px",
              display: "flex", flexDirection: "column",
              boxShadow: "0 32px 100px rgba(0,0,0,0.75), 0 0 0 1px rgba(26,108,245,0.15)",
              backdropFilter: "blur(20px)",
              overflow: "hidden",
            } : {
              position: "fixed", bottom: "5.75rem", right: "1.75rem", zIndex: 998,
              width: "360px", maxHeight: "540px",
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
            }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "11px", flexShrink: 0,
                background: "linear-gradient(135deg, rgba(26,108,245,0.35), rgba(77,143,247,0.15))",
                border: "1px solid rgba(26,108,245,0.35)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/bot.png" alt="bot" style={{ width: "24px", height: "24px", objectFit: "contain" }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: "#e8f0fe", fontWeight: 700, fontSize: "0.85rem", marginBottom: "2px" }}>Aniket Assistant Bot</p>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <motion.span
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80", display: "inline-block" }}
                  />
                  <span style={{ color: "#4ade80", fontSize: "0.65rem" }}>Online · Always here</span>
                </div>
              </div>
              <button onClick={reset} title="Reset conversation"
                style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: "#4a6b8a", display: "flex" }}>
                <RotateCcw size={14} />
              </button>
              {fullscreen && (
                <button onClick={() => { setOpen(false); setFullscreen(false); }} title="Close"
                  style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: "#4a6b8a", display: "flex", marginLeft: "4px" }}>
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              {messages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
                  style={{ display: "flex", flexDirection: "column", alignItems: msg.from === "user" ? "flex-end" : "flex-start", gap: "3px" }}>
                  <div style={{
                    maxWidth: "88%", padding: fullscreen ? "0.75rem 1.1rem" : "0.6rem 0.9rem",
                    borderRadius: msg.from === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    background: msg.from === "user" ? "linear-gradient(135deg, #1a6cf5, #4d8ff7)" : "rgba(13,27,46,0.95)",
                    border: msg.from === "user" ? "none" : "1px solid rgba(30,58,95,0.8)",
                    color: msg.from === "user" ? "#fff" : "#c8daf4",
                    fontSize: fullscreen ? "0.88rem" : "0.77rem", lineHeight: 1.65, whiteSpace: "pre-line",
                  }}>{msg.text}</div>
                  <span style={{ fontSize: "0.6rem", color: "#2d4a6a", paddingInline: "4px" }}>{msg.time}</span>
                </motion.div>
              ))}

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

              {isTypingEffect && typingText && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "3px" }}>
                  <div style={{ maxWidth: "88%", padding: "0.6rem 0.9rem", borderRadius: "16px 16px 16px 4px", background: "rgba(13,27,46,0.95)", border: "1px solid rgba(30,58,95,0.8)", color: "#c8daf4", fontSize: "0.77rem", lineHeight: 1.65, whiteSpace: "pre-line" }}>
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
