// Guarded officer shell: sidebar on md+, top bar on mobile.
import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Inbox, LogOut, ShieldCheck } from "lucide-react";
import { isOfficer, OFFICER_KEY } from "@/lib/officerAuth";

export const Route = createFileRoute("/officer")({ component: OfficerLayout });

function OfficerLayout() {
  const nav = useNavigate();
  const [ok, setOk] = useState(false);
  useEffect(() => { if (isOfficer()) setOk(true); else nav({ to: "/officer/login", replace: true }); }, [nav]);
  if (!ok) return null;
  const signOut = () => { localStorage.removeItem(OFFICER_KEY); nav({ to: "/officer/login" }); };
  const navLink = "flex min-h-12 items-center gap-3 rounded-xl px-3 font-bold text-ink hover:bg-cyan-50";
  return (
    <div className="flex min-h-dvh bg-surface-sunken">
      <a href="#main" className="sr-only z-50 rounded-xl bg-white px-4 py-3 font-bold focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to main content</a>
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white p-4 md:flex">
        <div className="mb-8 flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-navy-900 text-white"><ShieldCheck className="size-6" aria-hidden /></span>
          <span><span className="block font-bold text-ink">CSA Officer</span><span className="text-sm text-ink-muted">Case Management</span></span>
        </div>
        <nav aria-label="Officer"><Link to="/officer" className={navLink} activeProps={{ className: "bg-cyan-50 text-cyan-800" }}><Inbox className="size-5" aria-hidden />Queue</Link></nav>
        <button type="button" onClick={signOut} className={`${navLink} mt-auto`}><LogOut className="size-5" aria-hidden />Sign out</button>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between bg-navy-900 px-4 py-2 text-white md:hidden">
          <Link to="/officer" className="inline-flex min-h-12 items-center gap-2 font-bold"><ShieldCheck className="size-6" aria-hidden />CSA Officer</Link>
          <button type="button" onClick={signOut} aria-label="Sign out" className="grid size-12 place-items-center rounded-xl hover:bg-white/10"><LogOut className="size-5" aria-hidden /></button>
        </header>
        <main id="main" tabIndex={-1} className="flex-1 p-4 outline-none sm:p-6 lg:p-8"><Outlet /></main>
      </div>
    </div>
  );
}
