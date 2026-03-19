"use client";

import { motion } from "framer-motion";
import { ExternalLink, Zap, Brain, Server, Shield, RefreshCw, LayoutDashboard, Users, Database, Activity, GitBranch, TrendingUp } from "lucide-react";

const projects = [
  {
    icon: Brain,
    title: "Sky 2.0 - SysCloud AI",
    description: "AI-powered natural language interface where customers ask questions, the AI dynamically builds queries, redirects to the relevant page with pre-applied filters, and initiates Restore & Export actions, eliminating manual browsing.",
    category: "AI & ML",
    tags: ["Node.js", "TypeScript", "LLM", "Claude", "MCP", "PostgreSQL"],
    metrics: ["NL-to-query", "Zero manual navigation", "Full product coverage"],
    color: "#a78bfa",
    borderColor: "rgba(167,139,250,0.25)",
    bgColor: "rgba(167,139,250,0.08)",
  },
  {
    icon: Shield,
    title: "DAL AI-Agents",
    description: "4 AI agents for automated operational monitoring: Database Health, Restore/Export, StartBackup, and PostGraphile Slow-Queries. Each agent detects and resolves issues automatically before they impact customers.",
    category: "AI & ML",
    tags: ["AI Agent", "LLM", "Node.js", "TypeScript", "PostgreSQL"],
    metrics: ["4 agents", "Auto-remediation", "Zero customer impact"],
    color: "#fb923c",
    borderColor: "rgba(251,146,60,0.25)",
    bgColor: "rgba(251,146,60,0.08)",
  },
  {
    icon: TrendingUp,
    title: "Anomaly Detection",
    description: "AI-powered data integrity engine within SysCloud's Backup & Compare module that identifies unauthorized changes, data corruption, and security threats across Google Workspace, Microsoft 365, and QuickBooks. Operates through two detection mechanisms: a Rule Engine performing deep JSON comparison between backup snapshots to detect field-level changes (additions, deletions, edits) classified into High, Medium, or Low criticality via configurable per-field rules; and a Trend-Level system combining historical backup data with audit logs, feeding time-series data into Facebook's Prophet ML algorithm via a NestJS-based Python service with multi-confidence interval analysis (99%, 95%, 80%) for statistically significant deviation detection. Detected anomalies are tagged in archive tables with dynamic tag management and real-time aggregation counts. Fully orchestrated through MDLOps and actionable via the Addon Actions framework (Dismiss, Hold, Mark True Positive, Transfer Ownership) with end-to-end audit logging.",
    category: "AI & ML",
    tags: ["Node.js", "TypeScript", "Prophet ML", "NestJS", "Python", "PostgreSQL", "MDLOps"],
    metrics: ["3 cloud platforms", "3 confidence intervals", "Rule + ML detection"],
    color: "#c084fc",
    borderColor: "rgba(192,132,252,0.25)",
    bgColor: "rgba(192,132,252,0.08)",
  },
  {
    icon: Zap,
    title: "MDL 2.0 Framework",
    description: "Config-driven framework replacing complex function/mutation logic with simple JSON configuration. Each action executes as a micro-task inside PostGraphile. Migrated 12+ cloud integrations, adding a new cloud now requires zero code changes.",
    category: "Backend",
    tags: ["TypeScript", "PostGraphile", "PostgreSQL", "JSON Config", "Node.js"],
    metrics: ["12+ cloud integrations", "Zero code per new cloud", "Owns restore, sync, backup"],
    color: "#4d8ff7",
    borderColor: "rgba(77,143,247,0.25)",
    bgColor: "rgba(77,143,247,0.08)",
  },
  {
    icon: RefreshCw,
    title: "Restore & Export Action",
    description: "Built from scratch for Gen3 and evolved through Gen4, now fully automated with zero code changes per new cloud. Supports 3 restore/export modes: (1) User/Account/Company level for full data restore, (2) Folder level with deep recursive traversal that populates the complete folder structure and preserves hierarchy so customers restore exactly what they see, and (3) Item level for pinpoint single-item restore/export. For enterprise customers, processes millions of items per second while hydrating metadata on-demand via AWS Athena for archives older than 2 years, cutting query time from 10s+ to under 2s.",
    category: "Backend",
    tags: ["Node.js", "TypeScript", "AWS Athena", "S3", "PostgreSQL", "Recursive CTEs", "Config-Driven"],
    metrics: ["Millions of items/sec", "10s+ → <2s query time", "Zero code per new cloud"],
    color: "#38bdf8",
    borderColor: "rgba(56,189,248,0.25)",
    bgColor: "rgba(56,189,248,0.08)",
  },
  {
    icon: LayoutDashboard,
    title: "Customer Dashboard",
    description: "Per-tenant operational intelligence interface providing real-time and near-real-time visibility into cloud data protection. Sources data from two dedicated per-customer databases: Transaction DB (live data) and Cache DB (pre-computed materialized views), powering 13+ widgets: License Management, Backup/Restore/Export Status & Trends, Usage Statistics, Compliance, Ransomware Detection, AI Anomaly Detection, eDiscovery, and Archiver. All widgets follow a Unified Materialized View pattern supporting both single-cloud and all-cloud views, with data isolation enforced at cloud and entity level and concurrent scheduled MV refresh to ensure dashboard responsiveness without impacting transactional workloads.",
    category: "Dashboard",
    tags: ["Node.js", "TypeScript", "PostgreSQL", "Materialized Views", "GraphQL", "PostGraphile"],
    metrics: ["13+ widgets", "12+ clouds", "Zero transactional impact"],
    color: "#818cf8",
    borderColor: "rgba(129,140,248,0.25)",
    bgColor: "rgba(129,140,248,0.08)",
  },
  {
    icon: Users,
    title: "Partner Portal Dashboard",
    description: "Multi-tenant MSP admin dashboard with consolidated visibility across all managed customers' data protection posture. Data flows from each customer's Transaction and Cache DBs into a centralized Master DB via AWS Lambda-triggered sync, with no PII exposure. Built on a 4-layer hierarchical aggregation: per-cloud per-customer granular data → all-cloud per-customer rollup → all-customer MSP-level consolidation → per-cloud performance analysis across all MSP customers. Status breakdowns (Completed, In Progress, Failed) are embedded as both daily timeline entries and overall summaries, enabling trend analysis and point-in-time reporting.",
    category: "Dashboard",
    tags: ["Node.js", "TypeScript", "AWS Lambda", "PostgreSQL", "Multi-tenant", "Aggregation"],
    metrics: ["4-layer aggregation", "Zero PII exposure", "Full MSP visibility"],
    color: "#f472b6",
    borderColor: "rgba(244,114,182,0.25)",
    bgColor: "rgba(244,114,182,0.08)",
  },
  {
    icon: GitBranch,
    title: "Addon Actions",
    description: "Workflow-driven system managing remediation actions across Compliance, Ransomware, Anomaly Detection, eDiscovery, and Archiver modules. Uses a Parent-Child architecture: actions (Dismiss, Hold, Release Hold, Mark True Positive, Transfer Ownership, Remove Sharing, Deletion) are initiated via PostGraphile mutations, populate a Parent Action Table, then trigger async child processing through AWS SQS and MDLOps. Handles two distinct child paths: Common Addon Actions and BDI Common Actions, performing batch record population, dynamic tag modifications on archive tables, and resource availability checks. A dedicated Presentation Table powers real-time UI tracking with auto-generated status text across 8 states (Not Started through Completed with Exceptions), progress metrics, and Microsoft Teams alerts for failures. Fully auditable via Grafana logging and trace IDs for cross-system tracking.",
    category: "Backend",
    tags: ["Node.js", "TypeScript", "AWS SQS", "PostGraphile", "PostgreSQL", "Grafana", "MS Teams"],
    metrics: ["8 action types", "8 status states", "Full audit trail"],
    color: "#f87171",
    borderColor: "rgba(248,113,113,0.25)",
    bgColor: "rgba(248,113,113,0.08)",
  },
  {
    icon: Server,
    title: "MDLOPS Microservice",
    description: "TypeScript microservice built from scratch using cm-runner-plus + JSON-driven config to handle 5 heavy async add-on modules (eDiscovery, Hold, BDI, Archiver, Data Change Insights) with parallel execution via PM2 and anomaly detection using the Prophet algorithm.",
    category: "Backend",
    tags: ["TypeScript", "Node.js", "PM2", "Prophet Algorithm", "AWS"],
    metrics: ["5 add-on modules", "Parallel execution", "Anomaly detection"],
    color: "#4ade80",
    borderColor: "rgba(74,222,128,0.25)",
    bgColor: "rgba(74,222,128,0.08)",
  },
  {
    icon: Database,
    title: "PostgreSQL Batch Jobs Framework",
    description: "Centralized job orchestration engine (v3.0) built on Node.js and AWS Batch that drives all scheduled and on-demand DB operations across SysCloud's infrastructure. Fetches job definitions from a Master DB and distributes execution across 5 database types (Trans, Cache, Master, Grafana, and CacheTrans) keeping all UI dashboards in sync. Features a priority job system where critical jobs bypass all skip logic, plus an intelligent skip mechanism that evaluates resource availability, active session counts, and explicit skip lists. Integrates AWS Secrets Manager for credential management, DynamoDB for state tracking, and AWS Batch for container-based execution capable of handling hundreds of thousands of jobs. Full observability via execution logging and a dedicated Grafana dashboard tracking Success, Failure, and Skipped outcomes with skip reasons.",
    category: "Infrastructure",
    tags: ["Node.js", "TypeScript", "AWS Batch", "DynamoDB", "PostgreSQL", "Grafana", "Secrets Manager"],
    metrics: ["100K+ jobs handled", "5 DB types orchestrated", "Priority + skip logic"],
    color: "#facc15",
    borderColor: "rgba(250,204,21,0.25)",
    bgColor: "rgba(250,204,21,0.08)",
  },
  {
    icon: Activity,
    title: "Timeseries Jobs Framework",
    description: "Data consolidation engine (v2.0) built on Node.js that aggregates and transforms data from multiple database sources into Grafana for visualization, analytics, and operational monitoring. Fetches job definitions from a Master DB and executes them across 6 source types (Trans, Cache, Master, MasterTrans, DriveRealtime, MailRealtime), consolidating timeseries data into destination DBs for dashboard consumption. Features parallel execution via Promise.allSettled(), built-in retry mechanisms with connection filtering for failed jobs, and dynamic timeseries date handling that auto-adapts queries to the current execution context for real-time data freshness. Deployed via Docker with AWS CodeBuild CI/CD pipeline, SonarQube quality gates, and AWS SSM Parameter Store for secure credential management.",
    category: "Infrastructure",
    tags: ["Node.js", "TypeScript", "Grafana", "Docker", "AWS CodeBuild", "SSM", "SonarQube"],
    metrics: ["6 DB source types", "Parallel execution", "Auto-retry on failure"],
    color: "#34d399",
    borderColor: "rgba(52,211,153,0.25)",
    bgColor: "rgba(52,211,153,0.08)",
  },
];

export default function Projects() {
  return (
    <section id="projects" style={{ padding: "6rem 1.5rem", background: "radial-gradient(ellipse at 50% 50%, rgba(26,108,245,0.04) 0%, transparent 70%), #050d1a" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
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
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
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
                <span style={{ fontSize: "0.62rem", fontWeight: 600, padding: "0.18rem 0.55rem", borderRadius: "999px", background: p.bgColor, border: `1px solid ${p.borderColor}`, color: p.color, letterSpacing: "0.05em" }}>
                  {p.category}
                </span>
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
