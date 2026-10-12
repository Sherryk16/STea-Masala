"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, LoaderCircle, LogIn, CircleAlert } from "lucide-react";

import type { LoginState } from "@/app/admin/actions";

type Props = {
  action: (state: LoginState, formData: FormData) => Promise<LoginState>;
  from?: string;
  initialState: LoginState;
};

export function LoginForm({ action, from, initialState }: Props) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="from" value={from ?? "/admin"} />

      <div>
        <label
          htmlFor="password"
          className="block text-xs tracking-widest uppercase text-white/60 mb-2"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            autoFocus
            disabled={isPending}
            placeholder="Enter your admin password"
            className="w-full bg-black/30 border border-white/15 rounded-sm px-4 py-3 pr-12 text-white placeholder:text-white/25 focus:outline-none focus:border-[#E5A122] focus:ring-1 focus:ring-[#E5A122] transition-colors disabled:opacity-60"
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {state.error && (
        <p
          role="alert"
          className="flex items-start gap-2 text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-sm px-3 py-2.5"
        >
          <CircleAlert size={16} className="shrink-0 mt-0.5" />
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#C62828] to-[#B71C1C] hover:from-[#B71C1C] hover:to-[#A01515] text-white py-3 rounded-sm text-sm tracking-widest uppercase transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(198,40,40,0.3)]"
      >
        {isPending ? (
          <>
            <LoaderCircle size={16} className="animate-spin" />
            Signing in
          </>
        ) : (
          <>
            <LogIn size={16} />
            Sign In
          </>
        )}
      </button>
    </form>
  );
}