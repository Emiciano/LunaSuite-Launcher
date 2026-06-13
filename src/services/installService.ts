import type { LauncherApp } from "../data/appRegistry";

export type InstallationState = "queued" | "downloading" | "downloaded" | "installing" | "installed" | "failed";

export type InstallationTask = {
  id: string;
  appId: string;
  appName: string;
  state: InstallationState;
  progress: number;
  message: string;
  createdAt: string;
};

const STORAGE_KEY = "lunasuite.installed-apps";

function readInstalledApps(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

function writeInstalledApps(appIds: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...new Set(appIds)]));
}

export async function installApp(app: LauncherApp, onProgress?: (task: InstallationTask) => void) {
  const task: InstallationTask = {
    id: `${app.id}-${Date.now()}`,
    appId: app.id,
    appName: app.name,
    state: "queued",
    progress: 0,
    message: "Zur Warteschlange hinzugefügt",
    createdAt: new Date().toISOString()
  };
  onProgress?.(task);

  for (const step of [
    { state: "downloading" as const, progress: 28, message: "Download läuft" },
    { state: "downloaded" as const, progress: 100, message: "Download abgeschlossen" },
    { state: "installing" as const, progress: 100, message: "Installation läuft" },
    { state: "installed" as const, progress: 100, message: "Installation abgeschlossen" }
  ]) {
    await new Promise((resolve) => window.setTimeout(resolve, 450));
    Object.assign(task, step);
    onProgress?.({ ...task });
  }

  writeInstalledApps([...readInstalledApps(), app.id]);
  return task;
}

export async function uninstallApp(appId: string) {
  writeInstalledApps(readInstalledApps().filter((id) => id !== appId));
  return { appId, success: true };
}

export async function repairApp(app: LauncherApp, onProgress?: (task: InstallationTask) => void) {
  return installApp(app, onProgress);
}

export async function getInstalledApps() {
  return readInstalledApps();
}
