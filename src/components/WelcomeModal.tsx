"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scroll } from "lucide-react";
import { track } from "@/lib/track";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function WelcomeModal() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isDev = window.location.hostname === "localhost";
    const seen = sessionStorage.getItem("portfolio_welcome_seen");
    if (isDev || !seen) {
      setTimeout(() => setVisible(true), 800);
    }
  }, []);

  useEffect(() => {
    if (!visible) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "e" || e.key === "E") choose("explore");
      if (e.key === "s" || e.key === "S") choose("tldr");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [visible]);

  const choose = (mode: "explore" | "tldr") => {
    sessionStorage.setItem("portfolio_welcome_seen", "1");
    track(mode === "explore" ? "welcome_explore" : "welcome_bot");
    setVisible(false);
    if (mode === "tldr") {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("openChatBot", { detail: { full: true } }));
      }, 400);
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              position: "fixed", inset: 0, zIndex: 1000,
              background: "rgba(5,13,26,0.88)",
              backdropFilter: "blur(10px)",
            }}
          />

          {/* Modal centering wrapper */}
          <div style={{
            position: "fixed", inset: 0, zIndex: 1001,
            display: "flex", alignItems: "center", justifyContent: "center",
            pointerEvents: "none",
          }}>
            <motion.div
              initial={{ opacity: 0, y: 32, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.5, ease: EASE }}
              style={{
                pointerEvents: "all",
                width: "90%", maxWidth: "440px",
                background: "rgba(7,20,36,0.98)",
                border: "1px solid rgba(30,58,95,0.9)",
                borderRadius: "28px",
                padding: "2rem 1.75rem 1.5rem",
                boxShadow: "0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(26,108,245,0.15), 0 0 80px rgba(26,108,245,0.08)",
                position: "relative", overflow: "hidden",
              }}
            >
              {/* Radial glow background */}
              <div style={{
                position: "absolute", top: "-60px", left: "50%", transform: "translateX(-50%)",
                width: "300px", height: "300px", borderRadius: "50%",
                background: "radial-gradient(circle, rgba(26,108,245,0.12) 0%, transparent 70%)",
                pointerEvents: "none",
              }} />

              {/* Animated top accent line */}
              <div style={{ position: "relative", height: "3px", borderRadius: "999px", marginBottom: "1.75rem", overflow: "hidden", background: "rgba(26,108,245,0.15)" }}>
                <motion.div
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 0.5 }}
                  style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(90deg, transparent, #1a6cf5, #7eb3ff, transparent)",
                  }}
                />
              </div>

              {/* Bot avatar */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5, ease: EASE }}
                style={{
                  width: "72px", height: "72px", borderRadius: "50%",
                  background: "linear-gradient(135deg, #0d1b2e, #1a3a6e)",
                  border: "3px solid rgba(26,108,245,0.4)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 1rem",
                  boxShadow: "0 0 0 6px rgba(26,108,245,0.08), 0 8px 32px rgba(26,108,245,0.3)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/aniketbot.jpg" alt="bot" style={{ width: "58px", height: "58px", objectFit: "contain", mixBlendMode: "screen" }} />
              </motion.div>

              {/* Greeting */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <p style={{ color: "#4d8ff7", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.4rem", textAlign: "center" }}>
                  Hi, I&apos;m Aniket&apos;s Assistant
                </p>
                <h2 style={{ color: "#e8f0fe", fontSize: "1.45rem", fontWeight: 800, marginBottom: "0.5rem", lineHeight: 1.3, textAlign: "center" }}>
                  How do you want to explore?
                </h2>
                <p style={{ color: "#7a9cc5", fontSize: "0.81rem", lineHeight: 1.65, marginBottom: "1.75rem", textAlign: "center" }}>
                  Scroll the full portfolio, or just ask me anything about Aniket.
                </p>
              </motion.div>

              {/* Options */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>

                {/* Explore option */}
                <motion.button
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  whileHover={{ borderColor: "rgba(26,108,245,0.5)", background: "rgba(26,108,245,0.07)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => choose("explore")}
                  style={{
                    display: "flex", alignItems: "center", gap: "1rem",
                    padding: "1rem 1.25rem", borderRadius: "16px",
                    background: "rgba(13,27,46,0.8)", border: "1px solid rgba(30,58,95,0.8)",
                    cursor: "pointer", textAlign: "left", transition: "all 0.25s",
                  }}
                >
                  <div style={{
                    width: "42px", height: "42px", borderRadius: "12px", flexShrink: 0,
                    background: "rgba(26,108,245,0.1)", border: "1px solid rgba(26,108,245,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Scroll size={18} color="#4d8ff7" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: "#e8f0fe", fontWeight: 700, fontSize: "0.9rem", marginBottom: "2px" }}>Explore</p>
                    <p style={{ color: "#7a9cc5", fontSize: "0.72rem" }}>Scroll through the full portfolio</p>
                  </div>
                  <span style={{ color: "#2d4a6a", fontSize: "0.65rem", fontFamily: "monospace" }}>E</span>
                </motion.button>

                {/* Skip the Scroll option */}
                <motion.button
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  whileHover={{ background: "rgba(26,108,245,0.15)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => choose("tldr")}
                  style={{
                    display: "flex", alignItems: "center", gap: "1rem",
                    padding: "1rem 1.25rem", borderRadius: "16px",
                    background: "linear-gradient(135deg, rgba(26,108,245,0.12), rgba(77,143,247,0.06))",
                    border: "1px solid rgba(26,108,245,0.4)",
                    cursor: "pointer", textAlign: "left", transition: "all 0.25s",
                    position: "relative", overflow: "hidden",
                  }}
                >
                  {/* Shimmer */}
                  <motion.div
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                    style={{
                      position: "absolute", top: 0, left: 0, width: "40%", height: "100%",
                      background: "linear-gradient(90deg, transparent, rgba(77,143,247,0.1), transparent)",
                      pointerEvents: "none",
                    }}
                  />
                  {/* Pulsing border glow */}
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                      position: "absolute", inset: 0, borderRadius: "16px",
                      boxShadow: "0 0 16px rgba(26,108,245,0.3), inset 0 0 16px rgba(26,108,245,0.05)",
                      pointerEvents: "none",
                    }}
                  />
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
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                      <p style={{ color: "#e8f0fe", fontWeight: 700, fontSize: "0.9rem" }}>Skip the Scroll</p>
                      <motion.span
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        style={{ fontSize: "0.58rem", fontWeight: 700, padding: "0.1rem 0.45rem", borderRadius: "999px", background: "rgba(26,108,245,0.25)", border: "1px solid rgba(26,108,245,0.5)", color: "#7eb3ff", letterSpacing: "0.05em" }}
                      >
                        RECOMMENDED
                      </motion.span>
                    </div>
                    <p style={{ color: "#7a9cc5", fontSize: "0.72rem" }}>Ask the bot anything, get answers fast</p>
                  </div>
                  <span style={{ color: "#2d4a6a", fontSize: "0.65rem", fontFamily: "monospace" }}>S</span>
                </motion.button>
              </div>

              {/* Footer note */}
              <p style={{ color: "#4a6b8a", fontSize: "0.65rem", textAlign: "center", marginTop: "1.25rem" }}>
                You can always switch by clicking the chat button
              </p>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
