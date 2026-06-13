const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("lunaSuite", {
  platform: process.platform,
  version: process.versions.electron,
  getAppStatus: (appId) => ipcRenderer.invoke("lunasuite:get-app-status", appId),
  openExternal: (url) => ipcRenderer.invoke("lunasuite:open-external", url)
});
