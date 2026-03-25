"use client";

export default function ResumePrintBar() {
  return (
    <div className="no-print" style={{
      background: "#1e40af", color: "white",
      padding: "0.75rem 2rem", textAlign: "center" as const,
      fontSize: "0.82rem", display: "flex", gap: "1.5rem",
      alignItems: "center", justifyContent: "center", flexWrap: "wrap" as const,
    }}>
      <span>📄 Aniket Rai – Resume · <a href="https://raianiket.github.io" style={{ color: "#93c5fd" }}>raianiket.github.io</a></span>
      <a
        href="/Aniket_Resume.pdf"
        download
        style={{ background: "white", color: "#1e40af", border: "none", borderRadius: "6px", padding: "0.35rem 1rem", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", textDecoration: "none" }}
      >
        ⬇ Download PDF
      </a>
      <button
        onClick={() => window.print()}
        style={{ background: "white", color: "#1e40af", border: "none", borderRadius: "6px", padding: "0.35rem 1rem", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}
      >
        🖨 Print
      </button>
      <a href="/" style={{ color: "#93c5fd", textDecoration: "none" }}>← Back to Portfolio</a>
    </div>
  );
}
