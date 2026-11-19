// Track a submitted report by reference number.
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, Phone } from "lucide-react";
import { Button, Chip, Field, Input, buttonClass } from "@/components/csa/ui";
import { CATEGORY_LABELS, STATUS_LABELS, getCaseByRef, type Case } from "@/lib/mockApi";

export const Route = createFileRoute("/_public/track")({
  head: () => ({ meta: [
    { title: "Track your report — CSA Ghana" },
    { name: "description", content: "Check the status of your cybercrime report with your reference number." },
    { property: "og:title", content: "Track your report — CSA Ghana" },
    { property: "og:description", content: "Enter your reference number to see progress." },
  ] }),
  component: TrackPage,
});

function TrackPage() {
  const [ref, setRef] = useState("");
  const [result, setResult] = useState<Case | null | undefined>(undefined);
  return (
    <div className="mx-auto max-w-[680px] px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-ink">Track your report</h1>
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setResult(getCaseByRef(ref) ?? null); }}>
        <Field id="ref" label="Reference number" hint="Example: CSA-2027-00412">
          <Input id="ref" value={ref} onChange={(e) => setRef(e.target.value)} className="font-mono" aria-describedby="ref-hint" />
        </Field>
        <Button type="submit" size="lg" className="w-full sm:w-auto">Check status</Button>
      </form>
      <div aria-live="polite" className="mt-8">
        {result && (
          <div className="space-y-3 rounded-xl2 bg-white p-6 shadow-card">
            <p className="font-mono text-xl font-bold text-navy-900">{result.ref}</p>
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-ink">
              <dt className="text-ink-muted">Status</dt><dd><Chip tone="cyan">{STATUS_LABELS[result.status]}</Chip></dd>
              <dt className="text-ink-muted">Submitted</dt><dd>{new Date(result.createdAt).toLocaleString()}</dd>
              <dt className="text-ink-muted">Category</dt><dd>{CATEGORY_LABELS[result.confirmedCategory ?? result.suggestedCategory]}</dd>
            </dl>
          </div>
        )}
        {result === null && (
          <div role="alert" className="flex items-start gap-3 rounded-xl2 border-2 border-warning-500 bg-warning-50 p-5 text-ink">
            <AlertTriangle className="mt-1 size-5 shrink-0 text-warning-500" aria-hidden />
            <div><p className="font-bold">We could not find that reference.</p><p>Check the number, or call us for help.</p>
              <a href="tel:292" className={buttonClass("primary", "md", "mt-3")}><Phone className="size-5" aria-hidden />Call 292</a></div>
          </div>
        )}
      </div>
    </div>
  );
}
