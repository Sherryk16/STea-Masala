import Link from "next/link";
import Image from "next/image";
import { Lock, ArrowLeft } from "lucide-react";

import { loginAction, type LoginState } from "@/app/admin/actions";
import { SupabaseSetupNotice } from "@/components/admin/SupabaseSetupNotice";
import { LoginForm } from "@/components/admin/LoginForm";

const INITIAL_STATE: LoginState = {};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-white/50 hover:text-[#E5A122] transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Back to site
        </Link>

        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <div className="relative w-[150px] h-[56px]">
              <Image src="/logo.png" alt="Stea Masala" fill className="object-contain" />
            </div>
          </Link>
          <h1 className="font-playfair text-3xl sm:text-4xl mb-3">Admin Access</h1>
          <p className="text-white/50 text-sm">Sign in to manage your blog.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-sm p-6 sm:p-8 backdrop-blur-sm">
          <LoginForm action={loginAction} from={from} initialState={INITIAL_STATE} />
        </div>

        <SupabaseSetupNotice />

        <p className="text-center text-white/25 text-xs mt-8 flex items-center justify-center gap-1.5">
          <Lock size={12} />
          Protected area. Sessions expire after 7 days.
        </p>
      </div>
    </main>
  );
}