import { app } from "electron";
import updaterPackage from "electron-updater";

const { autoUpdater } = updaterPackage;
const STARTUP_CHECK_DELAY_MS = 6_000;

export function setupLauncherUpdater({ emit }) {
  if (!app.isPackaged) {
    return {
      checkForUpdates: async () => ({ skipped: true, reason: "development" }),
      downloadUpdate: async () => ({ skipped: true, reason: "development" }),
      scheduleStartupCheck: () => {}
    };
  }

  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = false;
  autoUpdater.allowDowngrade = false;

  let updateAvailable = false;
  let availableVersion = "";

  autoUpdater.on("checking-for-update", () => emit({ status: "checking" }));
  autoUpdater.on("update-available", (info) => {
    updateAvailable = true;
    availableVersion = info.version;
    emit({ status: "available", version: info.version, releaseNotes: info.releaseNotes });
  });
  autoUpdater.on("update-not-available", (info) => {
    updateAvailable = false;
    availableVersion = "";
    emit({ status: "not-available", version: info.version });
  });
  autoUpdater.on("download-progress", (progress) => {
    emit({
      status: "downloading",
      version: availableVersion,
      percent: progress.percent,
      transferred: progress.transferred,
      total: progress.total,
      bytesPerSecond: progress.bytesPerSecond
    });
  });
  autoUpdater.on("update-downloaded", (info) => {
    emit({ status: "downloaded", version: info.version });
    setTimeout(() => autoUpdater.quitAndInstall(true, true), 1_200);
  });
  autoUpdater.on("error", (error) => {
    emit({ status: "error", message: error?.message || String(error) });
  });

  async function checkForUpdates() {
    return autoUpdater.checkForUpdates();
  }

  async function downloadUpdate() {
    if (!updateAvailable) throw new Error("Es ist kein Launcher-Update verfügbar.");
    return autoUpdater.downloadUpdate();
  }

  function scheduleStartupCheck() {
    setTimeout(() => {
      checkForUpdates().catch((error) => {
        emit({ status: "error", message: error?.message || String(error) });
      });
    }, STARTUP_CHECK_DELAY_MS);
  }

  return { checkForUpdates, downloadUpdate, scheduleStartupCheck };
}
