import { Check, Download, ExternalLink, Play, RefreshCw } from "lucide-react";
import { appIcons, type LauncherApp } from "../data/apps";
import { LauncherButton } from "./LauncherButton";
import { StatusBadge } from "./StatusBadge";

type Props = {
  app: LauncherApp;
  progress?: number;
  onAction: (app: LauncherApp, action: "download" | "launch" | "update" | "details") => void;
};

export function AppCard({ app, progress, onAction }: Props) {
  const Icon = appIcons[app.icon];
  const downloading = progress !== undefined && progress < 100;

  return (
    <article className="app-card-enter group flex min-h-[312px] flex-col rounded-[20px] border border-white/[0.09] bg-[#111113] p-5 shadow-card transition-[transform,border-color,background-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-white/[0.16] hover:bg-[#141416] hover:shadow-2xl">
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-[24px] text-white shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
          {app.iconPath ? (
            <img className="h-full w-full object-cover" src={app.iconPath} alt="" />
          ) : (
            <Icon size={24} strokeWidth={1.65} />
          )}
        </div>
        <StatusBadge status={app.status} />
      </div>

      <div className="mt-7">
        <h2 className="text-[20px] font-semibold tracking-[-0.03em]">{app.name}</h2>
        <p className="mt-2 min-h-12 text-sm leading-6 text-white/48">{app.description}</p>
      </div>

      <div className="mt-auto pt-5">
        <div className="mb-4 flex items-center justify-between gap-3 border-t border-white/[0.065] pt-4 text-xs">
          <span className="text-white/32">Version</span>
          <span className="truncate text-right text-white/62">
            {app.comingSoon ? "Noch nicht verfügbar" : `v${app.latestVersion}`}
          </span>
        </div>

        {downloading ? (
          <div className="mb-3">
            <div className="mb-2 flex items-center justify-between text-[11px] text-white/50">
              <span>Wird heruntergeladen</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-white/[0.07]">
              <div className="h-full rounded-full bg-white transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : null}

        <div className="flex gap-2">
          {app.comingSoon ? (
            <LauncherButton className="w-full" disabled>
              Coming Soon
            </LauncherButton>
          ) : (
            <>
              <LauncherButton
                className="min-w-0 flex-1"
                variant={app.updateAvailable ? "primary" : "secondary"}
                icon={app.updateAvailable ? <RefreshCw size={15} /> : app.installed ? <Play size={15} /> : <Download size={15} />}
                disabled={downloading}
                onClick={() => onAction(app, app.updateAvailable ? "update" : app.installed ? "launch" : "download")}
              >
                {app.updateAvailable ? "Aktualisieren" : app.installed ? "Starten" : "Download"}
              </LauncherButton>
              <LauncherButton
                className="w-10 shrink-0 px-0"
                variant="ghost"
                icon={app.installed ? <Check size={15} /> : <ExternalLink size={15} />}
                aria-label={`${app.name} Details`}
                onClick={() => onAction(app, "details")}
              />
            </>
          )}
        </div>
      </div>
    </article>
  );
}
