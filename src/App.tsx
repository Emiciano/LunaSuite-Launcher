import { CheckCircle2, ChevronDown, ExternalLink, FileText, HelpCircle, Info, LogOut, Settings, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppCard } from "./components/AppCard";
import { AppPage } from "./components/AppPage";
import { DownloadManager } from "./components/DownloadManager";
import { Header } from "./components/Header";
import { LauncherUpdatePrompt } from "./components/LauncherUpdatePrompt";
import { ReleaseNotesPanel } from "./components/ReleaseNotesPanel";
import { SettingsPanel, type LauncherSettings } from "./components/SettingsPanel";
import { Sidebar, type NavigationId } from "./components/Sidebar";
import { UpdatePanel } from "./components/UpdatePanel";
import { appRegistry, updateHistory, type LauncherApp } from "./data/apps";
import { getInstalledApps, installApp, type InstallationTask } from "./services/installService";
import { checkForUpdates, downloadUpdate } from "./services/updateService";

type Filter = "all" | "installed" | "updates" | "coming-soon";

const pageCopy: Record<NavigationId, { title: string; subtitle: string }> = {
  overview: { title: "LunaSuite Launcher", subtitle: "Installiere, starte und aktualisiere deine LunaSuite Apps an einem Ort." },
  apps: { title: "Meine Apps", subtitle: "Alle verfügbaren und kommenden LunaSuite Apps in einer Übersicht." },
  updates: { title: "Updates", subtitle: "Nur tatsächlich verfügbare Aktualisierungen werden hier angezeigt." },
  downloads: { title: "Downloads", subtitle: "Behalte laufende und abgeschlossene Installationen im Blick." },
  settings: { title: "Einstellungen", subtitle: "Passe Update-Verhalten, Speicherort und Launcher-Optionen an." },
  support: { title: "Hilfe & Support", subtitle: "Antworten, Systeminformationen und direkte Hilfe für LunaSuite." }
};

