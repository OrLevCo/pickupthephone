import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL('https://pickupthephone.club'),
  title: "Ultimate 2026 CRE Guide",
  description: "Get free AI-powered CRE coaching in seconds",
  openGraph: {
    title: "Ultimate 2026 CRE Guide",
    description: "Get free AI-powered CRE coaching in seconds",
    url: "https://pickupthephone.club/2026-guide",
    siteName: "Pick Up the Phone Club",
    images: [
      {
        url: "https://pickupthephone.club/putp-opengraph-01.png",
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
    images: ["https://pickupthephone.club/putp-opengraph-01.png"],
  },
};

export default function GuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

