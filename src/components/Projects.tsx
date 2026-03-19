"use client";

import { motion } from "framer-motion";
import { ExternalLink, Zap, Brain, Server, Shield, RefreshCw } from "lucide-react";

const projects = [
  {
    icon: Brain,
    title: "Sky 2.0 — SysCloud AI",
    description: "AI-powered natural language interface where customers ask questions, the AI dynamically builds queries, redirects to the relevant page with pre-applied filters, and initiates Restore & Export actions — eliminating manual browsing.",
    tags: ["Node.js", "TypeScript", "LLM", "Claude", "MCP", "PostgreSQL"],
    metrics: ["NL-to-query", "Zero manual navigation", "Full product coverage"],
    color: "#a78bfa",
    borderColor: "rgba(167,139,250,0.25)",
    bgColor: "rgba(167,139,250,0.08)",
  },
  {
    icon: Zap,
    title: "MDL 2.0 Framework",
    description: "Config-driven framework replacing complex function/mutation logic with simple JSON configuration. Each action executes as a micro-task inside PostGraphile. Migrated 12+ cloud integrations — adding a new cloud now requires zero code changes.",
    tags: ["TypeScript", "PostGraphile", "PostgreSQL", "JSON Config", "Node.js"],
    metrics: ["12+ cloud integrations", "Zero code per new cloud", "Owns restore, sync, backup"],
    color: "#4d8ff7",
    borderColor: "rgba(77,143,247,0.25)",
    bgColor: "rgba(77,143,247,0.08)",
  },
  {
    icon: Server,
    title: "MDLOPS Microservice",
    description: "TypeScript microservice built from scratch using cm-runner-plus + JSON-driven config to handle 5 heavy async add-on modules (eDiscovery, Hold, BDI, Archiver, Data Change Insights) with parallel execution via PM2 and anomaly detection using the Prophet algorithm.",
    tags: ["TypeScript", "Node.js", "PM2", "Prophet Algorithm", "AWS"],
    metrics: ["5 add-on modules", "Parallel execution", "Anomaly detection"],
    color: "#4ade80",
    borderColor: "rgba(74,222,128,0.25)",
    bgColor: "rgba(74,222,128,0.08)",
  },
  {
    icon: RefreshCw,
    title: "Restore & Export Platform",
    description: "Architected a unified config-driven Restore/Export engine (Gen3) eliminating code changes per new cloud onboarding. Built the S3 Data Migration action layer — old metadata (2+ years) fetched on-demand via AWS Athena and hydrated into DB, cutting Archives query time from 10s+ to under 2s. Also delivered CM Download Status with ETA calculation and a DAL AI-Agent for automated Restore/Export health monitoring.",
    tags: ["Node.js", "TypeScript", "AWS Athena", "S3", "PostgreSQL", "Config-Driven"],
    metrics: ["10s+ → <2s query time", "Zero code per new cloud", "ETA calculation"],
    color: "#38bdf8",
    borderColor: "rgba(56,189,248,0.25)",
    bgColor: "rgba(56,189,248,0.08)",
  },
  {
    icon: Shield,
    title: "DAL AI-Agents",
    description: "4 AI agents for automated operational monitoring: Database Health, Restore/Export, StartBackup, and PostGraphile Slow-Queries. Each agent detects and resolves issues automatically before they impact customers.",
    tags: ["AI Agent", "LLM", "Node.js", "TypeScript", "PostgreSQL"],
    metrics: ["4 agents", "Auto-remediation", "Zero customer impact"],
    color: "#fb923c",
    borderColor: "rgba(251,146,60,0.25)",
    bgColor: "rgba(251,146,60,0.08)",
  },
];

export default function Projects() {
  return (
    <section id="projects" style={{ padding: "6rem 1.5rem", background: "radial-gradient(ellipse at 50% 50%, rgba(26,108,245,0.04) 0%, transparent 70%), #050d1a" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "3.5rem" }}
        >
          <p style={{ color: "#4d8ff7", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            Projects
          </p>
          <h2 style={{ fontSize: "2.25rem", fontWeight: 800, color: "#e8f0fe", marginBottom: "0.75rem" }}>
            Things I&apos;ve built
          </h2>
          <p style={{ color: "#7a9cc5", fontSize: "0.88rem", maxWidth: "480px", margin: "0 auto" }}>
            Key systems and frameworks I designed and owned at SysCloud.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.25rem" }}>
          {projects.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4, boxShadow: `0 12px 40px ${p.bgColor}` }}
              style={{
                borderRadius: "18px", padding: "1.5rem",
                background: "rgba(13,27,46,0.8)",
                border: `1px solid ${p.borderColor}`,
                transition: "all 0.3s",
                cursor: "default",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", background: p.bgColor, border: `1px solid ${p.borderColor}`, flexShrink: 0 }}>
                  <p.icon size={20} color={p.color} />
                </div>
                <ExternalLink size={14} color="#4a6b8a" />
              </div>

              <h3 style={{ fontWeight: 700, color: "#e8f0fe", fontSize: "1rem", marginBottom: "0.6rem" }}>
                {p.title}
              </h3>
              <p style={{ color: "#7a9cc5", fontSize: "0.78rem", lineHeight: 1.65, marginBottom: "1.1rem" }}>
                {p.description}
              </p>

              {/* Metrics */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1rem" }}>
                {p.metrics.map((m) => (
                  <span key={m} style={{ fontSize: "0.68rem", fontWeight: 600, padding: "0.2rem 0.6rem", borderRadius: "999px", background: p.bgColor, border: `1px solid ${p.borderColor}`, color: p.color }}>
                    ✓ {m}
                  </span>
                ))}
              </div>

              {/* Tech tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {p.tags.map((t) => (
                  <span key={t} style={{ fontSize: "0.68rem", padding: "0.2rem 0.55rem", borderRadius: "999px", background: "rgba(30,58,95,0.5)", border: "1px solid rgba(30,58,95,0.8)", color: "#7a9cc5" }}>
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
