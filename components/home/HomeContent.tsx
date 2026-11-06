"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Coffee,
  Leaf,
  MessageCircle,
  Package,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/home/ProductCard";
import PriceList from "@/components/home/PriceList";
import type { ProductCard as ProductCardData } from "@/lib/products/types";
import { PRODUCT_GROUPS } from "@/lib/products/display";
import {
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
  WHATSAPP_DISPLAY,
  whatsappUrl,
} from "@/lib/site";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" as const },
  },
};

const ingredients = [
  { name: "Cardamom", desc: "Green, aromatic pods from Kerala", image: "/cardamom.png" },
  { name: "Cinnamon", desc: "Sweet, woody bark from Ceylon", image: "/cinnamon.png" },
  { name: "Saffron", desc: "Golden threads of pure luxury", image: "/saffron.png" },
  { name: "Star Anise", desc: "Licorice notes of star anise", image: "/star anise.png" },
  { name: "Tea Leaves", desc: "High-altitude Assam black tea", image: "/tealeaves.png" },
];

const brewMethods = [
  {
    title: "Traditional Chai",
    icon: Coffee,
    steps: [
      "Pour milk into a pan and add water.",
      "Bring it to a gentle boil on medium heat.",
      "Add 1 teaspoon of ST Lounge tea leaves.",
      "Add sugar according to your taste.",
      "Simmer for 2–3 minutes so the flavour develops.",
      "Strain into a cup and serve hot.",
    ],
  },
  {
    title: "Green Tea",
    icon: Leaf,
    steps: [
      "Heat fresh water to just below boiling.",
      "Add 1 teaspoon of ST Lounge green tea.",
      "Steep for 2–3 minutes.",
      "Strain into a cup.",
      "Sip warm and enjoy the fruit-forward finish.",
    ],
  },
];

