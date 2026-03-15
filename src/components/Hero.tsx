"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Mail, Linkedin, Download } from "lucide-react";

const roles = [
  "Senior Software Engineer",
  "Backend Architect",
  "AI Agent Builder",
  "Node.js Expert",
  "PostgreSQL Specialist",
];

const stats = [
  { value: "5+", label: "Years Experience" },
  { value: "12+", label: "Cloud Integrations" },
  { value: "4x", label: "Faster Batch Jobs" },
  { value: "4", label: "AI Agents Built" },
];

const floatingTags = [
  { text: "TypeScript", x: "8%", y: "22%", delay: 0 },
  { text: "Node.js", x: "82%", y: "18%", delay: 0.3 },
  { text: "PostgreSQL", x: "6%", y: "62%", delay: 0.6 },
  { text: "AWS", x: "85%", y: "58%", delay: 0.2 },
  { text: "GraphQL", x: "12%", y: "82%", delay: 0.8 },
  { text: "AI Agents", x: "78%", y: "78%", delay: 0.5 },
  { text: "Docker", x: "88%", y: "40%", delay: 0.4 },
  { text: "Microservices", x: "3%", y: "42%", delay: 0.7 },
];

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
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: "#050d1a",
      }}
    >
      {/* Strong glow orbs */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full opacity-20 blur-[120px]"
        style={{ background: "radial-gradient(circle, #1a6cf5 0%, transparent 70%)" }} />
      <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] rounded-full opacity-15 blur-[100px]"
        style={{ background: "radial-gradient(circle, #4d8ff7 0%, transparent 70%)" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-5 blur-[150px]"
        style={{ background: "radial-gradient(circle, #1a6cf5 0%, transparent 60%)" }} />

      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "linear-gradient(#4d8ff7 1px, transparent 1px), linear-gradient(90deg, #4d8ff7 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Floating tech tags */}
      {floatingTags.map((tag) => (
        <motion.div
          key={tag.text}
          className="absolute hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
          style={{
            left: tag.x,
            top: tag.y,
            background: "rgba(13,27,46,0.8)",
            border: "1px solid rgba(26,108,245,0.25)",
            color: "#4d8ff7",
            backdropFilter: "blur(8px)",
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0.4, 0.8, 0.4],
            y: [0, -8, 0],
            scale: 1,
          }}
          transition={{
            opacity: { duration: 3, repeat: Infinity, delay: tag.delay },
            y: { duration: 4, repeat: Infinity, delay: tag.delay, ease: "easeInOut" },
            scale: { duration: 0.5, delay: tag.delay + 0.5 },
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#1a6cf5]" />
          {tag.text}
        </motion.div>
      ))}

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-[#4d8ff7] text-xs font-semibold tracking-[0.3em] uppercase mb-5"
        >
          Hello, I&apos;m
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-6xl md:text-8xl font-black tracking-tight mb-5 leading-none"
        >
          <span className="text-[#e8f0fe]">Aniket </span>
          <span className="accent-text">Rai</span>
        </motion.h1>

        {/* Typing animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="h-10 flex items-center justify-center mb-5"
        >
          <span className="text-lg md:text-xl font-light text-[#7a9cc5]">
            {displayed}
            <span className="inline-block w-0.5 h-5 bg-[#1a6cf5] ml-0.5 animate-pulse align-middle" />
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-[#7a9cc5] text-sm md:text-base max-w-xl mx-auto leading-relaxed mb-8"
        >
          Building scalable backend systems, data pipelines & AI agents
          for B2B SaaS. Based in{" "}
          <span className="text-[#e8f0fe]">Hyderabad, India</span>.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-3 flex-wrap mb-8"
        >
          <button
            onClick={() => document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" })}
            className="px-6 py-3 rounded-xl bg-[#1a6cf5] hover:bg-[#2a7cf8] text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-[#1a6cf5]/30 hover:shadow-[#1a6cf5]/50 hover:-translate-y-0.5"
          >
            View My Work
          </button>
          <a
            href="/Aniket_Resume.pdf"
            download
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[#1e3a5f] hover:border-[#1a6cf5]/60 text-[#7a9cc5] hover:text-[#e8f0fe] font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5"
          >
            <Download size={14} />
            Resume
          </a>
          <div className="flex gap-2">
            <a
              href="https://www.linkedin.com/in/aniket-kumar-rai"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl border border-[#1e3a5f] text-[#7a9cc5] hover:text-[#4d8ff7] hover:border-[#1a6cf5]/40 transition-all duration-200 hover:-translate-y-0.5"
            >
              <Linkedin size={16} />
            </a>
            <a
              href="mailto:rai078945@gmail.com"
              className="p-3 rounded-xl border border-[#1e3a5f] text-[#7a9cc5] hover:text-[#4d8ff7] hover:border-[#1a6cf5]/40 transition-all duration-200 hover:-translate-y-0.5"
            >
              <Mail size={16} />
            </a>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + i * 0.08 }}
              className="rounded-xl p-3 text-center"
              style={{
                background: "rgba(13,27,46,0.6)",
                border: "1px solid rgba(26,108,245,0.2)",
                backdropFilter: "blur(8px)",
              }}
            >
              <div className="text-2xl font-black accent-text">{stat.value}</div>
              <div className="text-[#7a9cc5] text-xs mt-0.5">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll arrow */}
      <motion.button
        onClick={() => document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" })}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#4a6b8a] hover:text-[#4d8ff7] transition-colors animate-bounce cursor-pointer"
      >
        <ArrowDown size={20} />
      </motion.button>
    </section>
  );
}
