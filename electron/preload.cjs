const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("lunaSuite", {
  platform: process.platform,
  version: process.versions.electron,
  getAppStatus: (appId) => ipcRenderer.invoke("lunasuite:get-app-status", appId),
  launchApp: (appId) => ipcRenderer.invoke("lunasuite:launch-app", appId),
  openExternal: (url) => ipcRenderer.invoke("lunasuite:open-external", url),
  checkLauncherUpdates: () => ipcRenderer.invoke("lunasuite:check-launcher-updates"),
  downloadLauncherUpdate: () => ipcRenderer.invoke("lunasuite:download-launcher-update"),
  getLauncherVersion: () => ipcRenderer.invoke("lunasuite:get-launcher-version"),
  onLauncherUpdateStatus: (callback) => {
    const listener = (_event, status) => callback(status);
    ipcRenderer.on("lunasuite:launcher-update-status", listener);
    return () => ipcRenderer.removeListener("lunasuite:launcher-update-status", listener);
  }
});
