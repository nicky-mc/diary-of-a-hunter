// src/app/(public)/login/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Attempt to sign in using the Credentials provider we built
    const result = await signIn("credentials", {
      redirect: false, // We handle the redirect manually so we can catch errors
      email,
      password,
    });

    if (result?.error) {
      // The warding spell held. Access denied.
      setError(
        "Credentials rejected. Either you forgot your key, or you don't belong here.",
      );
      setIsLoading(false);
    } else {
      // Clearance granted. Send them to the restricted zone.
      router.push("/admin");
      router.refresh(); // Refresh the router to update the session state
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 transition-colors duration-300">
      {/* Background visual flair (Aceternity style ambient glow) */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-50 dark:opacity-20">
        <div className="h-96 w-96 rounded-full bg-[#8B5A2B] blur-[120px] mix-blend-multiply dark:mix-blend-screen"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* The Grimoire Cover / Terminal Window */}
        <div className="overflow-hidden rounded-xl border border-[#8B5A2B]/40 bg-[#F4ECD8]/90 dark:border-[#5C3A21] dark:bg-[#121212]/95 shadow-[0_0_40px_rgba(139,90,43,0.1)] dark:shadow-[0_0_40px_rgba(92,58,33,0.3)] backdrop-blur-sm">
          <div className="p-8">
            <div className="mb-8 text-center">
              <h1 className="font-serif text-3xl font-bold tracking-wider text-slate-900 dark:text-[#EAE0D5]">
                RESTRICTED ARCHIVE
              </h1>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-400">
                Authorized hunters only. The shadows are watching.
              </p>
            </div>

            {error && (
              <div
                className="mb-6 rounded border border-red-900/50 bg-red-500/10 p-3 text-sm text-red-800 dark:text-red-400"
                role="alert"
                aria-live="assertive"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-300"
                >
                  Hunter Designation (Email)
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full rounded bg-white/50 dark:bg-black/50 px-4 py-3 text-slate-900 dark:text-slate-100 placeholder-slate-500 border border-slate-300 dark:border-slate-700 focus:border-[#8B5A2B] focus:ring-1 focus:ring-[#8B5A2B] outline-none transition-all disabled:opacity-50"
                  placeholder="amber@thessaily.net"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-300"
                >
                  Passphrase
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full rounded bg-white/50 dark:bg-black/50 px-4 py-3 text-slate-900 dark:text-slate-100 placeholder-slate-500 border border-slate-300 dark:border-slate-700 focus:border-[#8B5A2B] focus:ring-1 focus:ring-[#8B5A2B] outline-none transition-all disabled:opacity-50"
                  placeholder="••••••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full overflow-hidden rounded bg-[#5C3A21] px-4 py-3 text-sm font-bold uppercase tracking-widest text-[#F4ECD8] transition-all hover:bg-[#8B5A2B] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Decrypting...
                  </span>
                ) : (
                  <span>Breach the Archive</span>
                )}
              </button>
            </form>
          </div>

          {/* Gritty bottom border accent */}
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#8B5A2B] to-transparent opacity-50"></div>
        </div>
      </div>
    </div>
  );
}
