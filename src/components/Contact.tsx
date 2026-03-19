"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Linkedin, MapPin, Copy, Check } from "lucide-react";

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText("rai078945@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="contact"
      style={{
        padding: "6rem 1.5rem",
        background: "radial-gradient(ellipse at 50% 100%, rgba(26,108,245,0.07) 0%, transparent 60%), #050d1a",
      }}
    >
      <div style={{ maxWidth: "720px", margin: "0 auto", textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        >
          <p style={{ color: "#4d8ff7", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            Contact
          </p>
          <h2 style={{ fontSize: "2.25rem", fontWeight: 800, color: "#e8f0fe", marginBottom: "1rem" }}>
            Let&apos;s work together
          </h2>
          <p style={{ color: "#7a9cc5", fontSize: "0.95rem", lineHeight: 1.7, maxWidth: "420px", margin: "0 auto 3rem" }}>
            Open to senior backend, full-stack, and backend-heavy roles. I typically respond within 24 hours.
          </p>
        </motion.div>

        {/* Contact cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2.5rem" }} className="contact-grid">
          {/* Email — clickable copy */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4 }}
            onClick={copyEmail}
            whileHover={{ borderColor: "rgba(26,108,245,0.5)", boxShadow: "0 0 24px rgba(26,108,245,0.12)" }}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem",
              padding: "1.25rem 0.75rem", borderRadius: "16px", cursor: "pointer",
              background: "rgba(13,27,46,0.7)", border: "1px solid rgba(30,58,95,0.8)",
              transition: "all 0.3s",
            } as React.CSSProperties}
          >
            <div style={{ width: "38px", height: "38px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(26,108,245,0.1)", border: "1px solid rgba(26,108,245,0.2)" }}>
              <Mail size={17} color="#4d8ff7" />
            </div>
            <div>
              <p style={{ color: "#7a9cc5", fontSize: "0.68rem", marginBottom: "0.2rem" }}>Email</p>
              <p style={{ color: "#e8f0fe", fontSize: "0.72rem", fontWeight: 500 }}>rai078945@gmail.com</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.65rem", color: copied ? "#4ade80" : "#4a6b8a" }}>
              {copied ? <><Check size={11} /> Copied!</> : <><Copy size={11} /> Click to copy</>}
            </div>
          </motion.button>

          {/* LinkedIn */}
          <motion.a
            href="https://www.linkedin.com/in/aniket-kumar-rai"
            target="_blank" rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: 0.1 }}
            whileHover={{ borderColor: "rgba(26,108,245,0.5)", boxShadow: "0 0 24px rgba(26,108,245,0.12)" }}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem",
              padding: "1.25rem 0.75rem", borderRadius: "16px", textDecoration: "none",
              background: "rgba(13,27,46,0.7)", border: "1px solid rgba(30,58,95,0.8)",
              transition: "all 0.3s",
            } as React.CSSProperties}
          >
            <div style={{ width: "38px", height: "38px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(26,108,245,0.1)", border: "1px solid rgba(26,108,245,0.2)" }}>
              <Linkedin size={17} color="#4d8ff7" />
            </div>
            <div>
              <p style={{ color: "#7a9cc5", fontSize: "0.68rem", marginBottom: "0.2rem" }}>LinkedIn</p>
              <p style={{ color: "#e8f0fe", fontSize: "0.72rem", fontWeight: 500 }}>aniket-kumar-rai</p>
            </div>
            <p style={{ fontSize: "0.65rem", color: "#4a6b8a" }}>Open profile ↗</p>
          </motion.a>

          {/* Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: 0.2 }}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem",
              padding: "1.25rem 0.75rem", borderRadius: "16px",
              background: "rgba(13,27,46,0.7)", border: "1px solid rgba(30,58,95,0.8)",
            }}
          >
            <div style={{ width: "38px", height: "38px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(26,108,245,0.1)", border: "1px solid rgba(26,108,245,0.2)" }}>
              <MapPin size={17} color="#4d8ff7" />
            </div>
            <div>
              <p style={{ color: "#7a9cc5", fontSize: "0.68rem", marginBottom: "0.2rem" }}>Location</p>
              <p style={{ color: "#e8f0fe", fontSize: "0.72rem", fontWeight: 500 }}>Hyderabad, India</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.65rem" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
              <span style={{ color: "#4ade80" }}>IST (UTC+5:30)</span>
            </div>
          </motion.div>
        </div>

        <motion.a
          href="mailto:rai078945@gmail.com"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.4 }}
          style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            padding: "0.85rem 2rem", borderRadius: "12px",
            background: "#1a6cf5", color: "#fff", fontWeight: 600, fontSize: "0.85rem",
            textDecoration: "none", boxShadow: "0 4px 24px rgba(26,108,245,0.3)",
          }}
        >
          <Mail size={16} />
          Send me an email
        </motion.a>

        {/* Toast notification */}
        <AnimatePresence>
          {copied && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              style={{
                position: "fixed", bottom: "5rem", left: "50%", transform: "translateX(-50%)",
                background: "rgba(13,27,46,0.95)", border: "1px solid rgba(34,197,94,0.4)",
                color: "#4ade80", fontSize: "0.82rem", fontWeight: 600,
                padding: "0.65rem 1.25rem", borderRadius: "10px",
                display: "flex", alignItems: "center", gap: "0.5rem",
                backdropFilter: "blur(10px)", boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                zIndex: 100,
              }}
            >
              <Check size={14} /> Email copied to clipboard!
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ marginTop: "4rem", color: "#4a6b8a", fontSize: "0.75rem" }}>
          Built with Next.js & Tailwind · © {new Date().getFullYear()} Aniket Rai
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
