import type { LauncherApp } from "../data/appRegistry";
import type { InstallationTask } from "./installService";

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
  const task: InstallationTask = {
    id: `update-${app.id}-${Date.now()}`,
    appId: app.id,
    appName: app.name,
    state: "queued",
    progress: 0,
    message: "Update zur Warteschlange hinzugefügt",
    createdAt: new Date().toISOString()
  };
  onProgress?.(task);
  for (const progress of [22, 48, 76, 100]) {
    await new Promise((resolve) => window.setTimeout(resolve, 320));
    task.state = progress === 100 ? "downloaded" : "downloading";
    task.progress = progress;
    task.message = progress === 100 ? "Update heruntergeladen" : "Update wird heruntergeladen";
    onProgress?.({ ...task });
  }
  return task;
}

export async function installUpdate(task: InstallationTask, onProgress?: (task: InstallationTask) => void) {
  const installing = { ...task, state: "installing" as const, message: "Update wird installiert" };
  onProgress?.(installing);
  await new Promise((resolve) => window.setTimeout(resolve, 600));
  const installed = { ...installing, state: "installed" as const, message: "Update installiert" };
  onProgress?.(installed);
  return installed;
}

export async function getReleaseNotes(app: LauncherApp) {
  return app.releaseNotes;
}
