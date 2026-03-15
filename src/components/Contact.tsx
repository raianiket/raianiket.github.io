"use client";

import { motion } from "framer-motion";
import { Mail, Linkedin, MapPin, ArrowUpRight } from "lucide-react";

const contacts = [
  {
    icon: Mail,
    label: "Email",
    value: "rai078945@gmail.com",
    href: "mailto:rai078945@gmail.com",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "linkedin.com/in/aniket-kumar-rai",
    href: "https://www.linkedin.com/in/aniket-kumar-rai",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Hyderabad, Telangana, India",
    href: null,
  },
];

export default function Contact() {
  return (
    <section
      id="contact"
      className="py-28 px-6"
      style={{
        background:
          "radial-gradient(ellipse at 50% 100%, rgba(26,108,245,0.07) 0%, transparent 60%), #050d1a",
      }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[#4d8ff7] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Contact
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#e8f0fe] mb-4">
            Let&apos;s work together
          </h2>
          <p className="text-[#7a9cc5] text-base mb-12 max-w-xl mx-auto leading-relaxed">
            Open to senior backend, full-stack, and backend-heavy roles. Feel free
            to reach out — I typically respond within 24 hours.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {contacts.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {c.href ? (
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="glow-border rounded-2xl p-5 bg-[#0d1b2e]/60 backdrop-blur-sm flex flex-col items-center gap-3 group block"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#1a6cf5]/10 border border-[#1a6cf5]/20 flex items-center justify-center group-hover:bg-[#1a6cf5]/20 transition-colors">
                    <c.icon size={18} className="text-[#4d8ff7]" />
                  </div>
                  <div>
                    <p className="text-[#7a9cc5] text-xs mb-1">{c.label}</p>
                    <p className="text-[#e8f0fe] text-xs font-medium flex items-center justify-center gap-1">
                      {c.value}
                      <ArrowUpRight size={11} className="text-[#4d8ff7] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </p>
                  </div>
                </a>
              ) : (
                <div className="glow-border rounded-2xl p-5 bg-[#0d1b2e]/60 backdrop-blur-sm flex flex-col items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1a6cf5]/10 border border-[#1a6cf5]/20 flex items-center justify-center">
                    <c.icon size={18} className="text-[#4d8ff7]" />
                  </div>
                  <div>
                    <p className="text-[#7a9cc5] text-xs mb-1">{c.label}</p>
                    <p className="text-[#e8f0fe] text-xs font-medium">{c.value}</p>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.a
          href="mailto:rai078945@gmail.com"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#1a6cf5] hover:bg-[#1a6cf5]/80 text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-[#1a6cf5]/20 hover:shadow-[#1a6cf5]/40"
        >
          <Mail size={16} />
          Send me an email
        </motion.a>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
        className="text-center mt-20 text-[#4a6b8a] text-xs"
      >
        Built with Next.js & Tailwind · © {new Date().getFullYear()} Aniket Rai
      </motion.div>
    </section>
  );
}
