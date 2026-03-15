"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Code2, Database, Cloud, Activity, Bot, Wrench, Globe } from "lucide-react";

// ── Core expertise with proficiency bars ──────────────────────────────────────
const coreSkills = [
  { name: "TypeScript / Node.js", years: "5 yrs", level: "Expert",    pct: 95, color: "#3178c6" },
  { name: "PostgreSQL",           years: "5 yrs", level: "Expert",    pct: 92, color: "#336791" },
  { name: "AWS",                  years: "4 yrs", level: "Advanced",  pct: 82, color: "#ff9900" },
  { name: "GraphQL",              years: "4 yrs", level: "Advanced",  pct: 80, color: "#e10098" },
  { name: "AI Agent Development", years: "1 yr",  level: "Advanced",  pct: 78, color: "#a78bfa" },
];

// ── Tech logo colours & abbreviations ────────────────────────────────────────
const logoMap: Record<string, { bg: string; text: string; label: string }> = {
  "TypeScript":              { bg: "#3178c6", text: "#fff",    label: "TS"  },
  "JavaScript":              { bg: "#f7df1e", text: "#000",    label: "JS"  },
  "Node.js":                 { bg: "#339933", text: "#fff",    label: "N"   },
  "SQL":                     { bg: "#4479a1", text: "#fff",    label: "SQL" },
  "Python":                  { bg: "#3776ab", text: "#ffd343", label: "Py"  },
  "Express.js":              { bg: "#fff",    text: "#000",    label: "Ex"  },
  "GraphQL":                 { bg: "#e10098", text: "#fff",    label: "GQL" },
  "PostGraphile":            { bg: "#e10098", text: "#fff",    label: "PG"  },
  "REST APIs":               { bg: "#2e8b57", text: "#fff",    label: "REST"},
  "PostgreSQL":              { bg: "#336791", text: "#fff",    label: "PG"  },
  "MongoDB":                 { bg: "#47a248", text: "#fff",    label: "MDB" },
  "AWS Athena":              { bg: "#ff9900", text: "#fff",    label: "AQ"  },
  "S3":                      { bg: "#ff9900", text: "#fff",    label: "S3"  },
  "Lambda":                  { bg: "#ff9900", text: "#fff",    label: "λ"   },
  "Fargate":                 { bg: "#ff9900", text: "#fff",    label: "ECS" },
  "Docker":                  { bg: "#2496ed", text: "#fff",    label: "🐳"  },
  "Git":                     { bg: "#f05032", text: "#fff",    label: "Git" },
  "Grafana":                 { bg: "#f46800", text: "#fff",    label: "G"   },
  "Claude":                  { bg: "#a78bfa", text: "#fff",    label: "C"   },
  "SonarQube":               { bg: "#4e9bcd", text: "#fff",    label: "SQ"  },
  "Azure DevOps":            { bg: "#0078d4", text: "#fff",    label: "AZ"  },
};

// ── Skill groups ──────────────────────────────────────────────────────────────
const skillGroups = [
  { icon: Globe,    label: "Languages",         color: "#4d8ff7", border: "rgba(77,143,247,0.3)",   bg: "rgba(77,143,247,0.1)",   skills: ["TypeScript","JavaScript","Node.js","SQL","Python"] },
  { icon: Code2,    label: "Backend & APIs",    color: "#7eb3ff", border: "rgba(126,179,255,0.3)",  bg: "rgba(126,179,255,0.08)", skills: ["Express.js","GraphQL","PostGraphile","REST APIs","Microservices","Batch Processing","Config-Driven Architecture"] },
  { icon: Database, label: "Databases",         color: "#a5b4fc", border: "rgba(165,180,252,0.3)",  bg: "rgba(165,180,252,0.08)", skills: ["PostgreSQL","CTEs","Materialized Views","Query Optimization","AWS Athena","MongoDB"] },
  { icon: Cloud,    label: "Cloud & AWS",       color: "#4ade80", border: "rgba(74,222,128,0.3)",   bg: "rgba(74,222,128,0.08)",  skills: ["S3","Lambda","Fargate","Batch","SQS","CodeCommit","CodeBuild","CodePipeline","EventBridge","S3 Event Notifications","Docker","Serverless"] },
  { icon: Activity, label: "Monitoring",        color: "#facc15", border: "rgba(250,204,21,0.3)",   bg: "rgba(250,204,21,0.08)",  skills: ["Grafana","Elasticsearch","Logstash","Kibana","ELK Stack"] },
  { icon: Bot,      label: "AI & Automation",   color: "#f87171", border: "rgba(248,113,113,0.3)",  bg: "rgba(248,113,113,0.08)", skills: ["AI Agent Development","LLM Integration","Claude","MCP","Anomaly Detection","Prophet Algorithm"] },
  { icon: Wrench,   label: "Tools & Practices", color: "#c084fc", border: "rgba(192,132,252,0.3)",  bg: "rgba(192,132,252,0.08)", skills: ["Git","CI/CD","SonarQube","Azure DevOps","System Design","Code Reviews","Unit Testing","Integration Testing","Agile","PM2"] },
];

