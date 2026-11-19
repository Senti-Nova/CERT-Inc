// Human help channels and plain-language explanation of cybercrime.
import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

export const Route = createFileRoute("/_public/help")({
  head: () => ({ meta: [
    { title: "Get help — CSA Ghana" },
    { name: "description", content: "Call 292, WhatsApp, email or visit the Cyber Security Authority for help." },
    { property: "og:title", content: "Get help — CSA Ghana" },
    { property: "og:description", content: "Speak to a real person about a cybercrime." },
  ] }),
  component: HelpPage,
});

const CHANNELS = [
  { icon: Phone, title: "Call 292", hint: "Free, 24 hours", href: "tel:292" },
  { icon: MessageCircle, title: "WhatsApp", hint: "0501 603 111", href: "https://wa.me/233501603111" },
  { icon: Mail, title: "Email", hint: "report@csa.gov.gh", href: "mailto:report@csa.gov.gh" },
  { icon: MapPin, title: "Visit office", hint: "Accra, Mon–Fri 8am–5pm", href: undefined },
];

function HelpPage() {
  return (
    <div className="mx-auto max-w-[680px] px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-ink">Get human help</h1>
      <ul className="grid gap-4 sm:grid-cols-2">
        {CHANNELS.map(({ icon: Icon, title, hint, href }) => {
          const inner = (<><span className="grid size-14 place-items-center rounded-2xl bg-cyan-50"><Icon className="size-7 text-cyan-700" aria-hidden /></span>
            <span><span className="block text-lg font-bold text-ink">{title}</span><span className="text-ink-muted">{hint}</span></span></>);
          return <li key={title}>{href
            ? <a href={href} className="flex min-h-24 items-center gap-4 rounded-xl2 border-2 border-slate-200 bg-white p-5 shadow-card hover:border-cyan-500 hover:bg-cyan-50">{inner}</a>
            : <div className="flex min-h-24 items-center gap-4 rounded-xl2 border-2 border-slate-200 bg-white p-5 shadow-card">{inner}</div>}</li>;
        })}
      </ul>
      <section id="what" className="mt-12 scroll-mt-6 rounded-xl2 bg-white p-6 shadow-card">
        <h2 className="mb-3 text-2xl font-bold text-ink">What is a cybercrime?</h2>
        <p className="mb-3 text-ink">A cybercrime is a crime that uses a phone, computer or the internet. For example:</p>
        <ul className="list-disc space-y-1 pl-6 text-ink">
          <li>Someone asks for your mobile money PIN or bank code</li><li>A loan app threatens you or your contacts</li>
          <li>Someone shares or threatens to share private photos</li><li>Your WhatsApp or Facebook is taken over</li>
          <li>An “investment” promises fast, big profits</li>
        </ul>
      </section>
    </div>
  );
}
