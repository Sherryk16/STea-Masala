"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// WhatsApp number
const WHATSAPP_NUMBER = "923343747649";
const WHATSAPP_MESSAGE = encodeURIComponent("Hello! I'd like to order Steam Masala Tea.");
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

// Product images for slider
const productImages = [
  "/WhatsApp Image 2026-04-08 at 11.13.42 PM.jpeg",
  "/WhatsApp Image 2026-04-08 at 11.13.42 PM (1).jpeg",
  "/WhatsApp Image 2026-04-08 at 11.13.42 PM (2).jpeg",
];

function ProductImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % productImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => setCurrentIndex(index);
  const goPrev = () => setCurrentIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  const goNext = () => setCurrentIndex((prev) => (prev + 1) % productImages.length);

  return (
    <div className="relative h-full w-full">
      {productImages.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-700 ${index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        >
          <Image src={src} alt={`Steam Masala Tea - View ${index + 1}`} fill className="object-contain p-4 sm:p-6" />
        </div>
      ))}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {productImages.map((_, index) => (
          <button key={index} onClick={() => goToSlide(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-[#C62828] w-8" : "bg-[#1F140D]/30 w-2.5 hover:bg-[#1F140D]/50"}`}
          />
        ))}
      </div>
      <button onClick={goPrev} className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all hidden md:flex">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5 text-[#1F140D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      <button onClick={goNext} className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all hidden md:flex">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5 text-[#1F140D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
      </button>
    </div>
  );
}

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } } };

  const ingredients = [
    { name: "Cardamom", desc: "Green, aromatic pods from Kerala", image: "/cardamom.png" },
    { name: "Cinnamon", desc: "Sweet, woody bark from Ceylon", image: "/cinnamon.png" },
    { name: "Saffron", desc: "Golden threads of pure luxury", image: "/saffron.png" },
    { name: "Star Anise", desc: "Licorice notes of star anise", image: "/star anise.png" },
    { name: "Tea Leaves", desc: "High-altitude Assam black tea", image: "/tealeaves.png" },
  ];

  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Stea Masala",
            "alternateName": ["Steam Masala", "Stea Masala Tea"],
            "description": "Premium masala tea crafted with natural spices: cardamom, cinnamon, saffron & high-altitude Assam black tea.",
            "url": "https://steamasala.com",
            "telephone": "+92-334-3747649",
            "priceRange": "Rs. 475",
            "areaServed": "Pakistan",
            "sameAs": [
              "https://www.instagram.com/steamasala_official",
              "https://www.tiktok.com/@steamasala",
              "https://www.facebook.com/share/1BV2QGEcsR/"
            ],
            "makesOffer": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Product",
                  "name": "Steam Masala Tea",
                  "description": "Premium masala tea blend with high-altitude Assam black tea, green cardamom, Ceylon cinnamon, star anise, saffron threads, cloves, and black pepper.",
                  "image": "https://steamasala.com/WhatsApp Image 2026-04-08 at 11.13.42 PM.jpeg",
                  "offers": {
                    "@type": "AggregateOffer",
                    "priceCurrency": "PKR",
                    "lowPrice": "475",
                    "highPrice": "500",
                    "offerCount": "1"
                  }
                }
              }
            ]
          }),
        }}
      />
      <main ref={containerRef} className="relative bg-[#Faf7f2] font-inter selection:bg-[#E5A122] selection:text-[#1F140D]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[65vh] md:min-h-[93vh] xl:min-h-[100vh] flex items-center overflow-hidden bg-[#1a0a00] pt-20 sm:pt-24 pb-12 sm:pb-16">
        <div className="absolute inset-0 z-0">
          <Image src="/herobg.png" alt="Masala Tea Background" fill className="object-cover object-right" priority />
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#1a0a00] via-[#1a0a00]/80 to-transparent lg:via-[#1a0a00]/40" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-left max-w-xl">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease: "easeOut" }}
              className="inline-block py-1.5 px-4 sm:px-5 mb-4 sm:mb-6 xl:mb-5 border border-[#D4A017]/30 rounded-full bg-[#D4A017]/10 text-[#D4A017] tracking-widest text-[10px] sm:text-xs xl:text-xs font-semibold uppercase backdrop-blur-md shadow-[0_0_15px_rgba(212,160,23,0.2)]">
              Time-Honored Heritage Blend
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl xl:text-5xl font-playfair font-bold text-white mb-3 sm:mb-5 xl:mb-4 leading-[1.2] sm:leading-[1.15] drop-shadow-xl">
              The Soul of<br />Tradition in a<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4A017] to-[#FF6F00] italic drop-shadow-[0_0_10px_rgba(212,160,23,0.5)]">Modern Cup</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }}
              className="text-white/80 text-sm sm:text-base md:text-lg xl:text-base font-light mb-6 sm:mb-8 xl:mb-6 leading-relaxed drop-shadow-md">
              Experience our flagship Masala Tea leaves. A premium, time-honored recipe crafted with natural ingredients, measured to precise grammage to ensure the perfect equilibrium of spice and leaf.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }}>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 sm:gap-3 xl:gap-2 bg-gradient-to-r from-[#C62828] to-[#B71C1C] text-white px-5 sm:px-7 xl:px-6 py-2.5 sm:py-3.5 xl:py-3 rounded shadow-[0_0_30px_rgba(198,40,40,0.4)] hover:shadow-[0_0_40px_rgba(198,40,40,0.6)] hover:-translate-y-1 transition-all text-xs sm:text-sm xl:text-sm font-bold tracking-widest uppercase">
                Order Your Pack
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Showcase Section */}
      <section className="py-16 sm:py-24 lg:py-32 xl:py-24 px-4 sm:px-6 bg-[#Faf7f2] relative">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-10 sm:mb-16 xl:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-5xl xl:text-4xl font-playfair text-[#1F140D] mb-3 sm:mb-4 xl:mb-3">Shop Now</h2>
            <p className="text-[#1F140D]/70 text-base sm:text-lg xl:text-base max-w-2xl mx-auto">Premium masala tea crafted with natural ingredients. Swipe through to see every angle.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="bg-white rounded-xl overflow-hidden shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative h-[300px] sm:h-[400px] md:h-[500px] xl:h-[420px] bg-[#f5f0eb]">
                <ProductImageSlider />
              </div>
              <div className="p-6 sm:p-8 md:p-12 xl:p-8 flex flex-col justify-center">
                <div className="inline-block py-1.5 px-4 mb-3 sm:mb-4 xl:mb-3 border border-[#D4A017]/30 rounded-full bg-[#D4A017]/10 text-[#D4A017] tracking-widest text-[10px] sm:text-xs xl:text-[10px] font-semibold uppercase w-fit">
                  Our Signature Product
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl xl:text-3xl font-playfair text-[#1F140D] mb-2 sm:mb-3 xl:mb-2">Steam Masala Tea</h3>
                <div className="flex items-center gap-2 sm:gap-3 xl:gap-2 mb-3 sm:mb-4 xl:mb-3 flex-wrap">
                  <span className="text-2xl sm:text-3xl xl:text-2xl font-bold text-[#C62828]">Rs. 475</span>
                  <span className="text-base sm:text-xl xl:text-base text-[#1F140D]/40 line-through">Rs. 500</span>
                  <span className="bg-[#25D366] text-white text-xs px-2 py-1 rounded font-semibold">5% OFF</span>
                </div>
                <p className="text-[#1F140D]/50 text-xs sm:text-sm xl:text-xs mb-4 sm:mb-6 xl:mb-4">200g Pack</p>
                <p className="text-[#1F140D]/70 text-xs sm:text-sm xl:text-xs leading-relaxed mb-4 sm:mb-6 xl:mb-4">
                  Our flagship blend crafted with high-altitude Assam black tea, green cardamom, Ceylon cinnamon, star anise, saffron threads, cloves, and black pepper. Every pouch is precision-blended to deliver the perfect cup every time.
                </p>
                <div className="space-y-2 sm:space-y-3 xl:space-y-2 mb-6 sm:mb-8 xl:mb-6">
                  {["100% Natural Ingredients", "Premium High-Altitude Tea Leaves", "Precision-Blended Recipe"].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 sm:gap-3 xl:gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5 xl:w-4 xl:h-4 text-[#25D366] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                      <span className="text-[#1F140D]/70 text-xs sm:text-sm xl:text-xs">{item}</span>
                    </div>
                  ))}
                </div>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 sm:gap-3 xl:gap-2 bg-gradient-to-r from-[#C62828] to-[#B71C1C] text-white py-3 sm:py-4 xl:py-3 px-6 sm:px-8 xl:px-6 rounded font-semibold tracking-wider uppercase text-xs sm:text-sm xl:text-xs hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5 xl:w-4 xl:h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  Order Now on WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Philosophy / The Blend */}
      <section className="py-16 sm:py-24 lg:py-32 xl:py-24 px-4 sm:px-6 bg-[#Faf7f2] relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 xl:gap-12 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
            className="relative h-[400px] sm:h-[500px] lg:h-[600px] xl:h-[480px] rounded-sm overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-[#C62828]/30 to-transparent z-10" />
            <img src="/ingredient.png" alt="Masala Tea Ingredients" className="w-full h-full object-cover object-center" />
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}>
            <h2 className="text-[#D4A017] tracking-widest uppercase text-xs sm:text-sm xl:text-xs font-semibold mb-2 sm:mb-3 xl:mb-2">Our Time-Honored Recipe</h2>
            <h3 className="text-2xl sm:text-3xl md:text-4xl xl:text-3xl font-playfair text-[#1F140D] mb-4 sm:mb-6 xl:mb-4 leading-tight">
              A symphony of saffron, cardamom, and authentic tradition.
            </h3>
            <p className="text-[#1F140D]/70 text-base sm:text-lg xl:text-base leading-relaxed mb-4 sm:mb-6 xl:mb-4">
              Our single flagship blend isn't just mixed; it's composed. We dedicate all our passion into this one perfect recipe.
            </p>
            <p className="text-[#1F140D]/70 text-base sm:text-lg xl:text-base leading-relaxed mb-6 sm:mb-8 xl:mb-6">
              By sourcing high-altitude tea leaves and combining them with the world's most aromatic spices, we've created a sensory journey that warms from the inside out. Every sip reveals nature's touch.
            </p>
            <a href="/about" className="border-b-2 border-[#C62828] text-[#1F140D] font-semibold pb-1 hover:text-[#C62828] transition-colors uppercase tracking-wider text-xs sm:text-sm xl:text-xs inline-flex items-center gap-2">
              Discover Our Story
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </a>
          </motion.div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="py-16 sm:py-24 lg:py-32 xl:py-24 px-4 sm:px-6 bg-[#Faf7f2] relative">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-10 sm:mb-16 xl:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-5xl xl:text-4xl font-playfair text-[#1F140D] mb-3 sm:mb-4 xl:mb-3">How to Prepare Your Perfect Cup</h2>
            <p className="text-[#1F140D]/70 text-base sm:text-lg xl:text-base max-w-2xl mx-auto">Follow these simple steps to brew an authentic cup of Steam Masala chai every time.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 xl:gap-6">
            {[
              { step: "1", title: "Measure the Masala", desc: <>For each cup of chai, measure out <strong>1 tablespoon</strong> of Steam Masala blend.</>, border: "border-[#C62828]", icon: <><path d="M8 2v4"/><path d="M16 2v4"/><path d="M3 10h18"/><path d="M18 14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2Z"/><path d="M3 14h18v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4Z"/></> },
              { step: "2", title: "Add to Water", desc: <>Add the Steam Masala to <strong>one cup of water</strong> in your pot or saucepan.</>, border: "border-[#D4A017]", icon: <><path d="M12 2v6"/><path d="M12 18a6 6 0 0 0 6-6V8l-6-6-6 6v4a6 6 0 0 0 6 6Z"/><path d="M20 12a8 8 0 0 1-16 0"/></> },
              { step: "3", title: "Brew Like Normal Chai", desc: <>Bring to a boil and let it simmer. <strong>Leave it in</strong> to allow the flavors to infuse fully.</>, border: "border-[#C62828]", icon: <><path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12 10 10 0 0 1 12 2Z"/><path d="M12 6v6l4 2"/></> },
              { step: "4", title: "Mix & Enjoy", desc: <><strong>Mix well</strong> and strain into your favorite cup. Add milk and sugar to taste. Enjoy!</>, border: "border-[#D4A017]", icon: <><path d="M8 2h8l2 10H6L8 2Z"/><path d="M6 12v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6"/><path d="M12 20v2"/><path d="M8 22h8"/></> },
            ].map((item, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                className={`group bg-white rounded-lg p-6 sm:p-8 xl:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-t-4 ${item.border}`}>
                <div className={`w-14 h-14 sm:w-16 sm:h-16 xl:w-14 xl:h-14 ${item.border.replace("border-", "bg-[")}/80 rounded-full flex items-center justify-center mb-4 sm:mb-6 xl:mb-4 mx-auto`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 sm:w-8 sm:h-8 xl:w-7 xl:h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {item.icon}
                  </svg>
                </div>
                <div className="text-center">
                  <div className={`${item.border.replace("border-", "text-")} font-bold text-xs sm:text-sm xl:text-xs tracking-widest uppercase mb-1 sm:mb-2 xl:mb-1`}>Step {item.step}</div>
                  <h3 className="text-lg sm:text-xl xl:text-lg font-playfair text-[#1F140D] mb-2 sm:mb-3 xl:mb-2">{item.title}</h3>
                  <p className="text-[#1F140D]/70 text-xs sm:text-sm xl:text-xs leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Reference Card */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
            className="mt-10 sm:mt-16 xl:mt-12 bg-[#1a0a00] text-white rounded-lg p-6 sm:p-8 md:p-12 xl:p-8 text-center shadow-2xl">
            <h3 className="text-xl sm:text-2xl md:text-3xl xl:text-2xl font-playfair text-[#D4A017] mb-4 sm:mb-6 xl:mb-4">Quick Reference</h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-12 xl:gap-8 text-base sm:text-lg xl:text-base">
              {[
                { num: "1", label: "1 Cup Chai", sub: "Per serving", bg: "bg-[#C62828]" },
                { symbol: "+", type: "symbol" },
                { num: "1", label: "1 Tbsp Steam Masala", sub: "Per cup", bg: "bg-[#D4A017]", textDark: true },
                { symbol: "=", type: "symbol" },
                { icon: <path d="M18.5 3H6a1 1 0 0 0-1 1v10.5A3.5 3.5 0 0 0 8.5 18h8a3.5 3.5 0 0 0 3.5-3.5V4a1 1 0 0 0-1-1zM6 21h12v2H6z"/>, label: "Perfect Masala Chai", sub: "Ready to enjoy", bg: "bg-[#C62828]" },
              ].map((item, i) => (
                item.type === "symbol" ? (
                  <div key={i} className="text-[#D4A017] text-xl sm:text-2xl font-bold">{item.symbol}</div>
                ) : (
                  <div key={i} className="flex items-center gap-2 sm:gap-3 xl:gap-2">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 xl:w-10 xl:h-10 ${item.bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                      {item.icon ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:w-6 sm:h-6 xl:w-5 xl:h-5 text-white" viewBox="0 0 24 24" fill="currentColor">{item.icon}</svg>
                      ) : (
                        <span className={`font-bold ${item.textDark ? "text-[#1a0a00]" : "text-white"} text-sm sm:text-base xl:text-sm`}>{item.num}</span>
                      )}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-xs sm:text-base xl:text-xs">{item.label}</div>
                      <div className="text-white/60 text-xs">{item.sub}</div>
                    </div>
                  </div>
                )
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Ingredients Section */}
      <section className="py-16 sm:py-24 xl:py-20 bg-[#1a0a00] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-10 sm:mb-16 xl:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-5xl xl:text-4xl font-playfair text-[#D4A017]">Purity in Every Grain</h2>
            <p className="mt-3 sm:mt-4 xl:mt-3 text-white/60 text-sm sm:text-base xl:text-sm">Selected from the finest estates worldwide for our signature blend.</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 xl:gap-3">
            {ingredients.map((item, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                className="relative group p-4 sm:p-6 xl:p-4 h-60 sm:h-72 md:h-80 xl:h-64 flex flex-col justify-end rounded-sm hover:-translate-y-2 transition-transform duration-300 shadow-xl overflow-hidden">
                <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a0a00] via-[#1a0a00]/60 to-transparent" />
                <div className="relative z-10">
                  <div className="bg-[#1a0a00]/80 backdrop-blur-sm w-8 h-8 sm:w-10 sm:h-10 xl:w-8 xl:h-8 rounded-full flex items-center justify-center mb-2 sm:mb-4 xl:mb-2 border border-[#D4A017]/30 text-[#D4A017] font-playfair italic text-xs sm:text-sm xl:text-xs">
                    {idx + 1}
                  </div>
                  <h4 className="font-playfair text-base sm:text-xl xl:text-base mb-1 sm:mb-2 xl:mb-1 text-white">{item.name}</h4>
                  <p className="text-[10px] sm:text-xs xl:text-[10px] text-white/60">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote / Experience */}
      <section className="py-16 sm:py-24 lg:py-32 xl:py-24 bg-[#Faf7f2] relative px-4 sm:px-6 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="max-w-3xl mx-auto">
          <img src="https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?q=80&w=400&auto=format&fit=crop"
            className="w-16 h-16 sm:w-20 sm:h-20 xl:w-16 xl:h-16 mx-auto mb-6 sm:mb-8 xl:mb-6 opacity-30 rounded-full object-cover border-2 border-[#D4A017]/20" alt="Steaming tea cup" />
          <h2 className="text-xl sm:text-2xl md:text-3xl xl:text-2xl font-playfair leading-relaxed text-[#1F140D] mb-4 sm:mb-6 xl:mb-4">
            "From the first crackle of spices in the pot to the steam rising from your favorite ceramic mug, we invite you to pause, breathe, and savor the artisanal depth of true masala tea."
          </h2>
          <p className="text-[#D4A017] font-semibold tracking-widest uppercase text-xs sm:text-sm">Stea Masala</p>
        </motion.div>
      </section>

      <Footer />
    </main>
    </>
  );
}
