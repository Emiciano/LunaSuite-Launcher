import { CheckCircle2, Download, ExternalLink, FileText, HardDrive, Info, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppCard } from "./components/AppCard";
import { AppPage } from "./components/AppPage";
import { Header } from "./components/Header";
import { LauncherButton } from "./components/LauncherButton";
import { SettingsPanel, type LauncherSettings } from "./components/SettingsPanel";
import { Sidebar, type NavigationId } from "./components/Sidebar";
import { UpdatePanel } from "./components/UpdatePanel";
import { launcherApps as initialApps, updateHistory, type LauncherApp } from "./data/apps";

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
  const [apps, setApps] = useState<LauncherApp[]>(initialApps);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [checking, setChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState("Noch nicht geprüft");
  const [downloads, setDownloads] = useState<Record<string, number>>({});
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
    void checkUpdates(false);
  }, []);

  function showToast(message: string) {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 3200);
  }

  async function checkUpdates(showResult = true) {
    setChecking(true);
    try {
      const status = await window.lunaSuite?.getAppStatus("lunamail");
      if (status) {
        setApps((current) => current.map((app) => app.id !== "lunamail" ? app : {
          ...app,
          installed: status.installed,
          installedVersion: status.installedVersion ?? undefined,
          version: `v${status.latestVersion}`,
          updateAvailable: status.updateAvailable,
          status: status.updateAvailable ? "update" : status.installed ? "installed" : "available",
          downloadUrl: status.downloadUrl,
          releaseNotes: status.releaseNotes,
          lastUpdated: status.publishedAt ? new Date(status.publishedAt).toLocaleDateString("de-DE") : app.lastUpdated
        }));
        if (showResult) {
          showToast(status.updateAvailable ? `LunaMail v${status.latestVersion} ist verfügbar.` : "Alle installierten Apps sind aktuell.");
        }
      } else if (showResult) {
        showToast("Versionsprüfung ist nur in der Desktop-App verfügbar.");
      }
    } catch (error) {
      if (showResult) showToast(`Versionsprüfung fehlgeschlagen: ${error instanceof Error ? error.message : "Unbekannter Fehler"}`);
    } finally {
      setChecking(false);
      setLastChecked("Gerade eben");
    }
  }

  function runDownload(app: LauncherApp) {
    if (app.downloadUrl && window.lunaSuite) {
      void window.lunaSuite.openExternal(app.downloadUrl);
      showToast(`${app.name}: Downloadseite geöffnet.`);
      return;
    }
    setDownloads((current) => ({ ...current, [app.id]: 4 }));
  }

  function handleAppAction(app: LauncherApp, action: "download" | "launch" | "update" | "details") {
    if (action === "details") {
      setActiveAppId(app.id);
      return;
    }
    if (action === "launch") {
      showToast(`${app.name} wird gestartet.`);
      return;
    }
    runDownload(app);
  }

  function navigate(page: NavigationId) {
    setActiveAppId(null);
    setActivePage(page);
  }

  const copy = pageCopy[activePage];
  const showAppGrid = !activeApp && (activePage === "overview" || activePage === "apps");

  return (
    <div className="h-screen overflow-hidden bg-[#050505] text-white lg:p-3">
      <div className="mx-auto flex h-full max-w-[1660px] overflow-hidden border-white/[0.09] bg-[#0b0b0c] shadow-panel lg:rounded-[24px] lg:border">
        <Sidebar
          active={activePage}
          activeAppId={activeAppId}
          open={menuOpen}
          onNavigate={navigate}
          onSelectApp={(appId) => setActiveAppId(appId)}
          onClose={() => setMenuOpen(false)}
        />

        <main className="content-scroll min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-5 py-6 sm:px-8 lg:px-11 lg:py-10 xl:px-12">
          {activeApp ? (
            <AppPage
              app={activeApp}
              checking={checking}
              progress={downloads[activeApp.id]}
              onBack={() => setActiveAppId(null)}
              onCheck={() => void checkUpdates()}
              onAction={handleAppAction}
              onOpenRepository={(url) => void window.lunaSuite?.openExternal(url)}
            />
          ) : (
            <>
              <Header
                title={copy.title}
                subtitle={copy.subtitle}
                query={query}
                showSearch={showAppGrid}
                checking={checking}
                onQueryChange={setQuery}
                onCheckUpdates={() => void checkUpdates()}
                onOpenMenu={() => setMenuOpen(true)}
              />

              {showAppGrid ? (
                <>
                  <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-lg font-semibold tracking-[-0.025em]">{activePage === "overview" ? "Deine Apps" : "App-Bibliothek"}</h2>
                    <div className="scrollbar-hidden flex gap-1 overflow-x-auto rounded-xl border border-white/[0.08] bg-white/[0.025] p-1">
                      {([["all", "Alle"], ["installed", "Installiert"], ["updates", "Updates"], ["coming-soon", "Coming Soon"]] as const).map(([id, label]) => (
                        <button key={id} className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs transition ${filter === id ? "bg-white text-black" : "text-white/45 hover:bg-white/[0.05] hover:text-white"}`} onClick={() => setFilter(id)}>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {filteredApps.map((app) => <AppCard key={app.id} app={app} progress={downloads[app.id]} onAction={handleAppAction} />)}
                  </div>
                  {filteredApps.length === 0 ? <div className="mt-4 rounded-2xl border border-dashed border-white/10 px-6 py-14 text-center text-sm text-white/38">Keine Apps für diesen Filter gefunden.</div> : null}
                  <div className="mt-8"><UpdatePanel apps={apps} checking={checking} lastChecked={lastChecked} onCheckUpdates={() => void checkUpdates()} onOpenReleaseNotes={() => setReleaseNotesOpen(true)} /></div>
                </>
              ) : null}

              {activePage === "updates" ? <UpdatePanel apps={apps} checking={checking} lastChecked={lastChecked} onCheckUpdates={() => void checkUpdates()} onOpenReleaseNotes={() => setReleaseNotesOpen(true)} /> : null}
              {activePage === "downloads" ? <DownloadsView apps={apps} downloads={downloads} onToast={showToast} /> : null}
              {activePage === "settings" ? <SettingsPanel settings={settings} onChange={setSettings} onToast={showToast} /> : null}
              {activePage === "support" ? <SupportView /> : null}
            </>
          )}
        </main>
      </div>

      {toast ? <div className="fixed bottom-5 right-5 z-[80] flex max-w-sm items-center gap-3 rounded-2xl border border-white/12 bg-[#171719] px-4 py-3 text-sm shadow-2xl"><CheckCircle2 size={17} /><span>{toast}</span><button className="ml-2 text-white/40 hover:text-white" onClick={() => setToast(null)}><X size={15} /></button></div> : null}
      {releaseNotesOpen ? <ReleaseNotesModal onClose={() => setReleaseNotesOpen(false)} /> : null}
    </div>
  );
}

function DownloadsView({ apps, downloads, onToast }: { apps: LauncherApp[]; downloads: Record<string, number>; onToast: (message: string) => void }) {
  const activeDownloads = Object.entries(downloads);
  return (
    <section className="rounded-[22px] border border-white/[0.09] bg-[#111113] shadow-card">
      <div className="border-b border-white/[0.07] p-6"><h2 className="text-lg font-semibold">Installationen</h2><p className="mt-1 text-sm text-white/40">Aktuelle Downloads und installierte Versionen.</p></div>
      {activeDownloads.length ? activeDownloads.map(([id, progress]) => {
        const app = apps.find((item) => item.id === id);
        if (!app) return null;
        return <div key={id} className="flex flex-col gap-4 border-b border-white/[0.06] p-6 last:border-0 sm:flex-row sm:items-center"><span className="grid h-11 w-11 place-items-center rounded-xl bg-white/[0.05]"><app.icon size={20} /></span><div className="min-w-0 flex-1"><div className="flex justify-between gap-4 text-sm"><span className="font-medium">{app.name}</span><span className="text-white/42">{progress}%</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.07]"><div className="h-full bg-white" style={{ width: `${progress}%` }} /></div></div><LauncherButton variant="ghost" onClick={() => onToast(`Speicherort: ${app.name}`)} icon={<HardDrive size={15} />}>Speicherort</LauncherButton></div>;
      }) : <div className="p-12 text-center"><Download size={24} className="mx-auto text-white/25" /><p className="mt-4 text-sm text-white/42">Noch keine Downloads in dieser Sitzung.</p></div>}
    </section>
  );
}

function SupportView() {
  return <div className="grid gap-5 md:grid-cols-3">{[[Info, "Erste Schritte", "Launcher einrichten und Apps installieren."], [FileText, "Dokumentation", "Antworten zu Updates, Versionen und Konten."], [ExternalLink, "Support kontaktieren", "Direkte Hilfe durch das LunaSuite Team."]].map(([Icon, title, text]) => { const SupportIcon = Icon as typeof Info; return <button key={title as string} className="rounded-[20px] border border-white/[0.09] bg-[#111113] p-6 text-left transition hover:border-white/[0.16] hover:bg-[#141416]"><SupportIcon size={22} /><h2 className="mt-8 font-semibold">{title as string}</h2><p className="mt-2 text-sm leading-6 text-white/42">{text as string}</p></button>; })}</div>;
}

function ReleaseNotesModal({ onClose }: { onClose: () => void }) {
  return <div className="fixed inset-0 z-[70] grid place-items-center bg-black/75 p-4 backdrop-blur-sm" onMouseDown={onClose}><div className="w-full max-w-lg rounded-[22px] border border-white/12 bg-[#111113] p-6 shadow-2xl" onMouseDown={(event) => event.stopPropagation()}><div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-semibold">Update-Verlauf</h2><button className="grid h-9 w-9 place-items-center rounded-xl text-white/45 hover:bg-white/[0.06] hover:text-white" onClick={onClose}><X size={18} /></button></div>{updateHistory.map((item) => <div key={item.version} className="flex gap-4 border-b border-white/[0.07] py-4 last:border-0"><span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-white" /><div className="min-w-0 flex-1"><div className="flex justify-between gap-4"><h3 className="font-medium">{item.version}</h3><span className="text-xs text-white/32">{item.date}</span></div><p className="mt-1 text-sm text-white/42">{item.note}</p></div></div>)}</div></div>;
}
