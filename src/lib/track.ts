import { supabase } from "./supabase";
import { SESSION_KEY } from "./constants";

// Generate or retrieve session ID
function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let sid = sessionStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

// Detect device/browser/OS info
function getDeviceInfo() {
  if (typeof window === "undefined") return {};
  const ua = navigator.userAgent;

  const deviceType = /Mobi|Android|iPhone|iPad/i.test(ua)
    ? "mobile"
    : /Tablet|iPad/i.test(ua)
    ? "tablet"
    : "desktop";

  const browser = /Edg/i.test(ua)
    ? "Edge"
    : /Chrome/i.test(ua)
    ? "Chrome"
    : /Firefox/i.test(ua)
    ? "Firefox"
    : /Safari/i.test(ua)
    ? "Safari"
    : "Other";

  const os = /Windows/i.test(ua)
    ? "Windows"
    : /Mac/i.test(ua)
    ? "macOS"
    : /Linux/i.test(ua)
    ? "Linux"
    : /Android/i.test(ua)
    ? "Android"
    : /iPhone|iPad/i.test(ua)
    ? "iOS"
    : "Other";

  return {
    device_type: deviceType,
    browser,
    os,
    screen_res: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    referrer: document.referrer || "direct",
  };
}

interface TrackOptions {
  section?: string;
  label?: string;
  metadata?: Record<string, unknown>;
  duration?: number;
}

export async function track(event_type: string, options: TrackOptions = {}) {
  try {
    await supabase.from("events").insert({
      event_type,
      session_id: getSessionId(),
      section: options.section ?? null,
      label: options.label ?? null,
      metadata: options.metadata ?? null,
      duration: options.duration ?? null,
      ...getDeviceInfo(),
    });
  } catch {
    // Silently fail — never break the portfolio
  }
}

// Track time spent on a section
export function trackSectionTime(section: string) {
  const start = Date.now();
  return () => {
    const duration = Date.now() - start;
    if (duration > 2000) { // only track if spent >2s
      track("section_duration", { section, duration: Math.round(duration / 1000) });
    }
  };
}
