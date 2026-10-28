import Link from "next/link";
import Image from "next/image";

import { AdminNav } from "@/components/admin/AdminNav";
import { logoutAction } from "@/app/admin/actions";
import { verifyAdminSession } from "@/lib/dal";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Real authorization check. proxy.ts already bounces anonymous requests, but
  // this is the check that actually protects the rendered data.
  await verifyAdminSession();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-[#1a0a00]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-6 min-w-0">
            <Link href="/admin" className="shrink-0">
              <div className="relative w-[110px] h-[40px]">
                <Image src="/newlogo.png" alt="Stea Masala" fill className="object-contain" />
              </div>
            </Link>
            <AdminNav />
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-xs tracking-widest uppercase text-white/50 hover:text-white transition-colors whitespace-nowrap"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {children}
      </main>
    </div>
  );
}