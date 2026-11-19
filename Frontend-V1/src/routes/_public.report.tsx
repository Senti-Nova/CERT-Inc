// Seven-step public reporting wizard.
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Check, ClipboardList, Keyboard, Mic, Sparkles, Upload, Volume2, X } from "lucide-react";
import { Button, Field, Input, Progress, Select, Textarea, buttonClass } from "@/components/csa/ui";
import { VoiceRecorder } from "@/components/csa/VoiceRecorder";
import { LANGUAGES, useT, type Lang } from "@/lib/i18n";
import { CATEGORY_LABELS, createReport, suggestCategory, transcribe, type Category, type Channel, type Evidence } from "@/lib/mockApi";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_public/report")({
  head: () => ({ meta: [
    { title: "Report an incident — CSA Ghana" },
    { name: "description", content: "Report a cybercrime by voice or text in a few simple steps." },
    { property: "og:title", content: "Report an incident — CSA Ghana" },
    { property: "og:description", content: "Speak or type what happened. Takes about 3 minutes." },
  ] }),
  component: ReportWizard,
});

const STEPS = ["language", "mode", "capture", "review", "evidence", "contact", "done"] as const;

function ReportWizard() {
  const { t, lang, setLang } = useT();
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<Channel>("voice");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [category, setCategory] = useState<Category>("other");
  const [files, setFiles] = useState<Evidence[]>([]);
  const [contact, setContact] = useState({ name: "", phone: "", email: "" });
  const [ref, setRef] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const first = useRef(true);

  useEffect(() => { if (first.current) { first.current = false; return; } heading.current?.focus(); }, [step]);
  const go = (n: number) => { setError(""); setStep(n); };
  const suggestion = suggestCategory(text);

  const toReview = () => {
    if (text.trim().length < 10) { setError("Please tell us a little more (at least 10 characters)."); return; }
    setCategory(suggestCategory(text).category); go(3);
  };
  const onRecorded = async (blob: Blob) => {
    setBusy(true);
    const out = await transcribe(blob, lang);
    setText(out); setBusy(false);
  };
  const submit = () => {
    const c = createReport({ channel: mode, language: LANGUAGES.find((l) => l.code === lang)?.english ?? "English", text, category, evidence: files, contact });
    setRef(c.ref); go(6);
  };

  const titles = [t("lang.title"), t("mode.title"), t("capture.title"), t("review.title"), t("evidence.title"), t("contact.title"), t("done.title")];
  const name = STEPS[step] ?? "language";
  const next: Record<string, (() => void) | undefined> = {
    capture: toReview, review: () => go(4), evidence: () => go(5), contact: submit,
  };

  return (
    <div className="mx-auto max-w-[680px] px-4 pb-36 pt-6">
      {name !== "done" && <div className="mb-6 space-y-2"><p className="font-bold text-ink-muted">Step {step + 1} of 6</p><Progress value={step + 1} max={6} label="Report progress" /></div>}
      <h1 ref={heading} tabIndex={-1} className="mb-6 text-3xl font-bold tracking-tight text-ink outline-none">{titles[step]}</h1>
      <p aria-live="assertive" className="sr-only">{error}</p>

      {name === "language" && (
        <fieldset className="space-y-3"><legend className="sr-only">{t("lang.title")}</legend>
          {LANGUAGES.map((l) => (
            <div key={l.code} className={cn("flex items-center gap-3 rounded-xl2 border-2 bg-white p-4", lang === l.code && l.available ? "border-cyan-600 bg-cyan-50" : "border-slate-200", !l.available && "opacity-80")}>
              <label className={cn("flex min-h-12 flex-1 items-center gap-4", l.available && "cursor-pointer")}>
                <input type="radio" name="lang" className="size-6 accent-cyan-700" disabled={!l.available} checked={lang === l.code}
                  onChange={() => { setLang(l.code as Lang); go(1); }} />
                <span><span className="block text-lg font-bold text-ink">{l.native}</span><span className="text-ink-muted">{l.english}{!l.available && ` · ${t("comingSoon")}`}</span></span>
              </label>
              <button type="button" disabled aria-label={`Listen to ${l.english} (coming soon)`} className="grid size-12 place-items-center rounded-xl text-ink-faint"><Volume2 className="size-5" aria-hidden /></button>
            </div>
          ))}
        </fieldset>
      )}

      {name === "mode" && (
        <div className="space-y-3">
          {([["voice", Mic, "mode.voice"], ["guided", ClipboardList, "mode.guided"], ["text", Keyboard, "mode.text"]] as const).map(([m, Icon, k]) => (
            <button key={m} type="button" onClick={() => { setMode(m); go(2); }} className="flex w-full items-center gap-4 rounded-xl2 border-2 border-slate-200 bg-white p-5 text-left hover:border-cyan-500 hover:bg-cyan-50">
              <span className="grid size-14 place-items-center rounded-2xl bg-cyan-50"><Icon className="size-7 text-cyan-700" aria-hidden /></span>
              <span><span className="block text-lg font-bold text-ink">{t(k)}</span><span className="text-ink-muted">{t(`${k}.hint` as typeof k)}</span></span>
            </button>
          ))}
        </div>
      )}

      {name === "capture" && (
        <div className="space-y-4">
          {mode === "voice" ? <VoiceRecorder onRecorded={onRecorded} /> : (
            <Field id="what" label={mode === "guided" ? "What happened, when, and who contacted you?" : "Describe what happened"} hint="Include phone numbers, names, links or amounts if you have them." error={error}>
              <Textarea id="what" value={text} onChange={(e) => setText(e.target.value)} aria-describedby="what-hint" aria-invalid={!!error} />
            </Field>
          )}
          <p aria-live="polite" className="font-bold text-cyan-800">{busy ? "Transcribing your recording…" : ""}</p>
          {mode === "voice" && text && !busy && (
            <Field id="tx" label="We wrote down" hint="You can correct anything." error={error}>
              <Textarea id="tx" rows={4} value={text} onChange={(e) => setText(e.target.value)} />
            </Field>
          )}
        </div>
      )}

      {name === "review" && (
        <div className="space-y-4">
          <div className="rounded-xl2 bg-white p-5 shadow-card"><p className="mb-1 font-bold text-ink-muted">Your words</p><p className="text-ink">{text}</p></div>
          <div className="rounded-xl2 border-2 border-dashed border-cyan-300 bg-white p-5">
            <p className="inline-flex items-center gap-1.5 font-bold text-cyan-700"><Sparkles className="size-5" aria-hidden />AI suggested</p>
            <p className="mt-1 text-xl font-bold text-navy-900">{CATEGORY_LABELS[suggestion.category]}</p>
            <p className="text-ink-muted">Confidence {Math.round(suggestion.confidence * 100)}% · A CSA officer will confirm.</p>
          </div>
          <Field id="cat" label="Does this sound right? Change it if not.">
            <Select id="cat" value={category} onChange={(e) => setCategory(e.target.value as Category)}>
              {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </Select>
          </Field>
        </div>
      )}

      {name === "evidence" && (
        <div className="space-y-4">
          <button type="button" onClick={() => fileInput.current?.click()} className="flex w-full flex-col items-center gap-3 rounded-xl2 border-2 border-dashed border-slate-300 bg-white px-6 py-12 hover:border-cyan-500 hover:bg-cyan-50">
            <Upload className="size-10 text-cyan-700" aria-hidden /><span className="text-lg font-bold text-ink">Choose screenshots or files</span><span className="text-ink-muted">Optional · photos, PDFs</span>
          </button>
          <input ref={fileInput} type="file" multiple hidden onChange={(e) => {
            const list = Array.from(e.target.files ?? []).map((f) => ({ id: crypto.randomUUID(), name: f.name, sizeKb: Math.ceil(f.size / 1024), type: f.type }));
            setFiles((x) => [...x, ...list]); e.target.value = "";
          }} />
          <ul className="space-y-2">
            {files.map((f) => (
              <li key={f.id} className="flex items-center justify-between gap-3 rounded-xl bg-white p-3 pl-4 shadow-card">
                <span className="truncate text-ink">{f.name} <span className="text-ink-muted">· {f.sizeKb} KB</span></span>
                <button type="button" aria-label={`Remove ${f.name}`} onClick={() => setFiles((x) => x.filter((y) => y.id !== f.id))} className="grid size-12 place-items-center rounded-xl text-ink-muted hover:bg-danger-50 hover:text-danger-500"><X className="size-5" aria-hidden /></button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {name === "contact" && (
        <div className="space-y-4">
          <p className="text-ink-muted">All fields are optional. We only use these to follow up on your report.</p>
          <Field id="n" label="Your name"><Input id="n" autoComplete="name" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} /></Field>
          <Field id="p" label="Phone number"><Input id="p" type="tel" autoComplete="tel" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} /></Field>
          <Field id="e" label="Email"><Input id="e" type="email" autoComplete="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} /></Field>
          <p className="rounded-xl bg-navy-50 p-4 text-ink">Your information is protected under Ghana's Data Protection Act, 2012 (Act 843).</p>
        </div>
      )}

      {name === "done" && (
        <div className="space-y-6">
          <span className="grid size-20 place-items-center rounded-full bg-success-50"><Check className="size-10 text-success-500" aria-hidden /></span>
          <div className="rounded-xl2 border-2 border-navy-200 bg-navy-50 p-5">
            <p className="font-bold text-ink-muted">Your reference number</p>
            <p className="font-mono text-3xl font-bold text-navy-900">{ref}</p>
            <p className="text-ink-muted">Write it down or take a screenshot.</p>
          </div>
          <section><h2 className="mb-2 text-xl font-bold text-ink">What happens next</h2>
            <ol className="list-decimal space-y-1 pl-6 text-ink"><li>An officer reviews your report within 48 hours.</li><li>We may call you for more details.</li><li>Check progress any time with your reference.</li></ol>
          </section>
          <div className="flex flex-wrap gap-3">
            <Link to="/track" className={buttonClass("primary", "lg")}>Track report</Link>
            <Link to="/" className={buttonClass("secondary", "lg")}>Home</Link>
          </div>
        </div>
      )}

      {name !== "done" && (
        <div className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-[680px] gap-3 px-4 py-3">
            <Button variant="secondary" size="lg" className="flex-1" disabled={step === 0} onClick={() => go(step - 1)}>{t("back")}</Button>
            {next[name] && <Button size="lg" className="flex-[2]" loading={busy} onClick={next[name]}>{name === "contact" ? t("submit") : t("continue")}</Button>}
          </div>
        </div>
      )}
    </div>
  );
}
