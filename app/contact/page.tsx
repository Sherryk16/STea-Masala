"use client";

import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail } from "lucide-react";
import { useState } from "react";

const WHATSAPP_NUMBER = "923343747649";
const WHATSAPP_MESSAGE = encodeURIComponent("Hello! I'd like to order Stea Masala Tea.");
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

export default function Contact() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
  };

  const [formStatus, setFormStatus] = useState<"idle" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("loading");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    fetch("https://formsubmit.co/ajax/steamasala@gmail.com", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        "Accept": "application/json",
      },
      body: JSON.stringify({ 
        _subject: "New Inquiry from Stea Masala Website", 
        ...data,
        _captcha: "false",
        _template: "table",
      }),
    });

    const form = e.currentTarget;
    form.reset();
    setFormStatus("success");
    setTimeout(() => setFormStatus("idle"), 5000);
  };

  return (
    <main className="relative bg-[#Faf7f2] font-inter selection:bg-[#E5A122] selection:text-[#1F140D] min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-36 xl:pt-32 pb-20 xl:pb-16 bg-[#1a0a00] text-center px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=1800&auto=format&fit=crop"
            alt="Tea brewing background"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a0a00] via-[#1a0a00]/70 to-[#1a0a00]" />
        </div>

        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1 }}
           className="max-w-4xl mx-auto mt-8 xl:mt-12 relative z-10"
        >
          <span className="text-[#D4A017] tracking-widest text-xs font-semibold uppercase mb-4 xl:mb-3 block">Reach Out</span>
          <h1 className="text-4xl sm:text-5xl xl:text-4xl font-playfair font-bold text-white mb-6 xl:mb-4 leading-tight">
             Contact Stea Masala
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto text-base sm:text-lg xl:text-base font-light px-2">
             Whether you're looking to place a personal order, inquire about wholesale, or simply talk tea, our sommeliers are here for you.
          </p>
        </motion.div>
      </section>

      {/* Content */}
      <section className="py-16 sm:py-24 xl:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-8">

           {/* Info Boxes */}
           <motion.div initial="hidden" animate="visible" variants={{
             hidden: { opacity: 0 },
             visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
           }} className="space-y-6 xl:space-y-5">
              <motion.div variants={fadeInUp} className="relative bg-white p-6 sm:p-8 xl:p-6 shadow-sm border border-[#E8E0D5] overflow-hidden">
                 <img
                   src="https://images.unsplash.com/photo-1601546763384-43845a2e763b?q=80&w=800&auto=format&fit=crop"
                   alt="WhatsApp ordering"
                   className="absolute inset-0 w-full h-full object-cover opacity-10"
                 />
                 <div className="relative z-10">
                   <div className="w-12 h-12 xl:w-10 xl:h-10 bg-[#25D366]/10 rounded-full flex items-center justify-center mb-4 xl:mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 xl:w-5 xl:h-5 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                   </div>
                   <h3 className="font-playfair text-xl sm:text-2xl xl:text-xl text-[#1F140D] mb-2 xl:mb-1">WhatsApp Order</h3>
                   <p className="text-[#1F140D]/60 mb-4 xl:mb-3 text-sm sm:text-base xl:text-sm">The fastest way to get your pouch. Message us directly and we'll dispatch your order.</p>
                   <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#25D366] hover:text-[#1F140D] transition-colors border-b border-transparent hover:border-[#1F140D] text-sm sm:text-base xl:text-sm">0334-3747649 / 0334-8882643 &rarr;</a>
                 </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="relative bg-white p-6 sm:p-8 xl:p-6 shadow-sm border border-[#E8E0D5] overflow-hidden">
                 <img
                   src="https://images.unsplash.com/photo-1596526131083-e8c633c948d2?q=80&w=800&auto=format&fit=crop"
                   alt="Email contact"
                   className="absolute inset-0 w-full h-full object-cover opacity-10"
                 />
                 <div className="relative z-10">
                   <div className="w-12 h-12 xl:w-10 xl:h-10 bg-[#EA4335]/10 rounded-full flex items-center justify-center mb-4 xl:mb-3">
                      <Mail size={24} className="text-[#EA4335] xl:w-5 xl:h-5" />
                   </div>
                   <h3 className="font-playfair text-xl sm:text-2xl xl:text-xl text-[#1F140D] mb-2 xl:mb-1">Email Us</h3>
                   <p className="text-[#1F140D]/60 mb-4 xl:mb-3 text-sm sm:text-base xl:text-sm">For wholesale inquiries, corporate gifting, or general questions.</p>
                   <a href="mailto:steamasala@gmail.com" className="font-semibold text-[#EA4335] hover:text-[#1F140D] transition-colors border-b border-transparent hover:border-[#1F140D] text-sm sm:text-base xl:text-sm">steamasala@gmail.com &rarr;</a>
                 </div>
              </motion.div>
           </motion.div>

           {/* Contact Form */}
           <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white p-6 sm:p-10 xl:p-8 shadow-sm border border-[#E8E0D5] relative overflow-hidden">
              <h3 className="font-playfair text-2xl sm:text-3xl xl:text-2xl text-[#1F140D] mb-6 sm:mb-8 xl:mb-5">Send a Message</h3>
              
              <AnimatePresence mode="wait">
                {formStatus === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-white p-8 xl:p-6 text-center z-10"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 xl:w-16 xl:h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 xl:mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 sm:w-10 sm:h-10 xl:w-8 xl:h-8 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>
                    </div>
                    <h4 className="text-xl sm:text-2xl xl:text-xl font-playfair text-[#1F140D] mb-2 xl:mb-1">Message Sent!</h4>
                    <p className="text-[#1F140D]/70 text-sm sm:text-base xl:text-sm">Thank you for reaching out. We'll respond within 24 hours.</p>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit} className="space-y-5 xl:space-y-4">
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 xl:gap-4">
                        <div className="space-y-2 xl:space-y-1">
                           <label className="text-xs sm:text-sm xl:text-xs font-semibold tracking-wide text-[#1F140D]/70 uppercase">First Name</label>
                           <input type="text" name="First Name" required className="w-full border-b-2 border-[#1F140D]/20 py-2.5 sm:py-3 xl:py-2 focus:outline-none focus:border-[#C62828] transition-colors bg-transparent placeholder:text-[#1F140D]/30 text-sm sm:text-base xl:text-sm" placeholder="John" />
                        </div>
                        <div className="space-y-2 xl:space-y-1">
                           <label className="text-xs sm:text-sm xl:text-xs font-semibold tracking-wide text-[#1F140D]/70 uppercase">Last Name</label>
                           <input type="text" name="Last Name" required className="w-full border-b-2 border-[#1F140D]/20 py-2.5 sm:py-3 xl:py-2 focus:outline-none focus:border-[#C62828] transition-colors bg-transparent placeholder:text-[#1F140D]/30 text-sm sm:text-base xl:text-sm" placeholder="Doe" />
                        </div>
                     </div>
                     <div className="space-y-2 xl:space-y-1">
                        <label className="text-xs sm:text-sm xl:text-xs font-semibold tracking-wide text-[#1F140D]/70 uppercase">Email Address</label>
                        <input type="email" name="Email" required className="w-full border-b-2 border-[#1F140D]/20 py-2.5 sm:py-3 xl:py-2 focus:outline-none focus:border-[#C62828] transition-colors bg-transparent placeholder:text-[#1F140D]/30 text-sm sm:text-base xl:text-sm" placeholder="john@example.com" />
                     </div>
                     <div className="space-y-2 xl:space-y-1">
                        <label className="text-xs sm:text-sm xl:text-xs font-semibold tracking-wide text-[#1F140D]/70 uppercase">Phone (Optional)</label>
                        <input type="tel" name="Phone" className="w-full border-b-2 border-[#1F140D]/20 py-2.5 sm:py-3 xl:py-2 focus:outline-none focus:border-[#C62828] transition-colors bg-transparent placeholder:text-[#1F140D]/30 text-sm sm:text-base xl:text-sm" placeholder="+92 300 1234567" />
                     </div>
                     <div className="space-y-2 xl:space-y-1">
                        <label className="text-xs sm:text-sm xl:text-xs font-semibold tracking-wide text-[#1F140D]/70 uppercase">Your Message</label>
                        <textarea name="Message" rows={4} required className="w-full border-b-2 border-[#1F140D]/20 py-2.5 sm:py-3 xl:py-2 focus:outline-none focus:border-[#C62828] transition-colors bg-transparent resize-none placeholder:text-[#1F140D]/30 text-sm sm:text-base xl:text-sm" placeholder="I'd like to order..." />
                     </div>
                     <button
                       type="submit"
                       className="w-full py-3 sm:py-4 xl:py-3 font-semibold tracking-widest uppercase transition-all rounded-sm mt-2 shadow-lg text-sm sm:text-base xl:text-sm bg-gradient-to-r from-[#C62828] to-[#B71C1C] hover:from-[#B71C1C] hover:to-[#A01515] hover:shadow-xl shadow-[#C62828]/30 text-white"
                     >
                       Send Message
                     </button>
                     <p className="text-[#1F140D]/40 text-xs text-center mt-2">We'll respond within 24 hours</p>
                  </motion.form>
                )}
              </AnimatePresence>
           </motion.div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
