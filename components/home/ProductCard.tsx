"use client";

import Image from "next/image";
import { useState } from "react";
import { MessageCircle, Sparkles } from "lucide-react";

import type { ProductCard as ProductCardData } from "@/lib/products/types";
import { formatRupees, formatVariantPrice } from "@/lib/products/display";
import { productWhatsAppUrl } from "@/lib/site";

export default function ProductCard({ product }: { product: ProductCardData }) {
  const variants =
    product.variants.length > 0
      ? product.variants
      : [{ weight: "Standard", price: null as number | null }];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = variants[Math.min(selectedIndex, variants.length - 1)];
  const isOnRequest = selected.price === null;
  const orderUrl = productWhatsAppUrl(product.name, selected.weight);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#D4A017]/25 bg-white shadow-[0_18px_50px_-30px_rgba(31,20,13,0.45)] transition-all duration-300 hover:-translate-y-1 hover:border-[#D4A017]/60 hover:shadow-[0_26px_60px_-30px_rgba(31,20,13,0.55)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#f5f0eb]">
        <div className="absolute inset-0 opacity-60 [background:radial-gradient(circle_at_30%_15%,rgba(212,160,23,0.18),transparent_45%)]" />
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-contain p-5 transition-transform duration-500 group-hover:scale-[1.06] sm:p-7"
        />

        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-4">
          <span className="rounded-full border border-[#D4A017]/35 bg-[#1a0a00]/85 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#D4A017] backdrop-blur-sm sm:text-[10px]">
            {product.category}
          </span>
          {product.tag && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#25D366] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-white sm:text-[10px]">
              <Sparkles size={11} />
              {product.tag}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-playfair text-xl leading-tight text-[#1F140D] sm:text-2xl">
          {product.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[#5c4a3d]">
          {product.description}
        </p>

        <div className="mt-5">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9B6322]">
            Choose your pack
          </p>
          <div className="grid grid-cols-2 gap-2">
            {variants.map((variant, index) => {
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={`${product.name}-${variant.weight}`}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  aria-pressed={isSelected}
                  className={`rounded-lg border px-2.5 py-2 text-left transition-all ${
                    isSelected
                      ? "border-[#C62828] bg-[#FBF3E3] shadow-[inset_0_0_0_1px_rgba(198,40,40,0.25)]"
                      : "border-[#e8e0d8] bg-white hover:border-[#D4A017] hover:bg-[#fdfaf3]"
                  }`}
                >
                  <span
                    className={`block text-[11px] font-semibold tracking-wide ${
                      isSelected ? "text-[#1a0a00]" : "text-[#3d2f24]"
                    }`}
                  >
                    {variant.weight}
                  </span>
                  <span
                    className={`mt-0.5 block text-[10px] ${
                      variant.price === null
                        ? "font-semibold text-[#9B6322]"
                        : "text-[#6b5b4e]"
                    }`}
                  >
                    {variant.price === null ? "Ask price" : formatRupees(variant.price)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-auto pt-5">
          <div className="mb-3 flex items-end justify-between gap-3 border-t border-[#e8e0d8] pt-4">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8B7B6E]">
                Selected · {selected.weight}
              </p>
              <p
                className={`mt-0.5 text-lg font-bold ${
                  isOnRequest ? "text-[#9B6322]" : "text-[#C62828]"
                }`}
              >
                {formatVariantPrice(selected.price)}
              </p>
            </div>
            <span className="mb-1 text-[10px] text-[#8B7B6E]">PKR</span>
          </div>

          <a
            href={orderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded bg-gradient-to-r from-[#C62828] to-[#B71C1C] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-white shadow-[0_12px_28px_-16px_rgba(198,40,40,0.9)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-14px_rgba(198,40,40,0.9)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C62828] focus-visible:ring-offset-2"
          >
            <MessageCircle size={16} strokeWidth={2.2} />
            {isOnRequest ? "Confirm price on WhatsApp" : "Order now on WhatsApp"}
          </a>
        </div>
      </div>
    </article>
  );
}
