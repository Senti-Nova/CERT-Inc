// Public portal shell: skip link, dark header, footer.
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Phone, ShieldCheck } from "lucide-react";
import { LanguagePicker } from "@/components/csa/LanguagePicker";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/_public")({ component: PublicLayout });

function PublicLayout() {
  const { t } = useT();
  return (
    <div className="flex min-h-dvh flex-col bg-surface-sunken">
      <a href="#main" className="sr-only z-50 rounded-xl bg-white px-4 py-3 font-bold text-navy-900 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">{t("skip")}</a>
      <header className="bg-navy-950 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link to="/" className="inline-flex min-h-12 items-center gap-2.5 text-lg font-bold tracking-tight">
            <span className="grid size-10 place-items-center rounded-xl bg-cyan-700"><ShieldCheck className="size-6" aria-hidden /></span>
            <span className="hidden sm:inline">Cyber Security Authority</span><span className="sm:hidden">CSA</span>
          </Link>
          <div className="flex items-center gap-2">
            <a href="tel:292" className="hidden min-h-12 items-center gap-2 rounded-xl px-4 font-bold hover:bg-white/10 sm:inline-flex"><Phone className="size-5" aria-hidden />{t("call")}</a>
            <LanguagePicker />
          </div>
        </div>
      </header>
      <main id="main" tabIndex={-1} className="flex-1 outline-none"><Outlet /></main>
      <footer className="bg-navy-950 text-navy-100">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-6 sm:flex-row sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} Cyber Security Authority, Ghana</p>
          <p>Prototype for demonstration · <Link to="/officer" className="font-bold text-cyan-300 underline-offset-4 hover:underline">Officer portal</Link></p>
        </div>
      </footer>
    </div>
  );
}
