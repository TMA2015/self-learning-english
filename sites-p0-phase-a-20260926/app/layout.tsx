import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI English Tutor",
  description: "A family English learning platform. Begin with the 12-week Writing module.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
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