// ── Proficiency bar ───────────────────────────────────────────────────────────
function ProfBar({ skill, index }: { skill: typeof coreSkills[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ marginBottom: "0.85rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span style={{ fontWeight: 600, color: "#e8f0fe", fontSize: "0.82rem" }}>{skill.name}</span>
          <span style={{ fontSize: "0.65rem", padding: "1px 7px", borderRadius: "999px", background: `${skill.color}20`, border: `1px solid ${skill.color}50`, color: skill.color, fontWeight: 600 }}>{skill.level}</span>
        </div>
        <span style={{ fontSize: "0.7rem", color: "#7a9cc5" }}>{skill.years}</span>
      </div>
      <div style={{ height: "6px", borderRadius: "999px", background: "rgba(30,58,95,0.5)", overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: started ? `${skill.pct}%` : 0 }}
          transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
          style={{ height: "100%", borderRadius: "999px", background: `linear-gradient(90deg, ${skill.color}, ${skill.color}aa)`, boxShadow: `0 0 8px ${skill.color}60` }}
        />
      </div>
    </div>
  );
}

// ── Skill badge with optional logo ───────────────────────────────────────────
function SkillBadge({ skill, groupColor, groupBorder, groupBg }: { skill: string; groupColor: string; groupBorder: string; groupBg: string }) {
  const logo = logoMap[skill];
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.06, y: -1 }}
      style={{
        display: "inline-flex", alignItems: "center", gap: "5px",
        padding: "0.25rem 0.7rem 0.25rem 0.35rem",
        borderRadius: "999px", fontSize: "0.72rem", fontWeight: 500,
        background: groupBg, border: `1px solid ${groupBorder}`, color: groupColor,
        cursor: "default", transition: "all 0.2s",
      }}
    >
      {logo && (
        <span style={{
          width: "16px", height: "16px", borderRadius: "4px", flexShrink: 0,
          background: logo.bg, color: logo.text,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.5rem", fontWeight: 900, lineHeight: 1,
        }}>
          {logo.label}
        </span>
      )}
      {skill}
    </motion.span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Skills() {
  return (
    <section
      id="skills"
      style={{ padding: "6rem 1.5rem", background: "radial-gradient(ellipse at 50% 0%, rgba(26,108,245,0.05) 0%, transparent 60%), #050d1a" }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "3rem" }}
        >
          <p style={{ color: "#4d8ff7", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem" }}>Technical Skills</p>
          <h2 style={{ fontSize: "2.25rem", fontWeight: 800, color: "#e8f0fe" }}>What I work with</h2>
        </motion.div>

        {/* Core expertise — proficiency bars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ borderRadius: "20px", padding: "1.75rem", background: "rgba(13,27,46,0.8)", border: "1px solid rgba(26,108,245,0.2)", marginBottom: "2.5rem" }}
        >
          <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#4d8ff7", marginBottom: "1.25rem" }}>
            ⚡ Core Expertise
          </p>
          {coreSkills.map((s, i) => <ProfBar key={s.name} skill={s} index={i} />)}
        </motion.div>

        {/* All skills by category */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {skillGroups.map((group, gi) => (
            <motion.div
              key={group.label}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: gi * 0.06 }}
              style={{ display: "flex", alignItems: "flex-start", gap: "1.5rem" }}
              className="skill-row"
            >
              {/* Category label with icon + count */}
              <div style={{ minWidth: "165px", flexShrink: 0, paddingTop: "0.3rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <group.icon size={12} color={group.color} />
                  <span style={{ fontSize: "0.67rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: group.color }}>{group.label}</span>
                </div>
                <span style={{ fontSize: "0.6rem", color: "#4a6b8a", paddingLeft: "1.1rem" }}>{group.skills.length} skills</span>
              </div>

              {/* Badges */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
                {group.skills.map((skill) => (
                  <SkillBadge key={skill} skill={skill} groupColor={group.color} groupBorder={group.border} groupBg={group.bg} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .skill-row { flex-direction: column !important; gap: 0.5rem !important; }
        }
      `}</style>
    </section>
  );
}
