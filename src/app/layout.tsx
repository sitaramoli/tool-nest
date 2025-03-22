import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ToolNest: Free Online Tools | Image Compressor, PDF Editor & More",
  description:
    "ToolNest offers free online tools like image compressor, video downloader, PDF editor, and more. Fast, secure, and easy-to-use web utilities for everyone!",
  keywords: [
    "online tools",
    "image compressor",
    "video downloader",
    "PDF editor",
    "file converter",
    "free online tools",
    "compress images",
    "download videos",
    "edit PDFs",
    "convert files",
    "toolbox for web",
  ].join(", "),
  openGraph: {
    title: "ToolNest: Best Free Online Tools | Compress, Convert & Edit",
    description:
      "Use ToolNest's free online tools for image compression, video downloading, PDF editing, and more. Simple, fast, and secure web utilities.",
    url: "https://sitaramoli.com.np",
    siteName: "ToolNest",
    images: [
      {
        url: "https://sitaramoli.com.np/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ToolNest - Best Free Online Tools",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolNest: Free Online Tools | Compress, Convert & Edit",
    description:
      "ToolNest provides free online tools like image compressor, video downloader, PDF editor, and more. Fast and easy-to-use web utilities.",
    images: ["https://sitaramoli.com.np/og-image.jpg"],
  },
  alternates: {
    canonical: "https://sitaramoli.com.np",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
