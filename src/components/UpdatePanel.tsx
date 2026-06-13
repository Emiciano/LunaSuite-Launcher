import { CheckCircle2, ChevronRight, Clock3, History, RefreshCw, ShieldCheck } from "lucide-react";
import type { LauncherApp } from "../data/apps";
import { updateHistory } from "../data/apps";
import { LauncherButton } from "./LauncherButton";

type Props = {
  apps: LauncherApp[];
  checking: boolean;
  lastChecked: string;
  onCheckUpdates: () => void;
  onOpenReleaseNotes: () => void;
};

export function UpdatePanel({ apps, checking, lastChecked, onCheckUpdates, onOpenReleaseNotes }: Props) {
  const updates = apps.filter((app) => app.updateAvailable);
  const installed = apps.filter((app) => app.installed);

  return (
    <section className="grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
      <article className="overflow-hidden rounded-[22px] border border-white/[0.09] bg-[#111113] shadow-card">
        <div className="flex flex-col gap-5 border-b border-white/[0.07] p-6 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.05]">
              <RefreshCw size={21} />
            </div>
            <h2 className="text-xl font-semibold tracking-[-0.03em]">Zentrale Updates</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/46">
              Alle LunaSuite Apps werden direkt über den Launcher aktualisiert. Angezeigt werden nur tatsächlich verfügbare Updates.
            </p>
          </div>
          <LauncherButton
            variant={updates.length > 0 ? "primary" : "secondary"}
            icon={<RefreshCw size={15} className={checking ? "animate-spin" : ""} />}
            onClick={onCheckUpdates}
            disabled={checking}
          >
            {checking ? "Prüfe Updates" : "Jetzt prüfen"}
          </LauncherButton>
        </div>

        <div className="grid gap-px bg-white/[0.06] sm:grid-cols-3">
          <UpdateStat
            icon={updates.length > 0 ? RefreshCw : CheckCircle2}
            label={updates.length > 0 ? `${updates.length} Update${updates.length === 1 ? "" : "s"}` : "Alles aktuell"}
            value={updates.length > 0 ? updates.map((app) => `${app.name} ${app.version}`).join(", ") : "Keine neuen Versionen verfügbar"}
          />
          <UpdateStat icon={ShieldCheck} label="Installierte Apps" value={`${installed.length} erkannt`} />
          <UpdateStat icon={Clock3} label="Letzte Prüfung" value={lastChecked} />
        </div>

        <button
          className="flex w-full items-center justify-between px-6 py-4 text-left text-sm text-white/68 transition hover:bg-white/[0.035] hover:text-white"
          onClick={onOpenReleaseNotes}
        >
          <span className="flex items-center gap-3"><History size={17} />Update-Verlauf und Release Notes anzeigen</span>
          <ChevronRight size={17} />
        </button>
      </article>

      <article className="rounded-[22px] border border-white/[0.09] bg-[#111113] p-6 shadow-card">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.05]"><ShieldCheck size={19} /></span>
          <div><h2 className="font-semibold">Sicher installiert</h2><p className="mt-1 text-sm leading-6 text-white/42">Downloads werden vor der Installation geprüft.</p></div>
        </div>
        <div className="mt-6 space-y-1">
          {updateHistory.map((item) => (
            <div key={item.version} className="flex items-start justify-between gap-4 border-b border-white/[0.06] py-3 last:border-0">
              <div><p className="text-sm font-medium">{item.version}</p><p className="mt-1 text-xs text-white/38">{item.note}</p></div>
              <span className="shrink-0 text-[11px] text-white/28">{item.date}</span>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

function UpdateStat({ icon: Icon, label, value }: { icon: typeof RefreshCw; label: string; value: string }) {
  return <div className="bg-[#111113] px-6 py-5"><Icon size={17} className="mb-4 text-white/55" /><p className="text-sm font-medium">{label}</p><p className="mt-1 text-xs text-white/38">{value}</p></div>;
}
