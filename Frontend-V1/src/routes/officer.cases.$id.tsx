// Officer case detail with triage controls and audit timeline.
import { createFileRoute, Link } from "@tanstack/react-router";
import { useReducer, type ReactNode } from "react";
import { ArrowLeft, Download, FileText, Play, Sparkles } from "lucide-react";
import { Button, Select } from "@/components/csa/ui";
import { CATEGORY_LABELS, OFFICERS, PRIORITY_LABELS, STATUS_LABELS, getCase, updateCase, type Category, type Priority, type Status } from "@/lib/mockApi";

export const Route = createFileRoute("/officer/cases/$id")({
  head: () => ({ meta: [
    { title: "Case detail — CSA Officer" },
    { name: "description", content: "Review and triage a cybercrime case." },
    { property: "og:title", content: "Case detail — CSA Officer" },
    { property: "og:description", content: "Case triage and audit timeline." },
  ] }),
  component: CaseDetailPage,
});

const Panel = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="rounded-xl2 bg-white p-5 shadow-card"><h2 className="mb-3 text-lg font-bold text-ink">{title}</h2>{children}</section>
);

function CaseDetailPage() {
  const { id } = Route.useParams();
  const [, rerender] = useReducer((x: number) => x + 1, 0);
  const c = getCase(id);
  if (!c) return <div className="space-y-4"><h1 className="text-2xl font-bold text-ink">Case not found</h1><Link to="/officer" className="font-bold text-cyan-700">Back to queue</Link></div>;
  const set = (patch: Parameters<typeof updateCase>[1], action: string) => { updateCase(c.id, patch, "You", action); rerender(); };
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Link to="/officer" className="inline-flex min-h-12 items-center gap-2 font-bold text-cyan-700 hover:underline"><ArrowLeft className="size-5" aria-hidden />Back to queue</Link>
      <header><p className="font-mono font-bold text-navy-700">{c.ref}</p><h1 className="text-3xl font-bold tracking-tight text-ink">{c.summary}</h1>
        <p className="text-ink-muted">Received {new Date(c.createdAt).toLocaleString()} · {c.channel} · {c.language}</p></header>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Panel title="Transcript">
            <p className="text-ink">{c.transcript ?? "No transcript."}</p>
            {c.channel === "voice" && <div className="mt-4 flex flex-wrap gap-2"><Button variant="secondary" icon={<Play className="size-5" aria-hidden />}>Play</Button><Button variant="ghost" icon={<Download className="size-5" aria-hidden />}>Download</Button></div>}
          </Panel>
          <Panel title="Evidence">
            {c.evidence.length === 0 ? <p className="text-ink-muted">No files attached.</p> : <ul className="space-y-2">{c.evidence.map((e) => (
              <li key={e.id} className="flex items-center gap-3 rounded-xl bg-surface-sunken p-3"><FileText className="size-5 text-cyan-700" aria-hidden /><span className="text-ink">{e.name}</span><span className="ml-auto text-ink-muted">{e.sizeKb} KB</span></li>))}</ul>}
          </Panel>
          <Panel title="Timeline">
            <ol className="relative space-y-4 border-l-2 border-slate-200 pl-6">
              {c.timeline.map((t, i) => (
                <li key={i} className="relative"><span className="absolute -left-[33px] top-1.5 size-4 rounded-full border-2 border-white bg-navy-900" aria-hidden />
                  <p className="font-bold text-ink">{t.action}</p><p className="text-sm text-ink-muted">{t.actor} · {new Date(t.at).toLocaleString()}</p></li>
              ))}
            </ol>
          </Panel>
        </div>
        <div className="space-y-4">
          <Panel title="Status"><Select aria-label="Status" value={c.status} onChange={(e) => set({ status: e.target.value as Status }, `Status changed to ${STATUS_LABELS[e.target.value as Status]}`)}>{Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</Select></Panel>
          <Panel title="Priority"><Select aria-label="Priority" value={c.priority} onChange={(e) => set({ priority: e.target.value as Priority }, `Priority set to ${PRIORITY_LABELS[e.target.value as Priority]}`)}>{Object.entries(PRIORITY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</Select></Panel>
          <Panel title="Assignee"><Select aria-label="Assignee" value={c.assignee ?? ""} onChange={(e) => set({ assignee: e.target.value || undefined, status: e.target.value && c.status === "new" ? "assigned" : c.status }, e.target.value ? `Assigned to ${e.target.value}` : "Unassigned")}><option value="">Unassigned</option>{OFFICERS.map((o) => <option key={o}>{o}</option>)}</Select></Panel>
          <Panel title="Category">
            <div className="mb-4 rounded-xl border-2 border-dashed border-cyan-200 p-3">
              <p className="inline-flex items-center gap-1.5 text-sm font-bold text-cyan-700"><Sparkles className="size-4" aria-hidden />AI suggested</p>
              <p className="font-bold text-navy-900">{CATEGORY_LABELS[c.suggestedCategory]}</p>
            </div>
            <label htmlFor="conf" className="mb-1.5 block font-bold text-ink">Officer confirmation</label>
            <Select id="conf" value={c.confirmedCategory ?? ""} onChange={(e) => set({ confirmedCategory: (e.target.value || undefined) as Category | undefined }, e.target.value ? `Category confirmed as ${CATEGORY_LABELS[e.target.value as Category]}` : "Category confirmation cleared")}>
              <option value="">Not yet confirmed</option>{Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </Select>
          </Panel>
        </div>
      </div>
    </div>
  );
}
