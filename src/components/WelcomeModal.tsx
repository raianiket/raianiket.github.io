"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scroll, MessageCircle } from "lucide-react";

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

  const choose = (mode: "explore" | "tldr") => {
    sessionStorage.setItem("portfolio_welcome_seen", "1");
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
              background: "rgba(5,13,26,0.85)",
              backdropFilter: "blur(8px)",
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
              width: "90%", maxWidth: "420px",
              background: "rgba(7,20,36,0.98)",
              border: "1px solid rgba(30,58,95,0.9)",
              borderRadius: "24px",
              padding: "2rem 1.75rem",
              boxShadow: "0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(26,108,245,0.15)",
            }}
          >
            {/* Top accent */}
            <div style={{ height: "3px", borderRadius: "999px", background: "linear-gradient(90deg, #1a6cf5, #4d8ff7, #7eb3ff)", marginBottom: "1.75rem" }} />

            {/* Greeting */}
            <p style={{ color: "#4d8ff7", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.6rem" }}>
              Welcome
            </p>
            <h2 style={{ color: "#e8f0fe", fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.5rem", lineHeight: 1.3 }}>
              How do you want to explore?
            </h2>
            <p style={{ color: "#7a9cc5", fontSize: "0.82rem", lineHeight: 1.65, marginBottom: "1.75rem" }}>
              You can scroll through the full portfolio, or just ask the assistant bot anything about Aniket.
            </p>

            {/* Options */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {/* Explore option */}
              <motion.button
                whileHover={{ borderColor: "rgba(26,108,245,0.5)", background: "rgba(26,108,245,0.06)" }}
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
                <div>
                  <p style={{ color: "#e8f0fe", fontWeight: 700, fontSize: "0.9rem", marginBottom: "2px" }}>Explore</p>
                  <p style={{ color: "#7a9cc5", fontSize: "0.72rem" }}>Scroll through the full portfolio</p>
                </div>
              </motion.button>

              {/* TL;DR option */}
              <motion.button
                whileHover={{ borderColor: "rgba(77,143,247,0.6)", background: "rgba(26,108,245,0.1)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => choose("tldr")}
                style={{
                  display: "flex", alignItems: "center", gap: "1rem",
                  padding: "1rem 1.25rem", borderRadius: "16px",
                  background: "linear-gradient(135deg, rgba(26,108,245,0.12), rgba(77,143,247,0.06))",
                  border: "1px solid rgba(26,108,245,0.35)",
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
                    background: "linear-gradient(90deg, transparent, rgba(77,143,247,0.08), transparent)",
                    pointerEvents: "none",
                  }}
                />
                <div style={{
                  width: "42px", height: "42px", borderRadius: "12px", flexShrink: 0,
                  background: "rgba(26,108,245,0.2)", border: "1px solid rgba(26,108,245,0.35)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <MessageCircle size={18} color="#4d8ff7" />
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                    <p style={{ color: "#e8f0fe", fontWeight: 700, fontSize: "0.9rem" }}>TL;DR</p>
                    <span style={{ fontSize: "0.58rem", fontWeight: 700, padding: "0.1rem 0.45rem", borderRadius: "999px", background: "rgba(26,108,245,0.2)", border: "1px solid rgba(26,108,245,0.35)", color: "#4d8ff7", letterSpacing: "0.05em" }}>RECOMMENDED</span>
                  </div>
                  <p style={{ color: "#7a9cc5", fontSize: "0.72rem" }}>Ask the assistant bot anything instead</p>
                </div>
              </motion.button>
            </div>

            {/* Footer note */}
            <p style={{ color: "#2d4a6a", fontSize: "0.65rem", textAlign: "center", marginTop: "1.25rem" }}>
              You can always switch by clicking the chat button
            </p>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
