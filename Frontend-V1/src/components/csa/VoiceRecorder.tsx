// Microphone recorder with live level meter and accessible state announcements.
import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Mic, RotateCcw, Square } from "lucide-react";
import { Button } from "./ui";
import { useT } from "@/lib/i18n";

type Phase = "idle" | "recording" | "stopped" | "denied";

export function VoiceRecorder({ onRecorded }: { onRecorded: (blob: Blob) => void }) {
  const { t } = useT();
  const [phase, setPhase] = useState<Phase>("idle");
  const [secs, setSecs] = useState(0);
  const [level, setLevel] = useState(0);
  const [url, setUrl] = useState<string>();
  const rec = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const raf = useRef(0);
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const ctx = useRef<AudioContext | null>(null);

  const cleanup = () => {
    cancelAnimationFrame(raf.current);
    clearInterval(timer.current);
    stream.current?.getTracks().forEach((tr) => tr.stop());
    ctx.current?.close().catch(() => undefined);
    stream.current = null; ctx.current = null;
  };
  useEffect(() => () => { cleanup(); if (url) URL.revokeObjectURL(url); }, [url]);

  const start = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.current = s;
      const chunks: Blob[] = [];
      const r = new MediaRecorder(s);
      r.ondataavailable = (e) => chunks.push(e.data);
      r.onstop = () => {
        const blob = new Blob(chunks, { type: r.mimeType });
        setUrl(URL.createObjectURL(blob));
        onRecorded(blob);
      };
      rec.current = r; r.start();
      const ac = new AudioContext(); ctx.current = ac;
      const an = ac.createAnalyser(); ac.createMediaStreamSource(s).connect(an);
      const data = new Uint8Array(an.frequencyBinCount);
      const tick = () => { an.getByteFrequencyData(data); setLevel(data.reduce((a, b) => a + b, 0) / data.length / 128); raf.current = requestAnimationFrame(tick); };
      tick();
      setSecs(0); timer.current = setInterval(() => setSecs((x) => x + 1), 1000);
      setPhase("recording");
    } catch { setPhase("denied"); }
  };
  const stop = () => { rec.current?.stop(); cleanup(); setPhase("stopped"); };
  const again = () => { if (url) URL.revokeObjectURL(url); setUrl(undefined); setPhase("idle"); };
  const mmss = `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`;

  return (
    <div className="flex flex-col items-center gap-5 rounded-xl2 bg-white p-6 text-center shadow-card">
      <p aria-live="polite" className="sr-only">
        {phase === "recording" ? "Recording started" : phase === "stopped" ? "Recording stopped" : phase === "denied" ? "Microphone access denied" : ""}
      </p>
      {phase === "idle" && (
        <button type="button" onClick={start} className="flex flex-col items-center gap-3 rounded-full">
          <span className="grid size-28 place-items-center rounded-full bg-navy-900 text-white hover:bg-navy-800"><Mic className="size-12" aria-hidden /></span>
          <span className="text-lg font-bold text-ink">{t("tap")}</span>
        </button>
      )}
      {phase === "recording" && (
        <>
          <span className="grid size-28 place-items-center rounded-full bg-cyan-700 text-white animate-rec-glow" style={{ transform: `scale(${1 + Math.min(level, 1) * 0.12})` }}>
            <Mic className="size-12" aria-hidden />
          </span>
          <p className="font-mono text-2xl font-bold text-ink" aria-label={`Recording time ${mmss}`}>{mmss}</p>
          <Button variant="danger" size="lg" onClick={stop} icon={<Square className="size-5" aria-hidden />}>Stop</Button>
        </>
      )}
      {phase === "stopped" && url && (
        <>
          <audio controls src={url} className="w-full" />
          <Button variant="secondary" onClick={again} icon={<RotateCcw className="size-5" aria-hidden />}>Record again</Button>
        </>
      )}
      {phase === "denied" && (
        <div role="alert" className="flex w-full items-start gap-3 rounded-xl border-2 border-warning-500 bg-warning-50 p-4 text-left text-ink">
          <AlertTriangle className="mt-1 size-5 shrink-0 text-warning-500" aria-hidden />
          <div>
            <p className="font-bold">We could not use your microphone.</p>
            <p>Allow microphone access in your browser, or go back and choose “Type it”.</p>
            <Button variant="secondary" className="mt-3" onClick={() => setPhase("idle")}>Try again</Button>
          </div>
        </div>
      )}
    </div>
  );
}
