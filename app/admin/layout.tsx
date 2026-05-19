// src/app/admin/layout.tsx
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * Shared chrome for every /admin route.
 *
 * Doing the session check here means individual admin pages don't need to
 * re-implement it. They can still call getServerSession() if they want the
 * user object — this layout just guarantees that an unauthenticated user
 * is bounced before any admin page renders.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-hunter-parchment dark:bg-hunter-void text-slate-900 dark:text-slate-200">
      {children}
    </div>
  );
}
