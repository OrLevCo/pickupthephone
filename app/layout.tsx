import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://pickupthephone.club'),
  title: "Ultimate 2026 CRE Guide",
  description: "Get free AI-powered CRE coaching in seconds",
  icons: {
    icon: { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    apple: '/50f8083a78cd080bcb85eeeb16a12de2.ico/apple-icon.png',
  },
  openGraph: {
    title: "Ultimate 2026 CRE Guide",
    description: "Get free AI-powered CRE coaching in seconds",
    url: "https://pickupthephone.club",
    siteName: "Pick Up the Phone Club",
    images: [
      {
        url: "/putp-opengraph-01.png",
        width: 1200,
        height: 630,
        alt: "Ultimate 2026 CRE Guide",
        type: "image/png",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ultimate 2026 CRE Guide",
    description: "Get free AI-powered CRE coaching in seconds",
    images: ["/putp-opengraph-01.png"],
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
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
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
