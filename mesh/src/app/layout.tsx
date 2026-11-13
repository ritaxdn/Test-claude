import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "MESH — Find your startup people", template: "%s · MESH" },
  description: "MESH matches founders, builders and investors around real projects.",
};

export const viewport: Viewport = {
  themeColor: "#faf9fc",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-dvh font-sans">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
