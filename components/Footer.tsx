"use client";

import Link from "next/link";
import Image from "next/image";
import { MessageCircle } from "lucide-react";

import {
  SITE_NAME,
  WHATSAPP_DISPLAY,
  WHATSAPP_SECONDARY_DISPLAY,
  whatsappUrl,
} from "@/lib/site";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="border-t border-[#D4A017]/15 bg-[#1a0a00] pb-8 pt-16 text-white sm:pb-10 sm:pt-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 grid grid-cols-1 gap-10 sm:mb-14 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="mb-5 inline-block" aria-label={`${SITE_NAME} home`}>
              <div className="relative h-[52px] w-[135px] sm:h-[64px] sm:w-[165px]">
                <Image
                  src="/newlogo.png"
                  alt={`${SITE_NAME} logo`}
                  fill
                  sizes="165px"
                  className="object-contain"
                />
              </div>
            </Link>
            <p className="mb-6 max-w-md text-sm leading-relaxed text-white/60">
              {SITE_NAME} is a world of tea &amp; flavours. From the strong,
              golden character of Golden Patti to refreshing green teas and
              aromatic traditional blends, every cup is crafted to bring
              tradition into the modern day.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://www.instagram.com/steamasala_official?igsh=bGxicnk3bXYzZGR4"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${SITE_NAME} on Instagram`}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all hover:border-transparent hover:bg-gradient-to-tr hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#F77737] hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a
                href="https://www.tiktok.com/@steamasala?_r=1&_t=ZS-95NEUiDSXZc"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${SITE_NAME} on TikTok`}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all hover:border-transparent hover:bg-black hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.18 8.18 0 0 0 4.76 1.52V6.84a4.85 4.85 0 0 1-1-.15z"/></svg>
              </a>
              <a
                href="https://www.facebook.com/share/1BV2QGEcsR/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${SITE_NAME} on Facebook`}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all hover:border-transparent hover:bg-[#1877F2] hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg>
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="mb-4 font-playfair text-base font-semibold tracking-wide text-white sm:mb-5">
              Explore
            </h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-sm text-white/60 transition-colors hover:text-[#E5A122]">Home</Link></li>
              <li><Link href="/#products" className="text-sm text-white/60 transition-colors hover:text-[#E5A122]">Shop Collection</Link></li>
              <li><Link href="/#price-list" className="text-sm text-white/60 transition-colors hover:text-[#E5A122]">Price List</Link></li>
              <li><Link href="/about" className="text-sm text-white/60 transition-colors hover:text-[#E5A122]">About Us</Link></li>
              <li><Link href="/blog" className="text-sm text-white/60 transition-colors hover:text-[#E5A122]">Blog</Link></li>
              <li><Link href="/contact" className="text-sm text-white/60 transition-colors hover:text-[#E5A122]">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-playfair text-base font-semibold tracking-wide text-white sm:mb-5">
              Get In Touch
            </h3>
            <div className="flex flex-col space-y-3 text-sm text-white/60">
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 transition-colors hover:text-[#25D366]"
              >
                <MessageCircle size={18} className="mt-0.5 shrink-0 text-[#25D366]" />
                <span>
                  {WHATSAPP_DISPLAY} / {WHATSAPP_SECONDARY_DISPLAY}
                </span>
              </a>
              <a
                href="mailto:steamasala@gmail.com"
                className="flex items-center gap-3 transition-colors hover:text-[#EA4335]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="shrink-0 text-[#EA4335]"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg>
                steamasala@gmail.com
              </a>
              <p className="pt-2 text-xs leading-relaxed text-white/35">
                Order directly on WhatsApp for the fastest response.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-[10px] uppercase tracking-[0.14em] text-white/35 md:flex-row">
          <p>&copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[#E5A122]">
              Order on WhatsApp
            </a>
            <Link href="/contact" className="transition-colors hover:text-[#E5A122]">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
