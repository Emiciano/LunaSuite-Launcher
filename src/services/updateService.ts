import type { LauncherApp } from "../data/appRegistry";
import { installApp, type InstallationTask } from "./installService";

export type UpdateCheckResult = {
  appId: string;
  installed: boolean;
  installedVersion: string;
  latestVersion: string;
  updateAvailable: boolean;
  downloadUrl: string | null;
  releaseNotes: string;
  publishedAt: string | null;
};

export async function checkForUpdates(apps: LauncherApp[]): Promise<UpdateCheckResult[]> {
  return Promise.all(apps.filter((app) => !app.comingSoon).map(async (app) => {
    const desktopStatus = await window.lunaSuite?.getAppStatus(app.id);
    if (desktopStatus) {
      return {
        appId: app.id,
        installed: desktopStatus.installed,
        installedVersion: desktopStatus.installedVersion ?? "",
        latestVersion: desktopStatus.latestVersion,
        updateAvailable: desktopStatus.updateAvailable,
        downloadUrl: desktopStatus.downloadUrl,
        releaseNotes: desktopStatus.releaseNotes || app.releaseNotes,
        publishedAt: desktopStatus.publishedAt
      };
    }
    return {
      appId: app.id,
      installed: app.installed,
      installedVersion: app.version,
      latestVersion: app.latestVersion,
      updateAvailable: app.updateAvailable,
      downloadUrl: app.downloadUrl,
      releaseNotes: app.releaseNotes,
      publishedAt: null
    };
  }));
}

export async function downloadUpdate(app: LauncherApp, onProgress?: (task: InstallationTask) => void) {
  return installApp(app, onProgress);
}

export async function installUpdate(task: InstallationTask, onProgress?: (task: InstallationTask) => void) {
  const installed = { ...task, state: "installed" as const, progress: 100, message: "Update installiert" };
  onProgress?.(installed);
  return installed;
}

export async function getReleaseNotes(app: LauncherApp) {
  return app.releaseNotes;
}
