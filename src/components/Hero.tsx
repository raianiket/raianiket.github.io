"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Mail, Linkedin, Download } from "lucide-react";

const roles = [
  "Backend Systems Engineer",
  "AI Agent Developer",
  "Node.js & TypeScript Expert",
  "PostgreSQL Specialist",
  "Cloud & AWS Engineer",
];

const stats = [
  { value: 5, suffix: "+", label: "Years Experience" },
  { value: 12, suffix: "+", label: "Cloud Integrations" },
  { value: 4, suffix: "x", label: "Faster Batch Jobs" },
  { value: 4, suffix: "", label: "AI Agents Built" },
];

const floatingTags = [
  { text: "TypeScript", x: "7%", y: "20%", delay: 0 },
  { text: "Node.js", x: "80%", y: "16%", delay: 0.3 },
  { text: "PostgreSQL", x: "5%", y: "60%", delay: 0.6 },
  { text: "AWS", x: "84%", y: "55%", delay: 0.2 },
  { text: "GraphQL", x: "10%", y: "80%", delay: 0.8 },
  { text: "AI Agents", x: "76%", y: "76%", delay: 0.5 },
  { text: "Docker", x: "86%", y: "36%", delay: 0.4 },
  { text: "Microservices", x: "2%", y: "40%", delay: 0.7 },
];

function useCountUp(target: number, duration = 1800, started: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, started]);
  return count;
}

