"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, MapPin, Calendar } from "lucide-react";

const experience = [
  {
    company: "SysCloud Technologies Pvt Ltd",
    total: "Nov 2020 – Present · 5+ yrs",
    roles: [
      {
        title: "Senior Software Engineer",
        location: "Hyderabad, Telangana",
        period: "Jun 2023 – Present",
        bullets: [
          "Revamped the customer-facing Dashboard to display aggregated backup data across 12+ clouds with zero code changes per new cloud, as all queries and aggregations are dynamically driven from a metadata table; also launched the Partner Portal end-to-end to onboard MSPs.",
          "Delivered the Restore & Export action layer for S3 Data Migration, fetching older metadata on-demand via AWS Athena and populating the DB, reducing Archives query time from 10s+ to under 2s for large datasets.",
          "Integrated Slack eDiscovery Search, enabling customers to search and retrieve Slack files, messages, and chats.",
          "Launched MDLOPS, a TypeScript microservice from scratch, using cm-runner-plus + JSON-driven config to handle 5 add-on modules with parallel execution via PM2; integrated anomaly detection using the Prophet algorithm.",
          "Built 4 DAL AI-Agents (Database Health, Restore/Export, StartBackup, PostGraphile Slow-Queries) to automate operational monitoring and resolve issues before they impact customers.",
          "Designed and owned MDL 2.0, a framework replacing complex mutation logic with JSON-driven config; migrated 12+ cloud integrations so adding a new cloud requires zero code changes, only config.",
          "Implemented Sky 2.0 (SysCloud AI), an AI-powered NL interface where customers ask questions, the AI builds queries, redirects to the relevant page with filters, and initiates Restore & Export actions.",
          "Overhauled the Batch Job & Materialized View refresh framework with parallel host-level execution, achieving 4x faster job execution.",
          "Modeled parent/child schema and mutation layer for Add-On Actions (eDiscovery, BDI) including Dismiss, Hold/Release, Archive On-Demand, Remove Sharing, and Deletion.",
          "Shipped Gen4 & Gen5 cloud pages (Reports, Restore, Export, Dashboard) with a config-driven template so any new cloud is automatically supported across all pages.",
          "Resolved SonarQube code quality issues, eliminating all critical security violations (to 0) and cutting total issues by 90%.",
        ],
      },
      {
        title: "Software Engineer",
        location: "Chennai, Tamil Nadu",
        period: "May 2021 – Jun 2023",
        bullets: [
          "Architected a unified config-driven Restore/Export function (Gen3) eliminating code changes when onboarding new cloud providers; introduced CM Download Status + ETA calculation.",
          "Developed a Timeseries and Batch Framework with multi-environment version support scheduling MVW refresh jobs on login and on schedule; applied CPU-level optimizations for improved throughput.",
          "Engineered a weekly S3 data integrity pipeline using Node.js, AWS Fargate, Lambda, and Athena to detect missing zip files and count mismatches, automatically triggering re-backup with Grafana monitoring.",
          "Integrated ELK Stack with Grafana for centralized backend error log collection and real-time CM error monitoring.",
          "Introduced a version-copy mechanism to identify S3 objects with multiple versions, extract older ones, and create new objects, resolving restoration failures caused by outdated DB associations.",
        ],
      },
      {
        title: "Software Engineer Intern",
        location: "Chennai, Tamil Nadu",
        period: "Nov 2020 – Apr 2021",
        bullets: [
          "Authored GraphQL queries for UI modules and implemented functions for mutation calls within the PostGraphile server.",
          "Explored AWS services and delivered multiple POCs contributing to the architectural shift from a monolithic system (Gen1) to microservices (Gen2).",
        ],
      },
    ],
  },
];

export default function Experience() {
  const [expanded, setExpanded] = useState<string>("Senior Software Engineer");

  return (
    <section id="experience" style={{ padding: "6rem 1.5rem" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
          style={{ marginBottom: "3.5rem" }}
        >
          <p style={{ color: "#4d8ff7", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            Experience
          </p>
          <h2 style={{ fontSize: "2.25rem", fontWeight: 800, color: "#e8f0fe" }}>
            Where I&apos;ve worked
          </h2>
        </motion.div>

        {experience.map((exp) => (
          <motion.div
            key={exp.company}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem" }}>
              <div style={{
                width: "40px", height: "40px", borderRadius: "12px", flexShrink: 0,
                background: "rgba(26,108,245,0.1)", border: "1px solid rgba(26,108,245,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <span style={{ color: "#4d8ff7", fontWeight: 700, fontSize: "0.7rem" }}>SC</span>
              </div>
              <div>
                <h3 style={{ fontWeight: 700, color: "#e8f0fe", fontSize: "1.1rem" }}>{exp.company}</h3>
                <p style={{ color: "#7a9cc5", fontSize: "0.75rem" }}>{exp.total}</p>
              </div>
            </div>

            <div style={{ position: "relative", paddingLeft: "1.5rem", borderLeft: "1px solid #1e3a5f" }}>
              {exp.roles.map((role, ri) => (
                <motion.div
                  key={role.title}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: ri * 0.1 }}
                  style={{ position: "relative", marginBottom: ri < exp.roles.length - 1 ? "1.25rem" : 0 }}
                >
                  {/* Timeline dot */}
                  <div style={{
                    position: "absolute", left: "-1.95rem", top: "1rem",
                    width: "12px", height: "12px", borderRadius: "50%",
                    border: "2px solid #1a6cf5", background: "#050d1a"
                  }} />

                  <div
                    onClick={() => setExpanded(expanded === role.title ? "" : role.title)}
                    style={{
                      borderRadius: "16px", overflow: "hidden", cursor: "pointer",
                      background: "rgba(13,27,46,0.7)",
                      border: "1px solid rgba(30,58,95,0.8)",
                      transition: "border-color 0.3s",
                    }}
                  >
                    <div style={{ padding: "1.1rem 1.25rem", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
                      <div>
                        <h4 style={{ fontWeight: 700, color: "#e8f0fe", fontSize: "0.95rem", marginBottom: "0.4rem" }}>
                          {role.title}
                        </h4>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", color: "#7a9cc5", fontSize: "0.72rem" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                            <MapPin size={11} /> {role.location}
                          </span>
                          <span style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                            <Calendar size={11} /> {role.period}
                          </span>
                        </div>
                      </div>
                      <div style={{ color: "#4a6b8a", flexShrink: 0, marginTop: "2px" }}>
                        {expanded === role.title ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>

                    <AnimatePresence>
                      {expanded === role.title && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          style={{ overflow: "hidden" }}
                        >
                          <div style={{ padding: "0 1.25rem 1.1rem", borderTop: "1px solid rgba(30,58,95,0.5)", paddingTop: "0.9rem" }}>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                              {role.bullets.map((b, bi) => (
                                <li key={bi} style={{ display: "flex", gap: "0.6rem", fontSize: "0.78rem", color: "#7a9cc5", lineHeight: 1.6, marginBottom: bi < role.bullets.length - 1 ? "0.6rem" : 0 }}>
                                  <span style={{ color: "#1a6cf5", flexShrink: 0, marginTop: "2px" }}>▸</span>
                                  <span>{b}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
