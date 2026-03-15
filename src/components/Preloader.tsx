"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 1600);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "#050d1a",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: "backOut" }}
              style={{
                fontSize: "3rem", fontWeight: 900, letterSpacing: "-0.02em",
                background: "linear-gradient(135deg, #1a6cf5 0%, #4d8ff7 50%, #7eb3ff 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                marginBottom: "1.5rem",
              }}
            >
              AR
            </motion.div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "120px" }}
              transition={{ duration: 1, delay: 0.3, ease: "easeInOut" }}
              style={{ height: "2px", background: "linear-gradient(90deg, #1a6cf5, #7eb3ff)", borderRadius: "2px", margin: "0 auto" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
