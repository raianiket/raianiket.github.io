"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { projects } from "@/components/Projects";
import { EASE } from "@/lib/constants";

type Result = {
  type: "project";
  title: string;
  category: string;
  tags: string[];
  color: string;
  bgColor: string;
  borderColor: string;
};

function scoreMatch(query: string, project: typeof projects[0]): number {
  const q = query.toLowerCase();
  let score = 0;
  if (project.title.toLowerCase().includes(q)) score += 3;
  if (project.category.toLowerCase().includes(q)) score += 2;
  if (project.tags.some((t) => t.toLowerCase().includes(q))) score += 2;
  if (project.description.toLowerCase().includes(q)) score += 1;
  return score;
}

export default function SearchOverlay() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("openSearch", handler);
    return () => window.removeEventListener("openSearch", handler);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setOpen(true); }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 80);
    else setQuery("");
  }, [open]);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const scored = projects
      .map((p) => ({ project: p, score: scoreMatch(query, p) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ project: p }) => ({
        type: "project" as const,
        title: p.title,
        category: p.category,
        tags: p.tags.slice(0, 4),
        color: p.color,
        bgColor: p.bgColor,
        borderColor: p.borderColor,
      }));
    setResults(scored);
  }, [query]);

  const goToProject = (title: string) => {
    setOpen(false);
    // Scroll to projects section
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
    // Dispatch event so Projects component can highlight/open this project
    window.dispatchEvent(new CustomEvent("highlightProject", { detail: { title } }));
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="search-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 1100, background: "rgba(5,13,26,0.8)", backdropFilter: "blur(8px)" }}
          />

          {/* Panel */}
          <motion.div
            key="search-panel"
            initial={{ opacity: 0, y: -20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.25, ease: EASE }}
            style={{
              position: "fixed", top: "10vh", left: "50%", transform: "translateX(-50%)",
              zIndex: 1101, width: "min(600px, 92vw)",
              background: "rgba(7,20,36,0.99)", border: "1px solid rgba(30,58,95,0.9)",
              borderRadius: "20px", overflow: "hidden",
              boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(26,108,245,0.1)",
            }}
          >
            {/* Input */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "1rem 1.25rem", borderBottom: "1px solid rgba(30,58,95,0.6)" }}>
              <Search size={18} color="#4a6b8a" style={{ flexShrink: 0 }} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects, skills, tech..."
                style={{
                  flex: 1, background: "none", border: "none", outline: "none",
                  color: "#e8f0fe", fontSize: "0.95rem", caretColor: "#4d8ff7",
                }}
              />
              {query && (
                <button onClick={() => setQuery("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#4a6b8a", display: "flex" }}>
                  <X size={16} />
                </button>
              )}
              <kbd style={{ fontSize: "0.6rem", padding: "0.2rem 0.4rem", borderRadius: "5px", background: "rgba(30,58,95,0.5)", border: "1px solid rgba(30,58,95,0.8)", color: "#4a6b8a" }}>Esc</kbd>
            </div>

            {/* Results */}
            <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
              {!query.trim() && (
                <div style={{ padding: "2rem", textAlign: "center", color: "#2d4a6a", fontSize: "0.8rem" }}>
                  Type to search projects, technologies, categories...
                </div>
              )}
              {query.trim() && results.length === 0 && (
                <div style={{ padding: "2rem", textAlign: "center", color: "#2d4a6a", fontSize: "0.8rem" }}>
                  No results for &ldquo;{query}&rdquo;
                </div>
              )}
              {results.map((r, i) => (
                <motion.button
                  key={r.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => goToProject(r.title)}
                  style={{
                    width: "100%", textAlign: "left", padding: "0.9rem 1.25rem",
                    background: "none", border: "none", borderBottom: "1px solid rgba(30,58,95,0.4)",
                    cursor: "pointer", display: "flex", alignItems: "center", gap: "12px",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(26,108,245,0.06)"}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}
                >
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: r.bgColor, border: `1px solid ${r.borderColor}`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: "0.6rem", fontWeight: 700, color: r.color }}>{r.category.slice(0, 2).toUpperCase()}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: "#e8f0fe", fontSize: "0.85rem", fontWeight: 600, marginBottom: "3px" }}>{r.title}</div>
                    <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "0.6rem", padding: "0.1rem 0.4rem", borderRadius: "999px", background: r.bgColor, border: `1px solid ${r.borderColor}`, color: r.color }}>{r.category}</span>
                      {r.tags.map((t) => (
                        <span key={t} style={{ fontSize: "0.6rem", padding: "0.1rem 0.4rem", borderRadius: "999px", background: "rgba(30,58,95,0.5)", border: "1px solid rgba(30,58,95,0.7)", color: "#4a6b8a" }}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <span style={{ fontSize: "0.65rem", color: "#2d4a6a" }}>→</span>
                </motion.button>
              ))}
            </div>

            {/* Footer */}
            <div style={{ padding: "0.6rem 1.25rem", borderTop: "1px solid rgba(30,58,95,0.5)", display: "flex", gap: "1rem", alignItems: "center" }}>
              <span style={{ fontSize: "0.6rem", color: "#2d4a6a" }}>↵ to jump · Esc to close · ⌘K to open</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
