"use client";

import { motion } from "framer-motion";
import { Code2, Database, Cloud, Bot, Layers, Users } from "lucide-react";
import { FadeIn, FadeInStagger, FadeInItem } from "./FadeIn";

const highlights = [
  {
    icon: Code2,
    title: "Backend Systems",
    desc: "Node.js & TypeScript expert building high-performance APIs, microservices, and batch pipelines.",
  },
  {
    icon: Database,
    title: "Database Architecture",
    desc: "Deep PostgreSQL expertise: CTEs, materialized views, query optimization, and config-driven schemas.",
  },
  {
    icon: Cloud,
    title: "Cloud & AWS",
    desc: "End-to-end AWS experience: S3, Lambda, Fargate, Batch, SQS, CodePipeline, Athena, and more.",
  },
  {
    icon: Bot,
    title: "AI Agent Development",
    desc: "Built AI agents for automated DB monitoring, NL-to-query interfaces, and operational workflows.",
  },
  {
    icon: Layers,
    title: "Full-Stack Development",
    desc: "React on the frontend, Node.js/TypeScript on the backend, comfortable owning a feature end-to-end, UI to database.",
  },
  {
    icon: Users,
    title: "Technical Leadership",
    desc: "Leads an 8-10 engineer team through HLD/LLD design reviews, PR mentoring, and technical hiring interviews.",
  },
];

const tickVariants = {
  rest: { scaleY: 1, background: "linear-gradient(180deg, #1a6cf5, #1a6cf5)" },
  hover: { scaleY: 1.25, background: "linear-gradient(180deg, #1a6cf5, #7eb3ff)" },
};

const ghostVariants = {
  rest: { color: "rgba(77,143,247,0.09)" },
  hover: { color: "rgba(77,143,247,0.17)" },
};

export default function About() {
  return (
    <section id="about" style={{ padding: "6rem 1.5rem" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        <FadeIn style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p style={{ color: "#4d8ff7", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            About Me
          </p>
          <h2 style={{ fontSize: "2.25rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "1.25rem" }}>
            Building things that{" "}
            <span style={{
              background: "linear-gradient(135deg, #1a6cf5 0%, #4d8ff7 50%, #7eb3ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              scale
            </span>
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.85, maxWidth: "620px", margin: "0 auto", textAlign: "center" }}>
            5+ years of backend engineering at{" "}
            <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>SysCloud Technologies</strong>,{" "}
            now leading an 8-10 engineer team through system design and architecture decisions.{" "}
            Config-driven frameworks handling 12+ cloud integrations with zero code changes.{" "}
            AI agents that detect and resolve production issues before customers notice.{" "}
            A natural language interface where customers talk to their data instead of navigating dashboards.{" "}
            <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>Real systems. Real scale. Real impact.</strong>
          </p>
        </FadeIn>

        <FadeInStagger style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", columnGap: "3rem" }}>
          {highlights.map((item, i) => (
            <FadeInItem key={item.title}>
              <motion.div
                initial="rest"
                whileHover="hover"
                animate="rest"
                style={{
                  position: "relative",
                  display: "flex", gap: "1.1rem",
                  padding: "1.5rem 1.1rem",
                  borderRadius: "10px",
                  cursor: "default",
                  overflow: "hidden",
                }}
              >
                <motion.div
                  variants={{ rest: { backgroundColor: "rgba(26,108,245,0)" }, hover: { backgroundColor: "rgba(26,108,245,0.06)" } }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  style={{ position: "absolute", inset: 0, borderRadius: "10px" }}
                />
                <motion.span aria-hidden variants={ghostVariants} transition={{ duration: 0.25, ease: "easeOut" }} style={{
                  position: "absolute", top: "0.2rem", right: "0.7rem",
                  fontSize: "3rem", fontWeight: 800,
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
                  lineHeight: 1, userSelect: "none", pointerEvents: "none",
                }}>
                  {String(i + 1).padStart(2, "0")}
                </motion.span>
                <motion.span
                  variants={tickVariants}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  style={{ flexShrink: 0, width: "3px", height: "1.3rem", borderRadius: "2px", marginTop: "0.35rem", transformOrigin: "top" }}
                />
                <div style={{ position: "relative" }}>
                  <h3 style={{ display: "flex", alignItems: "center", gap: "0.55rem", fontWeight: 700, color: "var(--text-primary)", fontSize: "0.95rem", marginBottom: "0.5rem" }}>
                    <item.icon size={17} color="#4d8ff7" strokeWidth={2} />
                    {item.title}
                  </h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem", lineHeight: 1.65 }}>
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </div>
    </section>
  );
}
