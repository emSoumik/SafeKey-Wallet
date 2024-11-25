import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Metadata } from "next";

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  variable: '--font-jakarta'
});

export const metadata: Metadata = {
  title: "SafeKey Wallet",
  description: "Secure and elegant wallet management for Ethereum and Solana",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} font-sans antialiased bg-[#0A0A0A]`}>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
