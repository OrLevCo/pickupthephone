import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Call Clock: Pick Up The Phone.",
  description: "In CRE, Calls > Everything Else. Pick Up The Phone. Created by trophy.inc",
  openGraph: {
    title: "Call Clock: Pick Up The Phone.",
    description: "In CRE, Calls > Everything Else. Pick Up The Phone. Created by trophy.inc",
    url: "https://pickupthephone.club/clock",
    siteName: "Pick Up The Phone Club",
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

export default function ClockLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

