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
    images: [{ url: "https://raianiket.github.io/og-image.svg", width: 1200, height: 630, alt: "Aniket Rai – Senior Software Engineer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aniket Rai – Senior Software Engineer",
    description: "5+ years building scalable backend systems, data pipelines & AI agents.",
    images: ["https://raianiket.github.io/og-image.svg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
