import { CalendarDays, FileText, X } from "lucide-react";
import type { LauncherApp } from "../data/apps";

type Props = {
  apps: LauncherApp[];
  onClose?: () => void;
};

export function ReleaseNotesPanel({ apps, onClose }: Props) {
  const releasedApps = apps.filter((app) => !app.comingSoon);
  return (
    <section className="overflow-hidden rounded-[22px] border border-white/[0.09] bg-[#111113] shadow-card">
      <div className="flex items-center justify-between border-b border-white/[0.07] p-6">
        <div>
          <h2 className="text-lg font-semibold">Release Notes</h2>
          <p className="mt-1 text-sm text-white/40">Changelogs aller veröffentlichten LunaSuite Apps.</p>
        </div>
        {onClose ? <button className="grid h-9 w-9 place-items-center rounded-xl text-white/45 hover:bg-white/[0.06] hover:text-white" onClick={onClose}><X size={18} /></button> : null}
      </div>
      <div>
        {releasedApps.map((app) => (
          <article key={app.id} className="border-b border-white/[0.06] p-6 last:border-0">
            <div className="flex items-start gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/[0.05]"><FileText size={18} /></span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-medium">{app.name} {app.latestVersion ? `v${app.latestVersion}` : ""}</h3>
                  <span className="inline-flex items-center gap-1.5 text-xs text-white/32"><CalendarDays size={13} />{app.lastUpdated ?? "Kein Datum"}</span>
                </div>
                <p className="mt-3 whitespace-pre-line text-sm leading-6 text-white/45">{app.releaseNotes}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
