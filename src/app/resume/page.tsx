import type { Metadata } from "next";
import ResumePrintBar from "@/components/ResumePrintBar";

export const metadata: Metadata = {
  title: "Aniket Rai – Resume",
  description: "Resume of Aniket Rai, Lead Software Engineer with 5+ years in Node.js, TypeScript, PostgreSQL, AWS, and AI/LLM systems.",
  robots: { index: false },
};

export default function ResumePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'Inter', -apple-system, sans-serif;
          background: #f8fafc;
          color: #0f172a;
          font-size: 13px;
          line-height: 1.5;
        }

        .page {
          max-width: 860px;
          margin: 0 auto;
          padding: 2rem;
          background: #ffffff;
          min-height: 100vh;
        }

        .no-print {
          background: #1e40af;
          color: white;
          padding: 0.75rem 2rem;
          text-align: center;
          font-size: 0.82rem;
          display: flex;
          gap: 1.5rem;
          align-items: center;
          justify-content: center;
        }
        .no-print a { color: #93c5fd; text-decoration: none; }
        .no-print button {
          background: white; color: #1e40af;
          border: none; border-radius: 6px;
          padding: 0.35rem 1rem; font-size: 0.78rem;
          font-weight: 600; cursor: pointer;
        }

        h1 { font-size: 1.9rem; font-weight: 800; color: #0f172a; line-height: 1.2; }
        h2 { font-size: 0.75rem; font-weight: 700; text-transform: uppercase;
             letter-spacing: 0.12em; color: #1d4ed8; margin-bottom: 0.6rem;
             padding-bottom: 0.3rem; border-bottom: 2px solid #dbeafe; }
        h3 { font-size: 0.92rem; font-weight: 700; color: #0f172a; }

        .header { margin-bottom: 1.5rem; }
        .header-sub { font-size: 0.9rem; color: #475569; font-weight: 500; margin-top: 0.2rem; }
        .contact-row { display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 0.6rem; font-size: 0.75rem; color: #475569; }
        .contact-row a { color: #1d4ed8; text-decoration: none; }

        .section { margin-bottom: 1.5rem; }

        .role { margin-bottom: 1.1rem; }
        .role-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.35rem; }
        .role-meta { font-size: 0.72rem; color: #64748b; }
        ul { padding-left: 1.25rem; }
        li { margin-bottom: 0.25rem; font-size: 0.78rem; color: #334155; }

        .skills-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.6rem; }
        .skill-group { }
        .skill-label { font-size: 0.68rem; font-weight: 600; color: #1d4ed8; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.25rem; }
        .skill-tags { display: flex; flex-wrap: wrap; gap: 0.3rem; }
        .tag { font-size: 0.68rem; padding: 0.15rem 0.5rem; border-radius: 4px;
               background: #f1f5f9; border: 1px solid #e2e8f0; color: #475569; }

        .project-item { margin-bottom: 0.9rem; }
        .project-title { font-weight: 600; font-size: 0.82rem; color: #0f172a; }
        .project-desc { font-size: 0.74rem; color: #475569; margin-top: 0.2rem; line-height: 1.55; }
        .project-tags { display: flex; flex-wrap: wrap; gap: 0.25rem; margin-top: 0.25rem; }
        .project-tag { font-size: 0.62rem; padding: 0.1rem 0.4rem; border-radius: 4px;
                        background: #eff6ff; border: 1px solid #bfdbfe; color: #1d4ed8; }

        .edu-row { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
        .edu-badge { font-size: 0.6rem; font-weight: 700; letter-spacing: 0.03em; color: #1d4ed8;
                     background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 4px;
                     padding: 0.05rem 0.35rem; margin-right: 0.4rem; }
        .cert-list { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.4rem; }

        @media print {
          .no-print { display: none !important; }
          body { background: white; }
          .page { max-width: 100%; padding: 1.25cm 1.5cm; }
          h1 { font-size: 1.6rem; }
        }
      `}</style>

      <ResumePrintBar />

      <div className="page">
        {/* Header */}
        <div className="header">
          <h1>Aniket Rai</h1>
          <p className="header-sub">Lead Software Engineer · Node.js · TypeScript · PostgreSQL · AWS · AI/LLM</p>
          <div className="contact-row">
            <span>📧 <a href="mailto:rai078945@gmail.com">rai078945@gmail.com</a></span>
            <span>📞 <a href="tel:+917668514258">+91 7668514258</a></span>
            <span>🔗 <a href="https://www.linkedin.com/in/aniket-kumar-rai">linkedin.com/in/aniket-kumar-rai</a></span>
            <span>🌐 <a href="https://raianiket.github.io">raianiket.github.io</a></span>
            <span>📍 Hyderabad, Telangana</span>
          </div>
        </div>

        {/* Summary */}
        <div className="section">
          <h2>Summary</h2>
          <p style={{ fontSize: "0.78rem", color: "#334155", lineHeight: 1.65 }}>
            Lead Software Engineer with 5+ years building and leading production-grade microservices, distributed systems, and cloud-native backend platforms on AWS.
            Leads a team of 8-10 engineers through system design, HLD/LLD reviews, mentoring, and hiring.
            Deep expertise in Node.js, TypeScript, PostgreSQL, and AI/LLM agent development, with a track record of config-driven frameworks that scale across 12+ cloud integrations with zero per-cloud code, and AI agents that resolve production issues before they reach customers.
          </p>
        </div>

        {/* Experience */}
        <div className="section">
          <h2>Experience</h2>

          <div className="role">
            <div className="role-header">
              <div>
                <h3>Lead Software Engineer</h3>
                <span className="role-meta">SysCloud · Hyderabad, Telangana</span>
              </div>
              <span className="role-meta">Jan 2026 – Present</span>
            </div>
            <ul>
              <li>Revamped the customer-facing <strong>Dashboard</strong> to aggregate backup data across 12+ cloud integrations with zero code changes per new cloud, driving all queries dynamically from a metadata table.</li>
              <li>Launched the <strong>Partner Portal</strong> end-to-end for MSP onboarding, with an aggregated dashboard across managed accounts, role-based access, and usage analytics.</li>
              <li>Continuing to scale <strong>Sky&apos;s agentic workflow</strong> on AWS Step Functions, extending multi-step LLM reasoning and human-in-the-loop approval to new product surfaces.</li>
              <li>Owned the design and development of an AI-powered <strong>Hunter Agent</strong> that autonomously debugs production issues across the observability stack (ELK, CloudWatch, Grafana), pinpoints root cause, and opens an Azure DevOps task with a suggested fix.</li>
              <li>Drive <strong>system design and architecture decisions</strong> across an 8-10 engineer team, leading HLD/LLD reviews, mentoring through PR reviews, and conducting technical interviews.</li>
            </ul>
          </div>

          <div className="role">
            <div className="role-header">
              <div>
                <h3>Senior Software Engineer</h3>
                <span className="role-meta">SysCloud · Hyderabad, Telangana</span>
              </div>
              <span className="role-meta">Jun 2023 – Dec 2025 · 2 yrs 6 mos</span>
            </div>
            <ul>
              <li>Owned end-to-end architecture and implementation of <strong>Slack eDiscovery Search</strong> across PHP ingestion services, Node.js APIs, GraphQL mutations, and the React UI.</li>
              <li>Led development of Gen4 &amp; Gen5 cloud experiences (Reports, Restore, Export, Dashboard, Errors, Limitations) and Homepage widgets (Audit Log, License Management, Usage Stats), using a config-driven architecture that automatically supports new cloud integrations without code changes.</li>
              <li>Owned the design and build of 4 DAL AI-Agents (Database Health, Restore/Export, StartBackup, PostGraphile Slow-Queries) for automated operational monitoring, resolving issues before they impact customers.</li>
              <li>Designed and developed Sky (SysCloud AI), a production-grade agentic workflow on AWS Step Functions orchestrating multi-step LLM reasoning, tool execution, validation, and human-in-the-loop approval to build queries, redirect to the relevant page with filters, and initiate Restore/Export actions.</li>
              <li>Designed MDL 2.0, a JSON-driven config framework for 12+ cloud integrations; adding a new cloud requires zero code changes, with each action executing as a micro-task inside PostGraphile.</li>
              <li>Led code quality initiatives across the team, driving code reviews, best practices, and mentoring that eliminated all critical SonarQube security violations (to 0) and cut total issues by 90%.</li>
              <li>Owned the redesign of Bulk Export across React, PHP, and PostgreSQL, refactoring from single-user to multi-user processing to support exports under a single URL with unified download link generation.</li>
              <li>Overhauled the Batch Job &amp; Materialized View refresh framework with parallel host-level execution, achieving 4x faster job execution.</li>
              <li>Designed the parent/child schema and mutation layer for Add-On Actions (eDiscovery, BDI): Dismiss, Hold/Release, Archive On-Demand, Remove Sharing, Transfer Ownership, and Deletion.</li>
            </ul>
          </div>

          <div className="role">
            <div className="role-header">
              <div>
                <h3>Software Engineer</h3>
                <span className="role-meta">SysCloud · Chennai, Tamil Nadu</span>
              </div>
              <span className="role-meta">May 2021 – Jun 2023 · 2 yrs 2 mos</span>
            </div>
            <ul>
              <li>Architected a unified config-driven Restore/Export function (Gen3) eliminating per-cloud code changes; introduced CM Download Status and ETA calculation.</li>
              <li>Owned the integration of ELK Stack (Elasticsearch, Logstash, Kibana) with Grafana, establishing centralized backend error log collection and real-time monitoring.</li>
              <li>Engineered a weekly S3 data integrity pipeline (Node.js, Fargate, Lambda, Athena) to detect missing zip files and count mismatches, auto-triggering re-backup with Grafana monitoring.</li>
              <li>Owned development of a Timeseries and Batch Framework with multi-environment version support, scheduling MVW refresh jobs on login and on schedule with CPU-level throughput optimizations.</li>
              <li>Introduced a version-copy mechanism to identify S3 objects with multiple versions, extract older ones, and create new objects, resolving restoration failures from outdated DB associations.</li>
            </ul>
          </div>

          <div className="role">
            <div className="role-header">
              <div>
                <h3>Software Engineer Intern</h3>
                <span className="role-meta">SysCloud · Chennai, Tamil Nadu</span>
              </div>
              <span className="role-meta">Nov 2020 – Apr 2021 · 6 mos</span>
            </div>
            <ul>
              <li>Authored GraphQL queries for UI modules and mutation functions within the PostGraphile server.</li>
              <li>Delivered POCs contributing to the architectural shift from monolith to microservices.</li>
            </ul>
          </div>
        </div>

        {/* Skills */}
        <div className="section">
          <h2>Skills</h2>
          <div className="skills-grid">
            <div className="skill-group">
              <div className="skill-label">Languages</div>
              <div className="skill-tags">
                {["TypeScript", "JavaScript", "Node.js", "PHP", "SQL", "Python"].map((s) => <span key={s} className="tag">{s}</span>)}
              </div>
            </div>
            <div className="skill-group">
              <div className="skill-label">Backend & APIs</div>
              <div className="skill-tags">
                {["React", "Express.js", "NestJS", "GraphQL", "PostGraphile", "REST APIs", "Microservices", "Batch Processing"].map((s) => <span key={s} className="tag">{s}</span>)}
              </div>
            </div>
            <div className="skill-group">
              <div className="skill-label">Databases</div>
              <div className="skill-tags">
                {["PostgreSQL", "CTEs", "Materialized Views", "AWS Athena", "MongoDB", "DynamoDB"].map((s) => <span key={s} className="tag">{s}</span>)}
              </div>
            </div>
            <div className="skill-group">
              <div className="skill-label">Cloud & AWS</div>
              <div className="skill-tags">
                {["S3", "Lambda", "Step Functions", "Fargate", "Batch", "SQS", "EventBridge", "Secrets Manager", "SSM", "Docker", "Serverless"].map((s) => <span key={s} className="tag">{s}</span>)}
              </div>
            </div>
            <div className="skill-group">
              <div className="skill-label">GenAI & Agentic AI</div>
              <div className="skill-tags">
                {["LLMs", "OpenAI", "RAG", "LangChain", "LangGraph", "Agentic Workflows", "Prompt Engineering", "AI Agents", "Claude", "MCP", "Prophet Algorithm"].map((s) => <span key={s} className="tag">{s}</span>)}
              </div>
            </div>
            <div className="skill-group">
              <div className="skill-label">Tools</div>
              <div className="skill-tags">
                {["Git", "CI/CD", "SonarQube", "Azure DevOps", "Grafana", "ELK Stack", "CloudWatch", "PM2"].map((s) => <span key={s} className="tag">{s}</span>)}
              </div>
            </div>
          </div>
        </div>

        {/* Key Projects */}
        <div className="section">
          <h2>Key Projects (SysCloud)</h2>
          {[
            { title: "Sky – SysCloud AI", tags: ["Node.js", "TypeScript", "LLM", "Claude", "MCP", "PostgreSQL"], desc: "AI-powered NL interface: customers describe intent, AI builds queries and initiates actions without manual browsing." },
            { title: "Hunter Agent", tags: ["AI Agent", "Claude", "Node.js", "TypeScript", "Python", "ELK", "CloudWatch"], desc: "AI agent that autonomously debugs production issues by correlating signals across the full observability stack, pinpoints root cause, and opens an assigned Azure DevOps task with a suggested fix." },
            { title: "DAL AI-Agents", tags: ["AI Agent", "LLM", "Node.js", "TypeScript", "PostgreSQL"], desc: "4 AI agents for automated operational monitoring with zero-touch auto-remediation before customer impact." },
            { title: "MDL 2.0 Framework", tags: ["TypeScript", "PostGraphile", "PostgreSQL", "JSON Config"], desc: "Config-driven framework replacing mutation logic; 12+ cloud integrations with zero code changes per new cloud." },
            { title: "Restore & Export Action", tags: ["Node.js", "AWS Athena", "S3", "Recursive CTEs"], desc: "3 restore modes supporting millions of items/sec; Athena integration reduces archive query time from 10s+ to under 2s." },
            { title: "Customer Dashboard", tags: ["Node.js", "PostgreSQL", "Materialized Views", "GraphQL"], desc: "13+ widgets, 12+ clouds, data from Transaction + Cache DBs with concurrent MV refresh, zero transactional impact." },
            { title: "PostgreSQL Batch Jobs Framework", tags: ["Node.js", "AWS Batch", "DynamoDB", "Grafana"], desc: "Centralized orchestration engine handling 100K+ jobs across 5 DB types with priority + skip logic." },
          ].map((p) => (
            <div key={p.title} className="project-item">
              <span className="project-title">{p.title}</span>
              <p className="project-desc">{p.desc}</p>
              <div className="project-tags">{p.tags.map((t) => <span key={t} className="project-tag">{t}</span>)}</div>
            </div>
          ))}
        </div>

        {/* Education */}
        <div className="section">
          <h2>Education</h2>
          <div className="edu-row">
            <div>
              <h3>Bachelor of Technology, Computer Science & Engineering</h3>
              <span className="role-meta">Lovely Professional University</span>
            </div>
            <span className="role-meta">2017 – 2021</span>
          </div>
          <div className="edu-row">
            <div>
              <h3><span className="edu-badge">(XII)</span>Intermediate, PCM</h3>
              <span className="role-meta">Gyanpeethika Sr. Sec School</span>
            </div>
            <span className="role-meta">2015 – 2016</span>
          </div>
          <div className="edu-row">
            <div>
              <h3><span className="edu-badge">(X)</span>High School, Science</h3>
              <span className="role-meta">Gyanpeethika Sr. Sec School</span>
            </div>
            <span className="role-meta">2013 – 2014</span>
          </div>
          <div className="cert-list" style={{ marginTop: "0.75rem" }}>
            {[
              { name: "Node.js Certificate Training", issuer: "Simplilearn" },
              { name: "Full Stack Development", issuer: "upGrad" },
              { name: "ChatGPT & AI Tools Workshop", issuer: "Be10x" },
            ].map((c) => (
              <span key={c.name} className="tag" style={{ fontSize: "0.7rem" }}>{c.name} · {c.issuer}</span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
