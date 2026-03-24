"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const sections = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

export default function SectionDots() {
  const [active, setActive] = useState("hero");
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { threshold: 0.4 }
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="section-dots" style={{
      position: "fixed", right: "1.25rem", top: "50%", transform: "translateY(-50%)",
      zIndex: 200, display: "flex", flexDirection: "column", gap: "10px", alignItems: "center",
    }}>
      {sections.map(({ id, label }) => (
        <div
          key={id}
          style={{ position: "relative", display: "flex", alignItems: "center" }}
          onMouseEnter={() => setHovered(id)}
          onMouseLeave={() => setHovered(null)}
        >
          {/* Label tooltip */}
          <AnimatePresence>
            {hovered === id && (
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.15 }}
                style={{
                  position: "absolute", right: "20px",
                  background: "rgba(7,20,36,0.95)",
                  border: "1px solid rgba(26,108,245,0.3)",
                  borderRadius: "6px",
                  padding: "0.25rem 0.6rem",
                  fontSize: "0.65rem", fontWeight: 600,
                  color: "#e8f0fe", whiteSpace: "nowrap",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
                  pointerEvents: "none",
                }}
              >
                {label}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <motion.div
              animate={{
                width: active === id ? "10px" : "6px",
                height: active === id ? "10px" : "6px",
                background: active === id ? "#1a6cf5" : hovered === id ? "#4d8ff7" : "rgba(74,107,138,0.5)",
                boxShadow: active === id ? "0 0 10px rgba(26,108,245,0.7)" : "none",
              }}
              transition={{ duration: 0.2 }}
              style={{ borderRadius: "50%" }}
            />
          </button>
        </div>
      ))}

      <style>{`
        @media (max-width: 768px) { .section-dots { display: none !important; } }
      `}</style>
    </div>
  );
}
