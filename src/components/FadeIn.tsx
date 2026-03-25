"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { EASE } from "@/lib/constants";



interface FadeInProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  style?: React.CSSProperties;
  className?: string;
}

export function FadeIn({ children, delay = 0, y = 18, duration = 0.75, style, className }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration, delay, ease: EASE }}
      style={style}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// For staggered children — wraps a container and staggers each child
interface FadeInStaggerProps {
  children: ReactNode;
  stagger?: number;
  style?: React.CSSProperties;
}

export function FadeInStagger({ children, stagger = 0.08, style }: FadeInStaggerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ visible: { transition: { staggerChildren: stagger } } }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function FadeInItem({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 18 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
      }}
      style={style}
    >
      {children}
    </motion.div>
  );
}
