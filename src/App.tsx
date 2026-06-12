import { CheckCircle2, Download, ExternalLink, FileText, HardDrive, Info, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { AppCard } from "./components/AppCard";
import { Header } from "./components/Header";
import { LauncherButton } from "./components/LauncherButton";
import { SettingsPanel, type LauncherSettings } from "./components/SettingsPanel";
import { Sidebar, type NavigationId } from "./components/Sidebar";
import { UpdatePanel } from "./components/UpdatePanel";
import { launcherApps, updateHistory, type LauncherApp } from "./data/apps";

type Filter = "all" | "installed" | "updates" | "coming-soon";

const pageCopy: Record<NavigationId, { title: string; subtitle: string }> = {
  overview: {
    title: "LunaSuite Launcher",
    subtitle: "Installiere, starte und aktualisiere deine LunaSuite Apps an einem Ort."
  },
  apps: {
    title: "Meine Apps",
    subtitle: "Alle verfügbaren und kommenden LunaSuite Apps in einer Übersicht."
  },
  updates: {
    title: "Updates",
    subtitle: "Verwalte Versionen, Release Notes und automatische Aktualisierungen zentral."
  },
  downloads: {
    title: "Downloads",
    subtitle: "Behalte laufende und abgeschlossene Installationen im Blick."
  },
  settings: {
    title: "Einstellungen",
    subtitle: "Passe Update-Verhalten, Speicherort und Launcher-Optionen an."
  },
  support: {
    title: "Hilfe & Support",
    subtitle: "Antworten, Systeminformationen und direkte Hilfe für LunaSuite."
  }
};

export default function App() {
  const [activePage, setActivePage] = useState<NavigationId>("overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [checking, setChecking] = useState(false);
  const [downloads, setDownloads] = useState<Record<string, number>>({});
  const [toast, setToast] = useState<string | null>(null);
  const [releaseNotesOpen, setReleaseNotesOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<LauncherApp | null>(null);
  const [settings, setSettings] = useState<LauncherSettings>({
    automaticUpdates: true,
    launchOnStartup: false,
    notifications: true,
    downloadFolder: "C:\\Users\\Alex\\Downloads\\LunaSuite",
    releaseChannel: "stable",
    language: "Deutsch"
  });
  const toastTimer = useRef<number | null>(null);

  const filteredApps = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return launcherApps.filter((app) => {
      const matchesQuery = !normalized || `${app.name} ${app.description}`.toLowerCase().includes(normalized);
      const matchesFilter =
        filter === "all"
        || (filter === "installed" && app.installed)
        || (filter === "updates" && app.updateAvailable)
        || (filter === "coming-soon" && app.comingSoon);
      return matchesQuery && matchesFilter;
    });
  }, [filter, query]);

  function showToast(message: string) {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 3200);
  }

  function checkUpdates() {
    setChecking(true);
    window.setTimeout(() => {
      setChecking(false);
      showToast("LunaMail v1.0.1 ist verfügbar.");
    }, 1100);
  }

  function runDownload(app: LauncherApp) {
    setDownloads((current) => ({ ...current, [app.id]: 4 }));
    showToast(`${app.name}: Download gestartet`);
    let progress = 4;
    const interval = window.setInterval(() => {
      progress = Math.min(progress + Math.floor(Math.random() * 16) + 7, 100);
      setDownloads((current) => ({ ...current, [app.id]: progress }));
      if (progress >= 100) {
        window.clearInterval(interval);
        showToast(`${app.name} wurde heruntergeladen und geprüft.`);
      }
    }, 350);
  }

  function handleAppAction(app: LauncherApp, action: "download" | "launch" | "update" | "details") {
    if (action === "details") {
      setSelectedApp(app);
      return;
    }
    if (action === "launch") {
      showToast(`${app.name} wird gestartet.`);
      return;
    }
    runDownload(app);
  }

  const copy = pageCopy[activePage];
  const showAppGrid = activePage === "overview" || activePage === "apps";

  return (
    <div className="min-h-screen bg-[#050505] p-0 text-white lg:p-3">
      <div className="mx-auto flex min-h-screen max-w-[1660px] overflow-hidden border-white/[0.09] bg-[#0b0b0c] shadow-panel lg:min-h-[calc(100vh-24px)] lg:rounded-[24px] lg:border">
        <Sidebar active={activePage} open={menuOpen} onNavigate={setActivePage} onClose={() => setMenuOpen(false)} />

        <main className="min-w-0 flex-1 overflow-x-hidden px-5 py-6 sm:px-8 lg:px-11 lg:py-10 xl:px-12">
          <Header
            title={copy.title}
            subtitle={copy.subtitle}
            query={query}
            showSearch={showAppGrid}
            checking={checking}
            onQueryChange={setQuery}
            onCheckUpdates={checkUpdates}
            onOpenMenu={() => setMenuOpen(true)}
          />

          {showAppGrid ? (
            <>
              <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-semibold tracking-[-0.025em]">{activePage === "overview" ? "Deine Apps" : "App-Bibliothek"}</h2>
                <div className="scrollbar-hidden flex gap-1 overflow-x-auto rounded-xl border border-white/[0.08] bg-white/[0.025] p-1">
                  {([
                    ["all", "Alle"],
                    ["installed", "Installiert"],
                    ["updates", "Updates"],
                    ["coming-soon", "Coming Soon"]
                  ] as const).map(([id, label]) => (
                    <button
                      key={id}
                      className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs transition ${filter === id ? "bg-white text-black" : "text-white/45 hover:bg-white/[0.05] hover:text-white"}`}
                      onClick={() => setFilter(id)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
                {filteredApps.map((app) => (
                  <AppCard key={app.id} app={app} progress={downloads[app.id]} onAction={handleAppAction} />
                ))}
              </div>

              {filteredApps.length === 0 ? (
                <div className="mt-4 rounded-2xl border border-dashed border-white/10 px-6 py-14 text-center text-sm text-white/38">
                  Keine Apps für diesen Filter gefunden.
                </div>
              ) : null}

              <div className="mt-8">
                <UpdatePanel checking={checking} onCheckUpdates={checkUpdates} onOpenReleaseNotes={() => setReleaseNotesOpen(true)} />
              </div>
            </>
          ) : null}

          {activePage === "updates" ? (
            <UpdatePanel checking={checking} onCheckUpdates={checkUpdates} onOpenReleaseNotes={() => setReleaseNotesOpen(true)} />
          ) : null}

          {activePage === "downloads" ? <DownloadsView downloads={downloads} onToast={showToast} /> : null}
          {activePage === "settings" ? <SettingsPanel settings={settings} onChange={setSettings} onToast={showToast} /> : null}
          {activePage === "support" ? <SupportView /> : null}
        </main>
      </div>

      {toast ? (
        <div className="fixed bottom-5 right-5 z-[80] flex max-w-sm items-center gap-3 rounded-2xl border border-white/12 bg-[#171719] px-4 py-3 text-sm shadow-2xl">
          <CheckCircle2 size={17} />
          <span>{toast}</span>
          <button className="ml-2 text-white/40 hover:text-white" onClick={() => setToast(null)}><X size={15} /></button>
        </div>
      ) : null}

      {releaseNotesOpen ? <ReleaseNotesModal onClose={() => setReleaseNotesOpen(false)} /> : null}
      {selectedApp ? <AppDetailsModal app={selectedApp} onClose={() => setSelectedApp(null)} onAction={() => runDownload(selectedApp)} /> : null}
    </div>
  );
}

function DownloadsView({ downloads, onToast }: { downloads: Record<string, number>; onToast: (message: string) => void }) {
  const activeDownloads = Object.entries(downloads);
  return (
    <section className="rounded-[22px] border border-white/[0.09] bg-[#111113] shadow-card">
      <div className="border-b border-white/[0.07] p-6">
        <h2 className="text-lg font-semibold">Installationen</h2>
        <p className="mt-1 text-sm text-white/40">Aktuelle Downloads und installierte Versionen.</p>
      </div>
      {activeDownloads.length ? activeDownloads.map(([id, progress]) => {
        const app = launcherApps.find((item) => item.id === id)!;
        return (
          <div key={id} className="flex flex-col gap-4 border-b border-white/[0.06] p-6 last:border-0 sm:flex-row sm:items-center">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/[0.05]"><app.icon size={20} /></span>
            <div className="min-w-0 flex-1">
              <div className="flex justify-between gap-4 text-sm"><span className="font-medium">{app.name}</span><span className="text-white/42">{progress}%</span></div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.07]"><div className="h-full bg-white" style={{ width: `${progress}%` }} /></div>
            </div>
            <LauncherButton variant="ghost" onClick={() => onToast(`Speicherort: ${app.name}`)} icon={<HardDrive size={15} />}>Speicherort</LauncherButton>
          </div>
        );
      }) : (
        <div className="p-12 text-center">
          <Download size={24} className="mx-auto text-white/25" />
          <p className="mt-4 text-sm text-white/42">Noch keine Downloads in dieser Sitzung.</p>
        </div>
      )}
    </section>
  );
}

function SupportView() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {[
        [Info, "Erste Schritte", "Launcher einrichten und Apps installieren."],
        [FileText, "Dokumentation", "Antworten zu Updates, Versionen und Konten."],
        [ExternalLink, "Support kontaktieren", "Direkte Hilfe durch das LunaSuite Team."]
      ].map(([Icon, title, text]) => {
        const SupportIcon = Icon as typeof Info;
        return (
          <button key={title as string} className="rounded-[20px] border border-white/[0.09] bg-[#111113] p-6 text-left transition hover:border-white/[0.16] hover:bg-[#141416]">
            <SupportIcon size={22} />
            <h2 className="mt-8 font-semibold">{title as string}</h2>
            <p className="mt-2 text-sm leading-6 text-white/42">{text as string}</p>
          </button>
        );
      })}
    </div>
  );
}

function ReleaseNotesModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="Update-Verlauf" onClose={onClose}>
      <div className="space-y-1">
        {updateHistory.map((item) => (
          <div key={item.version} className="flex gap-4 border-b border-white/[0.07] py-4 last:border-0">
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-white" />
            <div className="min-w-0 flex-1">
              <div className="flex justify-between gap-4"><h3 className="font-medium">{item.version}</h3><span className="text-xs text-white/32">{item.date}</span></div>
              <p className="mt-1 text-sm text-white/42">{item.note}</p>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

function AppDetailsModal({ app, onClose, onAction }: { app: LauncherApp; onClose: () => void; onAction: () => void }) {
  const Icon = app.icon;
  return (
    <Modal title={app.name} onClose={onClose}>
      <div className="flex gap-4">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.05]"><Icon size={26} /></span>
        <div><p className="text-sm leading-6 text-white/48">{app.description}</p><p className="mt-2 text-xs text-white/30">{app.version} · {app.releaseChannel}</p></div>
      </div>
      <div className="mt-6 grid gap-2 text-sm">
        <Detail label="Repository" value={app.repositoryUrl} />
        <Detail label="Installiert" value={app.installed ? "Ja" : "Nein"} />
        <Detail label="Letzte Aktualisierung" value={app.lastUpdated ?? "Noch nicht verfügbar"} />
      </div>
      {!app.comingSoon ? <LauncherButton className="mt-6 w-full" variant="primary" onClick={onAction}>{app.updateAvailable ? "Update herunterladen" : "Download starten"}</LauncherButton> : null}
    </Modal>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-4 border-b border-white/[0.06] py-3"><span className="text-white/38">{label}</span><span className="max-w-[65%] truncate text-right text-white/70">{value}</span></div>;
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/75 p-4 backdrop-blur-sm" onMouseDown={onClose}>
      <div className="w-full max-w-lg rounded-[22px] border border-white/12 bg-[#111113] p-6 shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-semibold tracking-[-0.03em]">{title}</h2><button className="grid h-9 w-9 place-items-center rounded-xl text-white/45 hover:bg-white/[0.06] hover:text-white" onClick={onClose}><X size={18} /></button></div>
        {children}
      </div>
    </div>
  );
}
