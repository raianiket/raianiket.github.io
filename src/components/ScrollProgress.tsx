"use client";

import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "2px", zIndex: 100, background: "rgba(30,58,95,0.3)" }}>
      <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #1a6cf5, #4d8ff7, #7eb3ff)", transition: "width 0.1s linear", boxShadow: "0 0 8px rgba(26,108,245,0.6)" }} />
    </div>
  );
}
