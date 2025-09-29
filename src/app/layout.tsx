import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ToastProvider from "@/components/ui/ToastProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Benchmark Management System",
  description: "Enterprise Resource Planning System by The Benchmark",
  icons: {
    icon: '/BmsLogo.png',
    shortcut: '/BmsLogo.png',
    apple: '/BmsLogo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
         <ToastProvider />
        {children}
      </body>
    </html>
  );
}

// sider header footer breadcrumb yaha banana tha {children}
