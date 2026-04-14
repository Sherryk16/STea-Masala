"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag } from "lucide-react";

// WhatsApp number - update this if needed (use international format without +)
const WHATSAPP_NUMBER = "923343747649";
const WHATSAPP_MESSAGE = encodeURIComponent("Hello! I'd like to order Stea Masala Tea.");
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
        isScrolled ? "bg-[#1a0a00]/95 backdrop-blur-md border-b border-[#D4A017]/10" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 md:h-24 xl:h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 z-50 flex items-center">
          <div className="relative w-[100px] h-[40px] sm:w-[130px] sm:h-[50px] md:w-[160px] md:h-[60px] xl:w-[140px] xl:h-[52px]">
             <Image src="/logo.png" alt="Masala Logo" fill className="object-contain" />
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8 lg:space-x-12 xl:space-x-10 items-center">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href}
              className={`text-sm xl:text-[11px] tracking-widest uppercase transition-colors ${isScrolled ? "text-white/80 hover:text-white" : "text-white/80 hover:text-white"}`}>
              {link.name}
            </Link>
          ))}
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 bg-gradient-to-r from-[#C62828] to-[#B71C1C] hover:from-[#B71C1C] hover:to-[#A01515] text-white px-4 lg:px-5 xl:px-4 py-2 lg:py-2.5 xl:py-2 rounded-sm text-xs lg:text-sm xl:text-[11px] tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(198,40,40,0.3)]">
            <ShoppingBag size={16} />
            Order Now
          </a>
        </nav>

        {/* Mobile Toggle */}
        <button className="md:hidden z-50 text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 w-full h-screen bg-[#1a0a00] flex flex-col items-center justify-center space-y-6 sm:space-y-8 z-40"
          >
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)}
                className="text-xl sm:text-2xl font-playfair text-[#D4A017] hover:text-white transition-colors">
                {link.name}
              </Link>
            ))}
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)}
              className="mt-4 sm:mt-8 flex items-center gap-2 bg-gradient-to-r from-[#C62828] to-[#B71C1C] text-white px-6 sm:px-8 py-3 sm:py-3 rounded-sm text-base sm:text-lg tracking-widest uppercase">
              <ShoppingBag size={18} />
              Order Now
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
