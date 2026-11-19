// Lightweight context-based translations for the public portal.
import { useSyncExternalStore, type ReactNode } from "react";

export const LANGUAGES = [
  { code: "en", native: "English", english: "English", available: true },
  { code: "tw", native: "Twi", english: "Akan / Twi", available: true },
  { code: "gaa", native: "Gã", english: "Ga", available: false },
  { code: "ee", native: "Eʋegbe", english: "Ewe", available: false },
  { code: "ha", native: "Hausa", english: "Hausa", available: false },
] as const;
export type Lang = (typeof LANGUAGES)[number]["code"];

const en = {
  "home.title": "Report a cybercrime safely and easily.",
  "home.sub": "Speak or type in your own language. A Cyber Security Authority officer will review your report.",
  "tile.report": "Report an incident", "tile.report.hint": "Takes about 3 minutes. You can speak instead of typing.",
  "tile.track": "Track your report", "tile.track.hint": "Use your reference number",
  "tile.help": "Get human help", "tile.help.hint": "Call, WhatsApp or visit us",
  "tile.what": "What is a cybercrime?", "tile.what.hint": "Simple examples",
  "home.speak": "Prefer to speak to a person?", "call": "Call 292",
  "back": "Back", "continue": "Continue", "submit": "Submit report",
  "lang.title": "Choose your language", "mode.title": "How would you like to report?",
  "mode.voice": "Speak", "mode.voice.hint": "Record your voice. We will write it down.",
  "mode.guided": "Answer questions", "mode.guided.hint": "We guide you step by step.",
  "mode.text": "Type it", "mode.text.hint": "Write what happened.",
  "capture.title": "Tell us what happened", "review.title": "Check your report",
  "evidence.title": "Add screenshots or files", "contact.title": "How can we reach you?",
  "done.title": "Your report has been sent", "skip": "Skip to main content",
  "tap": "Tap to speak", "comingSoon": "Coming soon",
};
const tw: Partial<Record<keyof typeof en, string>> = {
  "home.title": "Bɔ cybercrime ho amanneɛ wɔ ahobammɔ mu.",
  "tile.report": "Bɔ amanneɛ", "tile.track": "Hwɛ wo amanneɛ", "tile.help": "Nya mmoa",
  "back": "San w'akyi", "continue": "Toa so", "submit": "Fa kɔ", "lang.title": "Yi wo kasa",
  "tap": "Mia na kasa", "call": "Frɛ 292",
};
const DICTS: Partial<Record<Lang, Partial<Record<keyof typeof en, string>>>> = { en, tw };
export type TKey = keyof typeof en;

// Module-level store: works regardless of provider placement or code-split chunk boundaries.
let current: Lang = "en";
const listeners = new Set<() => void>();
const subscribe = (fn: () => void) => { listeners.add(fn); return () => { listeners.delete(fn); }; };
const setLang = (l: Lang) => { current = l; listeners.forEach((fn) => fn()); };
const getLang = () => current;
const getServerLang = (): Lang => "en";

export function LanguageProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
export function useT() {
  const lang = useSyncExternalStore(subscribe, getLang, getServerLang);
  const t = (k: TKey) => DICTS[lang]?.[k] ?? en[k] ?? k;
  return { lang, setLang, t };
}
