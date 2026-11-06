import { Fragment } from "react";
import { MessageCircle } from "lucide-react";

import type { ProductCard } from "@/lib/products/types";
import {
  PRODUCT_GROUPS,
  formatVariantPrice,
  PRICE_ON_REQUEST_LABEL,
} from "@/lib/products/display";
import { whatsappUrl } from "@/lib/site";

type PriceListProps = {
  products: ProductCard[];
};

type PriceGroup = {
  title: string;
  eyebrow: string;
  description: string;
  products: ProductCard[];
};

export default function PriceList({ products }: PriceListProps) {
  const groups: PriceGroup[] = PRODUCT_GROUPS.map((group) => ({
    ...group,
    products: products.filter((product) => product.category === group.title),
  })).filter((group) => group.products.length > 0);

  const otherProducts = products.filter(
    (product) => !PRODUCT_GROUPS.some((group) => group.title === product.category),
  );

  if (otherProducts.length > 0) {
    groups.push({
      title: "More from ST Lounge",
      eyebrow: "Additional blends",
      description: "More teas from the ST Lounge shelf.",
      products: otherProducts,
    });
  }

  const priceRequestUrl = whatsappUrl(
    "Assalamualaikum! I would like to confirm the latest prices for Shahi Mixture Tea, Kashmiri Shahi Tea and Asli Masala. Please share the details.",
  );

  return (
    <div>
      {/* Desktop / tablet price table ------------------------------------ */}
      <div className="hidden overflow-hidden rounded-2xl border border-[#D4A017]/35 bg-[#2d1810] shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)] md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-[#1a0a00] text-[#D4A017]">
              <th className="w-[44%] px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.2em]">
                Product / Flavour
              </th>
              <th className="w-[18%] px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.2em]">
                Weight
              </th>
              <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.2em]">
                Customer Price (PKR)
              </th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <Fragment key={group.title}>
                <tr>
                  <td
                    colSpan={3}
                    className="border-y border-[#D4A017]/20 bg-[#D4A017]/10 px-6 py-3"
                  >
                    <span className="font-playfair text-sm tracking-wide text-[#D4A017]">
                      {group.title}
                    </span>
                    <span className="ml-3 text-[10px] uppercase tracking-[0.16em] text-[#e8e0d5]/55">
                      {group.eyebrow}
                    </span>
                  </td>
                </tr>

                {group.products.map((product, productIndex) => (
                  <Fragment key={product.name}>
                    {product.variants.map((variant, variantIndex) => (
                      <tr
                        key={`${product.name}-${variant.weight}`}
                        className={`border-b border-white/[0.06] transition-colors last:border-b-0 hover:bg-[#D4A017]/[0.06] ${
                          productIndex % 2 === 1 ? "bg-white/[0.018]" : ""
                        }`}
                      >
                        {variantIndex === 0 && (
                          <td
                            rowSpan={product.variants.length}
                            className="px-6 py-5 align-top"
                          >
                            <span className="block font-playfair text-lg leading-snug text-[#FAF7F2]">
                              {product.name}
                            </span>
                            <span className="mt-1 block text-[10px] uppercase tracking-[0.16em] text-[#d8cec2]">
                              {product.variants.length} pack sizes
                            </span>
                            {product.tag && (
                              <span className="mt-2 inline-block rounded-full border border-[#D4A017]/30 px-2 py-0.5 text-[9px] uppercase tracking-[0.14em] text-[#E5A122]">
                                {product.tag}
                              </span>
                            )}
                          </td>
                        )}
                        <td className="px-6 py-3.5 text-sm text-[#f5f0e8]">
                          {variant.weight}
                        </td>
                        <td
                          className={`px-6 py-3.5 text-sm font-semibold ${
                            variant.price === null ? "text-[#E5A122]" : "text-[#FAF7F2]"
                          }`}
                        >
                          {formatVariantPrice(variant.price)}
                        </td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile price cards ---------------------------------------------- */}
      <div className="space-y-8 md:hidden">
        {groups.map((group) => (
          <div key={group.title}>
            <div className="mb-4">
              <h3 className="font-playfair text-xl text-[#D4A017]">{group.title}</h3>
              <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-[#e8e0d5]/55">
                {group.eyebrow}
              </p>
            </div>

            <div className="space-y-3">
              {group.products.map((product) => (
                <div
                  key={product.name}
                  className="rounded-xl border border-[#D4A017]/25 bg-[#2d1810] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-playfair text-base text-[#FAF7F2]">
                        {product.name}
                      </p>
                      <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-[#d8cec2]">
                        {product.variants.length} pack sizes
                      </p>
                    </div>
                    {product.tag && (
                      <span className="shrink-0 rounded-full border border-[#D4A017]/30 px-2 py-0.5 text-[9px] uppercase tracking-[0.12em] text-[#E5A122]">
                        {product.tag}
                      </span>
                    )}
                  </div>

                  <dl className="mt-4 grid grid-cols-2 gap-2">
                    {product.variants.map((variant) => (
                      <div
                        key={`${product.name}-${variant.weight}`}
                        className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2"
                      >
                        <dt className="text-[10px] uppercase tracking-[0.14em] text-[#d8cec2]">
                          {variant.weight}
                        </dt>
                        <dd
                          className={`mt-0.5 text-xs font-semibold ${
                            variant.price === null ? "text-[#E5A122]" : "text-[#FAF7F2]"
                          }`}
                        >
                          {formatVariantPrice(variant.price)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-7 flex flex-col items-start justify-between gap-4 rounded-xl border border-[#D4A017]/20 bg-[#1a0a00]/70 px-5 py-4 sm:flex-row sm:items-center">
        <p className="max-w-2xl text-xs leading-relaxed text-[#e8e0d5]/70">
          All prices are in PKR. {PRICE_ON_REQUEST_LABEL} for Shahi Mixture Tea,
          Kashmiri Shahi Tea and Asli Masala — message us to confirm the latest
          pricing before ordering.
        </p>
        <a
          href={priceRequestUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-2 rounded-sm border border-[#D4A017]/50 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#D4A017] transition-colors hover:bg-[#D4A017] hover:text-[#1a0a00]"
        >
          <MessageCircle size={14} />
          Confirm pricing
        </a>
      </div>
    </div>
  );
}
