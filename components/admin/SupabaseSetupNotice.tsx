import { TriangleAlert, Database } from "lucide-react";

import { MISSING_ENV_VARS } from "@/lib/supabase";

/**
 * Shown on the admin screens when the Supabase environment variables are
 * missing, so a fresh clone explains what to do instead of throwing.
 */
export function SupabaseSetupNotice() {
  if (MISSING_ENV_VARS.length === 0) return null;

  return (
    <div className="mt-6 bg-amber-500/10 border border-amber-500/30 rounded-sm p-4 text-left">
      <p className="flex items-center gap-2 text-amber-200 text-sm font-medium mb-2">
        <TriangleAlert size={16} />
        Supabase is not connected yet
      </p>
      <p className="text-white/50 text-xs leading-relaxed mb-3">
        The blog needs a Supabase project before posts can be saved. Add the missing
        variables below to <code className="text-amber-200/90">.env.local</code>.
      </p>
      <ul className="space-y-1 mb-3">
        {MISSING_ENV_VARS.map((name) => (
          <li key={name} className="text-amber-200/80 text-xs font-mono">
            {name}
          </li>
        ))}
      </ul>
      <p className="flex items-start gap-2 text-white/40 text-xs leading-relaxed">
        <Database size={14} className="shrink-0 mt-0.5" />
        Then run <code className="text-white/60">supabase/schema.sql</code> in the Supabase
        SQL Editor and restart the dev server.
      </p>
    </div>
  );
}