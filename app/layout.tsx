import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "@/components/WhatsAppButton";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";

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
    default: "ST Lounge | Premium Tea Collection – Golden Patti, Flavoured & Green Teas",
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "ST Lounge – a world of tea & flavours. Shop premium Golden Patti, caramel, elaichi, shahi mixture, Kashmiri shahi, asli masala and refreshing blueberry, strawberry and pina colada green teas. Order online in Pakistan.",
  keywords: [
    "ST Lounge",
    "ST Lounge tea",
    "Golden Patti",
    "golden patti tea",
    "premium tea Pakistan",
    "flavoured tea",
    "green tea Pakistan",
    "caramel tea",
    "elaichi tea",
    "shahi mixture tea",
    "Kashmiri shahi tea",
    "asli masala",
    "masala tea",
    "masala chai",
    "blueberry green tea",
    "strawberry green tea",
    "pina colada green tea",
    "buy tea online Pakistan",
    "tea delivery Pakistan",
    "premium tea collection",
    "steamasala",
    "stea masala tea",
    "tea brand Pakistan",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ST Lounge | Premium Tea Collection – Shop Online in Pakistan",
    description:
      "Discover the rich taste of premium tea leaves and delightful tea blends. Golden Patti, traditional flavours and refreshing green teas — order directly on WhatsApp.",
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} – Premium Tea Collection`,
      },
    ],
    locale: "en_PK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `ST Lounge | ${SITE_TAGLINE}`,
    description:
      "Premium teas, traditional flavours and refreshing green blends. Explore the ST Lounge collection and order on WhatsApp.",
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
    icon: "/newlogo.png",
    apple: "/newlogo.png",
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
        <link rel="canonical" href={SITE_URL} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": `${SITE_URL}/#organization`,
                  name: SITE_NAME,
                  alternateName: ["Stea Masala", "ST Lounge Tea"],
                  url: SITE_URL,
                  logo: `${SITE_URL}/newlogo.png`,
                  description:
                    "ST Lounge is a premium tea collection featuring Golden Patti, traditional flavoured teas and refreshing green tea blends.",
                  sameAs: [
                    "https://www.instagram.com/steamasala_official",
                    "https://www.tiktok.com/@steamasala",
                    "https://www.facebook.com/share/1BV2QGEcsR/",
                  ],
                  contactPoint: {
                    "@type": "ContactPoint",
                    telephone: "+92-334-3747649",
                    contactType: "sales",
                    areaServed: "PK",
                    availableLanguage: ["English", "Urdu"],
                  },
                },
                {
                  "@type": "Recipe",
                  name: "ST Lounge Traditional Chai Recipe",
                  description:
                    "A traditional homemade chai recipe using ST Lounge premium tea leaves and whole spices.",
                  author: {
                    "@type": "Person",
                    name: "Sadaf",
                    description:
                      "Founder of ST Lounge, formerly a Standard Chartered banker turned tea entrepreneur",
                  },
                  datePublished: "2024-01-01",
                  prepTime: "PT5M",
                  cookTime: "PT5M",
                  totalTime: "PT10M",
                  recipeYield: "1 cup",
                  recipeCategory: "Beverage",
                  recipeCuisine: "Pakistani",
                  keywords:
                    "masala chai, chai tea, ST Lounge tea, golden patti, spiced tea, tea leaves",
                  recipeIngredient: [
                    "1 tsp ST Lounge tea leaves",
                    "1 cup water",
                    "1 cup milk",
                    "sugar to taste",
                  ],
                  recipeInstructions: [
                    { "@type": "HowToStep", name: "Pour milk and water", text: "Pour milk into a pan and add water." },
                    { "@type": "HowToStep", name: "Boil", text: "Bring it to a gentle boil on medium heat." },
                    { "@type": "HowToStep", name: "Add tea", text: "Add 1 teaspoon of ST Lounge tea leaves." },
                    { "@type": "HowToStep", name: "Simmer", text: "Simmer for 2–3 minutes until the flavour develops." },
                    { "@type": "HowToStep", name: "Strain and serve", text: "Strain into a cup and serve hot." },
                  ],
                },
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
