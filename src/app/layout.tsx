import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aniket Rai – Senior Software Engineer",
  description:
    "Senior Software Engineer with 5+ years building scalable backend systems, data pipelines, and AI agents. Expert in Node.js, TypeScript, PostgreSQL, and AWS.",
  keywords: ["Aniket Rai", "Senior Software Engineer", "Node.js", "TypeScript", "PostgreSQL", "AWS", "Backend Engineer", "Hyderabad"],
  authors: [{ name: "Aniket Rai" }],
  openGraph: {
    title: "Aniket Rai – Senior Software Engineer",
    description: "5+ years building scalable backend systems, data pipelines & AI agents. Node.js · TypeScript · PostgreSQL · AWS.",
    type: "website",
    url: "https://raianiket.github.io",
    siteName: "Aniket Rai Portfolio",
  },
  twitter: {
    card: "summary",
    title: "Aniket Rai – Senior Software Engineer",
    description: "5+ years building scalable backend systems, data pipelines & AI agents.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
