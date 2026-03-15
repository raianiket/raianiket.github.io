"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const links = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-[#050d1a]/80 border-b border-[#1e3a5f]/50"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <motion.a
          href="#hero"
          onClick={(e) => { e.preventDefault(); handleNav("#hero"); }}
          className="text-lg font-bold accent-text cursor-pointer"
          whileHover={{ scale: 1.05 }}
        >
          AR
        </motion.a>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.label}>
              <button
                onClick={() => handleNav(l.href)}
                className="text-sm text-[#7a9cc5] hover:text-[#e8f0fe] transition-colors duration-200 cursor-pointer"
              >
                {l.label}
              </button>
            </li>
          ))}
          <li>
            <a
              href="/Aniket_Resume.pdf"
              download
              className="text-sm px-4 py-2 rounded-lg border border-[#1a6cf5]/50 text-[#4d8ff7] hover:bg-[#1a6cf5]/10 transition-all duration-200"
            >
              Resume
            </a>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-[#7a9cc5] hover:text-white transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
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
            className="md:hidden bg-[#0d1b2e]/95 backdrop-blur-xl border-b border-[#1e3a5f]/50 px-6 pb-4"
          >
            {links.map((l) => (
              <button
                key={l.label}
                onClick={() => handleNav(l.href)}
                className="block w-full text-left py-3 text-[#7a9cc5] hover:text-white border-b border-[#1e3a5f]/30 text-sm transition-colors"
              >
                {l.label}
              </button>
            ))}
            <a
              href="/Aniket_Resume.pdf"
              download
              className="inline-block mt-3 text-sm px-4 py-2 rounded-lg border border-[#1a6cf5]/50 text-[#4d8ff7]"
            >
              Resume
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
