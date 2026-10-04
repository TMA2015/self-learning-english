import type { Metadata } from "next";
import "./globals.css";

const basePath=(process.env.NEXT_PUBLIC_BASE_PATH??'').replace(/\/$/,'');

export const metadata: Metadata = {
  title: "Self-Learning English",
  description: "A self-paced English learning platform with structured Grammar, Vocabulary, Reading, Writing and other skills.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: `${basePath}/favicon.svg`,
    shortcut: `${basePath}/favicon.svg`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
