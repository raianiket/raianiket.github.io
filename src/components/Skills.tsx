"use client";

import { motion } from "framer-motion";

const skillGroups = [
  {
    label: "Languages",
    skills: ["TypeScript", "JavaScript", "Node.js", "SQL", "Python"],
  },
  {
    label: "Backend & APIs",
    skills: ["Express.js", "GraphQL", "PostGraphile", "REST APIs", "Microservices", "Batch Processing", "Config-Driven Architecture"],
  },
  {
    label: "Databases",
    skills: ["PostgreSQL", "CTEs", "Materialized Views", "Query Optimization", "AWS Athena", "MongoDB"],
  },
  {
    label: "Cloud & AWS",
    skills: ["S3", "Lambda", "Fargate", "Batch", "SQS", "CodeCommit", "CodeBuild", "CodePipeline", "EventBridge", "S3 Event Notifications", "Docker", "Serverless"],
  },
  {
    label: "Monitoring",
    skills: ["Grafana", "Elasticsearch", "Logstash", "Kibana", "ELK Stack"],
  },
  {
    label: "AI & Automation",
    skills: ["AI Agent Development", "LLM Integration", "Claude", "MCP", "Anomaly Detection", "Prophet Algorithm"],
  },
  {
    label: "Tools & Practices",
    skills: ["Git", "CI/CD", "SonarQube", "Azure DevOps", "System Design", "Code Reviews", "Unit Testing", "Integration Testing", "Agile", "PM2"],
  },
];

const colors = [
  { bg: "rgba(26,108,245,0.1)", border: "rgba(26,108,245,0.25)", text: "#4d8ff7" },
  { bg: "rgba(77,143,247,0.1)", border: "rgba(77,143,247,0.25)", text: "#7eb3ff" },
  { bg: "rgba(99,102,241,0.1)", border: "rgba(99,102,241,0.25)", text: "#a5b4fc" },
  { bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.2)", text: "#4ade80" },
  { bg: "rgba(234,179,8,0.08)", border: "rgba(234,179,8,0.2)", text: "#facc15" },
  { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)", text: "#f87171" },
  { bg: "rgba(168,85,247,0.08)", border: "rgba(168,85,247,0.2)", text: "#c084fc" },
];

export default function Skills() {
  return (
    <section
      id="skills"
      className="py-28 px-6"
      style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(26,108,245,0.05) 0%, transparent 60%), #050d1a" }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[#4d8ff7] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Technical Skills
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#e8f0fe]">
            What I work with
          </h2>
        </motion.div>

        <div className="space-y-8">
          {skillGroups.map((group, gi) => {
            const color = colors[gi % colors.length];
            return (
              <motion.div
                key={group.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: gi * 0.07 }}
                className="flex flex-col md:flex-row md:items-start gap-3 md:gap-6"
              >
                <div className="md:w-44 flex-shrink-0">
                  <span
                    className="text-xs font-semibold tracking-wide uppercase"
                    style={{ color: color.text }}
                  >
                    {group.label}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill, si) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: gi * 0.07 + si * 0.03 }}
                      whileHover={{ scale: 1.05 }}
                      className="px-3 py-1 rounded-full text-xs font-medium cursor-default transition-all duration-200"
                      style={{
                        background: color.bg,
                        border: `1px solid ${color.border}`,
                        color: color.text,
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
