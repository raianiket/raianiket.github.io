"use client";

import { motion } from "framer-motion";

const skillGroups = [
  { label: "Languages", skills: ["TypeScript", "JavaScript", "Node.js", "SQL", "Python"] },
  { label: "Backend & APIs", skills: ["Express.js", "GraphQL", "PostGraphile", "REST APIs", "Microservices", "Batch Processing", "Config-Driven Architecture"] },
  { label: "Databases", skills: ["PostgreSQL", "CTEs", "Materialized Views", "Query Optimization", "AWS Athena", "MongoDB"] },
  { label: "Cloud & AWS", skills: ["S3", "Lambda", "Fargate", "Batch", "SQS", "CodeCommit", "CodeBuild", "CodePipeline", "EventBridge", "S3 Event Notifications", "Docker", "Serverless"] },
  { label: "Monitoring", skills: ["Grafana", "Elasticsearch", "Logstash", "Kibana", "ELK Stack"] },
  { label: "AI & Automation", skills: ["AI Agent Development", "LLM Integration", "Claude", "MCP", "Anomaly Detection", "Prophet Algorithm"] },
  { label: "Tools & Practices", skills: ["Git", "CI/CD", "SonarQube", "Azure DevOps", "System Design", "Code Reviews", "Unit Testing", "Integration Testing", "Agile", "PM2"] },
];

const colors = [
  { bg: "rgba(26,108,245,0.12)", border: "rgba(26,108,245,0.3)", text: "#4d8ff7" },
  { bg: "rgba(77,143,247,0.12)", border: "rgba(77,143,247,0.3)", text: "#7eb3ff" },
  { bg: "rgba(99,102,241,0.12)", border: "rgba(99,102,241,0.3)", text: "#a5b4fc" },
  { bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.25)", text: "#4ade80" },
  { bg: "rgba(234,179,8,0.1)", border: "rgba(234,179,8,0.25)", text: "#facc15" },
  { bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.25)", text: "#f87171" },
  { bg: "rgba(168,85,247,0.1)", border: "rgba(168,85,247,0.25)", text: "#c084fc" },
];

export default function Skills() {
  return (
    <section
      id="skills"
      style={{
        padding: "6rem 1.5rem",
        background: "radial-gradient(ellipse at 50% 0%, rgba(26,108,245,0.05) 0%, transparent 60%), #050d1a",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "3.5rem" }}
        >
          <p style={{ color: "#4d8ff7", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            Technical Skills
          </p>
          <h2 style={{ fontSize: "2.25rem", fontWeight: 800, color: "#e8f0fe" }}>
            What I work with
          </h2>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <style>{`
            @media (max-width: 600px) {
              .skill-row { flex-direction: column !important; gap: 0.5rem !important; }
            }
          `}</style>
          {skillGroups.map((group, gi) => {
            const color = colors[gi % colors.length];
            return (
              <motion.div
                key={group.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: gi * 0.07 }}
                className="skill-row"
                style={{ display: "flex", alignItems: "flex-start", gap: "1.5rem" }}
              >
                <div style={{ minWidth: "160px", flexShrink: 0, paddingTop: "0.2rem" }}>
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: color.text }}>
                    {group.label}
                  </span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {group.skills.map((skill, si) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.85 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.25, delay: gi * 0.07 + si * 0.025 }}
                      whileHover={{ scale: 1.06 }}
                      style={{
                        padding: "0.2rem 0.7rem", borderRadius: "999px",
                        fontSize: "0.72rem", fontWeight: 500, cursor: "default",
                        background: color.bg, border: `1px solid ${color.border}`, color: color.text,
                        transition: "transform 0.2s",
                      }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
