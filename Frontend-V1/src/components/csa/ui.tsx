// Hand-rolled accessible UI primitives for the CSA portals.
import { forwardRef, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes, type SelectHTMLAttributes, type HTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-navy-900 text-white hover:bg-navy-800 active:bg-navy-950 disabled:bg-navy-300",
  secondary: "bg-white text-navy-900 border-2 border-slate-300 hover:border-cyan-600 hover:text-cyan-700",
  ghost: "bg-transparent text-cyan-700 hover:bg-cyan-50",
  danger: "bg-danger-500 text-white hover:bg-rose-700",
  hero: "bg-white text-navy-900 hover:bg-cyan-50",
  heroOutline: "border-2 border-white/40 text-white hover:border-cyan-300 hover:bg-white/10",
};
const sizes = { md: "min-h-12 px-5 text-base", lg: "min-h-14 px-6 text-lg" };

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants; size?: keyof typeof sizes; loading?: boolean; icon?: ReactNode;
}
export const buttonClass = (variant: keyof typeof variants = "primary", size: keyof typeof sizes = "md", extra?: string) =>
  cn("inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-colors disabled:cursor-not-allowed", variants[variant], sizes[size], extra);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", loading, icon, className, children, disabled, ...rest }, ref) {
  return (
    <button ref={ref} className={buttonClass(variant, size, className)} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {loading ? <Loader2 className="size-5 animate-spin" aria-hidden /> : icon}
      {children}
    </button>
  );
});

const field = "w-full rounded-xl border-2 border-slate-300 bg-white px-4 text-base text-ink placeholder:text-ink-muted focus:border-cyan-600";
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input({ className, ...p }, ref) {
  return <input ref={ref} className={cn(field, "min-h-12", className)} {...p} />;
});
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea({ className, rows = 6, ...p }, ref) {
  return <textarea ref={ref} rows={rows} className={cn(field, "py-3", className)} {...p} />;
});
export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(function Select({ className, ...p }, ref) {
  return <select ref={ref} className={cn(field, "min-h-12", className)} {...p} />;
});

export function Field({ id, label, hint, error, children }: { id: string; label: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block font-bold text-ink">{label}</label>
      {children}
      {hint && <p id={`${id}-hint`} className="text-ink-muted">{hint}</p>}
      {error && <p role="alert" className="font-bold text-danger-500">{error}</p>}
    </div>
  );
}

export const Progress = forwardRef<HTMLDivElement, { value: number; max: number; label: string }>(function Progress({ value, max, label }, ref) {
  return (
    <div ref={ref} role="progressbar" aria-label={label} aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
      <div className="h-full rounded-full bg-navy-900 transition-[width] duration-300" style={{ width: `${(value / max) * 100}%` }} />
    </div>
  );
});

const tones = {
  neutral: "bg-slate-100 text-slate-800 ring-slate-500/20",
  cyan: "bg-cyan-50 text-cyan-800 ring-cyan-600/20",
  warning: "bg-warning-50 text-warning-500 ring-warning-500/30",
  danger: "bg-danger-50 text-danger-500 ring-danger-500/30",
  success: "bg-success-50 text-success-500 ring-success-500/30",
};
export const Chip = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement> & { tone?: keyof typeof tones }>(function Chip({ tone = "neutral", className, ...p }, ref) {
  return <span ref={ref} className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-sm font-bold ring-1 ring-inset", tones[tone], className)} {...p} />;
});
