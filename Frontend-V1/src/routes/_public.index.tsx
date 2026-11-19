// Public home: hero panel and four large action tiles.
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, FileWarning, HelpCircle, LifeBuoy, Phone, Search, type LucideIcon } from "lucide-react";
import { buttonClass } from "@/components/csa/ui";
import { useT, LANGUAGES } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_public/")({
  head: () => ({ meta: [
    { title: "Report a cybercrime — Cyber Security Authority Ghana" },
    { name: "description", content: "Report cybercrime safely by voice or text in your own language. Track your report or get human help." },
    { property: "og:title", content: "Report a cybercrime — CSA Ghana" },
    { property: "og:description", content: "Speak or type your report. A CSA officer will review it." },
  ] }),
  component: HomePage,
});

function Tile({ to, hash, icon: Icon, title, hint, primary }: { to: "/report" | "/track" | "/help"; hash?: string | undefined; icon: LucideIcon; title: string; hint: string; primary?: boolean }) {
  return (
    <Link to={to} {...(hash ? { hash } : {})} className={cn("group flex min-h-28 items-center gap-4 rounded-xl2 border-2 p-5 transition-colors",
      primary ? "border-transparent bg-linear-to-br from-navy-900 to-navy-700 text-white shadow-lg sm:col-span-2" : "border-slate-200 bg-white text-ink shadow-card hover:border-cyan-500 hover:bg-cyan-50")}>
      <span className={cn("grid size-16 shrink-0 place-items-center rounded-2xl", primary ? "bg-white/15" : "bg-cyan-50")}>
        <Icon className={cn("size-8", primary ? "text-white" : "text-cyan-700")} aria-hidden />
      </span>
      <span className="flex-1">
        <span className={cn("block font-bold", primary ? "text-2xl" : "text-lg")}>{title}</span>
        <span className={primary ? "text-navy-100" : "text-ink-muted"}>{hint}</span>
      </span>
      <ChevronRight className="size-6 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden />
    </Link>
  );
}

function HomePage() {
  const { t } = useT();
  return (
    <>
      <section className="bg-navy-950 px-2 pb-2 sm:px-4 sm:pb-4">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-xl2 bg-hero text-white">
          <div className="bg-grid absolute inset-0" aria-hidden />
          <div className="relative px-6 py-14 sm:px-12 sm:py-20">
            <p className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-3 py-1 text-sm font-bold">
              <span className="size-2 rounded-full bg-cyan-400" aria-hidden /> Free · Confidential · 24/7
            </p>
            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl">{t("home.title")}</h1>
            <p className="mt-5 max-w-2xl text-lg text-navy-100">{t("home.sub")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/report" className={buttonClass("hero", "lg")}>{t("tile.report")}</Link>
              <a href="tel:292" className={buttonClass("heroOutline", "lg")}><Phone className="size-5" aria-hidden />{t("call")}</a>
            </div>
          </div>
        </div>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-2 px-6 py-5 text-navy-100 sm:px-12">
          <p className="font-bold text-white">Report in your language</p>
          {LANGUAGES.map((l) => <span key={l.code} className={l.available ? "text-lg font-bold text-white" : "text-lg text-navy-300"}>{l.native}</span>)}
        </div>
      </section>
      <div className="mx-auto max-w-[680px] px-4 py-10">
        <div className="grid gap-4 sm:grid-cols-2">
          <Tile primary to="/report" icon={FileWarning} title={t("tile.report")} hint={t("tile.report.hint")} />
          <Tile to="/track" icon={Search} title={t("tile.track")} hint={t("tile.track.hint")} />
          <Tile to="/help" icon={LifeBuoy} title={t("tile.help")} hint={t("tile.help.hint")} />
          <Tile to="/help" hash="what" icon={HelpCircle} title={t("tile.what")} hint={t("tile.what.hint")} />
        </div>
        <div className="mt-10 flex flex-col items-start gap-3 rounded-xl2 bg-white p-6 shadow-card sm:flex-row sm:items-center sm:justify-between">
          <p className="text-lg font-bold text-ink">{t("home.speak")}</p>
          <a href="tel:292" className={buttonClass("primary", "lg")}><Phone className="size-5" aria-hidden />{t("call")}</a>
        </div>
      </div>
    </>
  );
}
