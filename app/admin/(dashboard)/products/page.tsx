import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";

import { listAdminProducts } from "@/lib/products/products";
import { SupabaseSetupNotice } from "@/components/admin/SupabaseSetupNotice";
import { ProductRowActions } from "@/components/admin/ProductRowActions";
import { formatRupees } from "@/lib/products/display";

export const metadata = { title: "Products" };
export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await listAdminProducts();
  const active = products.filter((product) => product.active).length;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-playfair text-3xl sm:text-4xl mb-2">Products</h1>
          <p className="text-white/50 text-sm">
            {products.length === 0
              ? "No products yet."
              : `${products.length} product${products.length === 1 ? "" : "s"}, ${active} live on the storefront.`}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-gradient-to-r from-[#C62828] to-[#B71C1C] hover:from-[#B71C1C] hover:to-[#A01515] text-white px-5 py-2.5 rounded-sm text-xs tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(198,40,40,0.3)]"
        >
          <Plus size={16} />
          New Product
        </Link>
      </div>

      <SupabaseSetupNotice />

      {products.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/15 rounded-sm">
          <p className="font-playfair text-xl mb-2">Your shelf is empty</p>
          <p className="text-white/40 text-sm mb-6">
            Add your first product and it will appear on the home page.
          </p>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 text-[#E5A122] hover:text-[#f0c060] text-sm tracking-widest uppercase"
          >
            <Plus size={16} />
            Add a product
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {products.map((product) => (
            <li
              key={product.id}
              className="flex flex-wrap sm:flex-nowrap items-center gap-4 bg-white/[0.03] border border-white/10 rounded-sm p-4 hover:border-white/20 transition-colors"
            >
              <div className="w-14 h-14 shrink-0 rounded-sm bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.imageAlt || product.name}
                    width={56}
                    height={56}
                    className="object-contain p-1"
                  />
                ) : (
                  <span className="text-white/25 text-[10px] uppercase">No image</span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span
                    className={`text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-sm ${
                      product.active
                        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                        : "bg-white/5 text-white/50 border border-white/15"
                    }`}
                  >
                    {product.active ? "Live" : "Hidden"}
                  </span>
                  <span className="text-[10px] tracking-widest uppercase text-white/35">
                    {product.category}
                  </span>
                  {product.badge && (
                    <span className="text-[10px] tracking-widest uppercase text-amber-300">
                      {product.badge}
                    </span>
                  )}
                </div>

                <Link
                  href={`/admin/products/${product.id}`}
                  className="font-playfair text-lg hover:text-[#E5A122] transition-colors"
                >
                  {product.name}
                </Link>

                <p className="text-white/35 text-xs mt-0.5">
                  {product.size || "No size"} · {formatRupees(product.price)}
                  {product.originalPrice != null && (
                    <span className="line-through ml-2">
                      {formatRupees(product.originalPrice)}
                    </span>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <ProductRowActions product={product} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
