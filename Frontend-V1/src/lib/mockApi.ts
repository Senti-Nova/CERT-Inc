// Synthetic fixtures only. No real victim information.
export type Category = "phishing" | "investment_scam" | "romance_scam" | "loan_fraud" | "account_compromise" | "sextortion" | "malware" | "identity_theft" | "platform_abuse" | "other";
export type Priority = "low" | "medium" | "high" | "urgent";
export type Status = "new" | "triaged" | "assigned" | "in_progress" | "closed";
export type Channel = "voice" | "text" | "guided";
export interface Evidence { id: string; name: string; sizeKb: number; type: string }
export interface TimelineEntry { at: string; actor: string; action: string }
export interface Case {
  id: string; ref: string; createdAt: string; channel: Channel; language: string; summary: string;
  transcript?: string | undefined; suggestedCategory: Category; confirmedCategory?: Category | undefined; priority: Priority;
  status: Status; assignee?: string | undefined; evidence: Evidence[]; timeline: TimelineEntry[];
}

export const CATEGORY_LABELS: Record<Category, string> = {
  phishing: "Phishing", investment_scam: "Investment scam", romance_scam: "Romance scam", loan_fraud: "Loan app fraud",
  account_compromise: "Account compromise", sextortion: "Sextortion", malware: "Malware", identity_theft: "Identity theft",
  platform_abuse: "Platform abuse", other: "Other",
};
export const PRIORITY_LABELS: Record<Priority, string> = { low: "Low", medium: "Medium", high: "High", urgent: "Urgent" };
export const STATUS_LABELS: Record<Status, string> = { new: "New", triaged: "Triaged", assigned: "Assigned", in_progress: "In progress", closed: "Closed" };
export const OFFICERS = ["Officer A. Mensah", "Officer K. Boateng", "Officer E. Owusu", "Officer F. Addo"];

const h = (n: number) => new Date(Date.now() - n * 3600_000).toISOString();

const cases: Case[] = [
  { id: "c1", ref: "CSA-2027-00412", createdAt: h(2), channel: "voice", language: "Twi",
    summary: "WhatsApp message pretending to be my bank asked for PIN",
    transcript: "I received a WhatsApp message saying my bank account will be blocked. They sent a link and asked for my PIN. I entered it and later saw money leave my account.",
    suggestedCategory: "phishing", priority: "high", status: "new",
    evidence: [{ id: "e1", name: "whatsapp-screenshot.jpg", sizeKb: 214, type: "image/jpeg" }],
    timeline: [{ at: h(2), actor: "Citizen", action: "Report submitted by voice" }] },
  { id: "c2", ref: "CSA-2027-00411", createdAt: h(9), channel: "guided", language: "English",
    summary: "Fake loan app is harassing my contacts",
    transcript: "I borrowed from a loan app. Now they are calling all my contacts and sending edited photos of me, demanding I pay double.",
    suggestedCategory: "loan_fraud", confirmedCategory: "loan_fraud", priority: "urgent", status: "assigned", assignee: "Officer A. Mensah",
    evidence: [{ id: "e2", name: "call-log.pdf", sizeKb: 88, type: "application/pdf" }, { id: "e3", name: "threat-sms.png", sizeKb: 132, type: "image/png" }],
    timeline: [{ at: h(9), actor: "Citizen", action: "Report submitted (guided)" }, { at: h(7), actor: "Officer K. Boateng", action: "Priority set to Urgent" }, { at: h(6), actor: "Officer K. Boateng", action: "Assigned to Officer A. Mensah" }] },
  { id: "c3", ref: "CSA-2027-00409", createdAt: h(26), channel: "text", language: "English",
    summary: "Suspicious email attachment opened at work",
    transcript: "An email claiming to be an invoice had a zip file. I opened it and my computer became slow and showed strange pop-ups.",
    suggestedCategory: "malware", priority: "medium", status: "triaged", evidence: [],
    timeline: [{ at: h(26), actor: "Citizen", action: "Report submitted by text" }, { at: h(20), actor: "Officer E. Owusu", action: "Status changed to Triaged" }] },
];

let seq = 413;
export const listCases = (): Case[] => [...cases].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
export const getCase = (id: string) => cases.find((c) => c.id === id);
export const getCaseByRef = (ref: string) => cases.find((c) => c.ref.toLowerCase() === ref.trim().toLowerCase());

export interface ReportInput { channel: Channel; language: string; text: string; category: Category; evidence: Evidence[]; contact: { name?: string; phone?: string; email?: string } }
export function createReport(input: ReportInput): Case {
  const now = new Date().toISOString();
  const c: Case = {
    id: `c${seq}`, ref: `CSA-2027-${String(seq++).padStart(5, "0")}`, createdAt: now, channel: input.channel, language: input.language,
    summary: input.text.slice(0, 80) || "Report without description", transcript: input.text, suggestedCategory: input.category,
    priority: "medium", status: "new", evidence: input.evidence,
    timeline: [{ at: now, actor: "Citizen", action: `Report submitted (${input.channel})` }],
  };
  cases.push(c);
  return c;
}
export function updateCase(id: string, patch: Partial<Case>, actor: string, action: string) {
  const c = getCase(id);
  if (!c) return undefined;
  Object.assign(c, patch);
  c.timeline.push({ at: new Date().toISOString(), actor, action });
  return c;
}
export async function transcribe(_blob: Blob, language: string): Promise<string> {
  await new Promise((r) => setTimeout(r, 1400));
  return language === "tw"
    ? "(Translated from Twi) Someone called saying they are from my bank and asked for the code sent to my phone."
    : "Someone called saying they are from my bank and asked for the code sent to my phone. After I gave it, money was taken from my mobile money account.";
}
const RULES: [Category, RegExp][] = [
  ["phishing", /bank|pin|code|link|otp|password/i], ["loan_fraud", /loan|borrow/i], ["investment_scam", /invest|crypto|profit/i],
  ["romance_scam", /love|relationship|dating/i], ["sextortion", /nude|photo|video.*pay/i], ["malware", /virus|attachment|zip|pop-up/i],
  ["account_compromise", /hack|account.*(stolen|taken)/i], ["identity_theft", /identity|ghana card/i],
];
export function suggestCategory(text: string): { category: Category; confidence: number } {
  const hit = RULES.find(([, r]) => r.test(text));
  return hit ? { category: hit[0], confidence: 0.82 } : { category: "other", confidence: 0.4 };
}
