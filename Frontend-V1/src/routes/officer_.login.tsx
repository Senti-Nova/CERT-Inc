// Officer sign-in (demo: any credentials).
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Button, Field, Input } from "@/components/csa/ui";
import { OFFICER_KEY } from "@/lib/officerAuth";

export const Route = createFileRoute("/officer_/login")({
  head: () => ({ meta: [
    { title: "Officer sign in — CSA Case Management" },
    { name: "description", content: "Sign in to the CSA officer case management dashboard." },
    { property: "og:title", content: "Officer sign in — CSA" },
    { property: "og:description", content: "Authorised CSA staff only." },
  ] }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("officer@csa.gov.gh");
  const [pw, setPw] = useState("demo-password");
  const [err, setErr] = useState("");
  return (
    <main className="grid min-h-dvh place-items-center bg-surface-sunken px-4">
      <form className="w-full max-w-md space-y-5 rounded-xl2 bg-white p-8 shadow-card" onSubmit={(e) => {
        e.preventDefault();
        if (!email.trim() || !pw.trim()) { setErr("Enter your email and password."); return; }
        localStorage.setItem(OFFICER_KEY, email); nav({ to: "/officer" });
      }}>
        <span className="grid size-12 place-items-center rounded-xl bg-navy-900 text-white"><ShieldCheck className="size-6" aria-hidden /></span>
        <h1 className="text-2xl font-bold text-ink">Officer sign in</h1>
        <Field id="em" label="Email"><Input id="em" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
        <Field id="pw" label="Password" error={err}><Input id="pw" type="password" value={pw} onChange={(e) => setPw(e.target.value)} /></Field>
        <Button type="submit" size="lg" className="w-full">Sign in</Button>
        <p className="text-ink-muted">Demo: sign in with any email and password.</p>
      </form>
    </main>
  );
}
