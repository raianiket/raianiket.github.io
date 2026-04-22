"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { EASE } from "@/lib/constants";



const roles = [
  {
    title: "Senior Software Engineer",
    short: "SSE",
    period: "Jun 2023 – Present",
    duration: "2+ yrs",
    location: "Hyderabad, Telangana",
    color: "#4d8ff7",
    borderColor: "rgba(77,143,247,0.3)",
    bgColor: "rgba(77,143,247,0.08)",
    dotColor: "#4d8ff7",
    barWidth: "51%",
    bullets: [
      "Revamped the customer-facing Dashboard to display aggregated backup data across 12+ clouds with zero code changes per new cloud, as all queries and aggregations are dynamically driven from a metadata table; also launched the Partner Portal end-to-end to onboard MSPs.",
      "Delivered the Restore & Export action layer for S3 Data Migration, fetching older metadata on-demand via AWS Athena and populating the DB, reducing Archives query time from 10s+ to under 2s for large datasets.",
      "Integrated Slack eDiscovery Search end-to-end across UI (React), backend (PHP), and database (PostgreSQL) by configuring PHP backend services for Slack data ingestion and event handling, building Node.js APIs, writing GraphQL mutations, and delivering the full frontend search and results interface.",
      "Built the Bulk Export feature by extending the PHP export backend to support multi-user exports under a single URL; previous implementation handled only single user-level export, refactored to process multiple users in one request with unified download link generation.",
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
    short: "SE",
    period: "May 2021 – Jun 2023",
    duration: "2 yrs 2 mos",
    location: "Chennai, Tamil Nadu",
    color: "#4ade80",
    borderColor: "rgba(74,222,128,0.3)",
    bgColor: "rgba(74,222,128,0.08)",
    dotColor: "#4ade80",
    barWidth: "39%",
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
    short: "Intern",
    period: "Nov 2020 – Apr 2021",
    duration: "6 mos",
    location: "Chennai, Tamil Nadu",
    color: "#94a3b8",
    borderColor: "rgba(148,163,184,0.25)",
    bgColor: "rgba(148,163,184,0.06)",
    dotColor: "#94a3b8",
    barWidth: "9%",
    bullets: [
      "Authored GraphQL queries for UI modules and implemented functions for mutation calls within the PostGraphile server.",
      "Explored AWS services and delivered multiple POCs contributing to the architectural shift from a monolithic system (Gen1) to microservices (Gen2).",
    ],
  },
];

export default function Experience() {
  const [expanded, setExpanded] = useState<string>("Senior Software Engineer");

  return (
    <section id="experience" style={{ padding: "6rem 1.5rem" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto" }}>

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, ease: EASE }}
          style={{ textAlign: "center", marginBottom: "3.5rem" }}
        >
          <p style={{ color: "#4d8ff7", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            Experience
          </p>
          <h2 style={{ fontSize: "2.25rem", fontWeight: 800, color: "var(--text-primary)" }}>
            Where I&apos;ve worked
          </h2>
        </motion.div>

        {/* Company card */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, ease: EASE }}
          style={{
            borderRadius: "20px",
            border: "1px solid var(--border-strong)",
            background: "var(--bg-card-alpha)",
            boxShadow: "var(--shadow-card)",
            padding: "1.75rem",
            marginBottom: "2rem",
          }}
        >
          {/* Company header */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.75rem" }}>
            <div style={{
              width: "52px", height: "52px", borderRadius: "14px", flexShrink: 0,
              background: "linear-gradient(135deg, rgba(26,108,245,0.2), rgba(77,143,247,0.1))",
              border: "1px solid rgba(26,108,245,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ color: "#4d8ff7", fontWeight: 800, fontSize: "0.85rem", letterSpacing: "0.5px" }}>SC</span>
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "1.1rem", marginBottom: "0.2rem" }}>
                SysCloud Technologies Pvt Ltd
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                <span style={{ color: "var(--text-secondary)", fontSize: "0.73rem" }}>Nov 2020 – Present</span>
                <span style={{ color: "#1e3a5f" }}>·</span>
                <span style={{ fontSize: "0.73rem", fontWeight: 600, color: "#4d8ff7", background: "rgba(77,143,247,0.1)", border: "1px solid rgba(77,143,247,0.2)", padding: "0.1rem 0.5rem", borderRadius: "999px" }}>5+ years</span>
                <span style={{ color: "#1e3a5f" }}>·</span>
                <span style={{ color: "var(--text-secondary)", fontSize: "0.73rem" }}>B2B SaaS · Cloud Backup</span>
              </div>
            </div>
          </div>

          {/* Role progression bar */}
          <div style={{ marginBottom: "0.6rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              {[...roles].reverse().map((r) => (
                <span key={r.short} style={{ fontSize: "0.65rem", fontWeight: 600, color: r.color, display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: r.color, display: "inline-block" }} />
                  {r.short}
                </span>
              ))}
            </div>
            <div style={{ height: "6px", borderRadius: "999px", background: "var(--company-bar-track)", overflow: "hidden", display: "flex" }}>
              {[...roles].reverse().map((r) => (
                <motion.div
                  key={r.short}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: EASE, delay: 0.3 }}
                  style={{
                    height: "100%",
                    width: r.barWidth,
                    background: r.color,
                    transformOrigin: "left",
                    opacity: 0.7,
                  }}
                />
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.4rem" }}>
              <span style={{ fontSize: "0.62rem", color: "#4a6b8a" }}>Nov 2020</span>
              <span style={{ fontSize: "0.62rem", color: "#4a6b8a" }}>Present</span>
            </div>
          </div>
        </motion.div>

        {/* Timeline roles */}
        <div style={{ position: "relative", paddingLeft: "2rem" }}>
          {/* Vertical line */}
          <div style={{
            position: "absolute", left: "9px", top: "8px", bottom: "8px",
            width: "2px", background: "linear-gradient(to bottom, #4d8ff7, #4ade80, #94a3b8)",
            borderRadius: "999px", opacity: 0.3,
          }} />

          {roles.map((role, ri) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.75, ease: EASE, delay: ri * 0.1 }}
              style={{ position: "relative", marginBottom: ri < roles.length - 1 ? "1.25rem" : 0 }}
            >
              {/* Timeline dot */}
              <div style={{
                position: "absolute", left: "-2rem", top: "1.1rem",
                width: "14px", height: "14px", borderRadius: "50%",
                border: `2px solid ${role.dotColor}`,
                background: "var(--dot-bg)",
                boxShadow: `0 0 8px ${role.dotColor}55`,
                zIndex: 1,
              }} />

              {/* Role card */}
              <div
                onClick={() => setExpanded(expanded === role.title ? "" : role.title)}
                style={{
                  borderRadius: "16px", overflow: "hidden", cursor: "pointer",
                  background: expanded === role.title ? "var(--bg-card-alpha-hi)" : "var(--bg-card-alpha-lo)",
                  border: `1px solid ${expanded === role.title ? role.borderColor : "var(--border-medium)"}`,
                  transition: "all 0.3s",
                }}
              >
                {/* Role header */}
                <div style={{ padding: "1rem 1.25rem", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap", marginBottom: "0.45rem" }}>
                      <h4 style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.95rem" }}>
                        {role.title}
                      </h4>
                      <span style={{
                        fontSize: "0.62rem", fontWeight: 700, padding: "0.15rem 0.5rem",
                        borderRadius: "999px", background: role.bgColor,
                        border: `1px solid ${role.borderColor}`, color: role.color,
                        letterSpacing: "0.05em",
                      }}>
                        {role.duration}
                      </span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", color: "var(--text-secondary)", fontSize: "0.72rem" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                        <Calendar size={11} /> {role.period}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                        <MapPin size={11} /> {role.location}
                      </span>
                    </div>
                  </div>
                  <div style={{ color: "var(--text-muted)", flexShrink: 0, marginTop: "2px" }}>
                    {expanded === role.title ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>

                {/* Expandable bullets */}
                <AnimatePresence>
                  {expanded === role.title && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      style={{ overflow: "hidden" }}
                    >
                      <div style={{ padding: "0.9rem 1.25rem 1.1rem", borderTop: `1px solid ${role.borderColor}` }}>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                          {role.bullets.map((b, bi) => (
                            <li key={bi} style={{ display: "flex", gap: "0.6rem", fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.65, marginBottom: bi < role.bullets.length - 1 ? "0.65rem" : 0 }}>
                              <span style={{ color: role.color, flexShrink: 0, marginTop: "3px", fontSize: "0.6rem" }}>▸</span>
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
      </div>
    </section>
  );
}
