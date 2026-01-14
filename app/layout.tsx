import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Houston Texas Pro - Find Trusted Contractors in Houston",
    template: "%s | Houston Texas Pro",
  },
  description:
    "Houston's premier directory for finding trusted, verified contractors for all your residential and commercial needs. Browse electricians, plumbers, roofers, and more.",
  keywords: [
    "Houston contractors",
    "Texas contractors",
    "Houston plumbers",
    "Houston electricians",
    "Houston roofers",
    "home improvement Houston",
    "contractor directory",
  ],
  openGraph: {
    title: "Houston Texas Pro - Find Trusted Contractors",
    description:
      "Houston's premier directory for finding trusted, verified contractors.",
    url: "https://houstontexaspro.com",
    siteName: "Houston Texas Pro",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
