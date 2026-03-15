"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Mail, Linkedin } from "lucide-react";

const roles = [
  "Senior Software Engineer",
  "Backend Architect",
  "AI Agent Builder",
  "Node.js Expert",
  "PostgreSQL Specialist",
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

  const scrollToAbout = () => {
    document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 20% 50%, rgba(26,108,245,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(77,143,247,0.05) 0%, transparent 50%), #050d1a",
      }}
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#1a6cf5 1px, transparent 1px), linear-gradient(90deg, #1a6cf5 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-5 blur-3xl bg-[#1a6cf5] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full opacity-5 blur-3xl bg-[#4d8ff7] pointer-events-none" />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-[#4d8ff7] text-sm font-semibold tracking-[0.25em] uppercase mb-6"
        >
          Hello, I&apos;m
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-black tracking-tight mb-6 text-[#e8f0fe]"
        >
          Aniket <span className="accent-text">Rai</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="h-12 flex items-center justify-center mb-8"
        >
          <span className="text-xl md:text-2xl font-light text-[#7a9cc5]">
            {displayed}
            <span className="inline-block w-0.5 h-6 bg-[#1a6cf5] ml-1 animate-pulse align-middle" />
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-[#7a9cc5] text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-10"
        >
          5+ years building scalable backend systems, data pipelines, and AI agents
          for a B2B SaaS platform. Based in{" "}
          <span className="text-[#e8f0fe]">Hyderabad, India</span>.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-4 flex-wrap"
        >
          <button
            onClick={scrollToAbout}
            className="px-7 py-3 rounded-xl bg-[#1a6cf5] hover:bg-[#1a6cf5]/80 text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-[#1a6cf5]/20 hover:shadow-[#1a6cf5]/40"
          >
            View My Work
          </button>
          <a
            href="/Aniket_Resume.pdf"
            download
            className="px-7 py-3 rounded-xl border border-[#1e3a5f] hover:border-[#1a6cf5]/50 text-[#7a9cc5] hover:text-[#e8f0fe] font-medium text-sm transition-all duration-200"
          >
            Download Resume
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex items-center justify-center gap-5 mt-10"
        >
          <a
            href="https://www.linkedin.com/in/aniket-kumar-rai"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-lg border border-[#1e3a5f] text-[#7a9cc5] hover:text-[#4d8ff7] hover:border-[#1a6cf5]/40 transition-all duration-200"
          >
            <Linkedin size={18} />
          </a>
          <a
            href="mailto:rai078945@gmail.com"
            className="p-2.5 rounded-lg border border-[#1e3a5f] text-[#7a9cc5] hover:text-[#4d8ff7] hover:border-[#1a6cf5]/40 transition-all duration-200"
          >
            <Mail size={18} />
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToAbout}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#4a6b8a] hover:text-[#4d8ff7] transition-colors animate-bounce cursor-pointer"
      >
        <ArrowDown size={20} />
      </motion.button>
    </section>
  );
}