export default function App() {
  const [activePage, setActivePage] = useState<NavigationId>("overview");
  const [activeAppId, setActiveAppId] = useState<string | null>(null);
  const [apps, setApps] = useState<LauncherApp[]>(() => appRegistry.map((app) => ({ ...app })));
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [checking, setChecking] = useState(false);
  const [launcherVersion, setLauncherVersion] = useState("0.0.18");
  const [launcherUpdateStatus, setLauncherUpdateStatus] = useState<LauncherUpdateStatus | null>(null);
  const [lastChecked, setLastChecked] = useState("Noch nicht geprüft");
  const [tasks, setTasks] = useState<InstallationTask[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [releaseNotesOpen, setReleaseNotesOpen] = useState(false);
  const [settings, setSettings] = useState<LauncherSettings>({
    automaticUpdates: true,
    launchOnStartup: false,
    notifications: true,
    downloadFolder: "C:\\Users\\Alex\\Downloads\\LunaSuite",
    releaseChannel: "stable",
    language: "Deutsch"
  });
  const toastTimer = useRef<number | null>(null);

  const activeApp = apps.find((app) => app.id === activeAppId) ?? null;
  const filteredApps = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return apps.filter((app) => {
      const matchesQuery = !normalized || `${app.name} ${app.description}`.toLowerCase().includes(normalized);
      const matchesFilter =
        filter === "all"
        || (filter === "installed" && app.installed)
        || (filter === "updates" && app.updateAvailable)
        || (filter === "coming-soon" && app.comingSoon);
      return matchesQuery && matchesFilter;
    });
  }, [apps, filter, query]);

  useEffect(() => {
    void getInstalledApps().then((installedIds) => {
      setApps((current) => current.map((app) => installedIds.includes(app.id) ? { ...app, installed: true, status: "installed" } : app));
    });
    void checkUpdates(false);
    void window.lunaSuite?.getLauncherVersion().then(setLauncherVersion);
    return window.lunaSuite?.onLauncherUpdateStatus(setLauncherUpdateStatus);
  }, []);

  useEffect(() => {
    return window.lunaSuite?.onAppInstallStatus((status) => {
      updateTask({
        id: status.taskId,
        appId: status.appId,
        appName: status.appName,
        state: status.state,
        progress: status.progress,
        message: status.message,
        createdAt: new Date().toISOString()
      });
    });
  }, []);

  function showToast(message: string) {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 3200);
  }

  async function checkUpdates(showResult = true) {
    setChecking(true);
    try {
      const results = await checkForUpdates(apps);
      setApps((current) => current.map((app) => {
        const result = results.find((item) => item.appId === app.id);
        if (!result) return app;
        return {
          ...app,
          installed: result.installed,
          version: result.installedVersion,
          latestVersion: result.latestVersion,
          updateAvailable: result.updateAvailable,
          status: result.updateAvailable ? "update" : result.installed ? "installed" : "available",
          downloadUrl: result.downloadUrl,
          releaseNotes: result.releaseNotes,
          lastUpdated: result.publishedAt ? new Date(result.publishedAt).toLocaleDateString("de-DE") : app.lastUpdated
        };
      }));
      if (showResult) {
        const available = results.filter((result) => result.updateAvailable);
        showToast(available.length > 0 ? `${available.length} Update${available.length === 1 ? "" : "s"} verfügbar.` : "Alle installierten Apps sind aktuell.");
      }
    } catch (error) {
      if (showResult) showToast(`Versionsprüfung fehlgeschlagen: ${error instanceof Error ? error.message : "Unbekannter Fehler"}`);
    } finally {
      setChecking(false);
      setLastChecked("Gerade eben");
    }
  }

  async function checkLauncherUpdates() {
    if (!window.lunaSuite) {
      showToast("Launcher-Updates sind nur in der installierten Desktop-App verfügbar.");
      return;
    }
    try {
      await window.lunaSuite.checkLauncherUpdates();
    } catch (error) {
      showToast(`Launcher-Updateprüfung fehlgeschlagen: ${error instanceof Error ? error.message : "Unbekannter Fehler"}`);
    }
  }

  function updateTask(task: InstallationTask) {
    setTasks((current) => {
      const exists = current.some((item) => item.id === task.id);
      return exists ? current.map((item) => item.id === task.id ? task : item) : [task, ...current];
    });
  }

  async function runInstall(app: LauncherApp) {
    navigate("downloads");
    try {
      const task = await installApp(app, updateTask);
      setApps((current) => current.map((item) => item.id === app.id ? { ...item, installed: true, version: item.latestVersion, updateAvailable: false, status: "installed" } : item));
      showToast(`${task.appName}: Installation abgeschlossen.`);
      void checkUpdates(false);
    } catch (error) {
      showToast(`${app.name}: Installation fehlgeschlagen: ${error instanceof Error ? error.message : "Unbekannter Fehler"}`);
    }
  }

  async function runUpdate(app: LauncherApp) {
    navigate("downloads");
    try {
      const installed = await downloadUpdate(app, updateTask);
      setApps((current) => current.map((item) => item.id === app.id ? { ...item, installed: true, version: item.latestVersion, updateAvailable: false, status: "installed" } : item));
      showToast(`${installed.appName}: Update installiert.`);
      void checkUpdates(false);
    } catch (error) {
      showToast(`${app.name}: Update fehlgeschlagen: ${error instanceof Error ? error.message : "Unbekannter Fehler"}`);
    }
  }

  async function launchApp(app: LauncherApp) {
    try {
      if (!window.lunaSuite?.launchApp) throw new Error("App-Start ist nur in der installierten Desktop-App verfügbar.");
      await window.lunaSuite?.launchApp(app.id);
      showToast(`${app.name} wird gestartet.`);
    } catch (error) {
      showToast(`${app.name} konnte nicht gestartet werden: ${error instanceof Error ? error.message : "Unbekannter Fehler"}`);
    }
  }

  function handleAppAction(app: LauncherApp, action: "download" | "launch" | "update" | "details") {
    if (action === "details") {
      setActiveAppId(app.id);
      return;
    }
    if (action === "launch") {
      void launchApp(app);
      return;
    }
    if (action === "update") {
      void runUpdate(app);
    } else {
      void runInstall(app);
    }
  }

  function navigate(page: NavigationId) {
    setActiveAppId(null);
    setActivePage(page);
  }

  const copy = pageCopy[activePage];
  const showAppGrid = !activeApp && (activePage === "overview" || activePage === "apps");

  return (
    <div className="h-screen overflow-hidden bg-[#050505] text-white lg:p-3">
      <div className="mx-auto flex h-full max-w-[1660px] overflow-hidden bg-[#050505] lg:rounded-[24px]">
        <Sidebar
          active={activePage}
          activeAppId={activeAppId}
          apps={apps}
          open={menuOpen}
          onNavigate={navigate}
          onSelectApp={(appId) => setActiveAppId(appId)}
          onClose={() => setMenuOpen(false)}
        />

        <main className="content-scroll relative min-w-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#0d0d0e] px-5 py-5 sm:px-7 lg:rounded-[24px] lg:border lg:border-white/[0.07] lg:px-8 lg:py-6 xl:px-9">
          <AccountMenu
            open={accountOpen}
            onToggle={() => setAccountOpen((current) => !current)}
            onNavigate={(page) => {
              setAccountOpen(false);
              navigate(page);
            }}
          />
          <div key={activeApp?.id ?? activePage} className="page-enter">
          {activeApp ? (
            <AppPage
              app={activeApp}
              checking={checking}
              progress={tasks.find((task) => task.appId === activeApp.id)?.progress}
              onBack={() => setActiveAppId(null)}
              onCheck={() => void checkUpdates()}
              onAction={handleAppAction}
            />
          ) : (
            <>
              <Header
                title={copy.title}
                subtitle={copy.subtitle}
                query={query}
                showSearch={showAppGrid}
                showUpdateButton={activePage === "updates"}
                hideCopy={showAppGrid}
                checking={checking}
                onQueryChange={setQuery}
                onCheckUpdates={() => void checkUpdates()}
                onOpenMenu={() => setMenuOpen(true)}
              />

              {showAppGrid ? (
                <>
                  <div className="mb-5 grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                    <h2 className="text-lg font-semibold tracking-[-0.025em]">{activePage === "overview" ? "Deine Apps" : "App-Bibliothek"}</h2>
                    <div className="scrollbar-hidden flex gap-1 overflow-x-auto rounded-xl border border-white/[0.08] bg-white/[0.025] p-1">
                      {([["all", "Alle"], ["installed", "Installiert"], ["updates", "Updates"], ["coming-soon", "Coming Soon"]] as const).map(([id, label]) => (
                        <button key={id} className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs transition ${filter === id ? "bg-white text-black" : "text-white/45 hover:bg-white/[0.05] hover:text-white"}`} onClick={() => setFilter(id)}>
                          {label}
                        </button>
                      ))}
                    </div>
                    <div aria-hidden="true" />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {filteredApps.map((app) => <AppCard key={app.id} app={app} progress={tasks.find((task) => task.appId === app.id)?.progress} onAction={handleAppAction} />)}
                  </div>
                  {filteredApps.length === 0 ? <div className="mt-4 rounded-2xl border border-dashed border-white/10 px-6 py-14 text-center text-sm text-white/38">Keine Apps für diesen Filter gefunden.</div> : null}
                  {activePage === "overview" ? <OverviewCards /> : null}
                </>
              ) : null}

              {activePage === "updates" ? <UpdatePanel apps={apps} checking={checking} lastChecked={lastChecked} onCheckUpdates={() => void checkUpdates()} onOpenReleaseNotes={() => setReleaseNotesOpen(true)} /> : null}
              {activePage === "downloads" ? <DownloadManager tasks={tasks} /> : null}
              {activePage === "settings" ? (
                <SettingsPanel
                  settings={settings}
                  launcherVersion={launcherVersion}
                  launcherUpdateStatus={launcherUpdateStatus}
                  onChange={setSettings}
                  onCheckLauncherUpdates={() => void checkLauncherUpdates()}
                  onToast={showToast}
                />
              ) : null}
              {activePage === "support" ? <SupportView /> : null}
            </>
          )}
          </div>
        </main>
      </div>

      {toast ? <div className="fixed bottom-5 right-5 z-[80] flex max-w-sm items-center gap-3 rounded-2xl border border-white/12 bg-[#171719] px-4 py-3 text-sm shadow-2xl"><CheckCircle2 size={17} /><span>{toast}</span><button className="ml-2 text-white/40 hover:text-white" onClick={() => setToast(null)}><X size={15} /></button></div> : null}
      <LauncherUpdatePrompt />
      {releaseNotesOpen ? <ReleaseNotesModal apps={apps} onClose={() => setReleaseNotesOpen(false)} /> : null}
    </div>
  );
}

function AccountMenu({
  open,
  onToggle,
  onNavigate
}: {
  open: boolean;
  onToggle: () => void;
  onNavigate: (page: NavigationId) => void;
}) {
  return (
    <div className="absolute right-5 top-6 z-30 sm:right-7 lg:right-8">
      <button
        className="flex h-10 items-center gap-2 rounded-xl px-2 text-left transition-all duration-200 hover:bg-white/[0.055]"
        onClick={onToggle}
        aria-expanded={open}
        aria-label="Account-Menü öffnen"
      >
        <span className="grid h-8 w-8 place-items-center rounded-full border border-white/14 bg-white/[0.07] text-xs font-medium">AM</span>
        <ChevronDown size={14} className={`text-white/42 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <div className="account-menu-enter absolute right-0 mt-2 w-64 origin-top-right overflow-hidden rounded-2xl border border-white/[0.09] bg-[#151517] shadow-2xl">
          <div className="border-b border-white/[0.07] px-4 py-4">
            <p className="text-sm font-medium">Alex Müller</p>
            <p className="mt-1 text-xs text-white/38">alex@lunasuite.de</p>
          </div>
          <div className="p-2">
            <AccountAction icon={Settings} label="Einstellungen" onClick={() => onNavigate("settings")} />
            <AccountAction icon={HelpCircle} label="Hilfe & Support" onClick={() => onNavigate("support")} />
            <AccountAction icon={LogOut} label="Abmelden" muted onClick={() => {}} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function AccountAction({
  icon: Icon,
  label,
  muted = false,
  onClick
}: {
  icon: typeof Settings;
  label: string;
  muted?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`flex h-10 w-full items-center gap-3 rounded-xl px-3 text-sm transition hover:bg-white/[0.06] ${
        muted ? "text-white/35" : "text-white/70 hover:text-white"
      }`}
      onClick={onClick}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}

function OverviewCards() {
  const versions = updateHistory.slice(0, 3);
  return (
    <div className="mt-8 grid gap-4 lg:grid-cols-2">
      <section className="overview-card-enter rounded-[22px] border border-white/[0.09] bg-[#111113] p-6 shadow-card">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-black"><Sparkles size={18} /></span>
          <div>
            <h2 className="font-semibold">Neue Features</h2>
            <p className="mt-1 text-xs text-white/38">Neu im LunaSuite Launcher</p>
          </div>
        </div>
        <div className="mt-6 space-y-4 text-sm">
          <Feature title="In-App-Updates" text="Launcher-Aktualisierungen werden direkt in den Einstellungen verwaltet." />
          <Feature title="Zentrale App-Verwaltung" text="Installationen, Updates und Versionen bleiben an einem Ort." />
          <Feature title="Reduzierte Übersicht" text="Mehr Fokus auf deine Apps und relevante Informationen." />
        </div>
      </section>

      <section className="overview-card-enter overflow-hidden rounded-[22px] border border-white/[0.09] bg-[#111113] shadow-card">
        <div className="p-6">
          <h2 className="font-semibold">Versionen</h2>
          <p className="mt-1 text-xs text-white/38">Zuletzt veröffentlichte Versionen</p>
        </div>
        <div>
          {versions.map((entry) => (
            <div key={entry.version} className="flex items-center justify-between gap-5 border-t border-white/[0.06] px-6 py-4">
              <div className="min-w-0">
                <p className="text-sm font-medium">{entry.version}</p>
                <p className="mt-1 truncate text-xs text-white/38">{entry.note}</p>
              </div>
              <span className="shrink-0 text-xs text-white/32">{entry.date}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Feature({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex gap-3">
      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
      <div>
        <p className="font-medium">{title}</p>
        <p className="mt-1 leading-5 text-white/40">{text}</p>
      </div>
    </div>
  );
}

function SupportView() {
  return <div className="grid gap-5 md:grid-cols-3">{[[Info, "Erste Schritte", "Launcher einrichten und Apps installieren."], [FileText, "Dokumentation", "Antworten zu Updates, Versionen und Konten."], [ExternalLink, "Support kontaktieren", "Direkte Hilfe durch das LunaSuite Team."]].map(([Icon, title, text]) => { const SupportIcon = Icon as typeof Info; return <button key={title as string} className="rounded-[20px] border border-white/[0.09] bg-[#111113] p-6 text-left transition hover:border-white/[0.16] hover:bg-[#141416]"><SupportIcon size={22} /><h2 className="mt-8 font-semibold">{title as string}</h2><p className="mt-2 text-sm leading-6 text-white/42">{text as string}</p></button>; })}</div>;
}

function ReleaseNotesModal({ apps, onClose }: { apps: LauncherApp[]; onClose: () => void }) {
  return <div className="fixed inset-0 z-[70] grid place-items-center bg-black/75 p-4 backdrop-blur-sm" onMouseDown={onClose}><div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto" onMouseDown={(event) => event.stopPropagation()}><ReleaseNotesPanel apps={apps} onClose={onClose} /></div></div>;
}
