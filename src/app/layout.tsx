import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/ThemeContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aniket Rai – Senior Software Engineer",
  description:
    "Senior Software Engineer with 5+ years building scalable backend systems, AI agents, and data pipelines. Expert in Node.js, TypeScript, PostgreSQL, and AWS. Open to full-time roles.",
  keywords: ["Aniket Rai", "Senior Software Engineer", "Node.js", "TypeScript", "PostgreSQL", "AWS", "Backend Engineer", "AI Engineer", "Hyderabad", "Full Stack"],
  authors: [{ name: "Aniket Rai", url: "https://raianiket.github.io" }],
  metadataBase: new URL("https://raianiket.github.io"),
  alternates: { canonical: "https://raianiket.github.io" },
  openGraph: {
    title: "Aniket Rai – Senior Software Engineer",
    description: "5+ years building scalable backend systems, AI agents & data pipelines. Node.js · TypeScript · PostgreSQL · AWS · AI/LLM. Open to new roles.",
    type: "profile",
    url: "https://raianiket.github.io",
    siteName: "Aniket Rai Portfolio",
    locale: "en_US",
    images: [
      {
        url: "https://raianiket.github.io/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Aniket Rai – Senior Software Engineer | Node.js · TypeScript · AWS",
        type: "image/svg+xml",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aniket Rai – Senior Software Engineer",
    description: "5+ years in Node.js, TypeScript, PostgreSQL, AWS & AI/LLM. Open to new roles.",
    images: ["https://raianiket.github.io/og-image.svg"],
    creator: "@aniketrai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

// Anti-flash script — reads theme from localStorage before React hydrates
const themeScript = `(function(){try{var t=localStorage.getItem('theme');document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark')}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="canonical" href="https://raianiket.github.io" />
        <meta property="og:type" content="profile" />
        <meta property="profile:first_name" content="Aniket" />
        <meta property="profile:last_name" content="Rai" />
        <meta property="og:see_also" content="https://www.linkedin.com/in/aniket-kumar-rai" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
