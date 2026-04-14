"use client";

import Link from "next/link";
import Image from "next/image";
import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "923343747649";
const WHATSAPP_MESSAGE = encodeURIComponent("Hello! I'd like to order Stea Masala Tea.");
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#1a0a00] text-white pt-16 sm:pt-24 pb-8 sm:pb-12 xl:pt-16 xl:pb-8 border-t border-[#D4A017]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 xl:gap-6 mb-10 sm:mb-16 xl:mb-10">
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4 sm:mb-6 xl:mb-4">
              <div className="relative w-[120px] h-[45px] sm:w-[160px] sm:h-[60px] xl:w-[120px] xl:h-[45px]">
                <Image src="/logo.png" alt="Masala Tea Logo" fill className="object-contain" />
              </div>
            </Link>
            <p className="text-white/70 leading-relaxed max-w-sm mb-6 sm:mb-8 xl:mb-5 text-sm sm:text-base xl:text-xs">
              Premium masala tea crafted with natural ingredients, bringing the soul of tradition to your modern cup. Every batch is measured to precise grammage to ensure the perfect equilibrium of spice and leaf.
            </p>
            <div className="flex space-x-3 sm:space-x-4 xl:space-x-3">
              <a
                href="https://www.instagram.com/steamasala_official?igsh=bGxicnk3bXYzZGR4"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 xl:w-8 xl:h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-gradient-to-tr hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#F77737] hover:text-white transition-all text-white/70"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a
                href="https://www.tiktok.com/@steamasala?_r=1&_t=ZS-95NEUiDSXZc"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 xl:w-8 xl:h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-black hover:text-white transition-all text-white/70"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.18 8.18 0 0 0 4.76 1.52V6.84a4.85 4.85 0 0 1-1-.15z"/></svg>
              </a>
              <a
                href="https://www.facebook.com/share/1BV2QGEcsR/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 xl:w-8 xl:h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-all text-white/70"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg>
              </a>
            </div>
          </div>

          {/* Links Col */}
          <div>
            <h3 className="text-base sm:text-lg xl:text-base font-playfair font-semibold mb-4 sm:mb-6 xl:mb-4 tracking-wide text-white">Explore</h3>
            <ul className="space-y-3 sm:space-y-4 xl:space-y-3">
              <li><Link href="/" className="text-white/60 hover:text-[#E5A122] transition-colors text-sm sm:text-base xl:text-sm">Home</Link></li>
              <li><Link href="/about" className="text-white/60 hover:text-[#E5A122] transition-colors text-sm sm:text-base xl:text-sm">About Us</Link></li>
              <li><Link href="/contact" className="text-white/60 hover:text-[#E5A122] transition-colors text-sm sm:text-base xl:text-sm">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h3 className="text-lg xl:text-base font-playfair font-semibold mb-6 xl:mb-4 tracking-wide text-white">Get In Touch</h3>
            <div className="text-white/60 mb-6 xl:mb-4 text-sm xl:text-xs flex flex-col space-y-3 xl:space-y-2">
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#25D366] transition-colors">
                <MessageCircle size={20} className="text-[#25D366] xl:w-4 xl:h-4" />
                0334-3747649 / 0334-8882643
              </a>
              <a href="mailto:steamasala@gmail.com" className="flex items-center gap-3 hover:text-[#EA4335] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-[#EA4335] xl:w-4 xl:h-4"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg>
                steamasala@gmail.com
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 xl:pt-5 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-3 xl:gap-2 text-[10px] xl:text-[10px] text-white/40">
          <p>&copy; {new Date().getFullYear()} Stea Masala. All rights reserved.</p>
          <div className="flex space-x-6 xl:space-x-4">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
