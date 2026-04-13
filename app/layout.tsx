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
    "chai tea",
    "chai tea leaves",
    "masala chai recipe",
    "flavoured tea",
    "flavor tea",
    "tea masala",
    "spiced tea",
    "masala chai Pakistan",
    "chai masala",
    "premium tea",
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
    "homemade masala chai",
    "traditional chai",
    "indian masala tea",
    "spiced chai",
    "herbal tea Pakistan",
    "organic masala tea",
    "chai tea online",
    "buy masala tea",
    "tea leaves Pakistan",
    "masala chai blend",
    "premium chai tea",
    "steamasala",
    "steam masala tea",
    "tea brand Pakistan",
    "female founded tea brand",
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
        url: "https://steamasala.com/og-image.png",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Recipe",
              "name": "Stea Masala Chai Recipe",
              "description": "Traditional homemade masala chai recipe by Stea Masala - Pakistan's premium masala tea blend crafted with natural spices: cardamom, cinnamon, saffron & high-altitude Assam black tea.",
              "author": {
                "@type": "Person",
                "name": "Sadaf",
                "description": "Former Standard Chartered banker turned tea entrepreneur, founder of Stea Masala",
              },
              "datePublished": "2024-01-01",
              "prepTime": "PT5M",
              "cookTime": "PT5M",
              "totalTime": "PT10M",
              "recipeYield": "1 cup",
              "recipeCategory": "Beverage",
              "recipeCuisine": "Pakistani",
              "keywords": "masala chai, chai tea, masala tea, chai recipe, spiced tea, tea leaves",
              "recipeIngredient": [
                "1 tsp Stea Masala tea blend",
                "1 cup water",
                "1 cup milk",
                "sugar to taste",
              ],
              "recipeInstructions": [
                { "@type": "HowToStep", "name": "Pour milk and water", "text": "Pour milk into a pan and add water." },
                { "@type": "HowToStep", "name": "Boil", "text": "Bring it to a boil on medium heat." },
                { "@type": "HowToStep", "name": "Add masala tea", "text": "Add 1 teaspoon masala tea leaves." },
                { "@type": "HowToStep", "name": "Simmer", "text": "Let it boil for 2–3 minutes until the flavor develops." },
                { "@type": "HowToStep", "name": "Strain and serve", "text": "Strain into a cup and serve hot." },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
