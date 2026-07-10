import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OutdoorGearAff",
  description: "Outdoor gear posts, affiliate CTAs, and owner analytics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
