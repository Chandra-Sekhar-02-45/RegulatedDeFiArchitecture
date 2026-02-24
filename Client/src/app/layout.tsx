import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Regulated DeFi Architecture",
  description: "Hybrid government-certified decentralized banking prototype",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen text-base">
        {children}
      </body>
    </html>
  );
}
