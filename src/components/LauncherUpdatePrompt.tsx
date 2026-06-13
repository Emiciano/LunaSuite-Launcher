import { Download, RefreshCw, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function LauncherUpdatePrompt() {
  const [status, setStatus] = useState<LauncherUpdateStatus | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!window.lunaSuite) return;
    return window.lunaSuite.onLauncherUpdateStatus((nextStatus) => {
      setStatus(nextStatus);
      if (nextStatus.status === "available") setVisible(true);
      if (nextStatus.status === "error") setVisible(false);
    });
  }, []);

  if (!visible || !status || !["available", "downloading", "downloaded"].includes(status.status)) return null;

  const version = "version" in status ? status.version : "";
  const downloading = status.status === "downloading";
  const downloaded = status.status === "downloaded";

  async function installUpdate() {
    try {
      await window.lunaSuite?.downloadLauncherUpdate();
    } catch {
      setVisible(false);
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/75 p-5 backdrop-blur-sm">
      <section className="w-full max-w-md rounded-[22px] border border-white/[0.1] bg-[#111113] p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.05]">
            <RefreshCw size={20} className={downloading ? "animate-spin" : ""} />
          </span>
          {!downloading && !downloaded ? (
            <button className="grid h-9 w-9 place-items-center rounded-xl text-white/40 hover:bg-white/[0.06] hover:text-white" onClick={() => setVisible(false)}>
              <X size={18} />
            </button>
          ) : null}
        </div>

        <h2 className="mt-5 text-xl font-semibold tracking-[-0.03em]">
          {downloaded ? "Update wird installiert" : downloading ? "Launcher wird aktualisiert" : "Launcher-Update verfügbar"}
        </h2>
        <p className="mt-2 text-sm leading-6 text-white/48">
          {downloaded
            ? `Version ${version} wurde heruntergeladen. Der Launcher startet gleich neu.`
            : downloading
              ? `Version ${version} wird im Hintergrund heruntergeladen.`
              : `LunaSuite Launcher ${version} ist verfügbar. Möchtest du das Update jetzt installieren?`}
        </p>

        {downloading ? (
          <div className="mt-5">
            <div className="mb-2 flex justify-between text-xs text-white/38"><span>Download</span><span>{Math.round(status.percent)}%</span></div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
              <div className="h-full rounded-full bg-white transition-all duration-300" style={{ width: `${Math.min(100, Math.max(0, status.percent))}%` }} />
            </div>
          </div>
        ) : null}

        {!downloading && !downloaded ? (
          <div className="mt-7 flex justify-end gap-2">
            <button className="rounded-xl px-4 py-2 text-sm text-white/48 hover:bg-white/[0.05] hover:text-white" onClick={() => setVisible(false)}>Später</button>
            <button className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90" onClick={() => void installUpdate()}>
              <Download size={15} />
              Update installieren
            </button>
          </div>
        ) : null}
      </section>
    </div>,
    document.body
  );
}
