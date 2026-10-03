import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import { JsonLd } from "@/components/seo/JsonLd";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: "#0a0b0d",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://maplece.com"),
  title: {
    default: "Maple Consulting Engineers | Civil & Structural Engineering",
    template: "%s | Maple Consulting Engineers",
  },
  description:
    "Maple Consulting Engineers is a premier Civil and Structural Engineering consultancy delivering innovative, practical and sustainable engineering solutions for high-rises, commercial, hospital, educational, and PEB industrial structures across Calicut, Kochi, Palakkad, and Bengaluru.",
  keywords: [
    "Maple Consulting Engineers",
    "Maple CE",
    "Civil and Structural Engineering Consultancy",
    "Structural Engineering Consultants Kerala",
    "Structural Engineers in Calicut",
    "Structural Engineers in Kozhikode",
    "Civil Engineering Consultants Kochi",
    "Structural Consultants Palakkad",
    "Structural Engineers Bangalore",
    "Structural Engineering Firm Koramangala Bengaluru",
    "High-Rise Structural Design",
    "PEB Steel Building Design",
    "ETABS Structural Analysis",
    "STAAD Pro Modeling",
    "SAFE Foundation Engineering",
    "Seismic Zone Engineering India",
    "Structural Assessment and Rehabilitation",
    "Non-Destructive Testing NDT",
    "Project Management Consultancy PMC",
    "Quantity Survey and Estimation",
    "Value Engineering Consultants",
    "Construction Supervision Kerala",
    "Muhammed Shameer V.P.",
    "Davis Jose Abraham",
  ],
  authors: [{ name: "Maple Consulting Engineers", url: "https://maplece.com" }],
  creator: "Maple Consulting Engineers",
  publisher: "Maple Consulting Engineers",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: "https://maplece.com",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://maplece.com",
    siteName: "Maple Consulting Engineers",
    title: "Maple Consulting Engineers | Civil & Structural Engineering Consultancy",
    description:
      "A premier Civil & Structural Engineering consultancy delivering innovative, practical and sustainable engineering solutions across Calicut, Kochi, Palakkad, and Bengaluru.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Maple Consulting Engineers - Civil & Structural Engineering",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maple Consulting Engineers | Civil & Structural Engineering Consultancy",
    description:
      "Civil and Structural Engineering Consultancy delivering excellence across high-rises, PEB, and infrastructure in Calicut, Kochi, Palakkad, and Bengaluru.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "engineering",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jakarta.variable} scroll-smooth antialiased`}
    >
      <head>
        <JsonLd />
      </head>
      <body className="min-h-screen bg-[#f7f6f2] text-[#121418] flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
