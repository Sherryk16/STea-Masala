"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Posts", href: "/admin" },
  { name: "New Post", href: "/admin/new" },
  { name: "Products", href: "/admin/products" },
  { name: "New Product", href: "/admin/products/new" },
  { name: "View Site", href: "/" },
];

/** Works out which top-level admin section the current path belongs to. */
function isActive(href: string, pathname: string): boolean {
  if (href === "/") return false;

  if (href === "/admin") {
    // The posts list, plus any post editor (/admin/<id>), but not products.
    return (
      pathname === "/admin" ||
      (pathname.startsWith("/admin/") &&
        pathname !== "/admin/new" &&
        !pathname.startsWith("/admin/products"))
    );
  }

  if (href === "/admin/products") {
    return (
      pathname === "/admin/products" ||
      (pathname.startsWith("/admin/products/") && pathname !== "/admin/products/new")
    );
  }

  return pathname === href;
}

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-4 sm:gap-6 overflow-x-auto">
      {links.map((link) => {
        const active = isActive(link.href, pathname);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`text-xs tracking-widest uppercase whitespace-nowrap transition-colors ${
              active ? "text-[#E5A122]" : "text-white/50 hover:text-white"
            }`}
          >
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}
