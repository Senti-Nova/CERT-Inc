// Officer case queue with search and filters.
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Input, Select } from "@/components/csa/ui";
import { PriorityChip, StatusChip } from "@/components/csa/chips";
import { PRIORITY_LABELS, STATUS_LABELS, listCases } from "@/lib/mockApi";

export const Route = createFileRoute("/officer/")({
  head: () => ({ meta: [
    { title: "Case queue — CSA Officer" },
    { name: "description", content: "Triage incoming cybercrime reports." },
    { property: "og:title", content: "Case queue — CSA Officer" },
    { property: "og:description", content: "Centralised cybercrime report queue." },
  ] }),
  component: QueuePage,
});

function QueuePage() {
  const [q, setQ] = useState(""); const [status, setStatus] = useState(""); const [prio, setPrio] = useState("");
  const all = useMemo(() => listCases(), []);
  const rows = all.filter((c) => (!status || c.status === status) && (!prio || c.priority === prio) && (`${c.ref} ${c.summary}`.toLowerCase().includes(q.toLowerCase())));
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div><h1 className="text-3xl font-bold tracking-tight text-ink">Case queue</h1>
        <p className="text-ink-muted">{all.length} cases · {all.filter((c) => c.status === "new").length} new</p></div>
      <div className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr]">
        <Input aria-label="Search cases" placeholder="Search reference or summary" value={q} onChange={(e) => setQ(e.target.value)} />
        <Select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All statuses</option>{Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</Select>
        <Select aria-label="Filter by priority" value={prio} onChange={(e) => setPrio(e.target.value)}><option value="">All priorities</option>{Object.entries(PRIORITY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</Select>
      </div>
      <div className="overflow-x-auto rounded-xl2 bg-white shadow-card">
        <table className="w-full text-left">
          <thead className="border-b border-slate-200 text-sm text-ink-muted"><tr>{["Reference", "Summary", "Priority", "Status", "Received"].map((h) => <th key={h} scope="col" className="px-4 py-3 font-bold">{h}</th>)}</tr></thead>
          <tbody>
            {rows.length === 0 ? <tr><td colSpan={5} className="px-4 py-10 text-center text-ink-muted">No cases match these filters.</td></tr> : rows.map((c) => (
              <tr key={c.id} className="border-b border-slate-100 last:border-0 hover:bg-cyan-50">
                <td className="px-4 py-3"><Link to="/officer/cases/$id" params={{ id: c.id }} className="font-mono font-bold text-cyan-700 underline-offset-4 hover:underline">{c.ref}</Link></td>
                <td className="px-4 py-3 text-ink">{c.summary}</td>
                <td className="px-4 py-3"><PriorityChip p={c.priority} /></td>
                <td className="px-4 py-3"><StatusChip s={c.status} /></td>
                <td className="whitespace-nowrap px-4 py-3 text-ink-muted">{new Date(c.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
