"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, Search } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";

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
  const { isDark, toggle } = useTheme();

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

  const openSearch = () => {
    window.dispatchEvent(new CustomEvent("openSearch"));
  };

  const navBg = scrolled ? "rgba(5,13,26,0.88)" : "transparent";
  const navBorder = scrolled ? "1px solid rgba(30,58,95,0.5)" : "1px solid transparent";
  const textColor = "#7a9cc5";
  const activeColor = "#e8f0fe";
  const mobileBg = "rgba(13,27,46,0.97)";

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        transition: "all 0.3s",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        background: navBg,
        borderBottom: navBorder,
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
                    color: isActive ? activeColor : textColor,
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
          {/* Search */}
          <li>
            <button
              onClick={openSearch}
              title="Search (⌘K)"
              style={{
                background: "none", border: "1px solid rgba(30,58,95,0.5)", borderRadius: "8px",
                cursor: "pointer", padding: "0.4rem 0.5rem", color: textColor,
                display: "flex", alignItems: "center", gap: "5px",
                fontSize: "0.72rem", transition: "all 0.2s", marginLeft: "0.25rem",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(26,108,245,0.5)"; e.currentTarget.style.color = "#4d8ff7"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(30,58,95,0.5)"; e.currentTarget.style.color = textColor; }}
            >
              <Search size={13} />
              <span className="search-label">Search</span>
              <span style={{ fontSize: "0.6rem", opacity: 0.6, letterSpacing: "0" }} className="search-kbd">⌘K</span>
            </button>
          </li>
          {/* Theme toggle */}
          <li>
            <motion.button
              onClick={toggle}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              style={{
                background: "rgba(30,58,95,0.4)",
                border: "1px solid rgba(30,58,95,0.6)",
                borderRadius: "8px", cursor: "pointer",
                padding: "0.4rem 0.5rem", display: "flex", alignItems: "center", justifyContent: "center",
                color: "#7eb3ff",
                transition: "all 0.3s", marginLeft: "0.25rem",
              }}
            >
              <AnimatePresence mode="wait">
                {isDark
                  ? <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}><Sun size={15} /></motion.span>
                  : <motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}><Moon size={15} /></motion.span>
                }
              </AnimatePresence>
            </motion.button>
          </li>
        </ul>

        {/* Mobile icons */}
        <div style={{ display: "none", alignItems: "center", gap: "8px" }} className="mobile-actions">
          <button onClick={openSearch} style={{ background: "none", border: "none", cursor: "pointer", color: textColor, padding: "4px", display: "flex" }}>
            <Search size={18} />
          </button>
          <motion.button onClick={toggle} whileTap={{ scale: 0.9 }}
            style={{ background: "none", border: "none", cursor: "pointer", color: isDark ? "#7eb3ff" : "#1a6cf5", padding: "4px", display: "flex" }}>
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </motion.button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", color: textColor, display: "flex" }}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ background: mobileBg, backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(30,58,95,0.5)", padding: "0 1.5rem 1rem" }}
          >
            {links.map((l) => (
              <button
                key={l.label}
                onClick={() => handleNav(l.href)}
                style={{
                  display: "block", width: "100%", textAlign: "left", padding: "0.85rem 0",
                  borderBottom: "1px solid rgba(30,58,95,0.3)", background: "none", border: "none",
                  color: active === l.href.slice(1) ? activeColor : textColor,
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
          .mobile-actions { display: flex !important; }
        }
        @media (max-width: 900px) {
          .search-label, .search-kbd { display: none; }
        }
      `}</style>
    </motion.header>
  );
}
