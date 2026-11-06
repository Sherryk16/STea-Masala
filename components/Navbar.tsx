"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag } from "lucide-react";

import { SITE_NAME, whatsappUrl } from "@/lib/site";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Collection", href: "/#products" },
    { name: "Price List", href: "/#price-list" },
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 z-50 w-full transition-colors duration-300 ${
        isScrolled || isMobileMenuOpen
          ? "border-b border-[#D4A017]/15 bg-[#1a0a00]/95 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6">
        {/* Logo */}
        <Link href="/" className="z-50 flex flex-shrink-0 items-center" aria-label={`${SITE_NAME} home`}>
          <div className="relative h-[50px] w-[128px] sm:h-[64px] sm:w-[165px] lg:w-[190px]">
            <Image
              src="/newlogo.png"
              alt={`${SITE_NAME} logo`}
              fill
              priority
              sizes="190px"
              className="object-contain"
            />
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-5 md:flex lg:gap-7 xl:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[11px] font-medium uppercase tracking-[0.17em] text-white/75 transition-colors hover:text-[#D4A017] lg:text-xs"
            >
              {link.name}
            </Link>
          ))}
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 flex items-center gap-2 rounded-sm bg-gradient-to-r from-[#C62828] to-[#B71C1C] px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white shadow-[0_10px_24px_-14px_rgba(198,40,40,0.9)] transition-transform hover:-translate-y-0.5 lg:px-5 lg:text-[11px]"
          >
            <ShoppingBag size={15} />
            Order Now
          </a>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
          className="z-50 rounded-full border border-white/15 bg-white/5 p-2 text-white md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute left-0 top-0 z-40 flex h-screen w-full flex-col items-center justify-center space-y-6 bg-[#1a0a00] px-6"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(198,40,40,0.12),transparent_45%)]" />
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative z-10 font-playfair text-2xl text-[#D4A017] transition-colors hover:text-white"
              >
                {link.name}
              </Link>
            ))}
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative z-10 mt-4 flex items-center gap-2 rounded-sm bg-gradient-to-r from-[#C62828] to-[#B71C1C] px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white"
            >
              <ShoppingBag size={18} />
              Order Now
            </a>
            <p className="relative z-10 text-[10px] uppercase tracking-[0.2em] text-white/35">
              {SITE_NAME} · Premium tea collection
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
