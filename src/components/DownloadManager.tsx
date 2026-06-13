import { CheckCircle2, Clock3, Download, LoaderCircle, PackageCheck, Wrench } from "lucide-react";
import type { InstallationState, InstallationTask } from "../services/installService";

type Props = {
  tasks: InstallationTask[];
};

const stateLabels: Record<InstallationState, string> = {
  queued: "Warteschlange",
  downloading: "Download läuft",
  downloaded: "Download abgeschlossen",
  installing: "Installation läuft",
  installed: "Installation abgeschlossen",
  failed: "Fehlgeschlagen"
};

const stateIcons = {
  queued: Clock3,
  downloading: Download,
  downloaded: PackageCheck,
  installing: Wrench,
  installed: CheckCircle2,
  failed: Clock3
} satisfies Record<InstallationState, typeof Clock3>;

export function DownloadManager({ tasks }: Props) {
  return (
    <section className="overflow-hidden rounded-[22px] border border-white/[0.09] bg-[#111113] shadow-card">
      <div className="border-b border-white/[0.07] p-6">
        <h2 className="text-lg font-semibold">Download Manager</h2>
        <p className="mt-1 text-sm text-white/40">Warteschlange, Downloads und Installationen zentral verfolgen.</p>
      </div>

      {tasks.length === 0 ? (
        <div className="p-12 text-center">
          <Download size={24} className="mx-auto text-white/25" />
          <p className="mt-4 text-sm text-white/42">Die Download-Warteschlange ist leer.</p>
        </div>
      ) : (
        <div>
          {tasks.map((task) => {
            const Icon = stateIcons[task.state];
            const active = task.state === "downloading" || task.state === "installing";
            return (
              <article key={task.id} className="flex flex-col gap-4 border-b border-white/[0.06] p-6 last:border-0 sm:flex-row sm:items-center">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/[0.05] text-white/65">
                  {active ? <LoaderCircle size={19} className="animate-spin" /> : <Icon size={19} />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-medium">{task.appName}</h3>
                      <p className="mt-1 text-xs text-white/38">{stateLabels[task.state]} · {task.message}</p>
                    </div>
                    <span className="text-xs text-white/42">{task.progress}%</span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                    <div className="h-full rounded-full bg-white transition-all duration-300" style={{ width: `${task.progress}%` }} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
