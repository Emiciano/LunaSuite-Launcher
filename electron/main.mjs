import { app, BrowserWindow, ipcMain, shell } from "electron";
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { setupLauncherUpdater } from "./updater.mjs";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentDirectory, "..");
const execFileAsync = promisify(execFile);
let launcherUpdater;

function emitLauncherUpdate(status) {
  for (const window of BrowserWindow.getAllWindows()) {
    if (!window.isDestroyed()) window.webContents.send("lunasuite:launcher-update-status", status);
  }
}

function normalizeVersion(version) {
  const parts = String(version || "").trim().replace(/^v/i, "").split(".");
  while (parts.length > 3 && parts.at(-1) === "0") parts.pop();
  return parts.join(".");
}

function compareVersions(left, right) {
  const a = normalizeVersion(left).split(".").map((part) => Number.parseInt(part, 10) || 0);
  const b = normalizeVersion(right).split(".").map((part) => Number.parseInt(part, 10) || 0);
  const length = Math.max(a.length, b.length);
  for (let index = 0; index < length; index += 1) {
    const difference = (a[index] || 0) - (b[index] || 0);
    if (difference !== 0) return difference;
  }
  return 0;
}

function getLunaMailExecutableCandidates() {
  return [
    path.join(process.env.LOCALAPPDATA || "", "Programs", "LunaMail", "LunaMail.exe"),
    path.join(process.env.PROGRAMFILES || "", "LunaMail", "LunaMail.exe"),
    path.join(process.env["PROGRAMFILES(X86)"] || "", "LunaMail", "LunaMail.exe")
  ].filter((candidate) => candidate && existsSync(candidate));
}

async function findInstalledLunaMailVersion() {
  if (process.platform !== "win32") return null;
  const roots = [
    "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall",
    "HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall",
    "HKLM\\Software\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall"
  ];

  for (const root of roots) {
    try {
      const { stdout } = await execFileAsync("reg.exe", ["query", root, "/s", "/f", "LunaMail", "/d"], {
        windowsHide: true,
        maxBuffer: 4 * 1024 * 1024
      });
      const sections = stdout.split(/\r?\n\r?\n/);
      for (const section of sections) {
        if (!/DisplayName\s+REG_SZ\s+LunaMail/i.test(section)) continue;
        const version = section.match(/DisplayVersion\s+REG_SZ\s+([^\r\n]+)/i)?.[1]?.trim();
        if (version) return normalizeVersion(version);
      }
    } catch {
      // The registry root may not exist or may require permissions.
    }
  }

  const candidates = getLunaMailExecutableCandidates();

  for (const executable of candidates) {
    try {
      const command = `(Get-Item -LiteralPath '${executable.replaceAll("'", "''")}').VersionInfo.ProductVersion`;
      const { stdout } = await execFileAsync(
        "powershell.exe",
        ["-NoProfile", "-NonInteractive", "-Command", command],
        { windowsHide: true }
      );
      const version = normalizeVersion(stdout);
      if (version) return version;
    } catch {
      // Continue with the next known installation path.
    }
  }
  return null;
}

async function launchInstalledApp(appId) {
  if (appId !== "lunamail") throw new Error("Diese App kann noch nicht gestartet werden.");
  const executable = getLunaMailExecutableCandidates()[0];
  if (!executable) throw new Error("LunaMail wurde nicht gefunden. Bitte installiere die App zuerst.");
  const errorMessage = await shell.openPath(executable);
  if (errorMessage) throw new Error(errorMessage);
  return { launched: true, executable };
}

async function getLunaMailStatus() {
  const installedVersion = await findInstalledLunaMailVersion();
  const response = await fetch("https://api.github.com/repos/Emiciano/LunaMail/releases/latest", {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "LunaSuite-Launcher"
    }
  });
  if (!response.ok) throw new Error(`GitHub antwortet mit ${response.status}.`);
  const release = await response.json();
  const latestVersion = normalizeVersion(release.tag_name || release.name);
  const installer = Array.isArray(release.assets)
    ? release.assets.find((asset) => String(asset.name).toLowerCase().endsWith(".exe"))
    : null;

  return {
    installed: Boolean(installedVersion),
    installedVersion,
    latestVersion,
    updateAvailable: Boolean(installedVersion) && compareVersions(latestVersion, installedVersion) > 0,
    downloadUrl: installer?.browser_download_url || release.html_url,
    releaseUrl: release.html_url,
    releaseNotes: typeof release.body === "string" ? release.body : "",
    publishedAt: release.published_at || null
  };
}

function createWindow() {
  const window = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 920,
    minHeight: 640,
    backgroundColor: "#050505",
    autoHideMenuBar: true,
    show: false,
    icon: path.join(projectRoot, "assets", "icon.ico"),
    webPreferences: {
      preload: path.join(currentDirectory, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  window.once("ready-to-show", () => window.show());
  window.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https://") || url.startsWith("http://")) {
      void shell.openExternal(url);
    }
    return { action: "deny" };
  });
  window.webContents.on("will-navigate", (event, url) => {
    if (url !== window.webContents.getURL()) {
      event.preventDefault();
      void shell.openExternal(url);
    }
  });

  void window.loadFile(path.join(projectRoot, "dist", "index.html"));
}

app.whenReady().then(() => {
  launcherUpdater = setupLauncherUpdater({ emit: emitLauncherUpdate });
  ipcMain.handle("lunasuite:get-app-status", async (_event, appId) => {
    if (appId !== "lunamail") return null;
    return getLunaMailStatus();
  });
  ipcMain.handle("lunasuite:open-external", async (_event, url) => {
    if (typeof url === "string" && /^https?:\/\//i.test(url)) {
      await shell.openExternal(url);
    }
  });
  ipcMain.handle("lunasuite:launch-app", async (_event, appId) => launchInstalledApp(appId));
  ipcMain.handle("lunasuite:check-launcher-updates", () => launcherUpdater.checkForUpdates());
  ipcMain.handle("lunasuite:download-launcher-update", () => launcherUpdater.downloadUpdate());
  ipcMain.handle("lunasuite:get-launcher-version", () => app.getVersion());
  createWindow();
  launcherUpdater.scheduleStartupCheck();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
