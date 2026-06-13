import { Bell, Download, FolderOpen, Languages, Power, RefreshCw } from "lucide-react";
import type { ReleaseChannel } from "../data/apps";
import { LauncherButton } from "./LauncherButton";

export type LauncherSettings = {
  automaticUpdates: boolean;
  launchOnStartup: boolean;
  notifications: boolean;
  downloadFolder: string;
  releaseChannel: ReleaseChannel;
  language: string;
};

type Props = {
  settings: LauncherSettings;
  launcherVersion: string;
  launcherUpdateStatus: LauncherUpdateStatus | null;
  onChange: (settings: LauncherSettings) => void;
  onCheckLauncherUpdates: () => void;
  onToast: (message: string) => void;
};

export function SettingsPanel({
  settings,
  launcherVersion,
  launcherUpdateStatus,
  onChange,
  onCheckLauncherUpdates,
  onToast
}: Props) {
  function toggle(key: "automaticUpdates" | "launchOnStartup" | "notifications") {
    onChange({ ...settings, [key]: !settings[key] });
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
      <SettingsGroup title="Updates & System" description="Bestimme, wie sich der Launcher auf deinem Gerät verhält.">
        <SettingRow
          icon={RefreshCw}
          title={`Launcher v${launcherVersion}`}
          description={getLauncherUpdateText(launcherUpdateStatus)}
        >
          <LauncherButton
            className="h-9 px-3 text-xs"
            icon={<RefreshCw size={14} className={launcherUpdateStatus?.status === "checking" ? "animate-spin" : ""} />}
            onClick={onCheckLauncherUpdates}
            disabled={launcherUpdateStatus?.status === "checking" || launcherUpdateStatus?.status === "downloading"}
          >
            Update prüfen
          </LauncherButton>
        </SettingRow>
        <SettingRow icon={RefreshCw} title="Automatische Updates" description="Neue Versionen automatisch herunterladen">
          <Toggle checked={settings.automaticUpdates} onClick={() => toggle("automaticUpdates")} />
        </SettingRow>
        <SettingRow icon={Power} title="Beim Systemstart öffnen" description="LunaSuite nach der Anmeldung starten">
          <Toggle checked={settings.launchOnStartup} onClick={() => toggle("launchOnStartup")} />
        </SettingRow>
        <SettingRow icon={Bell} title="Benachrichtigungen" description="Über Updates und Installationen informieren">
          <Toggle checked={settings.notifications} onClick={() => toggle("notifications")} />
        </SettingRow>
      </SettingsGroup>

      <SettingsGroup title="Downloads" description="Speicherort und gewünschte Update-Quelle verwalten.">
        <SettingRow icon={FolderOpen} title="Download-Ordner" description={settings.downloadFolder}>
          <button
            className="rounded-lg bg-white px-3 py-2 text-xs font-medium text-black hover:bg-white/88"
            onClick={() => onToast("Ordnerauswahl wird später mit dem Desktop-Dateidialog verbunden.")}
          >
            Auswählen
          </button>
        </SettingRow>
        <SettingRow icon={Download} title="Update-Kanal" description="Quelle für neue Versionen">
          <select
            className="rounded-lg border border-white/10 bg-[#171719] px-3 py-2 text-xs text-white outline-none"
            value={settings.releaseChannel}
            onChange={(event) => onChange({ ...settings, releaseChannel: event.target.value as ReleaseChannel })}
          >
            <option value="stable">Stable</option>
            <option value="beta">Beta</option>
          </select>
        </SettingRow>
        <SettingRow icon={Languages} title="Sprache" description="Sprache der Benutzeroberfläche">
          <select
            className="rounded-lg border border-white/10 bg-[#171719] px-3 py-2 text-xs text-white outline-none"
            value={settings.language}
            onChange={(event) => onChange({ ...settings, language: event.target.value })}
          >
            <option>Deutsch</option>
            <option>English</option>
          </select>
        </SettingRow>
      </SettingsGroup>
    </div>
  );
}

function SettingsGroup({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="overflow-hidden rounded-[22px] border border-white/[0.09] bg-[#111113] shadow-card">
      <div className="border-b border-white/[0.07] p-6">
        <h2 className="text-lg font-semibold tracking-[-0.02em]">{title}</h2>
        <p className="mt-1 text-sm text-white/40">{description}</p>
      </div>
      <div>{children}</div>
    </section>
  );
}

function SettingRow({
  icon: Icon,
  title,
  description,
  children
}: {
  icon: typeof RefreshCw;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 border-b border-white/[0.06] px-6 py-5 last:border-0">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/[0.045] text-white/55">
        <Icon size={17} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-1 truncate text-xs text-white/36">{description}</p>
      </div>
      {children}
    </div>
  );
}

function Toggle({ checked, onClick }: { checked: boolean; onClick: () => void }) {
  return (
    <button
      className={`relative h-6 w-11 rounded-full transition ${checked ? "bg-white" : "bg-white/[0.12]"}`}
      onClick={onClick}
      aria-pressed={checked}
    >
      <span className={`absolute top-0.5 h-[18px] w-[18px] rounded-full transition ${checked ? "left-[22px] bg-black" : "left-0.5 bg-white/45"}`} />
    </button>
  );
}

function getLauncherUpdateText(status: LauncherUpdateStatus | null) {
  if (!status) return "Launcher-Updates werden hier verwaltet";
  if (status.status === "checking") return "Neue Version wird gesucht";
  if (status.status === "available") return `Version ${status.version} ist verfügbar`;
  if (status.status === "not-available") return "Installierte Version ist aktuell";
  if (status.status === "downloading") return `Download läuft: ${Math.round(status.percent)} %`;
  if (status.status === "downloaded") return `Version ${status.version} ist installationsbereit`;
  return `Updateprüfung fehlgeschlagen: ${status.message}`;
}
