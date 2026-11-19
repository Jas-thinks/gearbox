import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { isSessionValid } from "@/features/auth/services/auth.service";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { APP_CONFIG } from "@/config/app";
import { Zap } from "lucide-react";

interface Props {
  searchParams: Promise<{ redirect?: string; expired?: string }>;
}

export default async function AdminLoginPage({ searchParams }: Props) {
  const session = await getSession();

  if (isSessionValid(session)) {
    redirect("/dashboard");
  }

  const params = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-500/30">
            <Zap className="h-7 w-7 text-white" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-white">{APP_CONFIG.name}</h1>
          <p className="mt-1 text-sm text-slate-400">
            Internal growth operating system
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/60 p-8 shadow-2xl backdrop-blur-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">Admin Login</h2>
            <p className="mt-1 text-sm text-slate-400">
              Restricted access. Authorized personnel only.
            </p>
          </div>

          {params.expired && (
            <div className="mb-4 rounded-md border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-400">
              Your session has expired. Please log in again.
            </div>
          )}

          {/* Override form colors for dark background */}
          <div className="[&_input]:border-slate-600 [&_input]:bg-slate-700/50 [&_input]:text-white [&_input]:placeholder:text-slate-500 [&_input:focus-visible]:ring-indigo-500 [&_label]:text-slate-300 [&_svg.text-muted-foreground]:text-slate-500">
            <LoginForm />
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          Gearbox Growth OS · Internal Tool
        </p>
      </div>
    </div>
  );
}
