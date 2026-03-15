import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aniket Rai – Senior Software Engineer",
  description:
    "Senior Software Engineer with 5+ years of experience building scalable backend systems, data pipelines, and AI agents. Expert in Node.js, TypeScript, PostgreSQL, and AWS.",
  keywords: ["Aniket Rai", "Senior Software Engineer", "Node.js", "TypeScript", "PostgreSQL", "AWS", "Backend Engineer"],
  authors: [{ name: "Aniket Rai" }],
  openGraph: {
    title: "Aniket Rai – Senior Software Engineer",
    description: "Building scalable backend systems, data pipelines & AI agents.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
