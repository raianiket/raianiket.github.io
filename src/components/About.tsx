"use client";

import { motion } from "framer-motion";
import { Code2, Database, Cloud, Bot } from "lucide-react";

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
    <section id="about" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-[#4d8ff7] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            About Me
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#e8f0fe] mb-6">
            Building things that{" "}
            <span className="accent-text">scale</span>
          </h2>
          <p className="text-[#7a9cc5] text-base leading-relaxed max-w-2xl mx-auto text-center">
            I&apos;m a Senior Software Engineer at{" "}
            <span className="text-[#e8f0fe] font-medium">SysCloud Technologies</span>,
            where I&apos;ve spent 5+ years designing and owning large-scale backend
            systems for a B2B SaaS cloud-backup platform. From config-driven framework
            migrations that eliminate code changes entirely to AI-powered natural language
            interfaces, I build for reliability, performance, and zero manual intervention.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {highlights.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl p-5 group cursor-default"
              style={{
                background: "rgba(13,27,46,0.7)",
                border: "1px solid rgba(30,58,95,0.8)",
                transition: "border-color 0.3s, box-shadow 0.3s",
              }}
              whileHover={{
                borderColor: "rgba(26,108,245,0.4)",
                boxShadow: "0 0 30px rgba(26,108,245,0.1)",
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                style={{
                  background: "rgba(26,108,245,0.1)",
                  border: "1px solid rgba(26,108,245,0.2)",
                }}
              >
                <item.icon size={18} className="text-[#4d8ff7]" />
              </div>
              <h3 className="font-semibold text-[#e8f0fe] text-sm mb-1.5">{item.title}</h3>
              <p className="text-[#7a9cc5] text-xs leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
