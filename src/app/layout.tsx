import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "vCard Oluşturucu",
  description: "Kişisel kartvizit, QR kod ve CV oluşturma aracı",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
