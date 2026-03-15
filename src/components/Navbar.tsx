"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const links = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = links.map((l) => l.href.slice(1));
    const observers: IntersectionObserver[] = [];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const handleNav = (href: string) => {
    setMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        transition: "all 0.3s",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        background: scrolled ? "rgba(5,13,26,0.85)" : "transparent",
        borderBottom: scrolled ? "1px solid rgba(30,58,95,0.5)" : "1px solid transparent",
      }}
    >
      <nav style={{ maxWidth: "1100px", margin: "0 auto", padding: "1rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          whileHover={{ scale: 1.05 }}
          style={{
            border: "none", cursor: "pointer", fontSize: "1.2rem", fontWeight: 900,
            background: "linear-gradient(135deg, #1a6cf5 0%, #4d8ff7 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          } as React.CSSProperties}
        >
          AR
        </motion.button>

        {/* Desktop links */}
        <ul style={{ display: "flex", alignItems: "center", gap: "0.25rem", listStyle: "none", margin: 0, padding: 0 }} className="desktop-nav">
          {links.map((l) => {
            const isActive = active === l.href.slice(1);
            return (
              <li key={l.label}>
                <button
                  onClick={() => handleNav(l.href)}
                  style={{
                    border: "none", cursor: "pointer",
                    fontSize: "0.82rem", fontWeight: isActive ? 600 : 400,
                    color: isActive ? "#e8f0fe" : "#7a9cc5",
                    padding: "0.4rem 0.75rem", borderRadius: "8px",
                    background: isActive ? "rgba(26,108,245,0.12)" : "transparent",
                    transition: "all 0.2s",
                    position: "relative",
                  } as React.CSSProperties}
                >
                  {l.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      style={{ position: "absolute", bottom: "-1px", left: "50%", transform: "translateX(-50%)", width: "16px", height: "2px", borderRadius: "2px", background: "#1a6cf5" }}
                    />
                  )}
                </button>
              </li>
            );
          })}
          <li>
            <a
              href="/Aniket_Resume.pdf"
              download
              style={{
                fontSize: "0.82rem", fontWeight: 500, padding: "0.4rem 1rem", borderRadius: "8px",
                border: "1px solid rgba(26,108,245,0.4)", color: "#4d8ff7",
                textDecoration: "none", transition: "all 0.2s", marginLeft: "0.5rem",
                background: "rgba(26,108,245,0.05)",
              }}
            >
              Resume
            </a>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#7a9cc5", display: "none" }}
          className="mobile-toggle"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ background: "rgba(13,27,46,0.97)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(30,58,95,0.5)", padding: "0 1.5rem 1rem" }}
          >
            {links.map((l) => (
              <button
                key={l.label}
                onClick={() => handleNav(l.href)}
                style={{
                  display: "block", width: "100%", textAlign: "left", padding: "0.85rem 0",
                  borderBottom: "1px solid rgba(30,58,95,0.3)", background: "none", border: "none",
                  color: active === l.href.slice(1) ? "#e8f0fe" : "#7a9cc5",
                  fontSize: "0.9rem", cursor: "pointer",
                } as React.CSSProperties}
              >
                {l.label}
              </button>
            ))}
            <a href="/Aniket_Resume.pdf" download style={{ display: "inline-block", marginTop: "0.75rem", fontSize: "0.85rem", color: "#4d8ff7", textDecoration: "none" }}>
              Download Resume
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
      `}</style>
    </motion.header>
  );
}
