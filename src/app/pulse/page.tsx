"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Eye, MousePointer, Download, MessageCircle, Clock, Monitor, Globe, BarChart3, RefreshCw, Lock, AlertTriangle } from "lucide-react";

const PULSE_PIN = "4444"; // Change this to your preferred PIN

interface Event {
  id: number;
  event_type: string;
  session_id: string;
  section: string;
  label: string;
  metadata: Record<string, unknown>;
  device_type: string;
  browser: string;
  os: string;
  screen_res: string;
  timezone: string;
  language: string;
  referrer: string;
  duration: number;
  created_at: string;
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function StatCard({ icon: Icon, label, value, color, sub }: { icon: React.ElementType; label: string; value: number | string; color: string; sub?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: "rgba(13,27,46,0.8)", border: `1px solid ${color}30`,
        borderRadius: "16px", padding: "1.25rem",
        display: "flex", flexDirection: "column", gap: "0.5rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ color: "#7a9cc5", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</span>
        <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: `${color}15`, border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={14} color={color} />
        </div>
      </div>
      <div style={{ fontSize: "2rem", fontWeight: 900, color: "#e8f0fe" }}>{value}</div>
      {sub && <div style={{ fontSize: "0.68rem", color: "#4a6b8a" }}>{sub}</div>}
    </motion.div>
  );
}

export default function PulseDashboard() {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("pulse_auth");
    if (saved === PULSE_PIN) setAuthed(true);
  }, []);

  const submitPin = () => {
    if (pin === PULSE_PIN) {
      sessionStorage.setItem("pulse_auth", pin);
      setAuthed(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPin("");
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1000);
    setEvents((data as Event[]) || []);
    setLastRefresh(new Date());
    setLoading(false);
  };

  useEffect(() => {
    if (authed) fetchEvents();
  }, [authed]);

  // Auto-refresh every 30s
  useEffect(() => {
    if (!authed) return;
    const t = setInterval(fetchEvents, 30000);
    return () => clearInterval(t);
  }, [authed]);

  // ── Computed stats ──
  const totalVisits = new Set(events.filter(e => e.event_type === "page_view").map(e => e.session_id)).size;
  const totalSessions = new Set(events.map(e => e.session_id)).size;
  const resumeDownloads = events.filter(e => e.event_type === "resume_download").length;
  const chatbotOpens = events.filter(e => e.event_type === "chatbot_open").length;
  const exploreClicks = events.filter(e => e.event_type === "welcome_explore").length;
  const botClicks = events.filter(e => e.event_type === "welcome_bot").length;
  const contactClicks = events.filter(e => e.event_type === "contact_click").length;

  const sectionCounts = events
    .filter(e => e.event_type === "section_view" && e.section)
    .reduce((acc, e) => { acc[e.section] = (acc[e.section] || 0) + 1; return acc; }, {} as Record<string, number>);

  const projectCounts = events
    .filter(e => e.event_type === "project_click" && e.label)
    .reduce((acc, e) => { acc[e.label] = (acc[e.label] || 0) + 1; return acc; }, {} as Record<string, number>);

  const deviceCounts = events
    .filter(e => e.device_type)
    .reduce((acc, e) => { acc[e.device_type] = (acc[e.device_type] || 0) + 1; return acc; }, {} as Record<string, number>);

  const browserCounts = events
    .filter(e => e.browser)
    .reduce((acc, e) => { acc[e.browser] = (acc[e.browser] || 0) + 1; return acc; }, {} as Record<string, number>);

  const chatMessages = events.filter(e => e.event_type === "chatbot_message").map(e => e.label).filter(Boolean);
  const unansweredCount = new Set(events.filter(e => e.event_type === "chatbot_unanswered").map(e => e.label)).size;

  // Recruiter vs normal sessions
  const recruiterSessions = new Set(events.filter(e => e.event_type === "recruiter_mode").map(e => e.session_id)).size;
  const normalSessions = Math.max(0, totalSessions - recruiterSessions);
  const recruiterConversionPct = totalSessions > 0 ? Math.round((recruiterSessions / totalSessions) * 100) : 0;
  // Recruiter-specific actions (questions asked after recruiter mode activated per session)
  const recruiterQuestions = events.filter(e => e.event_type === "chatbot_message" &&
    events.some(r => r.event_type === "recruiter_mode" && r.session_id === e.session_id)).length;

  // Most asked questions — group by label
  const questionCounts = events
    .filter(e => e.event_type === "chatbot_message" && e.label)
    .reduce((acc, e) => { acc[e.label] = (acc[e.label] || 0) + 1; return acc; }, {} as Record<string, number>);

  // Unanswered questions — from chatbot_unanswered events
  const unansweredQuestions = events
    .filter(e => e.event_type === "chatbot_unanswered" && e.label)
    .map(e => ({ question: e.label, time: e.created_at }))
    .filter((v, i, arr) => arr.findIndex(x => x.question === v.question) === i) // dedupe
    .slice(0, 15);

  const recent = events.slice(0, 20);

  const eventColors: Record<string, string> = {
    page_view: "#4d8ff7",
    section_view: "#7eb3ff",
    project_click: "#a78bfa",
    resume_download: "#4ade80",
    chatbot_open: "#fb923c",
    chatbot_message: "#fbbf24",
    chatbot_unanswered: "#ef4444",
    recruiter_mode: "#fbbf24",
    welcome_explore: "#38bdf8",
    welcome_bot: "#f472b6",
    contact_click: "#34d399",
    nav_click: "#94a3b8",
    section_duration: "#818cf8",
  };

  // ── Auth screen ──
  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", background: "#050d1a", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          style={{
            width: "320px", background: "rgba(7,20,36,0.98)",
            border: "1px solid rgba(30,58,95,0.9)", borderRadius: "24px",
            padding: "2rem", textAlign: "center",
            boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
          }}
        >
          <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "rgba(26,108,245,0.15)", border: "1px solid rgba(26,108,245,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
            <Lock size={22} color="#4d8ff7" />
          </div>
          <h1 style={{ color: "#e8f0fe", fontWeight: 800, fontSize: "1.25rem", marginBottom: "0.25rem" }}>Portfolio Pulse</h1>
          <p style={{ color: "#4a6b8a", fontSize: "0.75rem", marginBottom: "1.5rem" }}>Enter your PIN to access the dashboard</p>
          <input
            type="password"
            value={pin}
            onChange={e => setPin(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submitPin()}
            placeholder="PIN"
            style={{
              width: "100%", padding: "0.65rem 1rem",
              background: "rgba(13,27,46,0.8)",
              border: `1px solid ${pinError ? "#ef4444" : "rgba(30,58,95,0.8)"}`,
              borderRadius: "10px", color: "#e8f0fe",
              fontSize: "1rem", textAlign: "center",
              letterSpacing: "0.3em", outline: "none",
              marginBottom: "0.75rem",
            }}
          />
          {pinError && <p style={{ color: "#ef4444", fontSize: "0.7rem", marginBottom: "0.75rem" }}>Incorrect PIN</p>}
          <button
            onClick={submitPin}
            style={{
              width: "100%", padding: "0.65rem",
              background: "#1a6cf5", border: "none",
              borderRadius: "10px", color: "#fff",
              fontWeight: 700, fontSize: "0.85rem",
              cursor: "pointer",
            }}
          >
            Unlock
          </button>
        </motion.div>
      </div>
    );
  }

  // ── Dashboard ──
  return (
    <div style={{ minHeight: "100vh", background: "#050d1a", padding: "2rem 1.5rem", fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
              <BarChart3 size={20} color="#4d8ff7" />
              <h1 style={{ color: "#e8f0fe", fontWeight: 900, fontSize: "1.5rem" }}>Portfolio Pulse</h1>
            </div>
            <p style={{ color: "#4a6b8a", fontSize: "0.72rem" }}>
              {lastRefresh ? `Last updated ${timeAgo(lastRefresh.toISOString())}` : "Loading..."}
            </p>
          </div>
          <button
            onClick={fetchEvents}
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "0.5rem 1rem", background: "rgba(26,108,245,0.1)", border: "1px solid rgba(26,108,245,0.3)", borderRadius: "10px", color: "#4d8ff7", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}
          >
            <RefreshCw size={13} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
            Refresh
          </button>
        </div>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          <StatCard icon={Eye} label="Unique Visitors" value={totalVisits} color="#4d8ff7" sub={`${totalSessions} sessions`} />
          <StatCard icon={Download} label="Resume Downloads" value={resumeDownloads} color="#4ade80" />
          <StatCard icon={MessageCircle} label="Chatbot Opens" value={chatbotOpens} color="#fb923c" />
          <StatCard icon={MousePointer} label="Contact Clicks" value={contactClicks} color="#34d399" />
          <StatCard icon={Globe} label="Explore Chosen" value={exploreClicks} color="#38bdf8" sub={`${botClicks} chose bot`} />
          <StatCard icon={Clock} label="Bot vs Explore" value={`${botClicks}:${exploreClicks}`} color="#f472b6" sub="bot : explore" />
          <StatCard icon={AlertTriangle} label="Unanswered Qs" value={unansweredCount} color="#ef4444" sub="unique questions" />
          <StatCard icon={MessageCircle} label="Recruiter Sessions" value={recruiterSessions} color="#fbbf24" sub={`${recruiterConversionPct}% of all sessions`} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.25rem", marginBottom: "1.25rem" }}>

          {/* Section views */}
          <div style={{ background: "rgba(13,27,46,0.8)", border: "1px solid rgba(30,58,95,0.8)", borderRadius: "16px", padding: "1.25rem" }}>
            <p style={{ color: "#4d8ff7", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem" }}>Section Views</p>
            {Object.entries(sectionCounts).sort((a, b) => b[1] - a[1]).map(([sec, count]) => {
              const max = Math.max(...Object.values(sectionCounts));
              return (
                <div key={sec} style={{ marginBottom: "0.6rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                    <span style={{ color: "#c8daf4", fontSize: "0.75rem", textTransform: "capitalize" }}>{sec}</span>
                    <span style={{ color: "#7a9cc5", fontSize: "0.72rem" }}>{count}</span>
                  </div>
                  <div style={{ height: "4px", borderRadius: "999px", background: "rgba(30,58,95,0.6)", overflow: "hidden" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / max) * 100}%` }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      style={{ height: "100%", borderRadius: "999px", background: "linear-gradient(90deg, #1a6cf5, #4d8ff7)" }}
                    />
                  </div>
                </div>
              );
            })}
            {Object.keys(sectionCounts).length === 0 && <p style={{ color: "#2d4a6a", fontSize: "0.75rem" }}>No data yet</p>}
          </div>

          {/* Project clicks */}
          <div style={{ background: "rgba(13,27,46,0.8)", border: "1px solid rgba(30,58,95,0.8)", borderRadius: "16px", padding: "1.25rem" }}>
            <p style={{ color: "#a78bfa", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem" }}>Most Viewed Projects</p>
            {Object.entries(projectCounts).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([proj, count]) => {
              const max = Math.max(...Object.values(projectCounts));
              return (
                <div key={proj} style={{ marginBottom: "0.6rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                    <span style={{ color: "#c8daf4", fontSize: "0.73rem" }}>{proj}</span>
                    <span style={{ color: "#7a9cc5", fontSize: "0.72rem" }}>{count}</span>
                  </div>
                  <div style={{ height: "4px", borderRadius: "999px", background: "rgba(30,58,95,0.6)", overflow: "hidden" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / max) * 100}%` }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      style={{ height: "100%", borderRadius: "999px", background: "linear-gradient(90deg, #a78bfa, #c084fc)" }}
                    />
                  </div>
                </div>
              );
            })}
            {Object.keys(projectCounts).length === 0 && <p style={{ color: "#2d4a6a", fontSize: "0.75rem" }}>No data yet</p>}
          </div>

          {/* Device & Browser */}
          <div style={{ background: "rgba(13,27,46,0.8)", border: "1px solid rgba(30,58,95,0.8)", borderRadius: "16px", padding: "1.25rem" }}>
            <p style={{ color: "#4ade80", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem" }}>
              <Monitor size={11} style={{ display: "inline", marginRight: 5 }} />Device & Browser
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
              {Object.entries(deviceCounts).map(([dev, count]) => (
                <span key={dev} style={{ fontSize: "0.72rem", padding: "0.25rem 0.65rem", borderRadius: "999px", background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)", color: "#4ade80" }}>
                  {dev}: {count}
                </span>
              ))}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {Object.entries(browserCounts).map(([br, count]) => (
                <span key={br} style={{ fontSize: "0.72rem", padding: "0.25rem 0.65rem", borderRadius: "999px", background: "rgba(77,143,247,0.1)", border: "1px solid rgba(77,143,247,0.25)", color: "#4d8ff7" }}>
                  {br}: {count}
                </span>
              ))}
            </div>
            {Object.keys(deviceCounts).length === 0 && <p style={{ color: "#2d4a6a", fontSize: "0.75rem" }}>No data yet</p>}
          </div>

          {/* Most asked questions */}
          <div style={{ background: "rgba(13,27,46,0.8)", border: "1px solid rgba(30,58,95,0.8)", borderRadius: "16px", padding: "1.25rem" }}>
            <p style={{ color: "#fbbf24", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem" }}>Most Asked Questions</p>
            {Object.entries(questionCounts).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([q, count]) => {
              const max = Math.max(...Object.values(questionCounts));
              return (
                <div key={q} style={{ marginBottom: "0.6rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px", gap: "0.5rem" }}>
                    <span style={{ color: "#c8daf4", fontSize: "0.72rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{q}</span>
                    <span style={{ color: "#fbbf24", fontSize: "0.7rem", fontWeight: 700, flexShrink: 0 }}>{count}x</span>
                  </div>
                  <div style={{ height: "3px", borderRadius: "999px", background: "rgba(30,58,95,0.6)", overflow: "hidden" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / max) * 100}%` }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      style={{ height: "100%", borderRadius: "999px", background: "linear-gradient(90deg, #fbbf24, #f59e0b)" }}
                    />
                  </div>
                </div>
              );
            })}
            {Object.keys(questionCounts).length === 0 && <p style={{ color: "#2d4a6a", fontSize: "0.75rem" }}>No questions yet</p>}
          </div>

          {/* Recruiter vs Normal */}
          <div style={{ background: "rgba(13,27,46,0.8)", border: "1px solid rgba(251,191,36,0.25)", borderRadius: "16px", padding: "1.25rem" }}>
            <p style={{ color: "#fbbf24", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem" }}>👔 Recruiter vs Normal</p>
            {/* Bar visualization */}
            <div style={{ marginBottom: "1.25rem" }}>
              {[
                { label: "👔 Recruiter", count: recruiterSessions, color: "#fbbf24", bg: "rgba(251,191,36,0.15)" },
                { label: "👤 Normal", count: normalSessions, color: "#4d8ff7", bg: "rgba(26,108,245,0.15)" },
              ].map(({ label, count, color, bg }) => {
                const max = Math.max(recruiterSessions, normalSessions) || 1;
                return (
                  <div key={label} style={{ marginBottom: "0.75rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ color: "#c8daf4", fontSize: "0.75rem" }}>{label}</span>
                      <span style={{ color, fontSize: "0.72rem", fontWeight: 700 }}>{count} sessions</span>
                    </div>
                    <div style={{ height: "8px", borderRadius: "999px", background: "rgba(30,58,95,0.6)", overflow: "hidden" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(count / max) * 100}%` }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        style={{ height: "100%", borderRadius: "999px", background: bg, border: `1px solid ${color}40` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Stats row */}
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {[
                { label: "Conversion", value: `${recruiterConversionPct}%`, color: "#fbbf24" },
                { label: "Recruiter Qs", value: recruiterQuestions, color: "#fb923c" },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ flex: 1, padding: "0.5rem 0.65rem", borderRadius: "10px", background: "rgba(5,13,26,0.6)", border: `1px solid ${color}20`, textAlign: "center" }}>
                  <div style={{ color, fontSize: "1.1rem", fontWeight: 900 }}>{value}</div>
                  <div style={{ color: "#4a6b8a", fontSize: "0.6rem", marginTop: "2px" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Unanswered questions */}
          <div style={{ background: "rgba(13,27,46,0.8)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "16px", padding: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <p style={{ color: "#ef4444", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                ⚠ Unanswered Questions
              </p>
              {unansweredQuestions.length > 0 && (
                <span style={{ fontSize: "0.65rem", padding: "0.15rem 0.5rem", borderRadius: "999px", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.35)", color: "#ef4444", fontWeight: 700 }}>
                  {unansweredQuestions.length} new
                </span>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", maxHeight: "200px", overflowY: "auto" }}>
              {unansweredQuestions.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", padding: "0.35rem 0.65rem", borderRadius: "8px", background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)" }}>
                  <span style={{ color: "#ef4444", fontSize: "0.65rem", marginTop: "1px", flexShrink: 0 }}>✗</span>
                  <span style={{ color: "#c8daf4", fontSize: "0.72rem", flex: 1 }}>{item.question}</span>
                  <span style={{ color: "#4a6b8a", fontSize: "0.62rem", whiteSpace: "nowrap", flexShrink: 0 }}>{timeAgo(item.time)}</span>
                </div>
              ))}
              {unansweredQuestions.length === 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ color: "#4ade80", fontSize: "0.75rem" }}>✓</span>
                  <p style={{ color: "#4a6b8a", fontSize: "0.75rem" }}>Bot answered everything so far!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent activity */}
        <div style={{ background: "rgba(13,27,46,0.8)", border: "1px solid rgba(30,58,95,0.8)", borderRadius: "16px", padding: "1.25rem" }}>
          <p style={{ color: "#e8f0fe", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem" }}>Recent Activity</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {recent.map((e) => (
              <div key={e.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.5rem 0.75rem", borderRadius: "10px", background: "rgba(5,13,26,0.5)" }}>
                <span style={{
                  fontSize: "0.6rem", fontWeight: 700, padding: "0.15rem 0.5rem",
                  borderRadius: "999px",
                  background: `${eventColors[e.event_type] || "#4a6b8a"}15`,
                  border: `1px solid ${eventColors[e.event_type] || "#4a6b8a"}40`,
                  color: eventColors[e.event_type] || "#4a6b8a",
                  whiteSpace: "nowrap",
                }}>
                  {e.event_type}
                </span>
                {e.section && <span style={{ color: "#7a9cc5", fontSize: "0.72rem" }}>{e.section}</span>}
                {e.label && <span style={{ color: "#c8daf4", fontSize: "0.72rem", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.label}</span>}
                <span style={{ color: "#2d4a6a", fontSize: "0.65rem", whiteSpace: "nowrap", marginLeft: "auto" }}>{e.device_type} · {e.browser}</span>
                <span style={{ color: "#2d4a6a", fontSize: "0.65rem", whiteSpace: "nowrap" }}>{timeAgo(e.created_at)}</span>
              </div>
            ))}
            {recent.length === 0 && <p style={{ color: "#2d4a6a", fontSize: "0.75rem" }}>No events yet — visit the portfolio to start tracking</p>}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
