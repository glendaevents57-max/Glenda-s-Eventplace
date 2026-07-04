import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import Link from "next/link";
import { Sparkles, Calendar, BookOpen, LogOut, LayoutDashboard } from "lucide-react";
import AdminLogoutButton from "@/components/AdminLogoutButton";

export const metadata = {
  title: "Admin Dashboard | Glenda Royale Events",
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;

  // Verify administrator session
  const session = token ? verifySession(token) : null;
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#0b0b0c] text-zinc-100 flex flex-col font-sans">
      {/* Sidebar Navigation */}
      <div className="flex flex-grow flex-col md:flex-row">
        <aside className="w-full md:w-64 bg-zinc-950 border-r border-zinc-900 flex flex-col justify-between flex-shrink-0">
          <div>
            {/* Branding */}
            <div className="p-6 border-b border-zinc-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <div className="text-left">
                <div className="font-serif font-bold text-sm tracking-wider uppercase text-zinc-200">
                  Glenda Royale
                </div>
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">
                  Admin System
                </span>
              </div>
            </div>

            {/* Menu Links */}
            <nav className="p-4 space-y-1">
              <Link
                href="/admin/dashboard"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 transition-all"
              >
                <LayoutDashboard className="w-4 h-4 text-amber-500/70" />
                Bookings list
              </Link>

              <Link
                href="/admin/dashboard/calendar"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 transition-all"
              >
                <Calendar className="w-4 h-4 text-amber-500/70" />
                Event schedule
              </Link>
            </nav>
          </div>

          {/* Admin Profile & Logout */}
          <div className="p-4 border-t border-zinc-900 space-y-3">
            <div className="px-4 py-2">
              <div className="text-[10px] text-zinc-500 font-bold uppercase">Administrator</div>
              <div className="text-xs font-bold text-zinc-300 truncate">Kyle Adrianna Sayas</div>
            </div>
            
            {/* Client-side interactive logout button */}
            <AdminLogoutButton />
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-grow p-6 md:p-10 relative overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
