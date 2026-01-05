import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://pickupthephone.club'),
  title: "Call Clock: Pick Up The Phone.",
  description: "In CRE, Calls > Everything Else. Pick Up The Phone. Created by trophy.inc",
  icons: {
    icon: { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    apple: '/favicon-96x96.png',
  },
  openGraph: {
    title: "Call Clock: Pick Up The Phone.",
    description: "In CRE, Calls > Everything Else. Pick Up The Phone. Created by trophy.inc",
    url: "https://pickupthephone.club",
    siteName: "Pick Up the Phone Club",
    images: [
      {
        url: "https://pickupthephone.club/PUTP Clock Opengraph 2.png",
        width: 1200,
        height: 630,
        alt: "Pick Up The Phone Club Clock",
        type: "image/png",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Call Clock: Pick Up The Phone.",
    description: "In CRE, Calls > Everything Else. Pick Up The Phone. Created by trophy.inc",
    images: ["https://pickupthephone.club/PUTP Clock Opengraph 2.png"],
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
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
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
