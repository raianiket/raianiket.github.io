"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            position: "fixed", bottom: "2rem", right: "2rem", zIndex: 50,
            width: "44px", height: "44px", borderRadius: "12px",
            background: "rgba(13,27,46,0.9)", border: "1px solid rgba(26,108,245,0.4)",
            color: "#4d8ff7", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 20px rgba(26,108,245,0.2)",
            backdropFilter: "blur(8px)",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
          whileHover={{ boxShadow: "0 4px 24px rgba(26,108,245,0.4)", borderColor: "rgba(26,108,245,0.7)" }}
        >
          <ArrowUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
