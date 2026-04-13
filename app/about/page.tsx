"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function About() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
  };

  return (
    <main className="relative bg-[#Faf7f2] font-inter selection:bg-[#E5A122] selection:text-[#1F140D] min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 sm:pt-36 xl:pt-32 pb-16 sm:pb-24 xl:pb-16 bg-[#1a0a00] text-center px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1563822249366-3efb23b8e0c9?q=80&w=1800&auto=format&fit=crop"
            alt="Traditional tea plantation"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a0a00] via-[#1a0a00]/80 to-[#1a0a00]" />
        </div>

        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1 }}
           className="max-w-4xl mx-auto mt-8 sm:mt-16 xl:mt-12 relative z-10"
        >
          <span className="text-[#D4A017] tracking-widest text-xs font-semibold uppercase mb-4 xl:mb-3 block">Our Heritage</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-4xl font-playfair font-bold text-white mb-4 sm:mb-6 xl:mb-4 leading-tight px-2">
             The Story of Stea Masala
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto text-base sm:text-lg xl:text-base font-light px-4">
             Born from a desire to preserve the rich, complex history of traditional tea making, while presenting it in a form fit for the modern connoisseur.
          </p>
        </motion.div>
      </section>

      {/* Image Gallery */}
      <section className="py-12 sm:py-16 xl:py-12 px-4 sm:px-6 bg-[#1a0a00]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 xl:gap-4">
          {[
            { src: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?q=80&w=800&auto=format&fit=crop", alt: "Tea leaves drying" },
            { src: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?q=80&w=800&auto=format&fit=crop", alt: "Spices and tea brewing" },
            { src: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=800&auto=format&fit=crop", alt: "Traditional tea preparation" },
          ].map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative h-60 sm:h-72 md:h-80 xl:h-64 rounded-sm overflow-hidden shadow-2xl group"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#C62828]/40 to-transparent" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-16 sm:py-24 xl:py-20 px-4 sm:px-6 bg-[#Faf7f2]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="text-center mb-8 sm:mb-12 xl:mb-10">
              <span className="text-[#D4A017] tracking-widest text-xs font-semibold uppercase">Meet the Founder</span>
              <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl xl:text-3xl text-[#1F140D] mt-3">The Heart Behind Stea Masala</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 xl:gap-12 items-center">
              {/* Founder Image */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="relative h-[350px] sm:h-[400px] xl:h-[380px] rounded-lg overflow-hidden shadow-2xl flex justify-center"
              >
                <img
                  src="/founder.png"
                  alt="Sadaf - Founder of Stea Masala"
                  className="h-full w-auto object-cover object-[center_0%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a0a00]/30 to-transparent" />
              </motion.div>

              {/* Founder Story */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="space-y-4 sm:space-y-6 xl:space-y-5"
              >
                <div>
                  <h3 className="font-playfair text-2xl sm:text-3xl xl:text-2xl text-[#1F140D] mb-2">Sadaf</h3>
                  <p className="text-[#C62828] font-semibold text-sm sm:text-base xl:text-sm uppercase tracking-wide">Founder & Creator</p>
                </div>

                <div className="w-16 h-1 bg-[#D4A017] rounded" />

                <p className="text-[#1F140D]/80 text-base sm:text-lg xl:text-base leading-relaxed">
                  I spent years in the corporate world at Standard Chartered, building a career that looked perfect on paper. But behind every spreadsheet and boardroom meeting, my mind kept wandering back to the kitchen—to the rich aroma of spices simmering in a pot of chai, to the warmth of tradition that no café chain could ever replicate.
                </p>

                <p className="text-[#1F140D]/80 text-base sm:text-lg xl:text-base leading-relaxed">
                  So I made a choice. I left it all behind to create something real. In 2024, Stea Masala was born—not as a business, but as a promise. A promise that every blend would be homemade with care, every ingredient sourced with intention, and every cup would carry the depth of a legacy worth preserving.
                </p>

                <p className="text-[#1F140D]/80 text-base sm:text-lg xl:text-base leading-relaxed">
                  This isn't just tea. It's a movement. I built Stea Masala to prove that women don't need permission to rewrite their stories. When we lift each other up, invest in each other's dreams, and refuse to settle—there's no limit to what we can build.
                </p>

                <div className="pt-4 sm:pt-6 xl:pt-4">
                  <div className="bg-[#D4A017]/10 border-l-4 border-[#D4A017] p-4 sm:p-5 xl:p-4 rounded-r-lg">
                    <p className="text-[#1F140D]/90 italic text-sm sm:text-base xl:text-sm font-medium">
                      "I traded financial returns for flavor, and I've never looked back. The best ventures aren't funded by capital—they're fueled by conviction."
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 sm:pt-6 xl:pt-4">
                  <div className="bg-[#C62828] text-white px-3 py-2 rounded font-semibold text-xs uppercase tracking-wide">
                    Est. 2024
                  </div>
                  <div className="bg-[#D4A017] text-[#1a0a00] px-3 py-2 rounded font-semibold text-xs uppercase tracking-wide">
                    Female Founded
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 sm:py-24 xl:py-20 px-4 sm:px-6 max-w-4xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="max-w-none text-[#1F140D]/80">
          <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl xl:text-3xl text-[#1F140D] mb-4 sm:mb-8 xl:mb-5">The Philosophy</h2>
          <p className="mb-4 sm:mb-6 xl:mb-4 leading-relaxed text-sm sm:text-base xl:text-sm">
            At Stea Masala, we believe that tea is never just a beverage. It is a moment of reflection, a bridge between generations, and a testament to the earth's natural bounties. Our journey began with a single question: <i>How do we capture the true essence of a time-honored masala chai?</i>
          </p>
          <p className="mb-8 sm:mb-12 xl:mb-8 leading-relaxed text-sm sm:text-base xl:text-sm">
            The answer lay not in mass production, but in the meticulous craft of balancing ingredients. We scoured the finest estates and spice markets to source our core elements: Cardamom from Kerala, Cinnamon from Ceylon, and pure Saffron threads. Every pouch of Stea Masala is a composed symphony, ensuring that every grain serves a purpose.
          </p>

          <div className="relative bg-[#1a0a00] text-center py-10 sm:py-16 xl:py-12 px-4 sm:px-8 xl:px-6 rounded-sm shadow-2xl my-10 sm:my-16 xl:my-12 overflow-hidden">
             <img
               src="https://images.unsplash.com/photo-1523920290228-4f22013f577f?q=80&w=1200&auto=format&fit=crop"
               alt="Tea garden background"
               className="absolute inset-0 w-full h-full object-cover opacity-20"
             />
             <div className="relative z-10">
               <h3 className="font-playfair text-xl sm:text-2xl md:text-3xl xl:text-2xl font-bold text-[#D4A017] mb-2 sm:mb-4 xl:mb-2">"Nature's touch in every sip"</h3>
               <p className="text-white/70 tracking-widest uppercase text-xs">Our Promise</p>
             </div>
          </div>

          <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl xl:text-3xl text-[#1F140D] mb-4 sm:mb-8 xl:mb-5">The Craft</h2>
          <p className="mb-4 sm:mb-6 xl:mb-4 leading-relaxed text-sm sm:text-base xl:text-sm">
            What makes our single proprietary blend unique is the exact grammage measurement used during processing. We do not believe in random assortments. We employ a precision-based blending technique that locks in the essential oils of the spices along with the tannins of the high-altitude Assam black tea.
          </p>
          <p className="mb-6 xl:mb-5 leading-relaxed text-sm sm:text-base xl:text-sm">
            When you open a pouch of our "Time-Honored" mix, you aren't just greeted by an aroma—you are greeted by history. The rich reds, the golden hues, the unmistakable scent of true Indian masala tea.
          </p>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
