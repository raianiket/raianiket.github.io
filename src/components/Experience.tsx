"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, MapPin, Calendar } from "lucide-react";

const experience = [
  {
    company: "SysCloud Technologies Pvt Ltd",
    roles: [
      {
        title: "Senior Software Engineer",
        location: "Hyderabad, Telangana",
        period: "Jun 2023 – Present",
        bullets: [
          "Revamped the customer-facing Dashboard to display aggregated backup data across 12+ clouds with zero code changes per new cloud, driven dynamically from a metadata table; also launched the Partner Portal end-to-end to onboard MSPs.",
          "Delivered the Restore & Export action layer for S3 Data Migration — fetching older metadata on-demand via AWS Athena, reducing Archives query time from 10s+ to under 2s for large datasets.",
          "Integrated Slack eDiscovery Search, enabling customers to search and retrieve Slack files, messages, and chats.",
          "Launched MDLOPS, a TypeScript microservice from scratch, using cm-runner-plus + JSON-driven config to handle 5 add-on modules with parallel execution via PM2; integrated anomaly detection using the Prophet algorithm.",
          "Built 4 DAL AI-Agents (Database Health, Restore/Export, StartBackup, PostGraphile Slow-Queries) to automate operational monitoring and resolve issues before they impact customers.",
          "Designed and owned MDL 2.0 — a framework replacing complex mutation logic with JSON-driven config; migrated 12+ cloud integrations so adding a new cloud requires zero code changes, only config.",
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
          "Introduced a version-copy mechanism to identify S3 objects with multiple versions, extract older ones, and create new objects — resolving restoration failures caused by outdated DB associations.",
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
    <section id="experience" className="py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[#4d8ff7] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Experience
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#e8f0fe]">
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
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-[#1a6cf5]/10 border border-[#1a6cf5]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-[#4d8ff7] font-bold text-xs">SC</span>
              </div>
              <div>
                <h3 className="font-bold text-[#e8f0fe] text-lg">{exp.company}</h3>
                <p className="text-[#7a9cc5] text-xs">Nov 2020 – Present · 5+ yrs</p>
              </div>
            </div>

            <div className="relative pl-6 border-l border-[#1e3a5f]">
              {exp.roles.map((role, ri) => (
                <motion.div
                  key={role.title}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: ri * 0.1 }}
                  className="relative mb-6 last:mb-0"
                >
                  {/* Dot */}
                  <div className="absolute -left-[25px] top-2 w-3 h-3 rounded-full border-2 border-[#1a6cf5] bg-[#050d1a]" />

                  <div
                    className="glow-border rounded-2xl bg-[#0d1b2e]/60 backdrop-blur-sm overflow-hidden cursor-pointer"
                    onClick={() =>
                      setExpanded(expanded === role.title ? "" : role.title)
                    }
                  >
                    <div className="p-5 flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-[#e8f0fe] text-base mb-1.5">
                          {role.title}
                        </h4>
                        <div className="flex flex-wrap gap-3 text-xs text-[#7a9cc5]">
                          <span className="flex items-center gap-1">
                            <MapPin size={11} /> {role.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={11} /> {role.period}
                          </span>
                        </div>
                      </div>
                      <div className="text-[#4a6b8a] flex-shrink-0 mt-1">
                        {expanded === role.title ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </div>
                    </div>

                    <AnimatePresence>
                      {expanded === role.title && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 border-t border-[#1e3a5f]/50 pt-4">
                            <ul className="space-y-2.5">
                              {role.bullets.map((b, bi) => (
                                <li key={bi} className="flex gap-2.5 text-xs text-[#7a9cc5] leading-relaxed">
                                  <span className="text-[#1a6cf5] mt-1 flex-shrink-0">▸</span>
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
