import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://pickupthephone.club'),
  title: "The Ultimate Guide for Success in CRE in 2026 | Pick Up the Phone Club",
  description: "Get free AI-powered CRE coaching in seconds",
  openGraph: {
    title: "The Ultimate Guide for Success in CRE in 2026",
    description: "Get free AI-powered CRE coaching in seconds",
    images: [
      {
        url: "/PUTP Opengraph 01.png",
        width: 1200,
        height: 630,
        alt: "The Ultimate Guide for Success in CRE in 2026",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Ultimate Guide for Success in CRE in 2026",
    description: "Get free AI-powered CRE coaching in seconds",
    images: ["/PUTP Opengraph 01.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,600,700&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
