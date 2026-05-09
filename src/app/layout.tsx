import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Bartın Üniversitesi Teknofest Kulübü — Dijital Kartvizit",
    template: "%s · Bartın Üniversitesi Teknofest Kulübü",
  },
  description: "Bartın Üniversitesi Teknofest Kulübü dijital kartvizit, bento profil, QR ve CV oluşturma aracı.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "BARÜ Teknofest",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#87CEEB" },
    { media: "(prefers-color-scheme: dark)", color: "#003A70" },
  ],
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
