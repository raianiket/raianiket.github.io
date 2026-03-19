"use client";

import { motion } from "framer-motion";
import { GraduationCap, Award } from "lucide-react";

const education = [
  {
    degree: "Bachelor of Technology — Computer Science & Engineering",
    school: "Lovely Professional University",
    period: "2017 – 2021",
  },
];

const certifications = [
  { name: "Node.js Certificate Training", issuer: "Simplilearn" },
  { name: "Full Stack Development", issuer: "upGrad" },
  { name: "ChatGPT & AI Tools Workshop", issuer: "Be10x" },
];

export default function Education() {
  return (
    <section id="education" style={{ padding: "6rem 1.5rem" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: "center", marginBottom: "3.5rem" }}
        >
          <p style={{ color: "#4d8ff7", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            Education & Certifications
          </p>
          <h2 style={{ fontSize: "2.25rem", fontWeight: 800, color: "#e8f0fe" }}>
            Background
          </h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {/* Education */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(26,108,245,0.1)", border: "1px solid rgba(26,108,245,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <GraduationCap size={16} color="#4d8ff7" />
              </div>
              <h3 style={{ fontWeight: 700, color: "#e8f0fe", fontSize: "0.9rem" }}>Education</h3>
            </div>
            {education.map((e) => (
              <motion.div
                key={e.degree}
                whileHover={{ borderColor: "rgba(26,108,245,0.4)" }}
                style={{ borderRadius: "14px", padding: "1.25rem", background: "rgba(13,27,46,0.7)", border: "1px solid rgba(30,58,95,0.8)", transition: "border-color 0.3s" }}
              >
                <p style={{ fontWeight: 700, color: "#e8f0fe", fontSize: "0.88rem", marginBottom: "0.4rem" }}>{e.degree}</p>
                <p style={{ color: "#4d8ff7", fontSize: "0.78rem", fontWeight: 600, marginBottom: "0.25rem" }}>{e.school}</p>
                <p style={{ color: "#7a9cc5", fontSize: "0.72rem" }}>{e.period}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Certifications */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(26,108,245,0.1)", border: "1px solid rgba(26,108,245,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Award size={16} color="#4d8ff7" />
              </div>
              <h3 style={{ fontWeight: 700, color: "#e8f0fe", fontSize: "0.9rem" }}>Certifications</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {certifications.map((c, i) => (
                <motion.div
                  key={c.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ borderColor: "rgba(26,108,245,0.4)" }}
                  style={{ borderRadius: "12px", padding: "1rem 1.25rem", background: "rgba(13,27,46,0.7)", border: "1px solid rgba(30,58,95,0.8)", transition: "border-color 0.3s", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                >
                  <span style={{ fontWeight: 600, color: "#e8f0fe", fontSize: "0.82rem" }}>{c.name}</span>
                  <span style={{ fontSize: "0.7rem", color: "#4d8ff7", fontWeight: 600, background: "rgba(26,108,245,0.1)", border: "1px solid rgba(26,108,245,0.2)", padding: "2px 8px", borderRadius: "999px", whiteSpace: "nowrap", marginLeft: "0.75rem" }}>{c.issuer}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
