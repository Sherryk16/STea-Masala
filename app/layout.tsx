import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "@/components/WhatsAppButton";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Stea Masala | Premium Masala Tea – Shop Online in Pakistan",
    template: "%s | Stea Masala Tea",
  },
  description:
    "Stea Masala – Pakistan's premium masala tea blend crafted with natural spices: cardamom, cinnamon, saffron & high-altitude Assam black tea. Order online and experience the soul of tradition in every cup. Free delivery across Pakistan.",
  keywords: [
    "masala tea",
    "masala chai",
    "premium tea",
    "spiced tea",
    "Stea Masala",
    "Steam Masala",
    "masala tea Pakistan",
    "order tea online",
    "cardamom tea",
    "saffron tea",
    "Assam black tea",
    "chai blend",
    "tea delivery Pakistan",
    "best masala tea",
    "authentic chai",
  ],
  authors: [{ name: "Stea Masala" }],
  creator: "Stea Masala",
  publisher: "Stea Masala",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://steamasala.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Stea Masala | Premium Masala Tea – Shop Online in Pakistan",
    description:
      "Pakistan's premium masala tea blend crafted with natural spices: cardamom, cinnamon, saffron & high-altitude Assam black tea. Order online now.",
    url: "https://steamasala.com",
    siteName: "Stea Masala",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Stea Masala – Premium Masala Tea",
      },
    ],
    locale: "en_PK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stea Masala | Premium Masala Tea",
    description:
      "Pakistan's premium masala tea blend crafted with natural spices. Order online now.",
    images: ["/og-image.png"],
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
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  verification: {
    google: "M0eVxAIT-xRdserE-L3XBiQ_KqjYZtZ8vJZQNYnSiWQ",
    other: {
      "msvalidate.01": "057746E94344B01A2E559E7EAD5D0CA8",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <head>
        <link rel="canonical" href="https://steamasala.com" />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
