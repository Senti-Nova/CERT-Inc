// Priority and status chips shared by officer screens.
import { AlertTriangle } from "lucide-react";
import { Chip } from "./ui";
import { PRIORITY_LABELS, STATUS_LABELS, type Priority, type Status } from "@/lib/mockApi";

export function PriorityChip({ p }: { p: Priority }) {
  const tone = p === "urgent" ? "danger" : p === "high" ? "warning" : p === "medium" ? "cyan" : "neutral";
  return <Chip tone={tone}>{p === "urgent" && <AlertTriangle className="size-4" aria-hidden />}{PRIORITY_LABELS[p]}</Chip>;
}
export function StatusChip({ s }: { s: Status }) {
  return <Chip tone={s === "closed" ? "success" : s === "new" ? "cyan" : "neutral"}>{STATUS_LABELS[s]}</Chip>;
}
