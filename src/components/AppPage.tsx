import { ArrowLeft, CalendarClock, CheckCircle2, Download, FolderOpen, Play, RefreshCw, ShieldCheck } from "lucide-react";
import { appIcons, type LauncherApp } from "../data/apps";
import { LauncherButton } from "./LauncherButton";
import { StatusBadge } from "./StatusBadge";

type Props = {
  app: LauncherApp;
  checking: boolean;
  progress?: number;
  onBack: () => void;
  onCheck: () => void;
  onAction: (app: LauncherApp, action: "download" | "launch" | "update") => void;
};

export function AppPage({ app, checking, progress, onBack, onCheck, onAction }: Props) {
  const Icon = appIcons[app.icon];
  const downloading = progress !== undefined && progress < 100;

  return (
    <div>
      <button className="mb-7 inline-flex items-center gap-2 text-sm text-white/45 hover:text-white" onClick={onBack}>
        <ArrowLeft size={16} />
        Zurück zur Übersicht
      </button>

      <section className="overflow-hidden rounded-[24px] border border-white/[0.09] bg-[#111113] shadow-card">
        <div className="flex flex-col gap-6 border-b border-white/[0.07] p-6 sm:p-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex gap-5">
            <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.05]">
              {app.iconPath ? (
                <img className="h-full w-full object-cover" src={app.iconPath} alt="" />
              ) : (
                <Icon size={30} strokeWidth={1.6} />
              )}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-semibold tracking-[-0.04em]">{app.name}</h1>
                <StatusBadge status={app.status} />
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/48">{app.description}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {app.comingSoon ? (
              <LauncherButton disabled>Coming Soon</LauncherButton>
            ) : (
              <>
                <LauncherButton
                  variant={app.updateAvailable ? "primary" : "secondary"}
                  icon={app.updateAvailable ? <RefreshCw size={16} /> : app.installed ? <Play size={16} /> : <Download size={16} />}
                  disabled={downloading}
                  onClick={() => onAction(app, app.updateAvailable ? "update" : app.installed ? "launch" : "download")}
                >
                  {app.updateAvailable ? "Update installieren" : app.installed ? "Starten" : "Herunterladen"}
                </LauncherButton>
                <LauncherButton icon={<RefreshCw size={16} className={checking ? "animate-spin" : ""} />} disabled={checking} onClick={onCheck}>
                  Version prüfen
                </LauncherButton>
              </>
            )}
          </div>
        </div>

        {downloading ? (
          <div className="border-b border-white/[0.07] px-6 py-4 sm:px-8">
            <div className="mb-2 flex justify-between text-xs text-white/48">
              <span>Download und Prüfung</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
              <div className="h-full bg-white transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : null}

        <div className="grid gap-px bg-white/[0.06] sm:grid-cols-2 xl:grid-cols-4">
          <InfoCard icon={CheckCircle2} label="Installierte Version" value={app.version ? `v${app.version}` : "Nicht installiert"} />
          <InfoCard icon={CalendarClock} label="Neueste Version" value={app.latestVersion ? `v${app.latestVersion}` : "Noch nicht verfügbar"} />
          <InfoCard icon={ShieldCheck} label="Update-Status" value={app.updateAvailable ? "Update verfügbar" : app.installed ? "Aktuell" : "Bereit zum Download"} />
          <InfoCard icon={FolderOpen} label="Update-Kanal" value={app.releaseChannel === "stable" ? "Stable" : "Beta"} />
        </div>

        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_320px]">
          <div>
            <h2 className="text-lg font-semibold">Über {app.name}</h2>
            <p className="mt-3 text-sm leading-7 text-white/45">
              {app.comingSoon
                ? `${app.name} befindet sich aktuell in Entwicklung. Sobald eine erste Version verfügbar ist, kann sie direkt über den LunaSuite Launcher installiert und aktualisiert werden.`
                : "LunaMail wird zentral über den LunaSuite Launcher verwaltet. Der Launcher prüft die installierte Windows-Version gegen die neueste stabile GitHub-Veröffentlichung."}
            </p>
            {app.releaseNotes ? (
              <>
                <h3 className="mt-7 text-sm font-semibold">Aktuelle Release Notes</h3>
                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-white/42">{app.releaseNotes}</p>
              </>
            ) : null}
          </div>

          <aside className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
            <h3 className="text-sm font-semibold">App-Informationen</h3>
            <dl className="mt-4 space-y-4 text-xs">
              <Detail label="Status" value={app.comingSoon ? "Coming Soon" : app.installed ? "Installiert" : "Verfügbar"} />
              <Detail label="Letzte Veröffentlichung" value={app.lastUpdated ?? "Noch nicht verfügbar"} />
              <Detail label="Downloadgröße" value={app.size ?? "Noch nicht verfügbar"} />
            </dl>
          </aside>
        </div>
      </section>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value }: { icon: typeof CheckCircle2; label: string; value: string }) {
  return <div className="bg-[#111113] p-5"><Icon size={17} className="mb-4 text-white/50" /><p className="text-xs text-white/32">{label}</p><p className="mt-1 text-sm font-medium">{value}</p></div>;
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-4"><dt className="text-white/32">{label}</dt><dd className="text-right text-white/65">{value}</dd></div>;
}
