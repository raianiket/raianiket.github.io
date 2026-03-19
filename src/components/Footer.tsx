"use client";

import { Github, Linkedin, Mail } from "lucide-react";

const links = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

const socials = [
  { icon: Linkedin, href: "https://www.linkedin.com/in/aniket-kumar-rai", label: "LinkedIn" },
  { icon: Github, href: "https://github.com/raianiket", label: "GitHub" },
  { icon: Mail, href: "mailto:rai078945@gmail.com", label: "Email" },
];

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid rgba(30,58,95,0.6)", background: "#050d1a", padding: "3rem 1.5rem 2rem" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>

        {/* Top row */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: "2rem", marginBottom: "2rem" }}>

          {/* Brand */}
          <div>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#e8f0fe", marginBottom: "0.4rem" }}>
              Aniket <span style={{ background: "linear-gradient(135deg, #1a6cf5, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Rai</span>
            </div>
            <div style={{ fontSize: "0.78rem", color: "#7a9cc5" }}>Senior Software Engineer · Hyderabad, India</div>
          </div>

          {/* Nav links */}
          <nav style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem 1.5rem" }}>
            {links.map((l) => (
              <a key={l.label} href={l.href} style={{ fontSize: "0.8rem", color: "#7a9cc5", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#e8f0fe")}
                onMouseLeave={e => (e.currentTarget.style.color = "#7a9cc5")}>
                {l.label}
              </a>
            ))}
          </nav>

          {/* Socials */}
          <div style={{ display: "flex", gap: "0.75rem" }}>
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                style={{ width: "36px", height: "36px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(13,27,46,0.8)", border: "1px solid rgba(30,58,95,0.8)", color: "#7a9cc5", textDecoration: "none", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(26,108,245,0.5)"; e.currentTarget.style.color = "#4d8ff7"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(30,58,95,0.8)"; e.currentTarget.style.color = "#7a9cc5"; }}>
                <s.icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "rgba(30,58,95,0.5)", marginBottom: "1.5rem" }} />

        {/* Bottom row */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontSize: "0.73rem", color: "#4a6b8a" }}>
            © {new Date().getFullYear()} Aniket Rai. All rights reserved.
          </span>
          <span style={{ fontSize: "0.73rem", color: "#4a6b8a" }}>
            Built with Next.js · Deployed on GitHub Pages
          </span>
        </div>

      </div>
    </footer>
  );
}
