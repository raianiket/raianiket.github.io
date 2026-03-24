"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    // Hide on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;
    document.body.classList.add("custom-cursor");

    const move = (e: MouseEvent) => { setPos({ x: e.clientX, y: e.clientY }); setVisible(true); };
    const down = () => setClicking(true);
    const up = () => setClicking(false);
    const leave = () => setVisible(false);
    const enter = () => setVisible(true);

    const checkHover = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      setHovering(!!el.closest("a, button, [role=button], input, textarea"));
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mousemove", checkHover);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    document.documentElement.addEventListener("mouseleave", leave);
    document.documentElement.addEventListener("mouseenter", enter);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousemove", checkHover);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.documentElement.removeEventListener("mouseleave", leave);
      document.documentElement.removeEventListener("mouseenter", enter);
    };
  }, []);

  return (
    <>
      {/* Outer glow ring */}
      <motion.div
        animate={{
          x: pos.x - 20, y: pos.y - 20,
          scale: clicking ? 0.75 : hovering ? 1.5 : 1,
          opacity: visible ? 1 : 0,
          borderColor: hovering ? "rgba(126,179,255,0.7)" : "rgba(26,108,245,0.5)",
        }}
        transition={{ type: "spring", stiffness: 120, damping: 14, mass: 0.1 }}
        style={{
          position: "fixed", top: 0, left: 0, zIndex: 9998,
          width: "40px", height: "40px", borderRadius: "50%",
          border: "1px solid rgba(26,108,245,0.5)",
          pointerEvents: "none",
          mixBlendMode: "screen",
        }}
      />
      {/* Inner dot */}
      <motion.div
        animate={{
          x: pos.x - 4, y: pos.y - 4,
          scale: clicking ? 1.8 : hovering ? 0.5 : 1,
          opacity: visible ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 600, damping: 30, mass: 0.05 }}
        style={{
          position: "fixed", top: 0, left: 0, zIndex: 9999,
          width: "8px", height: "8px", borderRadius: "50%",
          background: "#1a6cf5",
          pointerEvents: "none",
          boxShadow: "0 0 10px rgba(26,108,245,0.9)",
          mixBlendMode: "screen",
        }}
      />
    </>
  );
}
