"use client";

import { motion } from "framer-motion";
import { Mail, Linkedin, MapPin, ArrowUpRight } from "lucide-react";

const contacts = [
  {
    icon: Mail,
    label: "Email",
    value: "rai078945@gmail.com",
    href: "mailto:rai078945@gmail.com",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "linkedin.com/in/aniket-kumar-rai",
    href: "https://www.linkedin.com/in/aniket-kumar-rai",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Hyderabad, Telangana, India",
    href: null,
  },
];

export default function Contact() {
  return (
    <section
      id="contact"
      style={{
        padding: "6rem 1.5rem",
        background: "radial-gradient(ellipse at 50% 100%, rgba(26,108,245,0.07) 0%, transparent 60%), #050d1a",
      }}
    >
      <div style={{ maxWidth: "720px", margin: "0 auto", textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p style={{ color: "#4d8ff7", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            Contact
          </p>
          <h2 style={{ fontSize: "2.25rem", fontWeight: 800, color: "#e8f0fe", marginBottom: "1rem" }}>
            Let&apos;s work together
          </h2>
          <p style={{ color: "#7a9cc5", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: "3rem", maxWidth: "480px", margin: "0 auto 3rem" }}>
            Open to senior backend, full-stack, and backend-heavy roles. Feel free
            to reach out. I typically respond within 24 hours.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2.5rem" }}>
          {contacts.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {c.href ? (
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem",
                    padding: "1.25rem 1rem", borderRadius: "16px", textDecoration: "none",
                    background: "rgba(13,27,46,0.7)", border: "1px solid rgba(30,58,95,0.8)",
                    transition: "border-color 0.3s, box-shadow 0.3s",
                  }}
                >
                  <div style={{ width: "38px", height: "38px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(26,108,245,0.1)", border: "1px solid rgba(26,108,245,0.2)" }}>
                    <c.icon size={17} color="#4d8ff7" />
                  </div>
                  <div>
                    <p style={{ color: "#7a9cc5", fontSize: "0.7rem", marginBottom: "0.2rem" }}>{c.label}</p>
                    <p style={{ color: "#e8f0fe", fontSize: "0.72rem", fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", gap: "3px" }}>
                      {c.value}
                      <ArrowUpRight size={10} color="#4d8ff7" />
                    </p>
                  </div>
                </a>
              ) : (
                <div style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem",
                  padding: "1.25rem 1rem", borderRadius: "16px",
                  background: "rgba(13,27,46,0.7)", border: "1px solid rgba(30,58,95,0.8)",
                }}>
                  <div style={{ width: "38px", height: "38px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(26,108,245,0.1)", border: "1px solid rgba(26,108,245,0.2)" }}>
                    <c.icon size={17} color="#4d8ff7" />
                  </div>
                  <div>
                    <p style={{ color: "#7a9cc5", fontSize: "0.7rem", marginBottom: "0.2rem" }}>{c.label}</p>
                    <p style={{ color: "#e8f0fe", fontSize: "0.72rem", fontWeight: 500 }}>{c.value}</p>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.a
          href="mailto:rai078945@gmail.com"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            padding: "0.85rem 2rem", borderRadius: "12px",
            background: "#1a6cf5", color: "#fff", fontWeight: 600, fontSize: "0.85rem",
            textDecoration: "none", boxShadow: "0 4px 24px rgba(26,108,245,0.3)",
            transition: "background 0.2s, box-shadow 0.2s",
          }}
        >
          <Mail size={16} />
          Send me an email
        </motion.a>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          style={{ marginTop: "4rem", color: "#4a6b8a", fontSize: "0.75rem" }}
        >
          Built with Next.js & Tailwind · © {new Date().getFullYear()} Aniket Rai
        </motion.div>
      </div>
    </section>
  );
}