function StatCard({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const count = useCountUp(value, 1500, started);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      borderRadius: "12px", padding: "0.85rem 0.5rem", textAlign: "center",
      background: "rgba(13,27,46,0.7)", border: "1px solid rgba(26,108,245,0.2)",
      backdropFilter: "blur(8px)",
    }}>
      <div style={{
        fontSize: "1.75rem", fontWeight: 900, lineHeight: 1,
        background: "linear-gradient(135deg, #1a6cf5 0%, #4d8ff7 60%, #7eb3ff 100%)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
      }}>
        {count}{suffix}
      </div>
      <div style={{ color: "#7a9cc5", fontSize: "0.7rem", marginTop: "0.3rem" }}>{label}</div>
    </div>
  );
}

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const current = roles[roleIndex];
    let timeout: ReturnType<typeof setTimeout>;
    if (typing) {
      if (displayed.length < current.length) {
        timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 60);
      } else {
        timeout = setTimeout(() => setTyping(false), 2000);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
      } else {
        setRoleIndex((i) => (i + 1) % roles.length);
        setTyping(true);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, typing, roleIndex]);

  return (
    <section id="hero" style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "#050d1a" }}>
      {/* Glow orbs */}
      <div style={{ position: "absolute", top: "25%", left: "33%", width: "500px", height: "500px", borderRadius: "50%", opacity: 0.18, filter: "blur(120px)", background: "radial-gradient(circle, #1a6cf5 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "25%", right: "33%", width: "400px", height: "400px", borderRadius: "50%", opacity: 0.12, filter: "blur(100px)", background: "radial-gradient(circle, #4d8ff7 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Grid */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: "linear-gradient(#4d8ff7 1px, transparent 1px), linear-gradient(90deg, #4d8ff7 1px, transparent 1px)", backgroundSize: "50px 50px" }} />

      {/* Floating tags — hidden on mobile */}
      {floatingTags.map((tag) => (
        <motion.div
          key={tag.text}
          className="floating-tag"
          style={{
            position: "absolute", left: tag.x, top: tag.y,
            display: "flex", alignItems: "center", gap: "8px",
            padding: "8px 18px", borderRadius: "999px", fontSize: "0.88rem", fontWeight: 600,
            background: "rgba(13,27,46,0.92)", border: "1px solid rgba(26,108,245,0.35)", color: "#7eb3ff",
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 20px rgba(26,108,245,0.12)",
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0.6, 1, 0.6], y: [0, -10, 0], scale: 1 }}
          transition={{
            opacity: { duration: 3.5, repeat: Infinity, delay: tag.delay },
            y: { duration: 4.5, repeat: Infinity, delay: tag.delay, ease: "easeInOut" },
            scale: { duration: 0.5, delay: tag.delay + 0.3 },
          }}
        >
          <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#1a6cf5", flexShrink: 0, boxShadow: "0 0 6px #1a6cf5" }} />
          {tag.text}
        </motion.div>
      ))}

      <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 1.5rem", maxWidth: "800px", margin: "0 auto" }}>


        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          style={{ color: "#4d8ff7", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "1rem" }}
        >
          Hello, I&apos;m
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ fontSize: "clamp(3rem, 8vw, 5.5rem)", fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1, marginBottom: "1.2rem" }}
        >
          <span style={{ color: "#e8f0fe" }}>Aniket </span>
          <span style={{ background: "linear-gradient(135deg, #1a6cf5 0%, #4d8ff7 50%, #7eb3ff 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Rai</span>
        </motion.h1>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
          style={{ height: "2.5rem", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.2rem" }}>
          <span style={{ fontSize: "1.15rem", fontWeight: 300, color: "#7a9cc5" }}>
            {displayed}
            <span style={{ display: "inline-block", width: "2px", height: "1.1rem", background: "#1a6cf5", marginLeft: "2px", verticalAlign: "middle", animation: "pulse 1s infinite" }} />
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          style={{ color: "#7a9cc5", fontSize: "0.9rem", maxWidth: "480px", margin: "0 auto 1.75rem", lineHeight: 1.7 }}
        >
          Building scalable backend systems, data pipelines & AI agents
          for B2B SaaS. Based in <span style={{ color: "#e8f0fe" }}>Hyderabad, India</span>.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", flexWrap: "wrap", marginBottom: "2rem" }}
        >
          <button
            onClick={() => document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" })}
            style={{ padding: "0.7rem 1.6rem", borderRadius: "10px", background: "#1a6cf5", color: "#fff", fontWeight: 600, fontSize: "0.85rem", border: "none", cursor: "pointer", boxShadow: "0 4px 20px rgba(26,108,245,0.35)", transition: "all 0.2s" }}
          >
            View My Work
          </button>
          <a href="/Aniket_Resume.pdf" download
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "0.7rem 1.6rem", borderRadius: "10px", border: "1px solid rgba(30,58,95,0.9)", color: "#7a9cc5", fontWeight: 600, fontSize: "0.85rem", textDecoration: "none", transition: "all 0.2s" }}>
            <Download size={14} /> Resume
          </a>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <a href="https://www.linkedin.com/in/aniket-kumar-rai" target="_blank" rel="noopener noreferrer"
              style={{ padding: "0.7rem", borderRadius: "10px", border: "1px solid rgba(30,58,95,0.9)", color: "#7a9cc5", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", transition: "all 0.2s" }}>
              <Linkedin size={16} />
            </a>
            <a href="mailto:rai078945@gmail.com"
              style={{ padding: "0.7rem", borderRadius: "10px", border: "1px solid rgba(30,58,95,0.9)", color: "#7a9cc5", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", transition: "all 0.2s" }}>
              <Mail size={16} />
            </a>
          </div>
        </motion.div>

        {/* Animated stat counters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="stats-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem", maxWidth: "520px", margin: "0 auto" }}
        >
          {stats.map((s) => (
            <StatCard key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
          ))}
        </motion.div>
      </div>

      {/* Scroll arrow */}
      <motion.button
        onClick={() => document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" })}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
        style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", background: "none", border: "none", color: "#4a6b8a", cursor: "pointer", animation: "bounce 2s infinite" }}
      >
        <ArrowDown size={20} />
      </motion.button>

      <style>{`
        @keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }
        @keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(-6px)} }
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0} }
        @media (max-width: 768px) {
          .floating-tag { display: none !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; max-width: 320px !important; }
        }
      `}</style>
    </section>
  );
}