export default function HomeContent({ products }: { products: ProductCardData[] }) {
  const groups = PRODUCT_GROUPS.map((group) => ({
    ...group,
    products: products.filter((product) => product.category === group.title),
  })).filter((group) => group.products.length > 0);

  const otherProducts = products.filter(
    (product) => !PRODUCT_GROUPS.some((group) => group.title === product.category),
  );

  const orderUrl = whatsappUrl();
  const pricedOffers = products.flatMap((product) => {
    const prices = product.variants
      .map((variant) => variant.price)
      .filter((price): price is number => price !== null);

    if (prices.length === 0) return [];

    return [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: product.name,
          category: product.category,
          image: `${SITE_URL}${product.image}`,
        },
        priceCurrency: "PKR",
        price: Math.min(...prices),
      },
    ];
  });

  return (
    <>
      {/* Structured data for search engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Store",
            name: SITE_NAME,
            alternateName: ["Stea Masala", "ST Lounge Tea"],
            description:
              "ST Lounge is a premium tea collection featuring Golden Patti, traditional flavoured teas and refreshing green tea blends.",
            url: SITE_URL,
            telephone: "+92-334-3747649",
            priceRange: "Rs. 199 - Rs. 2,475",
            areaServed: "Pakistan",
            sameAs: [
              "https://www.instagram.com/steamasala_official",
              "https://www.tiktok.com/@steamasala",
              "https://www.facebook.com/share/1BV2QGEcsR/",
            ],
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "ST Lounge Tea Collection",
              itemListElement: pricedOffers,
            },
          }),
        }}
      />

      <main className="relative bg-[#faf7f2] font-inter selection:bg-[#D4A017] selection:text-[#1a0a00]">
        <Navbar />

        {/* Hero --------------------------------------------------------- */}
        <section className="relative overflow-hidden bg-[#1a0a00] pb-16 pt-28 sm:pb-20 sm:pt-32 lg:pb-24 lg:pt-36">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_5%,rgba(212,160,23,0.16),transparent_34%),radial-gradient(circle_at_82%_22%,rgba(198,40,40,0.28),transparent_46%),linear-gradient(180deg,#1a0a00_0%,#2d1810_100%)]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(212,160,23,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(212,160,23,0.35)_1px,transparent_1px)] [background-size:64px_64px]" />
          <div className="absolute -left-40 top-24 h-80 w-80 rounded-full bg-[#D4A017]/10 blur-3xl" />
          <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-[#C62828]/20 blur-3xl" />

          <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="max-w-2xl"
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#D4A017]/35 bg-[#D4A017]/10 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#D4A017] backdrop-blur-md sm:text-xs">
                <Sparkles size={13} />
                {SITE_TAGLINE}
              </div>

              <h1 className="font-playfair text-4xl font-bold leading-[1.12] text-white drop-shadow-xl sm:text-5xl lg:text-6xl">
                The Soul of{" "}
                <br />
                Tradition in a{" "}
                <br />
                <span className="bg-gradient-to-r from-[#D4A017] to-[#FF6F00] bg-clip-text text-transparent italic">
                  Modern Cup
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-sm font-light leading-relaxed text-[#f5f0e8]/85 sm:text-base">
                Discover the rich taste of premium tea leaves and delightful tea
                blends. From our strong Golden Patti to refreshing green teas and
                aromatic traditional flavours, every blend brings a unique
                experience to your cup.
              </p>
              <p className="mt-2 text-sm font-light leading-relaxed text-[#d8cec2] sm:text-base">
                Explore our collection and discover your perfect cup of tea.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href={orderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 rounded-sm bg-gradient-to-r from-[#C62828] to-[#B71C1C] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-[0_18px_40px_-20px_rgba(198,40,40,0.9)] transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_45px_-18px_rgba(198,40,40,0.95)]"
                >
                  <MessageCircle size={16} strokeWidth={2.4} />
                  Order Your Pack
                </a>
                <a
                  href="#products"
                  className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/20 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/85 transition-colors hover:border-[#D4A017]/60 hover:text-[#D4A017]"
                >
                  Explore the Collection
                  <ArrowRight size={15} />
                </a>
              </div>

              <div className="mt-9 grid max-w-lg grid-cols-3 gap-3 border-t border-white/10 pt-6">
                {[
                  { value: "9", label: "Signature blends" },
                  { value: "4", label: "Pack sizes" },
                  { value: "PKR", label: "Clear pricing" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="font-playfair text-2xl text-[#D4A017] sm:text-3xl">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-[#d8cec2] sm:text-[10px]">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Actual ST Lounge packaging presentation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.25, ease: "easeOut" }}
              className="relative mx-auto w-full max-w-md lg:max-w-none"
            >
              <div className="relative mx-auto aspect-[4/5] w-[82%] overflow-hidden rounded-[2rem] border border-[#D4A017]/40 bg-gradient-to-br from-[#2d1810] via-[#1a0a00] to-[#1a0a00] p-3 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.9)] sm:w-[76%] lg:w-[78%]">
                <div className="relative h-full w-full overflow-hidden rounded-[1.55rem] bg-[#f5f0eb]">
                  <Image
                    src="/Products/GoldPatti/newgoldpatti.png"
                    alt="ST Lounge Golden Patti premium tea packaging"
                    fill
                    priority
                    sizes="(max-width: 1024px) 70vw, 34vw"
                    className="object-contain p-4 sm:p-6"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1a0a00]/95 via-[#1a0a00]/50 to-transparent px-5 pb-5 pt-16 text-white">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#E5A122]">
                      Signature blend
                    </p>
                    <p className="mt-1 font-playfair text-2xl">Golden Patti</p>
                    <p className="mt-1 text-xs text-white/65">
                      From Rs. 199 · 100g to 1kg
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -left-2 top-[22%] hidden w-28 rotate-[-5deg] overflow-hidden rounded-2xl border border-[#D4A017]/30 bg-[#2d1810] p-1.5 shadow-2xl sm:block lg:-left-5 lg:w-32">
                <div className="relative aspect-square overflow-hidden rounded-xl bg-[#f5f0eb]">
                  <Image
                    src="/Products/Flavoured%20Tea/caramel.png"
                    alt="ST Lounge Caramel Tea packaging"
                    fill
                    sizes="130px"
                    className="object-contain p-1.5"
                  />
                </div>
                <p className="px-1 pb-1 pt-2 text-center text-[8px] font-semibold uppercase tracking-[0.16em] text-[#E5A122]">
                  Caramel Tea
                </p>
              </div>

              <div className="absolute -right-1 bottom-[18%] hidden w-28 rotate-[4deg] overflow-hidden rounded-2xl border border-[#D4A017]/30 bg-[#2d1810] p-1.5 shadow-2xl sm:block lg:-right-4 lg:w-32">
                <div className="relative aspect-square overflow-hidden rounded-xl bg-[#f5f0eb]">
                  <Image
                    src="/Products/green%20tea/newblueberry.png"
                    alt="ST Lounge Blueberry Green Tea packaging"
                    fill
                    sizes="130px"
                    className="object-contain p-1.5"
                  />
                </div>
                <p className="px-1 pb-1 pt-2 text-center text-[8px] font-semibold uppercase tracking-[0.16em] text-[#E5A122]">
                  Blueberry Green
                </p>
              </div>

              <div className="absolute -bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#D4A017]/40 bg-[#1a0a00]/95 px-4 py-2 shadow-xl backdrop-blur-md">
                <Image
                  src="/newlogo.png"
                  alt="ST Lounge logo"
                  width={38}
                  height={38}
                  className="h-8 w-8 object-contain"
                />
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#D4A017]">
                    {SITE_NAME}
                  </p>
                  <p className="text-[8px] uppercase tracking-[0.16em] text-white/45">
                    Premium tea collection
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Brand introduction ------------------------------------------ */}
        <section className="relative overflow-hidden bg-[#faf7f2] py-16 sm:py-20 lg:py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeInUp}
              className="relative"
            >
              <div className="grid aspect-[4/5] grid-cols-2 gap-3 rounded-[1.75rem] border border-[#D4A017]/25 bg-[#1a0a00] p-3 shadow-[0_30px_70px_-40px_rgba(31,20,13,0.6)] sm:gap-4 sm:p-4">
                <div className="relative row-span-2 overflow-hidden rounded-2xl bg-[#f5f0eb]">
                  <Image
                    src="/Products/GoldPatti/newgoldpatti.png"
                    alt="ST Lounge Golden Patti tea pack"
                    fill
                    sizes="(max-width: 1024px) 45vw, 24vw"
                    className="object-contain p-4"
                  />
                </div>
                <div className="relative overflow-hidden rounded-2xl bg-[#f5f0eb]">
                  <Image
                    src="/Products/Flavoured%20Tea/newelaichi.png"
                    alt="ST Lounge Elaichi Tea pack"
                    fill
                    sizes="(max-width: 1024px) 45vw, 24vw"
                    className="object-contain p-4"
                  />
                </div>
                <div className="relative overflow-hidden rounded-2xl bg-[#f5f0eb]">
                  <Image
                    src="/Products/green%20tea/newstrawberry.png"
                    alt="ST Lounge Strawberry Green Tea pack"
                    fill
                    sizes="(max-width: 1024px) 45vw, 24vw"
                    className="object-contain p-4"
                  />
                </div>
                <div className="absolute -bottom-5 left-5 rounded-full border border-[#D4A017]/40 bg-[#1a0a00] px-4 py-2 shadow-xl">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#D4A017]">
                    Traditional · Green · Signature
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeInUp}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9B6322] sm:text-xs">
                Welcome to {SITE_NAME}
              </p>
              <h2 className="mt-3 font-playfair text-3xl leading-tight text-[#1F140D] sm:text-4xl lg:text-[2.75rem]">
                ST Lounge – A World of Tea &amp; Flavours
              </h2>
              <p className="mt-5 text-base leading-relaxed text-[#5c4a3d]">
                Discover the rich taste of premium tea leaves and delightful tea
                blends. From our strong Golden Patti, Caramel, Elaichi, Shahi
                Mixture, Kashmiri Shahi and Asli Masala to our refreshing
                Blueberry, Strawberry and Pina Colada green teas, every blend
                brings a unique experience to your cup.
              </p>
              <p className="mt-3 text-base leading-relaxed text-[#5c4a3d]">
                Explore the full ST Lounge collection and discover your perfect
                cup of tea.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {[
                  {
                    icon: Coffee,
                    title: "Traditional",
                    copy: "Golden Patti, Caramel, Elaichi, Shahi Mixture, Kashmiri Shahi and Asli Masala.",
                  },
                  {
                    icon: Leaf,
                    title: "Green Tea",
                    copy: "Blueberry, Strawberry and Pina Colada.",
                  },
                  {
                    icon: Star,
                    title: "Nine Blends",
                    copy: "A tea for every mood and every moment.",
                  },
                ].map((feature) => (
                  <div
                    key={feature.title}
                    className="rounded-xl border border-[#e8e0d8] bg-white/70 p-4 shadow-sm"
                  >
                    <feature.icon size={18} className="text-[#9B6322]" />
                    <p className="mt-2 text-sm font-semibold text-[#1F140D]">
                      {feature.title}
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-[#7a6a5c]">
                      {feature.copy}
                    </p>
                  </div>
                ))}
              </div>

              <a
                href="#price-list"
                className="mt-7 inline-flex items-center gap-2 border-b border-[#C62828] pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1F140D] transition-colors hover:text-[#C62828]"
              >
                View the full price list
                <ArrowRight size={14} />
              </a>
            </motion.div>
          </div>
        </section>

        {/* Products ---------------------------------------------------- */}
        <section id="products" className="scroll-mt-24 bg-[#f5f0eb] py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="mx-auto max-w-3xl text-center"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9B6322] sm:text-xs">
                The Collection
              </p>
              <h2 className="mt-3 font-playfair text-3xl text-[#1F140D] sm:text-4xl lg:text-5xl">
                Nine Signature Blends
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#6b5b4e] sm:text-base">
                From the bold character of Golden Patti to the bright fruit notes
                of our green teas — choose your blend, pick your pack size and
                order directly on WhatsApp.
              </p>
            </motion.div>

            {groups.map((group, groupIndex) => (
              <div key={group.title} className="mt-12 first:mt-12 sm:mt-16">
                <div className="mb-7 flex flex-col gap-4 border-b border-[#d8cbb8] pb-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9B6322]">
                      0{groupIndex + 1} · {group.eyebrow}
                    </p>
                    <h3 className="mt-2 font-playfair text-2xl text-[#1F140D] sm:text-3xl">
                      {group.title}
                    </h3>
                  </div>
                  <p className="max-w-md text-xs leading-relaxed text-[#7a6a5c] sm:text-right sm:text-sm">
                    {group.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {group.products.map((product) => (
                    <ProductCard key={product.name} product={product} />
                  ))}
                </div>
              </div>
            ))}

            {otherProducts.length > 0 && (
              <div className="mt-14">
                <div className="mb-7 border-b border-[#d8cbb8] pb-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9B6322]">
                    Also available
                  </p>
                  <h3 className="mt-2 font-playfair text-2xl text-[#1F140D] sm:text-3xl">
                    More from ST Lounge
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {otherProducts.map((product) => (
                    <ProductCard key={product.name} product={product} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Price list -------------------------------------------------- */}
        <section
          id="price-list"
          className="relative scroll-mt-24 overflow-hidden bg-[#1a0a00] py-16 sm:py-20 lg:py-24"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,160,23,0.14),transparent_42%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4A017]/60 to-transparent" />
          <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="mx-auto mb-9 max-w-3xl text-center sm:mb-12"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#E5A122] sm:text-xs">
                Transparent Pricing
              </p>
              <h2 className="mt-3 font-playfair text-3xl text-white sm:text-4xl lg:text-5xl">
                The ST Lounge Price List
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#e8e0d5]/70 sm:text-base">
                Product / Flavour · Weight · Customer Price (PKR). Every pack is
                clearly priced so you can choose the size that suits your cup.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7 }}
            >
              <PriceList products={products} />
            </motion.div>
          </div>
        </section>

        {/* Craft / philosophy ----------------------------------------- */}
        <section className="bg-[#faf7f2] py-16 sm:py-20 lg:py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="relative h-[380px] overflow-hidden rounded-[1.75rem] border border-[#D4A017]/25 shadow-2xl sm:h-[480px] lg:h-[520px]"
            >
              <Image
                src="/ingredient.png"
                alt="Whole spices and tea leaves used in ST Lounge blends"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a0a00]/75 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#E5A122]">
                  Crafted with intention
                </p>
                <p className="mt-2 max-w-sm font-playfair text-2xl leading-snug text-white sm:text-3xl">
                  Whole spices. Quality leaves. A cup worth slowing down for.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9B6322] sm:text-xs">
                Our Craft
              </p>
              <h2 className="mt-3 font-playfair text-3xl leading-tight text-[#1F140D] sm:text-4xl lg:text-[2.6rem]">
                From leaf to cup, every blend tells a story.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-[#5c4a3d]">
                At ST Lounge, tea is never just a beverage. It is a moment of
                reflection, a bridge between generations and a celebration of
                nature&apos;s finest ingredients. Every blend begins with
                carefully selected tea leaves and is finished with authentic
                spices, fruits and flavours.
              </p>
              <p className="mt-3 text-base leading-relaxed text-[#5c4a3d]">
                From the strong, golden character of our signature patti to the
                light, refreshing finish of our green teas, we craft each cup to
                bring the soul of tradition into the modern day.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  { icon: ShieldCheck, title: "Quality first", copy: "Carefully selected leaves and ingredients." },
                  { icon: Package, title: "Four pack sizes", copy: "100g, 200g, 500g and 1kg options." },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex gap-3 rounded-xl border border-[#e8e0d8] bg-white/70 p-4"
                  >
                    <item.icon size={18} className="mt-0.5 shrink-0 text-[#9B6322]" />
                    <div>
                      <p className="text-sm font-semibold text-[#1F140D]">{item.title}</p>
                      <p className="mt-1 text-[11px] leading-relaxed text-[#7a6a5c]">
                        {item.copy}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/about"
                className="mt-7 inline-flex items-center gap-2 border-b border-[#C62828] pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1F140D] transition-colors hover:text-[#C62828]"
              >
                Discover our story
                <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Brewing guide ---------------------------------------------- */}
        <section className="bg-[#f5f0eb] py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="mx-auto max-w-3xl text-center"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9B6322] sm:text-xs">
                Brewing Guide
              </p>
              <h2 className="mt-3 font-playfair text-3xl text-[#1F140D] sm:text-4xl lg:text-5xl">
                Your Perfect Cup, Two Ways
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#6b5b4e] sm:text-base">
                Enjoy a comforting traditional chai or a light, refreshing green
                tea — simple steps, beautifully consistent results.
              </p>
            </motion.div>

            <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-8">
              {brewMethods.map((method, methodIndex) => (
                <motion.div
                  key={method.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: methodIndex * 0.1 }}
                  className="rounded-2xl border border-[#e5ddd3] bg-white p-5 shadow-[0_20px_50px_-35px_rgba(31,20,13,0.4)] sm:p-7"
                >
                  <div className="mb-5 flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1a0a00] text-[#E5A122]">
                      <method.icon size={20} />
                    </span>
                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#9B6322]">
                        Method 0{methodIndex + 1}
                      </p>
                      <h3 className="font-playfair text-xl text-[#1F140D] sm:text-2xl">
                        {method.title}
                      </h3>
                    </div>
                  </div>

                  <ol className="space-y-3">
                    {method.steps.map((step, index) => (
                      <li key={step} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#D4A017]/40 bg-[#FBF3E3] text-[10px] font-bold text-[#9B6322]">
                          {index + 1}
                        </span>
                        <p className="text-sm leading-relaxed text-[#5c4a3d]">{step}</p>
                      </li>
                    ))}
                  </ol>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-8 overflow-hidden rounded-2xl border border-[#D4A017]/25 bg-[#1a0a00] p-6 shadow-2xl sm:p-8"
            >
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="max-w-xl">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#E5A122]">
                    Quick reference
                  </p>
                  <h3 className="mt-2 font-playfair text-2xl text-white sm:text-3xl">
                    A little guidance, a much better cup.
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#e8e0d5]/70">
                    Use one teaspoon of tea per cup. For traditional chai, simmer
                    with milk and water. For green tea, steep gently in hot water
                    and skip the milk.
                  </p>
                </div>
                <a
                  href={orderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-sm bg-gradient-to-r from-[#C62828] to-[#B71C1C] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white transition-transform hover:-translate-y-0.5"
                >
                  <MessageCircle size={15} />
                  Ask us on WhatsApp
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Ingredients ------------------------------------------------- */}
        <section className="relative overflow-hidden bg-[#1a0a00] py-16 text-white sm:py-20 lg:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,160,23,0.12),transparent_40%)]" />
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="mx-auto max-w-3xl text-center"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#E5A122] sm:text-xs">
                The Ingredients
              </p>
              <h2 className="mt-3 font-playfair text-3xl text-[#D4A017] sm:text-4xl lg:text-5xl">
                Purity in Every Grain
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/60 sm:text-base">
                Selected from the finest estates and spice markets for our
                signature blends and flavoured teas.
              </p>
            </motion.div>

            <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-5">
              {ingredients.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="group relative h-60 overflow-hidden rounded-2xl border border-white/10 shadow-xl transition-transform duration-300 hover:-translate-y-1.5 sm:h-72 md:h-80"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 20vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a0a00] via-[#1a0a00]/55 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#D4A017]/40 bg-[#1a0a00]/70 font-playfair text-xs italic text-[#E5A122] backdrop-blur-sm">
                      {index + 1}
                    </span>
                    <h3 className="mt-2 font-playfair text-lg text-white sm:text-xl">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-[10px] leading-relaxed text-white/55 sm:text-xs">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Quote ------------------------------------------------------- */}
        <section className="bg-[#faf7f2] px-4 py-16 text-center sm:px-6 sm:py-20 lg:py-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mx-auto max-w-3xl"
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#D4A017]/35 bg-[#1a0a00] shadow-xl sm:h-24 sm:w-24">
              <Image
                src="/newlogo.png"
                alt="ST Lounge logo"
                width={72}
                height={72}
                className="h-14 w-14 object-contain sm:h-16 sm:w-16"
              />
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9B6322]">
              From our lounge to your cup
            </p>
            <h2 className="mt-4 font-playfair text-2xl leading-relaxed text-[#1F140D] sm:text-3xl lg:text-[2.1rem]">
              &quot;From the first crackle of spices to the steam rising from
              your favourite cup, we invite you to pause, breathe and savour the
              art of a truly good cup of tea.&quot;
            </h2>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#9B6322]">
              {SITE_NAME} · A World of Tea &amp; Flavours
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={orderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-gradient-to-r from-[#C62828] to-[#B71C1C] px-6 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white shadow-lg transition-transform hover:-translate-y-0.5"
              >
                <MessageCircle size={15} />
                Order on WhatsApp
              </a>
              <span className="text-[11px] text-[#7a6a5c]">
                {WHATSAPP_DISPLAY} · {SITE_TAGLINE}
              </span>
            </div>
          </motion.div>
        </section>

        <Footer />
      </main>
    </>
  );
}
