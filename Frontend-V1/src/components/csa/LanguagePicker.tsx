// Compact header language switcher using the shared language list.
import { Languages } from "lucide-react";
import { LANGUAGES, useT, type Lang } from "@/lib/i18n";

export function LanguagePicker() {
  const { lang, setLang } = useT();
  return (
    <label className="relative inline-flex min-h-12 items-center gap-2 rounded-xl border-2 border-white/25 px-3 text-white hover:border-cyan-300">
      <Languages className="size-5" aria-hidden />
      <span className="sr-only">Language</span>
      <select value={lang} onChange={(e) => setLang(e.target.value as Lang)} className="cursor-pointer bg-transparent font-bold text-white outline-none [&>option]:text-ink">
        {LANGUAGES.filter((l) => l.available).map((l) => <option key={l.code} value={l.code}>{l.native}</option>)}
      </select>
    </label>
  );
}
