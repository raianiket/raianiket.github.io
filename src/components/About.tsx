"use client";

import { motion } from "framer-motion";
import { Code2, Database, Cloud, Bot } from "lucide-react";
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
];

export default function About() {
  return (
    <section id="about" style={{ padding: "6rem 1.5rem" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        <FadeIn style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p style={{ color: "#4d8ff7", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            About Me
          </p>
          <h2 style={{ fontSize: "2.25rem", fontWeight: 800, color: "#e8f0fe", marginBottom: "1.25rem" }}>
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
          <p style={{ color: "#7a9cc5", fontSize: "0.95rem", lineHeight: 1.75, maxWidth: "580px", margin: "0 auto", textAlign: "center" }}>
            I&apos;m a Senior Software Engineer at{" "}
            <strong style={{ color: "#e8f0fe", fontWeight: 600 }}>SysCloud Technologies</strong>,
            where I&apos;ve spent 5+ years designing and owning large-scale backend
            systems for a B2B SaaS cloud-backup platform. From config-driven framework
            migrations that eliminate code changes entirely to AI-powered natural language
            interfaces, I build for reliability, performance, and zero manual intervention.
          </p>
        </FadeIn>

        <FadeInStagger style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          {highlights.map((item) => (
            <FadeInItem key={item.title}>
              <motion.div
                whileHover={{ borderColor: "rgba(26,108,245,0.45)", boxShadow: "0 0 28px rgba(26,108,245,0.12)" }}
                style={{
                  borderRadius: "16px", padding: "1.25rem",
                  background: "rgba(13,27,46,0.7)",
                  border: "1px solid rgba(30,58,95,0.8)",
                  cursor: "default",
                  transition: "border-color 0.3s, box-shadow 0.3s",
                  height: "100%",
                }}
              >
                <div style={{
                  width: "36px", height: "36px", borderRadius: "10px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(26,108,245,0.1)", border: "1px solid rgba(26,108,245,0.2)",
                  marginBottom: "0.85rem",
                }}>
                  <item.icon size={17} color="#4d8ff7" />
                </div>
                <h3 style={{ fontWeight: 700, color: "#e8f0fe", fontSize: "0.88rem", marginBottom: "0.4rem" }}>
                  {item.title}
                </h3>
                <p style={{ color: "#7a9cc5", fontSize: "0.76rem", lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </motion.div>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </div>
    </section>
  );
}
